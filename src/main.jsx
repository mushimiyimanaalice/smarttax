import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n';
import App from './App.jsx';
import { registerSW } from './offline/swRegistration';

async function bootstrap() {
  await registerSW();

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

bootstrap();
