'use strict';

import * as vscode from 'vscode';
import HandlerContainer from '../models/handlerContainer';
import SlotContainer from '../models/slotContainer';
import EventContainer from '../models/eventContainer';
import MethodContainer from '../models/methodContainer';
import ProjectFileDescription from './projectFileDescription';
import { ProjectItemType } from './enums';

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
                        project.slots = SlotContainer.LoadFromFiles(item);
                        project.handlers = HandlerContainer.LoadFromFiles(item);
                        break;
                    case ProjectItemType.EventContainer:
                        project.events = EventContainer.LoadFromFiles(item);
                        break;
                    case ProjectItemType.MethodContainer:
                        project.methods = MethodContainer.LoadFromFiles(item);
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
            project.slots = SlotContainer.LoadFromJson(projectAsJson['slots']);
        }

        if (projectAsJson.hasOwnProperty('handlers')) {
            project.handlers = HandlerContainer.LoadFromJson(projectAsJson['handlers']);
        }

        if (projectAsJson.hasOwnProperty('methods')) {
            project.methods = MethodContainer.LoadFromJson(projectAsJson['methods']);
        }

        if (projectAsJson.hasOwnProperty('events')) {
            project.events = EventContainer.LoadFromJson(projectAsJson['events']);
        }

        return project;
    }

    public toJsonObject(): any {
        let jsonObject = {
            "slots": this.slots.toJsonObject(),
            "handlers": this.handlers.toJsonObject(),
            "methods": this.methods.toJsonObject(),
            "events": this.events.toJsonObject()
        };
        return jsonObject;
    }

    public toHtml(): string {
        let slotsString = `${this.slots.toHtml(this.handlers)}`;
        let methodsString = `${this.methods.toHtml()}`;
        let eventsString = `${this.events.toHtml()}`;

        return `${slotsString} ${methodsString} ${eventsString}`;
    }
}