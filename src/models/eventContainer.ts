'use strict';

import Event from './event'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { DiskItemType, ProjectItemType } from '../extensionCore/enums';

export default class EventContainer {
    private eventList: Array<Event>;

    constructor() {
        this.eventList = new Array<Event>();
    }

    public getEvents(): Array<Event> {
        return this.eventList;
    }

    public addEvent(event: Event) {
        this.eventList.push(event);
    }

    public static LoadFromFiles(files: ProjectFileDescription): EventContainer {
        let events = new EventContainer();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.File
                && item.itemType == ProjectItemType.Event) {
                events.addEvent(Event.LoadFromFiles(item));
            }
        });

        return events;
    }

    public static LoadFromJson(eventsFromJson: any): EventContainer {
        let events = new EventContainer();

        events.eventList = new Array<Event>();
        eventsFromJson.forEach(event => {
            events.eventList.push(Event.LoadFromJson(event));
        });
        return events;
    }

    public toJsonObject(): any {
        let jsonObject = this.eventList.map((value) => {
            return value.toJsonObject();
        })
        return jsonObject;
    }

    public toHtml(): string {
        let eventsString = "";
        this.eventList.forEach(event => {
            eventsString += event.toHtml();
        });
        return eventsString;
    }
}