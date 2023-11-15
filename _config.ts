import lume from "lume/mod.ts";
import { InclusiveLanguagePlugin, defaultWords } from './mod.ts';


const site = lume({
    emptyDest: true,
    src: './src'
});

site.use(InclusiveLanguagePlugin({
    words: [...defaultWords, 'nincompoop'],
    // uncomment one of the below to test the search feature
    // search: ['type=post']
    // search: ['type=post', 'type=special']
}));

export default site;
