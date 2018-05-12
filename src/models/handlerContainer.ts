'use strict';

import Handler from './handler'
import ProjectFileDescription from '../extensionCore/projectFileDescription';
import { ProjectItemType, DiskItemType } from '../extensionCore/enums';

export default class HandlerContainer {
    private handlerList: Array<Handler>;

    constructor() {
        this.handlerList = new Array<Handler>();
    }

    public static LoadFromFiles(slotContainer: ProjectFileDescription): HandlerContainer {
        let handlers = new HandlerContainer();

        slotContainer.subItems.forEach(slot => {
            if (slot.diskItemType == DiskItemType.Folder && slot.itemType == ProjectItemType.Slot) {
                const slotInfos = slot.name.split("_");
                const slotKey = Number.parseInt(slotInfos[1]);

                slot.subItems.forEach(subItem => {
                    if (subItem.diskItemType == DiskItemType.File && subItem.itemType == ProjectItemType.Handler) {
                        let newHandler = Handler.LoadFromFiles(subItem, slotKey);
                        if (newHandler) handlers.addHandlerToList(newHandler);
                    }
                });
            }
        });

        return handlers;
    }

    public static LoadFromJson(handlersFromJson: any): HandlerContainer {
        let handlers = new HandlerContainer();

        handlers.handlerList = new Array<Handler>();
        handlersFromJson.forEach(handler => {
            handlers.handlerList.push(Handler.LoadFromJson(handler));
        });
        return handlers;
    }

    public addHandlerToList(handler: Handler) {
        this.handlerList.push(handler);
    }

    public getHandlerList(): Array<Handler> {
        return this.handlerList;
    }

    public getHandlersBySlotKey(slotKey: number): HandlerContainer {
        let result = new HandlerContainer();

        this.handlerList.forEach(handler => {
            if (handler.filter.slotKey == slotKey) {
                result.addHandlerToList(handler);
            }
        });

        return result;
    }

    public toJsonObject(): any {
        let jsonObject = this.handlerList.map((value) => {
            return value.toJsonObject();
        });
        return jsonObject;
    }

    public toHtml(): string {
        let handlersString = "";

        let tmp = this.handlerList;

        this.handlerList.forEach(handler => {
            handlersString += handler.toHtml();
        });
        return `<h3>Handlers</h3><ul class="filters">${handlersString}</ul>`;
    }
}