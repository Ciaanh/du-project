import * as React from 'react';

interface ITypeProps {
    name: string;
    vscode: any;
}

export default class Type extends React.Component<ITypeProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

