import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import { CarContext } from '../context/CarContext';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import DotPattern from '../components/DotPattern';
import { fetchFeaturedCars, searchCars } from '../services/api';

const Home = () => {
    const { cars, loading } = useContext(CarContext);
    
    // Estado para vehículos destacados (independiente)
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slidesToShow = 4; // Cuántos slides mostrar a la vez en el carrusel
    
    // Estado para resultados de búsqueda
    const [searchResults, setSearchResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    
    // Cargar vehículos destacados al montar el componente
    useEffect(() => {
        const loadFeaturedCars = async () => {
            try {
                setLoadingFeatured(true);
                // Llamada a la API específica para obtener vehículos destacados
                const featured = await fetchFeaturedCars();
                setFeaturedCars(featured);
            } catch (error) {
                console.error("Error loading featured cars:", error);
            } finally {
                setLoadingFeatured(false);
            }
        };
        
        loadFeaturedCars();
    }, []);

    // Manejadores para el carrusel
    const nextSlide = () => {
        setCurrentSlide(current => 
            current + slidesToShow >= featuredCars.length ? 0 : current + slidesToShow
        );
    };

    const prevSlide = () => {
        setCurrentSlide(current => 
            current - slidesToShow < 0 ? Math.max(0, featuredCars.length - slidesToShow) : current - slidesToShow
        );
    };
    
    // Manejador para la búsqueda personalizada
    const handleSearch = async (filters) => {
        try {
            setSearchLoading(true);
            setSearchError(null);
            
            // Llamar a la API para buscar globalmente
            const results = await searchCars(filters);
            
            setSearchResults(results);
            setHasSearched(true);
        } catch (error) {
            console.error("Error searching cars:", error);
            setSearchError("Ocurrió un error al buscar. Por favor intenta nuevamente.");
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    return (
        <div>
            {/* Hero Section Rediseñado */}
            <section className="hero is-fullheight-with-navbar luxury-dark-hero">
                {/* Patrón de puntos SVG */}
                <DotPattern />
                
                <div className="hero-body">
                    <div className="container">
                        <div className="columns is-vcentered">
                            <div className="column is-6 animate-fadeIn">
                                <h1 className="title is-1 has-text-white luxury-title">
                                    Descubre la Excelencia<br />en Cada Vehículo
                                </h1>
                                <div className="luxury-divider"></div>
                                <h2 className="subtitle has-text-white-bis is-4 mb-6 luxury-subtitle">
                                    Selección premium de automóviles para quienes buscan exclusividad y rendimiento superior.
                                </h2>
                                
                                <div className="features-list mb-6">
                                    <div className="feature-item luxury">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="has-text-white-bis">Financiamiento personalizado</span>
                                    </div>
                                    <div className="feature-item luxury">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="has-text-white-bis">Garantía extendida en toda la flota</span>
                                    </div>
                                    <div className="feature-item luxury">
                                        <span className="icon has-text-accent">
                                            <i className="fas fa-check-circle"></i>
                                        </span>
                                        <span className="has-text-white-bis">Servicio de entrega a domicilio</span>
                                    </div>
                                </div>
                                
                                <div className="buttons are-medium">
                                    <a href="#featured-cars" className="button is-accent luxury-button">
                                        <span className="icon">
                                            <i className="fas fa-car"></i>
                                        </span>
                                        <span>Explorar Vehículos</span>
                                    </a>
                                    <a href="#search" className="button is-outlined is-light luxury-button-outline">
                                        <span className="icon">
                                            <i className="fas fa-search"></i>
                                        </span>
                                        <span>Búsqueda Avanzada</span>
                                    </a>
                                </div>
                                
                                <div className="mt-6 luxury-badge">
                                    <span className="icon has-text-accent">
                                        <i className="fas fa-bolt"></i>
                                    </span>
                                    <span className="has-text-white-bis">Nuevos modelos 2025 disponibles</span>
                                </div>
                            </div>
                            <div className="column is-6 is-hidden-mobile">
                                <div className="luxury-car-showcase">
                                    <img 
                                        src="https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" 
                                        alt="Ford Mustang destacado" 
                                        className="luxury-car-image" 
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/800x500/1a1a1a/bb86fc?text=Ford+Mustang";
                                        }}
                                    />
                                    <div className="luxury-car-details">
                                        <span className="tag is-accent mb-2">Destacado</span>
                                        <h3 className="title is-4 has-text-white mb-1">Ford Mustang GT</h3>
                                        <p className="has-text-grey-lighter mb-3">Potencia y diseño icónico</p>
                                        <a href="#featured-cars" className="button is-small is-accent is-outlined">Ver detalles</a>
                                    </div>
                                    <div className="luxury-car-specs">
                                        <div className="spec-item">
                                            <span className="spec-value">460</span>
                                            <span className="spec-label">HP</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-value">4.2</span>
                                            <span className="spec-label">0-60</span>
                                        </div>
                                        <div className="spec-item">
                                            <span className="spec-value">V8</span>
                                            <span className="spec-label">Motor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Características destacadas en footer */}
                <div className="hero-footer pb-6 pt-3 luxury-hero-footer">
                    <div className="container">
                        <div className="columns has-text-centered is-mobile feature-row">
                            <div className="column animate-fadeIn">
                                <div className="luxury-feature-icon">
                                    <i className="fas fa-tachometer-alt"></i>
                                </div>
                                <p className="has-text-white-bis mt-2">Alto Rendimiento</p>
                                <div className="luxury-feature-underline"></div>
                            </div>
                            <div className="column animate-fadeIn" style={{animationDelay: "0.2s"}}>
                                <div className="luxury-feature-icon">
                                    <i className="fas fa-tag"></i>
                                </div>
                                <p className="has-text-white-bis mt-2">Mejores Precios</p>
                                <div className="luxury-feature-underline"></div>
                            </div>
                            <div className="column animate-fadeIn" style={{animationDelay: "0.4s"}}>
                                <div className="luxury-feature-icon">
                                    <i className="fas fa-shield-alt"></i>
                                </div>
                                <p className="has-text-white-bis mt-2">Seguridad Total</p>
                                <div className="luxury-feature-underline"></div>
                            </div>
                            <div className="column animate-fadeIn" style={{animationDelay: "0.6s"}}>
                                <div className="luxury-feature-icon">
                                    <i className="fas fa-headset"></i>
                                </div>
                                <p className="has-text-white-bis mt-2">Soporte 24/7</p>
                                <div className="luxury-feature-underline"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Vehículos Destacados - Carrusel (Independiente) */}
            <section className="section" id="featured-cars">
                <div className="container">
                    <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                        Vehículos Destacados
                    </h2>
                    <p className="subtitle has-text-centered has-text-grey-light mb-6">
                        Una selección exclusiva de nuestros mejores modelos
                    </p>
                    
                    {!loadingFeatured && featuredCars.length > 0 && (
                        <div className="carousel-container">
                            <button 
                                className="carousel-button prev-button" 
                                onClick={prevSlide}
                                aria-label="Ver autos anteriores"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>
                            
                            <div className="carousel-wrapper">
                                <div 
                                    className="carousel-track" 
                                    style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
                                >
                                    {featuredCars.map(car => (
                                        <div key={car.id} className="carousel-item">
                                            <div className="card">
                                                <div className="card-image">
                                                    <figure className="image is-3by2">
                                                        <img 
                                                            src={car.image} 
                                                            alt={`${car.make} ${car.model}`}
                                                            className="car-image"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `https://via.placeholder.com/400x267/1a1a1a/bb86fc?text=${car.make}+${car.model}`;
                                                            }}
                                                        />
                                                        <span className="car-brand-badge">{car.make}</span>
                                                    </figure>
                                                </div>
                                                <div className="card-content">
                                                    <p className="title is-5">{car.make} {car.model}</p>
                                                    <p className="subtitle is-6">
                                                        <span className="tag is-year mr-1">{car.year}</span>
                                                    </p>
                                                    <p className="price-tag mb-2">${car.price?.toLocaleString()}</p>
                                                    <div className="tags">
                                                        <span className="tag is-feature">{car.fuel_type}</span>
                                                        <span className="tag is-feature">{car.cylinders} cil.</span>
                                                    </div>
                                                </div>
                                                <footer className="card-footer">
                                                    <Link to={`/car/${car.id}`} className="card-footer-item button is-accent">
                                                        <span className="icon">
                                                            <i className="fas fa-eye"></i>
                                                        </span>
                                                        <span>Ver detalles</span>
                                                    </Link>
                                                </footer>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button 
                                className="carousel-button next-button" 
                                onClick={nextSlide}
                                aria-label="Ver más autos"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    )}
                    
                    {loadingFeatured && (
                        <div className="has-text-centered p-6">
                            <div className="button is-loading is-large is-white"></div>
                            <p className="mt-4 is-size-5 has-text-grey-light">Cargando vehículos destacados...</p>
                        </div>
                    )}
                    
                    <div className="has-text-centered mt-6">
                        <Link to="/catalog" className="button is-accent is-medium">
                            <span className="icon">
                                <i className="fas fa-th-large"></i>
                            </span>
                            <span>Ver catálogo completo</span>
                        </Link>
                    </div>
                </div>
            </section>
            
            {/* Sección de Categorías Populares */}
            <section className="section has-background-black-ter">
                <div className="container">
                    <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                        Categorías Populares
                    </h2>
                    <p className="subtitle has-text-centered has-text-grey-light mb-6">
                        Explora vehículos según tus preferencias
                    </p>
                    
                    <div className="columns is-multiline">
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="Sedanes" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/400x200/1a1a1a/bb86fc?text=Sedanes";
                                    }}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">Sedanes</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="SUVs" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/400x200/1a1a1a/bb86fc?text=SUVs";
                                    }}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">SUVs</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/3752169/pexels-photo-3752169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="Deportivos" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/400x200/1a1a1a/bb86fc?text=Deportivos";
                                    }}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">Deportivos</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="column is-3-desktop is-6-tablet">
                            <div className="category-card animate-fadeIn">
                                <img 
                                    src="https://images.pexels.com/photos/2526127/pexels-photo-2526127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750" 
                                    alt="Eléctricos" 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/400x200/1a1a1a/bb86fc?text=Eléctricos";
                                    }}
                                />
                                <div className="category-overlay">
                                    <h3 className="title is-4 has-text-white mb-2">Eléctricos</h3>
                                    <Link to="#" className="button is-small is-secondary-accent is-outlined">
                                        Ver todos
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Statistics */}
            <Stats />
            
            {/* Búsqueda Personalizada (Independiente) */}
            <section className="section" id="search">
                <div className="container">
                    <h2 className="title is-2 has-text-centered animate-fadeIn section-title">
                        Búsqueda Personalizada
                    </h2>
                    <p className="subtitle has-text-centered has-text-grey-light mb-6">
                        Encuentra el auto perfecto para ti con nuestros filtros avanzados
                    </p>
                    
                    <div className="box has-background-dark has-shadow animate-fadeIn">
                        <SearchFilter onSearch={handleSearch} />
                    </div>
                    
                    {/* Mostrar estado de carga durante la búsqueda */}
                    {searchLoading && (
                        <div className="has-text-centered p-6">
                            <div className="button is-loading is-large is-white"></div>
                            <p className="mt-4 is-size-5 has-text-grey-light">Buscando vehículos...</p>
                        </div>
                    )}
                    
                    {/* Mostrar error si ocurre */}
                    {searchError && (
                        <div className="notification is-danger mt-5">
                            <button className="delete" onClick={() => setSearchError(null)}></button>
                            {searchError}
                        </div>
                    )}
                    
                    {/* Resultados de búsqueda */}
                    {hasSearched && !searchLoading && (
                        <div className="search-results mt-6">
                            <h3 className="title is-4 mb-4">
                                {searchResults.length > 0 
                                    ? `Se encontraron ${searchResults.length} vehículos` 
                                    : "No se encontraron vehículos con esos criterios"}
                            </h3>
                            
                            {searchResults.length > 0 && (
                                <div className="columns is-multiline">
                                    {searchResults.map(car => (
                                        <div key={car.id} className="column is-3-desktop is-6-tablet">
                                            <div className="card">
                                                <div className="card-image">
                                                    <figure className="image is-3by2">
                                                        <img 
                                                            src={car.image} 
                                                            alt={`${car.make} ${car.model}`}
                                                            className="car-image"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `https://via.placeholder.com/400x267/1a1a1a/bb86fc?text=${car.make}+${car.model}`;
                                                            }}
                                                        />
                                                        <span className="car-brand-badge">{car.make}</span>
                                                    </figure>
                                                </div>
                                                <div className="card-content">
                                                    <p className="title is-5">{car.make} {car.model}</p>
                                                    <p className="subtitle is-6">
                                                        <span className="tag is-year mr-1">{car.year}</span>
                                                    </p>
                                                    <p className="price-tag mb-2">${car.price?.toLocaleString()}</p>
                                                    <div className="tags">
                                                        <span className="tag is-feature">{car.fuel_type}</span>
                                                        <span className="tag is-feature">{car.cylinders} cil.</span>
                                                    </div>
                                                </div>
                                                <footer className="card-footer">
                                                    <Link to={`/car/${car.id}`} className="card-footer-item button is-accent">
                                                        <span className="icon">
                                                            <i className="fas fa-eye"></i>
                                                        </span>
                                                        <span>Ver detalles</span>
                                                    </Link>
                                                </footer>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Botón para cargar más resultados si hay muchos */}
                            {searchResults.length > 0 && searchResults.length % 12 === 0 && (
                                <div className="has-text-centered mt-6">
                                    <button 
                                        className="button is-outlined is-accent is-medium"
                                        onClick={() => {
                                            // Aquí se podría implementar paginación o carga de más resultados
                                            alert("Función para cargar más resultados en desarrollo");
                                        }}
                                    >
                                        <span className="icon">
                                            <i className="fas fa-plus"></i>
                                        </span>
                                        <span>Cargar más</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
            
            {/* Testimonials */}
            <Testimonials />
            
            {/* Call to Action */}
            <section className="section newsletter-section">
                <div className="container">
                    <div className="columns is-vcentered">
                        <div className="column is-6">
                            <h3 className="title is-3 has-text-white mb-4">¡Mantente informado!</h3>
                            <p className="subtitle has-text-white-bis mb-5">
                                Recibe las últimas noticias y ofertas especiales directamente en tu correo electrónico.
                            </p>
                        </div>
                        <div className="column is-6">
                            <div className="field has-addons">
                                <div className="control is-expanded">
                                    <input className="input is-medium" type="email" placeholder="Tu correo electrónico" />
                                </div>
                                <div className="control">
                                    <button className="button is-medium is-accent">
                                        Suscribirse
                                    </button>
                                </div>
                            </div>
                            <p className="has-text-grey-light is-size-7 mt-2">
                                Al suscribirte aceptas nuestra política de privacidad. Nunca compartiremos tu correo electrónico.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;