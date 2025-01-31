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

export const getEmployees = async () => {
    const company = "Mayan Solutions Inc."
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
    const [, company, department] = queryKey
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
        company: "Mayan Solutions Inc.",
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
        company: "Mayan Solutions Inc."
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
        company: "Mayan Solutions Inc.",
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