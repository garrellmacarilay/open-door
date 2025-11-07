import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import api from "../utils/api";

export default function AdminCalendar({ appointments }) {
    const [selectedOfficeId, setSelectedOfficeId] = useState("");
    const [calendarAppointments, setCalendarAppointments] = useState(appointments || []);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const res = await api.get('/offices')
                setOffices(res.data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOffices()
    }, [])

    useEffect(() => {
        if (appointments) {
            setCalendarAppointments(
                appointments.map((booking) => ({
                    title: booking.service_type,
                    start: booking.consultation_date,
                    end: booking.consultation_date,
                    color: "#6366F1"
                }))
            )
        }
    }, [appointments]);
    
    const handleOfficeChange = async (e) => {
        const officeId  = e.target.value;
        setSelectedOfficeId(officeId)

        try {
            const res = await api.get(`/admin/dashboard${officeId ? `?office_id=${officeId}` : ""}`)
            if (res.data.success) {
                setCalendarAppointments(
                    res.data.recent_bookings.map((booking) => ({
                        title: booking.service_type,
                        start: booking.consultation_date,
                        end: booking.consultation_date,
                        color: "#6366F1"
                    })))
            }
        }catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col bg-white rounded shadow p-4 overflow-auto">
        {/* Office filter */}
        <div className="mb-4">
            <select
            value={selectedOfficeId}
            onChange={handleOfficeChange}
            className="border rounded px-3 py-2 w-full md:w-64"
            >
            <option value="">All Offices</option>
            {offices.map((office) => (
                <option key={office.id} value={office.id}>
                {office.office_name}
                </option>
            ))}
            </select>
        </div>

        {/* Calendar */}
        {loading ? (
            <p className="text-center text-gray-500 mt-4">Loading calendar...</p>
        ) : (
            <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            height="auto"
            events={calendarAppointments}
            timeZone="Asia/Manila"
            />
        )}
        </div>
    );
}
