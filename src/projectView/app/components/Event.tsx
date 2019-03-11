import * as React from 'react';

interface IEventProps {
    name: string;
    vscode: any;
}

export default class Event extends React.Component<IEventProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

