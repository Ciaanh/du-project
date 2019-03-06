'use strict';

import Event from './event'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';

export default class EventContainer {
    private eventList: Array<Event>;

    constructor() {
        this.eventList = new Array<Event>();
    }

    public get(): Array<Event> {
        return this.eventList;
    }

    public add(event: Event) {
        this.eventList.push(event);
    }

    public addRange(events: Event[]) {
        this.eventList.push(...events);
    }
}