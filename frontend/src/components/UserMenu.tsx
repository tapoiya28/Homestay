import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "@/assets/icons/User.svg";
import ProfilePopup from "./ProfilePopup";

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const openProfile = () => {
        setIsOpen(false);
        setIsProfileOpen(true);
    };

    return (
        <div className="relative min-w-[10rem]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-size-base be-vietname-pro-light transition-colors hover:bg-white/50 px-4 py-1 rounded-full flex items-center gap-1 justify-between hover:cursor-pointer"
            >
                <img src={userAvatar} className="w-5 h-5" />

                <div className="flex items-center gap-1">
                    <p className="whitespace-nowrap">{user?.username}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-full bg-background border border-LightOutline rounded-md shadow-lg py-1 z-50">
                    <button
                        onClick={openProfile}
                        className="block w-full text-center px-4 py-2 text-sm text-text hover:bg-LightOutline/50 cursor-pointer"
                    >
                        Thông tin cá nhân
                    </button>
                    {user?.role === 'customer' && (
                        <Link
                            to="/meet-up"
                            className="block w-full text-center px-4 py-2 text-sm text-text hover:bg-LightOutline/50"
                            onClick={() => setIsOpen(false)}
                        >
                            Lịch hẹn của tôi
                        </Link>
                    )}
                    {['admin', 'manager', 'sale', 'accountant', 'employee'].includes(user?.role || '') && (
                        <Link to="/dashboard" className="block w-full text-center px-4 py-2 text-sm text-text hover:bg-LightOutline/50" onClick={() => setIsOpen(false)}>
                            Quản lý (Dashboard)
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="block w-full text-center px-4 py-2 text-sm text-red-500 hover:bg-LightOutline/50 cursor-pointer"
                    >
                        Đăng xuất
                    </button>
                </div>
            )}

            <ProfilePopup
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                user={user}
            />
        </div>
    );
};

export default UserMenu;