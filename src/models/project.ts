'use strict';

import HandlerContainer from './handlerContainer';
import SlotContainer from './slotContainer';
import EventContainer from './eventContainer';
import MethodContainer from './methodContainer';
import { SourceType } from '../utils/enums';
import { Uri } from 'vscode';

export default class Project {
    public sourceType: SourceType;
    public sourceUri: Uri;
    public projectName: string;

    public slots: SlotContainer;
    public handlers: HandlerContainer;
    public methods: MethodContainer;
    public events: EventContainer;


    constructor(name: string, type: SourceType, uri: Uri) {
        this.sourceType = type,
        this.sourceUri = uri;
        this.projectName = name;
    }
}