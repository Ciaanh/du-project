import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import Project from './components/Project';
import { duProject } from './interfaces/vsmodel';

declare global {
    interface Window {
        acquireVsCodeApi(): any;
        initialData: duProject;
    }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
    <Project vscode={vscode} initialData={window.initialData} />,
    document.getElementById('root')
);