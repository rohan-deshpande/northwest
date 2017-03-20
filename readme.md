# Northwest

#### CLI & micro-framework for building NW.js apps with the JavaScript boilerplate of your choice

> Journey to the north west child, there, you will find solace.

## Installation

```
npm install -g northwest
```

## Quickstart

This example uses [`create-react-app`](https://github.com/facebookincubator/create-react-app) via the `northwest seed cmd` command. You can also [`seed`](#seed) from a git repository or an npm package.

```
npm install -g northwest
northwest make my-app
cd my-app
northwest seed cmd "create-react-app src"
npm run start --prefix src | npm run dev -- m=http://localhost:3000
```

## Why?

[NW.js](http://nwjs.io) is a great tool for releasing JavaScript apps for desktop, but it doesn't really care _how_ to build your app (nor should it!).

**Northwest** provides a way to `make` your NW.js app, and `seed` it from a source of your choice. You can currently seed from a git repository, an npm package or a whitelisted command. It also gives you some tools to `dev` with your chosen seed inside the NW.js app runtime giving you access to node modules and things like the user's file system. You also get built-in scripts to `release` your app for Mac, Linux & Windows in various flavours.

## But... Electron?

Electron is no doubt an excellent alternative to NW.js with a huge community behind it and a lot of support. However, it lacks some features which NW.js provides, namely better [source code protection](http://docs.nwjs.io/en/latest/For%20Users/Advanced/Protect%20JavaScript%20Source%20Code/) options. The Electron team has continually stated that this goes against the goals of Electron and they will not be offering it in the near future. So basically, if you want source code protection for your desktop JavaScript app, NW.js is currently the only tool to provide it out of the box. 

## Understanding NW.js

It's recommended that you've got at least a basic understanding of NW.js before using **Northwest**, here's some parts of the documentation that are must-reads:

* [Getting started with NW.js](http://docs.nwjs.io/en/latest/For%20Users/Getting%20Started/)
* [Manifest-format](http://docs.nwjs.io/en/latest/References/Manifest%20Format/#manifest-format)
* [JavaScript contexts in NW.js](http://docs.nwjs.io/en/latest/For%20Users/Advanced/JavaScript%20Contexts%20in%20NW.js/)
* [Protect JavaScript Source Code](http://docs.nwjs.io/en/latest/For%20Users/Advanced/Protect%20JavaScript%20Source%20Code/)

## Mildly Opinionated

**Northwest** is a mildly opinionated tool. It is designed for convenience and to increase productivity, but in order to achieve this, it makes some assumptions about your JavaScript app. Most of these can be overcome but if you're app is not setup in a certain way, it may require more tinkering to get things to work as intended. Here's a short summary of things to note:

* Your `seed` should have a build / compile step which will generate single files for `css` and `javascript` _or_ run development within a dev server such as [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/)
* Your app should work with bundled assets and not need to pull things in from locations which won't exist on user's systems when you `release` (unless these are loaded at runtime via requests)
* You should probably be using [Babel](http://babeljs.io) to transpile your source code to take advantage of ES6/7 features, this is not a requirement, but it is recommended

## Structure

```
app/
  assets/
    css/
      app.css
    js/
      app.js
    {static}
  index.html
  package.json
releases/
src/
.editorconfig
.gitignore
package.json
README.md
```

### `app`

Contains your [NW.js manifest](http://docs.NW.js.io/en/latest/References/Manifest%20Format/#quick-start). When you `npm run dev` this is the default directory that is used, however you can configure some manifest properties before running NW.js when using this script, check the [dev](#dev) docs for more on this. When you `npm run release` this is the directory that will be used as your build by default. Again, this is also configurable by passing flags to the `release` command, for more info checkout the [release](#release) docs.

The default `index.html` includes the `assets/css/app.css` and `assets/js/app.js` files and will watch/reload the app when these files change. If your `src` is using a task runner like `gulp` or `grunt` to build your app, you should save your compiled files to these locations.

Remember, NW.js is your "chrome" now, so if you have an `index.html` entry point in your `src` and you aren't serving one from a local webserver, your `src/path/to/index.html` file will need to be migrated to `app/index.html`.

### `releases`

Stores shippable releases of your application for whatever operating system you specified with the [`npm run release`](#release) command.

### `src`

Your JavaScript app. Populated via the [`northwest seed`](#seed) command.

## API

### Commands

These commands become globally available once you `npm install -g northwest`.

#### `northwest make <app-name>`

usage:

```
northwest make my-app
```

This command makes your NW.js app with the scaffolding described in the [structure](#structure) section.

#### `northwest seed <platform> <seed>`

usage:

```
cd my-app
northwest seed git https://github.com/lukewilde/phaser-js-boilerplate
```

Seeding creates the JavaScript source for your app. You get three different ways in which to seed your app, all of which will populate your `src` directory with the desired source files. You will also have a module, `Nw` placed in the `src` directory which can be imported by your seed to gain access to node & NW.js objects and methods. Check the 

##### Arguments

`<platform>`

This argument defines the platform which you will seed from, there are three choices 

* `git` - seeds from a git repository 
* `npm` - seeds from an npm package 
* `cmd` - seeds from a whitelisted command

`<seed>`

The repository (url), package (npm package name) or command you wish to seed from. In the case of using commands to seed, you can only choose from the following supported commands

* `create-react-app`
* `vue`
* `ng`

If you would like more commands to be supported, please open a PR. 

### Scripts

These commands are available from inside any `northwest` app and are included in your `package.json` after you run `northwest make <app-name>`.

#### `npm run dev -- <arguments>`

Runs the NW.js app with the installed version of NW.js. You can pass a number of arguments to this script to configure the NW.js manifest before starting the app.

##### Arguments

Each argument needs to be appended after `npm run dev --`, delimited by spaces and set with `=` eg.,

```
npm run dev -- main=index.html static=../src/media
```

Arguments which affect the manifest will be saved and do not need to be passed again when running `dev`.

* `main`, `m`
    * Sets the `main` property of the app's manifest. Must be a path to an `index.html` file or URL to a location serving one. If you set this to a URL, the `node-remote` of your manifest file will also be set to `URL/*`. Defaults to `index.html`
* `css`, `c`
    * Copies the `.css` file located at the supplied path to `app/assets/css/app.css`. This file is watched by `app/index.html` for changes which will trigger an app reload.
* `js`, `j`
    * Copies the `.js` file located at the supplied path to `app/assets/js/app.js`. This file is watched by `app/index.html` for changes which will trigger an app reload.
* `static`, `st`
    * The path to your seed's static files (images, fonts, sounds etc.,). This entire directory will be copied to `app/assets/{static}` where `{static}` is the name of the directory where your static files are stored.
* `version`, `v`
    * The version of your app, will set the `version` property of the app's manifest. Defaults to `0.0.1`.

#### `npm run release -- <app> <manifest> <nwbuild>`

This will create releases for the OS of your choice using the [`nwjs-builder`](https://github.com/evshiron/nwjs-builder) package. 

##### Arguments

Each argument needs to be appended after `npm run release --`, delimited by spaces and set with `=` eg.,

```
npm run release -- app=src/build manifest=app/release.package.json
```

If you wish to pass custom arguments to `nwjs-builder` simply append these after `nwbuild=` eg,.

```
npm run release -- nwbuild=-p win32,win64,osx32,osx64,linux32,linux64 --executable-name "My App"
```

* `app`, `a`
	* The path to the app to release, defaults to `./app` but can be any directory containing an `index.html` file, for example `src/build`
* `manifest`, `m`
	* The path to the `package.json` to use as the NW.js manifest file. Defaults to `./app/package.json`. **NOTE!** the `main` property of the manifest will **always** be set to `index.html` when releasing. 
* `nwbuild`, `n`
	* Prefix to delimit any custom [`nwjs-builder`](https://github.com/evshiron/nwjs-builder#usage) arguments you wish to pass 

#### Advanced Usage

If your `seed` has scripts of its own, such as `npm run dev` and you get sick of running both one after the other, feel free to modify your app's scripts to accomodate. For example, if you wanted to start an app created with `create-react-app` and dev a `northwest` app at the same time, you could modify the `northwest` dev script to

```
"dev": "npm run start --prefix src | northwest dev -- m=http://localhost:3000"

```

In the above example, the `main` property of the NW.js manifest will be saved after the first time you've run this command, so the above could be shortened to

```
"dev": "npm run start --prefix src | northwest dev"
```

The same approach can be taken for releasing. If you have some presets which you always want to release with, simply update the `release` script to suit your means eg,.