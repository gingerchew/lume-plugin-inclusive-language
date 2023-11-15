import lume from "lume/mod.ts";
import { InclusiveLanguagePlugin } from './mod.ts';


const site = lume({
    emptyDest: true,
    src: './src'
});

site.use(InclusiveLanguagePlugin());

export default site;
