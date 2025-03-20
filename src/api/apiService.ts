import api from "./api";

// Helper function to get company from localStorage (used across functions)
const getCompany = () => localStorage.getItem("USER_COMPANY") || '';

// Cache for API responses with configurable TTL
class ApiCache {
    private cache: Map<string, { data: any, timestamp: number }> = new Map();
    private DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

    set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now() + ttl
        });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() > cached.timestamp) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clear(): void {
        this.cache.clear();
    }
}

const apiCache = new ApiCache();

// Generic error handler
const handleApiError = (error: any, endpoint: string) => {
    console.error(`API Error in ${endpoint}:`, error);
    throw error;
};

/**
 * Company Domain Statistics
 */
export const getCompanyDomainStatistics = async ({ queryKey }: { queryKey: any[] }) => {
    const [_, viewType] = queryKey;
    const cacheKey = `domain-stats-${viewType}-${getCompany()}`;

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const params = {
            company: getCompany(),
            viewType
        };
        const response = await api.get('/api/company-admin/latestDomainStatistics/', { params });

        // Cache the response
        apiCache.set(cacheKey, response.data.Domains);
        return response.data.Domains;
    } catch (error) {
        return handleApiError(error, 'getCompanyDomainStatistics');
    }
};

/**
 * Department Statistics
 */
export const getDepartmentStatics = async ({ queryKey }: { queryKey: any[] }) => {
    const [_, viewType] = queryKey;
    const cacheKey = `dept-stats-${viewType}-${getCompany()}`;

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const params = {
            company: getCompany(),
            viewType
        };
        const response = await api.get('/api/company-admin/latestDepartmentStatisticsAll/', { params });

        // Cache the response
        apiCache.set(cacheKey, response.data);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'getDepartmentStatics');
    }
};

/**
 * Add Department
 */
export const addDepartment = async (newDepartmentData: { company: string, department: string }) => {
    try {
        const response = await api.post('/api/company-admin/addDepartment/', newDepartmentData);

        // Invalidate relevant caches
        apiCache.clear();

        return response.data;
    } catch (error) {
        return handleApiError(error, 'addDepartment');
    }
};

/**
 * Get Employees
 */
export const getEmployees = async () => {
    const cacheKey = `employees-${getCompany()}`;

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const params = { company: getCompany() };
        const response = await api.get('/api/company-admin/employeesList/', { params });

        // Cache the response
        apiCache.set(cacheKey, response);
        return response;
    } catch (error) {
        return handleApiError(error, 'getEmployees');
    }
};

export const getParticipationRate = async ({ queryKey }) => {
    const [, department] = queryKey
    const params = {
        company: getCompany(),
        department: department
    }
    try {
        const response = await api.get('/api/company-admin/departmentParticipationRate/', { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const updateEmployee = async (newUserInfo) => {
    const params = {
        company: getCompany(),
        email: newUserInfo.email
    }

    try {
        const response = api.put('/api/company-admin/updateEmployee', newUserInfo, { params })
        return response.data
    } catch (error) {
        throw error
    }

}

export const getDepartment = async () => {
    const params = {
        company: getCompany()
    }
    try {
        const response = await api.get('/api/company-admin/allDepartment', { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const sendEmail = async (inviteInformation) => {
    const data = {
        company: getCompany(),
        department: inviteInformation.department,
        firstName: inviteInformation.firstName,
        lastName: inviteInformation.lastName,
        email: inviteInformation.email
    }
    try {
        const response = await api.post('/api/company-admin/inviteEmployee', data)
        return response.data
    } catch (error) {
        throw error
    }
}

export const getNormComparison = async ({ queryKey }) => {
    const [, viewType] = queryKey
    const params = {
        company: getCompany(),
        viewType: viewType
    }
    try {
        const response = api.get('/api/company-admin/latestNormDomain/', { params })
        return response
    } catch (error) {
        throw error
    }
}

export const getWellbe = async ({ queryKey }) => {
    const [, viewType] = queryKey
    const params = {
        company: getCompany(),
        viewType: viewType
    }
    try {
        const response = api.get('/api/company-admin/latestWellbeingStatistics/', { params })
        return response
    } catch (error) {
        throw error
    }
}

export const getAllUsers = async () => {
    const params = {
        company: getCompany()
    }
    try {
        const response = api.get('api/company-admin/usersManagementList/', { params })
        return response
    } catch (error) {
        throw error
    }
}

export const getSettingsConfig = () => {
    const params = {
        company: getCompany()
    }
    try {
        const response = api.get('/api/company-admin/getSettingsStatus', { params })
        return response
    } catch (error) {
        throw error
    }
}

export const getAllDepartments = async () => {
    const params = {
        company: getCompany()
    }
    try {
        const response = await api.get('/api/company-admin/allDepartment', { params })
        return response.data
    } catch (error) {
        throw error
    }
}

// Export the cache for manual invalidation when needed
export const invalidateApiCache = () => {
    apiCache.clear();
};