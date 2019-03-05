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

    public static LoadFromFiles(files: ProjectFileDescription): EventContainer {
        let events = new EventContainer();
        events.eventList = new Array<Event>();

        files.subItems.forEach(item => {
            if (item.diskItemType == DiskItemType.File
                && item.itemType == ProjectItemType.Event) {
                events.eventList = Event.LoadFromFiles(item);
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

        return `<h3>Events</h3><ul class="events">${eventsString}</ul><br/>`;
    }

    public toFileContent(): string {
        return this.eventList.map((value) => {
            return value.toFileContent();
        }).join("\n");
    }

}