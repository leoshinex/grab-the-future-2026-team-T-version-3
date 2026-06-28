import { useState, useEffect, useRef } from "react";
import { Leaf, X, Zap, Clock, MapPin, ShoppingBag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  user_id: string;
  ward: string;
  age_group: string;
  age: number;
  is_gen_z: boolean;
  favorite_category: string;
  avg_order_value: number;
  voucher_usage_rate: number;
  peak_order_hour: number;
  evening_order_frequency: number;
  pickup_rate: number;
  price_sensitivity_score: number;
  deal_seeking_score: number;
  giovang_score: number;
  segment: string;
  notify_priority: "High" | "Medium" | "Low";
}

// ─── Notify Content Engine ────────────────────────────────────────────────────

// Đã bao phủ: segment-aware content, Gen Z tone, priority escalation
// Chưa có (nên thêm sau): real-time deal matching, geolocation proximity, A/B tone variants

interface NotifyContent {
  title: string;
  body: string;
  emoji: string;
  urgencyColor: string;
  badge: string;
}

function getNotifyContent(user: UserProfile, simTime: number): NotifyContent {
  const isGenZ = user.is_gen_z;
  const seg = user.segment;
  const hour = simTime;
  const isEvening = hour >= 19 && hour <= 22;
  const isAfternoon = hour >= 14 && hour <= 17;

  // ── Segment × Gen Z content matrix ───────────────────────────────────────

  if (seg === "Deal Addict") {
    return isGenZ
      ? {
          title: "🔥 Deal nóng vừa drop!!",
          body: "Gà nướng Chí Dũng -56% còn 3 phần thôi bro, lụm ngay không hối hận 😤",
          emoji: "🔥",
          urgencyColor: "#EF4444",
          badge: "Còn 3 phần",
        }
      : {
          title: "Ưu đãi giảm sâu hôm nay",
          body: "Gà nướng Chí Dũng giảm 56%, chỉ còn 3 suất. Đặt trước 22:30.",
          emoji: "💰",
          urgencyColor: "#EF4444",
          badge: "Giảm 56%",
        };
  }

  if (seg === "Evening Saver") {
    return isGenZ
      ? {
          title: isEvening ? "tối rồi đói chưa 😭" : "chuẩn bị cho tối nay chưa?",
          body: "Mixed Pastry Box Tous les Jours 45k thay vì 125k — cách bạn 0.4km 🥐",
          emoji: "🌙",
          urgencyColor: "#078282",
          badge: isEvening ? "Đang mở" : "Tối nay",
        }
      : {
          title: isEvening ? "Ưu đãi tối nay đang chờ bạn" : "Chuẩn bị cho bữa tối tiết kiệm",
          body: "Mixed Pastry Box còn 5 phần — 45.000đ (gốc 125.000đ). Lấy trước 21:30.",
          emoji: "🌙",
          urgencyColor: "#078282",
          badge: "Tối nay",
        };
  }

  if (seg === "New User") {
    return isGenZ
      ? {
          title: "app này có gì hay không? 👀",
          body: "Đồ ăn tươi ngon cuối ngày giảm đến 67% — hôm nay thử lần đầu xem sao 🍱",
          emoji: "✨",
          urgencyColor: "#8B5CF6",
          badge: "Lần đầu",
        }
      : {
          title: "Khám phá ưu đãi đầu tiên của bạn",
          body: "Chào mừng! Đồ ăn tươi ngon giảm đến 67% — hàng cập nhật mỗi tối từ 17:00.",
          emoji: "✨",
          urgencyColor: "#8B5CF6",
          badge: "Mới",
        };
  }

  if (seg === "Explorer") {
    return isGenZ
      ? {
          title: "shop mới vừa lên app 🆕",
          body: "Tiger Sugar vừa join — Bubble Tea Bundle 29k thay vì 79k, chưa thử bao giờ à? 🧋",
          emoji: "🧭",
          urgencyColor: "#F59E0B",
          badge: "Mới xuất hiện",
        }
      : {
          title: "Đối tác mới: Tiger Sugar",
          body: "Bubble Tea Bundle giảm 63% — 29.000đ. Món mới, cơ hội khám phá hôm nay.",
          emoji: "🧭",
          urgencyColor: "#F59E0B",
          badge: "Shop mới",
        };
  }

  if (seg === "Pickup Commuter") {
    const isCommute = hour >= 17 && hour <= 19;
    return isGenZ
      ? {
          title: isCommute ? "trên đường về ghé nhanh nha 🛵" : "ghé lấy tiện đường",
          body: "Tous les Jours cách 0.4km — tự lấy miễn ship, 45k thôi 🥐",
          emoji: "🚴",
          urgencyColor: "#059669",
          badge: "0.4 km",
        }
      : {
          title: isCommute ? "Ghé lấy hàng trên đường về" : "Tự đến lấy — Miễn phí ship",
          body: "Tous les Jours cách bạn 0.4km. Tự lấy — không chờ shipper, 45.000đ.",
          emoji: "🚴",
          urgencyColor: "#059669",
          badge: "Tự lấy",
        };
  }

  if (seg === "Midday Saver") {
    return isGenZ
      ? {
          title: isAfternoon ? "còn suất trưa nè 🍱" : "đặt trưa mai sớm thôi",
          body: "Bento Lunch Set Gyu-Kaku 39k thay vì 95k — đặt sớm kẻo hết nha 👀",
          emoji: "☀️",
          urgencyColor: "#D97706",
          badge: "Bữa trưa",
        }
      : {
          title: "Suất trưa tiết kiệm",
          body: "Bento Lunch Set từ Gyu-Kaku: 39.000đ (gốc 95.000đ). Còn 3 phần.",
          emoji: "☀️",
          urgencyColor: "#D97706",
          badge: "Bữa trưa",
        };
  }

  if (seg === "Occasional Saver") {
    return isGenZ
      ? {
          title: "deal đặc biệt chỉ dành cho m 🎁",
          body: "Voucher 20% riêng cho bạn — hết hạn tối nay lúc 22:00, dùng không lãng phí 😅",
          emoji: "🎁",
          urgencyColor: "#7C3AED",
          badge: "Chỉ hôm nay",
        }
      : {
          title: "Ưu đãi cá nhân dành riêng cho bạn",
          body: "Voucher giảm 20% chỉ dành cho bạn — áp dụng đến 22:00 tối nay.",
          emoji: "🎁",
          urgencyColor: "#7C3AED",
          badge: "Riêng bạn",
        };
  }

  // Casual — fallback, tần suất thấp nhất
  return isGenZ
    ? {
        title: "ủa hôm nay có deal nè 👁️",
        body: "Bubble Tea Bundle 29k — không mua cũng ghé xem cho biết 🧋",
        emoji: "😐",
        urgencyColor: "#6B7280",
        badge: "Hôm nay",
      }
    : {
        title: "Ưu đãi hôm nay",
        body: "Bubble Tea Bundle từ Tiger Sugar: 29.000đ, giảm 63%. Còn 8 phần.",
        emoji: "😐",
        urgencyColor: "#6B7280",
        badge: "Hôm nay",
      };
}

