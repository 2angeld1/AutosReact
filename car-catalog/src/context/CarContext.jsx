import React, { createContext, useState, useEffect } from 'react';
import { fetchCars, searchCars } from '../services/api';

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  // Cargar autos al iniciar
  useEffect(() => {
    const loadInitialCars = async () => {
      try {
        setLoading(true);
        const initialCars = await fetchCars();
        setCars(initialCars);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Cargar favoritos desde localStorage
    const loadFavorites = () => {
      try {
        const savedFavorites = localStorage.getItem('carFavorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (err) {
        console.error('Error loading favorites from localStorage:', err);
      }
    };
    
    loadFavorites();
    loadInitialCars();
  }, []);
  
  // Guardar favoritos en localStorage cuando cambian
  useEffect(() => {
    try {
      localStorage.setItem('carFavorites', JSON.stringify(favorites));
    } catch (err) {
      console.error('Error saving favorites to localStorage:', err);
    }
  }, [favorites]);
  
  // Manejar búsqueda
  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const searchResults = await searchCars(filters);
      setCars(searchResults);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Comprobar si un auto está en favoritos
  const isFavorite = (carId) => {
    return favorites.includes(carId);
  };
  
  // Añadir o quitar un auto de favoritos
  const toggleFavorite = (carId) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(carId)) {
        return prevFavorites.filter(id => id !== carId);
      } else {
        return [...prevFavorites, carId];
      }
    });
  };
  
  // Obtener autos favoritos
  const getFavorites = () => {
    return cars.filter(car => favorites.includes(car.id));
  };
  
  return (
    <CarContext.Provider value={{
      cars,
      loading,
      error,
      handleSearch,
      favorites,
      isFavorite,
      toggleFavorite,
      getFavorites
    }}>
      {children}
    </CarContext.Provider>
  );
};