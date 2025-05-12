import {
  Box,
  Group,
  NativeSelect,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import AllDomain from '../../components/DataVisualization/AllDomain';
import { useQuery } from 'react-query';
import {
  getCompanyDomainStatistics,
  getDepartmentStatics,
} from '../../api/apiService';
import Department from '../../components/DataVisualization/Department';
import NormGraph from '../../components/DataVisualization/NormGraph';
import WellbeingGraph from '../../components/DataVisualization/WellbeingGraph';
import COMPANYWELLBEING from '../../components/V2Components/CompanyWellbeing'
import DEPARTMENT from '../../components/V2Components/DepartmentWellbeing'
import NORMGRAPH from '../../components/V2Components/NormGraph'
import api from '../../api/api';
import WELLBEGRAPH from '../../components/V2Components/WellbeGraph'

const time = [
  { label: 'Quarterly View', value: 'Quarterly' },
  { label: 'SemiAnnual View', value: 'SemiAnnual' },
  { label: 'Annually View', value: 'Annually' },
];

const Dashboard = () => {
  const { control: CONTROL_PERIOD, watch: WATCH_PERIOD } = useForm({
    defaultValues: {
      period: ''
    }
  });

  const selectedPeriod = WATCH_PERIOD('period');

  const { data: WELLBEING_DATA, isError: noWELLBEING_DATA, isLoading: isFETCHING_DATA } = useQuery({
    queryKey: ['WELLBEING_DATA', selectedPeriod],
    queryFn: async () => {
      const config = selectedPeriod
        ? { params: { period: selectedPeriod } }
        : {}

      const res = await api.get('wellbeing/company', config)
      return res.data
    }
  })

  if (isFETCHING_DATA) return <>fetching...</>

  if (noWELLBEING_DATA) return <>no data!</>

  console.log(WELLBEING_DATA)

  return (
    <Box>
      <Paper shadow="xs" radius="md" px="lg" py="md">
        <Group justify="space-between">
          <Title order={4} fw={700}>
            Well-being Overview
          </Title>
          <form>
            <Controller
              name="period"
              control={CONTROL_PERIOD}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  style={{ width: '250px' }}
                  radius={'md'}
                  size="md"
                  data={time}
                  rightSection={<IconChevronDown size={16} />}
                >
                  <option value=''>Select View</option>
                  <option value="quarter">Quarter View</option>
                  <option value="semiannual">Semiannual View</option>
                  <option value="annual">Annual View</option>
                </NativeSelect>
              )}
            />
          </form>
        </Group>
      </Paper>
      <SimpleGrid cols={2} my='md'>
        <NORMGRAPH WELLBEING_DATA={WELLBEING_DATA} />
        <WELLBEGRAPH period={selectedPeriod} />
      </SimpleGrid>
      <Box>
        <COMPANYWELLBEING WELLBEING_DATA={WELLBEING_DATA} />
      </Box>
      <Box my={'md'}>
        <DEPARTMENT period={selectedPeriod} />
      </Box>
    </Box>
  );
};

export default Dashboard;
