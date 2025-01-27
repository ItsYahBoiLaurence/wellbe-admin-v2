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

export const getDepartmentStatics = async () => {
    return
}