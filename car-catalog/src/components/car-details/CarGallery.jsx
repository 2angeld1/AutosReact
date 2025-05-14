import React, { useState } from 'react';

const CarGallery = ({ car, imgError, onImageError }) => {
    const [activeGalleryImage, setActiveGalleryImage] = useState(0);
    
    // Imágenes de galería simuladas
    const galleryImages = [
        { id: 0, type: 'main', label: 'Principal' },
        { id: 1, type: 'interior', label: 'Interior' },
        { id: 2, type: 'front', label: 'Frontal' },
        { id: 3, type: 'back', label: 'Trasera' },
    ];
    
    const getBrandColor = (make) => {
        const brandColors = {
            toyota: '#e50000',
            honda: '#0033a0',
            nissan: '#c3002f',
            ford: '#003478',
            chevrolet: '#d1a856',
            bmw: '#0066b1',
            audi: '#bb0a30',
            mercedes: '#00adef'
        };
        
        return brandColors[make?.toLowerCase()] || '#6b7280';
    };
    
    // Estas URLs son simuladas - usamos placeholders en caso de error
    const getPlaceholderImage = (carInfo, type = 'main') => {
        const makeModel = `${carInfo.make} ${carInfo.model}`;
        return `https://via.placeholder.com/800x450/1a1a1a/bb86fc?text=${makeModel}+${type}`;
    };
    
    const getGalleryImage = (imageType) => {
        if (imgError) return getPlaceholderImage(car, imageType);
        
        // En un entorno real, aquí tendrías varias imágenes del coche
        // Para esta simulación, usamos la misma imagen pero podríamos buscar variantes
        return car?.image;
    };

    return (
        <div className="car-gallery-container p-4">
            {imgError ? (
                <div 
                    className="has-text-centered is-flex is-justify-content-center is-align-items-center has-text-white main-image-container"
                    style={{ backgroundColor: getBrandColor(car.make), height: '400px' }}
                >
                    <span className="is-size-2">{car.make} {car.model} {car.year}</span>
                </div>
            ) : (
                <div className="car-gallery">
                    <div className="main-image-container mb-4">
                        <figure className="image is-16by9">
                            <img 
                                src={getGalleryImage(galleryImages[activeGalleryImage].type)} 
                                alt={`${car.make} ${car.model} - ${galleryImages[activeGalleryImage].label}`} 
                                className="main-gallery-image" 
                                onError={onImageError}
                            />
                        </figure>
                    </div>
                    
                    <div className="thumbnails">
                        <div className="columns is-mobile">
                            {galleryImages.map((img) => (
                                <div className="column is-3" key={img.id}>
                                    <div 
                                        className={`thumbnail ${activeGalleryImage === img.id ? 'is-active' : ''}`}
                                        onClick={() => setActiveGalleryImage(img.id)}
                                    >
                                        <figure className="image is-4by3">
                                            <img 
                                                src={getGalleryImage(img.type)} 
                                                alt={`${car.make} ${car.model} - ${img.label}`}
                                            />
                                        </figure>
                                        <div className="thumbnail-label">{img.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarGallery;