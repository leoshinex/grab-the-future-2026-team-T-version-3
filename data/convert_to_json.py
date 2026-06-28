"""
Convert users.csv thành users.json gọn (slim) để dùng trong web-app React.
Chỉ giữ các field cần cho demo notification, bỏ các score/derived field
không dùng tới ở frontend.

Chạy: python3 convert_to_json.py
Output: ../web-app/src/app/data/users.json
"""

import pandas as pd
import json
import os

# ── ĐƯỜNG DẪN ──────────────────────────────────────────────────────────────
INPUT_CSV = "users.csv"
OUTPUT_JSON = "../web-app/src/app/data/users.json"

# ── CÁC FIELD CẦN GIỮ ──────────────────────────────────────────────────────
COLUMNS_TO_KEEP = [
    "user_id",
    "segment",
    "is_gen_z",
    "notify_priority",
    "favorite_category",
    "avg_order_value",
    "age_group",
]

def main():
    df = pd.read_csv(INPUT_CSV)

    missing = [c for c in COLUMNS_TO_KEEP if c not in df.columns]
    if missing:
        raise ValueError(f"users.csv thiếu các cột: {missing}")

    slim = df[COLUMNS_TO_KEEP].copy()
    slim["is_gen_z"] = slim["is_gen_z"].astype(bool)

    records = slim.to_dict(orient="records")

    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"✅ Đã tạo {OUTPUT_JSON}")
    print(f"   Tổng số users: {len(records)}")
    print(f"   Kích thước file: {os.path.getsize(OUTPUT_JSON):,} bytes")

if __name__ == "__main__":
    main()