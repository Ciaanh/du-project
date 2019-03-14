'use strict';

import ProjectFileDescription from '../models/projectFileDescription';
import { ProjectItemType, SourceType } from '../utils/enums';
import Handler from '../models/handler';
import HandlerContainer from '../models/handlerContainer';
import HandlerManager from './handlerManager';

export default class HandlerContainerManager {
    public static LoadFromFiles(slotContainer: ProjectFileDescription): HandlerContainer {
        let handlers = new HandlerContainer();

        slotContainer.subItems.forEach(slot => {
            if (slot.diskItemType == SourceType.Folder && slot.itemType == ProjectItemType.Slot) {

                slot.subItems.forEach(subItem => {
                    if (subItem.diskItemType == SourceType.Json && subItem.itemType == ProjectItemType.Handler) {
                        let newHandler = HandlerManager.LoadFromFiles(subItem);
                        if (newHandler) handlers.add(newHandler);
                    }
                });
            }
        });

        return handlers;
    }

    public static LoadFromJson(handlersFromJson: any): HandlerContainer {
        let handlers = new HandlerContainer();

        handlersFromJson.forEach(handler => {
            handlers.add(HandlerManager.LoadFromJson(handler));
        });
        return handlers;
    }

    public static toJsonObject(handlerContainer: HandlerContainer): any {
        let jsonObject = handlerContainer.get().map((handler) => {
            return HandlerManager.toJsonObject(handler);
        });
        return jsonObject;
    }

    public static toHtml(handlerContainer: HandlerContainer): string {
        let handlersString = "";

        handlerContainer.get().forEach(handler => {
            handlersString += HandlerManager.toHtml(handler);
        });
        return `<h3>Handlers</h3><ul class="filters">${handlersString}</ul>`;
    }

    public static createHandlers(handlers: HandlerContainer): ProjectFileDescription[] {
        let handlerItems = new Array<ProjectFileDescription>();
        if (handlers) {
            handlers.get().forEach(handler => {
                let item = HandlerManager.defineHandlerFromObject(handler);
                handlerItems.push(item);
            });
        }
        return handlerItems;
    }
}