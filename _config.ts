import lume from "lume/mod.ts";
import { InclusiveLanguagePlugin, defaultWords } from './mod.ts';


const site = lume({
    emptyDest: true,
    src: './src'
});

site.use(InclusiveLanguagePlugin({
    words: [...defaultWords, 'nincompoop']
}));

export default site;
