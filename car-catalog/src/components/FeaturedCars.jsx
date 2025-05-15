import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CarContext } from '../context/CarContext';

const FeaturedCars = () => {
    const { cars, loading } = useContext(CarContext);
    const [featuredCars, setFeaturedCars] = useState([]);
    
    useEffect(() => {
        if (cars.length > 0 && !loading) {
            // Seleccionar autos de lujo o deportivos (puedes ajustar esta lógica)
            const luxury = cars.filter(car => 
                car.make.toLowerCase() === 'bmw' || 
                car.make.toLowerCase() === 'audi' || 
                car.make.toLowerCase() === 'mercedes' ||
                car.make.toLowerCase() === 'porsche' ||
                car.make.toLowerCase() === 'lexus'
            );
            
            // Si no hay suficientes autos de lujo, agregar otros
            if (luxury.length < 8) {
                const additional = cars
                    .filter(car => !luxury.some(lux => lux.id === car.id))
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 8 - luxury.length);
                
                setFeaturedCars([...luxury, ...additional]);
            } else {
                setFeaturedCars(luxury.slice(0, 8));
            }
        }
    }, [cars, loading]);

    if (featuredCars.length === 0) {
        return null;
    }

    return (
        <section className="section has-background-black-ter">
            <div className="container">
                <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                    Autos Destacados
                </h2>
                <p className="subtitle has-text-centered has-text-grey-light mb-6">
                    Nuestra selección de vehículos premium y exclusivos
                </p>
                
                <div className="featured-cars-slider">
                    <div className="columns" style={{ width: 'max-content' }}>
                        {featuredCars.map(car => (
                            <div key={car.id} className="column is-3-widescreen" style={{ width: '300px', padding: '0 10px' }}>
                                <div className="card animate-fadeIn">
                                    <div className="card-image">
                                        <figure className="image is-3by2">
                                            <img 
                                                src={car.image} 
                                                alt={`${car.make} ${car.model}`} 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://images.hgmsites.net/hug/2022-honda-insight_100793130_h.jpg`;
                                                }}
                                            />
                                        </figure>
                                        <div className="is-overlay" style={{ top: 'auto', bottom: '0', backgroundImage: 'linear-gradient(transparent, rgba(0,0,0,0.7))', height: '50%' }}>
                                            <div className="is-pulled-right p-3">
                                                <span className="tag is-accent is-light">{car.year}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-content">
                                        <p className="title is-5">{car.make} {car.model}</p>
                                        <p className="price-tag mb-2">${car.price?.toLocaleString()}</p>
                                    </div>
                                    <footer className="card-footer">
                                        <Link to={`/car/${car.id}`} className="card-footer-item">
                                            Ver detalles
                                        </Link>
                                    </footer>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCars;