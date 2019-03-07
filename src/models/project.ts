'use strict';

import HandlerContainer from './handlerContainer';
import SlotContainer from './slotContainer';
import EventContainer from './eventContainer';
import MethodContainer from './methodContainer';

export default class Project {
    public projectName: string;

    public slots: SlotContainer;
    public handlers: HandlerContainer;
    public methods: MethodContainer;
    public events: EventContainer;
}