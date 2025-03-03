import { Avatar, Box, Center, Drawer, Flex, Image, Paper, ScrollArea, Stack, Text } from "@mantine/core"
import DECREASE from '../../assets/LowAverage.png'
import INCREASE from '../../assets/AboveAverage.png'
import MAINTAIN from '../../assets/MaintainedScore.png'



const DepartmentWellbeing = ({ departments }) => {

    const getLabel = (value) => {

        const result = (value >= 1 && value <= 22)
            ? "Below Average"
            : (value >= 23 && value <= 76)
                ? "Average"
                : (value >= 77 && value <= 100)
                    ? "Above Average"
                    : "Invalid Value";

        return result
    }

    const labelColor = (label) => {
        const color = label == "Below Average" ? 'red' : label == "Average" ? '#94B8FB' : label == "Above Average" ? '#00A389' : 'black'
        return color
    }

    const setIcon = (label) => {
        const icon = label == "Below Average" ? DECREASE : label == "Average" ? MAINTAIN : label == "Above Average" ? INCREASE : 'black'
        return icon
    }

    const isDepartmentInvalid = (isInvalid) => {
        if (isInvalid === "Invalid Value") {
            return true
        }
        return false
    }


    return (
        <ScrollArea w={'100%'} p={'xs'}>
            <Flex direction={'row'} gap={'md'}>
                {departments === undefined ? <Paper w='100%' p='md'><Center><Text>No data available!</Text></Center></Paper> : departments.map((department) => (
                    <Paper key={department.departmentName} shadow="xs" radius="md" p='md' w={'300px'} >
                        <Box>
                            <Flex align={'center'} gap={12}>
                                <Avatar size={'md'}  >{department.departmentName[0]}</Avatar>
                                <Text fw={700} size="lg">{department.departmentName}</Text>
                            </Flex>
                            {isDepartmentInvalid(getLabel(department.Wellbe)) ? <Text mt={'lg'} fw={700} size="md" ta={'center'}>This department has no available information!</Text> : (
                                <Flex justify={'space-between'} align={"center"} my={"md"}>
                                    <Box>
                                        <Text c={labelColor(getLabel(department.Wellbe))} fw={700} size="lg">{getLabel(department.Wellbe)}</Text>
                                        <Text c={labelColor(getLabel(department.Wellbe))}>{department.Wellbe}%</Text>
                                    </Box>
                                    <Box>
                                        <Image src={setIcon(getLabel(department.Wellbe))} />
                                    </Box>
                                </Flex>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Flex>
        </ScrollArea>
    )
}

export default DepartmentWellbeing