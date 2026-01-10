import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthService = {
    // Đăng nhập Admin
    async login(email, password) {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = 'admin.html';
        } catch (error) {
            alert("Sai tài khoản quản trị!");
        }
    },

    // Kiểm tra quyền (đặt trong admin.html)
    checkAuth() {
        onAuthStateChanged(auth, (user) => {
            if (!user) window.location.href = 'index.html';
        });
    },

    async logout() {
        await signOut(auth);
        window.location.href = 'index.html';
    }
};