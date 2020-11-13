# babyplots - Easy, fast, interactive 3D visualizations

Babyplots is an easy to use library for creating interactive 3d graphs for exploring and presenting data.

**Find the full documentation [here](https://bp.bleb.li/documentation/js).**

## Usage

You can download the minified babyplots library [here](dist/babyplots.js) and include it in your header.

To display a babyplots visualization, you need a canvas element with an id somewhere in the body of your html file.

```html
<canvas id="babyplot"></canvas>
```

Then you can initialize the Plots object, which stores the settings and data of the visualization:

```javascript
var vis = new Baby.Plots("babyplot", {backgroundColor: "#ffffffff"});
```

The first argument of the constructor is the id of the canvas, the second is an object containing options to customize the appearance of the whole visualization. You can find about the possible options [here](https://bp.bleb.li/documentation/js#plotsObject).

Once you have a Plots object, you can add plots to it. Either manually, from data, or from a JSON object, exported from one of the babyplots implementations (e.g. the [R package](https://bp.bleb.li/documentation/r), or the [Interactive Node Creator](https://bp.bleb.li/documentation/creator)).

```javascript
vis.fromJSON(myPlotData);
```

Lastly, to show the visualization, call the `doRender()` method:

```javascript
vis.doRender();
```

In conclusion, here is a minimal example of how to create a babyplots visualization:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="babyplots.js"></script>
</head>
<body>
  <canvas id="babyplot"></canvas>
  <script>
    var vis = Baby.Plots("babyplot", {backgroundColor:"#ffffffff"});
    vis.fromJSON(myPlotData);
    vis.doRender();
  </script>
</body>
</html>
```

You can see an example in action here: [minimal example](https://derpylz.github.io/babyplots/), and of course on the babyplots homepage: [bp.blebli.de](https://bp.blebli.de).

For more information, head to the complete documentation: [https://bp.bleb.li/documentation/js](https://bp.bleb.li/documentation/js).

## Build instructions

Clone the repository and install it using NPM:

```bash
git clone https://github.com/derpylz/babyplots.git
cd babyplots
npm install
```

To build the library from the TypeScript source files do:

```bash
npm run build
```

To create the minified distribution file do:

```bash
npm run dist
```

## Support, Questions, Feedback, ...

Join our [Discord server](https://discord.gg/bbWxP8q), or submit an issue here in the repository!

## Also see:

Libraries used in babyplots:

* [Babylon.js](https://www.babylonjs.com/), the rendering engine
* [Chroma.js](https://gka.github.io/chroma.js/), the color conversion library
* [CCapture.js](https://github.com/spite/ccapture.js/), for capturing gifs

## Author

Babyplots was created by [Nils Trost](http://nils.blebli.de)

## License

Released under the [Apache 2.0 License](LICENSE).

Find the licenses of the included libraries [here](dist/babyplots.js.LICENSE.txt). Make sure to include this file if you use babyplots in your project.


