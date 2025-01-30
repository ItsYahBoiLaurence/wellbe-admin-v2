import api from "./api";

export const getCompanyWellbeingStatistics = async () => {
    return
}

export const getCompanyDomainStatistics = async ({ queryKey }) => {
    const [, company, viewType] = queryKey
    const params = {
        company: company,
        viewType: viewType
    }
    try {
        const response = await api.get('/api/company-admin/latestDomainStatistics/', { params })
        return response.data.Domains
    } catch (error) {
        throw error
    }
}

export const getDepartmentStatics = async ({ queryKey }) => {
    const [, company, viewType] = queryKey
    const params = {
        company: company,
        viewType: viewType
    }
    try {
        const response = await api.get('/api/company-admin/latestDepartmentStatisticsAll/', { params })
        return response.data
    } catch (error) {
        throw error
    }
}

export const addDepartment = async (newDepartmentData) => {
    const data = {
        company: newDepartmentData.company,
        department: newDepartmentData.department
    }
    try {
        const response = await api.post('/api/company-admin/addDepartment/', data)
        if (response) { return response.data }
    } catch (error) {
        throw error
    }
}

export const getEmployees = async ({ queryKey }) => {
    const [, company] = queryKey
    const params = {
        company: company
    }
    try {
        const response = api.get('/api/company-admin/employeesList/', { params })
        return response.data
    } catch (error) {
        throw error
    }
}