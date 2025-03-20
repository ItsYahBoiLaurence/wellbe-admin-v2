import { createContext, PropsWithChildren, useEffect, useState, useCallback, useMemo } from "react";
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
    const queryClient = useQueryClient();

    // Memoize login function to prevent unnecessary re-renders
    const login = useCallback(async (credentials: Creds) => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );
            // No need to setUser here as onAuthStateChanged will handle it
            const token = await userCredential.user.getIdToken();
            localStorage.setItem("ADMIN_TOKEN", token);
        } catch (error) {
            throw error;
        }
    }, []);

    // Memoize logout function to prevent unnecessary re-renders
    const logout = useCallback(async (): Promise<void> => {
        try {
            await signOut(auth);
            // No need to setUser here as onAuthStateChanged will handle it
            localStorage.removeItem("ADMIN_TOKEN");
            localStorage.removeItem("USER_COMPANY");
            queryClient.removeQueries();
            queryClient.clear();
            // Navigation will be handled by the auth state effect
        } catch (error) {
            console.error("Logout failed", error);
            throw error;
        }
    }, [queryClient]);

    // Handle auth state changes and navigation in a single useEffect
    useEffect(() => {
        // Setup auth state listener
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                const userData = await currentUser.getIdTokenResult();
                if (userData?.claims.company) {
                    localStorage.setItem('USER_COMPANY', userData.claims.company as string);
                }

                // Handle navigation when user is authenticated
                if (EXCLUDED_PATHS.includes(location.pathname)) {
                    navigate("/");
                }

                // Invalidate queries when user changes
                queryClient.invalidateQueries();
            } else {
                // Handle navigation when user is not authenticated
                if (!EXCLUDED_PATHS.includes(location.pathname)) {
                    navigate("/sign-in");
                }
            }
        });

        // Cleanup auth listener on unmount
        return () => unsubscribe();
    }, [location.pathname, navigate, queryClient]);

    // Memoize the context value to prevent unnecessary re-renders
    const contextValue = useMemo(() => ({
        user,
        login,
        logout
    }), [user, login, logout]);

    return (
        <AuthenticationContext.Provider value={contextValue}>
            {children}
        </AuthenticationContext.Provider>
    );
};
