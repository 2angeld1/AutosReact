import axios from 'axios';

// API key para autos desde variables de entorno
export const CAR_API_KEY = process.env.REACT_APP_NINJA_API_KEY;
export const CAR_API_URL = process.env.REACT_APP_NINJA_API_URL;

// Google Custom Search API desde variables de entorno
export const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
export const GOOGLE_SEARCH_ENGINE_ID = process.env.REACT_APP_GOOGLE_CSE_ID;
export const GOOGLE_SEARCH_URL = process.env.REACT_APP_GOOGLE_SEARCH_URL;

// Placeholder base para URLs seguras
export const PLACEHOLDER_IMAGE_BASE = 'https://placehold.co/';

// Lista de dominios confiables que sabemos que funcionan (mejora anti-bucle)
export const RELIABLE_DOMAINS = [
  'images.unsplash.com',
  'cdn.motor1.com',
  'placehold.co',
  'cloudfront.net',
  'assets.caranddriver.com',
  'ixlib'
];

// Configuración para API de coches
export const carApiClient = axios.create({
  headers: {
    'X-Api-Key': CAR_API_KEY,
    'Content-Type': 'application/json'
  }
});