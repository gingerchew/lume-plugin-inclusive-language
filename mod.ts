import { Data, Page } from "lume/core/file.ts";
import Site from "lume/core/site.ts";

import { underlineIt, warnIt } from "./utils.ts";
import { inclusiveLanguage } from "./inclusiveLanguage.ts";


export interface InclusiveLanguageOptions {
    words: string[];
    search: string[];
    padding: number;
}

export const defaultWords = ["simply","obviously","basically","of course","clearly","just","everyone knows","however","easy"];

const defaults = {
    words: defaultWords,
    search: [],
    padding: 30,
};

function process(pages:Page[]|Data[], { words, padding }:Pick<InclusiveLanguageOptions, 'words' | 'padding'>) {
    
    for (let page of pages) {
        // There has to be a way to do this better
        if ((page as Data).page) {
            const tmpPage = (page as Data).page;
            page = tmpPage as Page;
        }
        
        if (page.content instanceof Uint8Array) {
            throw new Error('InclusiveLanguage plugin does not support Uint8Array. Know how to implement it? Reach out at gingerchew/lume-plugin-inclusive-language');
        }
        
        if (!page.src) return;
        
        const content = page.content as string;
        const url = page.src.path;
        
        if (!url) return;
        
        const found = inclusiveLanguage(content, words, padding);
    
        if (found.length) {
            /** If anything is found, list them in the console */
            console.warn(warnIt(`${underlineIt('Inclusive Language Linter')}: (${url})`));
            console.warn('    '+found.join('\n'+'    '));
        }
    }

}


function InclusiveLanguagePlugin(options?: Partial<InclusiveLanguageOptions>) {
    let {
        words,
        search, 
        padding
    } = {
        ...defaults,
        ...options
    } as InclusiveLanguageOptions;

    if (!Array.isArray(words) && typeof words === 'string') {
        const wordsStr = words as string;
        words = wordsStr.split(',');
    }
    
    if (!Array.isArray(search)) throw new Error('opts.search must be a type string[]');


    return (site:Site) => {
        if (search.length) {
            site.addEventListener('afterRender', () => {
                for (const query of search) {
                    const pages = site.search.pages(query);
                    process(pages, { words, padding });
                }
            })
        } else {
            site.process('*', (pages) => process(pages, { words, padding }));
        }
    }
}

export { InclusiveLanguagePlugin }