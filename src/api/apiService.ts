import api from "./api";

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
    const cacheKey = `domain-stats-${viewType}`;

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const params = { viewType };
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
    const cacheKey = `dept-stats-${viewType}`;

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const params = { viewType };
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
export const addDepartment = async (newDepartmentData: { department: string }) => {
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
    const cacheKey = 'employees';

    // Check cache first
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const response = await api.get('/api/company-admin/employeesList/');

        // Cache the response
        apiCache.set(cacheKey, response);
        return response;
    } catch (error) {
        return handleApiError(error, 'getEmployees');
    }
};

export const getParticipationRate = async ({ queryKey }: { queryKey: any[] }) => {
    const [, department] = queryKey;
    try {
        const response = await api.get('/api/company-admin/departmentParticipationRate/', {
            params: { department }
        });
        return response.data;
    } catch (error) {
        return handleApiError(error, 'getParticipationRate');
    }
};

export const updateEmployee = async (newUserInfo: any) => {
    try {
        const response = await api.put('/api/company-admin/updateEmployee', newUserInfo);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'updateEmployee');
    }
};

export const getDepartment = async () => {
    try {
        const response = await api.get('/api/company-admin/allDepartment');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'getDepartment');
    }
};

export const sendEmail = async (inviteInformation: {
    department: string;
    firstName: string;
    lastName: string;
    email: string;
}) => {
    try {
        const response = await api.post('/api/company-admin/inviteEmployee', inviteInformation);
        return response.data;
    } catch (error) {
        return handleApiError(error, 'sendEmail');
    }
};

export const getNormComparison = async ({ queryKey }: { queryKey: any[] }) => {
    const [_, viewType] = queryKey;
    try {
        const response = await api.get('/api/company-admin/latestNormDomain/', {
            params: { viewType }
        });
        return response;
    } catch (error) {
        return handleApiError(error, 'getNormComparison');
    }
};

export const getWellbe = async ({ queryKey }: { queryKey: any[] }) => {
    const [_, viewType] = queryKey;
    try {
        const response = await api.get('/api/company-admin/latestWellbeingStatistics/', {
            params: { viewType }
        });
        return response;
    } catch (error) {
        return handleApiError(error, 'getWellbe');
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get('api/company-admin/adminList');
        console.log(response.data)
        return response.data;
    } catch (error) {
        return handleApiError(error, 'getAllUsers');
    }
};

export const getSettingsConfig = async () => {
    try {
        const response = await api.get('/api/company-admin/getSettingsStatus');
        return response;
    } catch (error) {
        return handleApiError(error, 'getSettingsConfig');
    }
};

export const getAllDepartments = async () => {
    try {
        const response = await api.get('/api/company-admin/allDepartment');
        return response.data;
    } catch (error) {
        return handleApiError(error, 'getAllDepartments');
    }
};

// Export the cache for manual invalidation when needed
export const invalidateApiCache = () => {
    apiCache.clear();
};