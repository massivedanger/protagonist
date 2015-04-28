# Protagonist

A story format for [Twine](http://twinery.org/)

Special thanks to [Snowman](https://bitbucket.org/klembot/snowman-2) for inspiration and code.

## Features

- Markdown support in passages
- Embedded JavaScript support in passages
- Easy-to-use helpers for getting story data, linking to passages, showing passages
  inline, and much more
- Light and dark theme
- Global header and footer support
- Save and load progress

## Installing

1. Launch Twine 2
2. Click on the Formats link in the Twine 2 sidebar
3. In the dialog that opens, click on the tab Add a New Format
4. Paste this URL into the text box and click the +Add button: `https://raw.githubusercontent.com/evanwalsh/protagonist/v1.0.0-alpha/dist/format.js`

## Usage

### Markdown

Markdown parsing is provided via [marked](https://github.com/chjj/marked). It supports
[GitHub Flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)
and no non-default options are set.

One addition to the Markdown parsing is support for Twine-style passage links with the
format of `[[Link Text|Passage Name]]` or `[[Link Text->Passage Name]]`. The alternate
`[[Passage Name<-Link Text]]` format is not supported.

### Embedded JavaScript

All passages support embedded JavaScript logic. That means you can do things like
this in your passage:

```
<% number = 1 %>

Hello! Your lucky number is <%= number %>
```

Anything within `<%` and `%>` is executed, but not shown in the browser. Anything within
`<%=` and `%>` is executed and then the result is shown to the user. To learn more
about how this works under the hood, check out [lodash's template function](https://lodash.com/docs#template).

### Checkpoints/saving

Protagonist has built-in progress saving. To allow the use of the forward and back
buttons of the browser and to change the window's title upon reaching certain passages,
just add the "checkpoint" tag to any passage. You can also use it as a helper like this:

```
<% story.checkpoint('Name of the checkpoint goes here') %>
```

If you'd like to save all the progress, you'll need to call `story.save()` in your
passage. As a convenience, you can specify a `saveLink` somewhere. I recommended
in a header or footer passage (see Meta Passages for more info). To learn more about
the `saveLink`, see Helpers.

### Helpers

To assist with common Twine usage, a set of default helpers are supplied that you
can use with the embedded JavaScript support.

#### passage

Access to the current passage's data, including:

**Properties**

- `story`:
- `element`:
- `id`:
- `name`:
- `tags`:
- `source`:

#### story

**Properties**

- `element`:
- `name`:
- `startPassageID`:
- `IFID`:
- `creator`:
- `creatorVersion`:
- `history`:
- `state`:
- `currentCheckpoint`:
- `atCheckpoint`:
- `config`:
- `passages`:
- `serialized`:
- `saveData`:

**Functions**

- `getPassage(query)`:
- `goToPassage(query)`:
- `showPassage`:
- `checkpoint`:
- `save`:
- `restore`:
- `reset`:
- `previousPassage`:
- `nextPassage`:
- `helpers`:

#### state

#### config

- `darkTheme`:

#### link

```
<%= link('Go outside', 'Outside') %>

<%= link('Go to the passage with ID #2', 2) %>
```

#### showLink

```
<%= showLink('Look outside', 'Outside') %>

<%= showLink('Look at passage ID #2', 2) %>
```

#### show

```
<%= show('Outside') %>

<%= show(2) %>
```

#### goTo

```
<%= goTo('Outside') %>

<%= goTo(2) %>
```

#### random

```
<%= random(['thing 1', 'thing 2', 'thing 3']) %>

<%= random('thing 1', 'thing 2', 'thing 3') %>
```

#### randomNumber

```
<%= randomNumber(0, 100) %>

<%= randomNumber(0, 1, true) %>
```

#### toggleHeader

#### toggleFooter

#### toggleDarkTheme

#### previousPassage

#### nextPassage

#### saveLink

```
<%= saveLink('[save]') %>
```

#### restoreLink

```
<%= restoreLink('[restore]') %>
```

### Meta passages

A global header and footer passage can be shown at the top and bottom of your story.
All you have to do is create a passage named `HEADER` or `FOOTER` and they'll be
displayed (at the top and bottom respectively).

A passage named CONFIG can contain any valid [TOML](https://github.com/toml-lang/toml)
and it'll be parsed and stored within `story.config`, which can be accessed from
any passage. This is recommended for any data that won't change *or* for anything
that all passages will need right from the start.

## Contributing

- Check out the latest master to make sure the feature hasn't been implemented or
  the bug hasn't been fixed yet.
- Check out the issue tracker to make sure someone already hasn't requested it
  and/or contributed it.
- Fork the project.
- Start a feature/bugfix branch.
- Commit and push until you are happy with your contribution.
- Make sure to add tests for it. This is important so I don't break it in a future
  version unintentionally.
- Try not to change the version number in your commits. If you want to have your
  own version, that's fine. Just have the version change be a separate commit I
  can cherry-pick around.