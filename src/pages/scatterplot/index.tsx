import { useForm } from 'react-hook-form';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { ScatterChart } from '@mantine/charts';
import { Dropzone } from '@mantine/dropzone';
import {
  Button,
  Center,
  Drawer,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import api from '../../api/api';

interface FormValues {
  file: File[];
}

const user_company = localStorage.getItem("USER_COMPANY");

const fetchDataForScatterPlot = async () => {
  const params = { company: user_company };
  try {
    const response = await api.get('/api/company-admin/performanceScatterPlot/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const formatData = (color: string, name: string, data: any[]) => [
  {
    color,
    name,
    data,
  },
];

const Scatterplot = () => {
  const [notif, setNotif] = useState(false);
  const [errorNotif, setErrorNotif] = useState(false);
  const { data, isLoading, error } = useQuery('scatterPlot', fetchDataForScatterPlot);
  const theme = useMantineTheme();
  const openRef = useRef(null);
  const [opened, setOpened] = useState(false);
  const { handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({ defaultValues: { file: [] } });
  const fileValue = watch('file');

  const handleDrop = useCallback((files: File[]) => {
    setValue('file', files.length > 0 && files[0].type === 'text/csv' ? files : []);
  }, [setValue]);

  const onSubmit = useCallback(async (values: FormValues) => {
    if (values.file && values.file.length > 0) {
      const formData = new FormData();
      formData.append('file', values.file[0]);
      try {
        await api.post(`/api/company-admin/batchUploadPerformance?company=${user_company}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setNotif(true);
        reset({ file: [] });
      } catch (error) {
        console.error('Upload error:', error);
        setErrorNotif(true);
      }
    }
  }, [reset]);

  useEffect(() => {
    if (notif) {
      const timer = setTimeout(() => setNotif(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notif]);

  useEffect(() => {
    if (errorNotif) {
      const timer = setTimeout(() => setErrorNotif(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorNotif]);

  return (
    <>
      <Paper radius="sm" shadow="xs" p="md" style={{ display: 'flex', justifyContent: 'flex-end' }} mb='md'>
        <Button variant="filled" color="gray" onClick={() => setOpened(true)}>
          Upload Performance Data
        </Button>
      </Paper>
      <Drawer opened={opened} onClose={() => setOpened(false)} position="right">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="md" p="md">
            <Dropzone openRef={openRef} onDrop={handleDrop} accept={['text/csv']} maxSize={30 * 1024 ** 2}>
              <div style={{ pointerEvents: 'none' }}>
                <Group>
                  <Dropzone.Accept>
                    <IconDownload size={50} color={theme.colors.blue[6]} stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconCloudUpload size={50} stroke={1.5} />
                  </Dropzone.Idle>
                </Group>
                <Text ta="center" fw={700} size="lg" mt="xl">
                  <Dropzone.Accept>Drop CSV file here</Dropzone.Accept>
                  <Dropzone.Reject>Only CSV files under 30MB are accepted</Dropzone.Reject>
                  <Dropzone.Idle>Upload CSV File</Dropzone.Idle>
                </Text>
                {fileValue && fileValue.length > 0 ? (
                  <Text ta="center" size="sm" mt="md" fw={600}>
                    Uploaded file: {fileValue[0].name}
                  </Text>
                ) : (
                  <Text ta="center" size="sm" mt="xs" color="dimmed">
                    Drag & drop a CSV file here. Only <i>.csv</i> files less than 30MB are accepted.
                  </Text>
                )}
              </div>
            </Dropzone>
            {errors.file && (
              <Text color="red" size="sm">
                {errors.file.message || 'Please upload a CSV file'}
              </Text>
            )}
            {notif && <Text c="green">Upload Success!</Text>}
            {errorNotif && <Text c="red">Account already registered!</Text>}
            <Button type="submit" variant="filled" color="gray">
              Upload Performance Data
            </Button>
          </Stack>
        </form>
      </Drawer>

      {isLoading ? (
        <Text>Loading...</Text>
      ) : error ? (
        <Paper w='100%' p="md"><Center><Text>No data available!</Text></Center></Paper>
      ) : (
        <>
          <Stack gap="md">
            <Paper radius="sm" shadow="xs" p="md">
              <Stack gap="md">
                <Text size="xl">Performance vs. Well-being of the Employee</Text>
                <ScatterChart
                  h={350}
                  data={formatData('blue', 'Employee', data)}
                  dataKey={{ x: 'performance', y: 'wellbeing' }}
                  xAxisLabel="Performance"
                  yAxisLabel="Wellbeing"
                />
              </Stack>
            </Paper>
          </Stack>
        </>
      )}
    </>
  );
};

export default Scatterplot;
