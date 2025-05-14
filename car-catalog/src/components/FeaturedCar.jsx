import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedCar = ({ car }) => {
    const [imgError, setImgError] = useState(false);

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

    const handleImageError = () => {
        setImgError(true);
    };

    return (
        <div className="columns is-vcentered">
            <div className="column is-6">
                {imgError ? (
                    <div 
                        className="featured-car-image has-text-centered is-flex is-justify-content-center is-align-items-center has-text-white has-text-weight-bold"
                        style={{ backgroundColor: getBrandColor(car.make), height: '300px' }}
                    >
                        <span className="is-size-2">{car.make} {car.model}</span>
                    </div>
                ) : (
                    <img 
                        src={car.image} 
                        alt={`${car.make} ${car.model}`} 
                        className="featured-car-image" 
                        onError={handleImageError}
                    />
                )}
            </div>
            <div className="column is-6">
                <div className="content has-text-white">
                    <h3 className="title is-2 has-text-white">{car.make} {car.model}</h3>
                    <h4 className="subtitle is-4 has-text-white">{car.year}</h4>
                    
                    <div className="tags mb-4">
                        <span className="tag is-medium is-warning">${car.price?.toLocaleString()}</span>
                        <span className="tag is-medium is-info">{car.fuel_type}</span>
                        <span className="tag is-medium is-success">{car.transmission}</span>
                        <span className="tag is-medium is-danger">{car.cylinders} cilindros</span>
                    </div>
                    
                    <p className="is-size-5 mb-5">{car.description}</p>
                    
                    <Link to={`/car/${car.id}`} className="button is-warning is-medium">
                        <span>Ver detalles</span>
                        <span className="icon">
                            <i className="fas fa-arrow-right"></i>
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCar;