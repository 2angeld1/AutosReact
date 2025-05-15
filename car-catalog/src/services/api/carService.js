import { carApiClient, CAR_API_URL, PLACEHOLDER_IMAGE_BASE } from './config';
import { cleanImageCache, isReliableImageUrl } from './cache';
import { getCarImageFromGoogle } from './imageService';
import { generateStableId, getGuaranteedImage } from './utils';
import { getDefaultCarImage } from './carBrands';

let carCache = {
  cars: [], // o el valor inicial que corresponda
  // otras propiedades si las hay
};

export const enhanceCarWithImage = async (car, index) => {
    if (!car) {
      console.error('Received undefined car in enhanceCarWithImage');
      return null;
    }
    
    // Definir las variables fuera para que estén disponibles también en el catch
    const make = car.make || 'unknown';
    const model = car.model || 'unknown';
    const year = car.year || new Date().getFullYear();
    
    try {
      // Generar un ID estable
      const id = generateStableId(car, index);
      
      // Obtener imagen con manejo de errores robusto
      let imageUrl;
      try {
        imageUrl = await getCarImageFromGoogle(make, model, year);
      } catch (imageError) {
        console.warn(`Error obteniendo imagen para ${make} ${model} ${year}:`, imageError);
        imageUrl = getGuaranteedImage(make, model);
      }
      
      // Generar precio si no existe
      let price = car.price;
      if (!price) {
        // Algoritmo para generar un precio basado en marca, año y clase
        let basePrice = 15000;
        
        // Ajustar por marca (las premium cuestan más)
        const premiumBrands = ['bmw', 'audi', 'mercedes', 'lexus', 'porsche', 'tesla'];
        if (premiumBrands.includes(make.toLowerCase())) {
          basePrice += 20000;
        }
        
        // Ajustar por año (más nuevo = más caro)
        const currentYear = new Date().getFullYear();
        basePrice += (year - 2000) * 1000;
        
        // Aplicar un descuento adicional basado en la antigüedad del vehículo
        const carAge = currentYear - year;
        if (carAge > 0) {
          basePrice -= carAge * 500; // Reducir $500 por cada año de antigüedad
        }
        
        // Ajustar por clase/tipo
        if (car.class) {
          if (car.class.toLowerCase().includes('luxury')) basePrice += 15000;
          if (car.class.toLowerCase().includes('sport')) basePrice += 10000;
          if (car.class.toLowerCase().includes('suv')) basePrice += 5000;
        }
        
        // Aplicar algo de variación aleatoria
        const variance = Math.floor(basePrice * 0.1 * (Math.random() - 0.5));
        price = Math.max(8000, basePrice + variance);
      }
      
      // Crear descripción para el auto
      const description = `${make} ${model} ${year} con motor ${car.fuel_type || 'estándar'}${car.cylinders ? ` de ${car.cylinders} cilindros` : ''}.`;
      
      // Devolver auto mejorado
      return {
        ...car,
        id,
        price,
        image: imageUrl,
        description
      };
    } catch (error) {
      console.error('Error enhancing car with image:', error);
      
      // En caso de error, devolver al menos un objeto válido con valores predeterminados
      return {
        ...car,
        id: generateStableId(car, index),
        price: car.price || Math.floor(Math.random() * 40000) + 10000,
        image: getGuaranteedImage(make, model), // Ahora make y model están disponibles aquí
        description: `${make} ${model} ${year}`.trim() // Usando las variables definidas al inicio
      };
    }
  };

