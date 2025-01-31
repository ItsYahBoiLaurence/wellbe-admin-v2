import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query"; // Ensure latest react-query version
import { getDepartment } from "../api/apiService";

// 1️⃣ Create Context with default value as `null`
export const DepartmentContext = createContext(null);

export const DepartmentProvider = ({ children }) => {
    // 2️⃣ Fetch department data
    const { data: departments, isLoading, error } = useQuery({
        queryKey: ["department"],
        queryFn: getDepartment,
    });

    return (
        <DepartmentContext.Provider value={{ departments, isLoading, error }}>
            {children}
        </DepartmentContext.Provider>
    );
};

// 3️⃣ Custom hook to use the context
export const useDepartment = () => {
    const context = useContext(DepartmentContext);
    if (!context) {
        throw new Error("useDepartment must be used within a DepartmentProvider");
    }
    return context;
};