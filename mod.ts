import { Page, Site } from "lume/core.ts";

interface Options {
    words: string[] | string;
    templateFormats: string[];
    padding: number;
}

const warnIt = (msg:string) => {
    return `\u001B[33m${msg}\u001B[39m`
}

const underline = {
    OPEN: '\u001B[4m',
    CLOSE: '\u001B[24m'
};

/** Adapted from chalk */
const underlineIt = (word: string) => {
    const {
        OPEN,
        CLOSE
    } = underline;
    return OPEN + word + CLOSE;
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


const defaults = {
    words: "simply,obviously,basically,of course,clearly,just,everyone knows,however,easy",
    templateFormats: ['md'],
    padding: 30,
};

function InclusiveLanguagePlugin(options?: Options) {
    const opts = {
        ...defaults,
        ...options
    };

    opts.templateFormats = opts.templateFormats.map(fmt => fmt[0] !== '.' ? '.'+fmt : fmt);
    return (site:Site) => {
        let words:string[];
        if (Array.isArray(opts.words)) {
            words = opts.words
        } else if (typeof opts.words === 'string') {
            words = opts.words.split(',');
        }

        if (!Array.isArray(opts.templateFormats)) throw new Error('opts.templateFormats must be a type string[]');
        
        site.process(opts.templateFormats, (page:Page) => {
            
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
            let content = page.content;
            if (content instanceof Uint8Array) {
                throw new Error('inclusiveLanguage plugin does not support Uint8Array. Know how to implement it? Reach out at gingerchew/lume-plugin-inclusive-language');
            }
            
            content = content as string;
            
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
                console.warn(warnIt(`Inclusive Language: (${url})`));
                console.warn('    '+found.join('\n'+'    '));
            }

        })
    }
}

InclusiveLanguagePlugin.prototype.defaultWords = defaults.words;

export { InclusiveLanguagePlugin }