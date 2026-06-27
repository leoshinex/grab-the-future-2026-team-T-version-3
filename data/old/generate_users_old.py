import pandas as pd
import numpy as np

np.random.seed(42)

# ── CONFIG ───────────────────────────────────────────────────────────────────
N_USERS = 500

# ── AREA DATA ────────────────────────────────────────────────────────────────
CLUSTERS = {
    "Trung tâm": {
        "weight": 0.10,
        "wards": [
            "Phường Sài Gòn", "Phường Tân Định", "Phường Bến Thành",
            "Phường Cầu Ông Lãnh", "Phường Bàn Cờ", "Phường Xuân Hòa",
            "Phường Nhiêu Lộc", "Phường Đức Nhuận", "Phường Cầu Kiệu",
            "Phường Phú Nhuận"
        ],
        # Quán đắt, thu nhập cao, ít price-sensitive
        # Min 60k vì quán trung tâm hiếm khi dưới mức này
        "order_value_min":         60000,
        "order_value_mode":        90000,
        "order_value_max":        150000,
        "voucher_usage_boost":     -0.15,
        "evening_frequency_boost": -0.5,
    },
    "Sinh viên": {
        "weight": 0.25,
        "wards": [
            "Phường Thủ Đức", "Phường Linh Xuân", "Phường Tam Bình",
            "Phường Tăng Nhơn Phú", "Phường Hiệp Bình", "Phường Long Bình",
            "Phường Phước Long", "Phường An Khánh", "Phường Bình Trưng",
            "Phường Cát Lái"
        ],
        # Trợ cấp gia đình ~2-3tr/tháng, ăn uống ~30-40%
        # Hay ăn theo nhóm nên max lên đến 60k
        "order_value_min":         20000,
        "order_value_mode":        35000,
        "order_value_max":         60000,
        "voucher_usage_boost":     +0.20,
        "evening_frequency_boost": +1.0,
    },
    "Công nhân": {
        "weight": 0.30,
        "wards": [
            "Phường Đông Hòa", "Phường Dĩ An", "Phường Tân Đông Hiệp",
            "Phường An Phú", "Phường Bình Hòa", "Phường Lái Thiêu",
            "Phường Thuận An", "Phường Thuận Giao", "Phường Tân Khánh",
            "Phường Hòa Lợi"
        ],
        # Lương KCN Bình Dương ~6-8tr/tháng
        # Chi ăn uống ~15% → ~900k-1.2tr/tháng → ~30-40k/bữa
        # Max 50k vì hiếm khi chi nhiều hơn
        "order_value_min":         20000,
        "order_value_mode":        30000,
        "order_value_max":         50000,
        "voucher_usage_boost":     +0.25,
        "evening_frequency_boost": +1.5,
    },
    "Dân cư đông": {
        "weight": 0.25,
        "wards": [
            "Phường Hạnh Thông", "Phường An Nhơn", "Phường Gò Vấp",
            "Phường An Hội Đông", "Phường Thông Tây Hội", "Phường An Hội Tây",
            "Phường Tân Sơn Hòa", "Phường Tân Sơn Nhất", "Phường Tân Hòa",
            "Phường Bảy Hiền", "Phường Tân Bình", "Phường Gia Định",
            "Phường Bình Thạnh", "Phường Bình Lợi Trung", "Phường Thạnh Mỹ Tây",
            "Phường Xóm Chiếu", "Phường Khánh Hội", "Phường Vĩnh Hội"
        ],
        # Thu nhập đa dạng nhất — range rộng nhất
        # Từ lao động phổ thông đến văn phòng
        "order_value_min":         25000,
        "order_value_mode":        55000,
        "order_value_max":        100000,
        "voucher_usage_boost":     +0.05,
        "evening_frequency_boost": +0.2,
    },
    "Ngoại ô": {
        "weight": 0.10,
        "wards": [
            "Xã Bình Chánh", "Xã Hưng Long", "Xã Bình Hưng",
            "Xã Vĩnh Lộc", "Xã Tân Nhựt", "Xã Đông Thạnh",
            "Xã Hóc Môn", "Xã Xuân Thới Sơn", "Xã Bà Điểm",
            "Xã Nhà Bè", "Xã Hiệp Phước", "Phường An Lạc",
            "Phường Bình Tân", "Phường Bình Trị Đông"
        ],
        # Grab user ở ngoại ô thường tầng lớp trung bình
        # Không rẻ hơn dân cư đông — khác biệt là Grab ít phổ biến hơn
        "order_value_min":         30000,
        "order_value_mode":        55000,
        "order_value_max":         90000,
        "voucher_usage_boost":     0.0,
        "evening_frequency_boost": -0.3,
    },
}

