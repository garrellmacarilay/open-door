import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

export function useDashboardAppointments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/office/dashboard");

      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, appointments, fetchDashboard };
}


export function useShowBooking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  const fetchBooking = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(`office/bookings/${id}`);

      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, booking, fetchBooking };
}

export function useConsultationSummary() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [consultations, setConsultations] = useState([]);

  const fetchSummary = useCallback(async (search = "") => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get("/office/bookings", {
        params: { search }
      });

      if (res.data.success) {
        setConsultations(res.data.bookings);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load consultation summary");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ADDED setConsultations to the return object
  return { 
    loading, 
    error, 
    consultations, 
    setConsultations, // <--- This allows you to update the list manually
    fetchSummary 
  };
}


