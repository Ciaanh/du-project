import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Project from './Project';

import './index.css';

declare global {
    interface Window {
        acquireVsCodeApi(): any;
    }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
    <Project vscode={vscode} />,
    document.getElementById('root')
);