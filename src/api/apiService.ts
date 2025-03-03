import api from "./api";


const company = localStorage.getItem("USER_COMPANY")

export const getCompanyDomainStatistics = async ({ queryKey }) => {
    const [, viewType] = queryKey
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
    const [, viewType] = queryKey
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

export const getEmployees = async () => {
    const params = {
        company: company
    }
    try {
        const response = api.get('/api/company-admin/employeesList/', { params })
        return response
    } catch (error) {
        console.log(error)
    }
}

export const getParticipationRate = async ({ queryKey }) => {
    const [, department] = queryKey
    const params = {
        company: company,
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
        company: company,
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
        company: company
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
        company: company,
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
        company: company,
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
        company: company,
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
        company: company
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
        company: company
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
        company: company
    }
    try {
        const response = await api.get('/api/company-admin/allDepartment', { params })
        return response.data
    } catch (error) {
        throw error
    }
}