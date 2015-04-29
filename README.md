# Protagonist

A [Twine](http://twinery.org/) with power!

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
4. Paste this URL into the text box and click the +Add button:
   `https://raw.githubusercontent.com/evanwalsh/protagonist/v1.0.0-alpha/dist/format.js`

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

- `story` (Story): Parent Story object of this passage
- `element` (jQuery element): jQuery representation of the source HTML element
- `id` (number): Twine ID number of the passage
- `name` (string): Name of the passage
- `tags` (array[string]): All tags added to the passage
- `source` (string): Raw HTML source

**Functions**

- `render()` (string): HTML output of the passage's Markdown source

#### story

**Properties**

- `element` (jQuery element): jQuery representation of the source HTML element
- `name` (string): Name of the story
- `startPassageID` (number): Twine ID number of the first passage
- `IFID` (string): [IFID](http://ifdb.tads.org/help-ifid) of the story
- `creator` (string): Name of the software that output the story
- `creatorVersion` (string): Version of the creator software
- `history` (array[number]): All previous passages visited by the player, by ID
- `state` (object): Custom story data set during play
- `currentCheckpoint` (string): Name of the last checkpoint visited by the player
- `atCheckpoint` (boolean): True if currently at a checkpoint passage
- `config` (object): Custom data set at the start of play, but can change
- `passages` (array[Passage]): All passages within the story
- `serialized` (string): JSON representation of the player's current progress
- `saveData` (object): Progress retrieved that has been saved previously
- `previousPassage` (Passage): The passage visited before the current one
- `nextPassage` (Passage): The passage visited after the current one
- `helpers` (object): All the helpers available inside of a passage's context

**Functions**

- `getPassage(query:string|number)` (Passage): Retrieves the Passage object for
  a passage by either its name or ID number
- `goToPassage(query:string|number)` (void): Navigates the player to a passage
  by either its name or ID number
- `showPassage(query:string|number)` (string): Get a passage's rendered output
  by either its name or ID number
- `checkpoint(name:string)` (void): Manually trigger a checkpoint and change the
  window's title to match the `name` provided
- `save()` (boolean): Save the player's current progress to the browser's local
  storage
- `restore()` (boolean): Restore the player's saved progress
- `reset()` (boolean): Reset the player's progress by removing all saved data

#### state

#### config

By default, this will be an object with just a `darkTheme` attribute. However,
any configuration set in your CONFIG passage will be parsed and added to this.

**Properties**

- `darkTheme` (boolean):

#### link(text:string, passage:string|number)

```
<%= link('Go outside', 'Outside') %>

<%= link('Go to the passage with ID #2', 2) %>
```

#### showLink(text:string, passage:string|number)

```
<%= showLink('Look outside', 'Outside') %>

<%= showLink('Look at passage ID #2', 2) %>
```

#### show(passage:string|number)

```
<%= show('Outside') %>

<%= show(2) %>
```

#### goTo(passage:string|number)

```
<%= goTo('Outside') %>

<%= goTo(2) %>
```

#### random(choices:array)

```
<%= random(['thing 1', 'thing 2', 'thing 3']) %>

<%= random('thing 1', 'thing 2', 'thing 3') %>
```

#### randomNumber(min:number, max:number, floating:boolean)

```
<%= randomNumber(0, 100) %>

<%= randomNumber(0, 1, true) %>
```

#### toggleHeader()

#### toggleFooter()

#### toggleDarkTheme()

#### previousPassage

#### nextPassage

#### saveLink(text:string)

```
<%= saveLink('[save]') %>
```

#### restoreLink(text:string)

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

## Special Thanks

- [Chris Klimas](http://chrisklimas.com/) for [Twine](http://twinery.org/) and
  [Snowman](https://bitbucket.org/klembot/snowman-2)
- [Javy Gwaltney](http://antagonizethehorn.com/) for showing me the power of Twine