import { useRef, useState } from 'react';
import { IconCloudUpload, IconDownload, IconX } from '@tabler/icons-react';
import { Button, Group, Text, useMantineTheme } from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import classes from './CustomDropzone.module.css';

export function CustomDropzone() {
  const theme = useMantineTheme();
  const openRef = useRef<() => void>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setFileName(files[0].name);
    }
  };

  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={handleDrop}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.pdf]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Accept>
              <IconDownload
                size={50}
                color={theme.colors.blue[6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={50} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload size={50} stroke={1.5} />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Pdf file less than 30mb</Dropzone.Reject>
            <Dropzone.Idle>Upload File</Dropzone.Idle>
          </Text>
          {fileName ? (
            <Text ta="center" fz="sm" mt="md" fw={600}>
              Uploaded file: {fileName}
            </Text>
          ) : (
            <Text ta="center" fz="sm" mt="xs" c="dimmed">
              Drag&apos;n&apos;drop files here to upload. We can accept only{' '}
              <i>.csv</i> files that are less than 30mb in size.
            </Text>
          )}
        </div>
      </Dropzone>
    </div>
  );
}
