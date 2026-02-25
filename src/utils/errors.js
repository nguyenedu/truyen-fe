// Thông báo lỗi - Tập trung quản lý tất cả message lỗi hiển thị cho người dùng
export const ERROR_MESSAGES = {
    // Xác thực
    LOGIN_FAILED: 'Đăng nhập thất bại',
    REGISTER_FAILED: 'Đăng ký thất bại',
    AUTH_REQUIRED: 'Vui lòng đăng nhập để tiếp tục',

    // Truyện & Chương
    LOAD_STORY_FAILED: 'Không thể tải thông tin truyện',
    LOAD_CHAPTERS_FAILED: 'Không thể tải danh sách chương',
    LOAD_CHAPTER_CONTENT_FAILED: 'Không thể tải nội dung chương',
    STORY_NOT_FOUND: 'Không tìm thấy truyện',
    CHAPTER_NOT_FOUND: 'Không tìm thấy chương',

    // Khám phá
    LOAD_CATEGORIES_FAILED: 'Không thể tải danh sách thể loại',
    LOAD_STORIES_FAILED: 'Không thể tải danh sách truyện',
    LOAD_AUTHOR_FAILED: 'Không thể tải thông tin tác giả',
    INVALID_AUTHOR_ID: 'ID tác giả không hợp lệ',

    // Người dùng
    LOAD_HISTORY_FAILED: 'Không thể tải lịch sử đọc',
    LOAD_PROFILE_FAILED: 'Không thể tải thông tin cá nhân',
    UPDATE_PROFILE_FAILED: 'Cập nhật thông tin thất bại',
    LOAD_FAVORITES_FAILED: 'Không thể tải danh sách yêu thích',

    // Hành động
    SEND_COMMENT_FAILED: 'Không thể gửi bình luận',
    LOAD_COMMENTS_FAILED: 'Không thể tải bình luận',
    RATING_FAILED: 'Không thể gửi đánh giá',

    // Chung
    DEFAULT: 'Đã có lỗi xảy ra. Vui lòng thử lại sau',
    FETCH_DATA_FAILED: 'Không thể tải dữ liệu'
};
