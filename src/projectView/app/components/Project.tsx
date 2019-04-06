import * as React from 'react';


// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { IHandler } from '../interfaces/dumodel';
import { duProject, ProjectError, methodFileError } from '../interfaces/vsmodel';
import { IMessage } from '../interfaces/messages';



interface IProjectProps {
    vscode: any;
    initialData: duProject;
}

interface IProjectState {
    duProject: duProject;
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
            this.state = { duProject: initialData };
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
        return this.state.duProject.project.handlers.filter(handler => {
            return handler.filter.slotKey == slotIndex;
        });
    }

    private editHandler(handler: IHandler) {
        this.props.vscode.postMessage({
            command: 'editHandler',
            slotKey: handler.filter.slotKey,
            handlerKey: handler.key
        });
    }




    private fixMethodError(methodError: methodFileError) {
        this.props.vscode.postMessage({
            command: 'fixMethodError',
            methodError: methodError
        });
    }









    private renderFilterList(slotIndex: number) {

        let handlers: IHandler[] = this.getHandlersBySlot(slotIndex);

        return (
            <ul className="">
                {(handlers && handlers.length > 0)
                    ? handlers.map(
                        (handler, handlerIndex) => {
                            let argList = (handler.filter.args && handler.filter.args.length > 0)
                                ? handler.filter.args.map((arg) => { return arg.value; }).join(",")
                                : null;

                            return (
                                <li key={handler.key}
                                    className="nav-item"
                                    onClick={() => this.onSelectHandler(handler)}>

                                    <a className={"nav-link" + ((this.state.currentHandler && this.state.currentHandler.key === handler.key) ? " active" : "")} href="#">
                                        {handler.filter.signature} : {argList}
                                    </a>

                                </li>);
                        })
                    : null}
            </ul>);
    }

    private renderHandler(handler: IHandler) {
        return (
            <div className="" >
                <a className="editHandler" onClick={() => this.editHandler(handler)}>Edit this code</a>
                <SyntaxHighlighter language='lua'>{handler.code}</SyntaxHighlighter>
            </div>);
    }

    private renderErrors(projectErrors: ProjectError) {
        return (
            (projectErrors.methodsErrors && projectErrors.methodsErrors.length > 0)
                ? <div className="methodErrors" >
                    {
                        projectErrors.methodsErrors.map((methodError, index) => {

                            return (
                                <div>
                                    <a className="fixError" onClick={() => this.fixMethodError(methodError)}>fix this error</a>
                                    {/* <SyntaxHighlighter language='lua'>{handler.code}</SyntaxHighlighter> */}
                                </div>
                            );
                        })
                    }
                </div>
                : null
        );
    }


    private renderSlotList() {
        return (

            <ul className="nav flex-column">
                {
                    (this.state.duProject)
                        ? this.slotIndexes.map(
                            (slotIndex) => {
                                let slot = this.state.duProject.project.slots[slotIndex];
                                if (slot) {
                                    return (
                                        <li key={slotIndex}
                                            className="nav-item"
                                            onClick={() => this.onSelectSlot(slotIndex)}>

                                            <a className={"nav-link" + ((this.state.currentSlot && this.state.currentSlot === slotIndex) ? " active" : "")}
                                                href="#">{slot.name}
                                            </a>

                                        </li>);
                                }
                                return (
                                    <li key={slotIndex}
                                        className="nav-item" >
                                        <span>Slot {slotIndex} is missing.</span>>
                                            </li>);
                            })
                        : null}
            </ul>
        );
    }



    render() {

        return (
            <React.Fragment>

                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="#">DU Project - json to lua overview</a>
                    {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap">
                            <a className="nav-link" href="#">Sign out</a>
                        </li>
                    </ul> */}
                </nav>

                <div className="container-fluid">
                    <div className="row">
                        <nav className="col-2 sidebar">
                            <div className="sidebar-sticky">
                                {
                                    this.renderSlotList()
                                }
                            </div>
                        </nav>

                        <nav className="col-2 sidebar bis">
                            <div className="sidebar-sticky">
                                {
                                    (this.state.currentSlot)
                                        ? this.renderFilterList(this.state.currentSlot)
                                        : null
                                }
                            </div>
                        </nav>

                        <main className="col-8 code">
                            {
                                this.renderErrors(this.state.duProject.projectErrors)
                            }
                            {
                                (this.state.currentHandler)
                                    ? this.renderHandler(this.state.currentHandler)
                                    : null
                            }

                        </main>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

                // let currentCount = (oldState && oldState.count) || 0;

                    // // Update state
    // vscode.setState({count: currentCount });

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



