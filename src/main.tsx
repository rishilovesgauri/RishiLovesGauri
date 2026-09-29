import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BirthdayPage } from './birthday/BirthdayPage';
import { isBirthdayRoute } from './birthday/isBirthdayRoute';
import './styles/index.css';

const rootElement: HTMLElement | null = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Root element with id "root" not found');
}

if (isBirthdayRoute(window.location)) {
  document.documentElement.classList.add('birthday-route');
}

const pageElement: JSX.Element = isBirthdayRoute(window.location) ? (
  <BirthdayPage />
) : (
  <App />
);

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    {pageElement}
  </React.StrictMode>
);


