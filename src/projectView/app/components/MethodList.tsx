import * as React from 'react';

interface IMethodListProps {
    name: string;
    vscode: any;
}

export default class MethodList extends React.Component<IMethodListProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

