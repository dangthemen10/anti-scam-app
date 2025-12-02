export const ORIGINAL_SCENARIOS = [
  {
    id: 1,
    title: "Email giả mạo yêu cầu xác minh",
    sender: "Yahoo!/Rakuten/Line Pay",
    description: "Tài khoản của bạn sẽ bị khóa trong 24 giờ. Nhấp vào liên kết bên dưới để xác minh.",
    details: "Đây là email phishing (lừa đảo). Kiểm tra địa chỉ email người gửi và liên hệ chính thức với công ty qua website/hotline chính thức. Không bao giờ nhấp link lạ!",
    type: "phishing",
    isScam: true,
    difficulty: "medium",
    interactive: true,
    options: [
      { label: "Nhấp link và nhập thông tin", action: "right" },
      { label: "Kiểm tra email + liên hệ chính thức", action: "left" }
    ]
  },
  {
    id: 2,
    title: "Website bán hàng giá rẻ bất thường",
    description: "Website này bán sản phẩm rẻ hơn thị trường nhiều, yêu cầu thanh toán trước 100%, không có 'trả khi nhận hàng'.",
    details: "Cảnh báo: Đây là dấu hiệu của lừa đảo mua bán online. Website lừa đảo thường yêu cầu thanh toán trước toàn bộ, không có chính sách hoàn tiền. Hãy cẩn trọng!",
    type: "shopping",
    isScam: true,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 3,
    title: "Cuộc gọi giả danh cảnh sát",
    sender: "警視庁 (Cảnh sát Nhật Bản)",
    description: "Có liên quan đến tài khoản ngân hàng của bạn. Bạn phải chuyển tiền ngay để xác minh hoặc giải quyết vụ án.",
    details: "Lừa đảo nghiêm trọng! Cảnh sát và cơ quan chức năng KHÔNG BAO GIỜ yêu cầu chuyển tiền qua điện thoại. Ngắt máy ngay và báo cáo với cảnh sát thật.",
    type: "chat_scam",
    isScam: true,
    difficulty: "hard",
    interactive: true,
    options: [
      { label: "Chuyển tiền theo yêu cầu", action: "right" },
      { label: "Ngắt máy và báo cảnh sát", action: "left" }
    ]
  },
  {
    id: 4,
    title: "Lừa đảo giả danh cảnh sát - Kỷ lục 2025",
    description: "Japan National Police Agency báo cáo: Số vụ lừa đảo qua điện thoại/mạng xã hội đạt mức kỷ lục trong 6 tháng đầu 2025, phần lớn là giả danh cảnh sát.",
    details: "Đúng! Theo NPA, lừa đảo 'giả danh cảnh sát' (オレオレ詐欺) là hình thức phổ biến nhất tại Nhật. Luôn cảnh giác với cuộc gọi yêu cầu chuyển tiền!",
    type: "safe",
    isScam: false,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 5,
    title: "Cuộc gọi yêu cầu mã OTP",
    sender: "Số lạ",
    description: "Cuộc gọi yêu cầu bạn cung cấp PIN ngân hàng, mật khẩu, hoặc mã OTP để 'xác minh tài khoản'.",
    details: "Nguy hiểm! Đây là Voice Phishing (Vishing). KHÔNG BAO GIỜ cung cấp mã OTP, PIN, mật khẩu qua điện thoại. Ngắt máy ngay!",
    type: "phishing",
    isScam: true,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 6,
    title: "Lừa đảo tình cảm + đầu tư",
    sender: "Người yêu từ mạng xã hội",
    description: "Người yêu online tỏ tình, sau đó đề xuất đầu tư hoặc nhờ chuyển tiền để 'giúp đỡ khẩn cấp'.",
    details: "Romance Scam! Kẻ lừa đảo tạo mối quan hệ tình cảm giả để lừa tiền. Không bao giờ chuyển tiền cho người chưa gặp mặt ngoài đời thực!",
    type: "romance",
    isScam: true,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 7,
    title: "Popup cảnh báo virus giả",
    description: "Popup trên máy tính: 'Máy bạn nhiễm virus! Gọi ngay số này để được hỗ trợ kỹ thuật miễn phí.'",
    details: "Technical Support Scam! Popup giả mạo nhằm lừa bạn gọi điện và trả tiền 'sửa máy'. Đóng popup, dùng phần mềm diệt virus chính hãng để kiểm tra.",
    type: "malware",
    isScam: true,
    difficulty: "medium",
    interactive: false
  },
  {
    id: 8,
    title: "Email/điện thoại yêu cầu xác minh My Number",
    sender: "Ngân hàng/Hãng hàng không",
    description: "Email hoặc điện thoại tự xưng là công ty lớn, yêu cầu xác minh thông tin cá nhân, thẻ, mật khẩu, hoặc My Number.",
    details: "An toàn khi xử lý đúng! Xóa email/ngắt máy, sau đó liên hệ chính thức qua website/hotline để kiểm tra. Công ty thật KHÔNG YÊU CẦU thông tin nhạy cảm qua email/điện thoại.",
    type: "phishing",
    isScam: true,
    difficulty: "hard",
    interactive: true,
    options: [
      { label: "Cung cấp thông tin ngay", action: "right" },
      { label: "Liên hệ chính thức để kiểm tra", action: "left" }
    ]
  },
  {
    id: 9,
    title: "Part-time 'Yami Baito' lương cao",
    sender: "Bạn mạng xã hội",
    description: "Việc part-time dễ dàng, lương cao, không cần kỹ năng. Chỉ cần làm theo hướng dẫn là được tiền ngay!",
    details: "Cảnh báo 'Yami Baito' (闇バイト - việc làm mờ ám)! Có thể là công việc bất hợp pháp hoặc lừa đảo, nhắm vào người trẻ. Tránh xa!",
    type: "scam",
    isScam: true,
    difficulty: "easy",
    interactive: false
  },
  {
    id: 10,
    title: "Xác minh website/dịch vụ đáng ngờ",
    description: "Bạn không chắc chắn về tính hợp pháp của một website, email, hoặc số điện thoại lạ.",
    details: "An toàn! Tra cứu thông tin online, tìm đánh giá, hoặc gác lại nếu nghi ngờ. Luôn xác minh trước khi cung cấp thông tin cá nhân hoặc thanh toán.",
    type: "security",
    isScam: false,
    difficulty: "medium",
    interactive: false
  }
];
