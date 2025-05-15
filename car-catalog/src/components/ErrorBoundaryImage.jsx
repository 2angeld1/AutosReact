import React, { useState } from 'react';

// Componente de imagen con manejo de errores incorporado
const ErrorBoundaryImage = ({ src, alt, fallbackSrc, ...props }) => {
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  // Si hay error o se han agotado los intentos, mostrar fallback
  if (error || attempts >= 2) {
    // Usar un placeholder seguro si no hay fallback proporcionado
    const safeFallback = fallbackSrc || `https://placehold.co/400x225/1a1a1a/ffffff?text=${encodeURIComponent(alt || 'Auto')}`;
    
    return (
      <img
        src={safeFallback}
        alt={alt || "Imagen no disponible"}
        {...props}
        // No manejar errores en la imagen de respaldo para evitar bucles
      />
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      {...props}
      onError={(e) => {
        // Evitar bucles infinitos
        e.currentTarget.onerror = null;
        setAttempts(prev => prev + 1);
        setError(true);
        console.warn(`Error cargando imagen: ${src}`);
      }}
    />
  );
};

export default ErrorBoundaryImage;