import { Controller, useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Dropzone } from '@mantine/dropzone';
import {
  Button,
  Drawer,
  Flex,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import api from '../../api/api';
import { useDisclosure } from '@mantine/hooks';
import queryClient from '../../queryClient';
import { ScatterChart } from '@mantine/charts';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

const getScatterData = async () => {
  const url = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('CLIENT_TOKEN')
  try {
    const response = await fetch(`${url}workforce-vitality`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (response.status != 200) throw Error("Fetch Failed!")
    return response.json()
  } catch (error) {
    throw error
  }
}

const ScatterGraph = () => {

  const { data: ScatterData } = useQuery({
    queryKey: ['scatterdata'],
    queryFn: async () => getScatterData(),
    retry: false,
    useErrorBoundary: true,
    suspense: true
  })

  if (!ScatterData) throw new Error("Failed Data!")

  const data = [
    {
      color: 'blue',
      name: 'Data',
      data: ScatterData?.scatterData,
    },
  ];

  console.log(ScatterData)

  return (
    <Paper p="md" shadow="sm">
      <Stack gap="lg">
        <Title order={2} fw={500}>
          Wellbeing x Performance Scatter Plot
        </Title>
        <ScatterChart
          h={650}
          data={data}
          dataKey={{ x: 'performance', y: 'wellbeing' }}
          xAxisLabel="Performance"
          yAxisLabel="Wellbeing"
          xAxisProps={{
            domain: [0, 100],
            ticks: [0, 20, 40, 60, 80, 100],
          }}
          yAxisProps={{
            domain: [0, 100],
            ticks: [0, 20, 40, 60, 80, 100],
          }}
        />
      </Stack>
    </Paper>
  );
};

const UploadPerformanceData = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const {
    control: FILE_CONTROL,
    handleSubmit: FILESUBMIT,
    reset: RESET_FILE,
    formState: {
      isSubmitting: FILE_SUBMITTING,
      isSubmitSuccessful: isSUCCESS_UPLOAD,
    },
  } = useForm<{ files: File[] }>({
    defaultValues: { files: [] },
  });

  const onFileSubmit = async (data: { files: File[] }) => {
    const { files } = data;

    if (!files || files.length === 0) {
      console.warn('No files to upload');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file, file.name);
    });

    try {
      const response = await api.post('/workforce-vitality', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server parsed rows:', response.data);

      RESET_FILE();

      // ✅ Trigger re-fetch instead of just clearing cache
      queryClient.invalidateQueries({ queryKey: ['SCATTERPLOTDATA'] });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <>
      <Drawer position="right" opened={opened} onClose={close}>
        <form onSubmit={FILESUBMIT(onFileSubmit)}>
          <Stack gap="md" p="md">
            <Controller
              name="files"
              control={FILE_CONTROL}
              rules={{
                validate: (files) =>
                  files.length > 0 || 'Please upload at least one CSV file',
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <>
                  <Dropzone
                    multiple
                    accept={{ 'text/csv': ['.csv'] }}
                    maxSize={30 * 1024 ** 2}
                    onDrop={onChange}
                    onReject={() => onChange([])}
                  >
                    <div style={{ pointerEvents: 'none' }}>
                      <Flex justify="center">
                        <Dropzone.Accept>
                          <IconDownload size={50} color="blue" stroke={1.5} />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                          <IconX size={50} color="red" stroke={1.5} />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                          <IconCloudUpload size={50} stroke={1.5} />
                        </Dropzone.Idle>
                      </Flex>
                      <Text ta="center" fw={700} size="lg" mt="xl">
                        <Dropzone.Accept>Drop CSV file here</Dropzone.Accept>
                        <Dropzone.Reject>
                          Only CSV files under 30MB are accepted
                        </Dropzone.Reject>
                        <Dropzone.Idle>Upload CSV File</Dropzone.Idle>
                      </Text>
                    </div>
                  </Dropzone>

                  {value.length > 0 && (
                    <Stack mt="sm" gap={4}>
                      {value.map((file, idx) => (
                        <Text key={idx} size="sm">
                          {file.name}
                        </Text>
                      ))}
                    </Stack>
                  )}

                  {error && (
                    <Text color="red" size="sm" mt="xs">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
            {isSUCCESS_UPLOAD && (
              <Text color="green">Upload Success</Text>
            )}
            <Button
              type="submit"
              variant="filled"
              color="gray"
              loading={FILE_SUBMITTING}
            >
              {FILE_SUBMITTING ? 'Uploading...' : 'Upload CSV'}
            </Button>
          </Stack>
        </form>
      </Drawer>

      <Paper
        radius="sm"
        shadow="xs"
        p="md"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button variant="filled" color="gray" onClick={open}>
          Upload Performance Data
        </Button>
      </Paper>
    </>
  );
}

const Scatterplot = () => {
  return (
    <Stack>
      <UploadPerformanceData />
      <ErrorBoundary fallback={<Paper p={'md'} ta={'center'}>No Data Available!</Paper>}>
        <Suspense fallback={
          <LoadingOverlay
            h={'100px'}
            pos={'relative'}
            visible={true}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 20 }}
            loaderProps={{ color: '#515977', type: 'bars' }}
          />}>
          <ScatterGraph />
        </Suspense>
      </ErrorBoundary>
    </Stack>
  )
};

export default Scatterplot;