// Función principal para obtener autos
export const fetchCars = async (limit = 20) => {
  try {
    // Limpieza programada del caché de imágenes para prevenir problemas (nueva mejora)
    setTimeout(() => {
      try {
        cleanImageCache(getDefaultCarImage);
      } catch (e) {
        console.error('Error durante limpieza del caché:', e);
      }
    }, 1000);
    
    // Primero intentar recuperar desde localStorage
    try {
      const cachedCars = localStorage.getItem('carCatalogCache');
      if (cachedCars) {
        const parsedCache = JSON.parse(cachedCars);
        if (Array.isArray(parsedCache) && parsedCache.length > 0) {
          console.log(`Usando caché local con ${parsedCache.length} autos`);
          carCache = parsedCache;
          return parsedCache;
        }
      }
    } catch (cacheError) {
      console.warn('Error reading from localStorage:', cacheError);
    }
    
    // Si el caché está disponible y tiene datos, usarlo
    if (carCache.length > 0) {
      return carCache;
    }
    
    // Parámetros para obtener autos diversos
    const searchParams = {
      limit: Math.min(limit, 50) // Limitar a máximo 50 por solicitud
    };
    
    // Estrategia para obtener autos diversos
    try {
      // Usar años específicos y marcas populares para asegurar resultados variados
      const topBrands = ['toyota', 'kia', 'ford', 'chevrolet', 'bmw', 'audi', 'mercedes', 'nissan'];
      const allCars = [];
      
      // Usar años recientes para asegurar que tengamos resultados
      const recentYears = [2020, 2021, 2022, 2023];
      
      // Obtenemos combinaciones de marcas y años para tener variedad
      for (const brand of topBrands) {
        for (const year of recentYears) {
          try {
            // Limitamos a una búsqueda con parámetros más precisos
            const brandResponse = await carApiClient.get(CAR_API_URL, { 
              params: { 
                make: brand,
                year: year
              } 
            });
            
            if (brandResponse.data && brandResponse.data.length > 0) {
              // Limitamos a máximo 2 autos por combinación de marca/año para tener variedad
              const carsToAdd = brandResponse.data.slice(0, 2);
              allCars.push(...carsToAdd);
              
              // Si ya tenemos suficientes autos, paramos
              if (allCars.length >= limit) break;
            }
          } catch (err) {
            console.error(`Error fetching ${brand} cars from ${year}:`, err);
            continue;
          }
        }
        
        // Si ya tenemos suficientes autos, paramos el bucle externo también
        if (allCars.length >= limit) break;
      }
      
      if (allCars.length > 0) {
        console.log(`Obtenidos ${allCars.length} autos desde la API con estrategia diversa`);
        
        // Mejorar cada carro con su imagen correspondiente
        const enhancedCarsPromises = allCars.map(enhanceCarWithImage);
        const enhancedCars = await Promise.all(enhancedCarsPromises);
        
        // Filtrar cualquier valor nulo que pueda haber resultado
        const validCars = enhancedCars.filter(car => car !== null);
        
        // Actualizar el caché
        carCache = validCars;
        
        // Guardar en localStorage
        try {
          localStorage.setItem('carCatalogCache', JSON.stringify(validCars));
        } catch (e) {
          console.warn('Error saving car cache to localStorage:', e);
        }
        
        // Filtra los Honda Insight Touring antes de devolver los resultados
        const filteredCars = validCars.filter(car => {
          // Excluir explícitamente Honda Insight Touring
          if (car.make.toLowerCase() === 'honda' && 
              car.model.toLowerCase() === 'insight' && 
              car.trim && car.trim.toLowerCase() === 'touring') {
            return false;
          }
          
          // También excluir cualquier Honda Insight (independientemente del trim)
          // para evitar casos donde el trim no esté especificado
          if (car.make.toLowerCase() === 'honda' && 
              car.model.toLowerCase() === 'insight') {
            return false;
          }
          
          return true;
        });
        
        return filteredCars;
      }
      
      // Si todo lo anterior falló, intentamos con algunos parámetros básicos
      searchParams.year = 2022;
      searchParams.make = 'toyota'; // Usamos una marca común
    } catch (strategyError) {
      console.error('Error en estrategia de diversidad:', strategyError);
      // Continuamos con la solicitud genérica a continuación
    }
    
    // Solicitud genérica si la estrategia de diversidad falla
    const response = await carApiClient.get(CAR_API_URL, { params: searchParams });
    
    // Si no encontramos resultados suficientes, intentamos con un año diferente
    if (!response.data || response.data.length < 5) {
      searchParams.year = 2021; // Probamos con otro año
      
      const fallbackResponse = await carApiClient.get(CAR_API_URL, { params: searchParams });
      
      if (fallbackResponse.data && fallbackResponse.data.length > 0) {
        // Mejorar cada carro con su imagen correspondiente
        const enhancedCarsPromises = fallbackResponse.data.map(enhanceCarWithImage);
        const enhancedCars = await Promise.all(enhancedCarsPromises);
        
        // Filtrar cualquier valor nulo
        const validCars = enhancedCars.filter(car => car !== null);
        
        // Actualizar el caché
        carCache = validCars;
        
        // Guardar en localStorage
        try {
          localStorage.setItem('carCatalogCache', JSON.stringify(validCars));
        } catch (e) {
          console.warn('Error saving car cache to localStorage:', e);
        }
        
        // Filtra los Honda Insight Touring antes de devolver los resultados
        const filteredCars = validCars.filter(car => {
          // Excluir explícitamente Honda Insight Touring
          if (car.make.toLowerCase() === 'honda' && 
              car.model.toLowerCase() === 'insight' && 
              car.trim && car.trim.toLowerCase() === 'touring') {
            return false;
          }
          
          // También excluir cualquier Honda Insight (independientemente del trim)
          // para evitar casos donde el trim no esté especificado
          if (car.make.toLowerCase() === 'honda' && 
              car.model.toLowerCase() === 'insight') {
            return false;
          }
          
          return true;
        });
        
        return filteredCars;
      }
    }
    
    // Si llegamos aquí, tenemos datos de response.data
    if (response.data && response.data.length > 0) {
      // Mejorar cada carro con su imagen correspondiente
      const enhancedCarsPromises = response.data.map(enhanceCarWithImage);
      const enhancedCars = await Promise.all(enhancedCarsPromises);
      
      // Filtrar cualquier valor nulo
      const validCars = enhancedCars.filter(car => car !== null);
      
      // Actualizar el caché
      carCache = validCars;
      
      // También guardar en localStorage para persistencia entre recargas
      try {
        localStorage.setItem('carCatalogCache', JSON.stringify(validCars));
      } catch (e) {
        console.warn('Error saving car cache to localStorage:', e);
      }
      
      // Filtra los Honda Insight Touring antes de devolver los resultados
      const filteredCars = validCars.filter(car => {
        // Excluir explícitamente Honda Insight Touring
        if (car.make.toLowerCase() === 'honda' && 
            car.model.toLowerCase() === 'insight' && 
            car.trim && car.trim.toLowerCase() === 'touring') {
          return false;
        }
        
        // También excluir cualquier Honda Insight (independientemente del trim)
        // para evitar casos donde el trim no esté especificado
        if (car.make.toLowerCase() === 'honda' && 
            car.model.toLowerCase() === 'insight') {
          return false;
        }
        
        return true;
      });
      
      return filteredCars;
    }
    
    // Si llegamos aquí, no pudimos obtener datos, intentar usar el caché
    if (carCache.length > 0) {
      return carCache;
    }
    
    throw new Error('No se pudieron obtener autos de la API');
  } catch (error) {
    console.error('Error fetching cars:', error);
    
    // Si hay un error, intentar usar el caché
    if (carCache.length > 0) {
      return carCache;
    }
    
    // Como último recurso, devolver algunos autos de placeholder para que la app no falle
    return Array.from({ length: 10 }, (_, i) => ({
      id: `placeholder-${i}`,
      make: ['Toyota', 'kia', 'Ford', 'Chevrolet', 'BMW'][i % 5],
      model: `Modelo ${i + 1}`,
      year: 2022 - (i % 3),
      fuel_type: ['gas', 'diesel', 'electricity'][i % 3],
      cylinders: [4, 6, 8][i % 3],
      transmission: i % 2 === 0 ? 'a' : 'm',
      class: ['compact', 'mid-size', 'suv', 'luxury'][i % 4],
      price: 15000 + (i * 5000),
      image: `${PLACEHOLDER_IMAGE_BASE}800x450/1a1a1a/ffffff?text=Auto+${i+1}`,
      description: `Vehículo de muestra ${i + 1} para cuando la API no está disponible`
    }));
  }
};

