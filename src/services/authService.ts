import { getAuth, signInAnonymously, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { firebaseApp } from "./firebase";

const auth = getAuth(firebaseApp);

export const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error) {
            console.error("Error signing in: ", error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return { user, signIn, logout };
};