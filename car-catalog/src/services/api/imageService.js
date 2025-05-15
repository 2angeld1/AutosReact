import axios from 'axios';
import { 
  GOOGLE_API_KEY, 
  GOOGLE_SEARCH_ENGINE_ID, 
  GOOGLE_SEARCH_URL 
} from './config';
import { 
  imageCache, 
  imageRequestFailed, 
  saveImageCache,
  isReliableImageUrl
} from './cache';
import { carModelImages, getDefaultCarImage } from './carBrands';
import { getGuaranteedImage } from './utils';

// Función para obtener una imagen usando Google Custom Search con mejoras anti-bucle
export const getCarImageFromGoogle = async (make, model, year) => {
  try {
    // Clave de cache para este auto
    const cacheKey = `${make}-${model}-${year}`.toLowerCase();
    
    // Verificar si ya tenemos esta imagen en caché y es confiable
    if (imageCache[cacheKey] && isReliableImageUrl(imageCache[cacheKey])) {
      console.log(`Usando imagen en caché para ${make} ${model} ${year}`);
      return imageCache[cacheKey];
    }
    
    // Verificar si esta consulta ya falló anteriormente para evitar loops
    if (imageRequestFailed[cacheKey]) {
      console.log(`Usando imagen predeterminada para ${make} ${model} ${year} (consulta anterior falló)`);
      return getGuaranteedImage(make, model);
    }
    
    // Construir query de búsqueda
    const searchQuery = `${make} ${model} ${year} car`;
    
    try {
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
        
        // Verificar si la URL es confiable
        if (isReliableImageUrl(imageUrl)) {
          // Guardar en caché
          saveImageCache(cacheKey, imageUrl, getDefaultCarImage);
          
          console.log(`Imagen de Google obtenida para ${make} ${model} ${year}`);
          return imageUrl;
        } else {
          console.warn(`URL no confiable recibida de Google: ${imageUrl}`);
          // No guardar URLs no confiables
        }
      }
      
      // Si no hay resultados confiables, probar con sólo marca y modelo
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
        
        // Verificar si la URL es confiable
        if (isReliableImageUrl(imageUrl)) {
          // Guardar en caché
          saveImageCache(cacheKey, imageUrl, getDefaultCarImage);
          
          console.log(`Imagen de Google obtenida (búsqueda simplificada) para ${make} ${model}`);
          return imageUrl;
        } else {
          console.warn(`URL no confiable recibida de Google (búsqueda simplificada): ${imageUrl}`);
          // No guardar URLs no confiables
        }
      }
    } catch (googleError) {
      // Capturar específicamente el error 429 (Too Many Requests)
      if (googleError.response && googleError.response.status === 429) {
        console.warn('Error 429: Límite de Google API excedido. Cambiando a DuckDuckGo...');
        
        // Marcar esta consulta como fallida para evitar intentos repetidos
        imageRequestFailed[cacheKey] = true;
        
        // Usar DuckDuckGo como alternativa
        return await getCarImageFromDuckDuckGo(make, model, year);
      }
      
      // Para otros errores de Google, simplemente los registramos pero seguimos el flujo normal
      console.error('Error al consultar la API de Google:', googleError.message);
      imageRequestFailed[cacheKey] = true;
    }
    
    // Si llegamos aquí, Google no encontró resultados o hubo un error diferente a 429
    // Intentar con DuckDuckGo de todas formas
    console.log(`Intentando con DuckDuckGo para ${make} ${model} ${year}...`);
    try {
      const ddgImage = await getCarImageFromDuckDuckGo(make, model, year);
      return ddgImage;
    } catch (ddgError) {
      console.error('Error al consultar DuckDuckGo:', ddgError);
      // Marcar esta consulta como fallida para evitar intentos repetidos
      imageRequestFailed[cacheKey] = true;
      
      // Si ambos fallan, usar imagen predeterminada
      return getGuaranteedImage(make, model);
    }
  } catch (generalError) {
    console.error('Error general en getCarImageFromGoogle:', generalError);
    return getGuaranteedImage(make, model);
  }
};

