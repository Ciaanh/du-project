import * as React from 'react';

interface IMethodProps {
    name: string;
    vscode: any;
}

export default class Method extends React.Component<IMethodProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

