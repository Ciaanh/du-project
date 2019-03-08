import * as React from 'react';

interface ITitleProps {
    name: string;
}

export default class Title extends React.Component<ITitleProps, any> {
    render() {
        return (
            <h1>Hello, {this.props.name}</h1 >
        );
    }
}

