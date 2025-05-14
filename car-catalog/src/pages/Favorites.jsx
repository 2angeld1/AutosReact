import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CarContext } from '../context/CarContext';
import CarCard from '../components/CarCard';

const Favorites = () => {
    const { getFavorites } = useContext(CarContext);
    const favoriteCars = getFavorites();

    return (
        <div className="container">
            <section className="hero is-info is-bold mb-6">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title is-1 has-text-centered">
                            Mis Favoritos
                        </h1>
                        <h2 className="subtitle has-text-centered">
                            Aquí encontrarás todos tus autos favoritos
                        </h2>
                    </div>
                </div>
            </section>
            
            <div className="section">
                {favoriteCars.length === 0 ? (
                    <div className="notification is-warning is-light has-text-centered">
                        <p className="is-size-4 mb-4">No tienes autos favoritos</p>
                        <p className="is-size-6 mb-4">Explora nuestro catálogo y agrega algunos autos a tus favoritos</p>
                        <Link to="/" className="button is-primary">
                            Ir al catálogo
                        </Link>
                    </div>
                ) : (
                    <div className="columns is-multiline">
                        {favoriteCars.map(car => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorites;