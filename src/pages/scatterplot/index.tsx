import { Controller, useForm } from 'react-hook-form';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { ScatterChart } from '@mantine/charts';
import { Dropzone } from '@mantine/dropzone';
import {
  Button,
  Drawer,
  Flex,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import api from '../../api/api';
import { useDisclosure } from '@mantine/hooks';


const ScatterGraph = ({ func }) => {
  const { data: SCATTERDATA, isError: noSCATTERDATA, isLoading: fetchingSCATTERDATA, refetch: REFETCHDATA } = useQuery({
    queryKey: ['SCATTERPLOT'],
    queryFn: async () => {
      const res = await api.get('workforce-vitality')
      return res.data
    }
  })

  func(REFETCHDATA)

  if (fetchingSCATTERDATA) return <>loading...</>
  if (noSCATTERDATA) return <>no data...</>

  const { users_with_data } = SCATTERDATA.scatterData
  console.log(users_with_data)

  const data = [
    {
      color: 'blue',
      name: 'Data',
      data: users_with_data
    }
  ]


  return (
    <Paper p="md" shadow='sm'>
      <Stack gap={'lg'}>
        <Title order={2} fw={500}>Wellbeing x Performance Scatter Plot</Title>
        <ScatterChart
          h={650}
          data={data}
          dataKey={{ x: 'performance', y: 'wellbeing' }}
          xAxisLabel="Performance"
          yAxisLabel="Wellbeing"
          xAxisProps={{
            domain: [0, 100], // Fix x-axis range from 0 to 100
            ticks: [0, 20, 40, 60, 80, 100], // Define x-axis ticks
          }}
          yAxisProps={{
            domain: [0, 100], // Adjust y-axis range as needed,
            ticks: [0, 20, 40, 60, 80, 100],
          }}
        />
      </Stack>
    </Paper>
  )
}


const Scatterplot = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { control: FILE_CONTROL, handleSubmit: FILESUBMIT, reset: RESET_FILE, formState: { isSubmitting: FILE_SUBMITTING, isSubmitSuccessful: isSUCCESS_UPLOAD } } = useForm<{ files: [] }>({
    defaultValues: { files: [] }
  })

  function refetch(func: any) {
    func()
  }

  const onFileSubmit = async (data: { files: File[] }) => {
    const { files } = data;
    if (!files || files.length === 0) {
      console.warn('No files to upload');
      return;
    }

    // 1. Build FormData
    const formData = new FormData();
    files.forEach((file) => {
      // 'file' must match the @UseInterceptors key in your NestJS controller
      formData.append('file', file, file.name);
    });

    try {
      // 2. Send via your preconfigured `api` instance
      const response = await api.post('workforce-vitality', formData, {
        headers: {
          // Let the browser set the correct multipart boundary
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server parsed rows:', response.data);
      RESET_FILE()
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
                validate: (files) => files.length > 0 || 'Please upload at least one CSV file',
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
                        <Dropzone.Reject>Only CSV files under 30MB are accepted</Dropzone.Reject>
                        <Dropzone.Idle>Upload CSV File</Dropzone.Idle>
                      </Text>
                    </div>
                  </Dropzone>

                  {/* Display uploaded file names */}
                  {value.length > 0 && (
                    <Stack mt="sm" gap={4}>
                      {value.map((file, idx) => (
                        <Text key={idx} size="sm">
                          {file.name}
                        </Text>
                      ))}
                    </Stack>
                  )}

                  {/* Validation error */}
                  {error && (
                    <Text color="red" size="sm" mt="xs">
                      {error.message}
                    </Text>
                  )}
                </>
              )}
            />
            {isSUCCESS_UPLOAD && <Text c={'green'}>Upload Success</Text>}
            <Button type="submit" variant="filled" color="gray" loading={FILE_SUBMITTING}>
              {FILE_SUBMITTING ? "Uploading..." : "Upload Csv"}
            </Button>
          </Stack>
        </form>
      </Drawer>
      <Paper radius="sm" shadow="xs" p="md" style={{ display: 'flex', justifyContent: 'flex-end' }} mb='md'>
        <Button variant="filled" color="gray" onClick={open}>
          Upload Performance Data
        </Button>
      </Paper>
      <ScatterGraph func={refetch} />
    </>
  );
};

export default Scatterplot;
