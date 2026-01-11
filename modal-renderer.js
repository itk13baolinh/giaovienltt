import { Utils } from './utils.js';
import { DB } from './db-service.js';

export const ModalRenderer = {
    // Hàm vẽ chi tiết giáo viên
    async renderTeacherDetail(teacher, isAdmin) {
        const age = Utils.calculateAge(teacher.birthYear);
        const avatar = Utils.getAvatar(teacher.gender);
        const reviews = await DB.getReviews(teacher.id, isAdmin);
        
        // Lấy 3 tag phổ biến nhất (Demo logic)
        const topTags = Object.entries(teacher.tags || {})
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([tag]) => `<span class="tag-badge">#${tag}</span>`)
            .join('');

        return `
            <div class="fixed inset-0 modal-overlay z-50 flex items-center justify-center p-4">
                <div class="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[24px] shadow-2xl relative animate-in fade-in zoom-in duration-300">
                    
                    <button onclick="document.querySelector('.modal-overlay').remove()" class="absolute top-4 right-4 w-10 h-10 bg-slate-100 rounded-full hover:bg-red-100 hover:text-red-500 transition font-bold text-xl z-10">✕</button>

                    <div class="p-8 border-b border-slate-100">
                        <div class="id-card-layout">
                            <div class="id-photo-section">
                                <img src="${avatar}" class="w-full h-full object-cover">
                            </div>
                            <div class="id-info-section flex flex-col justify-center">
                                <h2>${teacher.name}</h2>
                                <p class="text-slate-500 text-lg mb-4 font-medium">${teacher.subject} • ${age} tuổi</p>
                                
                                <div class="grid grid-cols-2 gap-4 mb-6">
                                    <div class="bg-blue-50 p-3 rounded-lg text-center">
                                        <div class="text-xs text-blue-400 uppercase font-bold">Điểm Rating</div>
                                        <div class="text-2xl font-black text-blue-700">${teacher.avgRating || '---'}</div>
                                    </div>
                                    <div class="bg-purple-50 p-3 rounded-lg text-center">
                                        <div class="text-xs text-purple-400 uppercase font-bold">Xếp hạng</div>
                                        <div class="text-2xl font-black text-purple-700">#${teacher.ranking || 'N/A'}</div>
                                    </div>
                                </div>

                                <div class="mb-2">
                                    <span class="text-xs font-bold text-slate-400 uppercase mr-2">Tags:</span>
                                    ${topTags || '<span class="text-sm italic text-slate-400">Chưa có đánh giá</span>'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="p-8 bg-slate-50">
                        <h3 class="font-bold text-xl mb-4 text-slate-800">Đánh giá từ cộng đồng</h3>
                        
                        <div class="space-y-4 mb-8">
                            ${reviews.length === 0 ? '<p class="text-center text-slate-400 italic">Chưa có đánh giá nào.</p>' : ''}
                            ${reviews.map(r => `
                                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                                    ${isAdmin ? `<button onclick="window.AdminLogic.deleteReview('${r.id}')" class="absolute top-2 right-2 text-red-300 hover:text-red-500 text-xs">Xóa</button>` : ''}
                                    ${isAdmin && r.status === 'pending' ? `<button onclick="window.AdminLogic.approveReview('${r.id}')" class="absolute top-2 right-10 text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded">Duyệt ngay</button>` : ''}
                                    
                                    <div class="flex justify-between items-start mb-2">
                                        <div class="flex gap-2">
                                            <span class="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold">★ ${r.rating}</span>
                                            <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-bold">Độ khó: ${r.difficulty}/5</span>
                                            <span class="bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded font-bold">Độ hợp: ${r.compatibility}/5</span>
                                        </div>
                                        <span class="text-xs text-slate-400">${Utils.formatDate(r.createdAt)}</span>
                                    </div>
                                    <p class="text-slate-700 italic">"${r.content}"</p>
                                    ${r.status === 'pending' ? '<div class="mt-2 text-xs text-orange-500 font-bold bg-orange-50 inline-block px-2 rounded">⚠️ Đang chờ duyệt</div>' : ''}
                                </div>
                            `).join('')}
                        </div>

                        <div class="bg-white p-6 rounded-2xl border border-blue-100 shadow-lg">
                            <h4 class="font-bold text-blue-800 mb-4">Viết đánh giá của bạn</h4>
                            <div class="grid grid-cols-3 gap-4 mb-4">
                                <select id="rvRating" class="p-2 bg-slate-50 rounded border">
                                    <option value="5">★ 5 Tuyệt vời</option>
                                    <option value="4">★ 4 Tốt</option>
                                    <option value="3">★ 3 Bình thường</option>
                                    <option value="2">★ 2 Tệ</option>
                                    <option value="1">★ 1 Rất tệ</option>
                                </select>
                                <select id="rvDiff" class="p-2 bg-slate-50 rounded border">
                                    <option value="1">Dễ thở</option>
                                    <option value="3">Bình thường</option>
                                    <option value="5">Rất khó</option>
                                </select>
                                <select id="rvComp" class="p-2 bg-slate-50 rounded border">
                                    <option value="1">Không hợp</option>
                                    <option value="5">Rất hợp</option>
                                </select>
                            </div>
                            
                            <div class="mb-4">
                                <label class="text-xs font-bold text-slate-400 uppercase">Chọn Tag:</label>
                                <div class="flex gap-2 mt-1 flex-wrap" id="tagSelection">
                                    <button class="tag-opt border px-3 py-1 rounded-full text-sm hover:bg-blue-50" onclick="this.classList.toggle('bg-blue-500');this.classList.toggle('text-white')">Vui tính</button>
                                    <button class="tag-opt border px-3 py-1 rounded-full text-sm hover:bg-blue-50" onclick="this.classList.toggle('bg-blue-500');this.classList.toggle('text-white')">Dạy kỹ</button>
                                    <button class="tag-opt border px-3 py-1 rounded-full text-sm hover:bg-blue-50" onclick="this.classList.toggle('bg-blue-500');this.classList.toggle('text-white')">Nhiều bài tập</button>
                                    <button class="tag-opt border px-3 py-1 rounded-full text-sm hover:bg-blue-50" onclick="this.classList.toggle('bg-blue-500');this.classList.toggle('text-white')">Dễ tính</button>
                                </div>
                            </div>

                            <textarea id="rvContent" class="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500 h-24 mb-4" placeholder="Nhập nhận xét (Có thể nhấn Enter để gửi)..."></textarea>
                            <button id="btnSubmitRv" onclick="window.submitReview('${teacher.id}')" class="w-full py-3 btn-fpt rounded-xl shadow-lg">GỬI ĐÁNH GIÁ</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};