CLUSTER_NAMES   = list(CLUSTERS.keys())
CLUSTER_WEIGHTS = np.array([CLUSTERS[c]["weight"] for c in CLUSTER_NAMES])
CLUSTER_WEIGHTS = CLUSTER_WEIGHTS / CLUSTER_WEIGHTS.sum()

# ── ASSIGN CLUSTER & WARD ────────────────────────────────────────────────────
chosen_clusters = np.random.choice(
    CLUSTER_NAMES, size=N_USERS, p=CLUSTER_WEIGHTS
)

chosen_wards = [
    np.random.choice(CLUSTERS[c]["wards"])
    for c in chosen_clusters
]

# ── LAYER 1: RAW BEHAVIOR ────────────────────────────────────────────────────

# avg_order_value — dùng triangular distribution thay vì lognormal
# Triangular nhận 3 tham số: min, max, mode — phản ánh đúng range đã định nghĩa
# Ví dụ Công nhân: hầu hết đặt quanh 30k, ít ai dưới 20k hoặc trên 50k
avg_order_value = np.array([
    np.random.triangular(
        left=CLUSTERS[c]["order_value_min"],
        mode=CLUSTERS[c]["order_value_mode"],
        right=CLUSTERS[c]["order_value_max"]
    )
    for c in chosen_clusters
])

avg_order_value = np.clip(avg_order_value, 20000, 150000)
avg_order_value = avg_order_value.round(-3).astype(int)  # làm tròn đến 1,000đ

# voucher_usage_rate_90d — negative correlation với order value + cluster boost
voucher_base = 1 - (avg_order_value - 20000) / (150000 - 20000)
cluster_voucher_boost = np.array([
    CLUSTERS[c]["voucher_usage_boost"] for c in chosen_clusters
])
voucher_usage_rate_90d = np.clip(
    voucher_base * 0.7
    + np.random.normal(0, 0.10, N_USERS)
    + cluster_voucher_boost,
    0.05, 0.95
).round(2)

# order_frequency_per_week
order_freq_probs = np.array([
    0.05, 0.10, 0.15, 0.15, 0.12, 0.10, 0.08, 0.07,
    0.06, 0.04, 0.03, 0.02, 0.02, 0.01
])
order_freq_probs = order_freq_probs / order_freq_probs.sum()

order_frequency_per_week = np.random.choice(
    range(1, 15), N_USERS, p=order_freq_probs
)

# peak_order_hour — 2 peak thực tế: 11-13h (trưa) và 17-20h (tối)
peak_probs = np.array([
    0.01, 0.02, 0.03, 0.08, 0.12, 0.10, 0.04, 0.03,
    0.03, 0.03, 0.10, 0.12, 0.10, 0.08, 0.06, 0.04, 0.02
])
peak_probs = peak_probs / peak_probs.sum()

peak_order_hour = np.random.choice(
    range(6, 23), N_USERS, p=peak_probs
)

# account_age_days — 30 ngày đến 5 năm
account_age_days = np.random.randint(30, 1825, N_USERS)

# evening_order_frequency — correlated với peak_hour + cluster boost
is_evening_peak = np.isin(peak_order_hour, [17, 18, 19, 20])
cluster_evening_boost = np.array([
    CLUSTERS[c]["evening_frequency_boost"] for c in chosen_clusters
])
evening_order_frequency = np.clip(
    np.where(
        is_evening_peak,
        np.random.uniform(1.5, 4.0, N_USERS),
        np.random.uniform(0.0, 1.5, N_USERS)
    ) + cluster_evening_boost,
    0.0, 7.0
).round(1)

# evening_order_recency_days — correlated với frequency
evening_order_recency_days = np.where(
    evening_order_frequency >= 2.0,
    np.random.randint(1, 14, N_USERS),
    np.random.randint(7, 91, N_USERS)
)

# ── LAYER 2: DERIVED SCORES ──────────────────────────────────────────────────

price_sensitivity_score = (
    (1 - (avg_order_value - 20000) / (150000 - 20000)) * 0.5
    + voucher_usage_rate_90d * 0.5
).round(3)

deal_seeking_score = (
    voucher_usage_rate_90d * 0.6
    + (order_frequency_per_week / 14) * 0.4
).round(3)

activity_score = (
    (order_frequency_per_week / 14) * 0.6
    + np.minimum(account_age_days / 365, 1.0) * 0.4
).round(3)

