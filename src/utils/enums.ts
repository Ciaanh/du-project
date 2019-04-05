'use strict';

export class Slots {
    public static indexes: Array<number> = [
        -3,
        -2,
        -1,
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ];
}

export enum ProjectErrorReason {
    ProjectUndefined,
    Content
}

export enum SlotErrorReason {
    NotExistDirectory,
    NotExistJson
}

export enum HandlerErrorReason {
    Code,
    Key,
    Filter,
    FilterSlotKey,
    FilterSignature,
    FilterArgs,
    KeyNotDefined,
    SlotNotDefined,
    NotExistFile,
    NotExistJson
}

export enum MethodErrorReason {
    Code,
    Signature,
    NotExistFile,
    NotExistJson
}