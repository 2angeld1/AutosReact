import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CarContext } from '../context/CarContext';

const CarCard = ({ car }) => {
    const [imgError, setImgError] = useState(false);
    const { toggleFavorite, isFavorite } = useContext(CarContext);
    const isCarFavorite = isFavorite(car.id);
    
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
        <div className="column is-4-desktop is-6-tablet">
            <div className="card car-card">
                <div className="card-image">
                    {imgError ? (
                        <div 
                            className="image is-4by3 has-text-centered is-flex is-justify-content-center is-align-items-center has-text-white has-text-weight-bold"
                            style={{ backgroundColor: getBrandColor(car.make) }}
                        >
                            <span className="is-size-4">{car.make} {car.model}</span>
                        </div>
                    ) : (
                        <figure className="image is-4by3">
                            <img 
                                src={car.image}
                                alt={`${car.make} ${car.model}`} 
                                className="car-image"
                                onError={handleImageError}
                            />
                            <span 
                                className="car-brand-badge" 
                                style={{ backgroundColor: getBrandColor(car.make), color: 'white' }}
                            >
                                {car.make}
                            </span>
                        </figure>
                    )}
                </div>
                <div className="card-content">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4">{car.make} {car.model}</p>
                            <p className="subtitle is-6">{car.year}</p>
                        </div>
                        <div className="media-right">
                            <button 
                                className={`button is-rounded ${isCarFavorite ? 'is-danger' : 'is-light'}`}
                                onClick={() => toggleFavorite(car.id)}
                                aria-label={isCarFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                <span className="icon">
                                    <i className="fas fa-heart"></i>
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="content">
                        <p className="has-text-weight-bold is-size-4 has-text-primary mb-3">
                            ${car.price?.toLocaleString()}
                        </p>
                        <div className="tags mb-3">
                            <span className="tag is-info">{car.fuel_type}</span>
                            <span className="tag is-success">{car.cylinders} cilindros</span>
                            <span className="tag is-warning">{car.transmission}</span>
                        </div>
                        <p className="has-text-grey is-size-7 mb-3">
                            Ciudad: {car.city_mpg} MPG | Carretera: {car.highway_mpg} MPG
                        </p>
                    </div>
                </div>
                <footer className="card-footer">
                    <Link to={`/car/${car.id}`} className="card-footer-item button is-primary">
                        <span className="icon">
                            <i className="fas fa-info-circle"></i>
                        </span>
                        <span>Ver detalles</span>
                    </Link>
                </footer>
            </div>
        </div>
    );
};

export default CarCard;