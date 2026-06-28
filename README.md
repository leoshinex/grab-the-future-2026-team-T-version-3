# Food Rescue — Save Food, Save Money, Save the Planet

Một sản phẩm trong hệ sinh thái Grab nhằm giải quyết bài toán lãng phí thực phẩm tại Việt Nam, bằng cách kết nối các suất ăn dư thừa của merchant F&B với người tiêu dùng có nhu cầu mua đồ ăn giá rẻ vào cuối ngày.

## Demo trực tiếp

- 🌐 **Web App:** https://grabthefuturehackathon-teamt.vercel.app/
- 📊 **Dashboard (Streamlit):** https://grab-the-future-2026-team-t-version-3-dashboard.streamlit.app/

## Tài nguyên thiết kế

- 🎨 **Figma (bản sơ khởi):** https://curse-bamboo-77075215.figma.site/
- 📑 **Pitch Deck:** https://canva.link/3rbz5b8z81bq8fc

## AI sử dụng trong dự án

- **Figma AI** — vẽ UI bản sơ khởi.
- **Claude Code** — code phần generate data, deploy Streamlit, notification trong web-app.
- **GitHub Copilot** — code phần nền, chuyển trang, các chức năng cơ bản của web-app.

## Vấn đề

Mỗi ngày, hàng nghìn suất ăn còn tốt bị bỏ đi, trong khi người tiêu dùng ngày càng khó tiếp cận những bữa ăn vừa túi tiền.

- **8 triệu tấn** thực phẩm bị lãng phí mỗi năm tại Việt Nam, gây thiệt hại **3.9 tỷ USD** (~2% GDP).
- Lãng phí thực phẩm là nguyên nhân của **8–10%** lượng phát thải khí nhà kính toàn cầu; **39%** lượng thực phẩm lãng phí tại Việt Nam đến từ các cơ sở kinh doanh thực phẩm và bán lẻ.
- **70%** người Việt không đáp ứng được chế độ dinh dưỡng đầy đủ vì chi phí ăn uống chiếm tới 70% thu nhập.
- Merchant phải chuẩn bị dư suất ăn để đáp ứng giờ cao điểm, nhưng nhu cầu biến động khiến nhiều suất ăn vẫn không bán hết — gây thất thoát doanh thu và lãng phí.
- Người tiêu dùng thu nhập thấp (sinh viên, người mới đi làm) phải tốn thời gian, công sức tìm nguồn thực phẩm giá rẻ một cách thủ công, thiếu kênh tiếp cận minh bạch và tiện lợi.

Cốt lõi: **thiếu kết nối giữa nguồn cung thực phẩm dư thừa và nhu cầu mua thực phẩm giá hợp lý** — gây tổn thất cho merchant, người dùng, và làm suy giảm hiệu quả phân bổ nguồn lực đô thị, gia tăng lãng phí thực phẩm và phát thải không cần thiết.

## Merchant Understanding

**Target merchant:** Các merchant kinh doanh thực phẩm chế biến sẵn trong ngày (quán cơm, cháo, bún, phở, bakery) ở khu vực TP.HCM và Hà Nội, phân khúc trung bình–thấp. Hai thị trường này tập trung mật độ cao các nhà hàng, quán ăn và chuỗi F&B; tại các đô thị lớn, **68%** lượng thực phẩm bị lãng phí là các món ăn chế biến sẵn như cơm, bún, phở và mì.

**Behavior:** Merchant phải chuẩn bị dư suất ăn để đáp ứng nhu cầu giờ cao điểm. Do nhu cầu biến động, nhiều suất ăn vẫn không bán hết. Dù đã chủ động xả hàng bằng giảm giá và bán trên nhiều kênh, một phần thực phẩm vẫn phải bỏ đi.

**Pain point:** Merchant gặp khó khăn trong việc tiêu thụ các suất ăn dư thừa do nhu cầu khó dự báo và thiếu kênh tiếp cận đúng khách hàng vào đúng thời điểm. Dù đã giảm giá và bán qua nhiều kênh, nhiều suất ăn vẫn không được tiêu thụ, dẫn đến thất thoát doanh thu và lãng phí thực phẩm.

→ Merchant đã có sẵn động lực để giảm lãng phí. Điều họ thiếu là một cơ chế giúp đưa các suất ăn cần giải cứu tới người cần.

## Consumer Understanding

**Target consumer:** Sinh viên, người mới đi làm thu nhập thấp, 18–26 tuổi, chi mức tối thiểu cho việc ăn uống.

