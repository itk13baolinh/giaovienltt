import { DB } from './db-service.js';
import { Utils } from './utils.js';
import { ModalRenderer } from './modal-renderer.js';

let allTeachers = [];

async function init() {
    allTeachers = await DB.getTeachers();
    renderTop3();
    renderList(allTeachers);

    // Xử lý Search
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const key = e.target.value.toLowerCase();
        const filtered = allTeachers.filter(t => t.name.toLowerCase().includes(key));
        renderList(filtered);
    });

    // Xử lý Filter Môn
    document.getElementById('filterSubject').addEventListener('change', (e) => {
        const subject = e.target.value;
        const filtered = subject === 'all' ? allTeachers : allTeachers.filter(t => t.subject === subject);
        renderList(filtered);
    });
}

function renderTop3() {
    // Demo: Lấy 3 người đầu tiên (Thực tế cần sort theo avgRating)
    const top3 = [...allTeachers].sort((a,b) => b.avgRating - a.avgRating).slice(0,3);
    const container = document.getElementById('topTeachers');
    
    container.innerHTML = top3.map((t, index) => `
        <div onclick="window.openDetail('${t.id}')" class="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 cursor-pointer hover:-translate-y-2 transition relative overflow-hidden">
            <div class="absolute -right-4 -top-4 w-20 h-20 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-full opacity-20"></div>
            <div class="flex items-center gap-4">
                <div class="text-4xl font-black text-yellow-500">#${index+1}</div>
                <div>
                    <h3 class="font-bold text-lg text-slate-800">${t.name}</h3>
                    <p class="text-xs text-slate-500 font-bold uppercase">${t.subject}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderList(list) {
    const container = document.getElementById('teacherList');
    container.innerHTML = list.map(t => `
        <div onclick="window.openDetail('${t.id}')" class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-pointer flex items-center gap-4">
            <img src="${Utils.getAvatar(t.gender)}" class="w-12 h-12 rounded-full bg-slate-100 object-cover border">
            <div>
                <h4 class="font-bold text-slate-800">${t.name}</h4>
                <div class="flex gap-2 text-[10px] font-bold mt-1">
                    <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">${t.subject}</span>
                    <span class="bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded">★ ${t.avgRating || 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Global functions for HTML access
window.openDetail = async (id) => {
    const teacher = allTeachers.find(t => t.id === id);
    const html = await ModalRenderer.renderTeacherDetail(teacher, false); // false = guest view
    document.getElementById('modalContainer').innerHTML = html;
    
    // Gán sự kiện Enter cho textarea review
    const textarea = document.getElementById('rvContent');
    if(textarea) {
        textarea.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.submitReview(id);
            }
        });
    }
};

window.submitReview = async (teacherId) => {
    const content = document.getElementById('rvContent').value;
    if(!content) return alert("Vui lòng viết nội dung!");

    const rating = document.getElementById('rvRating').value;
    const diff = document.getElementById('rvDiff').value;
    const comp = document.getElementById('rvComp').value;

    await DB.addReview({
        teacherId,
        content,
        rating: Number(rating),
        difficulty: Number(diff),
        compatibility: Number(comp)
    });

    alert("Đánh giá đã được gửi và chờ Admin duyệt!");
    document.querySelector('.modal-overlay').remove();
};

init();