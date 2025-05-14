import React from 'react';
import { Link } from 'react-router-dom';

const CarSimilar = ({ similarCars }) => {
    return (
        <div className="detail-section">
            <h3 className="title is-4 mb-4 has-text-accent">Vehículos similares</h3>
            <div className="columns is-multiline">
                {similarCars.map(similarCar => (
                    <div className="column is-6" key={similarCar.id}>
                        <Link to={`/car/${similarCar.id}`} className="similar-car-card">
                            <div className="similar-car-image">
                                <img src={similarCar.image} alt={`${similarCar.make} ${similarCar.model}`} />
                            </div>
                            <div className="similar-car-content">
                                <h4 className="is-size-5 has-text-white">{similarCar.make} {similarCar.model}</h4>
                                <p className="has-text-grey-light">{similarCar.year}</p>
                                <p className="has-text-accent has-text-weight-bold">${similarCar.price.toLocaleString()}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarSimilar;