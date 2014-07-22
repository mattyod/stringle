# stringting [![NPM version](http://img.shields.io/npm/v/stringting.svg)](https://www.npmjs.org/package/stringting)

**very alpha**

String build tool for internationalisation i18n.

## Quick overview

### Take a template like:

```

html
  head
    title __(app.title)
  body
    h1 __(app.heading)
    p __(app.intro)

```

run ```stringting```

### And generate a translations file like:

```

{
  app: {
    title: {
      locations: ['app.jade:3'],
      msgid: "__(app.title)",
      msgstr: "",
      comments: ""
    },
    heading: {
      locations: ['app.jade:5'],
      msgid: "__(app.heading)",
      msgstr: "",
      comments: ""
    },
    intro: {
      locations: ['app.jade:6'],
      msgid: "__(app.intro)",
      msgstr: "",
      comments: ""
    }
  }
}

```

### Then add some text for your keys like:

```

{
  app: {
    title: {
      locations: ['app.jade:3'],
      msgid: "__(app.title)",
      msgstr: "Demo site",
      comments: ""
    },
    heading: {
      locations: ['app.jade:5'],
      msgid: "__(app.heading)",
      msgstr: "Demonstrating Stringting",
      comments: ""
    },
    intro: {
      locations: ['app.jade:6'],
      msgid: "__(app.intro)",
      msgstr: "Just a quick little demo.",
      comments: ""
    }
  }
}

```

Run ```stringting``` again and get a template like:

```

html
  head
    title Demo site
  body
    h1 Demonstrating Stringting
    p Just a quick little demo.

```

## Set up

To run stringting you will need a ```.stringtingrc``` file at your project root.

The minimum settings you will need to run a build are:

### src

Path to your master templates. e.g.

```

"src": "src/templates"

```

### translations

Path to your json translation files. e.g.

```

"translations": "src/translations"

```

### locales

The locales to map translations and production templates to. e.g.

```

"locales": ["dev", "en", "fr"]

```

### templates

Destination folder for your final compiled templates.

```

"templates": "views"

```

### All together

So your finished ```.strintingrc``` file would look something like:

```

{
  "src": "src/templates",
  "translations": "src/translations",
  "locales": ["dev", "en"],
  "templates": "views"
}

```

## Running it

If you have Stringting installed as a project dependency you will most likely want an npm or gulp task that runs the command:

```

node node_modules/stringting/bin/stringting

```

Or you might have it installed globally then you can just run:

```

stringting

```
