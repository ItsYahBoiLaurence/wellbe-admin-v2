import { Avatar, Box, Button, Flex, LoadingOverlay, NativeSelect, Paper, Text, Title } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useForm, Controller } from 'react-hook-form';
import AllDomain from '../../components/DataVisualization/AllDomain';
import { useQuery } from 'react-query';
import { getCompanyDomainStatistics } from '../../api/apiService';


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

  return (
    <Box>
      <Paper mb={12} shadow="md" radius="md" px="xl" py={'md'}>
        <Flex direction={'row'} justify={'space-between'} align={'center'}>
          <Box>
            <form>
              <Flex direction={'row'} align={'center'} gap={56}>
                <Title order={4} fw={700}>Well-being Overview</Title>
                <Controller
                  name='data'
                  control={control}
                  render={({ field }) => (
                    <NativeSelect
                      {...field}
                      radius={'lg'}
                      style={{ width: '300px' }}
                      size='md'
                      data={data}
                      rightSection={<IconChevronDown size={16} />}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                    />
                  )}
                />
                <Controller
                  name='time'
                  control={control}
                  render={({ field }) => (
                    <NativeSelect
                      {...field}
                      style={{ width: '250px' }}
                      radius={'lg'}
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
          </Box>
          <Flex gap={24} align={'center'}>
            <Box>
              <Text>People with Access</Text>
              <Avatar.Group>
                <Avatar>J</Avatar>
                <Avatar>A</Avatar>
                <Avatar>C</Avatar>
                <Avatar>K</Avatar>
                <Avatar>+5</Avatar>
              </Avatar.Group>
            </Box>
            <Button color="#515977" size="md" radius={'xl'}>+ Invite</Button>
          </Flex>
        </Flex>
      </Paper >
      <Box style={{ position: 'relative' }}>
        <LoadingOverlay visible={isDomainLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'pink', type: 'bars' }}
        />
        {!isDomainLoading && <AllDomain domains={domainData} />}
      </Box>
    </Box>
  );
};

export default Dashboard;
