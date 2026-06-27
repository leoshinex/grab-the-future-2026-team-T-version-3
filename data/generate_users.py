import pandas as pd
import numpy as np

np.random.seed(42)

# ── CONFIG ───────────────────────────────────────────────────────────────────
N_USERS = 500

# App chuyên bán đồ ăn cuối giờ giảm giá
# Tất cả user đều nhạy giá — đã prove bằng việc dùng app
# Segment theo HÀNH VI (frequency, timing, pickup, loyalty)
# Gen Z là ATTRIBUTE ảnh hưởng PRIORITY — không phải segment

# ── WARD LIST ────────────────────────────────────────────────────────────────
ALL_WARDS = [
    "Phường Sài Gòn", "Phường Bến Thành", "Phường Tân Định",
    "Phường Cầu Ông Lãnh", "Phường Bàn Cờ", "Phường Xuân Hòa",
    "Phường Nhiêu Lộc", "Phường Đức Nhuận", "Phường Cầu Kiệu",
    "Phường Phú Nhuận", "Phường Xóm Chiếu", "Phường Khánh Hội",
    "Phường Vĩnh Hội", "Phường Chợ Quán", "Phường An Đông",
    "Phường Thủ Đức", "Phường Linh Xuân", "Phường Tam Bình",
    "Phường Tăng Nhơn Phú", "Phường Hiệp Bình", "Phường Long Bình",
    "Phường Phước Long", "Phường An Khánh", "Phường Bình Trưng",
    "Phường Cát Lái", "Phường Hạnh Thông", "Phường An Nhơn",
    "Phường Gò Vấp", "Phường An Hội Đông", "Phường Thông Tây Hội",
    "Phường Tân Sơn Hòa", "Phường Tân Sơn Nhất", "Phường Tân Hòa",
    "Phường Bảy Hiền", "Phường Tân Bình", "Phường Gia Định",
    "Phường Bình Thạnh", "Phường Bình Lợi Trung", "Phường Thạnh Mỹ Tây",
    "Phường Tân Sơn Nhì", "Phường Phú Thọ Hòa", "Phường Tân Phú",
    "Xã Bình Chánh", "Xã Hưng Long", "Xã Bình Hưng",
    "Xã Vĩnh Lộc", "Xã Tân Nhựt", "Xã Đông Thạnh",
    "Xã Hóc Môn", "Xã Xuân Thới Sơn", "Xã Bà Điểm",
    "Xã Nhà Bè", "Xã Hiệp Phước", "Phường An Lạc",
    "Phường Bình Tân", "Phường Bình Trị Đông",
    "Phường Đông Hòa", "Phường Dĩ An", "Phường Tân Đông Hiệp",
    "Phường An Phú", "Phường Bình Hòa", "Phường Lái Thiêu",
    "Phường Thuận An", "Phường Thuận Giao", "Phường Tân Khánh",
    "Phường Hòa Lợi", "Phường Thủ Dầu Một", "Phường Phú Lợi",
]

# ── AGE GROUP CONFIG ──────────────────────────────────────────────────────────
AGE_GROUPS = {
    "Gen Z": {
        "weight":             0.60,
        "age_min":            18,
        "age_max":            27,
        "order_value_min":    12000,
        "order_value_mode":   28000,
        "order_value_max":    55000,
        "voucher_base_boost": +0.15,
        "freq_min": 2, "freq_max": 10, "freq_mode": 4,
        "evening_base":       2.0,
        "evening_range":      2.5,
        "pickup_base":        0.42,
        "pickup_std":         0.15,
        "has_used_prob":      0.60,
        "order_base":         2,
        "view_mult":          2.0,
    },
    "Millennial": {
        "weight":             0.30,
        "age_min":            28,
        "age_max":            40,
        "order_value_min":    22000,
        "order_value_mode":   48000,
        "order_value_max":    95000,
        "voucher_base_boost": 0.0,
        "freq_min": 2, "freq_max": 8, "freq_mode": 3,
        "evening_base":       1.2,
        "evening_range":      1.5,
        "pickup_base":        0.28,
        "pickup_std":         0.12,
        "has_used_prob":      0.40,
        "order_base":         1,
        "view_mult":          1.5,
    },
    "Other": {
        "weight":             0.10,
        "age_min":            41,
        "age_max":            60,
        "order_value_min":    30000,
        "order_value_mode":   62000,
        "order_value_max":    120000,
        "voucher_base_boost": -0.10,
        "freq_min": 1, "freq_max": 5, "freq_mode": 2,
        "evening_base":       0.8,
        "evening_range":      1.0,
        "pickup_base":        0.20,
        "pickup_std":         0.10,
        "has_used_prob":      0.20,
        "order_base":         0,
        "view_mult":          1.2,
    },
}