// Función para obtener un auto específico por ID
export const fetchCarById = async (id) => {
  try {
    // Primero buscar en el caché de memoria
    let car = carCache.find(car => car.id === id);
    
    // Si no está en memoria, intentar recuperar del localStorage
    if (!car) {
      try {
        const cachedCars = JSON.parse(localStorage.getItem('carCatalogCache') || '[]');
        car = cachedCars.find(car => car.id === id);
        
        // Si lo encontramos en localStorage, actualizar el caché en memoria
        if (car && carCache.length === 0) {
          carCache = cachedCars;
        }
      } catch (e) {
        console.warn('Error retrieving car cache from localStorage:', e);
      }
    }
    
    // Si aún no lo encontramos, intentar buscar todos los autos
    if (!car) {
      // Si el caché está vacío, hacer una nueva solicitud
      if (carCache.length === 0) {
        await fetchCars();
        car = carCache.find(car => car.id === id);
      }
    }
    
    if (!car) {
      throw new Error(`No se encontró un auto con ID ${id}`);
    }
    
    // Verificar que la imagen del coche siga siendo válida (mejora anti-bucle)
    if (car.image && !isReliableImageUrl(car.image)) {
      // Si la imagen no es confiable, reemplazarla
      car.image = getGuaranteedImage(car.make, car.model);
    }
    
    return car;
  } catch (error) {
    console.error(`Error fetching car with id ${id}:`, error);
    throw error;
  }
};

