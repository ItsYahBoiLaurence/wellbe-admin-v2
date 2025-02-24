import { Box, Button, Flex, Group, NativeSelect, Paper, Stack, Text, Title } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import AllDomain from '../../components/DataVisualization/AllDomain';
import { useQuery } from 'react-query';
import { getCompanyDomainStatistics, getDepartmentStatics, getNormComparison, getWellbe } from '../../api/apiService';
import Department from '../../components/DataVisualization/Department'
import { AreaChart, BarChart, CompositeChart, LineChart } from '@mantine/charts';
import FeedbackCard from '../../components/Cards/FeedbackCard';
import InsightCard from '../../components/Cards/InsightCard';


const data = [
  { label: 'Company Wide', value: 'OverALLCompany' },
  { label: 'Human Resources Department', value: 'HR' },
  { label: 'Engineering Department', value: 'Engineering' },
  { label: 'Marketing Department', value: 'Marketing' },
  { label: 'Sales Department', value: 'Sales' },
]

const time = [
  { label: 'Quarterly View', value: 'Quarterly' },
  { label: 'SemiAnnual View', value: 'SemiAnnual' },
  { label: 'Annually View', value: 'Annually' },
]


const domain = [
  { label: 'Character', value: 'Character' },
  { label: 'Connectedness', value: 'Connectedness' },
  { label: 'Career', value: 'Career' },
  { label: 'Contentment', value: 'Contentment' },
]

const departments = [
  { name: "Finance", wellbeingScore: 90 },
  { name: "Marketing", wellbeingScore: 80 },
  { name: "Sales", wellbeingScore: 50 },
  { name: "Engineering", wellbeingScore: 70 },
]


const Dashboard = () => {

  const { control, watch } = useForm({
    defaultValues: {
      data: 'OverALLCompany',
      time: 'Annually'
    }
  })

  const selectedValues = watch(['data', 'time'])

  const { data: domainData, isLoading: isDomainLoading } = useQuery({
    queryKey: ['AllDomain', "Mayan Solutions Inc.", selectedValues[1]],
    queryFn: getCompanyDomainStatistics
  })

  const { data: departmentData, isLoading: isDepartmentLoading } = useQuery({
    queryKey: ['DepartmentWellBeing', "Mayan Solutions Inc.", selectedValues[1]],
    queryFn: getDepartmentStatics
  })

  const { data: norm, isLoading: isNormLoading } = useQuery({
    queryKey: ['NormDomain', selectedValues[1]],
    queryFn: getNormComparison
  })

  const { data: wellBe, isLoading: isWellBeLoading } = useQuery({
    queryKey: ['Wellbe', selectedValues[1]],
    queryFn: getWellbe
  })

  const transformData = (data) => {
    const newData = Object.keys(data.domains).map(domain => ({
      domain,
      score: data.domains[domain], // Get the correct score
      norm: data.norms[domain] // Get the corresponding norm
    }));
    return newData
  }

  const transformDate = (stringDate) => {
    const date = new Date(stringDate)
    const newDate = date.toLocaleDateString('en-US', {
      month: 'short'
    })
    return newDate
  }


  const transformWellbeingData = (data) => {

    const newData = data.map(entry => ({
      date: transformDate(entry.Date),
      wellbeing: entry.Wellbe
    }))
    return newData
  }

  return (
    <Box>
      <Paper shadow="md" radius="md" px="lg" py='md'>
        <Group justify='space-between'>
          <Title order={4} fw={700}>Well-being Overview</Title>
          <form>
            <Controller
              name='time'
              control={control}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  style={{ width: '250px' }}
                  radius={'md'}
                  size='md'
                  data={time}
                  rightSection={<IconChevronDown size={16} />}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              )}
            />
          </form>
        </Group>
      </Paper >


      {/* Mobile Responsive */}
      <Flex my={'md'} direction={{ base: 'column', sm: 'row' }} gap={'md'}>
        {isNormLoading ? <Paper ta={'center'}>Loading...</Paper> : (
          <Paper py={'md'} px={'xl'} radius={'md'} w='100%'>
            <Stack gap={'lg'}>
              <Title order={2} fw={700}>Company Domain score Vs. Norm Domain score</Title>
              <CompositeChart
                w={'100%'}
                h={250}
                data={transformData(norm?.data)}
                dataKey="domain"
                series={[
                  { name: 'norm', color: 'gray', type: 'line' },
                  { name: 'score', color: '#A5D38F', type: 'bar' }
                ]}
                withLegend
                curveType="linear"
              />
            </Stack>
          </Paper>
        )}
        {isWellBeLoading ? <Paper>Loading...</Paper> : (
          <Paper p={'xl'} radius={'md'} w='100%'>
            <Stack gap={'lg'}>
              <Title order={2} fw={700}>Company Well Being Score</Title>
              <AreaChart
                h={250}
                data={transformWellbeingData(wellBe?.data)}
                dataKey="date"
                yAxisProps={{ domain: [0, 100] }}
                series={[{ name: "wellbeing", color: "gray" }]}
                curveType="natural"
                withDots={false}
              />
            </Stack>
          </Paper>
        )}
      </Flex>


      <Box>
        {isDomainLoading ? <Text ta={'center'}>Loading...</Text> : <AllDomain domains={domainData} />}
      </Box>
      <Box my={'md'}>
        {isDepartmentLoading ? <Text ta={'center'}>Department Loading....</Text> : <Department departments={departmentData} />}
      </Box>
      {/* Employee's Feedback */}
      <Paper p="md" my='md' shadow="md">
        <Group px='md' justify="space-between">
          <Title order={2} fw={700}>Employee's Feedback</Title>
          <Button variant="light" color="gray" radius="md">View More</Button>
        </Group>
        <Group grow m={'md'}>
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
          <FeedbackCard />
        </Group>
      </Paper>
    </Box>
  );
};

export default Dashboard;