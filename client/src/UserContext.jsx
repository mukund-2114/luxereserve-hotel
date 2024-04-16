import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('/profile');
                setUser(response.data);
                setReady(true);
                setError(null); // Reset error state
            } catch (error) {
                if (error.response) {
                    // Server responded with an error status
                    const { status, data } = error.response;
                    if (status === 401) {
                        setError(data.message); // JWT expired or unauthorized
                    } else {
                        setError('Server error. Please try again later.');
                    }
                } else if (error.request) {
                    // No response received from server
                    setError('No response from server. Please try again.');
                } else {
                    // Other error occurred
                    setError('Request failed. Please check your internet connection.');
                }
                setUser(null); // Clear user data on error
                setReady(true); // Mark context as ready even if error occurs
            }
        };

        if (!user) {
            fetchUserProfile();
        }
    }, [user]); // Add user dependency to prevent continuous fetching

    return (
        <UserContext.Provider value={{ user, setUser, ready, error }}>
            {children}
        </UserContext.Provider>
    );
}