// Función para buscar autos según filtros específicos
export const searchCars = async (filters) => {
  try {
    // Preparar los parámetros para la API
    const params = {};
    
    // Separar la búsqueda combinada de marca y modelo
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      const searchTermLower = filters.searchTerm.toLowerCase();
      
      // Intentar detectar si es marca o modelo o ambos
      const commonBrands = ['toyota', 'kia', 'ford', 'chevrolet', 'bmw', 'audi', 'mercedes', 'nissan', 'volkswagen'];
      let detectedBrand = null;
      
      // Verificar si alguna marca conocida está en el término de búsqueda
      for (const brand of commonBrands) {
        if (searchTermLower.includes(brand)) {
          detectedBrand = brand;
          break;
        }
      }
      
      if (detectedBrand) {
        params.make = detectedBrand;
        // Si hay más texto además de la marca, asumimos que es el modelo
        const modelText = searchTermLower.replace(detectedBrand, '').trim();
        if (modelText) {
          params.model = modelText;
        }
      } else {
        // Si no detectamos una marca específica, intentamos con el primer término como marca
        // y el resto como modelo, o todo como modelo si es solo una palabra
        const terms = searchTermLower.split(' ');
        if (terms.length > 1) {
          params.make = terms[0];
          params.model = terms.slice(1).join(' ');
        } else {
          // Si es solo una palabra, intentamos buscar en modelos
          params.model = searchTermLower;
        }
      }
    }
    
    // Filtrar por año si se especifica
    if (filters.year && filters.year !== '') {
      const year = parseInt(filters.year);
      params.year = year;
    }
    
    // Añadir filtros adicionales si están disponibles
    if (filters.fuelType && filters.fuelType !== 'any') {
      params.fuel_type = filters.fuelType;
    }
    
    if (filters.transmission && filters.transmission !== 'any') {
      params.transmission = filters.transmission;
    }
    
    // Solicitar más resultados para poder filtrar por precio
    params.limit = 50;
    
    // Intentar usar el caché primero para búsquedas simples
    if (carCache.length > 0 && (Object.keys(params).length === 0 || (params.make && !params.model))) {
      console.log('Buscando en caché local primero...');
      let filteredCars = [...carCache];
      
      // Aplicar filtros al caché
      if (params.make) {
        filteredCars = filteredCars.filter(car => 
          car.make.toLowerCase().includes(params.make.toLowerCase())
        );
      }
      
      if (params.model) {
        filteredCars = filteredCars.filter(car => 
          car.model.toLowerCase().includes(params.model.toLowerCase())
        );
      }
      
      if (params.year) {
        filteredCars = filteredCars.filter(car => car.year === params.year);
      }
      
      if (params.fuel_type) {
        filteredCars = filteredCars.filter(car => 
          car.fuel_type === params.fuel_type
        );
      }
      
      if (params.transmission) {
        filteredCars = filteredCars.filter(car => 
          car.transmission === params.transmission
        );
      }
      
      if (filters.price) {
        const maxPrice = parseInt(filters.price);
        filteredCars = filteredCars.filter(car => car.price <= maxPrice);
      }
      
      // Si encontramos suficientes resultados en el caché, usarlos
      if (filteredCars.length >= 8) {
        console.log(`Usando ${filteredCars.length} resultados de caché local`);
        
        // Verificar y corregir imágenes no confiables en los resultados (mejora anti-bucle)
        const checkedCars = filteredCars.map(car => {
          if (car.image && !isReliableImageUrl(car.image)) {
            return {
              ...car,
              image: getGuaranteedImage(car.make, car.model)
            };
          }
          return car;
        });
        
        return checkedCars.slice(0, 24); // Limitar a 24 resultados
      }
    }
    
    // Si no hay suficientes resultados en caché, llamar a la API
    console.log('Consultando API con parámetros:', params);
    const response = await carApiClient.get(CAR_API_URL, { params });
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Formato de respuesta inválido');
    }
    
    console.log(`API devolvió ${response.data.length} resultados`);
    
    // Procesar los resultados
    let cars = [];
    
    for (let i = 0; i < response.data.length; i++) {
      const car = response.data[i];
      
      // Generar precio si no existe
      if (!car.price) {
        // Algoritmo para generar un precio basado en marca, año y clase
        let basePrice = 15000;
        
        // Ajustar por marca (las premium cuestan más)
        const premiumBrands = ['bmw', 'audi', 'mercedes', 'lexus', 'porsche', 'tesla'];
        if (premiumBrands.includes(car.make.toLowerCase())) {
          basePrice += 20000;
        }
        
        // Ajustar por año (más nuevo = más caro)
        const currentYear = new Date().getFullYear();
        basePrice += (car.year - 2000) * 1000;
        
        // Aplicar un descuento adicional basado en la antigüedad del vehículo
        const carAge = currentYear - car.year;
        if (carAge > 0) {
          basePrice -= carAge * 500; // Reducir $500 por cada año de antigüedad
        }
        
        // Ajustar por clase/tipo
        if (car.class) {
          if (car.class.toLowerCase().includes('luxury')) basePrice += 15000;
          if (car.class.toLowerCase().includes('sport')) basePrice += 10000;
          if (car.class.toLowerCase().includes('suv')) basePrice += 5000;
        }

        // Aplicar algo de variación aleatoria
        const variance = Math.floor(basePrice * 0.1 * (Math.random() - 0.5));
        car.price = Math.max(8000, basePrice + variance);
      }

      // Filtrar por precio si se ha especificado
      if (filters.price && car.price > parseInt(filters.price)) {
        continue;
      }

      // Mejorar el auto con una imagen
      const enhancedCar = await enhanceCarWithImage(car, i);
      if (enhancedCar) {
        cars.push(enhancedCar);
      }

      // Limitar a un máximo de 24 resultados por consulta
      if (cars.length >= 24) {
        break;
      }
    }

    // Filtrar para excluir Honda Insight
    cars = cars.filter(car => {
      // Excluir explícitamente Honda Insight Touring
      if (car.make?.toLowerCase() === 'honda' && 
          car.model?.toLowerCase() === 'insight') {
        return false;
      }
      return true;
    });

    // Si no encontramos resultados, devolver array vacío
    if (cars.length === 0) {
      return [];
    }
    
    return cars;
  } catch (error) {
    console.error('Error searching cars:', error);
    throw new Error('No pudimos completar tu búsqueda. Por favor intenta nuevamente.');
  }
};

