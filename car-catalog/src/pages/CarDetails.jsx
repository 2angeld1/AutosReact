import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCarById, getHighResCarImage } from '../services/api';
import { CarContext } from '../context/CarContext';

// Componentes
import CarHero from '../components/car-details/CarHero';
import CarGallery from '../components/car-details/CarGallery';
import CarDescription from '../components/car-details/CarDescription';
import CarTabs from '../components/car-details/CarTabs';
import CarSimilar from '../components/car-details/CarSimilar';
import SidebarComponents from '../components/car-details/SidebarComponents';

const CarDetails = () => {
    const { id } = useParams();
    const { cars, toggleFavorite, isFavorite } = useContext(CarContext);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imgError, setImgError] = useState(false);
    const [similarCars, setSimilarCars] = useState([]);
    const [bgImage, setBgImage] = useState(''); // Estado para la imagen de fondo
    const [bgLoading, setBgLoading] = useState(true); // Agregar un estado de carga específico para la imagen de fondo
    
    useEffect(() => {
        const getCar = async () => {
            try {
                setLoading(true);
                setBgLoading(true);
                const data = await fetchCarById(id);
                setCar(data);
                setError(null);
                
                // Obtener imagen de alta resolución para el fondo
                try {
                    const highResImage = await getHighResCarImage(data.make, data.model, data.year);
                    
                    // Precargar la imagen
                    const img = new Image();
                    img.onload = () => {
                        setBgImage(highResImage);
                        setBgLoading(false);
                    };
                    img.onerror = () => {
                        setBgImage(data.image);
                        setBgLoading(false);
                    };
                    img.src = highResImage;
                } catch (imgErr) {
                    console.error("Error cargando imagen de alta resolución:", imgErr);
                    setBgImage(data.image);
                    setBgLoading(false);
                }
                
                // Encontrar autos similares
                if (cars.length > 0) {
                    const similar = cars
                        .filter(otherCar => 
                            (otherCar.make === data.make || otherCar.class === data.class) && 
                            otherCar.id !== data.id
                        )
                        .slice(0, 4);
                    setSimilarCars(similar);
                }
            } catch (err) {
                setError(err.message);
                setBgLoading(false);
            } finally {
                setLoading(false);
            }
        };

        getCar();
        
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [id, cars]);

    const handleImageError = () => {
        setImgError(true);
    };

    if (loading) return (
        <div className="container has-text-centered section animated">
            <div className="loader-wrapper">
                <div className="loader is-loading"></div>
            </div>
            <p className="mt-4 is-size-5 has-text-accent">Cargando detalles del vehículo...</p>
        </div>
    );
    
    if (error) return (
        <div className="container section animated">
            <div className="notification is-danger is-light has-text-centered">
                <p className="is-size-5">Error: {error}</p>
                <Link to="/" className="button is-danger mt-4">Volver al inicio</Link>
            </div>
        </div>
    );
    
    if (!car) return (
        <div className="container section animated">
            <div className="notification is-warning is-light has-text-centered">
                <p className="is-size-5">No se encontró el automóvil solicitado</p>
                <Link to="/" className="button is-warning mt-4">Volver al inicio</Link>
            </div>
        </div>
    );

    return (
        <div className="animated has-background-dark">
            {/* Hero de detalles con imagen de fondo de alta resolución */}
            <section className={`car-detail-hero ${bgLoading ? 'loading' : ''}`} style={{ 
                background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${bgImage || (car?.image)}) no-repeat center center`, 
                backgroundSize: 'cover'
            }}>
                <div className="container pt-6 pb-6">
                    <nav className="breadcrumb has-bullet-separator is-centered" aria-label="breadcrumbs">
                        <ul>
                            <li><Link to="/" className="has-text-white-bis">Inicio</Link></li>
                            <li><Link to="/" className="has-text-white-bis">Catálogo</Link></li>
                            <li className="is-active"><a href="#" className="has-text-accent">{car.make} {car.model}</a></li>
                        </ul>
                    </nav>
                
                    <div className="columns is-vcentered mt-5">
                        <div className="column is-7">
                            <h1 className="title is-1 has-text-white">{car.make} {car.model}</h1>
                            <h2 className="subtitle is-3 has-text-accent">{car.year}</h2>
                            
                            <div className="car-highlights horizontal mt-5 mb-5">
                                <div className="highlight-item">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-gas-pump"></i>
                                    </span>
                                    <div>
                                        <p className="has-text-grey">Combustible</p>
                                        <p className="has-text-white has-text-weight-bold">{car.fuel_type}</p>
                                    </div>
                                </div>
                                
                                <div className="highlight-item">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-cog"></i>
                                    </span>
                                    <div>
                                        <p className="has-text-grey">Transmisión</p>
                                        <p className="has-text-white has-text-weight-bold">{car.transmission}</p>
                                    </div>
                                </div>
                                
                                <div className="highlight-item">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-compress-arrows-alt"></i>
                                    </span>
                                    <div>
                                        <p className="has-text-grey">Cilindros</p>
                                        <p className="has-text-white has-text-weight-bold">{car.cylinders}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="buttons are-medium">
                                <button 
                                    className={`button ${isFavorite(car.id) ? 'is-danger' : 'is-outlined is-light'}`}
                                    onClick={() => toggleFavorite(car.id)}
                                >
                                    <span className="icon">
                                        <i className={`fas fa-heart`}></i>
                                    </span>
                                    <span>{isFavorite(car.id) ? 'En favoritos' : 'Agregar a favoritos'}</span>
                                </button>
                                
                                <button className="button is-outlined is-accent">
                                    <span className="icon">
                                        <i className="fas fa-share-alt"></i>
                                    </span>
                                    <span>Compartir</span>
                                </button>
                                
                                <a href="#contacto" className="button is-accent">
                                    <span className="icon">
                                        <i className="fas fa-phone"></i>
                                    </span>
                                    <span>Contactar</span>
                                </a>
                            </div>
                        </div>
                        <div className="column is-5">
                            <div className="price-card glowing-border">
                                <div className="price-card-content has-text-centered">
                                    <p className="is-size-4 has-text-white has-text-weight-light">Precio de lista</p>
                                    <p className="is-size-1 has-text-accent has-text-weight-bold mb-3">${car.price.toLocaleString()}</p>
                                    <p className="has-text-white-bis mb-4">Financiamiento disponible</p>
                                    
                                    <div className="financing-preview mb-4">
                                        <div className="columns is-mobile">
                                            <div className="column has-text-centered">
                                                <p className="has-text-grey-light">Enganche</p>
                                                <p className="has-text-white has-text-weight-bold">${(car.price * 0.20).toLocaleString()}</p>
                                            </div>
                                            <div className="column has-text-centered">
                                                <p className="has-text-grey-light">Mensualidad</p>
                                                <p className="has-text-white has-text-weight-bold">${Math.round(car.price * 0.80 / 48).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="buttons is-centered">
                                        <a href="#financiamiento" className="button is-secondary-accent is-fullwidth">
                                            <span className="icon">
                                                <i className="fas fa-calculator"></i>
                                            </span>
                                            <span>Calcular financiamiento</span>
                                        </a>
                                        <a href="#contacto" className="button is-outlined is-light is-fullwidth">
                                            <span className="icon">
                                                <i className="fas fa-envelope"></i>
                                            </span>
                                            <span>Solicitar información</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="container p-4">                
                <div className="columns">
                    <div className="column is-8">
                        {/* Galería de imágenes */}
                        <div className="detail-section detail-gallery">
                            <CarGallery 
                                car={car} 
                                imgError={imgError} 
                                onImageError={handleImageError} 
                            />
                            
                            {/* Descripción */}
                            <div className="mt-5">
                                <h3 className="title is-4 mb-3 has-text-accent">Descripción</h3>
                                <p className="mb-4 has-text-white-bis">{car.description || `Este ${car.make} ${car.model} ${car.year} combina estilo, rendimiento y eficiencia en un paquete excepcional.`}</p>
                                <p className="has-text-grey-light is-italic">Este vehículo se encuentra en excelentes condiciones, listo para entrega inmediata.</p>
                            </div>
                        </div>
                        
                        {/* Tabs con más información */}
                        <div className="detail-section">
                            <CarTabs car={car} />
                        </div>
                        
                        {/* Autos similares */}
                        {similarCars.length > 0 && (
                            <div className="detail-section">
                                <CarSimilar similarCars={similarCars} />
                            </div>
                        )}
                    </div>
                    
                    <div className="column is-4">
                        {/* Sidebar con contacto y más información */}
                        <div className="sticky-sidebar">
                            <SidebarComponents car={car} />
                        </div>
                    </div>
                </div>
                
                {/* Botones inferiores */}
                <div className="buttons is-centered mt-6 mb-6">
                    <Link to="/" className="button is-medium is-outlined is-accent">
                        <span className="icon">
                            <i className="fas fa-arrow-left"></i>
                        </span>
                        <span>Volver al catálogo</span>
                    </Link>
                </div>
            </div>
            
            {/* Chat flotante */}
            <div className="help-button animate-pulse">
                <i className="fas fa-comments"></i>
            </div>
        </div>
    );
};

export default CarDetails;