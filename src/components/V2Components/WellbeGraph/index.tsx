import { useQueries, useQuery } from 'react-query';
import api from '../../../api/api';
import { Center, Paper, Stack, Text, Title } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import LoaderComponent from '../LoaderComponent';

export default function index({ period }: { period: string }) {
  const [wellbeingData, wellbeingDataLabel] = useQueries([
    {
      queryKey: ['WELLBE_DATA', period],
      queryFn: async () => {
        const config = period ? { params: { period } } : {};
        const res = await api.get('wellbeing/wellbe', config);
        return res.data;
      },
    },
    {
      queryKey: ['WELLBE_DATA_LABEL', period],
      queryFn: async () => {
        const config = period ? { params: { period } } : {};
        const res = await api.get(
          'wellbeing/company-overall-wellbeing',
          config
        );
        return res.data;
      },
    },
  ]);

  const {
    data: WELLBE_DATA,
    isError: noWELLBE_DATA,
    isLoading: isFETCHINGDATA,
  } = wellbeingData;

  const {
    data: WELLBE_DATA_LABEL,
    isError: noWELLBE_DATA_LABEL,
    isLoading: isFETCHINGDATA_LABEL,
  } = wellbeingDataLabel;

  if (isFETCHINGDATA || isFETCHINGDATA_LABEL)
    return <LoaderComponent size="100%" />;
  if (noWELLBE_DATA || noWELLBE_DATA_LABEL) return <>No Data</>;

  const data: { date: string; wellbeing: number }[] = [];

  WELLBE_DATA.map(
    ({ created_at, wellbeing }: { created_at: string; wellbeing: number }) => {
      const date = new Date(created_at);
      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      data.push({ date: formatted, wellbeing: wellbeing ?? 0 });
    }
  );
  if (data.length === 0)
    return (
      <Paper h={400}>
        <Center h={'100%'}>
          <Text>NO DATA AVAILABLE</Text>
        </Center>
      </Paper>
    );
  return (
    <Paper p="xl">
      <Stack gap={'lg'}>
        <div>
          <Title order={3} fw={700}>
            Company Wide Well-being Index
          </Title>
          <Title
            order={1}
            fw={700}
            c={
              WELLBE_DATA_LABEL.overall_wellbeing_label == 'Very High' ||
              WELLBE_DATA_LABEL.overall_wellbeing_label == 'High' ||
              WELLBE_DATA_LABEL.overall_wellbeing_label == 'Above Average'
                ? '#82BC66'
                : WELLBE_DATA_LABEL.overall_wellbeing_label == 'Average'
                  ? '#94B8FB'
                  : WELLBE_DATA_LABEL.overall_wellbeing_label ==
                        'Below Average' ||
                      WELLBE_DATA_LABEL.overall_wellbeing_label == 'Very Low'
                    ? 'red'
                    : 'red'
            }
          >
            {WELLBE_DATA_LABEL.overall_wellbeing_label}
          </Title>
        </div>

        <LineChart
          h={300}
          data={data}
          dataKey="date"
          series={[{ name: 'wellbeing' }]}
          curveType="monotone"
          yAxisProps={{
            domain: [0, 100],
            ticks: [0, 20, 40, 60, 80, 100],
          }}
          withXAxis={true}
          withYAxis={true}
          gridAxis="xy"
        />
      </Stack>
    </Paper>
  );
}
