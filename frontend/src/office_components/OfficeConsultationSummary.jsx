import { useState, useEffect, use } from 'react';
import api from '../utils/api'
import BookingTable from '../components/BookingTable';

export default function OfficeConsultationSummary() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    const [searchTimeout, setSearchTimeout] = useState(null);

    const fetchBookings = async (query = "") => {
        try {
            const res = await api.get(`/office/bookings?search=${query}`)
            if (res.data.success) {
                setBookings(res.data.bookings)
                console.log("Data for consultation summary", res.data)
            }
        } catch (err) {
            console.error('Failed to fetch bookings:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        if (searchTimeout) clearTimeout(searchTimeout) 

        const timer = setTimeout(() => {
            fetchBookings(value);
        }, 300) //wait for .3 seconds

        setSearchTimeout(timer);
    }
    return (
        <div className='p-6 bg-white rounded-md shadow'>
            <h2 className="text-xl font-bold mb-4">Consultation Summary</h2>
            <input 
                type="text" 
                placeholder='Search by student, office and services' 
                value={search}
                className="border p-2 rounded w-full mb-4"
                onChange={handleSearchChange}
            />

            <BookingTable bookings={bookings} loading={loading} />
        </div>
    )
}