**Consumer behavior:** Quen thuộc với mobile và food delivery; thường xuyên săn khuyến mãi và các món đồ giá hời trên nhiều nền tảng; quan tâm tới sustainability và nhận thức về môi trường.

**Pain point:** Chi phí ăn uống leo thang trong khi thu nhập không đáp ứng được. Việc tìm kiếm thực phẩm giá tốt tốn nhiều thời gian và công sức do ưu đãi bị phân mảnh trên nhiều kênh.

## Giải pháp: Rescue Deals

Một tính năng (feature) tích hợp vào nền tảng, biến các suất ăn dư thừa cuối ngày của merchant thành **"Rescue Deals"** — ưu đãi giảm giá 30–70%, hiển thị đúng lúc, đúng người, đúng nơi.

### Mô hình giá trị: Win – Win – Win – Win

*Đồ ăn bị vứt bỏ → Rescue Deals (kết nối đồ ăn tới những người cần) → Tạo ra nhiều giá trị hơn cho tất cả → Một tương lai bền vững hơn.*

| Đối tượng | Giá trị | Tagline |
|---|---|---|
| **For Consumer** | Tiếp cận thực phẩm với mức giá thấp hơn 30–70%, được notify khi có deal hời, tận hưởng cảm giác hào hứng khi săn deal, "Eat smart, live green" | Save money. Make an impact. |
| **For Merchants** | Chuyển khoản lỗ 100% thành doanh thu bổ sung, định giá động giúp bảo vệ biên lợi nhuận và giá trị thương hiệu, tự động hóa hoàn toàn vận hành, không phát sinh thêm khối lượng công việc | Less waste. More revenue. |
| **For Company** | Tạo doanh thu mới từ các đơn surplus, tăng retention nhờ gia tăng tương tác trong giờ thấp điểm, củng cố vị thế ESG và niềm tin thương hiệu | New growth. Stronger ecosystem. |
| **For Environment** | Giảm phát thải methane từ lãng phí thực phẩm, thúc đẩy mô hình kinh tế tuần hoàn tại đô thị, giảm rào cản tiếp cận thực phẩm cho nhóm thu nhập thấp | Less waste. Better planet. |

Mỗi deal được giải cứu đều tốt cho con người, tốt cho doanh nghiệp, và tốt cho hành tinh của chúng ta.

## Tính năng chính (trong bản demo)

- **Trang chủ (Home)** — danh sách Rescue Deals theo khoảng cách, hạn lấy hàng, mức giảm giá; lọc theo danh mục (Bakery / Meals / Drinks); Community Impact Card hiển thị số suất ăn cộng đồng đã cứu được và CO₂ tiết kiệm.
- **Popup thông báo "Đồ ăn sắp hết hạn"** — tự động hiện sau 21:00 (mô phỏng bằng thanh kéo giờ trong bản demo), gợi ý các deal sắp hết hàng; đóng popup (nút X hoặc "Để sau") sẽ ở lại Home, chỉ khi bấm "Khám phá Rescue" mới chuyển sang trang Food Rescue.
- **Food Rescue Event Screen** — trang khám phá toàn bộ ưu đãi, tìm kiếm theo món/cửa hàng, lọc theo danh mục, danh sách merchant đối tác Food Rescue.
- **Merchant Detail Screen** — trang chi tiết quán, hiển thị riêng mục "Ưu đãi giải cứu hôm nay (FoodRescue)" song song với thực đơn thường.
- **Detail Screen** — chi tiết món ăn (độ tươi, CO₂ tiết kiệm, số lượng còn lại, hạn lấy hàng), luồng đặt hàng (giao hàng / tự lấy) và thanh toán mô phỏng (Momo, ZaloPay, VNPay, thẻ, tiền mặt).
- **Notification Demo** — minh họa luồng thông báo đẩy khi có deal mới.
- **Time Simulator** — thanh kéo giờ mô phỏng (06:00–23:00) để demo hành vi popup Rescue vào giờ tối (≥21:00) mà không cần chờ thời gian thực.

## Cấu trúc dự án

```
.
├── data/                       # Script & dữ liệu mẫu (users, listings, restaurants)
├── dashboard/                  # Dashboard Streamlit (phân tích/giám sát)
└── web-app/                    # Ứng dụng demo (React + Vite + TypeScript)
    └── src/app/
        ├── App.tsx                       # Toàn bộ luồng chính: Home, Rescue, Merchant, Detail
        ├── components/
        │   ├── NotificationDemo.tsx      # Demo thông báo đẩy
        │   └── ui/                       # Bộ UI components (shadcn-based)
        └── data/
            └── users.json
```

