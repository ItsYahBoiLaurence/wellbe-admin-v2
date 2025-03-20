import { Box, Paper, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState, useMemo, memo } from "react";
import Employee from "./Employee/Employee";

interface Employee {
    id: string;
    // Add other employee properties here
    [key: string]: any;
}

interface Department {
    name: string;
    employees: Employee[];
}

interface DropdownItem {
    label: string;
    value: string;
}

interface EmployeeDepartmentProps {
    dataToRender: Department[];
    currentDepartment: string;
    dropdownData: DropdownItem[];
}

// Memoize the Employee component to prevent unnecessary re-renders
const MemoizedEmployee = memo(Employee);

const EmployeeDepartment = ({ dataToRender, currentDepartment, dropdownData }: EmployeeDepartmentProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Use useMemo to compute employees only when dependencies change
    useMemo(() => {
        if (!dataToRender) return;

        const department = dataToRender.find((dept) => dept.name === currentDepartment);
        setEmployees(department?.employees || []);
        setLoading(false);
    }, [currentDepartment, dataToRender]);

    if (loading) {
        return <Text>Loading...</Text>;
    }

    if (employees.length === 0) {
        return (
            <Paper p="md" shadow="xs">
                <Text ta="center">There's no employee in this Department!</Text>
            </Paper>
        );
    }

    return (
        <Box>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                {employees.map((person) => (
                    <MemoizedEmployee
                        key={person.id}
                        department={currentDepartment}
                        dataEmployee={person}
                        dropdownData={dropdownData}
                    />
                ))}
            </SimpleGrid>
        </Box>
    );
};

// Export the component wrapped in memo to prevent unnecessary re-renders
export default memo(EmployeeDepartment);
