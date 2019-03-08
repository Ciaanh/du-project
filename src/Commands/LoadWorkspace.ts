'use strict';

import Configuration from "../utils/configuration";

export default class LoadWorkspace {

    public static executeCommand() {
        console.log('launched load default workspace');

        if (Configuration.hasDefaultWorkspace()) {
            let defaultWorspace = Configuration.defaultWorkspace();
        }
    }
}