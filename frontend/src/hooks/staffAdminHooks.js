import { useEffect, useState } from "react";
import api from "../utils/api";

export function useCreateEvent() {
    const [errors, setErrors] = useState(null)
    const [form, setForm] = useState({
        event_title: '',
        description: '',
        event_date: '',
        event_time: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const res = await api.post('/create/event', form)

            if (res.data.success) {
                setForm({ event_title: '', description: '', event_date: '', event_time: '' })
                setErrors(null)
                return { success: true}
            }
            
        } catch (err) { 
            if (err.response) {
                setErrors(err.response.data.errors || 'Something went wrong')
            } else {
                setErrors('Network error')
            }
        }
    }

    const handleDelete = async (eventId) => {
        try {
            const res = await api.delete(`/delete/event/${eventId}`)


        } catch (err) {

        }
    }

    return { form, setForm, handleSubmit, errors }
}
