import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

import './index.css';

declare global {
    interface Window {
        acquireVsCodeApi(): any;
    }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
    <App vscode={vscode} />,
    document.getElementById('root')
);