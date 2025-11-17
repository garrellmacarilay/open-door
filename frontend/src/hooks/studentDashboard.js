import api from "../utils/api"
import { useState, useEffect } from "react"

//student's appointmeents
export function useAppointments() {
    const [appointments, setAppointments] = useState([])

    const fetchAppointments = async () => {
        try {
            const res = await api.get('/my-bookings')
            if (res.data.success) {
                const converted = (res.data.data || []).map((a) => {
                    const d = new Date(a.consultation_date)
                    const localDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())

                    return {
                        ...a,
                        date: localDate,
                        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        office: a.office_name || a.office || '',
                        student: a.student_name || a.student || ''
                    }
                })

                setAppointments(converted)
            }
        } catch (err) {
            console.error('Failed to fetch appointments:', err)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])

    const upcomingAppointments = appointments
        .filter(a => a.date instanceof Date && a.date >= new Date())
        .sort((a,b) => a.date - b.date)
        .map(a => ({
            id: a.id,
            date: a.date,
            dateString: a.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            studentName: a.student_name,
            office: a.office_name,
            time: a.time
        }))

    return {appointments, upcomingAppointments, fetchAppointments}
}

//school events
export function useEvents() {
    const [events, setEvents] = useState([])

    const fetchEvents = async () => {
        try {
            const res = await api.get('/calendar/events')
            if (res.data.success) setEvents(res.data.data)
        } catch (err) {
            console.error('Failed to fetch events:', err)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return {events, fetchEvents}
}

export function useBooking() {
    const [offices, setOffices] = useState([])
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        office_id: '',
        service_type: '',
        date: '',
        time: '',
        concern_description: '',
        uploaded_file_url: '',
        group_members: '' 
    })

    const [showSuccessModal, setShowSuccessModal] = useState(false);


    useEffect(() => {
        api.get('/offices')
        .then(res => setOffices(res.data))
        .catch(err => console.error(err));
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        try {
            const formData = new FormData()

            const consultationDate = `${form.date}T${form.time}`    
            formData.append('consultation_date', consultationDate)

            Object.keys(form).forEach(key => {
                if (key === 'date' || key === 'time') return

                if (key === 'uploaded_file_url' && form[key] instanceof File) {
                    formData.append(key, form[key])
                } else {
                    formData.append(key, form[key])
                }
            })
            
            const response = await api.post('/bookings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            if (response.data.success) {
                setShowSuccessModal(true);
            }

            return { success: true }

        } catch (err) {
            if (err.response?.data?.errors) {
                console.error("Failed making booking", err)
                setErrors(err.response.data.errors)
            }
            return { success: false }
        }
    }

    return { form, setForm, errors, offices, showSuccessModal, setShowSuccessModal, handleSubmit }
}

export function useRecent() {
    const [recentBookings, setRecentBookings] = useState([])
    
    const fetchRecentBookings = async () => {
        try {
            const res = await api.get('/bookings/recent')
            if (res.data.success) setRecentBookings(res.data.bookings)
        } catch (err) {
            console.error('Failed to fetch recent booking', err)
        }
    }

    useEffect(() => {
        fetchRecentBookings()
    }, [])

    return { recentBookings, fetchRecentBookings}
}

export function useProfile () {
    
}



