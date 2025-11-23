import api from "../utils/api"
import { useState, useEffect, useMemo, useCallback } from "react"

//student's appointmeents
export function useAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    // Stable function: depends only on hasMore & loading
    const fetchAppointments = useCallback(async (pageToLoad) => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const res = await api.get(`/my-bookings?page=${pageToLoad}`);

            if (res.data.success) {
                const converted = (res.data.data || []).map((a) => {
                    const d = new Date(a.start);
                    // normalize to a date object at local midnight for calendar comparisons
                    const localDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

                    return {
                        ...a,
                        date: localDate,
                        dateString: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                        time: d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
                        office: a.details?.office_name || a.office || "",
                        student: a.details?.student_name || a.student || "",
                    };
                });

                setAppointments(prev => {
                    const merged = [...prev, ...converted];
                    const unique = Array.from(new Map(merged.map(a => [a.id, a])).values());
                    return unique;
                });

                const meta = res.data.meta;

                // Stop loading if last page is reached
                if (meta.current_page >= meta.last_page) {
                    setHasMore(false);
                } else {
                    // Only increment page after successful load
                    setPage((prev) => prev + 1);
                }
            }
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
        }

        setLoading(false);
    }, [hasMore, loading]);


    // Load first page ONCE on mount
    useEffect(() => {
        fetchAppointments(1);
    }, []);


    // Optional: Call this to load more pages (e.g., infinite scroll)
    const loadMore = () => {
        if (!loading && hasMore) {
            fetchAppointments(page);
        }
    };


    // For calendar hover
    const upcomingAppointments = appointments
        .map(a => ({
            ...a,
            // ensure we have a Date object
            _dateObj: a.date instanceof Date ? a.date : new Date(a.date)
        }))
        .filter(a => a._dateObj >= new Date(new Date().setHours(0,0,0,0)))
        .sort((a, b) => a._dateObj - b._dateObj)
        .map((a) => ({
            id: a.id,
            date: a._dateObj,
            dateString: a.dateString || a._dateObj.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            }),
            studentName: a.student || a.studentName || a.student_name,
            office: a.office || a.office_name,
            time: a.time,
        }));


    return {
        appointments,
        upcomingAppointments,
        fetchAppointments: loadMore, // expose as loadMore
        hasMore,
        loading,
    };
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

export function useBooking(e, onSuccess) {
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
                return { success: true }
            }

        } catch (err) {
            if (err.response?.data?.errors) {
                console.error("Failed making booking", err)
                setErrors(err.response.data.errors)
            }
            return { success: false }
        }
    }

    return { form, setForm, errors, offices, handleSubmit }
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

export function useHistory() {
    const [bookings, setBookings] = useState([])

    const fetchHistoryBookings = async () => {
        try {
            const res = await api.get('/bookings/history')
            setBookings(res.data.bookings)
        }catch (err) {
            console.error(err)
            alert('Failed to fetch booking history')
        }
    }

    useEffect(() => {
        fetchHistoryBookings()
    }, [])

    return { bookings, fetchHistoryBookings }
}


export function useProfile() {
  const [user, setUser] = useState({});
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // File
  const [preview, setPreview] = useState(null); // Full URL
  const [profileImageUrl, setProfileImageUrl] = useState(null); // Full URL
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get('/show/user');
      setUser(res.data.user);
      setFullName(res.data.user.full_name);

            // Build image URL using API origin (strip any `/api` path). Fallback to window.location.origin.
            const apiBase = api?.defaults?.baseURL || window.location.origin;
            let base;
            try {
                base = new URL(apiBase).origin;
            } catch (e) {
                base = (apiBase || '').replace(/\/api\/?$/, '').replace(/\/$/, '') || window.location.origin;
            }

            const url = res.data.user.profile_picture
                ? `${base}/storage/${res.data.user.profile_picture}`
                : null;

            setPreview(url);
            setProfileImageUrl(url);
    };
    fetchUser();
  }, []);

  const setProfileAndPreview = (file) => {
    setProfilePicture(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result); // immediate preview
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('full_name', fullName);
    if (profilePicture) formData.append('profile_picture', profilePicture);

    try {
      const res = await api.post('/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
                // Build final image URL using API origin (strip any `/api` path). Fallback to window.location.origin.
                const apiBase = api?.defaults?.baseURL || window.location.origin;
                let base;
                try {
                    base = new URL(apiBase).origin;
                } catch (e) {
                    base = (apiBase || '').replace(/\/api\/?$/, '').replace(/\/$/, '') || window.location.origin;
                }
                const url = res.data.user.profile_picture
                    ? `${base}/storage/${res.data.user.profile_picture}`
                    : null;

                setPreview(url); // set final server URL
        setProfileImageUrl(url);
        setUser(res.data.user);
        setProfilePicture(null);
      }
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        setMessage(Object.values(errors).flat().join(' | '));
      } else {
        setMessage('Profile update failed. Please try again.');
      }
    }
  };

  return {
    user,
    fullName,
    setFullName,
        setProfilePicture,
    profileImageUrl,
    setProfileAndPreview, // use this to handle file selection
    preview,
    message,
    handleSubmit
  };
}


export function useFeedback(booking) {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        // allow calling with or without an event (parent may handle preventDefault)
        if (e && typeof e.preventDefault === 'function') e.preventDefault();

        if (!booking) {
            console.error("No booking passed to useFeedback");
            return { success: false, message: 'No booking provided' };
        }

        try {
            const res = await api.post('/feedback/store', {
                booking_id: booking.id,
                student_id: booking.student_id,
                office_id: booking.office_id,
                rating,
                comment
            });

            if (res.data.success) {
                // keep rating/comment in hook state — parent can read them after this resolves
                return res.data;
            }
            return res.data || { success: false };
        } catch (err) {
            console.error('Failed to submit feedback', err);
            throw err;
        }
    };

    return {
        rating,
        comment,
        setRating,
        setComment,
        handleSubmit
    };
}



export function useReschedule() {
    const [isRescheduling, setIsRescheduling] = useState(false);

    const rescheduleBooking = async (id, newDateTime, newFile = null) => {
            if (!(typeof newDateTime === 'string')) {
                throw new Error("newDateTime must be a string in YYYY-MM-DDTHH:mm format");
            }
        const formData = new FormData();
        formData.append('consultation_date', newDateTime);

        if (newFile) {
            formData.append('uploaded_file_url', newFile);
        }

        formData.append('_method', 'PATCH');

        try {
            const res = await api.post(`/reschedule/booking/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log('Rescheduled Successfully')
            return res.data;
        } catch (err) {
            console.error("Reschedule failed:", err.response?.data || err);
            throw err;
        } finally {
            setIsRescheduling(false);
        }
    };

    return { isRescheduling, rescheduleBooking };
}

export function useCancel() {
    const [isCancelling, setIsCancelling] = useState(false)

    const cancelBooking = async (id) => {
        setIsCancelling(true)

        try {
            const res = await api.patch(`/cancel/booking/${id}`)
            console.log('Cancelled successfully', res.data)
            return res.data
        } catch (err) {
            console.error('Cancel failed:', err)
        } finally {
            setIsCancelling(false)
        }
    }

    return { isCancelling, cancelBooking}
}



