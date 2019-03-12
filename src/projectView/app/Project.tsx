import * as React from 'react';

import { IProject } from './interfaces/model';

// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


interface IProjectProps {
    vscode: any;
    initialData: IProject;
}

interface IProjectState {
    project: IProject;
}

export default class Project extends React.Component<IProjectProps, IProjectState> {
    private slotIndexes: Array<number> = [
        -3,
        -2,
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ];

    constructor(props: any) {
        super(props);

        let initialData = this.props.initialData;

        let oldState = this.props.vscode.getState();

        this.state = { project: (oldState && oldState.project) || initialData };


        //this.onSelectSlot = this.onSelectSlot.bind(this);
    }

    componentDidMount() {
        window.addEventListener('message', event => {
            const message: IMessage = event.data;
            switch (message.command) {
                case 'initialize':
                    this.setState({ project: message.data })
                    this.props.vscode.setState({ project: message.data });
                    break;
            }
        });
    }

    private onSelectSlot(slotIndex: number) {
        console.log(slotIndex);
    }

    render() {
        const code = `--@slotKey:-2
        --@signature:flush()
        --@args:
        -- compute acceleration and angularAcceleration
        local forward =  Nav:composeForwardAcceleration(Nav.thrustManager:getAccelerationCommand())
        
        local angularAcceleration = Nav:composeControlledStabAngularAcceleration(Nav:getRollInput(), Nav:getPitchInput())
                                + Nav:composeTiltingAngularAcceleration()
                                + Nav:composeTurningAngularAcceleration(Nav:getYawInput())
        
        Nav:setEngineCommand("vertical,torque", Nav:composeLiftUpAcceleration(Nav:getLiftInput()), angularAcceleration)
        Nav:setEngineCommand("horizontal", forward, nullvector)
        Nav:setEngineCommand("brake", Nav:composeBrakingAcceleration(Nav:getBrakeInput()), nullvector)`;

        return (
            <React.Fragment>
                <ul>
                    {
                        (this.state.project)
                            ? this.slotIndexes.map(
                                (slotIndex) => {
                                    let slot = this.state.project.slots[slotIndex];
                                    if (slot) {
                                        return (
                                            <li key={slotIndex} onClick={() => this.onSelectSlot(slotIndex)}>
                                                {slot.name}
                                            </li>);
                                    }
                                    return <li key={slotIndex}>
                                        <span>Slot {slotIndex} is missing.</span>>
                                    </li>;
                                })
                            : null}
                </ul>
                <main >
                    <SyntaxHighlighter language='lua'>{code}</SyntaxHighlighter>
                </main>
            </React.Fragment>
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



