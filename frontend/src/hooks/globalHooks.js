import api from "../utils/api";
import { useState, useEffect, useCallback, useRef } from "react";

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

export function useNotifications(pollInterval = 30000) { 
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // ✅ NEW: Track IDs that are currently being updated
  const pendingUpdates = useRef(new Set()); 
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const fetchNotifications = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    
    try {
      const res = await api.get('/notifications');

      if (isMounted.current && res.data.success) {
        const serverNotifs = res.data.notifications;

        // ✅ THE FIX: Merge Server Data with Local Pending Updates
        // If an ID is in 'pendingUpdates', force it to remain 'read' locally
        // even if the server says it's unread (because the server is lagging).
        const mergedNotifications = serverNotifs.map(n => {
            if (pendingUpdates.current.has(n.id)) {
                return { ...n, read_at: n.read_at || new Date().toISOString() };
            }
            return n;
        });

        setNotifications(mergedNotifications);
        
        // Recalculate unread count based on the merged data
        const unread = mergedNotifications.filter(n => n.read_at === null).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (isMounted.current && !isBackground) setLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id) => {
    // 1. Lock this ID so polling doesn't overwrite it
    pendingUpdates.current.add(id);

    // 2. Optimistic Update (Instant UI change)
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      // 3. Send to API
      await api.patch(`/notifications/${id}/read`);
      
      // 4. Update finished - we can now trust the server again.
      // We keep it in the set for just a moment longer to ensure the next poll catches the DB update
      setTimeout(() => {
          pendingUpdates.current.delete(id);
      }, 2000); 

    } catch (err) {
      console.error("Failed to mark read", err);
      // On error, release the lock and re-fetch to revert to actual server state
      pendingUpdates.current.delete(id);
      fetchNotifications(true);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications(); 
    if (pollInterval > 0) {
      const interval = setInterval(() => {
        fetchNotifications(true); 
      }, pollInterval);
      return () => clearInterval(interval);
    }
  }, [fetchNotifications, pollInterval]);

  return { notifications, unreadCount, loading, fetchNotifications, markAsRead };
}