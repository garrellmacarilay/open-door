import api from "../utils/api";
import { useState, useEffect, useContext, useCallback } from "react";

// Admin Dashboard

export function useAdminAppointments() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchAppointments = async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get('/calendar/appointments')

            if (res.data.success) {
                setAppointments(res.data.data)
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
        fetchAppointments()
    }, [])

    return { appointments, loading, error, refresh: fetchAppointments };
}

// In hooks/adminHooks.js

export function useAdminOfficeAppointments(currentDate) { // 1. Accept currentDate
    const [offices, setOffices] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({ today: 0, pending: 0, month: 0 });
    const [calendarAppointments, setCalendarAppointments] = useState([]);
    const [selectedOfficeId, setSelectedOfficeId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const mapBookingsToCalendar = (bookings) => {
        return bookings.map((booking) => ({
            studentName: booking.student_name,
            serviceType: booking.service_type,
            dateTime: booking.consultation_date,
            office: booking.office,
            start: booking.consultation_date,
            end: booking.consultation_date,
            color: "#6366F1",
        }));
    };

    const fetchOffices = async () => {
        try {
            const res = await api.get('/offices');
            setOffices(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // 2. Update fetchAppointments to use the date and office
    const fetchAppointments = async (officeId, date) => {
        setLoading(true);
        setError(null);
        try {
            // Calculate Month and Year from the calendar's current date
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // JS months are 0-indexed

            // Build Query: ?year=2023&month=12&office_id=1
            let query = `?year=${year}&month=${month}`;
            if (officeId) {
                query += `&office_id=${officeId}`;
            }

            // Call API with date filters
            const res = await api.get(`/admin/dashboard${query}`);

            if (res.data.success) {
                // Ensure backend returns ALL events for that month, not just "recent"
                setAppointments(res.data.recent_bookings); 
                setCalendarAppointments(mapBookingsToCalendar(res.data.calendar_bookings));
                setStats(res.data.stats);
            } else {
                setError("Failed to fetch appointments");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Server error");
        } finally {
            setLoading(false);
        }
    };

    // Initialize Offices only once
    useEffect(() => {
        fetchOffices();
    }, []);

    // 3. Trigger Fetch when currentDate OR selectedOfficeId changes
    useEffect(() => {
        if (currentDate) {
            fetchAppointments(selectedOfficeId, currentDate);
        }
    }, [currentDate, selectedOfficeId]);

    const handleOfficeChange = (officeId) => {
        setSelectedOfficeId(officeId);
        // The useEffect above will catch this change and trigger the fetch automatically
    };

    return {
        offices,
        appointments,
        stats,
        calendarAppointments,
        selectedOfficeId,
        loading,
        error,
        handleOfficeChange,
        refresh: () => fetchAppointments(selectedOfficeId, currentDate),
    };
}

export function useUpdateAppointmentStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateStatus = useCallback(async (id, status) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await api.patch(`/bookings/status/${id}`, { status });

      if (res.data.success) {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, success, updateStatus };
}


//Office Management
export function useAdminOffices() {
    const [offices, setOffices] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOffices = async () => {
        try {
            setLoading(true)
            const res = await api.get('/admin/offices')
            setOffices(res.data.offices || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch offices");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOffices()
    }, [])

    return { offices, loading, error, refetch: fetchOffices }
}

export function useCreateOffice() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const createOffice = async (data) => {
        try {
            setError(null)
            setLoading(true)

            const res = await api.post('/admin/office/create', data)

            if (res.data.success) {
                return res.data.office
            }

            setError('Failed to create office')
            return null

        } catch (err) {
            setError(err.message || "Server error");
            return null;
        } finally {
            setLoading(false)
        }
    }

    return { createOffice, loading, error }
}


export function useUpdateOffice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOffice = async (id, data) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.patch(`/admin/office/update/${id}`, data);

      if (res.data.success) {
        return res.data.office
      }
      setError("Failed to update office");
      return null;

    } catch (err) {
      setError(err.message || "Server error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateOffice, loading, error };
}



export function useDeleteOffice() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOffice = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.delete(`/admin/office/delete/${id}`);
      return res.data.success
    
    } catch (err) {
      setError(err.message || "Server error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteOffice, loading, error };
}


//Consultation Summary
export function useAdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('All')
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null);

  const [searchTimeout, setSearchTimeout] = useState(true)

  const fetchBookings = useCallback(async (query = "", statusValue = "") => {
    setLoading(true);
    setError(null);

    try {        
      const url = `/admin/bookings?search=${query}${statusValue ? `&status=${statusValue}` : ""}`;
      const res = await api.get(url);

      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        setError("Failed to fetch bookings");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(); // initial load
  }, [fetchBookings]);

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)

    if (searchTimeout) clearTimeout(searchTimeout)

    const timer = setTimeout(() => {
        fetchBookings(value, status)
    }, 300)

    setSearchTimeout(timer)
  }

  const handleStatusChange = (e) => {
    const value = e.target.value
    setStatus(value)

    fetchBookings(search, value);
  }

  return { bookings, search, status, setStatus, loading, error, fetchBookings, handleSearchChange, handleStatusChange };
}



//Analytics

export function useConsultationStats() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchStats = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get('/admin/analytics/stats')
            setStats(res.data.stats)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    return { stats, loading, error, fetchStats }
}

export function useConsultationTrends() {
    const [trends, setTrends] = useState({ labels: [], values: [] });
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchTrends = useCallback(async () => {
        setLoading(true)
        try {
            const res = await api.get('/admin/analytics/trends')
            
            if (res.data.success) {
                setTrends({
                    labels: res.data.trends.labels,
                    values: res.data.trends.values
                })
            } else {
                setError("Failed to fetch trends")
            }
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    })

    useEffect(() => {
        fetchTrends()
    }, [])

    return { trends, loading, error, fetchTrends }
}

export function useServiceDistribution() {
    const [distribution, setDistribution] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchDistribution = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get('/admin/analytics/distribution')
            setDistribution(res.data.distribution)
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDistribution()
    }, [fetchDistribution])

    return { distribution, loading, error, fetchDistribution }
}

export function useGenerateReport() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const generateReport = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const res = await api.get('/admin/analytics/generate-report',{
                responseType: 'blob'
            })

            const url = window.URL.createObjectURL(new Blob([res.data], {type: 'application/pdf'}))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `consultation_report_${new Date().getMonth()}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false)
        }
    }, [])

    return { generateReport, loading, error };
}