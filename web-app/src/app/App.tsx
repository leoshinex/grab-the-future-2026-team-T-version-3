import { useState, useEffect, useRef } from "react";
import {
  Home, CreditCard, Activity, MessageSquare, Search, Bell,
  MapPin, Clock, Leaf, Package, ChevronRight, ArrowLeft,
  X, Star, Plus, TrendingUp, BarChart3, Zap, CheckCircle,
  Heart, Share2, Info, SlidersHorizontal, UtensilsCrossed, ChefHat, CarFront, Bike, Store, Gift, ShoppingBag, Map, Coins,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "home" | "payment" | "activity" | "messages";
type SubScreen = "rescue-list" | "detail" | "merchant" | null;

interface Merchant {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: string;
  priceLevel: string;
  cuisines: string[];
  distance: string;
  deliveryTime: string;
  isAd: boolean;
  isFoodRescuePartner: boolean;
  miniOffer: string;
  sidePromo: string;
  discountText: string;
  bannerImage: string;
}

interface FoodItem {
  id: number;
  name: string;
  storeId: string;
  store: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  quantity: number;
  deadline: string;
  distance: string;
  image: string;
  category: string;
  description: string;
  freshness: number;
  co2Saved: number;
  endsIn?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

function vnd(n: number) { return n.toLocaleString("vi-VN") + "₫"; }

const MERCHANTS: Merchant[] = [
  {
    id: "com-chien-79",
    name: "Cơm Chiên 79",
    avatar: "photo-1512058564366-18510be2db19",
    rating: 4.6,
    reviewsCount: "89",
    priceLevel: "$$",
    cuisines: ["Meals", "Vietnamese"],
    distance: "5.6 km",
    deliveryTime: "33 phút",
    isAd: false,
    isFoodRescuePartner: true,
    miniOffer: "Tặng 1 trà dứa mát lạnh",
    sidePromo: "GIẢM 5K",
    discountText: "Save 56%",
    bannerImage: "photo-1512058564366-18510be2db19"
  },
  {
    id: "rau-ma-mix",
    name: "Rau Má Mix",
    avatar: "photo-1536256263959-770b48d82b0a",
    rating: 4.8,
    reviewsCount: "142",
    priceLevel: "$",
    cuisines: ["Drinks", "Healthy"],
    distance: "3.2 km",
    deliveryTime: "19 phút",
    isAd: false,
    isFoodRescuePartner: true,
    miniOffer: "Giảm 5k khi mua combo 2 ly",
    sidePromo: "FREESHIP 3K",
    discountText: "Save 56%",
    bannerImage: "photo-1536256263959-770b48d82b0a"
  },
  {
    id: "chi-dung",
    name: "Gà Nướng - Quay Chí Dũng",
    avatar: "photo-1606787366850-de6330128bfc",
    rating: 4.9,
    reviewsCount: "387",
    priceLevel: "$$$",
    cuisines: ["Grilled Chicken", "Vietnamese"],
    distance: "5.6 km",
    deliveryTime: "24 phút",
    isAd: true,
    isFoodRescuePartner: true,
    miniOffer: "50% off 1 Cơm Lam + Nước Sâm",
    sidePromo: "GIẢM THÊM 10% đơn từ 50K",
    discountText: "Save 56%",
    bannerImage: "photo-1565299624946-b28f40a0ae38"
  },
  {
    id: "tam-bo",
    name: "Tâm Bơ - Set Khay Ăn Vặt",
    avatar: "photo-1569718212165-3a8278d5f624",
    rating: 4.9,
    reviewsCount: "2K+",
    priceLevel: "$$",
    cuisines: ["Snack", "Vietnamese"],
    distance: "3.2 km",
    deliveryTime: "23 phút",
    isAd: false,
    isFoodRescuePartner: true,
    miniOffer: "10.000đ off đơn từ 40.000đ",
    sidePromo: "FREESHIP 5K đơn từ 30k",
    discountText: "Save 50%",
    bannerImage: "photo-1540189549336-e6e99c3679fe"
  },
  {
    id: "tous-les-jours",
    name: "Tous les Jours",
    avatar: "photo-1555507036-ab1f4038808a",
    rating: 4.8,
    reviewsCount: "1.2K",
    priceLevel: "$$$",
    cuisines: ["Bakery", "Desserts"],
    distance: "0.4 km",
    deliveryTime: "12 phút",
    isAd: false,
    isFoodRescuePartner: true,
    miniOffer: "Mua 2 tặng 1 Bánh mì Việt Nam",
    sidePromo: "FREESHIP 15K",
    discountText: "Save 64%",
    bannerImage: "photo-1509440159596-0249088772ff"
  },
  {
    id: "gyu-kaku",
    name: "Gyu-Kaku Express",
    avatar: "photo-1546069901-ba9599a7e63c",
    rating: 4.7,
    reviewsCount: "95",
    priceLevel: "$$$",
    cuisines: ["Meals", "Japanese"],
    distance: "0.7 km",
    deliveryTime: "20 phút",
    isAd: false,
    isFoodRescuePartner: true,
    miniOffer: "Giảm 10k đơn từ 150k",
    sidePromo: "GIẢM 20K",
    discountText: "Save 59%",
    bannerImage: "photo-1546069901-ba9599a7e63c"
  },
  {
    id: "tiger-sugar",
    name: "Tiger Sugar",
    avatar: "photo-1558857563-b371033873b8",
    rating: 4.9,
    reviewsCount: "310",
    priceLevel: "$$",
    cuisines: ["Drinks", "Bubble Tea"],
    distance: "1.1 km",
    deliveryTime: "25 phút",
    isAd: false,
    isFoodRescuePartner: true,
    miniOffer: "Free Topping Trân Châu",
    sidePromo: "FREESHIP 5K",
    discountText: "Save 63%",
    bannerImage: "photo-1558857563-b371033873b8"
  }
];

const FOODS: FoodItem[] = [
  {
    id: 1, name: "Mixed Pastry Box", storeId: "tous-les-jours", store: "Tous les Jours",
    originalPrice: 125000, discountedPrice: 45000, discount: 64,
    quantity: 5, deadline: "21:30", distance: "0.4 km",
    image: "photo-1555507036-ab1f4038808a", category: "Bakery",
    description: "Hộp bánh ngọt thập cẩm ngẫu nhiên từ Tous les Jours gồm bánh sừng bò, bánh Đan Mạch và bánh mì artisan được làm trong ngày. Mỗi hộp chứa 5-7 chiếc bánh nướng thơm ngon chuẩn vị Pháp.",
    freshness: 92, co2Saved: 1.2, endsIn: "02:22:45"
  },
  {
    id: 2, name: "Bento Lunch Set", storeId: "gyu-kaku", store: "Gyu-Kaku Express",
    originalPrice: 95000, discountedPrice: 39000, discount: 59,
    quantity: 3, deadline: "21:00", distance: "0.7 km",
    image: "photo-1546069901-ba9599a7e63c", category: "Meals",
    description: "Set cơm Bento đặc biệt từ Gyu-Kaku với thịt gà teriyaki đậm đà, cơm trắng dẻo thơm, rau củ muối chua ngọt và canh miso ấm nóng. Giải pháp bữa trưa tiện lợi và tiết kiệm.",
    freshness: 88, co2Saved: 0.9, endsIn: "02:15:30"
  },
  {
    id: 3, name: "Bubble Tea Bundle", storeId: "tiger-sugar", store: "Tiger Sugar",
    originalPrice: 79000, discountedPrice: 29000, discount: 63,
    quantity: 8, deadline: "22:00", distance: "1.1 km",
    image: "photo-1558857563-b371033873b8", category: "Drinks",
    description: "Bộ ba trà sữa đường đen trân châu trứ danh từ Tiger Sugar. Đồ uống pha chế tươi ngon mỗi ngày, hãy đặt ngay trước giờ đóng cửa để giải cứu những ly trà sữa ngọt ngào này nhé.",
    freshness: 95, co2Saved: 0.6, endsIn: "03:10:15"
  },
  {
    id: 4, name: "Cơm Chiên 79", storeId: "com-chien-79", store: "Cơm Chiên 79",
    originalPrice: 43000, discountedPrice: 19000, discount: 56,
    quantity: 4, deadline: "22:15", distance: "5.6 km",
    image: "photo-1512058564366-18510be2db19", category: "Meals",
    description: "Đĩa cơm chiên dương châu hạt cơm vàng óng ánh tơi xốp, trộn lẫn cùng chả lụa hạt lựu, lạp xưởng, trứng chiên, đậu Hà Lan và cà rốt băm nhỏ. Hương vị đậm đà truyền thống.",
    freshness: 90, co2Saved: 1.1, endsIn: "02:22:45"
  },
  {
    id: 5, name: "Rau Má Mix", storeId: "rau-ma-mix", store: "Rau Má Mix",
    originalPrice: 28000, discountedPrice: 12000, discount: 56,
    quantity: 6, deadline: "21:45", distance: "3.2 km",
    image: "photo-1536256263959-770b48d82b0a", category: "Drinks",
    description: "Ly nước rau má nguyên chất thanh nhiệt kết hợp với sữa dừa béo ngậy thơm lừng. Đồ uống lành mạnh tốt cho sức khỏe giải nhiệt mùa hè.",
    freshness: 94, co2Saved: 0.7, endsIn: "02:22:45"
  },
  {
    id: 6, name: "Đùi Gà Nướng Mật Ong", storeId: "chi-dung", store: "Gà Nướng - Quay Chí Dũng",
    originalPrice: 43000, discountedPrice: 19000, discount: 56,
    quantity: 3, deadline: "22:30", distance: "5.6 km",
    image: "photo-1565299624946-b28f40a0ae38", category: "Meals",
    description: "Đùi gà góc tư tẩm ướp mật ong rừng cùng các gia vị độc quyền, da nướng giòn rụm màu cánh gián, thịt bên trong mềm ngọt mọng nước. Đi kèm nước chấm muối ớt xanh cay nồng.",
    freshness: 89, co2Saved: 1.4, endsIn: "02:45:00"
  },
  {
    id: 7, name: "Set Khay Ăn Vặt", storeId: "tam-bo", store: "Tâm Bơ - Set Khay Ăn Vặt",
    originalPrice: 44000, discountedPrice: 22000, discount: 50,
    quantity: 5, deadline: "23:00", distance: "3.2 km",
    image: "photo-1569718212165-3a8278d5f624", category: "Meals",
    description: "Khay ăn vặt đa dạng với cá viên chiên, bò viên, xúc xích, khoai tây chiên giòn và bánh tráng trộn. Phù hợp cho những buổi tối xem phim tụ tập cùng bạn bè.",
    freshness: 91, co2Saved: 0.9, endsIn: "03:00:00"
  }
];

const CATEGORIES = ["Bakery", "Meals", "Drinks"];

// Service grid — Rescue lives here as an icon, not a tab
const SERVICES_ROW1 = [
  { icon: <UtensilsCrossed size={18} />, label: "Food", rescue: false },
  { icon: <ChefHat size={18} />, label: "Dine Out", rescue: false },
  { icon: <Zap size={18} />, label: "Express", rescue: false },
  { icon: <CarFront size={18} />, label: "Ride Later", rescue: false },
  { icon: <Map size={18} />, label: "Map", rescue: false },
  { icon: <Package size={18} />, label: "Subs", rescue: false },
];
const SERVICES_ROW2 = [
  { icon: <CarFront size={18} />, label: "Car", rescue: false },
  { icon: <Bike size={18} />, label: "Bike", rescue: false },
  { icon: <Store size={18} />, label: "Mart", rescue: false },
  { icon: <Gift size={18} />, label: "Gifts", rescue: false },
  { icon: <ShoppingBag size={18} />, label: "Shopping", rescue: false },
  { icon: <Leaf size={18} />, label: "Rescue", rescue: true },
];

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: "home", icon: <Home size={20} />, label: "Home" },
    { id: "payment", icon: <CreditCard size={20} />, label: "Payment" },
    { id: "activity", icon: <Activity size={20} />, label: "Activity" },
    { id: "messages", icon: <MessageSquare size={20} />, label: "Messages" },
  ];
  return (
    <div className="bg-white border-t border-gray-100 flex items-center px-2 py-2 flex-shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className="flex-1 flex flex-col items-center gap-0.5 py-1"
        >
          <span style={{ color: active === tab.id ? "#078282" : "#9ca3af" }}>{tab.icon}</span>
          <span className="text-[10px] font-semibold" style={{ color: active === tab.id ? "#078282" : "#9ca3af" }}>
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
}

