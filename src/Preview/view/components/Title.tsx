import * as React from 'react';

interface ITitleProps {
    name: string;
    vscode: any;
}

export default class Title extends React.Component<ITitleProps, any> {

    render() {
        this.props.vscode.postMessage({
            command: 'alert',
            text: '🐛  we welcomed ' + this.props.name
        });

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

