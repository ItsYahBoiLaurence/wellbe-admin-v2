import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { User, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../api/firebaseConfig";
import { useQueryClient } from "react-query";

type Creds = {
    email: string;
    password: string;
};

interface AuthContextType {
    user: User | null;
    login: (credentials: Creds) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthenticationContext = createContext<AuthContextType>({
    user: null,
    login: () => {
        throw new Error("login method not implemented");
    },
    logout: () => {
        throw new Error("logout method not implemented");
    }
});

const EXCLUDED_PATHS = ["/sign-in"];

export const Authentication = ({ children }: PropsWithChildren<{}>) => {
    const [user, setUser] = useState<User | null>(null);
    const location = useLocation();
    const navigate = useNavigate();


    const login = async (credentials: Creds) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );
            setUser(userCredential.user);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem("ADMIN_TOKEN", token);
        } catch (error) {
            throw error;
        }
    };

    const queryClient = useQueryClient()

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("ADMIN_TOKEN");
            localStorage.removeItem("USER_COMPANY");
            queryClient.removeQueries();
            queryClient.clear();
            navigate("/sign-in");
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    };



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            const userData = await currentUser?.getIdTokenResult()
            if (userData) {
                localStorage.setItem('USER_COMPANY', userData?.claims.company as string)
            }
            console.log(localStorage.getItem('USER_COMPANY'))
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user && EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/");
        } else if (!user && !EXCLUDED_PATHS.includes(location.pathname)) {
            navigate("/sign-in");
        }
    }, [user, location.pathname, navigate]);

    return (
        <AuthenticationContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
