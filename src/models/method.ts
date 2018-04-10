import ProjectFileDescription from "../extensionCore/projectFileDescription";

'use strict';

export default class Method {
    
    
    public static LoadFromFiles(files: ProjectFileDescription): Method {
        let method = new Method();
        return method;
    }

    public static LoadFromJson(methodFromJson: any): Method {
        let method = new Method();
        return method;
    }

    public toJsonObject(): any { 
        throw new Error("Method not implemented.");
    }

    public toHtml(): string {
        return "";
    }
}