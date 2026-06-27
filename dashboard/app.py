"""
Giovang Dashboard — Pitch Demo
App phân phối đồ ăn cuối giờ giảm giá, kết nối quán ăn dư đồ với người tiêu dùng nhạy giá.
Dashboard này minh hoạ chiến lược segmentation + notify cho nhà đầu tư / giám khảo.
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path

# ── PAGE CONFIG ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Giovang — User Segmentation Dashboard",
    page_icon="🍱",
    layout="wide",
)

# ── LOAD DATA ────────────────────────────────────────────────────────────────────
@st.cache_data
def load_data():
    data_path = Path(__file__).parent.parent / "data" / "users.csv"
    df = pd.read_csv(data_path)
    return df

df = load_data()

# ── STATIC CONTENT: SEGMENT ACTION PLAYBOOK ─────────────────────────────────────
SEGMENT_INFO = {
    "Deal Addict": {
        "emoji": "🔥",
        "desc": "Mua gần như hàng ngày (freq ≥5/tuần, đã đặt ≥6 đơn qua Giovang). Nhóm trung thành nhất.",
        "action": "Notify ngay khi BẤT KỲ quán nào trong khu vực mở deal mới — không cần ưu đãi thêm, họ convert nhanh nhất.",
    },
    "Pickup Commuter": {
        "emoji": "🛵",
        "desc": "Tự đến lấy đồ (pickup rate ≥55%), quan tâm khoảng cách hơn giá.",
        "action": "Notify ưu tiên deal GẦN VỊ TRÍ (cùng ward) + đúng giờ họ hay pickup, không cần discount sâu.",
    },
    "Evening Saver": {
        "emoji": "🌆",
        "desc": "Peak giờ mua: 16h–21h. Săn deal đồ ăn tối.",
        "action": "Push notification đúng khung giờ tối, ưu tiên deal sắp hết hạn trong ngày (urgency).",
    },
    "Midday Saver": {
        "emoji": "🍱",
        "desc": "Peak giờ mua: 10h–14h. Săn deal cơm trưa, bánh mì dư.",
        "action": "Push trước giờ trưa (~10h30), nhắm các quán cơm/bánh mì sắp đóng ca sáng.",
    },
    "Occasional Saver": {
        "emoji": "🔁",
        "desc": "Đã từng dùng Giovang nhưng chưa thành thói quen (freq thấp hơn nhóm Saver).",
        "action": "Weekly digest nhắc lại + voucher nhỏ để kéo họ thành thói quen định kỳ.",
    },
    "Explorer": {
        "emoji": "🧭",
        "desc": "Chưa từng dùng Giovang, nhưng giovang_score cao — có hành vi nhạy giá rõ rệt ngoài app.",
        "action": "Onboarding mạnh: voucher đơn đầu tiên, ưu tiên CAC — đây là nhóm ROI cao nhất để đầu tư marketing.",
    },
    "New User": {
        "emoji": "🌱",
        "desc": "Tài khoản mới (<30 ngày), chưa đủ dữ liệu để phân loại hành vi rõ ràng.",
        "action": "Chuỗi onboarding email/push tự động trong 2 tuần đầu, theo dõi xem có chuyển sang segment khác.",
    },
    "Casual": {
        "emoji": "💤",
        "desc": "Hành vi mua thấp, không rơi vào nhóm nào rõ rệt — fallback segment.",
        "action": "KHÔNG ưu tiên notify thường xuyên (tránh spam) — chỉ thông báo khi deal cực hấp dẫn.",
    },
}

SEGMENT_ORDER = ["Deal Addict", "Pickup Commuter", "Evening Saver", "Midday Saver",
                  "Occasional Saver", "Explorer", "New User", "Casual"]

SEGMENT_COLORS = {
    "Deal Addict": "#FF4B4B", "Pickup Commuter": "#FF8C42", "Evening Saver": "#6C63FF",
    "Midday Saver": "#4DA8DA", "Occasional Saver": "#00B894", "Explorer": "#FDCB6E",
    "New User": "#A29BFE", "Casual": "#B2BEC3",
}

# ── HEADER ───────────────────────────────────────────────────────────────────────
st.title("🍱 Giovang")
st.subheader("Phân phối đồ ăn cuối giờ giảm giá — kết nối quán ăn dư đồ với người tiêu dùng nhạy giá")

col1, col2, col3 = st.columns(3)
with col1:
    st.markdown("**🎯 Vấn đề**")
    st.caption("Quán ăn dư đồ cuối ngày → lãng phí. Người tiêu dùng nhạy giá → muốn ăn rẻ, không quan tâm mới/cũ trong ngày.")
with col2:
    st.markdown("**📈 Thị trường**")
    st.caption("Food delivery VN ~4 tỷ USD (2024), ShopeeFood + GrabFood chiếm >90% — nhưng chưa ai tập trung riêng ngách *đồ cuối giờ giảm giá*.")
with col3:
    st.markdown("**💡 Giải pháp**")
    st.caption("Giovang: app trung gian, notify đúng người – đúng lúc – đúng deal, dựa trên phân khúc hành vi thực tế.")

st.divider()

# ── KPI CARDS ──────────────────────────────────────────────────────────────────
st.header("📊 Tổng quan 500 users (Pilot 3 tháng)")

k1, k2, k3, k4, k5 = st.columns(5)
k1.metric("Tổng users", f"{len(df):,}")
k2.metric("Gen Z", f"{df['is_gen_z'].mean()*100:.0f}%")
k3.metric("Đã dùng Giovang", f"{df['has_used_giovang'].mean()*100:.0f}%")
k4.metric("Giá trị đơn TB", f"{df['avg_order_value'].mean():,.0f}đ")
k5.metric("Engagement TB", f"{df['giovang_score'].mean():.2f}")

st.divider()

# ── SEGMENT CHART ──────────────────────────────────────────────────────────────
st.header("🧩 Phân khúc theo hành vi")
st.caption("Segment dựa trên **hành vi** (tần suất, giờ giấc, pickup, loyalty) — không dựa trên tuổi tác hay demographic.")

seg_counts = df["segment"].value_counts().reindex(SEGMENT_ORDER).reset_index()
seg_counts.columns = ["segment", "count"]

c1, c2 = st.columns([1, 1.2])
with c1:
    fig_donut = px.pie(
        seg_counts, names="segment", values="count", hole=0.45,
        color="segment", color_discrete_map=SEGMENT_COLORS,
    )
    fig_donut.update_traces(textinfo="percent+label")
    fig_donut.update_layout(showlegend=False, margin=dict(t=10, b=10, l=10, r=10))
    st.plotly_chart(fig_donut, use_container_width=True)

with c2:
    fig_bar = px.bar(
        seg_counts, x="count", y="segment", orientation="h",
        color="segment", color_discrete_map=SEGMENT_COLORS, text="count",
    )
    fig_bar.update_layout(
        showlegend=False, yaxis_title="", xaxis_title="Số users",
        yaxis=dict(categoryorder="array", categoryarray=SEGMENT_ORDER[::-1]),
        margin=dict(t=10, b=10, l=10, r=10),
    )
    st.plotly_chart(fig_bar, use_container_width=True)

st.divider()

# ── ACTION LAYER 1: SEGMENT PLAYBOOK ──────────────────────────────────────────
st.header("🎯 Lớp 1 — Action theo Segment")
st.caption("Mỗi segment có một playbook riêng: loại thông báo, nội dung, thời điểm gửi.")

for seg in SEGMENT_ORDER:
    info = SEGMENT_INFO[seg]
    count = int(seg_counts.loc[seg_counts["segment"] == seg, "count"].values[0])
    with st.expander(f"{info['emoji']} **{seg}** — {count} users ({count/len(df)*100:.1f}%)"):
        ec1, ec2 = st.columns([1, 1.3])
        with ec1:
            st.markdown("**Đặc điểm hành vi:**")
            st.write(info["desc"])
        with ec2:
            st.markdown("**Action đề xuất:**")
            st.success(info["action"])

st.divider()

# ── ACTION LAYER 2: GEN Z BOOST ───────────────────────────────────────────────
st.header("⚡ Lớp 2 — Gen Z Boost Layer")
st.markdown(
    "Gen Z **không phải một segment riêng** — đây là một **attribute cắt ngang qua mọi segment**, "
    "làm tăng tốc độ và mức độ ưu tiên của action ở Lớp 1, vì Gen Z convert nhanh hơn và "
    "có hiệu ứng lan toả (word-of-mouth) mạnh hơn."
)

g1, g2 = st.columns(2)
with g1:
    st.markdown("**Cơ chế trong hệ thống:**")
    st.markdown("""
    - Ngưỡng engagement để vào *High priority*: **0.25** (Gen Z) vs **0.35** (Non-Gen Z)
    - Ngưỡng tần suất đơn/tuần: **≥3** (Gen Z) vs **≥4** (Non-Gen Z)
    - Explorer: Gen Z cần freq ≥4 để lên High, Non-Gen Z cần freq ≥6
    - New User: Gen Z lên Medium ngay, Non-Gen Z chỉ Low
    """)
with g2:
    genz_high_pct = df[df["is_gen_z"]]["notify_priority"].eq("High").mean() * 100
    nongenz_high_pct = df[~df["is_gen_z"]]["notify_priority"].eq("High").mean() * 100
    st.metric("% Gen Z vào High priority", f"{genz_high_pct:.0f}%")
    st.metric("% Non-Gen Z vào High priority", f"{nongenz_high_pct:.0f}%")
    st.caption(f"→ Gen Z có tỉ lệ vào High priority cao gấp **{genz_high_pct/max(nongenz_high_pct,1):.1f}x** so với Non-Gen Z, dù cùng segment.")

st.markdown("##### 💡 Ví dụ minh họa overlap")
st.info(
    "**User A** — segment *Evening Saver*, Gen Z → nhận push đúng giờ tối (action Lớp 1) "
    "**+** được xếp vào hàng ưu tiên High dễ hơn, notify sớm hơn trong hàng đợi (boost Lớp 2).\n\n"
    "**User B** — cùng segment *Evening Saver*, không phải Gen Z → vẫn nhận push đúng giờ tối, "
    "nhưng cần engagement/freq cao hơn mới được xếp High — nếu không sẽ chỉ ở Medium."
)

st.markdown("##### 📱 Thử giao diện notification: Gen Z vs Non-Gen Z")
st.caption("Cùng một deal, nhưng tone & hình thức hiển thị khác nhau theo nhóm tuổi.")

toggle = st.toggle("Bật giao diện Gen Z 🔥", value=False)

if toggle:
    st.markdown(
        """
        <div style="
            background: linear-gradient(135deg, #FF4B4B, #FF8C42);
            border-radius: 16px; padding: 18px 22px; color: white;
            font-family: sans-serif; max-width: 420px; box-shadow: 0 4px 14px rgba(255,75,75,0.4);
        ">
            <div style="font-size: 13px; opacity: 0.9;">Giovang 🍱 · vừa xong</div>
            <div style="font-size: 17px; font-weight: 800; margin-top: 6px;">
                🔥 LỤM LIỀN KẺO LỠ! Cơm tấm giảm 50% 🔥
            </div>
            <div style="font-size: 14px; margin-top: 4px; opacity: 0.95;">
                Quán gần m chỉ còn 5 suất, hết là hết thật á 😭 Đặt ngay trước 21h nha!!
            </div>
            <div style="margin-top: 10px; font-size: 13px; font-weight: 700; text-decoration: underline;">
                ĂN NGAY →
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )
else:
    st.markdown(
        """
        <div style="
            background: #2D3436; border-radius: 12px; padding: 18px 22px; color: #DFE6E9;
            font-family: sans-serif; max-width: 420px; box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        ">
            <div style="font-size: 13px; opacity: 0.7;">Giovang · vừa xong</div>
            <div style="font-size: 16px; font-weight: 700; margin-top: 6px; color: white;">
                Ưu đãi cơm tấm giảm 50% gần bạn
            </div>
            <div style="font-size: 14px; margin-top: 4px; opacity: 0.85;">
                Số lượng còn lại có hạn. Áp dụng đến 21:00 hôm nay.
            </div>
            <div style="margin-top: 10px; font-size: 13px; font-weight: 600; color: #74B9FF;">
                Xem ưu đãi →
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

st.divider()

# ── NOTIFY PRIORITY BREAKDOWN ──────────────────────────────────────────────────
st.header("📣 Notify Priority — chiến lược go-to-market")

pri_counts = df["notify_priority"].value_counts().reindex(["High", "Medium", "Low"]).reset_index()
pri_counts.columns = ["priority", "count"]
pri_colors = {"High": "#FF4B4B", "Medium": "#FDCB6E", "Low": "#B2BEC3"}

p1, p2 = st.columns([1, 1.4])
with p1:
    for _, row in pri_counts.iterrows():
        pct = row["count"] / len(df) * 100
        st.metric(f"{row['priority']} priority", f"{int(row['count'])} users", f"{pct:.1f}%")
with p2:
    fig_pri = px.bar(
        pri_counts, x="priority", y="count", color="priority",
        color_discrete_map=pri_colors, text="count",
    )
    fig_pri.update_layout(showlegend=False, xaxis_title="", yaxis_title="Số users",
                           margin=dict(t=10, b=10, l=10, r=10))
    st.plotly_chart(fig_pri, use_container_width=True)

st.caption(
    "37.8% High priority — nhóm tập trung nguồn lực marketing/notify đầu tiên khi ra mắt thật. "
    "Phân bổ cân bằng giúp tránh *alert fatigue* (spam notify tất cả mọi người)."
)

st.divider()

# ── WARD DRILL-DOWN ────────────────────────────────────────────────────────────
st.header("🗺️ Phân bố theo khu vực (Ward)")

ward_seg = df.groupby(["ward", "segment"]).size().unstack(fill_value=0)
ward_totals = df["ward"].value_counts().reset_index()
ward_totals.columns = ["ward", "total"]
top_wards = ward_totals.head(15)

fig_ward = px.bar(
    top_wards, x="total", y="ward", orientation="h",
    title="Top 15 ward theo số lượng users",
    color_discrete_sequence=["#6C63FF"],
)
fig_ward.update_layout(yaxis=dict(categoryorder="total ascending"), yaxis_title="", xaxis_title="Số users")
st.plotly_chart(fig_ward, use_container_width=True)

st.caption("Dữ liệu phân bố theo ward thật của TP.HCM — hỗ trợ chiến lược mở rộng theo khu vực (quận nào nên onboard quán trước).")

st.divider()

# ── EXPLORER CONVERSION POTENTIAL ─────────────────────────────────────────────
st.header("💰 Business Case: Explorer Conversion")

explorers = df[df["segment"] == "Explorer"]
genz_explorers = explorers[explorers["is_gen_z"]]
CTR = 0.15

e1, e2, e3, e4 = st.columns(4)
e1.metric("Explorer tổng", f"{len(explorers)}")
e2.metric("Explorer là Gen Z", f"{len(genz_explorers)}")
e3.metric("CTR giả định", f"{CTR*100:.0f}%")
e4.metric("Dự kiến convert", f"~{int(len(explorers)*CTR)} users")

st.caption(
    "Explorer là nhóm có hành vi nhạy giá rõ rệt (giovang_score cao) nhưng CHƯA dùng Giovang — "
    "đây là tệp khách hàng tiềm năng rẻ nhất để target trong giai đoạn ra mắt, vì họ đã sẵn sàng về hành vi."
)

st.divider()

# ── INTERACTIVE FILTER ────────────────────────────────────────────────────────
st.header("🔍 Tự khám phá dữ liệu")

f1, f2 = st.columns(2)
with f1:
    age_filter = st.multiselect("Age Group", options=df["age_group"].unique().tolist(),
                                  default=df["age_group"].unique().tolist())
with f2:
    seg_filter = st.multiselect("Segment", options=SEGMENT_ORDER, default=SEGMENT_ORDER)

filtered = df[df["age_group"].isin(age_filter) & df["segment"].isin(seg_filter)]
st.caption(f"Đang hiển thị **{len(filtered)}** / {len(df)} users")

st.dataframe(
    filtered[[
        "user_id", "ward", "age_group", "is_gen_z", "segment", "notify_priority",
        "order_frequency_per_week", "avg_order_value", "giovang_score",
    ]].sort_values("giovang_score", ascending=False),
    use_container_width=True,
    height=350,
)

st.divider()
st.caption("Giovang — Demo data dùng cho mục đích pitch ý tưởng. Dữ liệu mô phỏng 500 users dựa trên hành vi thực tế thị trường food delivery HCMC.")