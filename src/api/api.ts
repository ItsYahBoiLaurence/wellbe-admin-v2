import axios from 'axios'

// API base URL from environment variables
const BASE_URL = 'http://159.65.250.197:3000/'

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("CLIENT_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error)
    }
)

export default api