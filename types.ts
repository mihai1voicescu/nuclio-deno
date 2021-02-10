import {ConnLogger} from "./logger.ts";

interface Trigger {
    class: string;
    kind: string;
}

/**
 * event is the current event, it contains the following:
 * - body: Buffer (*not* string, use event.body.toString())
 * - content_type: string
 * - trigger:
 * - class: string
 * - kind: string
 * - fields: object of field->value
 * - headers: object of header->value
 * - id: string
 * - method: string
 * - path: string
 * - size: int
 * - timestamp: Date
 * - url: string
 */
interface ReqEvent<Body, Fields extends Record<string, any> = {}, Headers extends Record<string, any> = {}> {
    body: Body;
    content_type: string;
    trigger: Trigger;
    fields: Fields;
    headers: Headers;
    id: string;
    method: string;
    path: string;
    size: number;
    timestamp: Date;
    url: string;
}

/**
 * context is current call context, it contains the following:
 *    callback:
 *        Callback function, *must* be used to return response.
 *        Response can be one of:
 *        - string
 *        - Buffer
 *        - array of [status, body]
 *        - context.Response object
 *
 *        Response:
 *        A response. Has the following fields
 *        - body
 *        - headers
 *        - content_type
 *        - status_code
 *
 *        Logging functions:
 *        - logger.error: function(message)
 *        - logger.warn: function(message)
 *        - logger.info: function(message)
 *        - logger.debug: function(message)
 *        - logger.errorWith: function(message, with_data)
 *        - logger.warnWith: function(message, with_data)
 *        - logger.infoWith: function(message, with_data)
 *        - logger.debugWith: function(message, with_data)
 */
interface Context {
    logger: ConnLogger
}

interface iResponse<Body, Headers extends Record<string, any> = {}> {
    body: Body;
    headers: Headers;
    status_code: number;
}

interface Handler<Body, Headers extends Record<string, any> = {}, Fields extends Record<string, any> = {}> {
    new(): Handler<Body, Headers, Fields>;

    run(context: Context, event: ReqEvent<Body, Fields, Headers>): Promise<iResponse<any, any>>;
}

const enum MESSAGE_TYPE {
    LOG = 'l',
    RESPONSE = 'r',
    METRIC = 'm',
    START = 's',
}

const enum LOG_LEVEL {
    DEBUG = 'debug',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
}

export {
    Trigger,
    ReqEvent,
    MESSAGE_TYPE,
    LOG_LEVEL,
    iResponse,
    Context,
    Handler,
    ConnLogger
}
