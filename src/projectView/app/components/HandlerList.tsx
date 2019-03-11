import * as React from 'react';

interface IHandlerListProps {
    name: string;
    vscode: any;
}

export default class HandlerList extends React.Component<IHandlerListProps, any> {

    render() {


        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

