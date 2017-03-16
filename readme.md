# Northwest

#### CLI & micro-framework for building NWJS apps with the JavaScript boilerplate of your choice

> Journey to the north west child, there, you will find solace.

## Why?

[NWJS](http://nwjs.io) is a great tool for releasing JavaScript apps for desktop, but it doesn't really care _how_ to build your app (nor should it!).

**Northwest** provides a way to `make` your NWJS app, and `seed` it from a source of your choice. You can currently seed from a git repository, an npm package or a whitelisted command. It also gives you some tools to `dev` with these seeds - some of which will use local development servers with live reloading, others which will simply use task runners -  into your NWJS development environment. You also get built-in scripts to `release` your app for Mac, Linux & Windows in various flavours.

## Understanding NWJS

It's recommended that you've got at least a basic understanding of NJWS before using **Northwest**, here's some parts of the documentation that are must-reads:

* [Getting started with NWJS]
* [Manifest-format]
* [JavaScript contexts in NWJS]

## Mildly Opinionated

**Northwest** is a mildly opinionated tool. It is designed for convenience and to increase productivity, but in order do to this, it makes some assumptions about your JavaScript app. Most of these can be overcome but if you're app is not setup in a certain way, it may require more tinkering to get things to work as intended. Here's a short summary of things to note:

* Your `seed` should have a build / compile step which will generate single files for `css` and `javascript` _or_ run development within a dev server such as [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/).
* Your app will be able to work with packaged assets and not need to pull things in from locations which won't exist on user's systems when you `release` (unless these are loaded at runtime via requests).
* You should probably be using [Babel](http://babeljs.org) to transpile your source code to take advantage of ES6/7 features

## Quickstart

This example uses [`create-react-app`] via the `northwest seed cmd` command. You can also `seed` from a git repository or an npm package. See the [`seed`](#seed) documentation for more info.

```
npm install -g northwest
northwest make my-app
cd my-app
northwest seed cmd "create-react-app src"
npm run start --prefix src | npm run dev -- m=http://localhost:3000
```

## Structure

```
├── app
    └── assets
        └── css
        └── js
        └── {static}
    └── index.html
    └── package.json
├── builds
├── releases
└── src
```

### `app`

Contains your [NWJS manifest](http://docs.nwjs.io/en/latest/References/Manifest%20Format/#quick-start). When you `npm run dev` this is the directory that is used, however you can configure some manifest properties while using this script, check the [dev script](#dev) for more on this. When you `npm run release` this is the directory that will be used as your build by default. Again, this is also configurable by passing flags to the `release` command, for more info checkout the [release script](#release) documentation.

The default `index.html` includes the `assets/css/app.css` and `assets/js/app.js` files and will watch/reload the app when these files change. If your `src` is using a task runner like `gulp` or `grunt` to build your app, you should pipe your files to these locations.

### `builds`

Stores your builds and is populated by `npm run release -- build=path/to/app`. In the `northwest` sense, a build is a directory that contains all the things your NWJS app needs to run. Your NWJS manifest (`app/package.json`) will be copied to the created build directory by the `release` command. Builds are named and versioned via the `name` and `version` properties in your `app/package.json` file.

### `releases`

Releases of your application for whatever operating system you specified with the `npm run release` command.

### `src`

Your JavaScript app. Populated via the `northwest seed` command.

## API

### Commands

These commands become globally available once you `npm install -g northwest`.

#### `northwest make`

This command makes your NWJS app. The `src` direcrtory will be empty and needs to be seeded from a source of your choice.

#### `northwest seed <platform> <seed>`

### Scripts

These commands are available from inside any `northwest` app and are included in your `package.json` after you run `northwest make <app-name>`.

#### `npm run dev -- <arguments>`

Runs the NWJS app with the installed version of NWJS. You can pass a number of arguments to this script to configure the NWJS manifest before starting the app.

##### Arguments

Each argument needs to be appended after `npm run dev --`, delimited by spaces and set with `=` eg.,

```
npm run dev -- main=index.html static=../src/media
```

* `main`, `m`
    * Sets the `main` property of the app's manifest. Must be a path to an `index.html` file or URL to a location serving one. If you set this to a URL, the `node-remote` of your manifest file will also be set to `<url>/*`. Defaults to `index.html`
* `css`, `c`
    * Copies the `.css` file located at the supplied path to `app/assets/css/app.css`. This file is watched by `app/index.html` for changes which will trigger an app reload.
* `js`, `c`
    * Copies the `.js` file located at the supplied path to `app/assets/js/app.js`. This file is watched by `app/index.html` for changes which will trigger an app reload.
* `static`, `st`
    * The path to your seed's static files (images, fonts, sounds etc.,). This entire directory will be copied to `app/assets/{static}` where `{static}` is the name of the directory where your static files are stored.
* `version`, `v`
    * The version of your app, will set the `version` property of the app's manifest. Defaults to `0.0.1`.

#### `npm run release -- <arguments>`
