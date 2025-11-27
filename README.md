# HƯỚNG DẪN PHÁT TRIỂN ỨNG DỤNG "ANTI-SCAM MASTER" VỚI LINE LIFF

**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, LINE LIFF SDK.  
**Mục tiêu:** Xây dựng Web App dạng Game Swipe (vuốt thẻ bài) chạy trên nền tảng LINE, tích hợp iOS Simulator để kiểm thử.

---

## 📑 Mục Lục

- [HƯỚNG DẪN PHÁT TRIỂN ỨNG DỤNG "ANTI-SCAM MASTER" VỚI LINE LIFF](#hướng-dẫn-phát-triển-ứng-dụng-anti-scam-master-với-line-liff)
  - [📑 Mục Lục](#-mục-lục)
  - [1. Kiến trúc hệ thống](#1-kiến-trúc-hệ-thống)
  - [2. Yêu cầu môi trường (Prerequisites)](#2-yêu-cầu-môi-trường-prerequisites)
  - [3. Phần 1: Thiết lập LINE Developers Console](#3-phần-1-thiết-lập-line-developers-console)
  - [4. Phần 2: Khởi tạo và Cấu trúc dự án](#4-phần-2-khởi-tạo-và-cấu-trúc-dự-án)
    - [4.1. Khởi tạo Next.js](#41-khởi-tạo-nextjs)
    - [4.2. Cài đặt Dependencies](#42-cài-đặt-dependencies)
    - [4.3. Cấu trúc thư mục](#43-cấu-trúc-thư-mục)
  - [5. Phần 3: Triển khai Source Code Chi tiết](#5-phần-3-triển-khai-source-code-chi-tiết)
    - [Bước 1: Bảo mật LIFF ID](#bước-1-bảo-mật-liff-id)
    - [Bước 2: Chuẩn bị Dữ liệu (`src/data/scenarios.ts`)](#bước-2-chuẩn-bị-dữ-liệu-srcdatascenariosts)
    - [Bước 3: Code Logic Chính (`src/app/page.tsx`)](#bước-3-code-logic-chính-srcapppagetsx)
  - [6. Phần 4: Thiết lập Môi trường HTTPS (Ngrok)](#6-phần-4-thiết-lập-môi-trường-https-ngrok)
  - [7. Phần 5: Kiểm thử trên iOS Simulator](#7-phần-5-kiểm-thử-trên-ios-simulator)
    - [7.1. Khởi chạy Simulator](#71-khởi-chạy-simulator)
    - [7.2. Test Web App](#72-test-web-app)
    - [7.3. Debugging (Bí kíp)](#73-debugging-bí-kíp)
  - [8. Phần 6: Triển khai lên Production (Vercel)](#8-phần-6-triển-khai-lên-production-vercel)
  - [9. Troubleshooting (Gỡ lỗi thường gặp)](#9-troubleshooting-gỡ-lỗi-thường-gặp)

---

## 1. Kiến trúc hệ thống

Ứng dụng hoạt động dựa trên mô hình **Single Page Application (SPA)** được nhúng trong **WebView** của LINE App.

* **Frontend:** Next.js (React) xử lý giao diện và logic game.
* **Authentication:** LINE LIFF SDK (`@line/liff`) đảm nhận việc xác thực người dùng (SSO) và lấy User Profile.
* **Animation Engine:** `framer-motion` xử lý vật lý cho hành động vuốt (Swipe gestures).
* **Infrastructure:** Chạy local qua Node.js, public ra internet qua Ngrok Tunnel để đáp ứng yêu cầu SSL/HTTPS của LINE.

---

## 2. Yêu cầu môi trường (Prerequisites)

Hãy đảm bảo máy tính (ưu tiên macOS để chạy iOS Simulator) đã cài đặt:

* **Node.js:** v18.17.0 trở lên.
* **Package Manager:** npm hoặc yarn.
* **Code Editor:** VS Code (khuyên dùng extension *ES7+ React/Redux/React-Native snippets*).
* **Xcode:** Tải từ App Store (Bắt buộc để có iOS Simulator).
* **Ngrok:** Công cụ tạo đường hầm HTTPS (`brew install ngrok`).
* **LINE Account:** Tài khoản cá nhân để đăng nhập Developer Console.

---

## 3. Phần 1: Thiết lập LINE Developers Console

Đây là bước đăng ký "hộ chiếu" cho ứng dụng của bạn để được phép chạy trong LINE.

1.  Truy cập [LINE Developers Console](https://developers.line.biz/console/).
2.  **Create a new Provider:** Đặt tên team hoặc tên cá nhân (Ví dụ: `AntiScamTeam`).
3.  **Create a Channel:**
    * Chọn loại **LINE Login** (Bắt buộc cho LIFF, không chọn Messaging API).
    * **Region to provide the service**: `Janpan`
    * **Company or owner's country or region**: `Vietnam`
    * **Channel Name:** `Anti Scam Master`.
    * **Channel Description:** Game trắc nghiệm kiến thức lừa đảo.
    * **App Types:** Chọn `Web app` & `Mobile app`.
4.  **Cấu hình LIFF:**
    * Vào tab **LIFF** trong Channel vừa tạo -> Nhấn **Add**.
    * **LIFF App Name:** `Anti Scam Game`.
    * **Size:** Chọn `Full` (Trải nghiệm game tốt nhất).
    * **Endpoint URL:** Điền tạm `https://example.com` (Sẽ update ở Phần 4).
    * **Scopes:** Chọn `profile` (Lấy tên/ảnh) và `openid` (Lấy User ID duy nhất).
    * **Bot link feature:** Chọn `On (Normal)` nếu muốn gợi ý user add friend bot sau khi chơi (Optional).
5.  **Lấy Credentials:**
    * Tại danh sách LIFF App, copy **LIFF ID** (Dạng: `1657xxxxx-Abcde123`).

---

## 4. Phần 2: Khởi tạo và Cấu trúc dự án

### 4.1. Khởi tạo Next.js

Mở Terminal và chạy lệnh:

```bash
npx create-next-app@latest anti-scam-app --yes
```

### 4.2. Cài đặt Dependencies

Cài đặt các thư viện lõi:

```bash
cd anti-scam-app

# @line/liff: SDK giao tiếp với LINE
# framer-motion: Thư viện animation số 1 cho React
# lucide-react: Bộ icon nhẹ và đẹp
# html-to-image: Chụp màn hình DOM để tạo chứng chỉ
npm install @line/liff framer-motion lucide-react html-to-image clsx tailwind-merge
```

### 4.3. Cấu trúc thư mục

```bash
anti-scam-app/
├── .env.local             # Chứa biến môi trường (LIFF ID)
├── src/
│   ├── app/
│   │   ├── layout.tsx     # Layout gốc
│   │   ├── page.tsx       # Logic chính của Game
│   │   └── globals.css    # Tailwind directives
│   ├── components/        # (Optional) Tách nhỏ UI nếu cần
│   └── data/              # Dữ liệu câu hỏi
│       └── scenarios.ts   
└── package.json
```

---

## 5. Phần 3: Triển khai Source Code Chi tiết

### Bước 1: Bảo mật LIFF ID

Tạo file `.env.local` ở thư mục gốc:

```bash
NEXT_PUBLIC_LIFF_ID=12345678-abcdefgh
# Thay 12345678-abcdefgh bằng LIFF ID thật của bạn
```

**⚠️ Quan trọng:** Đảm bảo file `.env.local` đã được thêm vào `.gitignore` để tránh lộ LIFF ID khi đẩy code lên GitHub.

### Bước 2: Chuẩn bị Dữ liệu (`src/data/scenarios.ts`)

Tạo file chứa nội dung game để tách biệt với logic code.

```typescript
export const SCENARIOS = [
  {
    id: 1,
    title: "Việc nhẹ lương cao",
    image: "https://placehold.co/600x400/ffe4e6/be123c?text=Like+TikTok+Kiem+Tien",
    description: "Tuyển CTV like video TikTok, thu nhập 500k/ngày. Yêu cầu nạp 200k để kích hoạt tài khoản.",
    isScam: true,
    explanation: "Đây là lừa đảo. Không bao giờ nạp tiền trước khi làm việc.",
  },
  {
    id: 2,
    title: "CSKH Shopee gọi điện",
    image: "https://placehold.co/600x400/dcfce7/166534?text=CSKH+Shopee",
    description: "Nhân viên tự xưng Shopee gọi tặng quà tri ân, yêu cầu kết bạn Zalo để nhận thưởng.",
    isScam: true,
    explanation: "Sàn TMĐT không bao giờ yêu cầu kết bạn Zalo để tặng quà. Họ chỉ liên hệ qua App.",
  },
  // Thêm các tình huống khác...
];
```

### Bước 3: Code Logic Chính (`src/app/page.tsx`)

Copy toàn bộ nội dung sau vào file `page.tsx`. Đây là phiên bản đầy đủ logic.

```tsx

export default function AntiScamApp() {
  const [userName, setUserName] = useState<any>('');
  ...

  useEffect(() => {
    liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' }).then(() => {
      if (liff.isLoggedIn()) {
        liff.getProfile().then(setUserName);
      } else {
        liff.login();
      }
    });
  }, []);

  const startGame = () => {
    if (!userName.trim()) {
      alert('Vui lòng nhập tên của bạn để bắt đầu!');
      return;
    }
  };
}
```

---

## 6. Phần 4: Thiết lập Môi trường HTTPS (Ngrok)

Do LINE LIFF bắt buộc Endpoint phải là `https://`, ta dùng Ngrok để public localhost.

1. **Chạy Next.js:**

```bash
npm run dev
# Đảm bảo app đang chạy ở http://localhost:3000
```

2. **Chạy Ngrok:**

```bash
ngrok http 3000
```

*Ngrok sẽ hiển thị một bảng thông tin. Hãy copy dòng `Forwarding` có dạng `https://xxxx-xx-xx.ngrok-free.app`.*

3. **Cập nhật LINE Console:**

* Quay lại [LINE Developers Console](https://developers.line.biz/console/).
* Vào App của bạn -> Tab **LIFF**.
* Sửa mục **Endpoint URL**: Dán link Ngrok vừa copy vào.
* Nhấn **Save**.

---

## 7. Phần 5: Kiểm thử trên iOS Simulator

### 7.1. Khởi chạy Simulator

1.  Nhấn `Command + Space` (Spotlight), gõ "Simulator" và Enter.
2.  Chờ máy ảo iPhone khởi động.

### 7.2. Test Web App

1.  Trên Simulator, mở trình duyệt **Safari**.
2.  Nhập đường dẫn Ngrok của bạn (Ví dụ: `https://xxxx.ngrok-free.app`).
3.  **Login Flow:**
    * App sẽ tự động chạy hàm `liff.init`.
    * Do chạy trên trình duyệt ngoài (không phải app LINE), hàm `liff.isLoggedIn()` trả về false -> Code gọi `liff.login()`.
    * Trang web sẽ chuyển hướng sang trang đăng nhập của LINE.
    * Nhập Email/Password tài khoản LINE của bạn.
    * Sau khi đăng nhập thành công, nó sẽ redirect về lại game.

### 7.3. Debugging (Bí kíp)

Nếu gặp lỗi hoặc giao diện bị vỡ trên Simulator:
1.  Mở Safari trên máy Mac (Máy thật).
2.  Trên thanh Menu chọn **Develop** -> **Simulator** -> Chọn trang web đang chạy.
3.  Cửa sổ **Web Inspector** hiện ra, bạn có thể xem `Console Log` để check lỗi LIFF ID hoặc lỗi CSS y hệt như trên Chrome.

---

## 8. Phần 6: Triển khai lên Production (Vercel)

Ngrok chỉ dùng để test tạm thời. Để chạy chính thức miễn phí, hãy deploy lên **Vercel**.

1.  Đẩy code lên **GitHub/GitLab**.
2.  Truy cập [Vercel](https://vercel.com/) -> **Add New Project**.
3.  Chọn repo GitHub của bạn -> Nhấn **Import**.
4.  Tại mục **Environment Variables**:
    * Key: `NEXT_PUBLIC_LIFF_ID`
    * Value: `12345678-abcdefgh` (LIFF ID của bạn)
5.  Nhấn **Deploy**.
6.  Sau khi deploy xong, Vercel sẽ cấp domain (ví dụ: `https://anti-scam.vercel.app`).
7.  **Quan trọng:** Quay lại LINE Developers Console -> Sửa **Endpoint URL** thành domain Vercel mới này.

---

## 9. Troubleshooting (Gỡ lỗi thường gặp)

| Lỗi | Nguyên nhân | Cách khắc phục |
| :--- | :--- | :--- |
| **LIFF init failed** | Sai LIFF ID hoặc Endpoint chưa update | Check lại file `.env.local` và Endpoint trong Console xem khớp chưa. |
| **Trắng trang trên iOS** | Lỗi CSS hoặc JS crash | Dùng Safari Web Inspector (Phần 7.3) để xem Console log. |
| **Invalid redirect_uri** | Ngrok đổi link mới nhưng chưa update Console | Mỗi lần tắt Ngrok bật lại link sẽ đổi. Nhớ update lại Endpoint URL trong LINE Console. |
| **Không scroll được** | Xung đột với sự kiện Swipe | Đã thêm `overflow-hidden` vào body để chặn scroll mặc định của trình duyệt, giúp trải nghiệm swipe tốt hơn. |

---