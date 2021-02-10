class StringConn implements AsyncIterable<string> {
    readonly #conn: Deno.Conn;

    constructor(conn: Deno.Conn) {
        this.#conn = conn;
    }

    write(str: string) {
        this.#conn.write(new TextEncoder().encode(str));
    }

    writeWithHeader(header: string, str: string) {
        this.write(`${header}${str}\n`);
    }

    async* [Symbol.asyncIterator]() {
        const decoder = new TextDecoder()
        for await (const chunk of Deno.iter(this.#conn)) {
            const str = decoder.decode(chunk);
            yield str;
        }
    }

    close() {
        this.#conn.close();
    }
}

class JSONConn<T = unknown> implements AsyncIterable<string> {
    readonly #conn: StringConn;

    constructor(conn: StringConn | Deno.Conn) {
        if (!(conn instanceof StringConn))
            conn = new StringConn(conn);
        this.#conn = conn;
    }

    write(o: any) {
        this.#conn.write(JSON.stringify(o) + '\n');
    }

    writeWithHeader(header: string, o: any) {
        this.#conn.write(`${header}${JSON.stringify(o)}\n`);
    }

    public get conn() {
        return this.#conn;
    }

    async* [Symbol.asyncIterator]() {
        for await (const chunk of this.#conn) {
            yield JSON.parse(chunk);
        }
    }

    close() {
        this.#conn.close();
    }

    static async* listen<T>(path: string) {
        const listener = Deno.listen({path, transport: 'unix'});

        for await(const conn of listener) {
            yield new JSONConn<T>(conn);
        }
    }
}

export {
    StringConn,
    JSONConn
}