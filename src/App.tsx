import { MantineProvider } from '@mantine/core';
import { emotionTransform, MantineEmotionProvider } from '@mantine/emotion';
import { theme } from '@wellbe/storybook-main';
import { QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import queryClient from './queryClient';
import Routes from './Routes';

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