CATEGORIES = [
    "Cơm tấm", "Bún bò", "Phở",
    "Hủ tiếu", "Bánh mì", "Bún riêu", "Cơm văn phòng"
]

AGE_GROUP_NAMES   = list(AGE_GROUPS.keys())
AGE_GROUP_WEIGHTS = np.array([AGE_GROUPS[g]["weight"] for g in AGE_GROUP_NAMES])
AGE_GROUP_WEIGHTS = AGE_GROUP_WEIGHTS / AGE_GROUP_WEIGHTS.sum()

# ── ASSIGN AGE GROUP & WARD ───────────────────────────────────────────────────
chosen_age_groups = np.random.choice(
    AGE_GROUP_NAMES, size=N_USERS, p=AGE_GROUP_WEIGHTS
)
chosen_wards = np.random.choice(ALL_WARDS, size=N_USERS)

age = np.array([
    np.random.randint(
        AGE_GROUPS[g]["age_min"],
        AGE_GROUPS[g]["age_max"] + 1
    )
    for g in chosen_age_groups
])

is_gen_z = chosen_age_groups == "Gen Z"

# ── LAYER 1: RAW BEHAVIOR ─────────────────────────────────────────────────────

# avg_order_value — giá đã giảm sẵn so với GrabFood thường
avg_order_value = np.array([
    np.random.triangular(
        left=AGE_GROUPS[g]["order_value_min"],
        mode=AGE_GROUPS[g]["order_value_mode"],
        right=AGE_GROUPS[g]["order_value_max"]
    )
    for g in chosen_age_groups
])
avg_order_value = np.clip(avg_order_value, 12000, 120000)
avg_order_value = avg_order_value.round(-3).astype(int)

# voucher_usage_rate — vẫn giữ trong data
# Ít dùng trong segment vì tất cả user đều nhạy giá
voucher_base = 1 - (avg_order_value - 12000) / (120000 - 12000)
age_voucher_boost = np.array([
    AGE_GROUPS[g]["voucher_base_boost"] for g in chosen_age_groups
])
voucher_usage_rate = np.clip(
    voucher_base * 0.60
    + np.random.normal(0, 0.10, N_USERS)
    + age_voucher_boost,
    0.05, 0.95
).round(2)

# order_frequency_per_week
order_frequency_per_week = np.clip(
    np.array([
        int(np.random.triangular(
            left=AGE_GROUPS[g]["freq_min"],
            mode=AGE_GROUPS[g]["freq_mode"],
            right=AGE_GROUPS[g]["freq_max"]
        ))
        for g in chosen_age_groups
    ]),
    1, 14
)

# peak_order_hour — 2 peak: trưa và tối
# Thêm 9-10h vì có quán bán sáng cuối giờ
peak_probs = np.array([
    0.01, 0.02, 0.03, 0.06, 0.10, 0.12, 0.10, 0.04,
    0.03, 0.03, 0.09, 0.12, 0.10, 0.08, 0.06, 0.04, 0.02
])
peak_probs = peak_probs / peak_probs.sum()

peak_order_hour = np.random.choice(
    range(6, 23), N_USERS, p=peak_probs
)

# account_age_days
# Pilot chạy 3 tháng (~90 ngày) nên account tối đa ~90 ngày tuổi.
# Cho phép có user mới (<30 ngày) để nhánh "New User" trong assign_segment có dữ liệu thật.
account_age_days = np.random.randint(1, 91, N_USERS)

