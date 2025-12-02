import api from "../utils/api"
import { useState, useEffect, useMemo, useCallback } from "react"

//student's appointmeents
export function useCalendarAppointments() {
    const [calendarAppointments, setCalendarAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchCalendarAppointments = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get('/calendar/appointments')

            if (res.data.success) {
                setCalendarAppointments(res.data.data)
            } else {
                setError('Failed to fetch appointments')
            }
        } catch (err) {
            setError(err.message || 'Server error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCalendarAppointments()
    }, [])

    return { calendarAppointments, loading, error, refresh: fetchCalendarAppointments };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = useCallback(async (pageToLoad = 1) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await api.get(`/my-bookings?page=${pageToLoad}`);

      if (res.data.success) {
        const converted = (res.data.data || []).map((a) => {
          const rawDate = new Date(a.start);

          const phDate = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "long",
            day: "numeric",
          }).format(rawDate);

          const phTime = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Manila",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }).format(rawDate);

          // Convert Manila date for calendar comparisons
          const [monthName, dayWithComma, year] = phDate.replace(",", "").split(" ");
          const day = parseInt(dayWithComma);
          const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
          const localDate = new Date(parseInt(year), monthIndex, day);

          return {
            ...a,
            date: localDate,
            dateString: phDate,
            time: phTime,
            office: a.details?.office_name || a.office || "",
            student: a.details?.student_name || a.student || "",
          };
        });

        setAppointments(prev => {
          const merged = pageToLoad === 1 ? converted : [...prev, ...converted]; // ✅ RESET if page 1
          const unique = Array.from(new Map(merged.map(a => [a.id, a])).values()); // ✅ remove duplicates
          return unique;
        });

        // Pagination logic
        const meta = res.data.meta;
        setPage(meta.current_page < meta.last_page ? meta.current_page + 1 : meta.current_page);
        setHasMore(meta.current_page < meta.last_page);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, [loading]);

  // Load first page on mount
  useEffect(() => {
    fetchAppointments(1);
  }, []);

  // Infinite scroll loader
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchAppointments(page);
    }
  };

  // Prepare for calendar hover/upcoming list
  const upcomingAppointments = appointments
    .filter(a => a.date >= new Date(new Date().setHours(0,0,0,0))) // ✅ only future dates
    .sort((a, b) => a.date - b.date)
    .map((a) => ({
      id: a.id,
      date: a.date,
      dateString: a.dateString,
      studentName: a.student,
      office: a.office,
      time: a.time,
      status: a.details?.status,
      reference_code: a.details?.reference_code,
      attachedFile: a.details?.uploaded_file_url || null,
    }));

  return {
    appointments,
    upcomingAppointments,
    fetchAppointments: loadMore,
    refreshNow: () => fetchAppointments(1), // 🎯 call this if you want manual refresh trigger
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
                onSuccess?.();
                return { success: true }
            }

        } catch (err) {
            if (err.response && err.response.status === 422) {
                const validationErrors = err.response.data.errors;
                setErrors(validationErrors);
            } else {
                alert('Something went wrong. Please try again.');
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
    const [loading, setLoading] = useState(false)

    const fetchHistoryBookings = async () => {
        try {
            setLoading(true)
            const res = await api.get('/bookings/history')
            setBookings(res.data.bookings)
        }catch (err) {
            console.error(err)
            alert('Failed to fetch booking history')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHistoryBookings()
    }, [])

    return { bookings, fetchHistoryBookings, loading }
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



