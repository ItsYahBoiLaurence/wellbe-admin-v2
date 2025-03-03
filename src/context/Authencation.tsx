import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { User, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../api/firebaseConfig";

type Creds = {
    email: string,
    password: string
}

interface AuthContextType {
    user: User | null
    login: (credentials: Creds) => Promise<void>;
    logout: () => Promise<void>
}

export const AuthenticationContext = createContext<AuthContextType>({
    user: null,
    login: () => {
        throw new Error('login method not implemented');
    },
    logout: () => {
        throw new Error('logout method not implemented');
    }
})

const EXCLUDED_PATHS = [
    '/sign-in'
]

export const Authentication = ({ children }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<User | null>(null)
    const location = useLocation()
    const navigate = useNavigate()

    const login = async (credentials: Creds) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );
            setUser(userCredential.user)
            const token = await userCredential.user.getIdToken()
            localStorage.setItem('ADMIN_TOKEN', token)
        } catch (error) {
            // Throw the entire error object for onError to inspect
            throw error;
        }
    }

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("ADMIN_TOKEN");
            navigate('/sign-in')
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (!user && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/sign-in");
        } else if (user && EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/");
        }

    }, [user, location.pathname, navigate])


    return (
        <AuthenticationContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    )
}