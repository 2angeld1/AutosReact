import axios from 'axios';

// API key para autos
const CAR_API_KEY = 'cbItdorK23LmggFkevUi6g==0ZptbaLdGwMFSsaa';
const CAR_API_URL = 'https://api.api-ninjas.com/v1/cars';

// Google Custom Search API
const GOOGLE_API_KEY = 'AIzaSyDz4hMAjhuZKuevd9KDbCLBVW22UUXe6hk';
const GOOGLE_SEARCH_ENGINE_ID = '264c1f66b07b84725'; // Tu Search Engine ID
const GOOGLE_SEARCH_URL = 'https://www.googleapis.com/customsearch/v1';

// Almacenamiento en memoria para mantener los datos entre navegaciones
let carCache = [];
let imageCache = {}; // Cache para evitar búsquedas repetidas

// Configuración para API de coches
const carApiClient = axios.create({
  headers: {
    'X-Api-Key': CAR_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Función para obtener una imagen usando Google Custom Search
const getCarImageFromGoogle = async (make, model, year) => {
  try {
    // Clave de cache para este auto
    const cacheKey = `${make}-${model}-${year}`.toLowerCase();
    
    // Verificar si ya tenemos esta imagen en caché
    if (imageCache[cacheKey]) {
      return imageCache[cacheKey];
    }
    
    // Construir query de búsqueda
    const searchQuery = `${make} ${model} ${year} car`;
    
    // Consultar a Google Custom Search
    const response = await axios.get(GOOGLE_SEARCH_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: searchQuery,
        searchType: 'image',
        num: 1,
        imgSize: 'large',
        safe: 'active'
      }
    });
    
    // Si encontramos resultados
    if (response.data.items && response.data.items.length > 0) {
      const imageUrl = response.data.items[0].link;
      
      // Guardar en caché
      imageCache[cacheKey] = imageUrl;
      
      // Guardar caché en localStorage
      try {
        localStorage.setItem('carImageCache', JSON.stringify(imageCache));
      } catch (e) {
        console.warn('Error saving image cache to localStorage:', e);
      }
      
      return imageUrl;
    }
    
    // Si no hay resultados, probar con sólo marca y modelo
    const fallbackQuery = `${make} ${model} car`;
    const fallbackResponse = await axios.get(GOOGLE_SEARCH_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: fallbackQuery,
        searchType: 'image',
        num: 1,
        imgSize: 'large',
        safe: 'active'
      }
    });
    
    if (fallbackResponse.data.items && fallbackResponse.data.items.length > 0) {
      const imageUrl = fallbackResponse.data.items[0].link;
      
      // Guardar en caché
      imageCache[cacheKey] = imageUrl;
      
      // Guardar caché en localStorage
      try {
        localStorage.setItem('carImageCache', JSON.stringify(imageCache));
      } catch (e) {
        console.warn('Error saving image cache to localStorage:', e);
      }
      
      return imageUrl;
    }
    
    // Si todo falla, usar imagen por defecto según la marca
    return getDefaultCarImage(make);
  } catch (error) {
    console.error('Error fetching image from Google:', error);
    return getDefaultCarImage(make);
  }
};

