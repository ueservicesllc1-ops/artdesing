import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    increment
} from "firebase/firestore";
import { db } from "../config/firebase";

const COLLECTION = "products";

// Create product
export const createProduct = async (productData) => {
    const docRef = await addDoc(collection(db, COLLECTION), {
        ...productData,
        downloads: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...productData };
};

// Get product by ID
export const getProduct = async (id) => {
    const docSnap = await getDoc(doc(db, COLLECTION, id));
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
};

// Get products by category
export const getProductsByCategory = async (category, pageSize = 20, lastDoc = null) => {
    try {
        let q;
        if (lastDoc) {
            q = query(
                collection(db, COLLECTION),
                where("category", "==", category),
                orderBy("createdAt", "desc"),
                startAfter(lastDoc),
                limit(pageSize)
            );
        } else {
            q = query(
                collection(db, COLLECTION),
                where("category", "==", category),
                orderBy("createdAt", "desc"),
                limit(pageSize)
            );
        }

        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

        return { products, lastVisible };
    } catch (error) {
        // Fallback si falta el índice compuesto en Firestore
        if (error.code === 'failed-precondition') {
            console.warn("Falta índice compuesto en Firestore para esta consulta. Mostrando resultados sin orden específico.");
            const q = query(
                collection(db, COLLECTION),
                where("category", "==", category),
                limit(pageSize)
            );
            const snapshot = await getDocs(q);
            return {
                products: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
                lastVisible: null
            };
        }
        throw error;
    }
};

// Get all products
export const getAllProducts = async (pageSize = 50) => {
    try {
        const q = query(
            collection(db, COLLECTION),
            orderBy("createdAt", "desc"),
            limit(pageSize)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        if (error.code === 'failed-precondition') {
            console.warn("Falta índice para getAllProducts. Cargando sin orden.");
            const q = query(collection(db, COLLECTION), limit(pageSize));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        throw error;
    }
};

// Search products by name/tags
export const searchProducts = async (searchTerm, category = null) => {
    let q;

    if (category) {
        q = query(
            collection(db, COLLECTION),
            where("category", "==", category),
            orderBy("createdAt", "desc"),
            limit(50)
        );
    } else {
        q = query(
            collection(db, COLLECTION),
            orderBy("createdAt", "desc"),
            limit(50)
        );
    }

    const snapshot = await getDocs(q);
    const searchLower = searchTerm.toLowerCase();

    return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(product =>
            product.name?.toLowerCase().includes(searchLower) ||
            product.description?.toLowerCase().includes(searchLower) ||
            product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
};

// Update product
export const updateProduct = async (id, data) => {
    await updateDoc(doc(db, COLLECTION, id), {
        ...data,
        updatedAt: serverTimestamp()
    });
};

// Delete product
export const deleteProduct = async (id) => {
    await deleteDoc(doc(db, COLLECTION, id));
};

// Increment download count
export const incrementDownloads = async (productId) => {
    await updateDoc(doc(db, COLLECTION, productId), {
        downloads: increment(1)
    });
};

// Get popular products
export const getPopularProducts = async (limitCount = 10) => {
    const q = query(
        collection(db, COLLECTION),
        orderBy("downloads", "desc"),
        limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
