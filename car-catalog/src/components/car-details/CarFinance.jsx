import React from 'react';

const CarFinance = ({ car }) => {
    return (
        <div id="financiamiento">
            <h4 className="title is-4 mb-4">Opciones de Financiamiento</h4>
            <div className="columns">
                <div className="column is-7">
                    <div className="finance-card">
                        <h5 className="title is-5 mb-4">Calculadora de Pagos</h5>
                        <div className="field">
                            <label className="label">Precio del vehículo</label>
                            <div className="control">
                                <input className="input" type="text" value={`$${car.price.toLocaleString()}`} readOnly />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Enganche (20%)</label>
                            <div className="control">
                                <input className="input" type="text" value={`$${(car.price * 0.2).toLocaleString()}`} readOnly />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Plazo</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select>
                                        <option>24 meses</option>
                                        <option>36 meses</option>
                                        <option selected>48 meses</option>
                                        <option>60 meses</option>
                                        <option>72 meses</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Tasa de interés anual</label>
                            <div className="control">
                                <input className="input" type="text" value="7.9%" readOnly />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Pago mensual estimado</label>
                            <div className="control">
                                <input className="input is-primary has-text-weight-bold" type="text" value={`$${Math.round((car.price * 0.8) / 48 * 1.079).toLocaleString()}`} readOnly />
                            </div>
                        </div>
                        <div className="has-text-centered mt-5">
                            <button className="button is-primary">
                                <span className="icon">
                                    <i className="fas fa-file-contract"></i>
                                </span>
                                <span>Solicitar financiamiento</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="column is-5">
                    <div className="finance-info-card">
                        <h5 className="title is-5 mb-4">Beneficios de nuestro financiamiento</h5>
                        <ul className="benefits-list">
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Tasas competitivas desde 7.9%</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Aprobación en 24 horas</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Sin penalización por pago anticipado</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Plazos flexibles de 24 a 72 meses</span>
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                <span>Incluye seguro por un año</span>
                            </li>
                        </ul>
                        <div className="mt-4 has-text-centered">
                            <button className="button is-outlined is-accent">
                                <span className="icon">
                                    <i className="fas fa-info-circle"></i>
                                </span>
                                <span>Más información</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <p className="has-text-grey is-size-7 mt-4 has-text-centered">*Los cálculos son aproximados. Consulta a un asesor para información exacta.</p>
        </div>
    );
};

export default CarFinance;