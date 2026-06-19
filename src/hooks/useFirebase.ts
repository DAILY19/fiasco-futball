import { useEffect, useState } from 'react';
import { db } from '../services/firebase'; // Adjust the import based on your firebase configuration
import { collection, getDocs, addDoc } from 'firebase/firestore';

const useFirebase = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'your-collection-name'));
                const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setData(fetchedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const addData = async (newData) => {
        try {
            await addDoc(collection(db, 'your-collection-name'), newData);
            setData(prevData => [...prevData, newData]);
        } catch (err) {
            setError(err);
        }
    };

    return { data, loading, error, addData };
};

export default useFirebase;