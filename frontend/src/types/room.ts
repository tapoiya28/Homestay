export type RoomData = {
  room_id: number;
  status: string;
  gender_policy: 'Male' | 'Female' | 'Mixed';
  area: string | null;
  total_beds: number;
  room_description: string | null;
  available_beds: number;
  room_type: { room_type_id: number; name: string } | null;
  branch_id: number | null;
  room_number: number | null;
  room_images: string[] | null;
  branch: { branch_id: number; address: string, phone_number: string, email: string } | null;
  beds: { bed_id: number; status: string; price: number }[];
}