def calc_time_match(row):
    hour     = row["peak_order_hour"]
    eve_freq = row["evening_order_frequency"]
    eve_rec  = row["evening_order_recency_days"]

    if hour in [17, 18, 19, 20]:
        base = 1.0
    elif hour in [16, 21]:
        base = 0.5
    else:
        base = 0.2

    frequency_bonus = min(eve_freq / 4.0, 1.0) * 0.15
    recency_bonus   = max(0, (90 - eve_rec) / 90) * 0.10

    return round(min(base + frequency_bonus + recency_bonus, 1.0), 3)

# ── LAYER 3: OUTPUT ──────────────────────────────────────────────────────────

def assign_segment(row):
    score   = row["giovang_score"]
    voucher = row["voucher_usage_rate_90d"]
    t_match = row["time_match_score"]
    age     = row["account_age_days"]
    freq    = row["order_frequency_per_week"]

    if score >= 0.75 and voucher >= 0.70 and freq >= 4:
        return "Deal Hunter"
    elif score >= 0.68 and voucher < 0.70:
        return "Budget Conscious"
    elif score >= 0.68:
        return "High Value Target"
    elif t_match >= 0.70 and score >= 0.45:
        return "Evening Regular"
    elif age < 90:
        return "New User"
    else:
        return "Casual User"

def assign_priority(score):
    if score >= 0.68:
        return "High"
    elif score >= 0.45:
        return "Medium"
    else:
        return "Low"

# ── BUILD DATAFRAME ──────────────────────────────────────────────────────────
df = pd.DataFrame({
    "user_id":                    [f"U{str(i).zfill(4)}" for i in range(N_USERS)],
    "area_cluster":               chosen_clusters,
    "ward":                       chosen_wards,
    "account_age_days":           account_age_days,
    "avg_order_value":            avg_order_value,
    "voucher_usage_rate_90d":     voucher_usage_rate_90d,
    "order_frequency_per_week":   order_frequency_per_week,
    "peak_order_hour":            peak_order_hour,
    "evening_order_frequency":    evening_order_frequency,
    "evening_order_recency_days": evening_order_recency_days,
    "price_sensitivity_score":    price_sensitivity_score,
    "deal_seeking_score":         deal_seeking_score,
    "activity_score":             activity_score,
})

df["time_match_score"] = df.apply(calc_time_match, axis=1)

df["giovang_score"] = (
    df["price_sensitivity_score"] * 0.35
    + df["deal_seeking_score"]    * 0.30
    + df["time_match_score"]      * 0.25
    + df["activity_score"]        * 0.10
).round(3)

df["segment"]         = df.apply(assign_segment, axis=1)
df["notify_priority"] = df["giovang_score"].apply(assign_priority)

# ── EXPORT ───────────────────────────────────────────────────────────────────
df.to_csv("data/users_old.csv", index=False)

# ── SUMMARY ──────────────────────────────────────────────────────────────────
print("✅ users_old.csv generated!")
print(f"   Total users: {len(df):,}")

print("\n📊 Cluster breakdown:")
cluster_summary = df.groupby("area_cluster").agg(
    count         = ("user_id", "count"),
    order_min     = ("avg_order_value", "min"),
    order_mode    = ("avg_order_value", lambda x: x.mode()[0]),
    order_max     = ("avg_order_value", "max"),
    avg_voucher   = ("voucher_usage_rate_90d", "mean"),
    avg_score     = ("giovang_score", "mean"),
)
cluster_summary["avg_voucher"] = cluster_summary["avg_voucher"].round(3)
cluster_summary["avg_score"]   = cluster_summary["avg_score"].round(3)
print(cluster_summary.to_string())

print("\n📊 Segment breakdown:")
seg = df["segment"].value_counts()
for s, c in seg.items():
    print(f"   {s:<22} {c:>4} ({c/len(df)*100:.1f}%)")

print("\n📊 Notify priority:")
pri = df["notify_priority"].value_counts()
for p, c in pri.items():
    print(f"   {p:<8} {c:>4} ({c/len(df)*100:.1f}%)")

print("\n📊 GrabSave score by cluster:")
print(df.groupby("area_cluster")["giovang_score"].mean()
      .sort_values(ascending=False).round(3).to_string())

print("\n🔍 Order value range theo cluster (justify assumptions):")
ov = df.groupby("area_cluster")["avg_order_value"].agg(["min","mean","max"])
ov["mean"] = ov["mean"].round(0)
print(ov.to_string())

print("\n🔍 Segment theo cluster:")
print(df.groupby(["area_cluster","segment"]).size()
      .unstack(fill_value=0).to_string())