// Función para obtener vehículos destacados
export const fetchFeaturedCars = async () => {
  try {
    // Si ya tenemos datos en caché, usarlos
    if (carCache.length > 0) {
      // Seleccionar 12 autos diversos para destacar
      const brandMap = new Map();
      const diverseCars = [];
      const sortedCars = [...carCache].sort((a, b) => b.year - a.year); // Ordenar por año descendente
      
      for (const car of sortedCars) {
        if (!brandMap.has(car.make)) {
          brandMap.set(car.make, 1);
          diverseCars.push(car);
        } else if (brandMap.get(car.make) < 2) { // Máximo 2 autos por marca
          brandMap.set(car.make, brandMap.get(car.make) + 1);
          diverseCars.push(car);
        }
        
        if (diverseCars.length >= 12) break;
      }
      
      // Si no tenemos suficientes, completar con los más recientes
      if (diverseCars.length < 12) {
        for (const car of sortedCars) {
          if (!diverseCars.includes(car)) {
            diverseCars.push(car);
          }
          if (diverseCars.length >= 12) break;
        }
      }
      
      return diverseCars;
    }
    
    // Si no hay caché, obtener datos frescos
    // Construir consulta para obtener autos diversos y recientes
    const makes = ['toyota', 'kia', 'ford', 'bmw', 'audi', 'mercedes', 'tesla'];
    const featuredCars = [];
    
    // Obtener 1-2 autos por marca para tener diversidad
    for (const make of makes) {
      if (featuredCars.length >= 12) break;
      
      const response = await carApiClient.get(CAR_API_URL, {
        params: {
          make: make,
          limit: 2
        }
      });
      
      if (response.data && response.data.length > 0) {
        for (let i = 0; i < response.data.length; i++) {
          const car = response.data[i];
          const enhancedCar = await enhanceCarWithImage(car, featuredCars.length);
          
          if (enhancedCar) {
            featuredCars.push(enhancedCar);
          }
          
          if (featuredCars.length >= 12) break;
        }
      }
    }
    
    return featuredCars;
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    // En caso de error, devolver una lista vacía o datos simulados
    return [];
  }
};