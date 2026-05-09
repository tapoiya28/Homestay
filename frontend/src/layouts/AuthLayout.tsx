import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  heroImage: string;
}

export const AuthLayout = ({ children, heroImage }: AuthLayoutProps) => {
  return (
    <main className="min-h-screen flex w-full">
      
      {/* Left Side: Content & Form */}
      <section className="flex-1 flex flex-col items-center justify-center bg-background px-16 py-12">
        <Link 
          to="/" 
          className="absolute top-4 left-4 rounded-full border border-LightOutline px-3 py-1 text-sm text-text hover:bg-gray-100 transition-colors"
        >
          Home
        </Link>
        
        <div className="w-full max-w-lg">
          {children}
        </div>
      </section>

      {/* Right Side: Full Hero Image */}
      <section className="flex-1 w-full relative">
        <img 
          src={heroImage} 
          alt="Homestay Hero" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5" />
      </section>

    </main>
  );
};