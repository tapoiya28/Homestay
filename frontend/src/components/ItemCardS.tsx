import homeIcon from "@/assets/icons/Room.svg";
import mapPinIcon from "@/assets/icons/MapPin.svg";
import roomImage from "@/assets/images/no_preview.webp";
import { Link } from "react-router-dom";
import type { RoomData } from "@/types/room";

interface ItemCardSProps {
  room?: RoomData;
}

const ItemCardS = ({ room }: ItemCardSProps) => {
  const getGenderText = (policy: string | undefined) => {
    if (policy === 'Male') return 'Phòng nam';
    if (policy === 'Female') return 'Phòng nữ';
    if (policy === 'Mixed') return 'Phòng nam/nữ';
    return 'Phòng';
  };

  const getPriceText = (beds: RoomData['beds'] | undefined) => {
    if (!beds || beds.length === 0) return 'Đang cập nhật';
    const minPrice = Math.min(...beds.map(b => Number(b.price) || 0));
    if (minPrice === 0) return 'Đang cập nhật';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice) + '/tháng';
  };

  const title = `CS ${room?.branch?.branch_id}. ${room?.room_number}` || "Đang cập nhật";
  const availableBedsText = room ? `Trống ${room.available_beds} giường` : "Trống 2 giường";
  const genderText = room ? getGenderText(room.gender_policy) : "Phòng nam";
  const priceText = room ? getPriceText(room.beds) : "100.000.000 VNĐ/tháng";
  const locationText = room?.branch?.address || "Quận Tân Phú, TPHCM";

  return (
    <Link
      to="/room-detail"
      state={{ room }}
      className="w-full max-w-[17rem] shrink-0 flex flex-col rounded-2xl border border-LightOutline bg-white/30 shadow-sm transition-shadow hover:shadow-md be-vietnam-pro-light cursor-pointer block hover:scale-103 transition-transform"
    >
      <article className="relative w-full h-full flex flex-col p-2">
        <div className="relative h-38 w-full ">
          <img
            src={room?.room_images?.[0] || roomImage}
            alt={title}
            className="h-full w-full rounded-xl object-cover"
          />

          <div className={`absolute bottom-[1px] right-[1px] px-2 py-1 rounded-tl-xl rounded-br-xl text-text be-vietnam-pro-regular text-size-xs ring-[1px] ${room?.room_type?.name === 'Cao cấp' ? 'ring-primary text-primary bg-tirtiary' : 'ring-DarkOutline text-text bg-background'} shadow-[0_-4px_12px_-1px] shadow-black/25`}>
            {room?.room_type?.name || 'Tiêu chuẩn'}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-2 pb-2 pt-2">

          {/* Meta Row: Time & Icon */}
          <div className="flex items-center justify-between text">
            <span className="be-vietnam-pro-medium text-size-xs whitespace-nowrap">{availableBedsText}</span>
            <span className="text-size-xs text-text/50 whitespace-nowrap">Mới cập nhật</span>
          </div>

          {/* Title */}
          <h2 className="text-size-base font-semibold leading-tight text-text truncate" title={title}>
            {title}
          </h2>

          {/* Details List */}
          <ul className="mt-1 flex flex-col gap-2 text-size-small text-text">
            <li className="flex items-center gap-3">
              {/* Custom Bullet Point */}
              <span className="ml-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text" />
              <span>{genderText}</span>
            </li>

            <li className="flex items-center text-size-small gap-3">
              <span className="ml-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text" />
              <span>{priceText}</span>
            </li>

            {/* Location with custom Map Pin SVG */}
            <li className="mt-1 flex items-start gap-2 text-size-small justify-start">
              <img
                src={mapPinIcon}
                alt="Location"
                className="ml-0.75 h-3 w-3 shrink-0 mt-1"
              />
              <span className="line-clamp-2">{locationText}</span>
            </li>
          </ul>

        </div>
      </article>
    </Link>
  );
};

export default ItemCardS;