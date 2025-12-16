import { CompositeChart } from '@mantine/charts';
import { Center, Loader, Paper, Stack, Text } from '@mantine/core';
import { useQueries, useQuery } from 'react-query';
import api from '../../../api/api';
import LoaderComponent from '../LoaderComponent';

type WellbeingData = {
  character: string;
  career: string;
  connectedness: string;
  contentment: string;
};

export default function index({ selectedPeriod }: { selectedPeriod: string }) {
  const {
    data: WELLBEING_DATA,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['WELLBEING_DATA', selectedPeriod],
    queryFn: async () => {
      const config = selectedPeriod
        ? { params: { period: selectedPeriod } }
        : {};

      const res = await api.get('wellbeing/company', config);
      return res.data;
    },
    retry: 0,
  });

  if (isLoading) return <LoaderComponent size="100%" />;
  if (isError) return <Center mih={'300px'}>No Data...</Center>;

  const { career, character, connectedness, contentment } = WELLBEING_DATA;

  if (
    career === null ||
    character === null ||
    connectedness === null ||
    contentment === null
  )
    return (
      <Paper h={400}>
        <Center h={'100%'}>
          <Text>NO DATA AVAILABLE</Text>
        </Center>
      </Paper>
    );

  const data = [
    {
      name: 'Career',
      score: career,
      max_norm: 93,
      min_norm: 79,
    },
    {
      name: 'Character',
      score: character,
      max_norm: 93,
      min_norm: 75,
    },
    {
      name: 'Connectedness',
      score: connectedness,

      max_norm: 75,
      min_norm: 54,
    },
    {
      name: 'Contentment',
      score: contentment,
      max_norm: 85,
      min_norm: 65,
    },
  ];

  return (
    <Paper
      py={'md'}
      px={'xl'}
      radius={'md'}
      w="100%"
      shadow="xs"
      sx={{ background: '#3E4954' }}
      h={'100%'}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Stack gap={'sm'}>
        <div>
          <Text size="lg" c="white">
            Company Wide
          </Text>
          <Text size="xl" c="white">
            Index vs. Norm
          </Text>
        </div>

        <CompositeChart
          c="white"
          w={'100%'}
          h={250}
          data={data}
          dataKey="name"
          gridAxis="xy"
          maxBarWidth={40}
          series={[
            {
              name: 'score',
              type: 'bar',
              color: '#A5D38F',
            },
            { name: 'max_norm', color: 'white', type: 'line' },
            { name: 'min_norm', color: 'white', type: 'line' },
          ]}
          withLegend
          curveType="natural"
          withDots={false}
        />
      </Stack>
    </Paper>
  );
}
