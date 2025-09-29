import {
  Box,
  Center,
  Group,
  NativeSelect,
  Paper,
  SimpleGrid,
  Title,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import COMPANYWELLBEING from '../../components/V2Components/CompanyWellbeing'
import DEPARTMENT from '../../components/V2Components/DepartmentWellbeing'
import NORMGRAPH from '../../components/V2Components/NormGraph'
import api from '../../api/api';
import WELLBEGRAPH from '../../components/V2Components/WellbeGraph'
import LoaderComponent from '../../components/V2Components/LoaderComponent'
import InsightCard from '../../components/Cards/InsightCard';
import { Outlet } from 'react-router-dom';
import { useQueries } from 'react-query';
import { getParticipationRate } from '../../api/apiService';

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

  const [participation, wellbeing] = useQueries([
    {
      queryKey: ['PARTICIPATION_RATE'],
      queryFn: async () => {
        const res = await api.get('participation-rate');
        return res.data;
      }
    },
    {
      queryKey: ['WELLBEING_DATA', selectedPeriod],
      queryFn: async () => {
        const config = selectedPeriod
          ? { params: { period: selectedPeriod } }
          : {}

        const res = await api.get('wellbeing/company', config)
        return res.data
      }
    }
  ])
  const { data, isLoading, isError } = participation

  const { data: WELLBEING_DATA, isError: noWELLBEING_DATA, isLoading: isFETCHING_DATA } = wellbeing

  if (isFETCHING_DATA || isLoading) return <LoaderComponent />

  if (noWELLBEING_DATA || isError) return <>no data!</>

  return (
    <Box>
      {data.participation_rate < 0.30 ? <Center h="80vh">The Participation rate must be above 30%</Center> : <>
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
          <COMPANYWELLBEING period={selectedPeriod} />
        </Box>
        {/*<Box my={'md'}>
        <DEPARTMENT period={selectedPeriod} />
      </Box>*/}
        <Box my={'md'}>
          <InsightCard />
        </Box>
        <Outlet />
      </>
      }
    </Box>
  );
};

export default Dashboard;