# evening_order_frequency
# Đây là tập con của order_frequency_per_week (số đơn buổi tối trong tổng số đơn/tuần),
# nên không được vượt quá tổng order_frequency_per_week của user đó.
is_evening_peak = np.isin(peak_order_hour, [17, 18, 19, 20])
evening_order_frequency_raw = np.array([
    np.random.uniform(
        AGE_GROUPS[g]["evening_base"],
        AGE_GROUPS[g]["evening_base"] + AGE_GROUPS[g]["evening_range"]
    ) if is_eve else
    np.random.uniform(0.0, AGE_GROUPS[g]["evening_base"] * 0.5)
    for g, is_eve in zip(chosen_age_groups, is_evening_peak)
])
evening_order_frequency = np.clip(
    evening_order_frequency_raw,
    0.0,
    order_frequency_per_week  # không thể có nhiều đơn tối hơn tổng đơn/tuần
).round(1)

# pickup_rate
pickup_rate = np.clip(
    np.array([
        np.random.normal(
            loc=AGE_GROUPS[g]["pickup_base"],
            scale=AGE_GROUPS[g]["pickup_std"]
        )
        for g in chosen_age_groups
    ]),
    0.05, 0.95
).round(2)

delivery_rate = (1 - pickup_rate).round(2)

# favorite_category
favorite_category = np.random.choice(CATEGORIES, N_USERS)

# has_used_giovang
has_used_giovang = np.array([
    np.random.choice(
        [True, False],
        p=[AGE_GROUPS[g]["has_used_prob"],
           1 - AGE_GROUPS[g]["has_used_prob"]]
    )
    for g in chosen_age_groups
])

# giovang_order_count
# Pilot chạy ~13 tuần (3 tháng). Trần hợp lý cho 1 user phải tỉ lệ theo
# order_frequency_per_week của họ (vd: freq=9/tuần thì trần phải cao hơn freq=2/tuần),
# không thể cap cứng ở 12 cho tất cả — vì user freq cao sẽ bị bóp méo (mất biến thiên).
PILOT_WEEKS = 13
age_order_base = np.array([
    AGE_GROUPS[g]["order_base"] for g in chosen_age_groups
])
order_count_cap = np.maximum(
    np.round(order_frequency_per_week * PILOT_WEEKS * 0.5).astype(int),  # tối đa ~50% đơn qua Giovang
    1
)
raw_orders = np.clip(
    np.round(
        age_order_base
        + order_frequency_per_week * 0.8
        + np.random.normal(0, 1.5, N_USERS)
    ).astype(int),
    1, order_count_cap
)
giovang_order_count = np.where(has_used_giovang, raw_orders, 0)

# giovang_view_count
age_view_mult = np.array([
    AGE_GROUPS[g]["view_mult"] for g in chosen_age_groups
])
view_count_cap = np.maximum(order_count_cap * 3, giovang_order_count)
raw_views = np.clip(
    np.round(
        giovang_order_count * age_view_mult
        + np.random.normal(0, 2, N_USERS)
    ).astype(int),
    giovang_order_count,
    view_count_cap
)
giovang_view_count = np.where(has_used_giovang, raw_views, 0)

# ── LAYER 2: DERIVED SCORES ───────────────────────────────────────────────────

price_sensitivity_score = (
    (1 - (avg_order_value - 12000) / (120000 - 12000)) * 0.5
    + voucher_usage_rate * 0.5
).round(3)

deal_seeking_score = (
    voucher_usage_rate * 0.5
    + (order_frequency_per_week / 14) * 0.5
).round(3)

activity_score = (
    (order_frequency_per_week / 14) * 0.6
    + np.minimum(account_age_days / 90, 1.0) * 0.4
).round(3)

pickup_score = pickup_rate.copy()

with np.errstate(invalid='ignore'):
    conversion_rate = np.where(
        giovang_view_count > 0,
        giovang_order_count / giovang_view_count,
        0.0
    )

giovang_engagement_score = np.where(
    has_used_giovang,
    (
        np.minimum(giovang_order_count / 8, 1.0) * 0.5
        + np.minimum(giovang_view_count / 20, 1.0) * 0.2
        + conversion_rate * 0.3
    ),
    0.0
).round(3)

def calc_time_match(row):
    hour     = row["peak_order_hour"]
    eve_freq = row["evening_order_frequency"]

    if hour in [17, 18, 19, 20]:
        base = 1.0
    elif hour in [10, 11, 12, 13, 16, 21]:
        base = 0.6
    elif hour in [9, 14, 15]:
        base = 0.4
    else:
        base = 0.2

    frequency_bonus = min(eve_freq / 4.0, 1.0) * 0.10
    return round(min(base + frequency_bonus, 1.0), 3)

