import * as React from 'react';

import { IProject, ISlot, IHandler } from './interfaces/model';

// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


interface IProjectProps {
    vscode: any;
    initialData: IProject;
}

interface IProjectState {
    project: IProject;
    currentSlot?: number;
    currentHandler?: IHandler;
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
        if (oldState) {
            this.state = oldState;
        }
        else {
            this.state = { project: initialData };
        }
    }

    componentDidMount() {
        window.addEventListener('message', event => {
            const message: IMessage = event.data;
            switch (message.command) {
                case 'initialize':
                    this.defineState({ ...this.state, project: message.data })
                    break;
            }
        });
    }

    private defineState(newSate: any) {
        this.setState(newSate)
        this.props.vscode.setState(newSate);
    }

    private onSelectSlot(slotIndex: number) {
        this.defineState({ ...this.state, currentSlot: slotIndex, currentHandler: undefined })
    }

    private onSelectHandler(handler: IHandler) {
        this.defineState({ ...this.state, currentHandler: handler })
    }

    private getHandlersBySlot(slotIndex: number): IHandler[] {
        return this.state.project.handlers.filter(handler => {
            return handler.filter.slotKey == slotIndex;
        });
    }

    private renderFilterList(slotIndex: number) {

        let handlers: IHandler[] = this.getHandlersBySlot(slotIndex);

        return (<div className="filterList">
            {(handlers && handlers.length > 0)
                ? handlers.map(
                    (handler, handlerIndex) => {
                        let argList = (handler.filter.args && handler.filter.args.length > 0)
                            ? handler.filter.args.map((arg) => { return arg.value; }).join(",")
                            : null;

                        return (
                            <li key={handler.key} onClick={() => this.onSelectHandler(handler)}>
                                <span>
                                    {handler.filter.signature} : {argList}
                                </span>
                            </li>);
                    })
                : null}
        </div>)
    }

    private renderHandler(handler: IHandler) {
        return (<main >
            <a className="editHandler" onClick={() => this.editHandler(handler)}>Edit this code</a>
            <SyntaxHighlighter language='lua'>{handler.code}</SyntaxHighlighter>
        </main>)
    }

    private editHandler(handler: IHandler) {
        this.props.vscode.postMessage({
            command: 'editHandler',
            slotKey: handler.filter.slotKey,
            handlerKey: handler.key
        });
    }

    render() {

        return (
            <React.Fragment>
                <div className="slotList">
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
                </div>

                {
                    (this.state.currentSlot)
                        ? this.renderFilterList(this.state.currentSlot)
                        : null
                }

                {
                    (this.state.currentHandler)
                        ? this.renderHandler(this.state.currentHandler)
                        : null
                }
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



