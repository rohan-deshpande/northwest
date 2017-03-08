[bin](http://blog.npmjs.org/post/118810260230/building-a-simple-command-line-tool-with-npm)
[permissions](https://docs.npmjs.com/getting-started/fixing-npm-permissions)

* app has assets
* src has assets
* we need the src assets to be brought into app automatically
* user identifies their src assets via an asset-map.json
* watcher finds the relevant src files from this asset-map and places them into the user defined assets directory
* it is assumed that the javascript and css files are being assembled into single files by src
* watcher watches the src directories and writes their content to the app assets directory but it simply watches the app assets directory in order to hotload
