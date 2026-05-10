import React, { useEffect, useState } from "react";
import ItemCardL from "../components/ItemCardL";
import { SearchBar } from "@/components/SearchBar";
import Filter from "@/components/Filter";
import heroBackground from "@/assets/images/hero.png";
import api from "@/lib/axios";
import type { RoomData } from "@/types/room";

const Homepage = () => {
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const response = await api.get('/room?limit=8');
        if (response.data && response.data.success) {
          setRooms(response.data.data.slice(0, 8)); // Ensure we only show 8 items
        }
      } catch (error) {
        console.error("Failed to fetch rooms for homepage", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // A simple array to mock cards if api fails or while loading
  const mockListings = Array.from({ length: 4 });

  return (
    <main className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative flex h-[600px] w-full flex-col items-center justify-center px-4">

        {/* Background Image with a slight dark overlay so the white search bar pops */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black" />
          <div className="absolute inset-0 bg-linear-to-b from-[#FFFAF0] to-[#731900] opacity-15" />
          <img
            src={heroBackground}
            alt="Beautiful Home"
            className="h-full w-full object-cover opacity-50"
          />

        </div>

        <p className="absolute z-2 text-5xl be-vietnam-pro-bold text-white mb-20 text-center">
          Tìm địa điểm sống lý tưởng nhất
        </p>

        {/* Search & Filter Controls */}
        <div className="relative z-10 mt-62 flex w-full max-w-4xl flex-col items-center justify-center gap-4 sm:flex-row">
          <SearchBar />
          <Filter pos={"right-[-10px]"} />
        </div>

      </section>

      {/* Listings Grid Section */}
      <section className="mx-auto max-w-7xl px-8 py-16">

        {/* Responsive Grid: 
          1 column on mobile, 2 on tablets, 3 on small laptops, 4 on desktops 
        */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">

          {loading ? (
            <div className="w-full flex col-span-full justify-center flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-transparent border-3 border-secondary"></div>
              <span className=" be-vietnam-pro-medium">Đang tải...</span>
            </div>
          ) : rooms.length > 0 ? (
            rooms.map((room) => <ItemCardL key={room.room_id} room={room} />)
          ) : (
            <div className="col-span-full py-10">
              <span className="text-lg text-text">Không có phòng nào</span>
            </div>
          )}

        </div>

      </section>

    </main>
  );
}

export default Homepage;