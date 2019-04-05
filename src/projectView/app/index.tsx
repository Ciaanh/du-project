import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import { IProject } from './interfaces/model';
import Project from './components/Project';

declare global {
    interface Window {
        acquireVsCodeApi(): any;
        initialData: IProject;
    }
}

const vscode = window.acquireVsCodeApi();

ReactDOM.render(
    <Project vscode={vscode} initialData={window.initialData} />,
    document.getElementById('root')
);