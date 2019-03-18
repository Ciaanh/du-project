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

export enum SlotErrorReason {
    NotExistDirectory,
    NotExistJson
}

export enum HandlerErrorReason {
    Code,
    Key,
    Filter,
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

// export enum SourceType {
//     Json,
//     Folder,
//     Undefined
// }

// export enum FileType {
//     Lua,
//     List
// }

// export enum ProjectItemType {
//     Root,
//     Slot,
//     Handler,
//     Method,
//     Event,
//     SlotContainer,
//     MethodContainer,
//     EventContainer,
//     Type,
//     Empty
// }

// export enum GenerationStatus {
//     Succeed,
//     ProjectAlreadyExists,
//     ElementAlreadyExists,
//     UnknownError
// }