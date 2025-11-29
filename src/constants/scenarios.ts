export const ORIGINAL_SCENARIOS = [
  {
    id: 1,
    title: "Tuyển dụng 'việc nhẹ lương cao'",
    description: "Công việc: Like video TikTok, thu nhập 800k/ngày. Yêu cầu: Nạp 500k để nâng cấp tài khoản VIP nhận nhiệm vụ.",
    details: "Chiêu trò: Đánh vào lòng tham. Không có công việc hợp pháp nào yêu cầu người lao động phải nạp tiền trước.",
    type: "scam",
    isScam: true,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 2,
    title: "SMS Cảnh báo lạ",
    description: "Bạn nhận được SMS: 'Tai khoan VCB cua ban dang bị tan cong. Dang nhap ngay tai vcb-digibank-alert.com de bao mat'. Bạn sẽ làm gì?",
    details: "Chiêu trò: Giả mạo SMS Brandname. Tên miền kia là giả mạo, ngân hàng không bao giờ gửi link yêu cầu đăng nhập qua SMS.",
    type: "phishing",
    isScam: true,
    difficulty: "medium",
    interactive: true,
    options: [
      { label: "Đăng nhập ngay kẻo mất tiền", action: "right", style: "danger" },
      { label: "Xóa tin nhắn, tự vào app kiểm tra", action: "left", style: "safe" }
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
    title: "Email từ 'Sếp tổng'",
    description: "Email từ CEO: 'Tôi đang họp, hãy mua gấp 5 thẻ Steam gửi mã cho đối tác. Tôi sẽ chuyển khoản lại sau'.",
    details: "Chiêu trò: CEO Fraud. Kẻ lừa đảo tạo áp lực thời gian. Hãy nhìn kỹ địa chỉ email người gửi, thường sẽ sai một ký tự nhỏ.",
    type: "ceo_fraud",
    isScam: true,
    difficulty: "hard",
    interactive: false
  },
  {
    id: 5,
    title: "Mã QR nơi công cộng",
    description: "Thấy tờ rơi dán ở cột điện: 'Quét mã QR nhận voucher trà sữa 100k miễn phí'.",
    details: "Rủi ro: Mã QR nơi công cộng rất dễ bị dán đè mã độc, dẫn tới link tải virus hoặc chiếm quyền điện thoại.",
    type: "qr_scam",
    isScam: true,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 6,
    title: "Sàn TMĐT Chính hãng",
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
    description: "Nick Facebook bạn thân nhắn tin: 'Tao đang kẹt ở sân bay, chuyển khoản gấp 2tr vào số lạ này giúp tao'. Bạn xử lý sao?",
    details: "Chiêu trò: Hack nick Facebook. Kẻ gian thường đưa số tài khoản lạ. Luôn phải gọi điện xác nhận chính chủ trước khi chuyển.",
    type: "chat_scam",
    isScam: true,
    difficulty: "medium",
    interactive: true,
    options: [
      { label: "Chuyển luôn, bạn bè mà", action: "right", style: "danger" },
      { label: "Gọi video call để xác nhận", action: "left", style: "safe" }
    ]
  },
  {
    id: 8,
    title: "Tình yêu ngoại quốc",
    description: "Bạn trai 'quân nhân Mỹ' quen qua mạng gửi quà về Việt Nam, nhưng hải quan yêu cầu đóng phí 10 triệu để thông quan.",
    details: "Chiêu trò: Romance Scam. Không bao giờ chuyển tiền cho người chưa từng gặp mặt ngoài đời.",
    type: "romance",
    isScam: true,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 9,
    title: "Cài đặt ứng dụng lạ",
    description: "Có người tự xưng là công an, yêu cầu bạn tải app 'DichVuCong_BaoMat.apk' qua Zalo để định danh mức 2.",
    details: "Nguy hiểm: File .apk gửi qua chat thường chứa mã độc chiếm quyền kiểm soát điện thoại, đánh cắp tiền ngân hàng.",
    type: "malware",
    isScam: true,
    difficulty: "hard",
    interactive: true,
    options: [
      { label: "Tải và cài đặt theo hướng dẫn", action: "right", style: "danger" },
      { label: "Ra trực tiếp trụ sở công an", action: "left", style: "safe" }
    ]
  },
  {
    id: 10,
    title: "Xác thực 2 bước (2FA)",
    description: "Bạn vừa đăng nhập Gmail và nhận được thông báo trên điện thoại: 'Bạn đang cố gắng đăng nhập? Có/Không'.",
    details: "An toàn: Đây là tính năng bảo mật do chính bạn kích hoạt khi đăng nhập.",
    type: "security",
    isScam: false,
    difficulty: "medium",
    interactive: false
  }
];
