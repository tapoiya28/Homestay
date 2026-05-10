import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MeetUp, { type Appointment } from "@/components/MeetUp";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const MeetUpList = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useAuth();

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            if (!token) { navigate("/login"); return; }

            // Debug: decode token payload (không verify — chỉ để xem)
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('[MeetUpList] token payload:', payload);

            const { data } = await axios.get(`${API}/appointment`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(data.data || []);
        } catch (err: any) {
            if (err.response?.status === 401) navigate("/login");
            else setError("Không thể tải danh sách lịch hẹn.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleDeleted = (id: number) => {
        setAppointments(prev => prev.filter(a => a.appointment_id !== id));
    };

    const handleUpdated = (updated: Appointment) => {
        setAppointments(prev => prev.map(a => a.appointment_id === updated.appointment_id ? updated : a));
    };

    return (
        <section className="flex flex-col w-full h-fit gap-4 items-center border border-LightOutline rounded-2xl p-5 bg-background">
            <div className="flex w-full items-center justify-between">
                <p className="text-size-large be-vietnam-pro-medium">Danh sách lịch hẹn</p>
                <span className="text-size-small text-DarkOutline be-vietnam-pro-light">
                    {!loading && `${appointments.length} lịch hẹn`}
                </span>
            </div>

            {loading && (
                <div className="flex flex-col gap-3 w-full">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-full h-[8rem] rounded-lg bg-LightOutline/40 animate-pulse" />
                    ))}
                </div>
            )}

            {!loading && error && (
                <div className="w-full text-center py-10 text-red-500 be-vietnam-pro-light">
                    {error}
                    <button onClick={fetchAppointments} className="ml-2 underline hover:text-red-700">
                        Thử lại
                    </button>
                </div>
            )}

            {!loading && !error && appointments.length === 0 && (
                <div className="w-full text-center py-10 text-DarkOutline be-vietnam-pro-light">
                    Chưa có lịch hẹn nào.
                </div>
            )}

            {!loading && !error && appointments.map(appt => (
                <MeetUp
                    key={appt.appointment_id}
                    appointment={appt}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                />
            ))}
        </section>
    );
};

export default MeetUpList;