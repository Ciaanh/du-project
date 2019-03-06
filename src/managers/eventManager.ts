'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";
import Event from "../models/event";

export default class EventManager {

    public static LoadFromFiles(events: ProjectFileDescription): Event[] {
        let eventsFromFiles = new Array<Event>();

        let content = events.content.replace(/\r/g, '\n');
        let eventsContent = content.split('\n');

        eventsContent.forEach(item => {
            let event = new Event();
            event.signature = item;
            eventsFromFiles.push(event);
        });

        return eventsFromFiles;
    }

    public static LoadFromJson(eventFromJson: string): Event {
        let event = new Event();
        event.signature = eventFromJson;
        return event;
    }

    public static toJsonObject(event: Event): any {
        return event.signature;
    }

    public static toHtml(event: Event): string {
        let eventString =
            `<li class="event">
<span class="signature">${event.signature}</span> 
</li>`;

        return eventString;
    }

    public static toFileContent(event: Event): string {
        return event.signature;
    }
}