## Kiến trúc dự án

Dự án gồm 1 pipeline dữ liệu và 2 ứng dụng độc lập cùng tiêu thụ dữ liệu đó — chưa có backend/API, dữ liệu được sinh sẵn (mock) ở dạng file tĩnh.

```
┌─────────────────────┐
│  generate_users.py   │   Sinh 500 user giả lập (Python/NumPy/Pandas)
│  (data/)             │   → tính behavior score → phân segment + priority
└──────────┬───────────┘
           │ xuất ra
           ▼
   data/users.csv  ───────────────────────┐
           │                              │
           │ convert_to_json.py            │ đọc trực tiếp
           │ (lọc field cần dùng)          │
           ▼                              ▼
web-app/src/app/data/users.json   dashboard/app.py (Streamlit)
           │                              │
           ▼                              ▼
   web-app (React/Vite)          Dashboard phân tích segment
   — UI người dùng cuối           — minh họa chiến lược notify
   — demo notification theo       cho giám khảo/nhà đầu tư
     segment, đặt hàng, thanh
     toán mô phỏng
```

**Luồng dữ liệu:**
1. `data/generate_users.py` sinh dữ liệu hành vi giả lập cho 500 user (tần suất đặt hàng, giờ peak, pickup rate, voucher usage...), từ đó tính các điểm số tổng hợp (`giovang_score`, `deal_seeking_score`...) và gán **segment** + **notify_priority** theo rule-based logic → xuất ra `data/users.csv`.
2. `data/convert_to_json.py` đọc `users.csv`, chỉ giữ lại các field cần cho frontend (`user_id`, `segment`, `is_gen_z`, `notify_priority`, `favorite_category`, `avg_order_value`, `age_group`) → xuất ra `web-app/src/app/data/users.json`.
3. **`web-app`** (React + TypeScript + Vite) là ứng dụng demo chính: toàn bộ UI/UX của người dùng cuối (Home, Food Rescue, Merchant Detail, Detail/Checkout) và module `NotificationDemo` đọc trực tiếp `users.json` để demo nội dung thông báo cá nhân hóa theo segment.
4. **`dashboard`** (Streamlit) đọc trực tiếp `data/users.csv`, dùng để trực quan hóa phân bố segment, priority, và minh họa chiến lược notify cho mục đích thuyết trình/phân tích — độc lập với web-app, không chia sẻ runtime.

**Đặc điểm kiến trúc hiện tại:**
- Toàn bộ là **client-side / static** — không có server, database, hay API thực sự. Dữ liệu là file tĩnh (`csv`/`json`) được generate trước, không cập nhật real-time.
- `web-app` và `dashboard` là 2 ứng dụng tách biệt, deploy riêng (Vercel và Streamlit Cloud), chỉ dùng chung nguồn dữ liệu gốc (`users.csv`).
- Logic phân segment/priority chạy 1 lần ở bước generate data (Python), không chạy lại ở runtime trên web-app — web-app chỉ đọc kết quả đã tính sẵn.

**Hướng mở rộng (chưa làm):** thay file tĩnh bằng database + API thực (vd Node/Express hoặc Supabase), tính segment/score theo thời gian thực từ hành vi thật của user, và hợp nhất notify engine thành 1 service dùng chung cho cả web-app và các kênh khác (push notification thật, email...).

## Công nghệ sử dụng

- **Frontend:** React + TypeScript + Vite
- **UI:** Tailwind CSS, shadcn/ui components, lucide-react icons
- **Data viz:** Recharts
- **Dashboard:** Python + Streamlit

## Chạy thử local

```bash
cd web-app
npm install
npm run dev
```

Mở trình duyệt tại địa chỉ được in ra (mặc định `http://localhost:5173`). Dùng thanh kéo "Giờ mô phỏng" trong app để kéo tới 21:00 và xem popup Rescue Deals xuất hiện.

## Build & Deploy

```bash
cd web-app
npm run build
```

Output nằm tại `web-app/dist`. Bản demo web đang được deploy trên Vercel (root directory `web-app`, build command `npm run build`, output directory `dist`); dashboard Streamlit deploy trên Streamlit Community Cloud.

## Team

Team T — Grab the Future Hackathon 2026.
