# Northwest

#### CLI & micro-framework for building NWJS apps with the JavaScript boilerplate of your choice 

> Journey to the north west child, there, you will find solace.

## Why?

[NWJS](http://nwjs.io) is a great tool for releasing JavaScript apps for desktop, but it doesn't really care _how_ to build your app (nor should it!). 

**Northwest** provides a way to `make` your NWJS app, and `seed` it from a source of your choice. You can currently seed from a git repository, an npm package or a whitelisted command. It also gives you some tools to plug these seeds - some of which will use local development servers with live reloading, others which will simply use task runners -  into your NWJS development environment. You also get built-in scripts for publishing your app for Mac, Linux & Windows in various flavours. 

## Quickstart

```
npm install -g northwest
northwest make my-app
cd my-app
northwest seed cmd create-react-app src
npm run start --prefix src
npm run dev -- m=http://localhost:3000
```

## Structure

```
├── app
├── src
├── releases
├── .editorconfig
├── index.ejs
├── manifest.json
└── package.json
```

## API

### Scripts

`make`

This command makes your nwjs app. The `src` direcrtory will be empty and needs to be seeded from a source of your choice. 











