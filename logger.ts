import {StringConn} from "./conn.ts";
import {LOG_LEVEL, MESSAGE_TYPE} from "./types.ts";


class ConnLogger {
    readonly #conn: StringConn;

    public error: (message: string, withData?: any) => void;
    public warn: (message: string, withData?: any) => void;
    public info: (message: string, withData?: any) => void;
    public debug: (message: string, withData?: any) => void;
    public errorWith: (message: string, withData?: any) => void;
    public warnWith: (message: string, withData?: any) => void;
    public infoWith: (message: string, withData?: any) => void;
    public debugWith: (message: string, withData?: any) => void;

    constructor(conn: StringConn) {
        this.#conn = conn;

        this.error = this.log.bind(this, LOG_LEVEL.ERROR);
        this.warn = this.log.bind(this, LOG_LEVEL.WARNING);
        this.info = this.log.bind(this, LOG_LEVEL.INFO);
        this.debug = this.log.bind(this, LOG_LEVEL.DEBUG);
        this.errorWith = this.log.bind(this, LOG_LEVEL.ERROR);
        this.warnWith = this.log.bind(this, LOG_LEVEL.WARNING);
        this.infoWith = this.log.bind(this, LOG_LEVEL.INFO);
        this.debugWith = this.log.bind(this, LOG_LEVEL.DEBUG);
    }

    writeMessageToProcessor(messageType: string, messageContents: string) {
        this.#conn.write(`${messageType}${messageContents}\n`)
    }

    log(level: any, message: string, withData = {}) {
        const datetime = (new Date()).toISOString()
        const record = {
            datetime,
            level,
            message,
            with: withData,
        }
        this.writeMessageToProcessor(MESSAGE_TYPE.LOG, JSON.stringify(record))
    }
}

export {
    ConnLogger
}
