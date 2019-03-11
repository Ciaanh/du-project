import * as React from 'react';

interface IHandlerProps {
    name: string;
    vscode: any;
}

export default class Handler extends React.Component<IHandlerProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

