import { warnIt, underlineIt } from "./utils.ts";

const makeRegex = (word:string) => new RegExp(`\\b(${word})\\b`, 'gi');

export function inclusiveLanguage(content: string, words:string[], padding:number) {
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