// Función para obtener imágenes desde DuckDuckGo (con mejoras anti-bucle)
export const getCarImageFromDuckDuckGo = async (make, model, year) => {
  try {
    // Clave de cache específica para resultados de DuckDuckGo
    const cacheKey = `ddg-${make}-${model}-${year}`.toLowerCase();
    
    // Verificar si ya tenemos esta imagen en caché y es confiable
    if (imageCache[cacheKey] && isReliableImageUrl(imageCache[cacheKey])) {
      console.log(`Usando imagen de DuckDuckGo en caché para ${make} ${model} ${year}`);
      return imageCache[cacheKey];
    }
    
    // Verificar si esta consulta ya falló anteriormente para evitar loops
    if (imageRequestFailed[cacheKey]) {
      console.log(`Usando imagen predeterminada para ${make} ${model} ${year} (DuckDuckGo falló anteriormente)`);
      return getGuaranteedImage(make, model);
    }
    
    // Obtener imagen basada en marca y modelo
    const makeLower = make ? make.toLowerCase() : '';
    const modelLower = model ? model.toLowerCase() : '';
    
    let imageUrl;
    
    // Buscar en nuestro catálogo
    if (carModelImages[makeLower]) {
      // Buscar primero un modelo exacto
      if (carModelImages[makeLower][modelLower]) {
        imageUrl = carModelImages[makeLower][modelLower];
      } else {
        // Si no hay coincidencia exacta, buscar un modelo similar
        const similarModel = Object.keys(carModelImages[makeLower]).find(key => 
          key !== 'default' && (
            modelLower.includes(key) || 
            key.includes(modelLower) ||
            // Para casos como "3 series" vs "series 3"
            (modelLower.split(' ').sort().join(' ') === key.split(' ').sort().join(' '))
          )
        );
        
        if (similarModel) {
          imageUrl = carModelImages[makeLower][similarModel];
        } else {
          // Si no encontramos un modelo similar, usar el default de la marca
          imageUrl = carModelImages[makeLower].default;
        }
      }
    } else {
      // Si no encontramos la marca, usar el default general
      imageUrl = carModelImages.default;
    }
    
    // Verificar si la URL es confiable antes de guardarla
    if (!isReliableImageUrl(imageUrl)) {
      console.warn(`URL no confiable detectada: ${imageUrl}`);
      imageUrl = getGuaranteedImage(make, model);
    }
    
    // Guardar en caché
    saveImageCache(cacheKey, imageUrl, getDefaultCarImage);
    
    console.log(`DuckDuckGo (local DB) proporcionó imagen para ${make} ${model} ${year}`);
    return imageUrl;
  } catch (error) {
    console.error('Error en getCarImageFromDuckDuckGo:', error);
    // Asegurarnos de que cacheKey está definido antes de usarlo en el error
    const cacheKey = `ddg-${make}-${model}-${year}`.toLowerCase();
    imageRequestFailed[cacheKey] = true;
    return getGuaranteedImage(make, model);
  }
};

// Función especializada para obtener imágenes de alta resolución para fondos (con mejoras anti-bucle)
export const getHighResCarImage = async (make, model, year) => {
  try {
    // Clave de cache para este auto (versión HD)
    const cacheKey = `${make}-${model}-${year}-hd`.toLowerCase();
    
    // Verificar caché y que sea confiable
    if (imageCache[cacheKey] && isReliableImageUrl(imageCache[cacheKey])) {
      return imageCache[cacheKey];
    }
    
    // Verificar si esta consulta ya falló anteriormente para evitar loops
    if (imageRequestFailed[cacheKey]) {
      console.log(`Usando imagen HD predeterminada para ${make} ${model} ${year} (consulta anterior falló)`);
      return `https://images.unsplash.com/photo-${make === 'toyota' && model.toLowerCase().includes('gr 86') 
        ? '1633509917936-a994bfc732a7' 
        : '1583121274602-3e2820c69888'}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&h=1600&q=80`;
    }
    
    try {
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
        
        // Verificar que la URL es confiable
        if (isReliableImageUrl(imageUrl)) {
          // Guardar en caché
          saveImageCache(cacheKey, imageUrl, getDefaultCarImage);
          return imageUrl;
        }
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
        
        // Verificar que la URL es confiable
        if (isReliableImageUrl(imageUrl)) {
          // Guardar en caché
          saveImageCache(cacheKey, imageUrl, getDefaultCarImage);
          return imageUrl;
        }
      }
    } catch (googleError) {
      // Capturar específicamente el error 429 (Too Many Requests)
      if (googleError.response && googleError.response.status === 429) {
        console.warn('Error 429: Límite de Google API excedido para imágenes HD.');
        imageRequestFailed[cacheKey] = true;
      } else {
        console.error('Error en búsqueda de imágenes HD:', googleError.message);
        imageRequestFailed[cacheKey] = true;
      }
    }
    
    // Si todo falla, usar la imagen regular pero de una fuente confiable
    const defaultHdImage = `https://images.unsplash.com/photo-${make === 'toyota' && model.toLowerCase().includes('gr 86') 
      ? '1633509917936-a994bfc732a7' 
      : '1583121274602-3e2820c69888'}?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3000&h=1600&q=80`;
    
    // Guardar en caché para evitar consultas repetidas
    saveImageCache(cacheKey, defaultHdImage, getDefaultCarImage);
    
    return defaultHdImage;
  } catch (error) {
    console.error('Error fetching high-res image:', error);
    return getGuaranteedImage(make, model); // Usar imagen predeterminada como último recurso
  }
};