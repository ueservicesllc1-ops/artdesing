import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const googleProvider = new GoogleAuthProvider();

// Register new user
export const registerUser = async (email, password, displayName) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName,
        role: "user",
        subscriptionStatus: "free",
        subscriptionEnd: null,
        createdAt: serverTimestamp(),
        downloads: 0
    });

    return user;
};

// Login with email/password
export const loginUser = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
};

// Login with Google
export const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user doc exists, if not create it
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: user.displayName,
            role: "user",
            subscriptionStatus: "free",
            subscriptionEnd: null,
            createdAt: serverTimestamp(),
            downloads: 0
        });
    }

    return user;
};

// Logout
export const logoutUser = async () => {
    await signOut(auth);
};

// Reset password
export const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

// Get user profile from Firestore
export const getUserProfile = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
};

// Check if user has active subscription
export const hasActiveSubscription = (userProfile) => {
    if (!userProfile) return false;
    if (userProfile.role === 'admin') return true;
    if (userProfile.subscriptionStatus !== 'active') return false;
    if (userProfile.subscriptionEnd) {
        const endDate = userProfile.subscriptionEnd.toDate ? userProfile.subscriptionEnd.toDate() : new Date(userProfile.subscriptionEnd);
        return endDate > new Date();
    }
    return false;
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};
