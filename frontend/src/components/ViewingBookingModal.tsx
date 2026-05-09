import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import loginIcon from "@/assets/icons/Login.svg";
interface ViewingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: any;
}

export const ViewingBookingModal: React.FC<ViewingBookingModalProps> = ({
  isOpen,
  onClose,
  room,
}) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form states
  const [fullName, setFullName] = useState(user?.tenant?.name || "");
  const [beds, setBeds] = useState("1");
  const [datetime, setDatetime] = useState("");
  const [phone, setPhone] = useState(user?.tenant?.phone || "");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/appointment", {
        tenant_id: user?.tenant?.tenant_id,
        room_id: room.room_id,
        number_of_people: parseInt(beds, 10),
        appointment_time: new Date(datetime).toISOString(),
      });


      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Not Authenticated View
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 hover:cursor-pointer hover:opacity-75"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center">
              <img src={loginIcon} alt="Login" className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-size-xl be-vietnam-pro-medium text-text">Bạn chưa đăng nhập</h2>
              <p className="text-text/70 be-vietnam-pro-light text-size-base">Vui lòng đăng nhập hoặc đăng ký để đặt lịch xem phòng.</p>
            </div>

            <div className="flex flex-col w-full gap-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 text-size-base bg-secondary text-white rounded-xl be-vietnam-pro-medium hover:bg-tirtiary shadow-lg shadow-secondary/20 hover:cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="w-full py-3 text-size-base border border-secondary text-secondary rounded-xl be-vietnam-pro-medium hover:bg-secondary hover:text-background hover:cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success View
  if (success) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <div className="bg-[#FDFCF0] rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-primary">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl be-vietnam-pro-bold text-text">Đã gửi yêu cầu thành công!</h2>
          <p className="text-text/70 be-vietnam-pro-light text-center">Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
        </div>
      </div>
    );
  }

  // Booking Form View
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="bg-[#FDFCF0] rounded-[2.5rem] shadow-2xl w-full max-w-[55rem] overflow-hidden flex animate-in fade-in slide-in-from-bottom-4 duration-500 border border-secondary/20">

        {/* Left Panel */}
        <div className="w-1/3 flex items-center justify-center p-10 border-r border-[#A9C69A]">
          <h1 className="text-3xl be-vietnam-pro-bold text-text text-center leading-relaxed">
            Điền thông tin<br />cá nhân
          </h1>
        </div>

        {/* Right Panel: Form */}
        <div className="w-2/3 p-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <label className="w-40 text-text be-vietnam-pro-medium">Họ tên:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-secondary text-text"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-40 text-text be-vietnam-pro-medium">Số giường dự kiến:</label>
              <select
                value={beds}
                onChange={(e) => setBeds(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-secondary text-text appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 relative">
              <label className="w-40 text-text be-vietnam-pro-medium">Ngày &amp; Giờ hẹn</label>
              <input
                type="datetime-local"
                required
                value={datetime}
                onChange={(e) => setDatetime(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-secondary text-text"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-40 text-text be-vietnam-pro-medium">Số điện thoại:</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-secondary text-text"
              />
            </div>

            {error && <p className="text-red-500 text-size-small be-vietnam-pro-light">{error}</p>}

            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-12 py-2.5 border border-[#A9C69A] text-[#74A684] rounded-xl be-vietnam-pro-medium hover:bg-secondary/5"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-12 py-2.5 bg-[#74A684] text-white rounded-xl be-vietnam-pro-medium hover:bg-secondary transition-all shadow-lg shadow-secondary/20 disabled:opacity-50"
              >
                {loading ? "Đang gửi..." : "Gửi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
