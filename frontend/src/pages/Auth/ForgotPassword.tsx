import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import heroImage from "@/assets/images/hero.png";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export const ForgetPasswordPage = () => {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  const newPassword = watch("newPassword");

  const onSubmitEmail = async (data: any) => {
    setErrorMsg("");
    try {
      const response = await api.post("/auth/forgot-password", { email: data.email });
      if (response.data.success) {
        setEmail(data.email);
        setStep(2);
        toast.success("Đã gửi OTP về email của bạn (Check console/network cho mock OTP)");
        console.log("Mock OTP Template:", response.data.emailTemplate);
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Yêu cầu thất bại");
    }
  };

  const onSubmitReset = async (data: any) => {
    setErrorMsg("");
    try {
      const response = await api.post("/auth/reset-password", {
        email: email,
        otp: data.otp,
        newPassword: data.newPassword
      });
      if (response.data.success) {
        toast.success("Đổi mật khẩu thành công!");
        navigate("/login");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <AuthLayout heroImage={heroImage}>
      {step === 1 ? (
        <>
          <div className="text-center mb-12 be-vietnam-pro-light">
            <h1 className="text-6xl text-text mb-4 whitespace-nowrap be-vietnam-pro-bold">
              Tạo lại mật khẩu
            </h1>
            <p className="text-lg text-text/80 leading-relaxed max-w-md mx-auto">
              Vui lòng nhập địa chỉ email của tài khoản để chúng tôi gửi mã OTP tạo mật khẩu mới.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmitEmail)}>
            {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
            <div>
              <input 
                type="email" 
                placeholder="Điền email"
                {...register("email", { required: "Vui lòng nhập email" })}
                className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message as string}</span>}
            </div>

            <button 
              type="submit" 
              className="h-14 w-full rounded-lg bg-primary text-white text-lg font-medium transition-colors hover:bg-opacity-90 active:scale-[0.98]"
            >
              Gửi email lấy mã OTP
            </button>
          </form>
        </>
      ) : (
        <>
          <div className="text-center mb-12 be-vietnam-pro-light">
            <h1 className="text-6xl text-text mb-4 whitespace-nowrap be-vietnam-pro-bold">
              Nhập mã OTP
            </h1>
            <p className="text-lg text-text/80 leading-relaxed max-w-md mx-auto">
              Nhập mã OTP đã gửi đến {email} và thiết lập mật khẩu mới.
            </p>
          </div>

          <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmitReset)}>
            {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
            
            <div>
              <input 
                type="text" 
                placeholder="Mã OTP"
                {...register("otp", { required: "Vui lòng nhập mã OTP" })}
                className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.otp && <span className="text-red-500 text-sm">{errors.otp.message as string}</span>}
            </div>

            <div>
              <input 
                type="password" 
                placeholder="Mật khẩu mới"
                {...register("newPassword", { required: "Vui lòng nhập mật khẩu mới", minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" } })}
                className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message as string}</span>}
            </div>

            <div>
              <input 
                type="password" 
                placeholder="Xác nhận mật khẩu mới"
                {...register("confirmNewPassword", { 
                  required: "Vui lòng xác nhận mật khẩu mới",
                  validate: value => value === newPassword || "Mật khẩu không khớp"
                })}
                className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.confirmNewPassword && <span className="text-red-500 text-sm">{errors.confirmNewPassword.message as string}</span>}
            </div>

            <button 
              type="submit" 
              className="h-14 w-full rounded-lg bg-primary text-white text-lg font-medium transition-colors hover:bg-opacity-90 active:scale-[0.98]"
            >
              Đổi mật khẩu
            </button>
          </form>
        </>
      )}

      <div className="text-center mt-12">
          <Link to="/login" className="text-text/75 hover:text-primary hover:underline">
              Quay lại đăng nhập
          </Link>
      </div>

    </AuthLayout>
  );
};