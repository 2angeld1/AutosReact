import { PLACEHOLDER_IMAGE_BASE } from './config';
import { isReliableImageUrl } from './cache';
import { getDefaultCarImage } from './carBrands';

// Función para generar una URL de imagen de respaldo garantizada (nueva, para evitar bucle)
export const getGuaranteedImage = (make, model) => {
  // Primera opción: usar la imagen segura según la marca
  const brandFallback = getDefaultCarImage(make);
  
  // Segunda opción: si la marca no es confiable, usar placeholder.co
  if (!isReliableImageUrl(brandFallback)) {
    // Crear un placeholder específico para el auto
    const carText = encodeURIComponent(`${make || 'Auto'} ${model || ''}`);
    return `${PLACEHOLDER_IMAGE_BASE}800x450/1a1a1a/ffffff?text=${carText}`;
  }
  
  return brandFallback;
};

// Función para generar un ID estable basado en las propiedades del carro
export const generateStableId = (car, index) => {
  if (!car) return `car-${index}`;
  
  const idBase = `${car.make}-${car.model}-${car.year}-${car.cylinders || ''}-${car.fuel_type || ''}`;
  let hash = 0;
  
  for (let i = 0; i < idBase.length; i++) {
    const char = idBase.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a entero de 32 bits
  }
  
  return `car-${Math.abs(hash)}-${index}`;
};