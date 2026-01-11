import { db } from './firebase-config.js';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const DB = {
    // --- GIÁO VIÊN ---
    async getTeachers() {
        const q = query(collection(db, "teachers"), orderBy("name"));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addTeacher(data) {
        await addDoc(collection(db, "teachers"), {
            ...data,
            ranking: 0,
            avgRating: 0,
            tags: {} // { "Vui tính": 5, "Nghiêm": 2 }
        });
    },

    // --- ĐÁNH GIÁ ---
    async getReviews(teacherId, isAdmin) {
        let q;
        if (isAdmin) {
            // Admin thấy hết
            q = query(collection(db, "reviews"), where("teacherId", "==", teacherId), orderBy("createdAt", "desc"));
        } else {
            // Guest chỉ thấy bài đã duyệt
            q = query(collection(db, "reviews"), where("teacherId", "==", teacherId), where("status", "==", "approved"), orderBy("createdAt", "desc"));
        }
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },

    async addReview(reviewData) {
        // Lưu review, trạng thái pending
        await addDoc(collection(db, "reviews"), {
            ...reviewData,
            status: "pending",
            createdAt: new Date().toISOString(),
            votes: 0
        });
        
        // Cập nhật Tags cho giáo viên (Chưa tính điểm rating vội, đợi duyệt mới tính)
        const teacherRef = doc(db, "teachers", reviewData.teacherId);
        // Logic update tag count phức tạp có thể xử lý ở Backend, ở đây ta làm đơn giản
    },

    async approveReview(reviewId, currentStatus) {
        const ref = doc(db, "reviews", reviewId);
        await updateDoc(ref, { status: "approved" });
    },

    async deleteData(collectionName, id) {
        await deleteDoc(doc(db, collectionName, id));
    }
};