'use strict';

import ModelHelper from '../extensionCore/modelHelper';
import ProjectFileDescription from "../extensionCore/projectFileDescription";


export default class Method {
    signature: string;
    code: string;
    
    public static LoadFromFiles(files: ProjectFileDescription): Method {
        let method = new Method();
        return method;
    }

    public static LoadFromJson(methodFromJson: any): Method {
        let method = new Method();

        if (methodFromJson.hasOwnProperty('code')) {
            method.code = methodFromJson['code'];
        }

        if (methodFromJson.hasOwnProperty('signature')) {
            method.signature = methodFromJson['signature'];
        }

        return method;
    }

    public toJsonObject(): any { 
        let jsonObject = {
            "code": this.code,
            "signature": this.signature,
        };
        return jsonObject;
    }

    public toHtml(): string {

        return `WIP ${ModelHelper.escapeCodeForPreview(this.code)}`;
    }
}