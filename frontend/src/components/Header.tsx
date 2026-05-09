import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserMenu from "@/components/UserMenu";

import phoneIcon from "@/assets/icons/Phone.svg";
import emailIcon from "@/assets/icons/Mail.svg";

const Header = () => {
  const [passThreshold, setPassThreshold] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setPassThreshold(true);
      } else {
        setPassThreshold(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isContactOpen && !target.closest('.contact-dropdown-container')) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isContactOpen]);

  return (
    <header
      className={`fixed z-50 be-vietnam-pro-light bg-background/35 backdrop-blur-[3px] flex items-center justify-center
        ${passThreshold
          ? "top-5 left-1/2 -translate-x-1/2 w-[50%] px-4 py-1 rounded-lg text-size-small border shadow-sm border-1 border-primary" // Small header state (adjusted width to 60% to fit content comfortably)
          : "top-0 left-0 w-full px-8 py-3 text-large rounded-none border-transparent shadow-none" // Big header state
        }`}
    >
      {/* Left Section */}
      <div className="flex-1 justify-start items-center w-fit gap-2 hidden md:flex contact-dropdown-container relative">
        <button
          onClick={() => setIsContactOpen(!isContactOpen)}
          className="text-text transition-colors hover:text-primary whitespace-nowrap cursor-pointer outline-none"
        >
          Liên hệ
        </button>

        {isContactOpen && (
          <div className="absolute top-full left-0 mt-3 w-max min-w-[200px] bg-white border border-LightOutline rounded-2xl p-5 shadow-xl z-50 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3 text-text hover:text-primary transition-colors cursor-default">
              <div className="p-2 rounded-full bg-primary/10">
                <img src={phoneIcon} className="w-4 h-4" alt="Phone" style={{ filter: 'invert(52%) sepia(35%) saturate(543%) hue-rotate(95deg) brightness(93%) contrast(85%)' }} />
              </div>
              <span className="be-vietnam-pro-medium text-size-small">0987 654 321</span>
            </div>
            <div className="flex items-center gap-3 text-text hover:text-primary transition-colors cursor-default">
              <div className="p-2 rounded-full bg-primary/10">
                <img src={emailIcon} className="w-4 h-4" alt="Email" style={{ filter: 'invert(52%) sepia(35%) saturate(543%) hue-rotate(95deg) brightness(93%) contrast(85%)' }} />
              </div>
              <span className="be-vietnam-pro-medium text-size-small">homestay.dorm@gmail.com</span>
            </div>
          </div>
        )}
      </div>

      {/* Center Section: Brand/Logo (Fades out and shrinks) */}
      <Link
        className={`flex justify-center items-center overflow-hidden
            ${passThreshold ? "w-fit scale-65 flex-none hidden md:block" : "flex-1 opacity-100 scale-100 w-auto"}`}
        to="/"
      >
        <img src="/logo.svg" alt="Logo" className="h-5 w-auto" />
      </Link>

      {/* Right Section */}
      <div className={`flex flex-1 items-center justify-center md:justify-end ${passThreshold ? "gap-2" : "gap-5"}`}>
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <Link to="/login" className="text-text transition-colors hover:text-primary whitespace-nowrap">
              Đăng nhập
            </Link>
            <div className={`w-[1.5px] bg-secondary opacity-75 transition-all duration-500 ${passThreshold ? "h-5" : "h-6"}`}></div>
            <Link to="/register">
              <button className={`rounded-md bg-secondary be-vietnam-pro-medium text-background transition-colors hover:ring hover:ring-offset-primary hover:ring-offset-2 hover:shadow-md hover:cursor-pointer whitespace-nowrap ${passThreshold ? "px-2 py-0.5" : "px-3 py-1"}`}>
                Đăng ký
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;