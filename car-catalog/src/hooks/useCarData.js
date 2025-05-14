import { useState, useEffect } from 'react';
import { fetchCars } from '../services/api';

const useCarData = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getCars = async () => {
            try {
                const data = await fetchCars();
                setCars(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        getCars();
    }, []);

    return { cars, loading, error };
};

export default useCarData;