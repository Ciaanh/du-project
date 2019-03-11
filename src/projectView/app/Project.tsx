import * as React from 'react';
import Button from '@material-ui/core/Button';

import Title from './components/Title';
import IProject from './interfaces/iProject';


interface IProjectProps {
    vscode: any;
}

interface IProjectState {
    project: IProject | undefined;
}

export default class Project extends React.Component<IProjectProps, IProjectState> {
    constructor(props: any) {
        super(props);

this.props.vscode.ge

        this.state = { project: undefined };
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
                <Title name={"Coco"} vscode={this.props.vscode} />
                <Button variant="contained" color="primary">
                    Hello World
                </Button>
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



