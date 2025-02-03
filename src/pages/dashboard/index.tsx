import { Avatar, Box, Button, Drawer, Flex, Group, LoadingOverlay, NativeSelect, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import AllDomain from '../../components/DataVisualization/AllDomain';
import { useQuery } from 'react-query';
import { getCompanyDomainStatistics, getDepartmentStatics } from '../../api/apiService';
import Department from '../../components/DataVisualization/Department'
import AreaChartComponent from '../../components/DataVisualization/AreaChart'
import DomainBarGraph from '../../components/DataVisualization/BarGraphDomain';
import { BarChart } from '@mantine/charts';
import { getLabel, getStanineScore, stanineLabelColor, setIcon } from "../../constants"


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

  console.log(domainData)


  const transformData = (data) => {
    const newFormat = Object.entries(data).map(([key, value]) => ({
      domain: key,
      score: value
    }))
    return newFormat
  }

  return (
    <Box>
      <Paper shadow="md" radius="md" px="lg" py='md'>
        <Group justify='space-between'>
          <Title order={4} fw={700}>Well-being Overview</Title>
          <form>
            <Flex direction={'row'} align={'center'} gap={'xs'} justify={'space-between'}>
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
            </Flex>
          </form>
        </Group>
      </Paper >
      {/* <Paper p={'xl'}>
        <AreaChartComponent />
      </Paper> */}

      <Group grow>
        {isDomainLoading ? <Paper ta={'center'}>Loading...</Paper> : (
          <Paper p={'md'} my={'md'} radius={'md'}>
            <Stack gap={'md'}>
              <Title order={2}>Company Wide Domain Score</Title>
              <BarChart
                w={'100%'}
                h={200}
                data={transformData(domainData)}
                dataKey="domain"
                series={[{ name: 'score' }]}
                getBarColor={(value) => stanineLabelColor(getLabel(getStanineScore(value)))}
              />
            </Stack>
          </Paper>
        )}
        <Paper h={200} p={'md'}>
          <Text ta={'center'}>NO DATA</Text>
        </Paper>
      </Group>
      {/* Bar graph */}

      <Box>
        {isDomainLoading ? <Text ta={'center'}>Loading...</Text> : <AllDomain domains={domainData} />}
      </Box>
      <Box my={'md'}>
        {isDepartmentLoading ? <Text ta={'center'}>Department Loading....</Text> : <Department departments={departmentData} />}
      </Box>
    </Box>
  );
};

export default Dashboard;
