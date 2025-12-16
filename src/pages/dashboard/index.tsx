import {
  Box,
  Center,
  Grid,
  Group,
  NativeSelect,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import COMPANYWELLBEING from '../../components/V2Components/CompanyWellbeing';
import DEPARTMENT from '../../components/V2Components/DepartmentWellbeing';
import NORMGRAPH from '../../components/V2Components/NormGraph';
import api from '../../api/api';
import WELLBEGRAPH from '../../components/V2Components/WellbeGraph';
import LoaderComponent from '../../components/V2Components/LoaderComponent';
import InsightCard from '../../components/Cards/InsightCard';
import { Outlet } from 'react-router-dom';
import { useQueries, useQuery } from 'react-query';
import { getParticipationRate } from '../../api/apiService';

const time = [
  { label: 'Quarterly View', value: 'Quarterly' },
  { label: 'SemiAnnual View', value: 'SemiAnnual' },
  { label: 'Annually View', value: 'Annually' },
];

const Dashboard = () => {
  const { control: CONTROL_PERIOD, watch: WATCH_PERIOD } = useForm({
    defaultValues: {
      period: '',
    },
  });

  const selectedPeriod = WATCH_PERIOD('period');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['PARTICIPATION_RATE'],
    queryFn: async () => {
      const res = await api.get('participation-rate');
      return res.data;
    },
    retry: 0,
  });

  if (isLoading) return <LoaderComponent size="100%" />;

  if (isError)
    return (
      <Center h={'80vh'}>
        <Text fw="bold">No Wellbeing Data!</Text>
      </Center>
    );

  return (
    <Box>
      {data.participation_rate < 0.3 ? (
        <Center h="80vh">The Participation rate must be above 30%</Center>
      ) : (
        <>
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
                      <option value="">Select View</option>
                      <option value="quarter">Quarter View</option>
                      <option value="semiannual">Semiannual View</option>
                      <option value="annual">Annual View</option>
                    </NativeSelect>
                  )}
                />
              </form>
            </Group>
          </Paper>
          <Grid my="md">
            <Grid.Col span={6}>
              <NORMGRAPH selectedPeriod={selectedPeriod} />
            </Grid.Col>
            <Grid.Col span={6}>
              <WELLBEGRAPH period={selectedPeriod} />
            </Grid.Col>
          </Grid>
          <Box>
            <COMPANYWELLBEING />
          </Box>
          {/*<Box my={'md'}>
        <DEPARTMENT period={selectedPeriod} />
      </Box>*/}
          <Box my={'md'}>
            <InsightCard />
          </Box>
          <Outlet />
        </>
      )}
    </Box>
  );
};

export default Dashboard;
