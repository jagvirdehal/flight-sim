import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { KeyboardControls } from '@react-three/drei';

import App from './app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div id="app">
        <KeyboardControls
            map={[
                { name: 'up', keys: ['ArrowUp', 'w', 'W'] },
                { name: 'down', keys: ['ArrowDown', 's', 'S'] },
                { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
                { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
                { name: 'turbo', keys: ['Shift'] }
            ]}>
            <App />
        </KeyboardControls>
    </div>
);
