# fantasy-football
> A better way to fantasy football

## Summary

A Chrome extension for a better ESPN Fantasy Football experience

# Installation


Make sure you have [NodeJS](https://nodejs.org/en/) installed on your system.
The install instructions are on the node website.

To verify npm and node is working run:

```
% npm -v
2.14.4
% node -v
v4.1.1
```

### Building the Project

The source files are generated using `Grunt.js`

To build the source run:

```
grunt build
```

When developing use: 

```
grunt watch
```

to automatically watch for changed files and rebuild the soruce.

The generated files are placed in a `dist` folder where they can be used by the Chrome extension.


### Install the Chrome Extension

To install the chrome extension onto your system go to [chrome://extensions](chrome://extensions). Check the `Developer mode` box, and click the `Load unpacked extension...` button.

Navigate the the root directory of the project (The directory where `manifest.json` resides)

You can also follow Google's guide [here](https://developer.chrome.com/extensions/getstarted#unpacked)


# Running

The extension will automatically run on all webpages matching `https://games.espn.go.com/*`

It most commonly works on your fantasy team home page, you can visit [https://games.espn.go.com/ffl/clubhouse?leagueId=1437163&teamId=7&seasonId=2015](https://games.espn.go.com/ffl/clubhouse?leagueId=1437163&teamId=7&seasonId=2015) to view my team.
