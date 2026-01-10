import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, query, where, doc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const DBService = {
    // Lấy danh sách GV đã duyệt
    async getTeachers() {
        const q = query(collection(db, "teachers"), where("status", "==", "approved"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Gửi review mới (ẩn danh)
    async submitReview(reviewData) {
        return await addDoc(collection(db, "reviews"), {
            ...reviewData,
            status: "pending",
            createdAt: new Date().toISOString(),
            votes: { up: 0, down: 0 }
        });
    }
};