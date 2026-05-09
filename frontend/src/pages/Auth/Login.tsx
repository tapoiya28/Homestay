import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import heroImage from "@/assets/images/hero.png";
import FacebookButton from "@/components/auth/FacebookButton";
import GoogleButton from "@/components/auth/GoogleButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

export const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    setErrorMsg("");
    try {
      const response = await api.post("/auth/login", data);
      if (response.data.success) {
        login(response.data.data.token, response.data.data.user);
        navigate("/");
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  return (
    <AuthLayout heroImage={heroImage}>
      {/* 1. Heading & Accent Link */}
      <div className="text-center mb-16 be-vietnam-pro-light">
        <h1 className="text-7xl text-text mb-2 whitespace-nowrap be-vietnam-pro-bold">
          Đăng nhập
        </h1>
        <p className="text-lg text-text/80">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="text-secondary font-medium hover:underline">
            đăng ký
          </Link>
        </p>
      </div>

      {/* 2. Credentials Form */}
      <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
        {errorMsg && <div className="text-red-500 text-center">{errorMsg}</div>}
        
        <div>
          <input 
            type="email" 
            placeholder="Email"
            {...register("email", { required: true })}
            className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          {errors.email && <span className="text-red-500 text-sm">Vui lòng nhập email</span>}
        </div>
        
        <div>
          <input 
            type="password" 
            placeholder="Mật khẩu"
            {...register("password", { required: true })}
            className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          {errors.password && <span className="text-red-500 text-sm">Vui lòng nhập mật khẩu</span>}
        </div>

        {/* Forget Password Link */}
        <div className="text-left -mt-2">
          <Link to="/forget-password" className="text-text/75 hover:text-secondary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Secondary Green Button */}
        <button 
          type="submit" 
          className="h-[3rem] w-[14rem] mx-auto rounded-lg bg-secondary text-white text-lg font-medium transition-colors hover:cursor-pointer hover:bg-tirtiary"
        >
          Đăng nhập
        </button>
      </form>

      {/* 3. Social Divider */}
      <div className="relative flex items-center justify-center my-10">
        <div className="flex-grow border-t border-LightOutline"></div>
        <span className="flex-shrink mx-4 text-text/75 text-base px-2 bg-background z-10">
          Hoặc đăng nhập bằng
        </span>
        <div className="flex-grow border-t border-LightOutline"></div>
      </div>

      {/* 4. Social Login Buttons */}
      <div className="flex gap-4 justify-center">
        <GoogleButton />
        <FacebookButton />
      </div>
    </AuthLayout>
  );
};