// ── Timing recommendation (chưa được implement vào app, cần thêm sau) ─────────
function getRecommendedSendTime(user: UserProfile): string {
  const seg = user.segment;
  if (seg === "Evening Saver") return "19:00 – 21:00";
  if (seg === "Pickup Commuter") return "17:30 – 18:30";
  if (seg === "Deal Addict") return "Ngay khi deal lên";
  if (seg === "Midday Saver") return "09:00 – 10:30";
  if (seg === "New User") return "Tối đầu tiên sau đăng ký";
  if (seg === "Explorer") return "19:00 – 21:00";
  if (seg === "Occasional Saver") return "Chỉ khi có deal đặc biệt";
  return "Không định kỳ";
}

// ─── Segment Config ───────────────────────────────────────────────────────────

const SEGMENT_CONFIG: Record<string, { color: string; icon: string; desc: string }> = {
  "Deal Addict":       { color: "#EF4444", icon: "🔥", desc: "Nhạy cảm giá cao, dùng voucher nhiều" },
  "Evening Saver":     { color: "#078282", icon: "🌙", desc: "Hay đặt buổi tối, match nhất với app" },
  "New User":          { color: "#8B5CF6", icon: "✨", desc: "Mới đăng ký, cần onboarding" },
  "Explorer":          { color: "#F59E0B", icon: "🧭", desc: "Hay thử món mới, đa dạng category" },
  "Pickup Commuter":   { color: "#059669", icon: "🚴", desc: "Tự đến lấy, pickup_rate cao" },
  "Midday Saver":      { color: "#D97706", icon: "☀️", desc: "Đặt bữa trưa, peak giờ trưa" },
  "Occasional Saver":  { color: "#7C3AED", icon: "🎁", desc: "Mua theo cơ hội, cần trigger đặc biệt" },
  "Casual":            { color: "#6B7280", icon: "😐", desc: "Ít thường xuyên, không spam" },
};

