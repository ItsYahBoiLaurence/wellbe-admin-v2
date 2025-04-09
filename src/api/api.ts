import axios from 'axios'
import queryClient from '../queryClient'
import { signOut } from 'firebase/auth'
import { auth } from "../api/firebaseConfig";

// API base URL from environment variables
const BASE_URL = 'https://wellbe-staging-employee-qiwsg.ondigitalocean.app/'

const api = axios.create({
    baseURL: BASE_URL,
    // baseURL: 'http://localhost:2000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000, // 10 second timeout
})

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("ADMIN_TOKEN");
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

const handleLogout = async () => {
    await signOut(auth)
}


api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.log(`Session Expired. Please Login again.`)
            queryClient.clear()
            localStorage.clear()
            handleLogout()
        }
        return Promise.reject(error)
    }
)

export default api