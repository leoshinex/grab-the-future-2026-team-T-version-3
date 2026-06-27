import pandas as pd
import numpy as np
from datetime import date, timedelta

np.random.seed(42)

# ── CONFIG ───────────────────────────────────────────────────────────────────
N_DAYS       = 27
START_DATE   = date(2026, 6, 1)

# ── LOAD RESTAURANTS ─────────────────────────────────────────────────────────
restaurants = pd.read_csv("data/restaurants_old.csv")

# ── ITEM NAMES THEO CATEGORY ─────────────────────────────────────────────────
ITEMS = {
    "Bún bò": [
        "Bún bò Huế đặc biệt",
        "Bún bò giò heo",
        "Bún bò gân",
        "Bún bò viên",
        "Bún bò thập cẩm",
    ],
    "Phở": [
        "Phở bò tái",
        "Phở bò chín",
        "Phở gà",
        "Phở bò tái nạm",
        "Phở bò viên",
    ],
    "Cơm tấm": [
        "Cơm tấm sườn bì chả",
        "Cơm tấm sườn nướng",
        "Cơm tấm bì",
        "Cơm tấm sườn trứng",
        "Cơm tấm đặc biệt",
    ],
    "Hủ tiếu": [
        "Hủ tiếu Nam Vang",
        "Hủ tiếu bò kho",
        "Hủ tiếu mì",
        "Hủ tiếu sa tế",
        "Hủ tiếu thập cẩm",
    ],
    "Bánh mì": [
        "Bánh mì thịt nguội",
        "Bánh mì trứng",
        "Bánh mì xíu mại",
        "Bánh mì gà",
        "Bánh mì chả lụa",
    ],
    "Bún riêu": [
        "Bún riêu cua",
        "Bún riêu cua mọc",
        "Bún riêu thập cẩm",
        "Bún riêu cua đồng",
    ],
    "Cơm văn phòng": [
        "Cơm gà xối mỡ",
        "Cơm sườn đậu hũ",
        "Cơm canh chua",
        "Cơm thịt kho trứng",
        "Cơm gà luộc",
    ],
}

# ── PRICE RANGE THEO CATEGORY ─────────────────────────────────────────────────
# Dùng triangular: min, mode, max
PRICE_CONFIG = {
    "Bún bò":         {"min": 35000, "mode": 45000, "max": 65000},
    "Phở":            {"min": 35000, "mode": 45000, "max": 65000},
    "Hủ tiếu":        {"min": 35000, "mode": 45000, "max": 65000},
    "Cơm tấm":        {"min": 25000, "mode": 35000, "max": 55000},
    "Cơm văn phòng":  {"min": 25000, "mode": 35000, "max": 55000},
    "Bún riêu":       {"min": 30000, "mode": 40000, "max": 55000},
    "Bánh mì":        {"min": 15000, "mode": 22000, "max": 35000},
}

# ── GENERATE LISTINGS ─────────────────────────────────────────────────────────
records = []
listing_counter = 0

for day_offset in range(N_DAYS):
    current_date = START_DATE + timedelta(days=day_offset)

    for _, restaurant in restaurants.iterrows():
        r_id        = restaurant["restaurant_id"]
        category    = restaurant["category"]
        menu_size   = int(restaurant["menu_size"])
        waste       = int(restaurant["avg_daily_waste_items"])
        discount    = int(restaurant["avg_discount_pct"])
        sale_start  = int(restaurant["sale_window_start"])
        sale_end    = int(restaurant["sale_window_end"])
        option      = restaurant["giovang_option"]

        # Chọn ngẫu nhiên menu_size món từ danh sách của category
        # Nếu menu_size > số món available thì lấy hết
        available_items = ITEMS.get(category, ["Món đặc biệt"])
        selected_items  = np.random.choice(
            available_items,
            size=min(menu_size, len(available_items)),
            replace=False
        )

        # Chia waste đều cho các món ± noise nhỏ
        base_quantity = waste / menu_size
        for item_name in selected_items:
            listing_counter += 1
            listing_id = f"L{str(listing_counter).zfill(5)}"

            # quantity_listed — waste chia đều cho từng món ± 20% noise
            quantity_listed = max(1, int(
                base_quantity * np.random.uniform(0.8, 1.2)
            ))

            # original_price — triangular theo category
            pc = PRICE_CONFIG[category]
            original_price = int(np.random.triangular(
                pc["min"], pc["mode"], pc["max"]
            ))
            # Làm tròn đến 1000đ
            original_price = round(original_price / 1000) * 1000

            # discount_pct — avg của quán ± noise 5%
            discount_pct = int(np.clip(
                discount + np.random.randint(-5, 6),
                30, 60
            ))

            # discounted_price
            discounted_price = int(
                original_price * (1 - discount_pct / 100)
            )
            # Làm tròn đến 1000đ
            discounted_price = round(discounted_price / 1000) * 1000

            # conversion_rate — phụ thuộc discount
            # Discount cao → bán nhiều hơn
            if discount_pct >= 50:
                conversion_rate = np.random.uniform(0.65, 0.95)
            elif discount_pct >= 40:
                conversion_rate = np.random.uniform(0.50, 0.80)
            else:
                conversion_rate = np.random.uniform(0.30, 0.65)

            quantity_sold   = max(0, int(quantity_listed * conversion_rate))
            quantity_wasted = quantity_listed - quantity_sold

            # option — nếu quán là "both" thì random delivery hay pickup
            # nếu pickup_only hoặc delivery_only thì cố định
            if option == "both":
                chosen_option = np.random.choice(
                    ["delivery", "pickup"],
                    p=[0.60, 0.40]
                )
            elif option == "pickup_only":
                chosen_option = "pickup"
            else:
                chosen_option = "delivery"

            # posted_time — sale_window_start ± 15 phút
            # Lưu dạng "HH:MM"
            posted_minute = np.random.choice([0, 15, 30, 45])
            posted_time   = f"{sale_start:02d}:{posted_minute:02d}"

            # revenue_rescued — tiền thu được từ phần bán được
            revenue_rescued = quantity_sold * discounted_price

            # money_saved — tiền user tiết kiệm được so với giá gốc
            money_saved = quantity_sold * (original_price - discounted_price)

            # food_rescued_pct
            food_rescued_pct = round(
                quantity_sold / quantity_listed, 3
            ) if quantity_listed > 0 else 0

            records.append({
                "listing_id":        listing_id,
                "restaurant_id":     r_id,
                "date":              current_date.strftime("%Y-%m-%d"),
                "item_name":         item_name,
                "original_price":    original_price,
                "discount_pct":      discount_pct,
                "discounted_price":  discounted_price,
                "quantity_listed":   quantity_listed,
                "quantity_sold":     quantity_sold,
                "quantity_wasted":   quantity_wasted,
                "option":            chosen_option,
                "posted_time":       posted_time,
                "revenue_rescued":   revenue_rescued,
                "money_saved":       money_saved,
                "food_rescued_pct":  food_rescued_pct,
            })

