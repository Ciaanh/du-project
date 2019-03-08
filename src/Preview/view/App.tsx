import * as React from 'react';
import Title from './components/Title';


interface IAppProps {
    vscode: any;
}

export default class App extends React.Component<IAppProps, any> {
    constructor(props: any) {
        super(props);

        // const oldState = this.vscode.getState();

    }

    // let currentCount = (oldState && oldState.count) || 0;

    // // Update state
    // vscode.setState({ count: currentCount });

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



    render() {
        return (
            <Title name={"Coco"} vscode={this.props.vscode} />
        );
    }
}




