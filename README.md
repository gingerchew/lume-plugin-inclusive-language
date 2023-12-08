# Lume Plugin - Inclusive Language

This plugin is inspired by the 11ty Inclusive Language plugin.

## Options

- words: `string[]` - List of uninclusive language to avoid
- search: `string[]` - Limit the pages checked by passing search queries.
- padding: `number` - Used to show the context of the non-inclusive language is.

## Example Usage

The bare minimum:

```ts
site.use(InclusiveLanguagePlugin());
```

With all options:

```ts
site.use(InclusiveLanguagePlugin({
    words: [ 'dingus', 'numbnuts', 'ur mom' ],
    search: [ 'type=post' ],
    padding: 20
}))
```

To include the defaults with your own words:

```ts
import { InclusiveLanguagePlugin, defaultWords } from 'path/to/plugin';
site.use(InclusiveLanguagePlugin({
    words: [ ...defaultWords, 'dingbat', 'loose cannon' ]
}))
```

## Testing

You can see the results by running `deno task lume` in your terminal.

*I'm not against setting up actual tests, but isn't a priority for me. If you would like to include some, open up a PR and we can talk about it :)*

## TODO

- [ ] Give the code a second over (Could be preemptive)
- [ ] Improve typing (could be preemptive)
