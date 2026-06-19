import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInAnonymously = async () => {
        setLoading(true);
        try {
            const userCredential = await auth.signInAnonymously();
            setUser(userCredential.user);
        } catch (error) {
            console.error("Error signing in anonymously:", error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await auth.signOut();
            setUser(null);
        } catch (error) {
            console.error("Error signing out:", error);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, signInAnonymously, signOut };
};

export default useAuth;