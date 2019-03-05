'use strict';

import ProjectFileDescription from "../extensionCore/projectFileDescription";

export default class Event {
    signature: string;

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

    public toJsonObject(): any {
        return this.signature;
    }

    public toHtml(): string {
        let eventString =
            `<li class="event">
<span class="signature">${this.signature}</span> 
</li>`;

        return eventString;
    }

    public toFileContent(): string {
        return this.signature;
    }
}