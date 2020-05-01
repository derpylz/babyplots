"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var scene_1 = require("@babylonjs/core/scene");
var engine_1 = require("@babylonjs/core/Engines/engine");
var arcRotateCamera_1 = require("@babylonjs/core/Cameras/arcRotateCamera");
var hemisphericLight_1 = require("@babylonjs/core/Lights/hemisphericLight");
var math_1 = require("@babylonjs/core/Maths/math");
var boxBuilder_1 = require("@babylonjs/core/Meshes/Builders/boxBuilder");
var advancedDynamicTexture_1 = require("@babylonjs/gui/2D/advancedDynamicTexture");
var controls_1 = require("@babylonjs/gui/2D/controls");
var screenshotTools_1 = require("@babylonjs/core/Misc/screenshotTools");
var chroma_js_1 = __importDefault(require("chroma-js"));
var Label_1 = require("./Label");
var Axes_1 = require("./Axes");
function matrixMax(matrix) {
    var maxRow = matrix.map(function (row) { return Math.max.apply(Math, row); });
    var max = Math.max.apply(null, maxRow);
    return max;
}
exports.matrixMax = matrixMax;
var Plot = (function () {
    function Plot(scene, coordinates, colorVar, size, legendData) {
        this._size = 1;
        this._scene = scene;
        this._coords = coordinates;
        this._coordColors = colorVar;
        this._size = size;
        this.legendData = legendData;
    }
    Plot.prototype.updateSize = function () { };
    Plot.prototype.update = function () { return false; };
    return Plot;
}());
exports.Plot = Plot;
var ImgStack_1 = require("./ImgStack");
var PointCloud_1 = require("./PointCloud");
var Surface_1 = require("./Surface");
var HeatMap_1 = require("./HeatMap");
Array.prototype.min = function () {
    if (this.length > 65536) {
        var r_1 = this[0];
        this.forEach(function (v, _i, _a) { if (v < r_1)
            r_1 = v; });
        return r_1;
    }
    else {
        return Math.min.apply(null, this);
    }
};
Array.prototype.max = function () {
    if (this.length > 65536) {
        var r_2 = this[0];
        this.forEach(function (v, _i, _a) { if (v > r_2)
            r_2 = v; });
        return r_2;
    }
    else {
        return Math.max.apply(null, this);
    }
};
function getUniqueVals(source) {
    var length = source.length;
    var result = [];
    var seen = new Set();
    outer: for (var index = 0; index < length; index++) {
        var value = source[index];
        if (seen.has(value))
            continue outer;
        seen.add(value);
        result.push(value);
    }
    return result;
}
exports.getUniqueVals = getUniqueVals;
exports.PLOTTYPES = {
    'pointCloud': ['coordinates', 'colorBy', 'colorVar'],
    'surface': ['coordinates', 'colorBy', 'colorVar'],
    'heatMap': ['coordinates', 'colorBy', 'colorVar'],
    'imgStack': ['values', 'indices', 'attributes']
};
function isValidPlot(plotData) {
    if (plotData["plotType"]) {
        var pltType = plotData["plotType"];
        if (exports.PLOTTYPES.hasOwnProperty(pltType)) {
            for (var i = 0; i < exports.PLOTTYPES[pltType].length; i++) {
                var prop = exports.PLOTTYPES[pltType][i];
                if (plotData[prop] === undefined) {
                    console.log('missing ' + prop);
                    return false;
                }
            }
            return true;
        }
        else {
            console.log('unrecognized plot type');
            return false;
        }
    }
    else {
        for (var i = 0; i < exports.PLOTTYPES['imgStack'].length; i++) {
            var prop = exports.PLOTTYPES['imgStack'][i];
            if (plotData[prop] === undefined) {
                console.log('missing ' + prop);
                return false;
            }
        }
        return true;
    }
}
exports.isValidPlot = isValidPlot;
var Plots = (function () {
    function Plots(canvasElement, backgroundColor) {
        if (backgroundColor === void 0) { backgroundColor = "#ffffffff"; }
        this._showLegend = true;
        this._hasAnim = false;
        this._downloadObj = {};
        this.plots = [];
        this.turntable = false;
        this.rotationRate = 0.01;
        this.fixedSize = false;
        this.ymax = 0;
        this.R = false;
        this._backgroundColor = backgroundColor;
        this.canvas = document.getElementById(canvasElement);
        this._engine = new engine_1.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new scene_1.Scene(this._engine);
        this.camera = new arcRotateCamera_1.ArcRotateCamera("Camera", 0, 0, 10, math_1.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.inputs.attached.keyboard.detachControl(this.canvas);
        this.camera.wheelPrecision = 50;
        this.scene.clearColor = math_1.Color4.FromHexString(backgroundColor);
        this._hl1 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, 1, 0), this.scene);
        this._hl1.diffuse = new math_1.Color3(1, 1, 1);
        this._hl1.specular = new math_1.Color3(0, 0, 0);
        this._hl2 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, -1, 0), this.scene);
        this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
        this._hl2.specular = new math_1.Color3(0, 0, 0);
        this._labelManager = new Label_1.LabelManager(this.canvas, this.scene, this.ymax, this.camera);
        this.scene.registerBeforeRender(this._prepRender.bind(this));
        this.scene.registerAfterRender(this._afterRender.bind(this));
    }
    Plots.prototype.fromJSON = function (plotData) {
        if (plotData["turntable"] !== undefined) {
            this.turntable = plotData["turntable"];
        }
        if (plotData["rotationRate"] !== undefined) {
            this.rotationRate = plotData["rotationRate"];
        }
        if (plotData["backgroundColor"]) {
            this._backgroundColor = plotData["backgroundColor"];
            this.scene.clearColor = math_1.Color4.FromHexString(this._backgroundColor);
        }
        if (plotData["coordinates"] && plotData["plotType"] && plotData["colorBy"]) {
            this.addPlot(plotData["coordinates"], plotData["plotType"], plotData["colorBy"], plotData["colorVar"], {
                size: plotData["size"],
                colorScale: plotData["colorScale"],
                showLegend: plotData["showLegend"],
                fontSize: plotData["fontSize"],
                fontColor: plotData["fontColor"],
                legendTitle: plotData["legendTitle"],
                legendTitleFontSize: plotData["legendTitleFontSize"],
                showAxes: plotData["showAxes"],
                axisLabels: plotData["axisLabels"],
                axisColors: plotData["axisColors"],
                tickBreaks: plotData["tickBreaks"],
                showTickLines: plotData["showTickLines"],
                tickLineColors: plotData["tickLineColors"],
                folded: plotData["folded"],
                foldedEmbedding: plotData["foldedEmbedding"],
                foldAnimDelay: plotData["foldAnimDelay"],
                foldAnimDuration: plotData["foldAnimDuration"],
                colnames: plotData["colnames"],
                rownames: plotData["rownames"]
            });
        }
        else if (plotData["values"] && plotData["indices"] && plotData["attributes"]) {
            this.addImgStack(plotData["values"], plotData["indices"], plotData["attributes"], {
                size: plotData["size"],
                colorScale: plotData["colorScale"],
                showLegend: plotData["showLegend"],
                fontSize: plotData["fontSize"],
                fontColor: plotData["fontColor"],
                legendTitle: plotData["legendTitle"],
                legendTitleFontSize: plotData["legendTitleFontSize"],
                showAxes: plotData["showAxes"],
                axisLabels: plotData["axisLabels"],
                axisColors: plotData["axisColors"],
                tickBreaks: plotData["tickBreaks"],
                showTickLines: plotData["showTickLines"],
                tickLineColors: plotData["tickLineColors"]
            });
        }
        if (plotData["labels"]) {
            this._labelManager.fixed = true;
            var labelData = plotData["labels"];
            for (var i = 0; i < labelData.length; i++) {
                var label = labelData[i];
                if (label["text"] && label["position"]) {
                    this._labelManager.addLabel(label["text"], label["position"]);
                }
            }
        }
    };
    Plots.prototype.createButtons = function () {
        var buttonBar = document.createElement("div");
        buttonBar.className = "button-bar";
        var jsonBtn = document.createElement("div");
        jsonBtn.className = "button";
        jsonBtn.onclick = this._downloadJson.bind(this);
        var jsonBtnImg = document.createElement("img");
        jsonBtnImg.src = "./lib/babyplots-0.1/content/to_json.png";
        jsonBtn.appendChild(jsonBtnImg);
        buttonBar.appendChild(jsonBtn);
        var labelBtn = document.createElement("div");
        labelBtn.className = "button";
        labelBtn.onclick = this._labelManager.toggleLabelControl.bind(this._labelManager);
        var labelBtnImg = document.createElement("img");
        labelBtnImg.src = "./lib/babyplots-0.1/content/labels.png";
        labelBtn.appendChild(labelBtnImg);
        buttonBar.appendChild(labelBtn);
        buttonBar.style.top = this.canvas.clientTop + 5 + "px";
        buttonBar.style.left = this.canvas.clientLeft + 5 + "px";
        this.canvas.parentNode.appendChild(buttonBar);
        this._buttonBar = buttonBar;
    };
    Plots.prototype._downloadJson = function () {
        var dlElement = document.createElement("a");
        this._downloadObj["labels"] = this._labelManager.exportLabels();
        var dlContent = encodeURIComponent(JSON.stringify(this._downloadObj));
        dlElement.setAttribute("href", "data:text/plain;charset=utf-8," + dlContent);
        dlElement.setAttribute("download", "babyplots_export.json");
        dlElement.style.display = "none";
        document.body.appendChild(dlElement);
        dlElement.click();
        document.body.removeChild(dlElement);
    };
    Plots.prototype._prepRender = function () {
        if (this.turntable) {
            this.camera.alpha += this.rotationRate;
        }
        if (this._hasAnim) {
            this._hasAnim = this.plots[0].update();
            if (!this._hasAnim) {
                var boundingBox = this.plots[0].mesh.getBoundingInfo().boundingBox;
                var rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ];
                var rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ];
                var rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ];
                this._axes.axisData.range = [rangeX, rangeY, rangeZ];
                this._axes.update(this.camera, true);
            }
        }
        if (this._axes) {
            this._axes.update(this.camera);
        }
        this._labelManager.update();
    };
    Plots.prototype._afterRender = function () { };
    Plots.prototype._cameraFitPlot = function (xRange, yRange, zRange) {
        var xSize = xRange[1] - xRange[0];
        var ySize = yRange[1] - yRange[0];
        var zSize = zRange[1] - zRange[0];
        var box = boxBuilder_1.BoxBuilder.CreateBox('bdbx', {
            width: xSize, height: ySize, depth: zSize
        }, this.scene);
        var xCenter = xRange[1] - xSize / 2;
        var yCenter = yRange[1] - ySize / 2;
        var zCenter = zRange[1] - zSize / 2;
        box.position = new math_1.Vector3(xCenter, yCenter, zCenter);
        this.camera.position = new math_1.Vector3(xCenter, ySize, zCenter);
        this.camera.target = new math_1.Vector3(xCenter, yCenter, zCenter);
        var radius = box.getBoundingInfo().boundingSphere.radiusWorld;
        var aspectRatio = this._engine.getAspectRatio(this.camera);
        var halfMinFov = this.camera.fov / 2;
        if (aspectRatio < 1) {
            halfMinFov = Math.atan(aspectRatio * Math.tan(this.camera.fov / 2));
        }
        var viewRadius = Math.abs(radius / Math.sin(halfMinFov));
        this.camera.radius = viewRadius;
        box.dispose();
        this.camera.alpha = 0;
        this.camera.beta = 1;
        this.ymax = yRange[1];
    };
    Plots.prototype.addImgStack = function (values, indices, attributes, options) {
        if (options === void 0) { options = {
            size: 1,
            colorScale: null,
            showLegend: true,
            fontSize: 11,
            fontColor: "black",
            legendTitle: null,
            legendTitleFontSize: 16,
            showAxes: [false, false, false],
            axisLabels: ["X", "Y", "Z"],
            axisColors: ["#666666", "#666666", "#666666"],
            tickBreaks: [2, 2, 2],
            showTickLines: [[false, false], [false, false], [false, false]],
            tickLineColors: [["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"]]
        }; }
        this._downloadObj = {
            values: values,
            indices: indices,
            attributes: attributes,
            size: options.size,
            colorScale: options.colorScale,
            showLegend: options.showLegend,
            fontSize: options.fontSize,
            fontColor: options.fontColor,
            legendTitle: options.legendTitle,
            legendTitleFontSize: options.legendTitleFontSize,
            showAxes: options.showAxes,
            axisLabels: options.axisLabels,
            axisColors: options.axisColors,
            tickBreaks: options.tickBreaks,
            showTickLines: options.showTickLines,
            tickLineColors: options.tickLineColors,
            turntable: this.turntable,
            rotationRate: this.rotationRate,
            labels: [],
            backgroundColor: this._backgroundColor
        };
        var legendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: ""
        };
        legendData.fontSize = options.fontSize;
        legendData.fontColor = options.fontColor;
        legendData.legendTitle = options.legendTitle;
        legendData.legendTitleFontSize = options.legendTitleFontSize;
        var plot = new ImgStack_1.ImgStack(this.scene, values, indices, attributes, legendData, options.size);
        this.plots.push(plot);
        this._updateLegend();
        this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;
        return this;
    };
    Plots.prototype.addPlot = function (coordinates, plotType, colorBy, colorVar, options) {
        if (options === void 0) { options = {
            size: 1,
            colorScale: "Oranges",
            showLegend: true,
            fontSize: 11,
            fontColor: "black",
            legendTitle: null,
            legendTitleFontSize: 16,
            showAxes: [false, false, false],
            axisLabels: ["X", "Y", "Z"],
            axisColors: ["#666666", "#666666", "#666666"],
            tickBreaks: [2, 2, 2],
            showTickLines: [[false, false], [false, false], [false, false]],
            tickLineColors: [["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"]],
            folded: false,
            foldedEmbedding: null,
            foldAnimDelay: null,
            foldAnimDuration: null,
            colnames: null,
            rownames: null
        }; }
        this._downloadObj = {
            coordinates: coordinates,
            plotType: plotType,
            colorBy: colorBy,
            colorVar: colorVar,
            size: options.size,
            colorScale: options.colorScale,
            showLegend: options.showLegend,
            fontSize: options.fontSize,
            fontColor: options.fontColor,
            legendTitle: options.legendTitle,
            legendTitleFontSize: options.legendTitleFontSize,
            showAxes: options.showAxes,
            axisLabels: options.axisLabels,
            axisColors: options.axisColors,
            tickBreaks: options.tickBreaks,
            showTickLines: options.showTickLines,
            tickLineColors: options.tickLineColors,
            folded: options.folded,
            foldedEmbedding: options.foldedEmbedding,
            foldAnimDelay: options.foldAnimDelay,
            foldAnimDuration: options.foldAnimDuration,
            turntable: this.turntable,
            rotationRate: this.rotationRate,
            colnames: options.colnames,
            rownames: options.rownames,
            labels: [],
            backgroundColor: this._backgroundColor
        };
        var coordColors = [];
        var legendData;
        var rangeX;
        var rangeY;
        var rangeZ;
        this._hasAnim = options.folded;
        switch (colorBy) {
            case "categories":
                var groups = colorVar;
                var uniqueGroups = getUniqueVals(groups);
                var nColors = uniqueGroups.length;
                var colors = chroma_js_1.default.scale(chroma_js_1.default.brewer.Paired).mode('lch').colors(nColors);
                if (options.colorScale && chroma_js_1.default.brewer.hasOwnProperty(options.colorScale)) {
                    colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[options.colorScale]).mode('lch').colors(nColors);
                }
                else {
                    options.colorScale = "Paired";
                }
                for (var i = 0; i < nColors; i++) {
                    colors[i] += "ff";
                }
                for (var i = 0; i < colorVar.length; i++) {
                    var colorIndex = uniqueGroups.indexOf(groups[i]);
                    coordColors.push(colors[colorIndex]);
                }
                legendData = {
                    showLegend: options.showLegend,
                    discrete: true,
                    breaks: uniqueGroups,
                    colorScale: options.colorScale
                };
                break;
            case "values":
                var min_1 = colorVar.min();
                var max_1 = colorVar.max();
                var colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer.Oranges).mode('lch');
                if (options.colorScale && chroma_js_1.default.brewer.hasOwnProperty(options.colorScale)) {
                    colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[options.colorScale]).mode('lch');
                }
                else {
                    options.colorScale = "Oranges";
                }
                var norm = colorVar.slice().map(function (v) { return (v - min_1) / (max_1 - min_1); });
                coordColors = norm.map(function (v) { return colorfunc_1(v).alpha(1).hex("rgba"); });
                legendData = {
                    showLegend: options.showLegend,
                    discrete: false,
                    breaks: [min_1.toString(), max_1.toString()],
                    colorScale: options.colorScale
                };
                break;
            case "direct":
                for (var i = 0; i < colorVar.length; i++) {
                    var cl = colorVar[i];
                    cl = chroma_js_1.default(cl).hex();
                    if (cl.length == 7) {
                        cl += "ff";
                    }
                    coordColors.push(cl);
                }
                legendData = {
                    showLegend: false,
                    discrete: false,
                    breaks: [],
                    colorScale: ""
                };
                break;
        }
        legendData.fontSize = options.fontSize;
        legendData.fontColor = options.fontColor;
        legendData.legendTitle = options.legendTitle;
        legendData.legendTitleFontSize = options.legendTitleFontSize;
        var plot;
        var scale;
        switch (plotType) {
            case "pointCloud":
                plot = new PointCloud_1.PointCloud(this.scene, coordinates, coordColors, options.size, legendData, options.folded, options.foldedEmbedding, options.foldAnimDelay, options.foldAnimDuration);
                var boundingBox = plot.mesh.getBoundingInfo().boundingBox;
                rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ];
                rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ];
                rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ];
                scale = [1, 1, 1];
                break;
            case "surface":
                plot = new Surface_1.Surface(this.scene, coordinates, coordColors, options.size, legendData);
                rangeX = [0, coordinates.length];
                rangeZ = [0, coordinates[0].length];
                rangeY = [0, options.size];
                scale = [
                    1,
                    matrixMax(coordinates) / options.size,
                    1
                ];
                break;
            case "heatMap":
                plot = new HeatMap_1.HeatMap(this.scene, coordinates, coordColors, options.size, legendData);
                rangeX = [0, coordinates.length];
                rangeZ = [0, coordinates[0].length];
                rangeY = [0, options.size];
                scale = [
                    1,
                    matrixMax(coordinates) / options.size,
                    1
                ];
                break;
        }
        this.plots.push(plot);
        this._updateLegend();
        var axisData = {
            showAxes: options.showAxes,
            static: true,
            axisLabels: options.axisLabels,
            range: [rangeX, rangeY, rangeZ],
            color: options.axisColors,
            scale: scale,
            tickBreaks: options.tickBreaks,
            showTickLines: options.showTickLines,
            tickLineColor: options.tickLineColors,
            showPlanes: [false, false, false],
            planeColor: ["#cccccc88", "#cccccc88", "#cccccc88"],
            plotType: plotType,
            colnames: options.colnames,
            rownames: options.rownames
        };
        this._axes = new Axes_1.Axes(axisData, this.scene, plotType == "heatMap");
        this._cameraFitPlot(rangeX, rangeY, rangeZ);
        return this;
    };
    Plots.prototype._updateLegend = function () {
        if (this._legend) {
            this._legend.dispose();
        }
        var legendData = this.plots[0].legendData;
        var n;
        var breakN = 20;
        if (legendData.showLegend) {
            var advancedTexture = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateFullscreenUI("UI");
            var grid = new controls_1.Grid();
            advancedTexture.addControl(grid);
            var legendWidth = 0.2;
            if (legendData.discrete) {
                n = legendData.breaks.length;
                if (n > breakN * 2) {
                    legendWidth = 0.4;
                }
                else if (n > breakN) {
                    legendWidth = 0.3;
                }
            }
            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
            if (legendData.legendTitle && legendData.legendTitle !== "") {
                grid.addRowDefinition(0.1);
                grid.addRowDefinition(0.85);
                grid.addRowDefinition(0.05);
            }
            else {
                grid.addRowDefinition(0.05);
                grid.addRowDefinition(0.9);
                grid.addRowDefinition(0.05);
            }
            if (legendData.legendTitle) {
                var legendTitle = new controls_1.TextBlock();
                legendTitle.text = legendData.legendTitle;
                legendTitle.color = legendData.fontColor;
                legendTitle.fontWeight = "bold";
                if (legendData.legendTitleFontSize) {
                    legendTitle.fontSize = legendData.legendTitleFontSize + "px";
                }
                else {
                    legendTitle.fontSize = "20px";
                }
                legendTitle.verticalAlignment = controls_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
                legendTitle.horizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                grid.addControl(legendTitle, 0, 1);
            }
            if (!legendData.discrete) {
                var innerGrid_1 = new controls_1.Grid();
                innerGrid_1.addColumnDefinition(0.2);
                innerGrid_1.addColumnDefinition(0.8);
                innerGrid_1.addRowDefinition(1);
                grid.addControl(innerGrid_1, 1, 1);
                var nBreaks = 265;
                var labelSpace = 0.05;
                if (this.canvas.height < 70) {
                    nBreaks = 10;
                    labelSpace = 0.45;
                }
                else if (this.canvas.height < 130) {
                    nBreaks = 50;
                    labelSpace = 0.3;
                }
                else if (this.canvas.height < 350) {
                    nBreaks = 100;
                    labelSpace = 0.15;
                }
                var colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(nBreaks);
                var scaleGrid = new controls_1.Grid();
                for (var i = 0; i < nBreaks; i++) {
                    scaleGrid.addRowDefinition(1 / nBreaks);
                    var legendColor_1 = new controls_1.Rectangle();
                    legendColor_1.background = colors[colors.length - i - 1];
                    legendColor_1.thickness = 0;
                    legendColor_1.width = 0.5;
                    legendColor_1.height = 1;
                    scaleGrid.addControl(legendColor_1, i, 0);
                }
                innerGrid_1.addControl(scaleGrid, 0, 0);
                var labelGrid = new controls_1.Grid();
                labelGrid.addColumnDefinition(1);
                labelGrid.addRowDefinition(labelSpace);
                labelGrid.addRowDefinition(1 - labelSpace * 2);
                labelGrid.addRowDefinition(labelSpace);
                innerGrid_1.addControl(labelGrid, 0, 1);
                var minText = new controls_1.TextBlock();
                minText.text = parseFloat(legendData.breaks[0]).toFixed(4).toString();
                minText.color = legendData.fontColor;
                minText.fontSize = legendData.fontSize + "px";
                minText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                labelGrid.addControl(minText, 2, 0);
                var maxText = new controls_1.TextBlock();
                maxText.text = parseFloat(legendData.breaks[1]).toFixed(4).toString();
                maxText.color = legendData.fontColor;
                maxText.fontSize = legendData.fontSize + "px";
                maxText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                labelGrid.addControl(maxText, 0, 0);
            }
            else {
                var innerGrid = new controls_1.Grid();
                if (n > breakN * 2) {
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                }
                else if (n > breakN) {
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                }
                else {
                    innerGrid.addColumnDefinition(0.2);
                    innerGrid.addColumnDefinition(0.8);
                }
                for (var i = 0; i < n && i < breakN; i++) {
                    if (n > breakN) {
                        innerGrid.addRowDefinition(1 / breakN);
                    }
                    else {
                        innerGrid.addRowDefinition(1 / n);
                    }
                }
                grid.addControl(innerGrid, 1, 1);
                var colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(n);
                for (var i = 0; i < n; i++) {
                    var legendColor = new controls_1.Rectangle();
                    legendColor.background = colors[i];
                    legendColor.thickness = 0;
                    legendColor.width = legendData.fontSize + "px";
                    legendColor.height = legendData.fontSize + "px";
                    if (i > breakN * 2 - 1) {
                        innerGrid.addControl(legendColor, i - breakN * 2, 4);
                    }
                    else if (i > breakN - 1) {
                        innerGrid.addControl(legendColor, i - breakN, 2);
                    }
                    else {
                        innerGrid.addControl(legendColor, i, 0);
                    }
                    var legendText = new controls_1.TextBlock();
                    legendText.text = legendData.breaks[i].toString();
                    legendText.color = legendData.fontColor;
                    legendText.fontSize = legendData.fontSize + "px";
                    legendText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    if (i > breakN * 2 - 1) {
                        innerGrid.addControl(legendText, i - breakN * 2, 5);
                    }
                    if (i > breakN - 1) {
                        innerGrid.addControl(legendText, i - breakN, 3);
                    }
                    else {
                        innerGrid.addControl(legendText, i, 1);
                    }
                }
            }
            this._legend = advancedTexture;
        }
    };
    Plots.prototype.doRender = function () {
        var _this = this;
        this._engine.runRenderLoop(function () {
            _this.scene.render();
        });
        return this;
    };
    Plots.prototype.resize = function (width, height) {
        if (width !== undefined && height !== undefined) {
            if (this.R) {
                var pad = parseInt(document.body.style.padding.substring(0, document.body.style.padding.length - 2));
                this.canvas.width = width - 2 * pad;
                this.canvas.height = height - 2 * pad;
            }
            else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }
        this._updateLegend();
        this._engine.resize();
        return this;
    };
    Plots.prototype.thumbnail = function (size, saveCallback) {
        screenshotTools_1.ScreenshotTools.CreateScreenshot(this._engine, this.camera, size, saveCallback);
    };
    Plots.prototype.dispose = function () {
        this.scene.dispose();
        this._engine.dispose();
    };
    return Plots;
}());
exports.Plots = Plots;
//# sourceMappingURL=babyplots.js.map