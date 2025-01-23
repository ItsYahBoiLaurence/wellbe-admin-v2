import { Button, ButtonProps } from '@mantine/core';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

type LinkProps = ButtonProps & RouterLinkProps;

const Link = ({ children, ...props }: LinkProps) => (
  <Button component={RouterLink} {...props}>
    {children}
  </Button>
);

export default Link;
