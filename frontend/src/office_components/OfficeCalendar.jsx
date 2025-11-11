import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid'

export default function OfficeCalendar({ appointments, onSelect }) {
    return (
        <div className="bg-white shadow rounded-lg p-4">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={appointments.map((item) => ({
                    id: item.id,
                    title: item.title,
                    date: item.start,
                    color: item.color
                }))}
                height="auto" 
            />
        </div>
    )
}