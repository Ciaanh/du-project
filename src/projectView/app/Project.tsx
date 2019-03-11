import * as React from 'react';
import Title from './components/Title';

interface IMessage{
    command:string;

}

interface IProjectProps {
    vscode: any;
}

export default class Project extends React.Component<IProjectProps, any> {
    constructor(props: any) {
        super(props);

        // const oldState = this.vscode.getState();

    }

    componentDidMount(){
        window.addEventListener('message', event => {
        const message:IMessage = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'initialize':
                this.setState(message.)
                break;
        }
    });
    }



    render() {
        return (
            <Title name={"Coco"} vscode={this.props.vscode} />
        );
    }
}

// let currentCount = (oldState && oldState.count) || 0;

    // // Update state
    // vscode.setState({ count: currentCount });

    // this.props.vscode.postMessage({
    //     command: 'alert',
    //     text: '🐛  we welcomed ' + this.props.name
    // });

    // // Handle messages sent from the extension to the webview
    // window.addEventListener('message', event => {
    //     const message = event.data; // The json data that the extension sent
    //     switch (message.command) {
    //         case 'refactor':
    //             currentCount = Math.ceil(currentCount * 0.5);
    //             counter.textContent = currentCount;
    //             break;
    //     }
    // });



