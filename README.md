# Lume Plugin - Inclusive Language

This plugin is inspired by the 11ty Inclusive Language plugin.

## Options

- words: string[] | string - List of uninclusive language to avoid, passing a string only works if it is comma separated.
- templateFormats: string[] - Which file formats should be checked __In Progress__
- padding: number - Used to show the context of the non-inclusive language is

## Example Usage

The bare minimum:

```ts
site.use(InclusiveLanguagePlugin());
```


With all options:

```ts
site.use(InclusiveLanguagePlugin({
    words: [ 'poopyhead', 'dingus', 'numbnuts', 'ur mom' ],
    templateFormats: [ 'njk', 'html' ],
    padding: 20
}))
```

To include the defaults with your own words:

```ts
site.use(InclusiveLanguagePlugin({
    words: [ ...InclusiveLanguagePlugin.defaultWords, 'dingbat', 'loose cannon', 'pretty boi' ]
}))
```

## Testing

You can see the results by running `deno task lume` in your terminal.

*I'm not against setting up actual tests, but isn't a priority for me. If you would like to include some, open up a PR and we can talk about it :)*