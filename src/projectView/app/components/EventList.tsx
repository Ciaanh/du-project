import * as React from 'react';

interface IEventListProps {
    name: string;
    vscode: any;
}

export default class EventList extends React.Component<IEventListProps, any> {

    render() {


        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

