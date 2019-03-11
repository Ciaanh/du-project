import * as React from 'react';

import { IProject } from './interfaces/model';

import SlotList from './components/SlotList';
import EventList from './components/EventList';
import MethodList from './components/MethodList';


interface IProjectProps {
    vscode: any;
    initialData: IProject;
}

interface IProjectState {
    project: IProject | undefined;
}

export default class Project extends React.Component<IProjectProps, IProjectState> {
    constructor(props: any) {
        super(props);

        let initialData = this.props.initialData;

        let oldState = this.props.vscode.getState();

        this.state = { project: (oldState && oldState.project) || undefined };
    }

    componentDidMount() {
        window.addEventListener('message', event => {
            const message: IMessage = event.data;
            switch (message.command) {
                case 'initialize':
                    this.setState({ project: message.data })
                    this.props.vscode.setState({ project: message.data });
                    break;
            }
        });
    }

    render() {
        return (
            <React.Fragment>
                <SlotList vscode={this.props.vscode} project={this.state.project} ></SlotList>
                <MethodList vscode={this.props.vscode} ></MethodList>
                <EventList vscode={this.props.vscode} ></EventList>
            </React.Fragment>
        );
    }
}

// let currentCount = (oldState && oldState.count) || 0;

    // // Update state
    // vscode.setState({ count: currentCount });

    // this.props.vscode.postMessage({
    //     command: 'alert',
    //     text: '🐛  we welcomed ' + this.props.name
    // });

    // // Handle messages sent from the extension to the webview
    // window.addEventListener('message', event => {
    //     const message = event.data; // The json data that the extension sent
    //     switch (message.command) {
    //         case 'refactor':
    //             currentCount = Math.ceil(currentCount * 0.5);
    //             counter.textContent = currentCount;
    //             break;
    //     }
    // });