// ─── Rescue Pop-up ────────────────────────────────────────────────────────────

function RescuePopup({ onClose, onExplore }: { onClose: () => void; onExplore: () => void }) {
  const urgentFoods = FOODS.filter((f) => f.quantity <= 5).slice(0, 3);
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="flex-1" onClick={onClose} />
      <div className="bg-white rounded-t-3xl overflow-hidden">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        {/* Header */}
        <div className="relative bg-gradient-to-br from-[#078282] to-[#078282] px-5 py-4">
          <button onClick={onClose} className="absolute top-3 right-4 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
            <X size={14} className="text-white" />
          </button>
          <div className="flex items-center gap-1.5 mb-1">
            <Leaf size={12} className="text-white" />
            <span className="text-white text-[10px] font-bold uppercase tracking-widest opacity-90">Rescue</span>
          </div>
          <h2 className="text-white text-[19px] font-extrabold leading-tight mb-0.5">
            Đồ ăn sắp hết hạn<br />
            <span className="text-yellow-300">giảm đến 67%!</span>
          </h2>
          <p className="text-cyan-100 text-[11px] mb-2 flex items-center gap-1">
            <Clock size={12} className="text-cyan-100" /> Sau 21:00 — Đặt trước khi cửa hàng đóng cửa
          </p>
          <div className="flex gap-1.5">
            {[
              { icon: <Clock size={10} />, label: "Chỉ còn tối nay" },
              { icon: <Leaf size={10} />, label: "Tiết kiệm CO₂" },
              { icon: <Coins size={10} />, label: "Giá tốt nhất" }
            ].map((c, idx) => (
              <span key={idx} className="bg-white/20 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex items-center gap-1">
                {c.icon}
                {c.label}
              </span>
            ))}
          </div>
        </div>
        {/* Items */}
        <div className="px-4 pt-3 pb-2 space-y-2">
          {urgentFoods.map((food) => (
            <div key={food.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-2.5 border border-gray-100">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                <img src={`https://images.unsplash.com/${food.image}?w=120&h=120&fit=crop&auto=format`} alt={food.name} className="w-full h-full object-cover" />
                <div className="absolute top-0.5 left-0.5 bg-red-500 text-white text-[7px] font-bold px-1 rounded">-{food.discount}%</div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[12px] truncate">{food.name}</p>
                <p className="text-[10px] text-muted-foreground">{food.store}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[#078282] font-bold text-[12px]">{vnd(food.discountedPrice)}</span>
                  <span className="text-muted-foreground text-[10px] line-through">{vnd(food.originalPrice)}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-[9px] text-muted-foreground flex items-center gap-0.5 justify-end"><Package size={8} />{food.quantity} còn</div>
                <div className="text-[9px] text-orange-500 font-semibold flex items-center gap-0.5 mt-0.5"><Clock size={8} />{food.deadline}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 pb-6 pt-2 space-y-2">
          <button onClick={onExplore} className="w-full bg-[#078282] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2">
            <Leaf size={15} /> Khám phá Rescue
          </button>
          <button onClick={onClose} className="w-full text-muted-foreground text-sm py-1.5">Để sau</button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────

function HomeTab({
  onRescue,
  onDetail,
  showPopup,
  onClosePopup,
  isNight,
}: {
  onRescue: () => void;
  onDetail: (f: FoodItem) => void;
  showPopup: boolean;
  onClosePopup: () => void;
  isNight: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Top bar */}
      <div className="bg-white px-3 pt-2 pb-2 flex items-center gap-2 flex-shrink-0 border-b border-gray-100">
        <button className="w-8 h-8 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-sm" />)}
          </div>
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <span className="text-gray-400 text-sm">Tìm kiếm món ăn</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#078282] flex items-center justify-center">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg">👤</div>
      </div>

      {/* Scrollable */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* ── Service icon grid ── */}
        <div className="px-3 py-3">
          <div className="grid grid-cols-6 gap-y-3">
            {[...SERVICES_ROW1, ...SERVICES_ROW2].map((s) => (
              <button
                key={s.label}
                onClick={s.rescue ? onRescue : undefined}
                className="flex flex-col items-center gap-1 group"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-xl shadow-sm border transition-transform group-active:scale-90"
                  style={{
                    backgroundColor: s.rescue ? "#078282" : "#f5f5f5",
                    borderColor: s.rescue ? "#078282" : "#ebebeb",
                  }}
                >
                  {s.rescue
                    ? <Leaf size={20} className="text-white" />
                    : s.icon}
                </div>
                <span
                  className="text-[9px] font-semibold"
                  style={{ color: s.rescue ? "#078282" : "#555" }}
                >
                  {s.label}
                </span>
                {/* Red dot on Rescue icon when night */}
                {s.rescue && isNight && (
                  <span className="absolute mt-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" style={{ marginTop: "-30px", marginLeft: "22px" }} />
                )}
              </button>
            ))}
          </div>
          {/* Page dots */}
          <div className="flex justify-center gap-1 mt-2">
            <div className="w-3 h-1 bg-[#078282] rounded-full" />
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* ── Rescue in-feed banner after 21:00 ── */}
        {isNight && (
          <button
            onClick={onRescue}
            className="mx-3 mb-3 w-[calc(100%-24px)] rounded-2xl overflow-hidden bg-gradient-to-r from-[#078282] to-[#078282] flex items-center gap-3 px-4 py-3 active:opacity-90 transition-opacity"
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Leaf size={18} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-yellow-300 text-[9px] font-bold uppercase tracking-wider">Rescue · Sau 21:00</p>
              <p className="text-white font-bold text-[13px] leading-tight">Đồ ăn ngon, giảm đến 67%</p>
              <p className="text-cyan-100 text-[10px]">Đặt trước khi cửa hàng đóng cửa</p>
            </div>
            <ChevronRight size={14} className="text-white/70" />
          </button>
        )}

        {/* ── Buy Now ── */}
        <div className="px-3">
          <div className="flex items-center gap-1.5 mb-2">
            <h2 className="font-bold text-[15px] text-gray-900">Buy Now</h2>
            <Info size={12} className="text-gray-400" />
          </div>

          {/* Wide ad */}
          <div className="rounded-2xl overflow-hidden mb-2 relative h-32 bg-gradient-to-r from-[#1a6b3a] to-[#2d9e57]">
            <img src="https://images.unsplash.com/photo-1558857563-b371033873b8?w=700&h=300&fit=crop&auto=format" alt="Deal" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            <div className="relative p-3 flex flex-col justify-between h-full">
              <div className="flex gap-1.5">
                <span className="bg-white/20 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">Food</span>
                <span className="bg-yellow-400 text-cyan-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full">Mua 1 Tặng 1</span>
              </div>
              <div>
                <p className="text-yellow-300 text-[10px] font-bold uppercase tracking-widest">Deal</p>
                <p className="text-white text-xl font-black leading-tight">MẮT XIMUM</p>
                <p className="text-cyan-100 text-[10px]">Mua 1 nhận 1 &amp; tặng thêm nữa</p>
              </div>
            </div>
          </div>

          {/* Small ads */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="rounded-2xl overflow-hidden bg-red-50 border border-red-100">
              <div className="relative h-20 bg-red-100 flex items-center justify-center">
                <span className="text-4xl">🍔</span>
                <span className="absolute top-1 left-1 bg-orange-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-md">Ad</span>
                <span className="absolute bottom-1 left-1 bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded-md">35.000₫ off</span>
              </div>
              <div className="p-2"><p className="font-bold text-[11px]">Jollibee</p><p className="text-[9px] text-gray-400 truncate">EC Nguyễn Trãi – Bình Dương</p></div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-amber-50 border border-amber-100">
              <div className="relative h-20 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=120&fit=crop&auto=format" alt="Bún Bò Huế" className="w-full h-full object-cover" />
                <span className="absolute top-1 left-1 bg-orange-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-md">Ad</span>
                <span className="absolute bottom-1 left-1 bg-cyan-600 text-white text-[8px] font-bold px-1 py-0.5 rounded-md">Ưu đãi 5k</span>
              </div>
              <div className="p-2"><p className="font-bold text-[11px]">Bún Bò Huế</p><p className="text-[9px] text-gray-400 truncate">Sông Hương 5</p></div>
            </div>
          </div>

          {/* ── Rescue horizontal strip inside Buy Now ── */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Leaf size={13} className="text-[#078282]" />
                <span className="font-bold text-[13px] text-gray-900">Rescue</span>
                {isNight && <span className="bg-[#078282] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">LIVE</span>}
              </div>
              <button onClick={onRescue} className="text-[#078282] text-[11px] font-semibold flex items-center gap-0.5">
                Xem tất cả <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {FOODS.map((food) => (
                <div
                  key={food.id}
                  onClick={() => onDetail(food)}
                  className="flex-shrink-0 w-32 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="relative h-20 bg-gray-100">
                    <img src={`https://images.unsplash.com/${food.image}?w=200&h=150&fit=crop&auto=format`} alt={food.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1 bg-[#078282] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Leaf size={5} /> Rescue
                    </div>
                    <div className="absolute top-1 right-1 bg-red-500 text-white text-[7px] font-bold px-1 py-0.5 rounded">-{food.discount}%</div>
                  </div>
                  <div className="p-2">
                    <p className="font-bold text-[10px] leading-tight truncate">{food.name}</p>
                    <p className="text-[8px] text-gray-400 mb-1">{food.store}</p>
                    <p className="text-[#078282] font-bold text-[10px]">{vnd(food.discountedPrice)}</p>
                    <p className="text-gray-400 text-[8px] line-through">{vnd(food.originalPrice)}</p>
                    <div className="flex items-center gap-0.5 mt-1 text-[8px] text-orange-500 font-semibold">
                      <Clock size={7} /> {food.deadline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-2" />
      </div>

      {showPopup && (
        <RescuePopup
          onClose={onClosePopup}
          onExplore={() => { onClosePopup(); onRescue(); }}
        />
      )}
    </div>
  );
}

// ─── Rescue Listing Screen (sub-screen, not a tab) ────────────────────────────

// ─── FoodRescue Event Screen (Replaces old RescueListScreen) ──────────────────

function FoodRescueEventScreen({
  onDetail,
  onMerchantSelect,
  onBack,
}: {
  onDetail: (f: FoodItem) => void;
  onMerchantSelect: (m: Merchant) => void;
  onBack: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFoods = FOODS.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      food.store.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || food.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredMerchants = MERCHANTS.filter((m) => {
    if (activeCategory === "All") return true;
    return FOODS.some(f => f.storeId === m.id && f.category === activeCategory);
  });

  // Top highlight foods
  const highlightFoods = FOODS.filter(f => f.id === 4 || f.id === 5);

  return (
    <div className="flex flex-col h-full bg-[#f5f6f8]">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 flex-shrink-0 border-b border-gray-100 relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                <ArrowLeft size={18} className="text-gray-700" />
              </button>
              <div className="flex items-center">
                <span className="text-2xl font-black text-[#078282] tracking-tight">Food</span>
                <span className="inline-flex items-center justify-center bg-[#078282] text-white rounded-full w-4 h-4 mx-0.5"><Leaf size={9} className="fill-white text-white" /></span>
                <span className="inline-flex items-center justify-center bg-[#078282] text-white rounded-full w-4 h-4 mx-0.5"><Leaf size={9} className="fill-white text-white" /></span>
                <span className="text-2xl font-black text-[#078282] tracking-tight">Rescue</span>
              </div>
            </div>
            <p className="text-[#078282] font-bold text-[10px] mt-1 flex items-center gap-1">
              Rescue food today, save more tomorrow <span className="text-xs">🍃</span>
            </p>
          </div>

          {/* Groceries SVG Illustration */}
          <div className="relative w-24 h-16 mr-1">
            <svg width="76" height="68" viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-0 -top-2">
              <circle cx="35" cy="25" r="12" fill="#E11D48" />
              <path d="M40 18C40 12 47 10 50 15C53 10 60 12 60 18C60 25 50 28 50 28C50 28 40 25 40 18Z" fill="#F97316" />
              <path d="M28 20C24 16 28 8 32 12C36 8 40 16 36 20Z" fill="#22C55E" />
              <path d="M48 15C45 10 50 4 54 8C58 4 60 10 58 15Z" fill="#15803D" />
              <path d="M25 32 L28 75 A 4 4 0 0 0 32 79 L68 79 A 4 4 0 0 0 72 75 L75 32 Z" fill="#DDB892" />
              <path d="M25 32 L20 28 L80 28 L75 32 Z" fill="#B08968" />
              <rect x="35" y="44" width="30" height="20" rx="4" fill="#078282" />
              <text x="50" y="52" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">Food</text>
              <text x="50" y="60" fill="white" fontSize="5" fontWeight="bold" textAnchor="middle">Rescue</text>
              <circle cx="80" cy="50" r="16" fill="white" stroke="#E2E8F0" strokeWidth="1" />
              <text x="80" y="46" fill="#1E293B" fontSize="4.5" fontWeight="black" textAnchor="middle">Save</text>
              <text x="80" y="51" fill="#1E293B" fontSize="4.5" fontWeight="black" textAnchor="middle">More</text>
              <text x="80" y="56" fill="#1E293B" fontSize="4.5" fontWeight="black" textAnchor="middle">Food</text>
            </svg>
          </div>
        </div>

        {/* Search input */}
        <div className="bg-gray-100 rounded-2xl flex items-center gap-2 px-3 py-2 mt-2 border border-transparent focus-within:border-cyan-400 focus-within:bg-white transition-all">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm ưu đãi FoodRescue..."
            className="bg-transparent text-xs w-full outline-none text-gray-800"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Filter chips row */}
      <div className="bg-white border-b border-gray-100 px-3 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        <button className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-50">
          <SlidersHorizontal size={13} />
        </button>
        <button className="flex-shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 active:bg-gray-50 flex items-center gap-0.5">
          Sắp xếp <span className="text-[8px]">▼</span>
        </button>
        <button className="flex-shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 active:bg-gray-50 flex items-center gap-0.5">
          Món ăn <span className="text-[8px]">▼</span>
        </button>
        <button className="flex-shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 active:bg-gray-50 flex items-center gap-0.5">
          Giá bán <span className="text-[8px]">▼</span>
        </button>
      </div>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>

        {/* Highlight Promo Section */}
        <div className="p-3">
          <div className="bg-[#F0FFFF] rounded-3xl p-3 flex gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {/* Promo text card left */}
            <div className="w-32 flex-shrink-0 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-[#078282] font-extrabold text-[13px] leading-snug">
                  Ngon bổ rẻ,<br />giảm thiểu lãng phí
                </h3>
                <p className="text-[#078282] text-[8px] mt-1 leading-normal opacity-90">
                  Chung tay giải cứu thức ăn tươi ngon giảm sâu cuối ngày!
                </p>
              </div>
              <button
                onClick={() => setActiveCategory(activeCategory === "All" ? "Meals" : "All")}
                className="bg-[#078282] text-white text-[8px] font-bold py-1.5 px-2.5 rounded-full mt-2 self-start shadow-sm active:scale-95 transition-transform"
              >
                Khám phá ngay
              </button>
            </div>

            {/* Scrollable highlights */}
            {highlightFoods.map((food) => (
              <div
                key={food.id}
                onClick={() => onDetail(food)}
                className="w-36 bg-white rounded-2xl border border-cyan-50 flex-shrink-0 overflow-hidden shadow-sm hover:shadow active:scale-95 transition-all"
              >
                <div className="relative h-20 bg-gray-100">
                  <img
                    src={`https://images.unsplash.com/${food.image}?w=200&h=150&fit=crop&auto=format`}
                    alt={food.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Badge top left */}
                  <div className="absolute top-1 left-1 bg-[#078282] text-white text-[6.5px] font-bold px-1 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <Leaf size={6} className="fill-white" /> FoodRescue
                  </div>
                  {/* Ends in top right */}
                  <div className="absolute top-1 right-1 bg-white/90 text-gray-800 text-[6.5px] font-bold px-1 py-0.5 rounded-md shadow-sm">
                    Hết hạn: {food.deadline}
                  </div>
                  {/* Bottom overlay inside image */}
                  <div className="absolute bottom-0 inset-x-0 flex text-[7.5px] font-bold">
                    <div className="bg-red-500 text-white px-1.5 py-0.5 flex-1 text-center">Save {food.discount}%</div>
                    <div className="bg-[#1a1a2e]/90 text-white px-1.5 py-0.5 text-center">Chỉ hôm nay</div>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="font-bold text-[10px] text-gray-900 truncate leading-tight">{food.name}</h4>
                  <p className="text-[8px] text-[#078282] font-bold mt-0.5">{vnd(food.discountedPrice)} <span className="text-gray-400 line-through font-normal ml-1">{vnd(food.originalPrice)}</span></p>
                  <p className="text-[7.5px] text-gray-400 mt-1">{food.distance} • {food.endsIn || "02:22:45"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category chips list */}
        <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-[10px] font-semibold px-3 py-1.5 rounded-full transition-all"
              style={{
                backgroundColor: activeCategory === cat ? "#078282" : "white",
                color: activeCategory === cat ? "white" : "#555",
                border: activeCategory === cat ? "1px solid #078282" : "1px solid #e2e8f0",
              }}
            >
              {cat === "All" ? "Tất cả" : cat === "Bakery" ? "Bánh ngọt" : cat === "Meals" ? "Bữa ăn chính" : "Đồ uống"}
            </button>
          ))}
        </div>

        {/* 3-column Feature list */}
        <div className="mx-3 my-2 bg-[#F4FFFF] border border-cyan-100 rounded-2xl grid grid-cols-3 divide-x divide-cyan-100/50 p-2 text-center shadow-xs">
          <div className="flex flex-col items-center p-1">
            <Clock size={16} className="text-[#078282] mb-0.5" />
            <p className="font-bold text-[9px] text-cyan-900 leading-tight">Giải Cứu Ngay</p>
            <p className="text-[7px] text-cyan-700 mt-0.5">Đồ ăn tươi ngon giá rẻ</p>
          </div>
          <div className="flex flex-col items-center p-1">
            <Leaf size={16} className="text-[#078282] mb-0.5" />
            <p className="font-bold text-[9px] text-cyan-900 leading-tight">Giảm Lãng Phí</p>
            <p className="text-[7px] text-cyan-700 mt-0.5">Chung tay bảo vệ môi trường</p>
          </div>
          <div className="flex flex-col items-center p-1">
            <Coins size={16} className="text-[#078282] mb-0.5" />
            <p className="font-bold text-[9px] text-cyan-900 leading-tight">Tiết Kiệm Lớn</p>
            <p className="text-[7px] text-cyan-700 mt-0.5">Giá trị thật, giá hạt dẻ</p>
          </div>
        </div>

        {/* Merchant Partner List */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-xs text-gray-900 flex items-center gap-1">
              <Leaf size={12} className="text-[#078282]" /> Đối tác giải cứu FoodRescue
            </h3>
            <span className="text-[9px] text-gray-400">{filteredMerchants.length} cửa hàng</span>
          </div>

          <div className="space-y-3 pb-6">
            {filteredMerchants.map((merchant) => {
              const merchantFoods = filteredFoods.filter(f => f.storeId === merchant.id);
              if (merchantFoods.length === 0 && activeCategory !== "All") return null;

              const repFood = merchantFoods[0] || FOODS.find(f => f.storeId === merchant.id);

              return (
                <div
                  key={merchant.id}
                  onClick={() => onMerchantSelect(merchant)}
                  className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.99] transition-all relative overflow-hidden"
                >
                  {/* Left: Food/Store Image */}
                  <div className="w-24 h-24 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-100">
                    <img
                      src={`https://images.unsplash.com/${merchant.bannerImage}?w=200&h=200&fit=crop&auto=format`}
                      alt={merchant.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Badge on image overlay bottom */}
                    <div className="absolute bottom-0 inset-x-0 flex text-[7.5px] font-bold">
                      <div className="bg-[#078282] text-white px-1 py-0.5 text-center flex-1">{merchant.discountText}</div>
                      <div className="bg-black/80 text-white px-1 py-0.5 text-center">Chỉ hôm nay</div>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-1.5">
                      {merchant.isAd && (
                        <span className="bg-gray-100 text-gray-500 text-[7px] font-bold px-1 rounded-sm">Ad</span>
                      )}
                      <h4 className="font-extrabold text-[12px] text-gray-900 truncate leading-tight">{merchant.name}</h4>
                    </div>

                    <p className="text-[8.5px] text-gray-400 mt-0.5 truncate">
                       {merchant.rating} ({merchant.reviewsCount}) • {merchant.cuisines.join(", ")}
                    </p>

                    <p className="text-[8.5px] text-gray-500 mt-1 flex items-center gap-0.5">
                      🏍️ {merchant.deliveryTime} • {merchant.distance}
                    </p>

                    <div className="flex items-center gap-1 mt-1 text-[10px] font-extrabold text-[#078282]">
                      {repFood ? (
                        <>
                          <span>Từ {vnd(repFood.discountedPrice)}</span>
                          <span className="text-gray-400 font-normal line-through text-[8.5px] ml-1">{vnd(repFood.originalPrice)}</span>
                        </>
                      ) : (
                        <span>Món ngon giải cứu</span>
                      )}
                    </div>

                    <div className="mt-1">
                      <span className="bg-cyan-50 text-[#078282] border border-cyan-200/50 text-[8px] font-bold px-1.5 py-0.5 rounded-md inline-block">
                        FoodRescue Partner
                      </span>
                    </div>

                    {/* Mini Offer Banner */}
                    <div className="bg-gray-50 rounded-lg px-2 py-1 mt-1.5 flex items-center gap-1 text-[8px] text-gray-600 border border-gray-100">
                      <span className="truncate font-medium">{merchant.miniOffer}</span>
                    </div>
                  </div>

                  {/* Right: Circular voucher shape */}
                  <div className="w-14 h-14 border border-dashed border-[#078282] rounded-full flex flex-col items-center justify-center p-1 text-[7.5px] font-black text-[#078282] text-center bg-cyan-50/50 flex-shrink-0 self-center">
                    <span className="uppercase text-[6px]">Ưu đãi</span>
                    <span>{merchant.sidePromo.split(" ")[0]}</span>
                    <span className="text-[6.5px] font-bold mt-0.5 text-gray-500">{merchant.sidePromo.split(" ").slice(1).join(" ")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Notification Info Bar */}
      <div className="bg-[#F0FFFF] border-t border-cyan-100 px-4 py-2.5 flex items-center justify-between gap-3 flex-shrink-0">
        <p className="flex-1 text-[#078282] text-[9px] font-semibold leading-normal">
          Các ưu đãi cập nhật mới mỗi ngày lúc 17:00. Food cùng bạn cứu thực phẩm, bảo vệ môi trường!
        </p>
        <div className="text-xl flex-shrink-0 animate-bounce">🌍</div>
      </div>
    </div>
  );
}

// ─── Merchant Detail Screen (New Screen) ──────────────────────────────────────

function MerchantDetailScreen({
  merchant,
  onFoodSelect,
  onBack,
}: {
  merchant: Merchant;
  onFoodSelect: (f: FoodItem) => void;
  onBack: () => void;
}) {
  const merchantFoods = FOODS.filter((f) => f.storeId === merchant.id);

  const regularFoods = [
    { id: 101, name: "Cơm chiên đùi gà quay", price: 55000, image: "photo-1512058564366-18510be2db19", tag: "Bán chạy" },
    { id: 102, name: "Nước mát sâm hạt chia", price: 15000, image: "photo-1536256263959-770b48d82b0a", tag: "Phổ biến" },
    { id: 103, name: "Gà hấp muối tiêu chanh", price: 180000, image: "photo-1565299624946-b28f40a0ae38", tag: "Món mới" }
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Cover image header */}
      <div className="relative h-44 bg-gray-200 flex-shrink-0">
        <img
          src={`https://images.unsplash.com/${merchant.bannerImage}?w=800&h=400&fit=crop&auto=format`}
          alt={merchant.name}
          className="w-full h-full object-cover filter brightness-75"
        />
        <div className="absolute top-10 left-4 flex gap-2">
          <button onClick={onBack} className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm">
            <ArrowLeft size={16} className="text-gray-800" />
          </button>
        </div>
        <div className="absolute top-10 right-4 flex gap-2 items-center">
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <Heart size={14} className="text-gray-800" />
          </button>
          <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
            <Share2 size={14} className="text-gray-800" />
          </button>
          <span className="bg-black/60 text-white text-[9px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            🏍️ Giao nhanh
          </span>
        </div>
      </div>

      {/* Restaurant Info Card (Floating) */}
      <div className="px-4 -mt-10 relative z-10 flex-shrink-0">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="bg-yellow-400 text-yellow-950 text-[8px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                5 Star Eats <ChevronRight size={8} />
              </span>
              <h2 className="text-lg font-black text-gray-900 mt-1 leading-tight">{merchant.name}</h2>
              <p className="text-xs text-gray-500 mt-1">⭐ {merchant.rating} ({merchant.reviewsCount} đánh giá)</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Cửa hàng đối tác • {merchant.cuisines.join(", ")}</p>
            </div>
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
              <img src={`https://images.unsplash.com/${merchant.avatar}?w=100&h=100&fit=crop&auto=format`} alt={merchant.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-0.5">🏍️ Giao trong {merchant.deliveryTime} • {merchant.distance}</span>
            <span className="text-[#078282] font-bold">Phí ship: 3.000đ <span className="line-through text-gray-400 font-normal">15.000đ</span></span>
          </div>
        </div>
      </div>

      {/* Action buttons row */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        <button className="flex-shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-full border border-orange-200 text-orange-600 bg-orange-50 flex items-center gap-1 active:scale-95 transition-transform">
          Đặt nhóm (Group Order)
        </button>
        <button className="flex-shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 flex items-center gap-1 active:scale-95 transition-transform">
          Đặt lịch sau
        </button>
        <button className="flex-shrink-0 text-[10px] font-semibold px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 active:scale-95 transition-transform">
          Hỗ trợ ngôn ngữ
        </button>
      </div>

      {/* Voucher promotion cards list */}
      <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
        <div className="flex-shrink-0 bg-red-50 border border-red-100 rounded-xl p-2.5 flex items-center gap-2 max-w-[170px]">
          <span className="text-red-500 text-lg">♾️</span>
          <div>
            <p className="font-bold text-[9px] text-red-900 leading-tight">Unlimited</p>
            <p className="text-[8px] text-red-700 mt-0.5">Giảm thêm đến 12k ship</p>
          </div>
        </div>
        <div className="flex-shrink-0 bg-cyan-50 border border-cyan-100 rounded-xl p-2.5 flex items-center gap-2 max-w-[170px]">
          <span className="text-cyan-500 text-lg">👥</span>
          <div>
            <p className="font-bold text-[9px] text-cyan-900 leading-tight">Đặt Nhóm 10% off</p>
            <p className="text-[8px] text-cyan-700 mt-0.5">Chia hóa đơn tiện lợi</p>
          </div>
        </div>
        <div className="flex-shrink-0 bg-cyan-50 border border-cyan-100 rounded-xl p-2.5 flex items-center gap-2 max-w-[180px]">
          <span className="text-cyan-600 text-lg">🌿</span>
          <div>
            <p className="font-bold text-[9px] text-cyan-900 leading-tight">FoodRescue Partner</p>
            <p className="text-[8px] text-cyan-700 mt-0.5">Giải cứu đồ ăn giảm {merchant.discountText}</p>
          </div>
        </div>
      </div>

      {/* Scrollable Menu Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2" style={{ scrollbarWidth: "none" }}>
        {/* Today's Offer Section */}
        {merchantFoods.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-sm">🌿</span>
              <h3 className="font-extrabold text-sm text-gray-900">Ưu đãi giải cứu hôm nay (FoodRescue)</h3>
              <ChevronRight size={14} className="text-gray-400 ml-auto" />
            </div>

            <div className="space-y-2">
              {merchantFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => onFoodSelect(food)}
                  className="bg-[#F4FFFF] border border-cyan-100 rounded-2xl p-3 flex gap-3 cursor-pointer shadow-sm hover:shadow active:scale-[0.99] transition-all relative overflow-hidden"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <img src={`https://images.unsplash.com/${food.image}?w=150&h=150&fit=crop&auto=format`} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-extrabold text-[12px] text-gray-900 leading-tight">{food.name}</h4>
                    <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{food.description}</p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#078282] font-extrabold text-[13px]">{vnd(food.discountedPrice)}</span>
                      <span className="text-[10px] text-gray-400 line-through">{vnd(food.originalPrice)}</span>
                      <span className="bg-red-500 text-white text-[7px] font-bold px-1 py-0.25 rounded">-{food.discount}%</span>
                    </div>

                    <div className="flex gap-2 items-center text-[7.5px] text-cyan-700 font-bold mt-1">
                      <span className="flex items-center gap-0.5">
                        <Clock size={10} /> Hạn lấy: {food.deadline}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <Package size={10} /> Còn {food.quantity} phần
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); onFoodSelect(food); }}
                    className="w-7 h-7 bg-[#078282] text-white rounded-full flex items-center justify-center self-end shadow active:scale-90 transition-transform"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Menu */}
        <div>
          <h3 className="font-extrabold text-sm text-gray-900 mb-2">Thực đơn nhà hàng</h3>
          <div className="grid grid-cols-2 gap-2 pb-6">
            {regularFoods.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs p-2 flex flex-col justify-between"
              >
                <div className="relative h-24 bg-gray-100 rounded-xl overflow-hidden">
                  <img src={`https://images.unsplash.com/${item.image}?w=200&h=150&fit=crop&auto=format`} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-cyan-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded">
                    {item.tag}
                  </span>
                </div>
                <div className="mt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[10px] text-gray-900 line-clamp-1 leading-snug">{item.name}</h4>
                    <p className="text-[10px] font-bold text-gray-900 mt-0.5">{vnd(item.price)}</p>
                  </div>
                  <button className="w-full bg-gray-100 text-gray-700 text-[8.5px] font-bold py-1 rounded-lg mt-2 flex items-center justify-center gap-1 active:scale-95 transition-transform">
                    <Plus size={10} /> Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Screen ────────────────────────────────────────────────────────────

function DetailScreen({ food, onBack }: { food: FoodItem; onBack: () => void }) {
  const [reserved, setReserved] = useState(false);
  const [showOrderSheet, setShowOrderSheet] = useState(false);
  const [showCheckoutScreen, setShowCheckoutScreen] = useState(false);
  const [selectedFulfillment, setSelectedFulfillment] = useState<"delivery" | "pickup">("pickup");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"momo" | "zalopay" | "vnpay" | "card" | "cash">("momo");
  const deliveryFee = selectedFulfillment === "delivery" ? 15000 : 0;
  const checkoutTotal = food.discountedPrice + deliveryFee;

  const openOrderSheet = () => {
    setSelectedFulfillment("delivery");
    setShowOrderSheet(true);
  };

  const openPickupCheckout = () => {
    setSelectedFulfillment("pickup");
    setShowOrderSheet(true);
  };

  const confirmOrder = () => {
    setShowOrderSheet(false);
    setShowCheckoutScreen(true);
  };

  const placeOrder = () => {
    setShowCheckoutScreen(false);
    setReserved(true);
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="relative h-52 bg-gray-200 flex-shrink-0">
        <img src={`https://images.unsplash.com/${food.image}?w=800&h=400&fit=crop&auto=format`} alt={food.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
        <div className="absolute top-10 left-4 flex gap-2">
          <button onClick={onBack} className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"><ArrowLeft size={17} /></button>
        </div>
        <div className="absolute top-10 right-4 flex gap-2">
          <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"><Heart size={14} /></button>
          <button className="w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow"><Share2 size={14} /></button>
        </div>
        <div className="absolute bottom-3 left-3 bg-[#078282] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Leaf size={8} />Food Rescue</div>
        <div className="absolute bottom-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{food.discount}% OFF</div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-50" style={{ scrollbarWidth: "none" }}>
        <div className="bg-white rounded-t-3xl -mt-4 px-4 pt-4 pb-4">
          <h1 className="text-xl font-extrabold">{food.name}</h1>
          <p className="text-muted-foreground text-sm mb-3">{food.store}</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-extrabold text-[#078282]">{vnd(food.discountedPrice)}</span>
            <span className="text-sm text-muted-foreground line-through">{vnd(food.originalPrice)}</span>
            <span className="ml-auto bg-cyan-50 text-[#078282] text-[11px] font-bold px-2 py-1 rounded-xl">Tiết kiệm {vnd(food.originalPrice - food.discountedPrice)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: <Package size={13} />, label: "Còn lại", value: `${food.quantity} phần` },
              { icon: <Clock size={13} />, label: "Lấy trước", value: food.deadline },
              { icon: <MapPin size={13} />, label: "Khoảng cách", value: food.distance },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-2xl p-2.5 text-center">
                <div className="flex justify-center text-[#078282] mb-1">{item.icon}</div>
                <p className="text-[9px] text-muted-foreground">{item.label}</p>
                <p className="text-[11px] font-bold">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-4">
            <div className="w-9 h-9 bg-cyan-50 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={15} className="text-[#078282]" /></div>
            <div>
              <p className="font-semibold text-sm">{food.store}</p>
              <p className="text-[10px] text-muted-foreground">36 Đinh Tiên Hoàng, Hoàn Kiếm · {food.distance}</p>
            </div>
            <ChevronRight size={13} className="text-gray-300 ml-auto" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{food.description}</p>
          {/* Freshness */}
          <div className="space-y-1 mb-4">
            <div className="flex justify-between">
              <span className="text-xs text-muted-foreground font-medium">Độ tươi</span>
              <span className="text-xs font-semibold" style={{ color: food.freshness >= 90 ? "#078282" : food.freshness >= 75 ? "#f59e0b" : "#ef4444" }}>
                {food.freshness >= 90 ? "Rất tươi" : food.freshness >= 75 ? "Tốt" : "Dùng sớm"} ({food.freshness}%)
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${food.freshness}%`, backgroundColor: food.freshness >= 90 ? "#078282" : food.freshness >= 75 ? "#f59e0b" : "#ef4444" }} />
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#efffff] to-[#dcffff] rounded-2xl p-3 mb-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-[#078282] rounded-xl flex items-center justify-center flex-shrink-0"><Leaf size={15} className="text-white" /></div>
            <div>
              <p className="text-[9px] text-[#078282] font-semibold uppercase tracking-wider">Tác động của bạn</p>
              <p className="font-bold text-[13px]">Tiết kiệm {food.co2Saved} kg CO₂</p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-cyan-50 rounded-2xl p-3">
            <CheckCircle size={13} className="text-cyan-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-cyan-700">Tất cả thức ăn được kiểm tra chất lượng theo tiêu chuẩn Food.</p>
          </div>
        </div>
      </div>
      <div className="bg-white px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <button
          onClick={() => {
            if (!reserved) openOrderSheet();
          }}
          className="w-full py-4 rounded-2xl font-bold text-[15px] transition-all"
          style={{ backgroundColor: reserved ? "#efffff" : "#078282", color: reserved ? "#078282" : "white" }}
        >
          {reserved ? `✓ Đã đặt! Lấy hàng trước ${food.deadline}` : `Đặt ngay — ${vnd(food.discountedPrice)}`}
        </button>
      </div>

      {showOrderSheet && !reserved && (
        <div className="absolute inset-0 z-30 flex items-end">
          <button
            type="button"
            aria-label="Đóng lựa chọn nhận hàng"
            onClick={() => setShowOrderSheet(false)}
            className="absolute inset-0 bg-black/35"
          />
          <div className="relative w-full bg-white rounded-t-[2rem] px-4 pb-5 pt-3 shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-1.5 rounded-full bg-gray-200" />
            </div>

            <h2 className="text-[16px] font-black text-gray-900 leading-tight">Chọn hình thức nhận hàng</h2>
            <p className="text-[10px] text-gray-400 mt-1.5">Bạn muốn giao hàng hay tự đến lấy?</p>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => setSelectedFulfillment("delivery")}
                className="w-full rounded-[1.45rem] border bg-white px-4 py-4 text-left transition-all"
                style={{
                  borderColor: selectedFulfillment === "delivery" ? "#e5e7eb" : "#ececec",
                  boxShadow: selectedFulfillment === "delivery" ? "0 0 0 1px rgba(0,0,0,0.02)" : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">🛵</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-extrabold text-[13px] leading-tight text-gray-900">Giao hàng tận nơi</p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">Giao đến địa chỉ của bạn</p>
                        <p className="text-[11px] font-bold text-[#078282] mt-1">+15.000đ phí giao hàng</p>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: selectedFulfillment === "delivery" ? "#078282" : "#d1d5db" }}>
                        {selectedFulfillment === "delivery" && <div className="w-4 h-4 rounded-full bg-[#078282]" />}
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={openPickupCheckout}
                className="w-full rounded-[1.45rem] border px-4 py-4 text-left transition-all"
                style={{
                  backgroundColor: selectedFulfillment === "pickup" ? "#eaf9ef" : "#ffffff",
                  borderColor: selectedFulfillment === "pickup" ? "#078282" : "#d8d8d8",
                  boxShadow: selectedFulfillment === "pickup" ? "0 0 0 1px rgba(0,177,79,0.05)" : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-full bg-[#dce9ff] flex items-center justify-center flex-shrink-0 text-2xl">🏪</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <p className="font-extrabold text-[13px] leading-tight text-gray-900">Tự đến lấy tại cửa hàng</p>
                        <p className="text-[10px] font-semibold text-gray-400 mt-0.5">36 Đinh Tiên Hoàng, Hoàn Kiếm</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="text-[11px] font-bold text-[#078282]">Miễn phí giao hàng</span>
                          <span className="rounded-full bg-[#ff7a00] px-2.5 py-0.5 text-[9px] font-extrabold text-white">Thanh toán trước</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: selectedFulfillment === "pickup" ? "#078282" : "#d1d5db" }}>
                        {selectedFulfillment === "pickup" && <div className="w-4 h-4 rounded-full bg-[#078282]" />}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {selectedFulfillment === "pickup" && (
              <div className="mt-5 rounded-[1.5rem] bg-[#fff6ea] px-4 py-4 text-[#dc4d00]">
                <p className="text-[11px] leading-snug">
                  <span className="mr-2">⚠️</span>
                  Tự đến lấy yêu cầu <span className="font-extrabold">thanh toán trước</span> để giữ phần của bạn. Vui lòng đến trước {food.deadline}.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={confirmOrder}
              className="mt-5 w-full rounded-[1.5rem] bg-[#078282] py-4 text-[15px] font-black text-white shadow-lg shadow-cyan-500/20"
            >
              {selectedFulfillment === "delivery" ? "Tiếp tục" : "Thanh toán & Đặt chỗ"}
            </button>
          </div>
        </div>
      )}

      {showCheckoutScreen && !reserved && (
        <div className="absolute inset-0 z-40 flex flex-col bg-[#eff3ef]">
          <div className="bg-white px-4 pt-3 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-[19px] font-black text-gray-900">Xác nhận đơn hàng</h2>
              <button
                type="button"
                onClick={() => setShowCheckoutScreen(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
            <div className="bg-white rounded-[1.6rem] p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={`https://images.unsplash.com/${food.image}?w=120&h=120&fit=crop&auto=format`}
                  alt={food.name}
                  className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-black text-[17px] leading-tight text-gray-900 truncate">{food.name}</p>
                  <p className="text-[13px] text-gray-400 mt-0.5 truncate">{food.store}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                  <span>{selectedFulfillment === "delivery" ? "🛵" : "🏪"}</span>
                  <span>{selectedFulfillment === "delivery" ? "Giao hàng tận nơi" : `Tự đến lấy · Trước ${food.deadline}`}</span>
                </div>
                <div className="flex items-center justify-between text-[13px] text-gray-500">
                  <span>Giá món</span>
                  <span className="font-bold text-gray-900">{vnd(food.discountedPrice)}</span>
                </div>
                {selectedFulfillment === "delivery" && (
                  <div className="flex items-center justify-between text-[13px] text-gray-500">
                    <span>Phí giao hàng</span>
                    <span className="font-bold text-gray-900">15.000đ</span>
                  </div>
                )}
                <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                  <span className="text-[15px] font-black text-gray-900">Tổng cộng</span>
                  <span className="text-[20px] font-black text-[#078282]">{vnd(checkoutTotal)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-[18px] font-black text-gray-900 mb-3">Phương thức thanh toán</h3>
              <div className="space-y-3">
                {[
                  { id: "momo", label: "MoMo", sublabel: "Ví điện tử MoMo", dot: "bg-gradient-to-br from-fuchsia-500 to-purple-500" },
                  { id: "zalopay", label: "ZaloPay", sublabel: "Ví ZaloPay", dot: "bg-gradient-to-br from-sky-500 to-cyan-700" },
                  { id: "vnpay", label: "VNPay", sublabel: "Cổng thanh toán VNPay", dot: "bg-gradient-to-br from-red-500 to-red-700" },
                  { id: "card", label: "Thẻ tín dụng/ghi nợ", sublabel: "Visa / Mastercard", dot: "bg-yellow-200" },
                  ...(selectedFulfillment === "delivery"
                    ? [{ id: "cash", label: "Tiền mặt khi nhận hàng", sublabel: "Trả khi giao", dot: "bg-emerald-200" }]
                    : []),
                ].map((method) => {
                  const active = selectedPaymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id as typeof selectedPaymentMethod)}
                      className="w-full rounded-[1.45rem] border px-4 py-4 text-left transition-all bg-white"
                      style={{
                        borderColor: active ? "#078282" : "#e5e7eb",
                        backgroundColor: active ? "#eaf9ef" : "#ffffff",
                        boxShadow: active ? "0 0 0 1px rgba(0,177,79,0.05)" : "none",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${method.dot} flex-shrink-0`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-black text-gray-900">{method.label}</p>
                          <p className="text-[12px] font-semibold text-gray-400 mt-0.5">{method.sublabel}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: active ? "#078282" : "#d1d5db" }}>
                          {active && <div className="w-4 h-4 rounded-full bg-[#078282]" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white px-4 py-4 border-t border-gray-100 flex-shrink-0">
            <button
              type="button"
              onClick={placeOrder}
              className="w-full rounded-[1.5rem] bg-[#078282] py-4 text-[17px] font-black text-white shadow-lg shadow-cyan-500/20"
            >
              {selectedFulfillment === "delivery"
                ? `Đặt hàng — ${vnd(checkoutTotal)}`
                : `Đặt chỗ — ${vnd(checkoutTotal)}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payment Tab ──────────────────────────────────────────────────────────────

function PaymentTab() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
        <h1 className="font-bold text-lg">Thanh toán</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        <div className="bg-gradient-to-br from-[#078282] to-[#078282] rounded-3xl p-5 text-white mb-4">
          <p className="text-cyan-100 text-xs mb-1">Số dư Pay</p>
          <p className="text-3xl font-extrabold">480.000₫</p>
          <div className="flex gap-2 mt-4">
            {["Nạp tiền", "Chuyển khoản", "Rút tiền"].map((a) => (
              <button key={a} className="flex-1 bg-white/20 text-white text-[10px] font-semibold py-2 rounded-xl">{a}</button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100"><p className="font-bold text-sm">Lịch sử giao dịch</p></div>
          {[
            { icon: <Leaf size={16} className="text-[#078282]" />, label: "Rescue · Mixed Pastry Box", amt: -45000, date: "Hôm nay 20:15" },
            { icon: <UtensilsCrossed size={16} className="text-amber-600" />, label: "Food · Cơm tấm Sài Gòn", amt: -85000, date: "Hôm qua 12:30" },
            { icon: <CreditCard size={16} className="text-cyan-700" />, label: "Nạp tiền Pay", amt: 200000, date: "23/06 09:00" },
            { icon: <Leaf size={16} className="text-[#078282]" />, label: "Rescue · Bento Set", amt: -39000, date: "22/06 19:45" },
          ].map((tx, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center">{tx.icon}</div>
              <div className="flex-1">
                <p className="text-[12px] font-semibold leading-tight">{tx.label}</p>
                <p className="text-[10px] text-muted-foreground">{tx.date}</p>
              </div>
              <p className="font-bold text-[13px]" style={{ color: tx.amt > 0 ? "#078282" : "#1a1a2e" }}>
                {tx.amt > 0 ? "+" : ""}{vnd(Math.abs(tx.amt))}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Activity Tab ─────────────────────────────────────────────────────────────

function ActivityTab() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
        <h1 className="font-bold text-lg">Hoạt động</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        <div className="space-y-3">
          {[
            { icon: <Leaf size={18} className="text-[#078282]" />, title: "Rescue · Mixed Pastry Box", store: "Tous les Jours", status: "Đang chờ lấy hàng", color: "#f59e0b", price: "45.000₫", time: "Hôm nay" },
            { icon: <UtensilsCrossed size={18} className="text-amber-600" />, title: "Food · Cơm tấm Sài Gòn", store: "Cơm tấm Sài Gòn Q1", status: "Đã giao thành công", color: "#078282", price: "85.000₫", time: "Hôm qua" },
            { icon: <Leaf size={18} className="text-[#078282]" />, title: "Rescue · Bento Set", store: "Gyu-Kaku Express", status: "Đã hoàn thành", color: "#078282", price: "39.000₫", time: "22/06" },
            { icon: <Bike size={18} className="text-[#078282]" />, title: "Bike · Từ nhà đến Q3", store: "3.2 km", status: "Đã hoàn thành", color: "#078282", price: "22.000₫", time: "20/06" },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                <div className="flex-1">
                  <p className="font-bold text-[13px] leading-tight">{item.title}</p>
                  <p className="text-[11px] text-muted-foreground mb-1">{item.store}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: item.color + "20", color: item.color }}>{item.status}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-[#078282]">{item.price}</p>
                  <p className="text-[10px] text-muted-foreground">{item.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100 flex-shrink-0">
        <h1 className="font-bold text-lg">Tin nhắn</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ scrollbarWidth: "none" }}>
        {[
          { icon: <Leaf size={20} className="text-[#078282]" />, name: "Rescue", msg: "Mixed Pastry Box đang chờ bạn! Lấy trước 21:30.", time: "20:10", unread: 1, green: true },
          { icon: <UtensilsCrossed size={20} className="text-amber-600" />, name: "Food", msg: "Đơn hàng của bạn đã được giao thành công.", time: "12:45", unread: 0, green: false },
          { icon: <Bike size={20} className="text-[#078282]" />, name: "Bike", msg: "Chuyến đi của bạn đã hoàn tất. Cảm ơn!", time: "Hôm qua", unread: 0, green: false },
          { icon: <CreditCard size={20} className="text-cyan-700" />, name: "Pay", msg: "Bạn đã nạp 200.000₫ thành công.", time: "23/06", unread: 0, green: false },
        ].map((msg, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: msg.green ? "#efffff" : "#f3f4f6" }}>
              {msg.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-bold text-[13px]">{msg.name}</p>
                <p className="text-[10px] text-muted-foreground">{msg.time}</p>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{msg.msg}</p>
            </div>
            {msg.unread > 0 && (
              <div className="w-5 h-5 bg-[#078282] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[9px] font-bold">{msg.unread}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
  const [selectedFood, setSelectedFood] = useState<FoodItem>(FOODS[0]);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant>(MERCHANTS[0]);
  const [prevSubScreen, setPrevSubScreen] = useState<SubScreen>("rescue-list");
  const [simTime, setSimTime] = useState<number>(new Date().getHours());
  const [showPopup, setShowPopup] = useState(false);
  const popupTriggered = useRef(false);

  const isNight = simTime >= 21;

  useEffect(() => {
    if (isNight && !popupTriggered.current && subScreen === null) {
      popupTriggered.current = true;
      const t = setTimeout(() => setShowPopup(true), 700);
      return () => clearTimeout(t);
    }
  }, [isNight, subScreen]);

  useEffect(() => {
    if (!isNight) { popupTriggered.current = false; setShowPopup(false); }
  }, [isNight]);

  const openDetail = (food: FoodItem, fromScreen: SubScreen = "rescue-list") => {
    setSelectedFood(food);
    setPrevSubScreen(fromScreen);
    setSubScreen("detail");
  };
  const openMerchant = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setSubScreen("merchant");
  };
  const openRescue = () => setSubScreen("rescue-list");

  // Sub-screens cover the full phone (no bottom nav)
  const isSubScreen = subScreen !== null;

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4" style={{ backgroundColor: "#efffff", fontFamily: "'Inter', sans-serif" }}>
      <div className="flex flex-col items-center gap-5 w-full max-w-sm">

        {/* Time simulator */}
        <div className="w-full bg-white rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-gray-700"> Giờ mô phỏng</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: isNight ? "#078282" : "#f3f4f6", color: isNight ? "white" : "#6b7280" }}>
              {String(simTime).padStart(2, "0")}:00 {isNight ? "Giờ Rescue!" : "Ban ngày"}
            </span>
          </div>
          <input type="range" min={6} max={23} value={simTime} onChange={(e) => setSimTime(Number(e.target.value))} className="w-full accent-[#078282]" />
          <div className="flex justify-between text-[9px] text-gray-400 mt-0.5">
            <span>06:00</span>
            <span className="text-[#078282] font-bold">← Kéo đến 21:00 để xem popup</span>
            <span>23:00</span>
          </div>
        </div>

        {/* Phone frame */}
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white" style={{ width: "375px", height: "780px", backgroundColor: "#f5f6f8" }}>
          {/* Status bar */}
          <div
            className="absolute top-0 left-0 right-0 h-7 z-40 flex items-center justify-between px-5"
            style={{
              backgroundColor:
                subScreen === "rescue-list" ? "#ffffff"
                  : subScreen === "merchant" ? "transparent"
                    : subScreen === "detail" ? "transparent"
                      : "#ffffff",
            }}
          >
            <span className="text-[10px] font-bold text-[#1a1a2e]">
              {String(simTime).padStart(2, "0")}:27
            </span>
            <span className="text-[9px] text-[#1a1a2e]">4G 🔋</span>
          </div>

          {/* Content */}
          <div className="absolute inset-0 pt-7 flex flex-col">
            {/* ── Sub-screens (full-screen, no bottom nav) ── */}
            {subScreen === "rescue-list" && (
              <FoodRescueEventScreen
                onDetail={(food) => openDetail(food, "rescue-list")}
                onMerchantSelect={openMerchant}
                onBack={() => setSubScreen(null)}
              />
            )}
            {subScreen === "merchant" && (
              <MerchantDetailScreen
                merchant={selectedMerchant}
                onFoodSelect={(food) => openDetail(food, "merchant")}
                onBack={() => setSubScreen("rescue-list")}
              />
            )}
            {subScreen === "detail" && (
              <DetailScreen
                food={selectedFood}
                onBack={() => setSubScreen(prevSubScreen)}
              />
            )}

            {/* ── Tab views + bottom nav ── */}
            {!isSubScreen && (
              <>
                {activeTab === "home" && (
                  <HomeTab
                    onRescue={openRescue}
                    onDetail={(food) => openDetail(food, "rescue-list")}
                    showPopup={showPopup}
                    onClosePopup={() => { setShowPopup(false); openRescue(); }}
                    isNight={isNight}
                  />
                )}
                {activeTab === "payment" && <PaymentTab />}
                {activeTab === "activity" && <ActivityTab />}
                {activeTab === "messages" && <MessagesTab />}

                <BottomNav
                  active={activeTab}
                  onSelect={(t) => { setActiveTab(t); setSubScreen(null); }}
                />
              </>
            )}
          </div>

          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-black/15 rounded-full z-50" />
        </div>

        <p className="text-[11px] text-[#078282]/50 text-center">Food · Rescue Integration · Concept UI</p>
      </div>
    </div>
  );
}
