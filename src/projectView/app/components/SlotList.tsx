import * as React from 'react';

import { IProject } from '../interfaces/model';

// @ts-ignore
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


interface ISlotListProps {
    project: IProject;
    vscode: any;
}

export default class SlotList extends React.Component<ISlotListProps, any> {
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
                        (this.props.project)
                            ? this.slotIndexes.map(
                                (slotIndex) => {
                                    if (this.props.project.slots[slotIndex]) {
                                        let slot = this.props.project.slots[slotIndex];
                                        return (
                                            <li key={slotIndex}>
                                                {slot.name}
                                            </li>);
                                    }
                                    return null;
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
