import { Avatar, Box, Flex, Paper, Text } from "@mantine/core"

const UserCard = ({ department, employeeName }) => {
    return (
        <Paper radius={'md'} p={'xl'}>
            <Flex align={'center'} gap={'lg'}>
                <Avatar size={'lg'}>{employeeName[0]}</Avatar>
                <Box>
                    <Text size="xs">{department}</Text>
                    <Text size="md" fw={700}>{employeeName}</Text>
                </Box>
            </Flex>
        </Paper>
    )
}

export default UserCard