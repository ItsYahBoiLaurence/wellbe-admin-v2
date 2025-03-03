import { Box, Paper, SimpleGrid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import Employee from "./Employee/Employee";

interface EmployeeDepartmentProps {
    dataToRender: { name: string; employees: any[] }[];
    currentDepartment: string;
    dropdownData: { label: string; value: string }[];
}

const EmployeeDepartment = ({ dataToRender, currentDepartment, dropdownData }: EmployeeDepartmentProps) => {
    const [employee, setEmployee] = useState<any[] | null>(null);

    useEffect(() => {
        const department = dataToRender?.find((dept) => dept.name === currentDepartment);
        setEmployee(department ? department.employees : []);
    }, [currentDepartment, dataToRender]);

    return (
        <Box>
            {employee == null ? ( // This covers both null and undefined
                <Text>Loading...</Text>
            ) : employee.length === 0 ? (
                <Paper p="md" shadow="xs">
                    <Text ta="center">There's no employee in this Department!</Text>
                </Paper>
            ) : (
                <SimpleGrid cols={4}>
                    {employee.map((person) => (
                        <Employee
                            key={person.id}
                            department={currentDepartment}
                            dataEmployee={person}
                            dropdownData={dropdownData}
                        />
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
};

export default EmployeeDepartment;
