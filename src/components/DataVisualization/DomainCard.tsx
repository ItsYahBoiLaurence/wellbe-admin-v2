import { Avatar, Box, Flex, Paper, Text, Title } from "@mantine/core"

import { getLabel, getStanineScore, labelColor, setIcon } from '../../constants'

const DomainCard = ({ title, score }) => {
    return (
        <Paper p={'xl'} radius={'md'} shadow={'sm'}>
            <Flex justify={'space-between'} align={'center'}>
                <Flex direction={'row'} align={'center'} gap={20}>
                    <Avatar radius="xs" size={'lg'} src={setIcon(getLabel(getStanineScore(score)))} />
                    <Box>
                        <Text fw={500}>{title}</Text>
                        <Title order={2} fw={700}>{getLabel(getStanineScore(score))}</Title>
                        <Text
                            size="sm"
                            c={labelColor(getLabel(getStanineScore(score)))}
                        >Stanine: {getStanineScore(score)}</Text>
                    </Box>
                </Flex>
                <Title order={2} fw={700}>{score}%</Title>
            </Flex>
        </Paper>
    )
}

export default DomainCard