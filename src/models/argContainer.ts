"use strict";

import Arg from './arg'

export default class ArgContainer {
    private argList: Array<Arg>;

    constructor() {
        this.argList = new Array<Arg>();
    }

    public get(): Array<Arg> {
        return this.argList;
    }

    public add(arg: Arg) {
        this.argList.push(arg);
    }
}