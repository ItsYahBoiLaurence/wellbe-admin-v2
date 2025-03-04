import { Box, Flex, Paper, RingProgress, Text } from "@mantine/core"
import { useQuery } from "react-query"
import { getParticipationRate } from "../../api/apiService"
import { useEffect, useState } from "react"

const ParticipationRate = ({ selectedDepartment }) => {

    const [participationLogo, setParticipation] = useState(false)
    const { data: participationData, isLoading: isParticipationDataLoading } = useQuery({
        queryKey: ['participation', selectedDepartment],
        queryFn: getParticipationRate,
        onError: (error) => {
            if (error?.status == 404) {
                setParticipation(true)
            }
        }
    })

    useEffect(() => {
        if (participationData?.participationRate === undefined || participationData?.participationRate === null) {
            setParticipation(true)
        } else {
            setParticipation(false)
        }
    }, [selectedDepartment, participationData])

    useEffect(() => {

    },)


    return (
        <Paper p='md' radius='md' my={'md'}>
            {isParticipationDataLoading ? <Text>Loading...</Text> : (
                <Flex direction={'row'} justify={'space-between'} align={'center'} >
                    <Box>
                        <Text size="lg" fw={700}>Participation Rate</Text>
                        <Text fw={500}>This summarized the employee's compliance to company activities and initiatives.</Text>
                    </Box>
                    {participationLogo == true ? <Text>No data for this department</Text> : (
                        <Flex align={'center'} gap={'md'}>
                            <Box>
                                <Text fw={700}>Employee Participation</Text>
                                <Text size="xl">{participationData?.participationRate}%</Text>
                            </Box>
                            <RingProgress
                                thickness={20}
                                sections={[{ value: participationData?.participationRate, color: '#FFA903' }]}
                            />
                        </Flex>
                    )}
                </Flex>
            )}
        </Paper>
    )
}

export default ParticipationRate