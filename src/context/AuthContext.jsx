import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, getUserProfile } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUserProfile(null);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        refreshProfile,
        isAdmin: userProfile?.role === 'admin',
        isSubscribed: userProfile?.subscriptionStatus === 'active' || userProfile?.role === 'admin',
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
