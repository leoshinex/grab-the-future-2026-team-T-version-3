import pandas as pd
import numpy as np

np.random.seed(42)

# ── CONFIG ───────────────────────────────────────────────────────────────────
N_RESTAURANTS = 150

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
        "menu_size_min": 1,
        "menu_size_max": 4,
        # Quán trung tâm kiểm soát tốt, ít waste hơn
        "waste_min":     1,
        "waste_max":     10,
    },
    "Sinh viên": {
        "weight": 0.25,
        "wards": [
            "Phường Thủ Đức", "Phường Linh Xuân", "Phường Tam Bình",
            "Phường Tăng Nhơn Phú", "Phường Hiệp Bình", "Phường Long Bình",
            "Phường Phước Long", "Phường An Khánh", "Phường Bình Trưng",
            "Phường Cát Lái"
        ],
        "menu_size_min": 1,
        "menu_size_max": 5,
        # Quán bình dân, nấu nhiều hơn nhu cầu để không bị hết
        "waste_min":     2,
        "waste_max":     20,
    },
    "Công nhân": {
        "weight": 0.35,
        "wards": [
            "Phường Đông Hòa", "Phường Dĩ An", "Phường Tân Đông Hiệp",
            "Phường An Phú", "Phường Bình Hòa", "Phường Lái Thiêu",
            "Phường Thuận An", "Phường Thuận Giao", "Phường Tân Khánh",
            "Phường Hòa Lợi"
        ],
        "menu_size_min": 1,
        "menu_size_max": 4,
        # Nấu số lượng lớn cho KCN → waste nhiều nhất
        # Min 3 vì khó có chuyện chỉ thừa 1-2 món khi nấu bulk
        "waste_min":     3,
        "waste_max":     30,
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
        "menu_size_min": 1,
        "menu_size_max": 6,
        # Đa dạng nhất — range waste rộng
        "waste_min":     2,
        "waste_max":     20,
    },
    "Ngoại ô": {
        "weight": 0.05,
        "wards": [
            "Xã Bình Chánh", "Xã Hưng Long", "Xã Bình Hưng",
            "Xã Vĩnh Lộc", "Xã Tân Nhựt", "Xã Đông Thạnh",
            "Xã Hóc Môn", "Xã Xuân Thới Sơn", "Xã Bà Điểm",
            "Xã Nhà Bè", "Xã Hiệp Phước", "Phường An Lạc",
            "Phường Bình Tân", "Phường Bình Trị Đông"
        ],
        "menu_size_min": 1,
        "menu_size_max": 3,
        # Quán nhỏ, ít khách → waste ít
        "waste_min":     1,
        "waste_max":     12,
    },
}

CATEGORIES = [
    "Cơm tấm", "Bún bò", "Phở",
    "Hủ tiếu", "Bánh mì", "Bún riêu", "Cơm văn phòng"
]

GIOVANG_OPTIONS = ["both", "pickup_only", "delivery_only"]
GIOVANG_WEIGHTS = [0.60,   0.25,          0.15]

CLUSTER_NAMES   = list(CLUSTERS.keys())
CLUSTER_WEIGHTS = np.array([CLUSTERS[c]["weight"] for c in CLUSTER_NAMES])
CLUSTER_WEIGHTS = CLUSTER_WEIGHTS / CLUSTER_WEIGHTS.sum()

# ── ASSIGN CLUSTER & WARD ────────────────────────────────────────────────────
chosen_clusters = np.random.choice(
    CLUSTER_NAMES, size=N_RESTAURANTS, p=CLUSTER_WEIGHTS
)

chosen_wards = [
    np.random.choice(CLUSTERS[c]["wards"])
    for c in chosen_clusters
]

# ── GENERATE COLUMNS ─────────────────────────────────────────────────────────

restaurant_ids = [f"R{str(i).zfill(3)}" for i in range(N_RESTAURANTS)]

FIRST_NAMES = [
    "Bà Lan", "Cô Mai", "Chú Tám", "Anh Hùng", "Minh Tâm",
    "Chị Ba", "Dì Tư", "Bác Năm", "Cô Sáu", "Chú Bảy",
    "Bà Chín", "Cô Mười", "Anh Tuấn", "Chị Hương", "Bà Hoa"
]
names = [
    f"Quán {np.random.choice(FIRST_NAMES)} {i}"
    for i in range(N_RESTAURANTS)
]

categories = np.random.choice(CATEGORIES, N_RESTAURANTS)

# Rating — 4.0 đến 5.0, random đều
rating = np.round(np.random.uniform(4.0, 5.0, N_RESTAURANTS), 1)

