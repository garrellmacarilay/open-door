import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    
    if(token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            
            localStorage.setItem("SessionExpired", "true")

            window.dispatchEvent(new Event("token-expired"))
        }
        return Promise.reject(error);
    }
);

export default api