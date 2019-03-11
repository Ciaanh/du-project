import * as React from 'react';

interface ISlotProps {
    name: string;
    vscode: any;
}

export default class Slot extends React.Component<ISlotProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

