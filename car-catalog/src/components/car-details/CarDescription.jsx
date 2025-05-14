import React from 'react';

const CarDescription = ({ car }) => {
    return (
        <div className="detail-section">
            <h3 className="title is-4 mb-3 has-text-accent">Descripción</h3>
            <div className="content">
                <p className="mb-4">{car.description || `Este ${car.make} ${car.model} ${car.year} combina estilo, rendimiento y eficiencia en un paquete excepcional.`}</p>
                <p className="has-text-grey-dark is-italic">Este {car.make} {car.model} {car.year} se encuentra en excelentes condiciones, listo para entrega inmediata.</p>
                <hr />
                <div className="car-highlights">
                    <div className="columns is-multiline">
                        <div className="column is-6">
                            <div className="highlight-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-gas-pump"></i>
                                </span>
                                <div>
                                    <p className="has-text-grey">Combustible</p>
                                    <p className="has-text-white has-text-weight-bold">{car.fuel_type}</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="highlight-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-tachometer-alt"></i>
                                </span>
                                <div>
                                    <p className="has-text-grey">Rendimiento Ciudad</p>
                                    <p className="has-text-white has-text-weight-bold">{car.city_mpg} MPG</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="highlight-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-road"></i>
                                </span>
                                <div>
                                    <p className="has-text-grey">Rendimiento Carretera</p>
                                    <p className="has-text-white has-text-weight-bold">{car.highway_mpg} MPG</p>
                                </div>
                            </div>
                        </div>
                        <div className="column is-6">
                            <div className="highlight-item">
                                <span className="icon has-text-accent">
                                    <i className="fas fa-cog"></i>
                                </span>
                                <div>
                                    <p className="has-text-grey">Transmisión</p>
                                    <p className="has-text-white has-text-weight-bold">{car.transmission}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDescription;