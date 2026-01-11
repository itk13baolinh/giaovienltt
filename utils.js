export const Utils = {
    // Tự động tính tuổi
    calculateAge(birthYear) {
        if (!birthYear) return 'N/A';
        const currentYear = new Date().getFullYear();
        return currentYear - birthYear;
    },

    // Chọn avatar theo giới tính
    getAvatar(gender) {
        return gender === 'nu' ? 'nu.png' : 'nam.png';
    },

    // Format ngày tháng
    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
    }
};