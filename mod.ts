import { Page, Site } from "lume/core.ts";

interface Options {
    words: string[] | string;
    templateFormats: string[];
    padding: number;
}

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

const makeRegex = (word:string) => new RegExp(`\\b(${word})\\b`, 'gi');

function inclusiveLanguage(content: string, words:string[], padding:number) {
    const found = [];

    for (let word of words) {
        word = word.trim();

        const regex = makeRegex(word);

        if (content.match(regex)) {
            const split = content.split(regex);

            for (let i = 0, l = split.length; i + 1 < l; i += 2) {
                /** Found message should be 30 characters, the word underlined, then 30 more characters */
                found.push(split[i].substr(-padding) + warnIt(underlineIt(word)) + split[i+2].substring(0, padding));
            }
        }
    }

    return found;
}
export const defaultWords = "simply,obviously,basically,of course,clearly,just,everyone knows,however,easy".split(',')

const defaults = {
    words: defaultWords,
    templateFormats: ['md'],
    padding: 30,
};

function InclusiveLanguagePlugin(options?: Partial<Options>) {
    const opts = {
        ...defaults,
        ...options
    };

    let words:string[];
    if (Array.isArray(opts.words)) {
        words = opts.words
    } else if (typeof opts.words === 'string') {
        words = opts.words.split(',');
    }
    
    if (!Array.isArray(opts.templateFormats)) throw new Error('opts.templateFormats must be a type string[]');

    opts.templateFormats = opts.templateFormats.map(fmt => fmt[0] !== '.' ? '.'+fmt : fmt);

    return (site:Site) => {
        
        site.process(opts.templateFormats, (page:Page) => {
            
            
            if (page.content instanceof Uint8Array) {
                throw new Error('inclusiveLanguage plugin does not support Uint8Array. Know how to implement it? Reach out at gingerchew/lume-plugin-inclusive-language');
            }
            
            const content = page.content as string;
            
            /**
             * @TODO Fix the file format checking
             * 
             * since page.src.path doesn't *necessarily* include
             * the file format of the source file, the method 
             * used in 11ty's version of InclusiveLanguage
             * won't run at all
             * 
             * For now, this is bypassed by just passing
             * true by default
             */
            let shouldCheck = true;
            const url = page.src.path;
            if (!url) return;
            
            for (const format of opts.templateFormats) {
                if (url.indexOf(format) !== -1) {
                    shouldCheck = true;
                    break;
                }
            }
            
            if (!shouldCheck) return;

            const found = inclusiveLanguage(content, words, opts.padding);

            if (found.length) {
                /** If anything is found, list them in the console */
                console.warn(warnIt(`${underlineIt('Inclusive Language Linter')}: (${url})`));
                console.warn('    '+found.join('\n'+'    '));
            }

        })
    }
}

export { InclusiveLanguagePlugin }