const PRIORITY_CONFIG = {
  High:   { color: "#EF4444", bg: "#FEF2F2", label: "Cao" },
  Medium: { color: "#F59E0B", bg: "#FFFBEB", label: "Trung bình" },
  Low:    { color: "#6B7280", bg: "#F9FAFB", label: "Thấp" },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

import USERS_RAW from "../data/users.json";
const USERS: UserProfile[] = USERS_RAW as UserProfile[];

export function useNotificationDemo() {
  const [activeUser, setActiveUser] = useState<UserProfile | null>(null);
  const [variant, setVariant] = useState<"overlay" | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerDemo = () => {
    // Random 1 user từ 500
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    setActiveUser(user);
    setVariant("overlay");
  };

  const closeDemo = () => {
    setActiveUser(null);
    setVariant(null);
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return { activeUser, variant, triggerDemo, closeDemo };
}

// ─── Button ───────────────────────────────────────────────────────────────────

export function NotificationDemoButton({
  activeUser,
  onTrigger,
}: {
  activeUser: UserProfile | null;
  onTrigger: () => void;
}) {
  return (
    <button
      onClick={onTrigger}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
      style={{
        backgroundColor: activeUser ? "#FEF9C3" : "#078282",
        color: activeUser ? "#78350F" : "white",
        border: activeUser ? "1px solid #FDE68A" : "none",
      }}
    >
      {activeUser ? `👤 ${activeUser.user_id}` : "🎲 Random User"}
    </button>
  );
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export function NotificationDemoOverlay({
  activeUser,
  variant,
  onClose,
  simTime = 21,
}: {
  activeUser: UserProfile | null;
  variant: "overlay" | null;
  onClose: () => void;
  simTime?: number;
}) {
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    setShowDetail(false);
  }, [activeUser]);

  if (!activeUser || variant !== "overlay") return null;

  const notify = getNotifyContent(activeUser, simTime);
  const seg = SEGMENT_CONFIG[activeUser.segment] ?? { color: "#6B7280", icon: "❓", desc: "" };
  const pri = PRIORITY_CONFIG[activeUser.notify_priority];
  const recommendedTime = getRecommendedSendTime(activeUser);

  // Gen Z priority escalation
  const effectivePriority = activeUser.is_gen_z
    ? activeUser.notify_priority === "Low" ? "Medium"
      : activeUser.notify_priority === "Medium" ? "High"
      : "High"
    : activeUser.notify_priority;
  const effectivePri = PRIORITY_CONFIG[effectivePriority];

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end pointer-events-none">
      <div className="pointer-events-auto">

        {/* ── Push Notification Banner ── */}
        <div
          className="mx-3 mb-3 rounded-2xl shadow-xl overflow-hidden"
          style={{ border: `1.5px solid ${notify.urgencyColor}20` }}
        >
          {/* Notification header */}
          <div
            className="px-3 py-2 flex items-center justify-between"
            style={{ backgroundColor: "#ffffff", borderBottom: `1px solid ${notify.urgencyColor}20` }}

          >
            <div className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center text-[10px]"
                style={{ backgroundColor: notify.urgencyColor }}
              >
                <Leaf size={11} className="text-white" />
              </div>
              <span className="text-[10px] font-bold" style={{ color: notify.urgencyColor }}>
                FoodRescue
              </span>
              <span className="text-[9px] text-gray-400 ml-1">Bây giờ</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={13} />
            </button>
          </div>

          {/* Notification body */}
          <div className="bg-white px-3 py-2.5">
            <p className="font-bold text-[12px] text-gray-900 leading-snug">{notify.title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{notify.body}</p>

            {/* Quick stats row */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: notify.urgencyColor + "15", color: notify.urgencyColor }}
              >
                {notify.badge}
              </span>
              <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                <Clock size={8} /> 21:30
              </span>
              <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
                <MapPin size={8} /> 0.4 km
              </span>
            </div>
          </div>

          {/* ── User Profile Panel ── */}
          <div
            className="bg-gray-50 border-t border-gray-100 px-3 py-2 cursor-pointer"
            onClick={() => setShowDetail(!showDetail)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Avatar */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
                  style={{ backgroundColor: seg.color }}
                >
                  {activeUser.user_id.slice(-2)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-900">{activeUser.user_id}</span>
                    {/* Gen Z badge */}
                    {activeUser.is_gen_z && (
                      <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                        Gen Z ⚡
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-[9px]">{seg.icon}</span>
                    <span className="text-[9px] font-semibold" style={{ color: seg.color }}>
                      {activeUser.segment}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Priority badge — escalated nếu Gen Z */}
                <div className="text-right">
                  <div
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: effectivePri.bg, color: effectivePri.color }}
                  >
                    {activeUser.is_gen_z && activeUser.notify_priority !== "High"
                      ? `${pri.label} → ${effectivePri.label} ↑`
                      : effectivePri.label}
                  </div>
                  <p className="text-[8px] text-gray-400 mt-0.5 text-right">Priority</p>
                </div>
                <span className="text-gray-300 text-[10px]">{showDetail ? "▲" : "▼"}</span>
              </div>
            </div>
          </div>

          {/* ── Expanded detail panel ── */}
          {showDetail && (
            <div className="bg-white border-t border-gray-100 px-3 py-3 space-y-2">

              {/* Segment description */}
              <div className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-wide mb-1">Segment</p>
                <p className="text-[10px] text-gray-700">{seg.icon} <strong>{activeUser.segment}</strong> — {seg.desc}</p>
              </div>

              {/* Key scores */}
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: "Deal Seeking", value: activeUser.deal_seeking_score, color: "#EF4444" },
                  { label: "Price Sensitivity", value: activeUser.price_sensitivity_score, color: "#F59E0B" },
                  { label: "Giovang Score", value: activeUser.giovang_score, color: "#078282" },
                  { label: "Evening Freq", value: Math.min(activeUser.evening_order_frequency / 2, 1), color: "#8B5CF6" },
                ].map((s) => (
                  <div key={s.label} className="bg-gray-50 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] text-gray-500">{s.label}</span>
                      <span className="text-[8px] font-bold" style={{ color: s.color }}>
                        {(s.value * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${s.value * 100}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* User info row */}
              <div className="flex gap-1.5 text-[9px] text-gray-500">
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                  {activeUser.age}t · {activeUser.age_group}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded-full truncate">
                  📍 {activeUser.ward}
                </span>
              </div>

              {/* Recommended send time */}
              <div
                className="rounded-xl px-2.5 py-2 flex items-center gap-2"
                style={{ backgroundColor: seg.color + "10" }}
              >
                <Clock size={11} style={{ color: seg.color }} />
                <div>
                  <p className="text-[8px] font-bold" style={{ color: seg.color }}>Khung giờ gửi tốt nhất</p>
                  <p className="text-[9px] text-gray-700 font-semibold">{recommendedTime}</p>
                </div>
              </div>

              {/* Gen Z note */}
              {activeUser.is_gen_z && (
                <div className="bg-purple-50 rounded-xl px-2.5 py-2 border border-purple-100">
                  <p className="text-[8px] font-bold text-purple-700 mb-0.5">⚡ Gen Z Mode ON</p>
                  <p className="text-[8.5px] text-purple-600">
                    Tone informal · FOMO cao · Priority +1 bậc · Tần suất ×1.5
                  </p>
                </div>
              )}

              {/* Tone toggle preview */}
              <div className="bg-gray-50 rounded-xl p-2.5">
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                  So sánh tone notify
                </p>
                <div className="space-y-1.5">
                  <div className="bg-purple-50 border border-purple-100 rounded-lg px-2 py-1.5">
                    <p className="text-[7.5px] font-bold text-purple-600 mb-0.5">Gen Z ⚡</p>
                    <p className="text-[9px] text-gray-700 leading-snug">
                      {getNotifyContent({ ...activeUser, is_gen_z: true }, simTime).body}
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-1.5">
                    <p className="text-[7.5px] font-bold text-blue-600 mb-0.5">Standard</p>
                    <p className="text-[9px] text-gray-700 leading-snug">
                      {getNotifyContent({ ...activeUser, is_gen_z: false }, simTime).body}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
