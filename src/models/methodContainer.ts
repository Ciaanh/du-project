'use strict';

import Method from './method'

export default class MethodContainer {
    private methodList: Array<Method>;

    constructor() {
        this.methodList = new Array<Method>();
    }

    public get(): Array<Method> {
        return this.methodList;
    }

    public add(method: Method) {
        this.methodList.push(method);
    }
}