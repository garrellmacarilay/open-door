import React, { useEffect, useState } from 'react';
import api from '../utils/api.js'
import axios from 'axios';

export default function AdminEvents({ isOpen, onClose, eventData }) {
  const [form, setForm] = useState({
    event_title: '',
    description: '',
    event_date: '',
    event_time: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (eventData) {
      setForm({
        event_title: eventData.event_title || '',
        description: eventData.description || '',
        event_date: eventData.event_date || '',
        event_time: eventData.event_time || '',
      })
    } else {
      setForm({
        event_title: "",
        description: "",
        event_date: "",
        event_time: "",
      })
    }
  }, [eventData])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.event_title || !form.description || !form.event_date || !form.event_time) {
      alert('All fields are required');
      return;
    }

    let eventTime = form.event_time;
    if (eventTime.length > 5) eventTime = eventTime.slice(0,5);

    const payload = {
      event_title: form.event_title,
      description: form.description,
      event_date: form.event_date,
      event_time: eventTime
    };

    try {
      if (eventData) {
        //Update
        await api.put(`/admin/events/${eventData.id}`, payload)
        alert('Event updated successfully')
      } else {
        //Create
        await api.post('/admin/events', payload)
        alert('Event created successfully')
      }

      onClose()
      window.location.reload()
    } catch (err) {
      console.error('Validation errors:', err.response?.data);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    }
  };
  

  // ✅ Keep it mounted but hidden when closed
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200
        ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      style={{ backdropFilter: isOpen ? 'blur(4px)' : 'none' }}
    >
      {/* Modal card */}
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg z-10">
        <h2 className="text-xl font-semibold mb-4">{eventData ? "Edit Event" : "Create Event"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Group Members */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={form.event_title}
              onChange={(e) => setForm({ ...form, event_title: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Event Date</label>
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Time</label>
            <input
              type="time"
              value={form.event_time}
              onChange={(e) => setForm({ ...form, event_time: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

  );
}
