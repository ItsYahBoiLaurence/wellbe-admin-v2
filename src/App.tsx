import { MantineProvider, MantineTheme, createTheme, rem } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import queryClient from './queryClient';
import Routes from './Routes';

const theme = createTheme({
  fontFamily:
    'Cairo, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
  white: '#fff',
  black: '#313131',
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(16),
    lg: rem(20),
    xl: rem(24),
    xxl: rem(32),
  },
  headings: {
    fontWeight: rem(700),
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
    xxl: rem(40),
  },
}) as MantineTheme;



function App() {
  return (
    <MantineProvider theme={theme} stylesTransform={emotionTransform}>
      <MantineEmotionProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </QueryClientProvider>
      </MantineEmotionProvider>
    </MantineProvider>
  );
}

export default App;
