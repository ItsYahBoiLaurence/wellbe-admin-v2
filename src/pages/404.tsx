import { Flex, Text, Title, Box } from '@mantine/core';
import { memo, useEffect } from 'react';
import Link from '../components/Link';

const PageNotFound = () => {
  // Update document title when component mounts
  useEffect(() => {
    document.title = 'Page Not Found | Wellbe Admin';
    return () => {
      // Reset title on unmount if needed
    };
  }, []);

  return (
    <Flex direction="column" align="center" justify="center" h="80vh" p="md">
      <Box mb="lg">
        <Title order={1} ta="center" mb="md">404</Title>
        <Text size="lg" ta="center" mb="lg">Page Not Found</Text>
        <Text ta="center">
          The page you are looking for doesn't exist or has been moved.{' '}
          <Link to="/" color="primary.main">
            Return to Dashboard
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

// Memo the component since it doesn't have props or state changes
export default memo(PageNotFound);
