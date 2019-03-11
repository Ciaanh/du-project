import * as React from 'react';

interface IArgListProps {
    name: string;
    vscode: any;
}

export default class ArgList extends React.Component<IArgListProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

