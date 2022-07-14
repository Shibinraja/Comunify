import React from 'react';
import './styles.css';
import App from './App';
import { createRoot } from 'react-dom/client';

let root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
);
