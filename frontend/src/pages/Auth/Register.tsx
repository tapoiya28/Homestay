import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layouts/AuthLayout";
import heroImage from "@/assets/images/hero.png"; // Path to the large room image
import FacebookButton from "@/components/auth/FacebookButton";
import GoogleButton from "@/components/auth/GoogleButton";
import { useForm } from "react-hook-form";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "react-toastify";

export const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data: any) => {
    setErrorMsg("");
    try {
      const response = await api.post("/auth/register", {
        email: data.email,
        password: data.password,
        role: "customer"
      });
      if (response.data.success) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <AuthLayout heroImage={heroImage}>
      {/* 1. Heading & Accent Link */}
      <div className="text-center mb-10 be-vietnam-pro-light">
        <h1 className="text-7xl text-text mb-2 whitespace-nowrap be-vietnam-pro-bold">
          Đăng ký
        </h1>
        <p className="text-lg text-text/80">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-secondary font-medium hover:underline">
            đăng nhập
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
            {...register("email", { 
              required: "Vui lòng nhập email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email không hợp lệ"
              }
            })}
            className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message as string}</span>}
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            {...register("password", { required: "Vui lòng nhập mật khẩu", minLength: { value: 6, message: "Mật khẩu ít nhất 6 ký tự" } })}
            className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message as string}</span>}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            {...register("confirmPassword", {
              required: "Vui lòng nhập lại mật khẩu",
              validate: value => value === password || "Mật khẩu không khớp"
            })}
            className="w-full h-14 rounded-lg border border-LightOutline px-6 text-lg placeholder:text-gray-400 outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
          />
          {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message as string}</span>}
        </div>

        {/* Secondary Green Button */}
        <button
          type="submit"
          className="h-[3rem] w-[14rem] mx-auto rounded-lg bg-secondary text-white text-lg font-medium transition-colors hover:cursor-pointer hover:bg-tirtiary"
        >
          Đăng ký
        </button>
      </form>

      {/* 3. Social Divider */}
      <div className="relative flex items-center justify-center my-10">
        <div className="flex-grow border-t border-LightOutline"></div>
        <span className="flex-shrink mx-4 text-text/75 text-base px-2 bg-background z-10">
          Hoặc đăng ký bằng
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