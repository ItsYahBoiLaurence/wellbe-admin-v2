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

  const { data: domainData, isLoading: isDomainLoading } = useQuery({
    queryKey: ['AllDomain', 'Positive Workplaces', selectedValues[1]],
    queryFn: getCompanyDomainStatistics,
  });

  const { data: departmentData, isLoading: isDepartmentLoading } = useQuery({
    queryKey: ['DepartmentWellBeing', 'Positive Workplaces', selectedValues[1]],
    queryFn: getDepartmentStatics,
  });

  return (
    <Box>
      <Paper shadow="xs" radius="md" px="lg" py="md">
        <Group justify="space-between">
          <Title order={4} fw={700}>
            Well-being Overview
          </Title>
          <form>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  style={{ width: '250px' }}
                  radius={'md'}
                  size="md"
                  data={time}
                  rightSection={<IconChevronDown size={16} />}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
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
        {isDomainLoading ? (
          <Paper p="md">
            <Text ta="center">No Data Yet!</Text>
          </Paper>
        ) : (
          <AllDomain domains={domainData} />
        )}
      </Box>

      <Box my={'md'}>
        {isDepartmentLoading ? (
          <Paper p="md">
            <Text ta="center">No Data for this Department!</Text>
          </Paper>
        ) : (
          <Department departments={departmentData} />
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
