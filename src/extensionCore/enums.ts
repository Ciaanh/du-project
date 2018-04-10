'use strict';

export enum FileType{
    File,
    Folder,
    Undefined
}

export enum ProjectItemType{
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

export enum GenerationStatus{
    Succeed,
    ProjectAlreadyExists,
    ElementAlreadyExists,
    UnknownError
}