# ── LAYER 3: SEGMENT & PRIORITY ──────────────────────────────────────────────

def assign_segment(row):
    freq     = row["order_frequency_per_week"]
    order    = row["giovang_order_count"]
    hour     = row["peak_order_hour"]
    pickup   = row["pickup_rate"]
    has_used = row["has_used_giovang"]
    acc_age  = row["account_age_days"]
    score    = row["giovang_score"]

    # New User — chưa đủ data
    if acc_age < 30:
        return "New User"

    # Deal Addict — loyal nhất, mua gần hàng ngày
    if freq >= 5 and order >= 6:
        return "Deal Addict"

    # Pickup Commuter — tự đến lấy, hành vi đặc thù
    # Check trước Evening/Midday vì pickup > timing
    elif pickup >= 0.55 and freq >= 3 and has_used:
        return "Pickup Commuter"

    # Evening Saver — mua deal buổi tối
    elif hour in [16, 17, 18, 19, 20, 21] and freq >= 3 and has_used:
        return "Evening Saver"

    # Midday Saver — mua deal buổi trưa
    # Quán cơm, bánh mì thừa lúc 11-13h
    elif hour in [10, 11, 12, 13, 14] and freq >= 3 and has_used:
        return "Midday Saver"

    # Occasional Saver — đã mua nhưng chưa thành habit
    elif has_used and freq >= 2:
        return "Occasional Saver"

    # Explorer — chưa mua, có tiềm năng
    elif not has_used and score >= 0.40:
        return "Explorer"

    # Casual — fallback
    else:
        return "Casual"


def assign_priority(row):
    segment  = row["segment"]
    freq     = row["order_frequency_per_week"]
    eng      = row["giovang_engagement_score"]
    is_gen_z = row["is_gen_z"]

    # Gen Z là yếu tố BOOST (ngưỡng thấp hơn), không phải auto-High.
    # Tránh alert fatigue: user vẫn phải có hành vi/engagement tối thiểu để vào High.
    eng_threshold  = 0.25 if is_gen_z else 0.35
    freq_threshold = 3    if is_gen_z else 4

    # Deal Addict — High bất kể tuổi (proven loyal, đã đạt freq>=5 & order>=6)
    if segment == "Deal Addict":
        return "High"

    # Pickup Commuter — High bất kể tuổi (model lý tưởng, đã có has_used & pickup cao)
    elif segment == "Pickup Commuter":
        return "High"

    # Evening Saver
    elif segment == "Evening Saver":
        if eng >= eng_threshold and freq >= freq_threshold:
            return "High"
        else:
            return "Medium"

    # Midday Saver
    elif segment == "Midday Saver":
        if eng >= eng_threshold and freq >= freq_threshold:
            return "High"
        else:
            return "Medium"

    # Explorer — chưa mua nhưng giovang_score cao (đã lọc ở assign_segment).
    # Gen Z được ưu tiên hơn vì khả năng convert tốt hơn, nhưng vẫn cần freq tối thiểu.
    elif segment == "Explorer":
        if is_gen_z and freq >= 4:
            return "High"
        elif freq >= 6:
            return "High"          # Non-Gen Z nhưng order rất thường xuyên ngoài app → vẫn đáng convert
        return "Medium"

    # Occasional Saver
    elif segment == "Occasional Saver":
        if freq >= freq_threshold:
            return "High" if is_gen_z else "Medium"
        elif freq >= 2:
            return "Medium"
        else:
            return "Low"

    # New User
    elif segment == "New User":
        if is_gen_z:
            return "Medium"        # Gen Z mới → onboard tốt
        return "Low"

    # Casual
    else:
        return "Low"


