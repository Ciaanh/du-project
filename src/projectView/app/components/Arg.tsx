import * as React from 'react';

interface IArgProps {
    name: string;
    vscode: any;
}

export default class Arg extends React.Component<IArgProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

