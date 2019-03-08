'use strict';

export enum DiskItemType {
    Json,
    Folder,
    Undefined
}

export enum FileType {
    Lua,
    List
}

export enum ProjectItemType {
    Root,
    Slot,
    Handler,
    Method,
    Event,
    SlotContainer,
    MethodContainer,
    EventContainer,
    Type,
    Empty
}

export enum GenerationStatus {
    Succeed,
    ProjectAlreadyExists,
    ElementAlreadyExists,
    UnknownError
}