# ── BUILD DATAFRAME ───────────────────────────────────────────────────────────
df = pd.DataFrame({
    "user_id":                  [f"U{str(i).zfill(4)}" for i in range(N_USERS)],
    "ward":                     chosen_wards,
    "age_group":                chosen_age_groups,
    "age":                      age,
    "is_gen_z":                 is_gen_z,
    "account_age_days":         account_age_days,
    "favorite_category":        favorite_category,
    "avg_order_value":          avg_order_value,
    "voucher_usage_rate":       voucher_usage_rate,
    "order_frequency_per_week": order_frequency_per_week,
    "peak_order_hour":          peak_order_hour,
    "evening_order_frequency":  evening_order_frequency,
    "pickup_rate":              pickup_rate,
    "delivery_rate":            delivery_rate,
    "has_used_giovang":         has_used_giovang,
    "giovang_order_count":      giovang_order_count,
    "giovang_view_count":       giovang_view_count,
    "price_sensitivity_score":  price_sensitivity_score,
    "deal_seeking_score":       deal_seeking_score,
    "activity_score":           activity_score,
    "pickup_score":             pickup_score,
    "giovang_engagement_score": giovang_engagement_score,
})

df["time_match_score"] = df.apply(calc_time_match, axis=1)

df["giovang_score"] = (
    df["deal_seeking_score"]         * 0.25
    + df["time_match_score"]         * 0.20
    + df["activity_score"]           * 0.20
    + df["giovang_engagement_score"] * 0.20
    + df["pickup_score"]             * 0.10
    + df["price_sensitivity_score"]  * 0.05
).round(3)

df["segment"]         = df.apply(assign_segment, axis=1)
df["notify_priority"] = df.apply(assign_priority, axis=1)

# ── EXPORT ────────────────────────────────────────────────────────────────────
df.to_csv("data/users.csv", index=False)

# ── SUMMARY ──────────────────────────────────────────────────────────────────
print("✅ users.csv generated!")
print(f"   App: Đồ ăn cuối giờ giảm giá")
print(f"   Segment: Hành vi | Priority: Hành vi + Gen Z attribute")
print(f"   Total: {len(df):,} users · Pilot 3 tháng")

print("\n📊 Segment breakdown:")
seg = df["segment"].value_counts()
for s, c in seg.items():
    print(f"   {s:<20} {c:>4} ({c/len(df)*100:.1f}%)")

print("\n📊 Segment × Age Group:")
print(df.groupby(["segment", "age_group"]).size()
      .unstack(fill_value=0).to_string())

print("\n📊 Segment stats:")
stats = df.groupby("segment").agg(
    count        = ("user_id", "count"),
    pct_genz     = ("is_gen_z", "mean"),
    avg_freq     = ("order_frequency_per_week", "mean"),
    avg_pickup   = ("pickup_rate", "mean"),
    avg_orders   = ("giovang_order_count", "mean"),
    has_used_pct = ("has_used_giovang", "mean"),
    avg_score    = ("giovang_score", "mean"),
).round(2)
print(stats.to_string())

print("\n📊 Notify priority:")
pri = df["notify_priority"].value_counts()
for p, c in pri.items():
    print(f"   {p:<8} {c:>4} ({c/len(df)*100:.1f}%)")

print("\n📊 Priority × Gen Z:")
print(df.groupby(["notify_priority", "is_gen_z"]).size()
      .unstack(fill_value=0)
      .rename(columns={False: "Non-Gen Z", True: "Gen Z"})
      .to_string())

print("\n🔍 Impact numbers:")
genz      = df[df["is_gen_z"]]
explorers = df[df["segment"] == "Explorer"]
genz_exp  = df[df["is_gen_z"] & (df["segment"] == "Explorer")]
high      = df[df["notify_priority"] == "High"]
CTR       = 0.15
print(f"   Gen Z users:                {len(genz)} ({len(genz)/len(df)*100:.1f}%)")
print(f"   Explorer tổng:              {len(explorers)} ({len(explorers)/len(df)*100:.1f}%)")
print(f"   Explorer Gen Z:             {len(genz_exp)} — priority High, convert ngay")
print(f"   Projected convert (CTR 15%): ~{int(len(explorers)*CTR)} users")
print(f"   High priority tổng:         {len(high)} ({len(high)/len(df)*100:.1f}%)")
print(f"   Avg orders (đã dùng):       {df[df['has_used_giovang']]['giovang_order_count'].mean():.1f} lần/3 tháng")

print("\n🔍 Sample 5 users:")
print(df[[
    "user_id", "age_group", "age", "is_gen_z",
    "order_frequency_per_week", "peak_order_hour",
    "pickup_rate", "has_used_giovang",
    "giovang_order_count", "giovang_score",
    "segment", "notify_priority"
]].head().to_string())