import api from "../utils/api";
import { useState, useEffect,  } from "react";

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

            // Prefer the backend-provided `profile_picture_url` when available
            const url = res.data.user.profile_picture_url
                || (res.data.user.profile_picture ? `${base}/storage/${res.data.user.profile_picture}` : null);

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
                const url = res.data.user.profile_picture_url
                    || (res.data.user.profile_picture ? `${base}/storage/${res.data.user.profile_picture}` : null);

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