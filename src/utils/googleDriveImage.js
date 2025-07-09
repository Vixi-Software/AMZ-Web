/**
 * Chuyển đổi link Google Drive thành dạng thumbnail với kích thước tùy chọn.
 * @param {string} url - Link Google Drive (dạng share hoặc file).
 * @returns {string} Link thumbnail Google Drive.
 */
function getGoogleDriveThumbnail(url) {
    // Kiểm tra nếu không phải link Google Drive thì trả về url gốc
    if (!url || !url.includes('drive.google.com')) return url;

    // Regex lấy id từ các dạng link Google Drive phổ biến
    const match = url.match(/(?:\/d\/|id=|\/file\/d\/|open\?id=)([a-zA-Z0-9_-]{10,})/);
    const id = match ? match[1] : null;
    if (!id) return url;

    return `https://drive.google.com/thumbnail?id=${id}`;
}

export default getGoogleDriveThumbnail;