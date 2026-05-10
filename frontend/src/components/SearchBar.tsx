import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import searchIcon from "@/assets/icons/Search.svg";

TMLInputElement >) => {
  if (e.key === "Enter") {
    handleSearch();
  }
};

return (
  <div className="flex h-14 w-full max-w-2xl items-center overflow-hidden rounded-[1rem] bg-white pl-6 pr-2 shadow-md">
    <input
      type="text"
      placeholder="Tìm theo tên"
      className="h-full w-full bg-transparent text-lg text-text outline-none placeholder:text-gray-400"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleKeyDown}
    />
    <button
      onClick={handleSearch}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-tirtiary hover:cursor-pointer"
    >
      <img src={searchIcon} alt="Search" className="h-5 w-5" />
    </button>
  </div>
);
};