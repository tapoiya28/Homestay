import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface Appointment {
    appointment_id: number;
    appointment_time: string;
    status: string;
    confirmation_status: string;
    room: {
        room_id: number;
        room_number: number;
        area: string;
        room_images: string[];
        branch: { name: string; address: string };
    } | null;
    tenant: { tenant_id: number; name: string; phone: string } | null;
    employee: { employee_id: number; name: string } | null;
}

interface MeetUpProps {
    appointment: Appointment;
    onDeleted: (id: number) => void;
    onUpdated: (updated: Appointment) => void;
}

// Keys phải khớp với giá trị lưu trong DB (tiếng Anh)
const statusColor: Record<string, string> = {
    'Confirmed': 'bg-green-100 text-green-700 border-green-300',
    'Unconfirmed': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Pending Confirmation': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    'Cancelled': 'bg-red-100 text-red-600 border-red-300',
};

// Nhãn hiển thị tiếng Việt
const statusLabel: Record<string, string> = {
    'Confirmed': 'Đã xác nhận',
    'Unconfirmed': 'Chưa xác nhận',
    'Pending Confirmation': 'Chờ xác nhận',
    'Cancelled': 'Đã hủy',
};


// Format datetime-local value from ISO string
const toDatetimeLocal = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const MeetUp = ({ appointment, onDeleted, onUpdated }: MeetUpProps) => {
    const { room, tenant, appointment_time, confirmation_status, status, appointment_id } = appointment;

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Edit state
    const [editTime, setEditTime] = useState(toDatetimeLocal(appointment_time));

    // Format for display
    const date = new Date(appointment_time);
    const timeStr = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const displayStatus = confirmation_status || status;
    const colorClass = statusColor[displayStatus] || 'bg-gray-100 text-gray-600 border-gray-300';
    const roomImage = room?.room_images?.[0];
    const isPending = displayStatus !== 'Confirmed' && displayStatus !== 'Cancelled';

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc muốn hủy lịch hẹn này không?")) return;
        try {
            setDeleting(true);
            await axios.delete(`${API}/appointment/${appointment_id}`);
            onDeleted(appointment_id);
        } catch {
            alert("Không thể hủy lịch hẹn. Vui lòng thử lại.");
        } finally {
            setDeleting(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { data } = await axios.put(`${API}/appointment/${appointment_id}`, {
                appointment_time: new Date(editTime).toISOString(),
            });
            // Re-fetch merged data by crafting updated object
            onUpdated({ ...appointment, appointment_time: new Date(editTime).toISOString() });
            setIsEditing(false);
        } catch {
            alert("Không thể lưu thay đổi. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditTime(toDatetimeLocal(appointment_time));
        setIsEditing(false);
    };

    return (
        <section className="flex flex-col md:flex-row gap-4 p-4 w-full border border-LightOutline bg-white rounded-xl hover:shadow-sm transition-shadow">
            {/* Room image */}
            {roomImage ? (
                <img
                    src={roomImage}
                    className="w-full md:w-[10rem] h-[7.5rem] object-cover rounded-lg flex-shrink-0"
                    alt={`Phòng ${room?.room_number}`}
                />
            ) : (
                <div className="w-full md:w-[10rem] h-[7.5rem] rounded-lg flex-shrink-0 bg-LightOutline/40 flex items-center justify-center text-DarkOutline text-size-small">
                    Không có ảnh
                </div>
            )}

            {/* Info / Edit area */}
            <div className="be-vietnam-pro-light flex flex-col gap-2 justify-center flex-1">
                {isEditing ? (
                    /* ── EDIT MODE ── */
                    <>
                        {/* Datetime input */}
                        <input
                            type="datetime-local"
                            value={editTime}
                            onChange={e => setEditTime(e.target.value)}
                            className="border border-LightOutline rounded-md px-3 py-1.5 text-size-base w-fit outline-none focus:ring-1 focus:ring-primary"
                        />

                        {/* Room info (read-only in edit mode, can extend later) */}
                        <p className="text-size-small text-DarkOutline">
                            {room
                                ? `${room.branch?.name} · Phòng ${room.room_number} · ${room.area}`
                                : 'Phòng không xác định'}
                        </p>

                        {/* Edit action buttons */}
                        <div className="flex gap-3 mt-1">
                            <button
                                onClick={handleCancelEdit}
                                className="w-fit rounded-md border-2 border-red-400 text-red-500 text-size-small whitespace-nowrap px-4 py-1 transition-colors hover:bg-red-500 hover:text-white hover:cursor-pointer"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-fit rounded-md border-2 border-green-600 text-green-700 text-size-small whitespace-nowrap px-4 py-1 transition-colors hover:bg-green-600 hover:text-white hover:cursor-pointer disabled:opacity-50"
                            >
                                {saving ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </>
                ) : (
                    /* ── VIEW MODE ── */
                    <>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-size-large be-vietnam-pro-medium">
                                {timeStr} – {dateStr}
                            </h2>
                            <span className={`text-size-small border rounded-full px-2 py-0.5 ${colorClass}`}>
                                {displayStatus}
                            </span>
                        </div>

                        <p className="text-size-base text-DarkOutline">
                            {room
                                ? `${room.branch?.name} – Phòng ${room.room_number} · ${room.area}`
                                : 'Phòng không xác định'}
                        </p>


                        {isPending && (
                            <div className="flex gap-3 mt-1">
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="w-fit rounded-md border-2 border-red-400 text-red-500 text-size-small whitespace-nowrap px-4 py-1 transition-colors hover:bg-red-500 hover:text-white hover:cursor-pointer disabled:opacity-50"
                                >
                                    {deleting ? "Đang hủy..." : "Hủy lịch hẹn"}
                                </button>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-fit rounded-md border-2 border-primary text-primary text-size-small whitespace-nowrap px-4 py-1 transition-colors hover:bg-primary hover:text-white hover:cursor-pointer"
                                >
                                    Chỉnh sửa
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default MeetUp;