import React from 'react';

const CarSpecs = ({ car }) => {
    return (
        <div>
            <h4 className="title is-4 mb-4 has-text-white">Especificaciones Técnicas</h4>
            <div className="columns is-multiline">
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Motor</h5>
                        <div className="content">
                            <p><span className="spec-label">Tipo de combustible:</span> <span className="spec-value has-text-white">{car.fuel_type}</span></p>
                            <p><span className="spec-label">Cilindros:</span> <span className="spec-value has-text-white">{car.cylinders}</span></p>
                            <p><span className="spec-label">Desplazamiento:</span> <span className="spec-value has-text-white">{car.displacement} L</span></p>
                        </div>
                    </div>
                </div>
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Transmisión</h5>
                        <div className="content">
                            <p><span className="spec-label">Tipo:</span> <span className="spec-value has-text-white">{car.transmission}</span></p>
                            <p><span className="spec-label">Tracción:</span> <span className="spec-value has-text-white">{car.drive || 'N/A'}</span></p>
                        </div>
                    </div>
                </div>
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Consumo de Combustible</h5>
                        <div className="content">
                            <p><span className="spec-label">Rendimiento:</span> <span className="spec-value has-text-white">Información disponible con suscripción premium</span></p>
                        </div>
                    </div>
                </div>
                <div className="column is-6">
                    <div className="spec-box">
                        <h5 className="title is-5 has-text-accent">Dimensiones</h5>
                        <div className="content">
                            <p><span className="spec-label">Clase:</span> <span className="spec-value has-text-white">{car.class}</span></p>
                            <p><span className="spec-label">Año:</span> <span className="spec-value has-text-white">{car.year}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarSpecs;