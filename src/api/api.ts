import axios from 'axios'

// API base URL from environment variables
const BASE_URL = 'https://wellbe-staging-employee-qiwsg.ondigitalocean.app'

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

// Response interceptor
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         // Handle specific error cases
//         if (error.response) {
//             // Server responded with error status
//             if (error.response.status === 401) {
//                 // Unauthorized - token expired or invalid
//                 localStorage.removeItem("ADMIN_TOKEN");
//                 // Redirect to login page if needed
//                 window.location.href = '/sign-in';
//             }
//             console.error('API Error:', error.response.status, error.response.data);
//         } else if (error.request) {
//             // Request was made but no response
//             console.error('Network Error:', error.request);
//         } else {
//             // Error in setting up the request
//             console.error('Request setup error:', error.message);
//         }
//         return Promise.reject(error);
//     }
// );

export default api