# menu_size — số món trong Giờ Vàng menu, theo cluster
menu_size = np.array([
    np.random.randint(
        CLUSTERS[c]["menu_size_min"],
        CLUSTERS[c]["menu_size_max"] + 1
    )
    for c in chosen_clusters
])

# avg_daily_waste_items — theo cluster
avg_daily_waste_items = np.array([
    np.random.randint(
        CLUSTERS[c]["waste_min"],
        CLUSTERS[c]["waste_max"] + 1
    )
    for c in chosen_clusters
])

# sale_window_start — quán tự chọn, random 9h-20h
# sale_window_end   — start + 2h, tối đa 22h
sale_window_start = np.random.randint(9, 21, N_RESTAURANTS)
sale_window_end   = np.clip(sale_window_start + 2, 10, 22)

# operates_lunch / operates_dinner — suy ra từ sale_window_start
operates_lunch  = sale_window_start < 15
operates_dinner = sale_window_start >= 15

# giovang_option
giovang_option = np.random.choice(
    GIOVANG_OPTIONS, N_RESTAURANTS, p=GIOVANG_WEIGHTS
)

# avg_discount_pct — random 30-60%, quán tự quyết định
avg_discount_pct = np.random.randint(30, 61, N_RESTAURANTS)

# ── BUILD DATAFRAME ──────────────────────────────────────────────────────────
df = pd.DataFrame({
    "restaurant_id":         restaurant_ids,
    "name":                  names,
    "ward":                  chosen_wards,
    "area_cluster":          chosen_clusters,
    "category":              categories,
    "rating":                rating,
    "menu_size":             menu_size,
    "avg_daily_waste_items": avg_daily_waste_items,
    "sale_window_start":     sale_window_start,
    "sale_window_end":       sale_window_end,
    "operates_lunch":        operates_lunch,
    "operates_dinner":       operates_dinner,
    "giovang_option":        giovang_option,
    "avg_discount_pct":      avg_discount_pct,
})

# ── EXPORT ───────────────────────────────────────────────────────────────────
df.to_csv("data/restaurants_old.csv", index=False)

# ── SUMMARY ──────────────────────────────────────────────────────────────────
print("✅ restaurants_old.csv generated!")
print(f"   Total restaurants: {len(df):,}")

print("\n📊 Cluster breakdown:")
cluster_summary = df.groupby("area_cluster").agg(
    count         = ("restaurant_id", "count"),
    avg_waste     = ("avg_daily_waste_items", "mean"),
    avg_menu_size = ("menu_size", "mean"),
    avg_discount  = ("avg_discount_pct", "mean"),
)
cluster_summary["avg_waste"]     = cluster_summary["avg_waste"].round(1)
cluster_summary["avg_menu_size"] = cluster_summary["avg_menu_size"].round(1)
cluster_summary["avg_discount"]  = cluster_summary["avg_discount"].round(1)
print(cluster_summary.to_string())

print("\n📊 Category breakdown:")
cat = df["category"].value_counts()
for c, n in cat.items():
    print(f"   {c:<20} {n:>3} ({n/len(df)*100:.1f}%)")

print("\n📊 Giovang option:")
opt = df["giovang_option"].value_counts()
for o, n in opt.items():
    print(f"   {o:<15} {n:>3} ({n/len(df)*100:.1f}%)")

print("\n📊 Sale window:")
print(f"   Lunch  (start < 15h):  {operates_lunch.sum():>3} quán ({operates_lunch.sum()/N_RESTAURANTS*100:.1f}%)")
print(f"   Dinner (start >= 15h): {operates_dinner.sum():>3} quán ({operates_dinner.sum()/N_RESTAURANTS*100:.1f}%)")

print("\n📊 Discount:")
print(f"   Min:  {df['avg_discount_pct'].min()}%")
print(f"   Max:  {df['avg_discount_pct'].max()}%")
print(f"   Mean: {df['avg_discount_pct'].mean():.1f}%")

print("\n📊 Waste impact (số để pitch):")
total_waste = df["avg_daily_waste_items"].sum()
print(f"   Tổng món thừa/ngày: {total_waste:,} món")
print(f"   Nếu rescue được 70%: {int(total_waste * 0.7):,} món/ngày")
print(f"   Ước tính/tháng (x30): {int(total_waste * 0.7 * 30):,} món")

print("\n🔍 Sample 5 quán:")
print(df[[
    "restaurant_id", "name", "area_cluster", "category",
    "rating", "menu_size", "avg_daily_waste_items",
    "sale_window_start", "sale_window_end",
    "giovang_option", "avg_discount_pct"
]].head().to_string())