import { Avatar, Box, Button, Flex, Grid, GridCol, NativeSelect, Paper, Text, Title } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DomainCard from '../../components/DataVisualization/DomainCard';
import AllDomain from '../../components/DataVisualization/AllDomain';
import AreaChartComponent from '../../components/DataVisualization/AreaChart';


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

const Dashboard = () => {

  const { control, setValue, watch } = useForm({
    defaultValues: {
      data: 'OverALLCompany',
      time: 'Annually'
    }
  })

  const selectedValues = watch(['data', 'time'])

  useEffect(() => {
    console.log(`Current filter: ${selectedValues}`)
  }, [selectedValues])


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
      <Grid grow columns={12}>
        {/* Data Visualization */}
        <GridCol span={9}>
          <Box>
            <Flex direction={'row'} gap={20} mb={12}>
              <Paper w={'50%'} radius={'lg'} p={'lg'}>
                <Text fw={700}>Company Wide Well-being Index</Text>
                <AreaChartComponent />
              </Paper>
              <Paper w={'50%'} radius={'lg'} p={'lg'}>
                <Text fw={700}>Company Wide Well-being Index</Text>
                <AreaChartComponent />
              </Paper>
            </Flex>
            <AllDomain />
          </Box>
        </GridCol>

        <GridCol span={3}>
          <Paper radius={'lg'} h={'100%'} p={12}>
            <Flex direction={'row'} align={'center'} columnGap={12}>
              <Avatar>J</Avatar>
              <Title order={3}>Wellbe Tips</Title>
            </Flex>
            <Text mt={'md'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod </Text>
            <NativeSelect
              mt={'md'}
              radius={'lg'}
              size='md'
              data={domain}
              rightSection={<IconChevronDown size={16} />}
            />
            <Paper shadow="md" radius="lg" withBorder p="xl" mt={'md'}>
              <Text fw={700}>Promote Growth Mindset:</Text>
              <Text>Encourage a growth mindset where employees believe that their abilities can be developed through effort and perseverance. Provide resources and opportunities for learning and growth, and celebrate the process of learning and improvement.</Text>
            </Paper>

          </Paper>
        </GridCol>
      </Grid>

    </Box >
  );
};

export default Dashboard;