// Función especializada para obtener imágenes de alta resolución para fondos
const getHighResCarImage = async (make, model, year) => {
  try {
    // Clave de cache para este auto (versión HD)
    const cacheKey = `${make}-${model}-${year}-hd`.toLowerCase();
    
    // Verificar caché
    if (imageCache[cacheKey]) {
      return imageCache[cacheKey];
    }
    
    // Construir query específica para fotos de alta resolución
    const searchQuery = `${make} ${model} ${year} car wallpaper 4k`;
    
    // Usar parámetros específicos para imágenes grandes
    const response = await axios.get(GOOGLE_SEARCH_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: searchQuery,
        searchType: 'image',
        num: 1,
        imgSize: 'xxlarge', // Solicitar imágenes extra grandes
        imgType: 'photo',   // Solo fotos, no dibujos o clipart
        safe: 'active'
      }
    });
    
    // Si encontramos resultados
    if (response.data.items && response.data.items.length > 0) {
      const imageUrl = response.data.items[0].link;
      
      // Guardar en caché
      imageCache[cacheKey] = imageUrl;
      
      try {
        localStorage.setItem('carImageCache', JSON.stringify(imageCache));
      } catch (e) {
        console.warn('Error saving image cache to localStorage:', e);
      }
      
      return imageUrl;
    }
    
    // Alternativa con búsqueda más general si no encontramos wallpapers
    const fallbackQuery = `${make} ${model} car high resolution`;
    const fallbackResponse = await axios.get(GOOGLE_SEARCH_URL, {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: fallbackQuery,
        searchType: 'image',
        num: 1,
        imgSize: 'xxlarge',
        imgType: 'photo',
        safe: 'active'
      }
    });
    
    if (fallbackResponse.data.items && fallbackResponse.data.items.length > 0) {
      const imageUrl = fallbackResponse.data.items[0].link;
      
      // Guardar en caché
      imageCache[cacheKey] = imageUrl;
      
      try {
        localStorage.setItem('carImageCache', JSON.stringify(imageCache));
      } catch (e) {
        console.warn('Error saving image cache to localStorage:', e);
      }
      
      return imageUrl;
    }
    
    // Si todo falla, usar la imagen regular pero de una fuente confiable
    return `https://images.unsplash.com/photo-${make === 'toyota' && model.toLowerCase().includes('gr 86') 
      ? '1633509917936-a994bfc732a7' 
      : '1583121274602-3e2820c69888'}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&h=1600&q=80`;
  } catch (error) {
    console.error('Error fetching high-res image:', error);
    return getDefaultCarImage(make); // Usar imagen predeterminada como último recurso
  }
};

// Función para obtener una imagen predeterminada por marca
const getDefaultCarImage = (make) => {
  const brandImages = {
    'toyota': 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'honda': 'https://images.unsplash.com/photo-1609061808131-b7071f88d5d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'ford': 'https://images.unsplash.com/photo-1551830820-330a71b99659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'chevrolet': 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'bmw': 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'audi': 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'mercedes': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'nissan': 'https://images.unsplash.com/photo-1590510575339-2aff0bb14ba3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'volkswagen': 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'subaru': 'https://images.unsplash.com/photo-1626668893654-6288548dd7b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'mazda': 'https://images.unsplash.com/photo-1586464836139-86553c751f65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'hyundai': 'https://images.unsplash.com/photo-1629897043097-1e1eedc50e62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'kia': 'https://images.unsplash.com/photo-1641255161715-7be644893ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'lexus': 'https://images.unsplash.com/photo-1546873667-cadc857dd5b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'acura': 'https://images.unsplash.com/photo-1628519592419-bf1b7db9beef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'infiniti': 'https://images.unsplash.com/photo-1583870908951-71149f42bcef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'tesla': 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'porsche': 'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'jaguar': 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'land rover': 'https://images.unsplash.com/photo-1550949373-2e291f97328e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'volvo': 'https://images.unsplash.com/photo-1626056949455-3da0095ae8a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'mini': 'https://images.unsplash.com/photo-1584345604325-ace5e0fe68e9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'mitsubishi': 'https://images.unsplash.com/photo-1596306499317-8490232511d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'jeep': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'dodge': 'https://images.unsplash.com/photo-1585535853285-87912d5a9b1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'chrysler': 'https://images.unsplash.com/photo-1623014055088-a3b11ba597fe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'buick': 'https://images.unsplash.com/photo-1600259828526-77f8617cebd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'cadillac': 'https://images.unsplash.com/photo-1608056522292-52bea6d44517?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'gmc': 'https://images.unsplash.com/photo-1601661027198-55ebcfb34d62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'ram': 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
    'lincoln': 'https://images.unsplash.com/photo-1601420723363-bbc26df84d3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80'
  };

  // Devolver la imagen de la marca o una imagen genérica
  return brandImages[make.toLowerCase()] || 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80';
};

