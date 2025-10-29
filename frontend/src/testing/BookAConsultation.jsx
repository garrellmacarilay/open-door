import React, { useEffect, useState } from 'react';
import api from '../utils/api.js'
import axios from 'axios';

export default function BookConsultationModal({ isOpen, onClose }) {
  const [offices, setOffices] = useState([]);
  const [form, setForm] = useState({
    office_id: '',
    service_type: '',
    consultation_date: '',
    concern_description: '',
    uploaded_file_url: null,
    group_members: ''
  });

  const [errors, setErrors] = useState({});


  useEffect(() => {
    api.get('/offices')
    .then(res => setOffices(res.data))
    .catch(err => console.error(err));
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const formData = new FormData();

        formData.append('office_id', form.office_id)
        
        formData.append('service_type', form.service_type);
        formData.append('consultation_date', form.consultation_date)
        formData.append('concern_description', form.concern_description)
        formData.append('group_members', form.group_members)

        if (form.uploaded_file_url instanceof File){
          formData.append('uploaded_file_url', form.uploaded_file_url)
        }

        await api.post('/bookings', formData, {
          headers: { 'Content-Type': 'multipart/form-data'}
      });


      alert('Consultation booked successfully!');
      window.location.href = '/dashboard'
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert (err.response?.data?.message || 'Failed to book consultation. ');
      }
    }
  };
  

  // ✅ Keep it mounted but hidden when closed
  return (
    <div
      className={`transition-all duration-200 ${isOpen ? 'block' : 'hidden'}`}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Book a Consultation</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-sm font-medium mb-1">Office</label>
            <select 
              value={form.office_id}
              onChange={(e) => setForm({ ...form, office_id: e.target.value})}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
              disabled={offices.length === 0}
            >
              <option value="">Select Office</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>
                  {office.office_name}
                </option>
              ))}

            </select>
            {errors.office && (
              <p className="text-red-500 text-sm">{errors.office_id[0]}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Type</label>
            <select
              value={form.service_type}
              onChange={(e) => setForm({ ...form, service_type: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="datetime-local"
              value={form.consultation_date}
              onChange={(e) => setForm({ ...form, consultation_date: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
            />
            {errors.consultation_date && (  
              <p className="text-red-500 text-sm">{errors.consultation_date[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <textarea
              value={form.concern_description}
              onChange={(e) => setForm({ ...form, concern_description: e.target.value })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Group Members (optional)</label>
            <input 
              type="text" 
              value={form.group_members}
              onChange={(e) => setForm({ ...form, group_members: e.target.value})}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Attachment (optional)</label>
            <input 
              type="file"
              onChange={(e) => setForm({ ...form, uploaded_file_url: e.target.files[0] })}
              className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400" 
            />
            {errors.uploaded_file_url && (
              <p className="text-red-500 text-sm">{errors.uploaded_file_url[0]}</p>
            )}
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
