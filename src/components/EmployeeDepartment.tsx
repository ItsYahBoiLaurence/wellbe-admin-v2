import { Box, SimpleGrid, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import Employee from './Employee/Employee'

const EmployeeDepartment = ({ dataToRender, currentDepartment }) => {

    const [employee, setEmployee] = useState(null)

    useEffect(() => {
        const department = dataToRender.find(department => department.name === "Engineering Sample")
        setEmployee(department?.employees)
    }, [currentDepartment])

    return (
        <Box>
            {employee === null ? <Text>Loading...</Text> : (<SimpleGrid cols={4}>
                {employee.map((person) => (
                    <Employee key={person.name} department={currentDepartment} dataEmployee={person} />
                ))}
            </SimpleGrid>)}
        </Box>
    )
}

export default EmployeeDepartment