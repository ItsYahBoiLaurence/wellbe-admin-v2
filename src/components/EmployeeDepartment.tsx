import { Box, Paper, SimpleGrid, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import Employee from './Employee/Employee'

const EmployeeDepartment = ({ dataToRender, currentDepartment, dropdownData }) => {

    const [employee, setEmployee] = useState(null)

    useEffect(() => {
        const department = dataToRender.find(department => department.name === currentDepartment)
        setEmployee(department?.employees)
    }, [currentDepartment])

    return (
        <Box>
            {employee === null ? (
                <Text>Loading...</Text>
            ) : employee.length === 0 ? (
                <Paper p={'md'} shadow="xs">
                    <Text ta={'center'}>There's no employee on this Department!</Text>
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

    )
}

export default EmployeeDepartment