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
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { auth, db } from "../config/firebase";

const googleProvider = new GoogleAuthProvider();

// Update user download count and date
export const updateUserDownloadStats = async (uid, currentStats) => {
    const today = new Date().toISOString().split('T')[0];
    const userRef = doc(db, "users", uid);

    let newCount = 1;
    if (currentStats?.lastDownloadDate === today) {
        newCount = (currentStats.dailyDownloads || 0) + 1;
    }

    await updateDoc(userRef, {
        dailyDownloads: newCount,
        lastDownloadDate: today,
        totalDownloads: (currentStats?.totalDownloads || 0) + 1
    });

    return { dailyDownloads: newCount, lastDownloadDate: today };
};

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
        dailyDownloads: 0,
        lastDownloadDate: null,
        totalDownloads: 0
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
            dailyDownloads: 0,
            lastDownloadDate: null,
            totalDownloads: 0
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

// Get all users (Admin only ideally)
export const getAllUsers = async () => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// Update user subscription after payment
export const updateUserSubscription = async (uid, planName) => {
    const userRef = doc(db, "users", uid);
    const now = new Date();
    let endDate = new Date();

    // Calcular fecha de fin según el plan
    switch (planName) {
        case 'Diario':
            endDate.setDate(now.getDate() + 1);
            break;
        case 'Semanal':
            endDate.setDate(now.getDate() + 7);
            break;
        case 'Mensual':
            endDate.setMonth(now.getMonth() + 1);
            break;
        case 'Anual':
            endDate.setFullYear(now.getFullYear() + 1);
            break;
        case 'De por Vida':
            endDate.setFullYear(now.getFullYear() + 100);
            break;
        default:
            endDate.setMonth(now.getMonth() + 1);
    }

    await updateDoc(userRef, {
        subscriptionStatus: "active",
        subscriptionPlan: planName,
        subscriptionEnd: Timestamp.fromDate(endDate),
        updatedAt: serverTimestamp()
    });

    return { status: "active", endDate };
};
