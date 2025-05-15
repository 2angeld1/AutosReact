import React, { useState } from 'react';

const SearchFilter = ({ onSearch, cars }) => {
    // Estado del filtro simplificado según requisitos
    const [filters, setFilters] = useState({
        searchTerm: '', // Para marca y modelo combinados
        year: '',
        price: '',
        fuelType: 'any',
        transmission: 'any'
    });
    
    // Manejador de cambios en los inputs
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Manejador de envío de formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(filters);
    };
    
    // Manejador para limpiar filtros
    const handleClear = () => {
        setFilters({
            searchTerm: '',
            year: '',
            price: '',
            fuelType: 'any',
            transmission: 'any'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="search-filter-form">
            <div className="columns is-multiline">
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Marca y Modelo</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="text" 
                                name="searchTerm" 
                                placeholder="Ej. Toyota Corolla" 
                                value={filters.searchTerm}
                                onChange={handleFilterChange}
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-car"></i>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Año</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                name="year" 
                                placeholder="Ej. 2022" 
                                value={filters.year}
                                onChange={handleFilterChange}
                                min="1990"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Precio</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="number" 
                                name="price" 
                                placeholder="Presupuesto máximo" 
                                value={filters.price}
                                onChange={handleFilterChange}
                                min="0"
                            />
                            <span className="icon is-small is-left">
                                <i className="fas fa-dollar-sign"></i>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Combustible</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select 
                                    name="fuelType" 
                                    value={filters.fuelType} 
                                    onChange={handleFilterChange}
                                >
                                    <option value="any">Todos</option>
                                    <option value="gas">Gasolina</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="electricity">Eléctrico</option>
                                    <option value="hybrid">Híbrido</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Transmisión</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select 
                                    name="transmission" 
                                    value={filters.transmission} 
                                    onChange={handleFilterChange}
                                >
                                    <option value="any">Todas</option>
                                    <option value="a">Automática</option>
                                    <option value="m">Manual</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="column is-12 has-text-centered">
                    <div className="field is-grouped is-grouped-centered mt-4">
                        <div className="control">
                            <button 
                                type="submit" 
                                className="button is-accent is-medium"
                            >
                                <span className="icon">
                                    <i className="fas fa-search"></i>
                                </span>
                                <span>Buscar</span>
                            </button>
                        </div>
                        <div className="control">
                            <button 
                                type="button" 
                                className="button is-light is-medium"
                                onClick={handleClear}
                            >
                                <span className="icon">
                                    <i className="fas fa-times"></i>
                                </span>
                                <span>Limpiar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default SearchFilter;