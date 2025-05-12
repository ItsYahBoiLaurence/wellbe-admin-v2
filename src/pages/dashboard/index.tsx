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


const time = [
  { label: 'Quarterly View', value: 'Quarterly' },
  { label: 'SemiAnnual View', value: 'SemiAnnual' },
  { label: 'Annually View', value: 'Annually' },
];

const Dashboard = () => {
  const { control, watch } = useForm({
    defaultValues: {
      data: 'OverALLCompany',
      time: 'Annually',
    },
  });

  const selectedValues = watch(['data', 'time']);

  const { data: domainData } = useQuery({
    queryKey: ['AllDomain', selectedValues[1]],
    queryFn: getCompanyDomainStatistics,
  });

  const { data: departmentData } = useQuery({
    queryKey: ['DepartmentWellBeing', selectedValues[1]],
    queryFn: getDepartmentStatics,
  });

  const { control: CONTROL_PERIOD, watch: WATCH_PERIOD } = useForm({
    defaultValues: {
      period: ''
    }
  });

  const selectedPeriod = WATCH_PERIOD('period');

  console.log(selectedPeriod)

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
                  <option value=''>Select</option>
                  <option value="quarter">Quarter View</option>
                  <option value="semiannual">Semiannual View</option>
                  <option value="annual">Annual View</option>
                </NativeSelect>
              )}
            />
          </form>
        </Group>
      </Paper>

      {/* Mobile Responsive */}
      {/* <Flex my={'md'} direction={{ base: 'column', sm: 'row' }} gap={'md'}> */}

      <SimpleGrid cols={2} my='md'>
        <NormGraph filter={selectedValues[1]} />
        <WellbeingGraph filter={selectedValues[1]} />
      </SimpleGrid>
      <Box>
        {/* <AllDomain domains={domainData} /> */}
        <COMPANYWELLBEING period={selectedPeriod} />
      </Box>
      <Box my={'md'}>
        {/* <Department departments={departmentData} /> */}
        <DEPARTMENT />
      </Box>
    </Box>
  );
};

export default Dashboard;
