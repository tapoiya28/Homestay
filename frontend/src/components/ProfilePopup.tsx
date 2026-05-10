import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';

interface ProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: any; // The user object from AuthContext
}

type ProfileFormData = {
  username: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  nationality: string;
  cccd_number: string;
};

const ProfilePopup: React.FC<ProfilePopupProps> = ({ isOpen, onClose, user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { updateUser } = useAuth();

  const tenant = user?.tenant || {};

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileFormData>({
    defaultValues: {
      username: user?.username || '',
      name: tenant.name || user?.username || '',
      email: user?.email || '',
      phone: tenant.phone || '',
      gender: tenant.gender || 'Nam',
      nationality: tenant.nationality || 'Việt Nam',
      cccd_number: tenant.cccd_number || '',
    }
  });

  // Reset form when user data changes (e.g., after save)
  useEffect(() => {
    reset({
      username: user?.username || '',
      name: tenant.name || '',
      email: user?.email || '',
      phone: tenant.phone || '',
      gender: tenant.gender || 'Nam',
      nationality: tenant.nationality || 'Việt Nam',
      cccd_number: tenant.cccd_number || '',
    });
  }, [user, reset, tenant.name, user.email, tenant.phone, tenant.gender, tenant.nationality, tenant.cccd_number, user?.username]);

  if (!isOpen) return null;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const response = await api.put('/auth/me', data);
      if (response.data.success) {
        updateUser(response.data.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin.");
    }
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // Safe fallbacks for view mode
  const userNameDisplay = user?.username || 'Tên tài khoản';
  const nameDisplay = tenant.name || 'Chưa cập nhật';
  const emailDisplay = user.email || 'Chưa cập nhật';
  const phoneDisplay = tenant.phone || 'Chưa cập nhật';
  const genderDisplay = tenant.gender || 'Chưa cập nhật';
  const nationalityDisplay = tenant.nationality || 'Chưa cập nhật';
  const cccdDisplay = tenant.cccd_number || 'Chưa cập nhật';

  const inputClass = "flex-1 text-right ring ring-DarkOutline rounded-md px-3 py-1.5 outline-none focus:ring-secondary text-DarkOutline";
  const infoClass = "text-right flex-1 px-3 py-1.5 whitespace-nowrap";
  const leftLabelClass = "text-text/80 be-vietnam-pro-medium w-32 whitespace-nowrap";

  return (
    <div className="absolute 
    md:right-0 max-md:left-1/2 max-md:-translate-x-1/2
    top-full mt-2 z-20 w-[420px] cursor-default text-left">
      <div className="relative w-full rounded-2xl bg-white px-4 py-6 shadow-xl be-vietnam-pro-light border border-LightOutline text-size-base">

        {/* Close Button */}
        <button
          onClick={() => {
            if (isEditing) handleCancel();
            onClose();
          }}
          className="absolute right-6 top-6 text-text/60 hover:text-text transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        {isEditing ? (
          <input
            {...register("username")} className="block w-fit mb-8 mx-auto text-center text-size-large be-vietnam-pro-medium text-text ring ring-DarkOutline text-DarkOutline rounded-md px-3 py-1.5 outline-none focus:ring-secondary rounded-md"
            placeholder={userNameDisplay} />
        ) : (
          <h2 className="mb-8 text-center text-size-large be-vietnam-pro-medium text-text">
            {userNameDisplay}
          </h2>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 text-[15px] text-text">

          {/* Info Grid */}
          <div className="flex justify-between items-center">
            <span className={leftLabelClass}>Họ tên</span>
            {isEditing ? (
              <input {...register("name")} className={inputClass} />
            ) : (
              <span className={infoClass}>{nameDisplay}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className={leftLabelClass}>Email</span>
            {isEditing ? (
              <input {...register("email")} className={inputClass} />
            ) : (
              <span className={infoClass}>{emailDisplay}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className={leftLabelClass}>Số điện thoại</span>
            {isEditing ? (
              <input {...register("phone")} className={inputClass} />
            ) : (
              <span className={infoClass}>{phoneDisplay}</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className='flex justify-between w-1/2 items-center '>
              <span className="text-text/80 font-medium w-fit whitespace-nowrap">Giới tính</span>
              {isEditing ? (
                <select {...register("gender")} className="ring ring-DarkOutline rounded-md px-1 py-1.5 outline-none focus:ring-secondary text-DarkOutline">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <span className={infoClass}>{genderDisplay}</span>
              )}
            </div>

            <span className="mx-1 text-LightOutline">|</span>

            <div className='flex justify-between w-1/2 items-center '>
              <span className={`${leftLabelClass} w-fit!`}>Quốc tịch</span>
              {isEditing ? (
                <select {...register("nationality")} className="ring ring-DarkOutline rounded-md px-1 py-1.5 outline-none focus:ring-secondary text-DarkOutline">
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Nước ngoài">Nước ngoài</option>
                </select>
              ) : (
                <span className={infoClass}>{nationalityDisplay}</span>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className={leftLabelClass}>Mật khẩu</span>
            {isEditing ? (
              <button type="button" className="flex-1 text-center text-DarkOutline border border-LightOutline rounded-md px-3 py-1.5 hover:bg-gray-50 transition-colors">Đổi mật khẩu</button>
            ) : (
              <span className={infoClass}>**************</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className={leftLabelClass}>CCCD</span>
            {isEditing ? (
              <input {...register("cccd_number")} className={inputClass} />
            ) : (
              <span className={infoClass}>{cccdDisplay}</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center gap-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-lg ring ring-[#6AA47B] text-[#6AA47B] px-8 py-2.5 transition-colors hover:bg-gray-50 be-vietnam-pro-medium shadow-sm min-w-[100px]"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#6AA47B] px-8 py-2.5 text-white transition-colors hover:bg-[#5b8c69] be-vietnam-pro-medium shadow-sm min-w-[100px] disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-[#6AA47B] px-8 py-2.5 text-white transition-colors hover:bg-[#5b8c69] be-vietnam-pro-medium shadow-sm"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProfilePopup;
