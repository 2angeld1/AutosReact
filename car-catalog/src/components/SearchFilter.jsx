import React, { useState, useContext, useEffect } from 'react';
import { CarContext } from '../context/CarContext';

const SearchFilter = ({ onSearch }) => {
    const { cars } = useContext(CarContext);
    
    // Estado del filtro
    const [filters, setFilters] = useState({
        make: 'any',
        model: '',
        yearMin: '',
        yearMax: '',
        priceMin: '',
        priceMax: '',
        fuelType: 'any',
        transmission: 'any'
    });
    
    // Opciones para el select de marcas
    const [makeOptions, setMakeOptions] = useState([]);
    
    // Cargar opciones de marcas populares
    useEffect(() => {
        // Lista de marcas comunes para mostrar en el dropdown
        const popularMakes = [
            'toyota', 'honda', 'ford', 'chevrolet', 'nissan', 
            'bmw', 'audi', 'mercedes', 'volkswagen', 'hyundai', 
            'kia', 'subaru', 'mazda', 'lexus', 'tesla', 'porsche'
        ];
        
        // Añadir cualquier otra marca que ya tengamos en la lista de coches
        if (cars.length > 0) {
            const existingMakes = new Set(cars.map(car => car.make.toLowerCase()));
            popularMakes.forEach(make => existingMakes.add(make));
            
            // Convertir a array, ordenar y capitalizar
            const sortedMakes = [...existingMakes].sort().map(
                make => make.charAt(0).toUpperCase() + make.slice(1)
            );
            
            setMakeOptions(sortedMakes);
        } else {
            // Si no hay coches cargados, usar solo las marcas populares
            setMakeOptions(popularMakes.map(
                make => make.charAt(0).toUpperCase() + make.slice(1)
            ));
        }
    }, [cars]);
    
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
            make: 'any',
            model: '',
            yearMin: '',
            yearMax: '',
            priceMin: '',
            priceMax: '',
            fuelType: 'any',
            transmission: 'any'
        });
    };

    return (
        <form onSubmit={handleSubmit} className="search-filter-form">
            <div className="columns is-multiline">
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Marca</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select 
                                    name="make" 
                                    value={filters.make} 
                                    onChange={handleFilterChange}
                                >
                                    <option value="any">Todas las marcas</option>
                                    {makeOptions.map(make => (
                                        <option key={make.toLowerCase()} value={make.toLowerCase()}>
                                            {make}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Modelo</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="text" 
                                name="model" 
                                placeholder="Ej. Camry, Civic..." 
                                value={filters.model}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Año mínimo</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                name="yearMin" 
                                placeholder="Ej. 2015" 
                                value={filters.yearMin}
                                onChange={handleFilterChange}
                                min="1990"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Año máximo</label>
                        <div className="control">
                            <input 
                                className="input" 
                                type="number" 
                                name="yearMax" 
                                placeholder="Ej. 2023" 
                                value={filters.yearMax}
                                onChange={handleFilterChange}
                                min="1990"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="column is-6-tablet is-3-desktop">
                    <div className="field">
                        <label className="label has-text-white">Precio mínimo</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="number" 
                                name="priceMin" 
                                placeholder="Ej. 10000" 
                                value={filters.priceMin}
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
                        <label className="label has-text-white">Precio máximo</label>
                        <div className="control has-icons-left">
                            <input 
                                className="input" 
                                type="number" 
                                name="priceMax" 
                                placeholder="Ej. 50000" 
                                value={filters.priceMax}
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