// Función para generar un ID único pero estable para un auto
const generateStableId = (car, index) => {
  // Crear un ID basado en propiedades del auto que no cambiarán
  return `${car.make}-${car.model}-${car.year}-${car.fuel_type}-${index}`.toLowerCase().replace(/ /g, '-');
};

// Función para procesar un auto y añadirle una imagen
const enhanceCarWithImage = async (car, index) => {
  try {
    // Obtener imagen de Google
    const imageUrl = await getCarImageFromGoogle(car.make, car.model, car.year);
    
    return {
      ...car,
      id: generateStableId(car, index),
      price: Math.floor(Math.random() * 50000) + 10000,
      image: imageUrl,
      description: `${car.make} ${car.model} ${car.year} con motor ${car.fuel_type} de ${car.cylinders} cilindros.`
    };
  } catch (error) {
    console.error('Error enhancing car with image:', error);
    // Usar imagen por defecto si hay un error
    return {
      ...car,
      id: generateStableId(car, index),
      price: Math.floor(Math.random() * 50000) + 10000,
      image: getDefaultCarImage(car.make),
      description: `${car.make} ${car.model} ${car.year} con motor ${car.fuel_type} de ${car.cylinders} cilindros.`
    };
  }
};

const fetchCars = async (params = {}) => {
  try {
    // Modificamos esta parte para mostrar autos recientes por defecto
    const searchParams = {};
    
    // Si hay parámetros específicos, los usamos
    if (Object.keys(params).length > 0) {
      Object.assign(searchParams, params);
    } else {
      // Por defecto, vamos a mostrar autos de varias marcas populares
      // Usamos años específicos y marcas populares para asegurar resultados variados
      const topBrands = ['toyota', 'honda', 'ford', 'chevrolet', 'bmw', 'audi', 'mercedes', 'nissan'];
      const allCars = [];
      
      // Usamos años recientes para asegurar que tengamos resultados
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
              if (allCars.length >= 15) break;
            }
          } catch (err) {
            console.error(`Error fetching ${brand} cars from ${year}:`, err);
            continue;
          }
        }
        
        // Si ya tenemos suficientes autos, paramos el bucle externo también
        if (allCars.length >= 15) break;
      }
      
      if (allCars.length > 0) {
        // Mejorar cada carro con su imagen correspondiente
        const enhancedCarsPromises = allCars.map(enhanceCarWithImage);
        const enhancedCars = await Promise.all(enhancedCarsPromises);
        
        // Actualizar el caché
        carCache = enhancedCars;
        
        try {
          localStorage.setItem('carCatalogCache', JSON.stringify(enhancedCars));
        } catch (e) {
          console.warn('Error saving car cache to localStorage:', e);
        }
        
        return enhancedCars;
      }
      
      // Si todo lo anterior falló, intentamos con algunos parámetros básicos
      searchParams.year = 2022;
      searchParams.make = 'toyota'; // Usamos una marca común
    }
    
    const response = await carApiClient.get(CAR_API_URL, { params: searchParams });
    
    // Si no encontramos resultados suficientes, intentamos con un año diferente
    if (!response.data || response.data.length < 5) {
      searchParams.year = 2021; // Probamos con otro año
      
      const fallbackResponse = await carApiClient.get(CAR_API_URL, { params: searchParams });
      
      if (fallbackResponse.data && fallbackResponse.data.length > 0) {
        // Mejorar cada carro con su imagen correspondiente
        const enhancedCarsPromises = fallbackResponse.data.map(enhanceCarWithImage);
        const enhancedCars = await Promise.all(enhancedCarsPromises);
        
        // Actualizar el caché
        carCache = enhancedCars;
        
        try {
          localStorage.setItem('carCatalogCache', JSON.stringify(enhancedCars));
        } catch (e) {
          console.warn('Error saving car cache to localStorage:', e);
        }
        
        return enhancedCars;
      }
    }
    
    // Si llegamos aquí, tenemos datos de response.data
    if (response.data && response.data.length > 0) {
      // Mejorar cada carro con su imagen correspondiente
      const enhancedCarsPromises = response.data.map(enhanceCarWithImage);
      const enhancedCars = await Promise.all(enhancedCarsPromises);
      
      // Actualizar el caché
      carCache = enhancedCars;
      
      // También guardar en localStorage para persistencia entre recargas
      try {
        localStorage.setItem('carCatalogCache', JSON.stringify(enhancedCars));
      } catch (e) {
        console.warn('Error saving car cache to localStorage:', e);
      }
      
      return enhancedCars;
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
    
    throw error;
  }
};

