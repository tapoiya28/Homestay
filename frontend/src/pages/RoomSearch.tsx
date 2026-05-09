import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchBar } from '@/components/SearchBar';
import Filter from '@/components/Filter';
import ItemCardS from '@/components/ItemCardS';
import api from '@/lib/axios';

const RoomSearch = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);

        const response = await api.get(`/room?${queryParams.toString()}`);
        if (response.data && response.data.success) {
          setRooms(response.data.data);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error("Failed to fetch rooms", error);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [location.search]);

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Top Search & Filter Section */}
      <section className="w-full flex flex-col items-center justify-center gap-4 sm:flex-row py-8 relative z-10 px-4">
        <SearchBar />
        <div className="relative">
          <Filter pos="relative" />
        </div>
      </section>

      {/* Results Section */}
      <section className="mx-auto maxpx-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20 flex-col">
            <div className="animate-spin rounded-full h-8 w-8 border-b-transparent border-3 border-secondary"></div>
            <span className="be-vietnam-pro-medium text-lg text-text">Đang tải...</span>
          </div>
        ) : rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 justify-items-center">
            {rooms.map((room) => (
              <ItemCardS key={room.id || room.room_id} room={room} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-20">
            <span className="be-vietnam-pro-medium text-lg text-text">Không tìm thấy phòng nào phù hợp.</span>
          </div>
        )}
      </section>
    </div>
  );
};

export default RoomSearch;
