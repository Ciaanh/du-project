'use strict';

import Handler from './handler'

export default class HandlerContainer {
    private handlerList: Array<Handler>;

    constructor() {
        this.handlerList = new Array<Handler>();
    }

    public add(handler: Handler) {
        this.handlerList.push(handler);
    }

    public get(): Array<Handler> {
        return this.handlerList;
    }

    public getBySlotKey(slotKey: number): HandlerContainer {
        let result = new HandlerContainer();

        this.handlerList.forEach(handler => {
            if (handler.filter.slotKey == slotKey) {
                result.add(handler);
            }
        });

        return result;
    }
}