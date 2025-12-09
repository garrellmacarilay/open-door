import { useEffect, useState } from "react";
import api from "../utils/api";

export function useCreateEvent() {
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false); // Added loading state (optional but recommended)
    
    const [form, setForm] = useState({
        event_title: '',
        description: '',
        event_date: '',
        event_time: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(null);

        try {
            const res = await api.post('/create/event', form);

            if (res.data.success) {
                setForm({ event_title: '', description: '', event_date: '', event_time: '' });
                return { success: true, data: res.data.data };
            }
            return { success: false }; // Handle case where success is false but no error thrown

        } catch (err) { 
            if (err.response) {
                setErrors(err.response.data.errors || 'Something went wrong');
            } else {
                setErrors('Network error');
            }
            return { success: false }; // IMPORTANT: Return false so component knows to stop
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Added Logic and Return values
    const handleDelete = async (eventId) => {
        setLoading(true);
        try {
            const res = await api.delete(`/delete/event/${eventId}`);
            
            if (res.data.success) {
                return { success: true };
            }
            return { success: false };

        } catch (err) {
            console.error("Delete error:", err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    // FIXED: Added handleDelete and loading to the return object
    return { 
        form, 
        setForm, 
        handleSubmit, 
        handleDelete, 
        errors,
        setErrors,
        loading 
    };
}