import axios from 'axios';

const token = '75|Cdw2anqXQz5g1DAXNnwzTIKtBKaEkw93XUF9lZYsf84079f6'; // get this from login/session

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // your API URL
  headers: {
    Authorization: `Bearer ${token}`, // or whatever your backend expects
  },
});

async function testAppointments() {
  try {
    const res = await api.get('/my-bookings');
    console.log("Appointments response:", res.data);
  } catch (err) {
    console.error("Failed to fetch appointments:", err.message);
  }
}

async function testEvents() {
  try {
    const res = await api.get('/calendar/events');
    console.log("Events response:", res.data);
  } catch (err) {
    console.error("Failed to fetch events:", err.message);
  }
}

async function main() {
  await testAppointments();
  await testEvents();
}

main();
