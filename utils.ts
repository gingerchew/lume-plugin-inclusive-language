
const terminalOptions = {
    UOPEN: 4,
    UCLOSE: 24,
    YOPEN: 33,
    YCLOSE: 39
}

const terminal = new Proxy(terminalOptions, {
    get(target, key:keyof typeof terminalOptions):string {
        return `\u001B[${target[key]}m`;
    }
});

const warnIt = (msg:string) => {
    const {
        YOPEN,
        YCLOSE
    } = terminal;

    return YOPEN + msg + YCLOSE;
}

/** Adapted from chalk */
const underlineIt = (word: string) => {
    const {
        UOPEN,
        UCLOSE
    } = terminal;
    return UOPEN + word + UCLOSE;
}


export {
    underlineIt,
    warnIt
}