import React, { useState } from 'react';
import api from '../utils/api.js'
import axios from 'axios';

export default function BookConsultationModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    service_type: '',
    consultation_date: '',
    concern_description: '',
    uploaded_file_url: ''
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bookings', form);
      alert('Consultation booked successfully!');
      window.location.href = '/dashboard'
    } catch (err) {
      console.error(err);
      alert('Failed to book consultation.');
    }
  };

  // ✅ Keep it mounted but hidden when closed
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center transition-all duration-200 ${
        isOpen ? 'visible bg-black/50 opacity-100' : 'invisible opacity-0'
      }`}
    >
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Book a Consultation</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="block text-sm"></label>
            <label className="block text-sm">Service Type</label>
            <select
              value={form.service_type}
              onChange={(e) => setForm({ ...form, service_type: e.target.value })}
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select...</option>
              <option value="Consultation">Consultation</option>
              <option value="Therapy">Therapy</option>
              <option value="Assessment">Assessment</option>
              <option value="Advisory">Advisory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Consultation Date</label>
            <input
              type="datetime-local"
              value={form.consultation_date}
              onChange={(e) => setForm({ ...form, consultation_date: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm">Concern Description</label>
            <textarea
              value={form.concern_description}
              onChange={(e) => setForm({ ...form, concern_description: e.target.value })}
              className="border p-2 w-full rounded"
              required
            />
          </div>

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
