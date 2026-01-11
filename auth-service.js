import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export const AuthService = {
    async login(username, password) {
        // Hardcode check theo yêu cầu của bạn
        if (username === 'admin' && password === 'loteteu') {
            // Đăng nhập một email "giả" trên Firebase để lấy token phiên làm việc
            // Bạn cần tạo user này trên Firebase Console 1 lần: admin@ltt.com / loteteu
            try {
                await signInWithEmailAndPassword(auth, "admin@ltt.com", "loteteu");
                return true;
            } catch (e) {
                alert("Lỗi kết nối server: " + e.message);
                return false;
            }
        } else {
            alert("Sai tài khoản hoặc mật khẩu!");
            return false;
        }
    },

    checkAdminAccess() {
        onAuthStateChanged(auth, (user) => {
            if (!user || user.email !== "admin@ltt.com") {
                window.location.href = 'landing.html';
            }
        });
    },

    logout() {
        signOut(auth).then(() => window.location.href = 'landing.html');
    }
};