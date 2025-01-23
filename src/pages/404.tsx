import { Flex, Text } from '@mantine/core';
import Link from '../components/Link';

const PageNotFound = () => {
  return (
    <Flex direction="column" align="center">
      <Text>Page Not Found</Text>
      <Text>
        Click{' '}
        <Link to="/" color="primary.main">
          here
        </Link>{' '}
        to go back to home page.
      </Text>
    </Flex>
  );
};

export default PageNotFound;
