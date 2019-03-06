'use strict';

import HandlerContainer from '../models/handlerContainer';
import SlotContainer from '../models/slotContainer';
import EventContainer from '../models/eventContainer';
import MethodContainer from '../models/methodContainer';
import ProjectFileDescription from './projectFileDescription';
import { ProjectItemType } from './enums';
import SlotContainerManager from '../managers/slotContainerManager';
import MethodContainerManager from '../managers/methodContainerManager';
import EventContainerManager from '../managers/eventContainerManager';
import HandlerContainerManager from '../managers/handlerContainerManager';

export default class DUProject {
    projectName: string;

    slots: SlotContainer;
    handlers: HandlerContainer;
    methods: MethodContainer;
    events: EventContainer;


    public static LoadFromFiles(files: ProjectFileDescription): DUProject {
        let project = new DUProject();
        if (files.itemType == ProjectItemType.Root) {
            project.projectName = files.name;

            files.subItems.forEach(item => {
                switch (item.itemType) {
                    case ProjectItemType.SlotContainer:
                        project.slots = SlotContainerManager.LoadFromFiles(item);
                        project.handlers = HandlerContainerManager.LoadFromFiles(item);
                        break;
                    case ProjectItemType.EventContainer:
                        project.events = EventContainerManager.LoadFromFiles(item);
                        break;
                    case ProjectItemType.MethodContainer:
                        project.methods = MethodContainerManager.LoadFromFiles(item);
                        break;
                    default:
                        break;
                }
            });
            return project;
        }
        return null;
    }

    public static LoadFromJson(projectName: string, projectAsString: string): DUProject {
        let project = new DUProject();

        project.projectName = projectName;
        let projectAsJson = JSON.parse(projectAsString);

        if (projectAsJson.hasOwnProperty('slots')) {
            project.slots = SlotContainerManager.LoadFromJson(projectAsJson['slots']);
        }

        if (projectAsJson.hasOwnProperty('handlers')) {
            project.handlers = HandlerContainerManager.LoadFromJson(projectAsJson['handlers']);
        }

        if (projectAsJson.hasOwnProperty('methods')) {
            project.methods = MethodContainerManager.LoadFromJson(projectAsJson['methods']);
        }

        if (projectAsJson.hasOwnProperty('events')) {
            project.events = EventContainerManager.LoadFromJson(projectAsJson['events']);
        }

        return project;
    }

    public toJsonObject(): any {
        let slotsJson = SlotContainerManager.toJsonObject(this.slots);
        let handlersJson = HandlerContainerManager.toJsonObject(this.handlers);
        let methodsJson = MethodContainerManager.toJsonObject(this.methods);
        let eventsJson = EventContainerManager.toJsonObject(this.events);

        let jsonObject = {
            "slots": slotsJson,
            "handlers": handlersJson,
            "methods": methodsJson,
            "events": eventsJson
        };
        return jsonObject;
    }

    public toHtml(): string {
        let slotsString = `${SlotContainerManager.toHtml(this.slots, this.handlers)}`;
        let methodsString = `${MethodContainerManager.toHtml(this.methods)}`;
        let eventsString = `${EventContainerManager.toHtml(this.events)}`;

        return `${slotsString} ${methodsString} ${eventsString}`;
    }
}