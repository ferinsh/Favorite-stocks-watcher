import { createContext, useContext, useEffect, useState } from "react";
import {
    getCurrentUser,
    loginUser,
} from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(
        localStorage.getItem("accessToken")
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const userData = await getCurrentUser(accessToken);
                setUser(userData);
            } catch (error) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setAccessToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [accessToken]);

    const login = async (username, password) => {
        const data = await loginUser({
            username,
            password,
        });

        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);

        setAccessToken(data.access);

        const userData = await getCurrentUser(data.access);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};