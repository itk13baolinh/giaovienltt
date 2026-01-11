import { AuthService } from './auth-service.js';
import { DB } from './db-service.js';
import { ModalRenderer } from './modal-renderer.js';
import { Utils } from './utils.js';

// Bảo vệ trang
AuthService.checkAdminAccess();
document.getElementById('btnLogout').onclick = AuthService.logout;

let teachers = [];

async function initAdmin() {
    teachers = await DB.getTeachers();
    renderTeacherList();
    // (Phần duyệt review có thể viết thêm logic lấy review pending ở đây)
}

function renderTeacherList() {
    document.getElementById('adminTeacherList').innerHTML = teachers.map(t => `
        <div onclick="window.openDetailAdmin('${t.id}')" class="bg-white p-4 rounded-xl border hover:shadow-md cursor-pointer flex justify-between items-center">
            <div class="flex items-center gap-3">
                <img src="${Utils.getAvatar(t.gender)}" class="w-10 h-10 rounded-full bg-slate-100">
                <div class="font-bold text-sm">${t.name}</div>
            </div>
            <span class="text-xs bg-slate-100 px-2 py-1 rounded">${t.subject}</span>
        </div>
    `).join('');
}

// Window functions
window.addTeacher = async () => {
    const name = document.getElementById('addName').value;
    const year = document.getElementById('addYear').value;
    const gender = document.getElementById('addGender').value;
    const subject = document.getElementById('addSubj').value;

    if(!name || !year) return alert("Nhập thiếu thông tin!");

    await DB.addTeacher({ name, birthYear: year, gender, subject });
    alert("Đã thêm giáo viên!");
    location.reload();
};

window.openDetailAdmin = async (id) => {
    const t = teachers.find(x => x.id === id);
    const html = await ModalRenderer.renderTeacherDetail(t, true); // true = admin mode
    document.getElementById('modalContainer').innerHTML = html;
};

// Admin Logic cho Modal (Duyệt/Xóa)
window.AdminLogic = {
    async approveReview(id) {
        if(confirm("Duyệt bài này?")) {
            await DB.approveReview(id);
            alert("Đã duyệt!");
            document.querySelector('.modal-overlay').remove(); // Đóng để reload lại
        }
    },
    async deleteReview(id) {
        if(confirm("Xóa vĩnh viễn?")) {
            await DB.deleteData('reviews', id);
            alert("Đã xóa!");
            document.querySelector('.modal-overlay').remove();
        }
    }
};

// Gửi review với tư cách Admin (Được duyệt luôn)
window.submitReview = async (teacherId) => {
    // Tương tự Guest nhưng thêm status='approved' trong DB service nếu cần
    // Ở đây ta dùng hàm chung, admin tự vào duyệt bài của mình cũng được
    alert("Vui lòng dùng chức năng Guest để test post bài, Admin chỉ duyệt bài.");
};

initAdmin();