# ── BUILD DATAFRAME ───────────────────────────────────────────────────────────
df = pd.DataFrame(records)

# Join thêm cluster và category từ restaurants để dùng trong dashboard
df = df.merge(
    restaurants[["restaurant_id", "area_cluster", "category", "ward"]],
    on="restaurant_id",
    how="left"
)

# ── EXPORT ────────────────────────────────────────────────────────────────────
df.to_csv("data/listings_old.csv", index=False)

# ── SUMMARY ──────────────────────────────────────────────────────────────────
print("✅ listings_old.csv generated!")
print(f"   Total listings: {len(df):,}")
print(f"   Date range: {df['date'].min()} → {df['date'].max()}")
print(f"   Restaurants covered: {df['restaurant_id'].nunique()}")

print("\n📊 Impact numbers (dùng để pitch):")
total_listed  = df["quantity_listed"].sum()
total_sold    = df["quantity_sold"].sum()
total_wasted  = df["quantity_wasted"].sum()
total_revenue = df["revenue_rescued"].sum()
total_saved   = df["money_saved"].sum()

print(f"   Tổng món đăng lên:        {total_listed:,}")
print(f"   Tổng món bán được:        {total_sold:,} ({total_sold/total_listed*100:.1f}%)")
print(f"   Tổng món vẫn bị bỏ:       {total_wasted:,} ({total_wasted/total_listed*100:.1f}%)")
print(f"   Doanh thu quán thu được:  {total_revenue/1e6:.1f}M VND")
print(f"   User tiết kiệm được:      {total_saved/1e6:.1f}M VND")

print("\n📊 Conversion rate theo cluster:")
conv = df.groupby("area_cluster").agg(
    total_listed = ("quantity_listed", "sum"),
    total_sold   = ("quantity_sold", "sum"),
).assign(
    conversion = lambda x: (x["total_sold"] / x["total_listed"] * 100).round(1)
).sort_values("conversion", ascending=False)
print(conv.to_string())

print("\n📊 Conversion rate theo discount range:")
df["discount_range"] = pd.cut(
    df["discount_pct"],
    bins=[29, 39, 49, 60],
    labels=["30-39%", "40-49%", "50-60%"]
)
disc_conv = df.groupby("discount_range", observed=True).agg(
    count        = ("listing_id", "count"),
    avg_conv     = ("food_rescued_pct", "mean"),
).round(3)
print(disc_conv.to_string())

print("\n📊 Top 5 món bán chạy nhất:")
top_items = df.groupby("item_name").agg(
    total_sold      = ("quantity_sold", "sum"),
    avg_conv        = ("food_rescued_pct", "mean"),
).sort_values("total_sold", ascending=False).head(5)
top_items["avg_conv"] = top_items["avg_conv"].round(3)
print(top_items.to_string())

print("\n📊 Delivery vs Pickup:")
opt = df.groupby("option").agg(
    count    = ("listing_id", "count"),
    avg_conv = ("food_rescued_pct", "mean"),
).round(3)
print(opt.to_string())

print("\n📊 Posted time distribution (giờ đăng):")
df["posted_hour"] = df["posted_time"].str[:2].astype(int)
print(df.groupby("posted_hour").size()
      .sort_index().to_string())

print("\n🔍 Sample 5 listings:")
print(df[[
    "listing_id", "restaurant_id", "date", "item_name",
    "original_price", "discount_pct", "discounted_price",
    "quantity_listed", "quantity_sold", "quantity_wasted",
    "option", "food_rescued_pct", "money_saved"
]].head().to_string())