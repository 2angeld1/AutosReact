import { RELIABLE_DOMAINS } from './config';

// Almacenamiento en memoria para mantener los datos entre navegaciones
export let carCache = [];
export let imageCache = {}; // Cache para evitar búsquedas repetidas
export let imageRequestFailed = {}; // Para recordar qué consultas fallaron y evitar loops

// Función para validar si una URL es probablemente confiable (mejora anti-bucle)
export const isReliableImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const urlObj = new URL(url);
    // Verificar si el dominio está en nuestra lista de confiables
    return RELIABLE_DOMAINS.some(domain => urlObj.hostname.includes(domain));
  } catch (e) {
    // Si no es una URL válida, devolver false
    return false;
  }
};

// Carga inicial del caché de imágenes con filtrado de URLs no confiables
(function loadImageCache() {
  try {
    const savedImageCache = localStorage.getItem('carImageCache');
    if (savedImageCache) {
      const parsedCache = JSON.parse(savedImageCache);
      // Verificar que sea un objeto válido
      if (parsedCache && typeof parsedCache === 'object') {
        // Filtrar solo URLs confiables (mejora anti-bucle)
        const reliableCache = {};
        
        for (const [key, url] of Object.entries(parsedCache)) {
          if (isReliableImageUrl(url)) {
            reliableCache[key] = url;
          }
        }
        
        imageCache = reliableCache;
        console.log(`Caché de imágenes cargado y filtrado: ${Object.keys(imageCache).length} entradas confiables`);
      }
    }
  } catch (e) {
    console.warn('Error loading image cache from localStorage:', e);
  }
})();

// Función auxiliar para guardar el caché de imágenes con protección mejorada
export const saveImageCache = (key, value, getDefaultCarImage) => {
  // Solo guardar en caché URLs confiables (mejora anti-bucle)
  if (!isReliableImageUrl(value)) {
    console.warn(`URL no confiable descartada: ${value}`);
    // Reemplazar por una URL garantizada
    const [make, model] = key.split('-');
    const brandFallback = getDefaultCarImage(make);
    
    // Si la imagen de la marca tampoco es confiable, usar placeholder
    if (!isReliableImageUrl(brandFallback)) {
      const carText = encodeURIComponent(`${make || 'Auto'} ${model || ''}`);
      value = `https://placehold.co/800x450/1a1a1a/ffffff?text=${carText}`;
    } else {
      value = brandFallback;
    }
  }
  
  // Actualizar la entrada en el caché
  imageCache[key] = value;
  
  // Intentar guardar en localStorage (con limitación de tamaño)
  try {
    // Verificar si el caché no es demasiado grande
    if (Object.keys(imageCache).length > 500) {
      // Si hay demasiadas entradas, eliminar las más antiguas
      const entries = Object.entries(imageCache);
      // Mantener solo las 400 más recientes
      const newCache = Object.fromEntries(entries.slice(-400));
      imageCache = newCache;
    }
    
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
  } catch (e) {
    console.warn('Error saving image cache to localStorage:', e);
    
    // Si hay un error de cuota, intentar reducir el tamaño
    if (e.name === 'QuotaExceededError') {
      try {
        // Reducir drásticamente el caché y volver a intentar
        const entries = Object.entries(imageCache);
        const reducedCache = Object.fromEntries(entries.slice(-200)); // Mantener solo 200
        imageCache = reducedCache;
        localStorage.setItem('carImageCache', JSON.stringify(imageCache));
      } catch (innerError) {
        console.error('No se pudo guardar el caché incluso después de reducirlo:', innerError);
      }
    }
  }
};

// Función para limpiar el caché de imágenes (nueva, para evitar bucle infinito)
export const cleanImageCache = (getDefaultCarImage) => {
  const startSize = Object.keys(imageCache).length;
  const cleanedCache = {};
  
  // Filtrar solo URLs confiables
  for (const [key, url] of Object.entries(imageCache)) {
    if (isReliableImageUrl(url)) {
      cleanedCache[key] = url;
    } else {
      // Para URLs no confiables, asignar una URL garantizada
      const [make, model] = key.split('-');
      const brandFallback = getDefaultCarImage(make);
      
      // Si la imagen de la marca tampoco es confiable, usar placeholder
      if (!isReliableImageUrl(brandFallback)) {
        const carText = encodeURIComponent(`${make || 'Auto'} ${model || ''}`);
        cleanedCache[key] = `https://placehold.co/800x450/1a1a1a/ffffff?text=${carText}`;
      } else {
        cleanedCache[key] = brandFallback;
      }
    }
  }
  
  // Reemplazar caché completo
  imageCache = cleanedCache;
  
  // Guardar en localStorage
  try {
    localStorage.setItem('carImageCache', JSON.stringify(imageCache));
    console.log(`Caché limpiado: ${startSize} → ${Object.keys(imageCache).length} entradas`);
  } catch (e) {
    console.warn('Error guardando caché limpio:', e);
  }
};