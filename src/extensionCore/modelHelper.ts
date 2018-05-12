'use strict';

export default class ModelHelper {

    public static escapeCodeForPreview(code) {
        let htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };

        let htmlEscaper = /[&<>"'\/]/g;

        return ('' + code)
            .replace(htmlEscaper, function (match) {
                return htmlEscapes[match];
            })
            .replace(/\n/g, '<br/>');
    }
}