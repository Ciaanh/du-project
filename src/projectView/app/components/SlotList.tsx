import * as React from 'react';

interface ISlotListProps {
    name: string;
    vscode: any;
}

export default class SlotList extends React.Component<ISlotListProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

