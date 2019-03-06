'use strict';

import ArgContainer from "./argContainer";

export default class Filter {
    slotKey: number;
    signature: string;
    args: ArgContainer;

    constructor() {
        this.args = new ArgContainer();
    }
}