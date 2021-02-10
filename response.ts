import {iResponse} from "./types.ts";

class Response implements iResponse<any> {
    constructor(public readonly body = null as any,
                public readonly headers = {},
                public readonly content_type = 'application/json',
                public readonly status_code = 200,
                public readonly body_encoding = 'text') {
        if (typeof this.body !== 'string')
            this.body = JSON.stringify(this.body);
    }
}

export {
    Response
}
