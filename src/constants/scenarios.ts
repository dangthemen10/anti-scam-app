export const ORIGINAL_SCENARIOS = [
  {
    id: 1,
    title: "Tuyển dụng Online",
    description: "Công việc: Like video TikTok, thu nhập 800k/ngày. Yêu cầu: Nạp 500k để nâng cấp tài khoản VIP nhận nhiệm vụ.",
    details: "Chiêu trò: Đánh vào lòng tham. Không có công việc hợp pháp nào yêu cầu người lao động phải nạp tiền trước.",
    type: "scam",
    isScam: true,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 2,
    title: "SMS Ngân hàng",
    sender: "Vietcombank",
    description: "TK VCB cua ban dang bi tan cong. Dang nhap ngay tai vcb-digibank-alert.com de bao mat.",
    details: "Chiêu trò: Giả mạo SMS Brandname. Tên miền kia là giả mạo, ngân hàng không bao giờ gửi link yêu cầu đăng nhập qua SMS.",
    type: "phishing", // SMS style
    isScam: true, 
    difficulty: "medium",
    interactive: true,
    options: [
      { label: "Đăng nhập ngay", action: "right" }, 
      { label: "Xóa tin nhắn", action: "left" } 
    ]
  },
  {
    id: 3,
    title: "Cổng Dịch vụ công",
    description: "Bạn truy cập dichvucong.gov.vn để đăng ký đổi hộ chiếu online.",
    details: "An toàn: Tên miền .gov.vn là tên miền chính phủ được quản lý chặt chẽ.",
    type: "safe",
    isScam: false,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 4,
    title: "Email Sếp tổng",
    sender: "CEO Nguyen Van A",
    description: "Tôi đang họp, hãy mua gấp 5 thẻ Steam gửi mã cho đối tác. Tôi sẽ chuyển khoản lại sau. Gấp!",
    details: "Chiêu trò: CEO Fraud. Kẻ lừa đảo tạo áp lực thời gian. Hãy nhìn kỹ địa chỉ email người gửi.",
    type: "ceo_fraud",
    isScam: true,
    difficulty: "hard",
    interactive: false
  },
  {
    id: 5,
    title: "Mã QR lạ",
    description: "Thấy tờ rơi dán ở cột điện: 'Quét mã QR nhận voucher trà sữa 100k miễn phí'.",
    details: "Rủi ro: Mã QR nơi công cộng rất dễ bị dán đè mã độc, dẫn tới link tải virus hoặc chiếm quyền điện thoại.",
    type: "qr_scam",
    isScam: true,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 6,
    title: "Sàn TMĐT",
    description: "Mua iPhone trên Shopee Mall / Lazada Mall, shop có tích xanh và 10k đánh giá 5 sao.",
    details: "An toàn: Mua hàng tại các shop Mall/Official giảm thiểu tối đa rủi ro hàng giả.",
    type: "shopping",
    isScam: false,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 7,
    title: "Bạn thân mượn tiền",
    sender: "Hùng (Bạn thân)",
    description: "Tao đang kẹt ở sân bay, chuyển khoản gấp 2tr vào số lạ này giúp tao. Gấp lắm!",
    details: "Chiêu trò: Hack nick Facebook. Kẻ gian thường đưa số tài khoản lạ. Luôn phải gọi điện xác nhận chính chủ trước khi chuyển.",
    type: "chat_scam", // Chat style
    isScam: true,
    difficulty: "medium",
    interactive: true,
    options: [
      { label: "Chuyển luôn", action: "right" },
      { label: "Gọi xác nhận", action: "left" }
    ]
  },
  {
    id: 8,
    title: "Tình yêu ngoại quốc",
    sender: "John Smith (US Army)",
    description: "Anh đã gửi quà về Việt Nam cho em, nhưng hải quan yêu cầu đóng phí 10 triệu. Em giúp anh nhé?",
    details: "Chiêu trò: Romance Scam. Không bao giờ chuyển tiền cho người chưa từng gặp mặt ngoài đời.",
    type: "romance",
    isScam: true,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 9,
    title: "Cài app lạ",
    sender: "Cán bộ công an",
    description: "Yêu cầu tải app 'DichVuCong_BaoMat.apk' qua Zalo để định danh mức 2 ngay lập tức.",
    details: "Nguy hiểm: File .apk gửi qua chat thường chứa mã độc chiếm quyền kiểm soát điện thoại, đánh cắp tiền ngân hàng.",
    type: "malware",
    isScam: true,
    difficulty: "hard",
    interactive: true,
    options: [
      { label: "Tải ngay", action: "right" },
      { label: "Từ chối", action: "left" }
    ]
  },
  {
    id: 10,
    title: "Xác thực 2 bước",
    description: "Bạn vừa đăng nhập Gmail và nhận được thông báo trên điện thoại: 'Bạn đang cố gắng đăng nhập? Có/Không'.",
    details: "An toàn: Đây là tính năng bảo mật do chính bạn kích hoạt khi đăng nhập.",
    type: "security",
    isScam: false,
    difficulty: "medium",
    interactive: false
  }
];
