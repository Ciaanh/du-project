import * as React from 'react';

interface IFilterProps {
    name: string;
    vscode: any;
}

export default class Filter extends React.Component<IFilterProps, any> {

    render() {
        

        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

