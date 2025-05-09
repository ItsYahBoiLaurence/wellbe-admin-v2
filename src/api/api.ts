import axios from 'axios'
import queryClient from '../queryClient'
import { signOut } from 'firebase/auth'
import { auth } from "../api/firebaseConfig";

// API base URL from environment variables
const BASE_URL = 'http://localhost:8000/'

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


// api.interceptors.response.use(
//     response => response,
//     error => {
//         if (error.response && error.response.status === 401) {
//             console.log(`Session Expired. Please Login again.`)
//             queryClient.clear()
//             localStorage.clear()
//             handleLogout()
//         }
//         return Promise.reject(error)
//     }
// )

export default api