const fetchCarById = async (id) => {
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
    
    return car;
  } catch (error) {
    console.error(`Error fetching car with id ${id}:`, error);
    throw error;
  }
};

// Asegúrate de que la función searchCars esté definida así:
const searchCars = async (filters) => {
  try {
    // Preparar los parámetros para la API
    const params = {};
    
    if (filters.make && filters.make !== 'any') {
      params.make = filters.make.toLowerCase();
    }
    
    if (filters.model && filters.model !== '') {
      params.model = filters.model.toLowerCase();
    }
    
    if (filters.yearMin) {
      params.year_min = parseInt(filters.yearMin);
    }
    
    if (filters.yearMax) {
      params.year_max = parseInt(filters.yearMax);
    }
    
    // Añadir filtros adicionales si están disponibles
    if (filters.fuelType && filters.fuelType !== 'any') {
      params.fuel_type = filters.fuelType;
    }
    
    if (filters.transmission && filters.transmission !== 'any') {
      params.transmission = filters.transmission;
    }
    
    // Solicitar más resultados para poder filtrar por precio si es necesario
    params.limit = 50;
    
    // Llamar a la API con los filtros
    const response = await carApiClient.get(CAR_API_URL, { params });
    
    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Formato de respuesta inválido');
    }
    
    // Procesar los resultados
    let cars = [];
    
    for (let i = 0; i < response.data.length; i++) {
      const car = response.data[i];
      
      // Generar precio si no existe (la API no proporciona precios)
      if (!car.price) {
        // Algoritmo simple para generar un precio basado en marca, año y clase
        let basePrice = 15000;
        
        // Ajustar por marca (las premium cuestan más)
        const premiumBrands = ['bmw', 'audi', 'mercedes', 'lexus', 'porsche', 'tesla'];
        if (premiumBrands.includes(car.make.toLowerCase())) {
          basePrice += 20000;
        }
        
        // Ajustar por año (más nuevo = más caro)
        const currentYear = new Date().getFullYear();
        basePrice += (car.year - 2000) * 1000;
        
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
      if (filters.priceMin && car.price < parseInt(filters.priceMin)) {
        continue;
      }

      if (filters.priceMax && car.price > parseInt(filters.priceMax)) {
        continue;
      }

      // Mejorar el auto con una imagen
      const enhancedCar = await enhanceCarWithImage(car, i);
      cars.push(enhancedCar);

      // Limitar a un máximo de 24 resultados por consulta para no sobrecargar
      if (cars.length >= 24) {
        break;
      }
    }

    return cars;
  } catch (error) {
    console.error('Error searching cars:', error);
    throw new Error('No pudimos completar tu búsqueda. Por favor intenta nuevamente.');
  }
};

// Función para obtener vehículos destacados
const fetchFeaturedCars = async () => {
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
    const makes = ['toyota', 'honda', 'ford', 'bmw', 'audi', 'mercedes', 'tesla'];
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
          featuredCars.push(enhancedCar);
          
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

export { 
  fetchCars, 
  fetchCarById, 
  searchCars, 
  fetchFeaturedCars, 
  getCarImageFromGoogle, 
  getHighResCarImage, 
  getDefaultCarImage 
};