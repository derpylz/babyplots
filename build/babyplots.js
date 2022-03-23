"use strict";
/*!
 * babyplots - Easy, fast, interactive 3D visualizations
 *
 * Copyright (c) 2020, Nils Jonathan Trost. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * ---------------------------------------------
 *
 * babyplots includes CCapture.js, released under the following license:
 *
 * CCapture - A library to capture canvas-based animations
 *
 * The MIT License
 *
 * Copyright (c) 2012 Jaume Sanchez Elias
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ---------------------------------------------
 *
 * babyplots includes axios, released under the following license:
 *
 * Copyright (c) 2014-present Matt Zabriskie
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * ---------------------------------------------
 *
 * babyplots includes uuid, released under the following license:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2010-2020 Robert Kieffer and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plots = exports.isValidPlot = exports.PLOTTYPES = exports.getUniqueVals = exports.matrixMin = exports.matrixMax = exports.CoordinatePlot = exports.Plot = exports.CustomLoadingScreen = void 0;
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
var downloadjs_1 = __importDefault(require("downloadjs"));
var uuid_1 = require("uuid");
var logging_1 = require("./utils/logging");
var axios = require('axios').default;
var Label_1 = require("./utils/Label");
var Axes_1 = require("./utils/Axes");
var CustomLoadingScreen = (function () {
    function CustomLoadingScreen(loadingUIText) {
        this.loadingUIText = loadingUIText;
    }
    CustomLoadingScreen.prototype.displayLoadingUI = function () {
    };
    CustomLoadingScreen.prototype.hideLoadingUI = function () {
    };
    return CustomLoadingScreen;
}());
exports.CustomLoadingScreen = CustomLoadingScreen;
var Plot = (function () {
    function Plot(name, shape, scene, legendData, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        this.allLoaded = false;
        this.pickable = false;
        this.name = name;
        this.shape = shape;
        this._scene = scene;
        this.legendData = legendData;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }
    Plot.prototype.goToFrame = function (n) { };
    Plot.prototype.update = function () { return false; };
    Plot.prototype.resetAnimation = function () { };
    Plot.prototype.setLooping = function (looping) { };
    return Plot;
}());
exports.Plot = Plot;
var CoordinatePlot = (function (_super) {
    __extends(CoordinatePlot, _super);
    function CoordinatePlot(name, shape, scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        var _this = _super.call(this, name, shape, scene, legendData, xScale, yScale, zScale) || this;
        _this._size = 1;
        _this.pickable = true;
        _this._coords = coordinates;
        _this._coordColors = colorVar;
        _this._size = size;
        return _this;
    }
    CoordinatePlot.prototype.getPick = function (pickResult) { return null; };
    return CoordinatePlot;
}(Plot));
exports.CoordinatePlot = CoordinatePlot;
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
function matrixMax(matrix) {
    var maxRow = matrix.map(function (row) { return row.max(); });
    var max = maxRow.max();
    return max;
}
exports.matrixMax = matrixMax;
function matrixMin(matrix) {
    var minRow = matrix.map(function (row) { return row.min(); });
    var min = minRow.min();
    return min;
}
exports.matrixMin = matrixMin;
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
var ImgStack_1 = require("./plotTypes/ImgStack");
var ShapeCloud_1 = require("./plotTypes/ShapeCloud");
var PointCloud_1 = require("./plotTypes/PointCloud");
var Surface_1 = require("./plotTypes/Surface");
var HeatMap_1 = require("./plotTypes/HeatMap");
var MeshStream_1 = require("./plotTypes/MeshStream");
var MeshObject_1 = require("./plotTypes/MeshObject");
var Line_1 = require("./plotTypes/Line");
var styleText_1 = require("./utils/styleText");
var SVGs_1 = require("./utils/SVGs");
exports.PLOTTYPES = {
    'pointCloud': ['coordinates', 'colorBy', 'colorVar'],
    'shapeCloud': ['coordinates', 'colorBy', 'colorVar'],
    'surface': ['coordinates', 'colorBy', 'colorVar'],
    'heatMap': ['coordinates', 'colorBy', 'colorVar'],
    'imageStack': ['values', 'indices', 'attributes'],
    'meshObject': ['meshString'],
    'Line': ['coordinates', 'colorBy', 'colorVar']
};
function isValidPlot(plotData) {
    for (var plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
        var plot = plotData["plots"][plotIdx];
        var pltType = plot["plotType"];
        if (exports.PLOTTYPES.hasOwnProperty(pltType)) {
            for (var i = 0; i < exports.PLOTTYPES[pltType].length; i++) {
                var prop = exports.PLOTTYPES[pltType][i];
                if (plot[prop] === undefined) {
                    console.log('Plot ' + plotIdx + ' is missing property:' + prop);
                    return false;
                }
            }
        }
        else {
            console.log('Unrecognized plot type');
            return false;
        }
    }
    return true;
}
exports.isValidPlot = isValidPlot;
var Plots = (function () {
    function Plots(canvasElement, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this._showLegend = true;
        this._hasAnim = false;
        this._loopingAnim = false;
        this._axes = [];
        this._downloadObj = {};
        this._recording = false;
        this._turned = 0;
        this._wasTurning = false;
        this._xScale = 1;
        this._yScale = 1;
        this._zScale = 1;
        this._fsUIDirty = true;
        this._upAxis = "+y";
        this.plots = [];
        this.ymax = 0;
        this.R = false;
        this.Python = false;
        this.shapeLegendTitle = "";
        this.animPaused = false;
        this._uniqID = uuid_1.v4();
        var opts = {
            backgroundColor: "#ffffffff",
            xScale: 1,
            yScale: 1,
            zScale: 1,
            turntable: false,
            rotationRate: 0.01,
            shapeLegendTitle: "",
            upAxis: "+y",
        };
        Object.assign(opts, options);
        this.turntable = opts.turntable;
        this.rotationRate = opts.rotationRate;
        this.shapeLegendTitle = opts.shapeLegendTitle;
        this._backgroundColor = opts.backgroundColor;
        this.canvas = document.getElementById(canvasElement);
        this._engine = new engine_1.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new scene_1.Scene(this._engine);
        this.camera = new arcRotateCamera_1.ArcRotateCamera("Camera", 0, 0, 10, math_1.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.inputs.attached.keyboard.detachControl();
        this.camera.wheelPrecision = 50;
        this._upAxis = opts.upAxis;
        this._updateCameraUpVector();
        this.scene.clearColor = math_1.Color4.FromHexString(opts.backgroundColor);
        var loadingScreen = new CustomLoadingScreen("Loading");
        this._engine.loadingScreen = loadingScreen;
        this._xScale = opts.xScale;
        this._yScale = opts.yScale;
        this._zScale = opts.zScale;
        this._hl1 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, 1, 0), this.scene);
        this._hl1.diffuse = new math_1.Color3(1, 1, 1);
        this._hl1.specular = new math_1.Color3(0.01, 0.01, 0.01);
        this._hl2 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, -1, 0), this.scene);
        this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
        this._hl2.specular = new math_1.Color3(0.01, 0.01, 0.01);
        this.uiLayer = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
        this._annotationManager = new Label_1.AnnotationManager(this.canvas, this.scene, this.ymax, this.camera, this._backgroundColor, this.uiLayer, this._uniqID);
        this.scene.registerBeforeRender(this._prepRender.bind(this));
        this.scene.registerAfterRender(this._afterRender.bind(this));
        var styleElem = document.createElement("style");
        styleElem.appendChild(document.createTextNode(styleText_1.styleText));
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        var buttonBar = document.createElement("div");
        buttonBar.id = "buttonBar_" + this._uniqID;
        buttonBar.className = "bbp button-bar";
        buttonBar.style.top = this.canvas.clientTop + 5 + "px";
        buttonBar.style.left = this.canvas.clientLeft + 5 + "px";
        this.canvas.parentNode.appendChild(buttonBar);
        this._buttonBar = buttonBar;
        var streamCtrlBtn = document.createElement("div");
        streamCtrlBtn.className = "button streamctrl loading hidden";
        streamCtrlBtn.onclick = function () { return (_this._streamControlBtn.className === "button streamctrl pause") ? _this.pauseAnimation() : _this.playAnimation(); };
        var streamCtrlLoading = document.createElement("div");
        streamCtrlLoading.className = "btn-label loading";
        streamCtrlLoading.innerHTML = SVGs_1.buttonSVGs.loading;
        streamCtrlBtn.appendChild(streamCtrlLoading);
        var streamCtrlPlay = document.createElement("div");
        streamCtrlPlay.className = "btn-label play";
        streamCtrlPlay.innerHTML = SVGs_1.buttonSVGs.play;
        streamCtrlBtn.appendChild(streamCtrlPlay);
        var streamCtrlPause = document.createElement("div");
        streamCtrlPause.className = "btn-label pause";
        streamCtrlPause.innerHTML = SVGs_1.buttonSVGs.pause;
        streamCtrlBtn.appendChild(streamCtrlPause);
        this._buttonBar.appendChild(streamCtrlBtn);
        var animRange = document.createElement("input");
        animRange.type = "range";
        animRange.min = "0";
        animRange.max = "0";
        animRange.value = "0";
        animRange.step = "1";
        animRange.className = "anim-slider hidden";
        animRange.disabled = true;
        animRange.onchange = function () { return _this.setAnimationFrame(); };
        this._animationSlider = animRange;
        this._buttonBar.appendChild(animRange);
        this._streamControlBtn = streamCtrlBtn;
        this._downloadObj = {
            plots: []
        };
        this.scene.onPointerDown = (function (_evt, pickResult) {
            for (var i = 0; i < this.plots.length; i++) {
                var plot = this.plots[i];
                if (!plot.pickable) {
                    continue;
                }
                if (pickResult.pickedMesh === plot.mesh && plot.dpInfo) {
                    var pick = plot.getPick(pickResult);
                    this._annotationManager.displayInfo(pick.info, pick.target);
                }
            }
        }).bind(this);
    }
    Plots.prototype._updateCameraUpVector = function () {
        switch (this._upAxis) {
            case "+x":
                this.camera.upVector = new math_1.Vector3(1, 0, 0);
                break;
            case "-x":
                this.camera.upVector = new math_1.Vector3(-1, 0, 0);
                break;
            case "+z":
                this.camera.upVector = new math_1.Vector3(0, 0, 1);
                break;
            case "-z":
                this.camera.upVector = new math_1.Vector3(0, 0, -1);
                break;
            case "-y":
                this.camera.upVector = new math_1.Vector3(0, -1, 0);
                break;
            case "+y":
            default:
                this.camera.upVector = new math_1.Vector3(0, 1, 0);
                break;
        }
    };
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
        if (plotData["xScale"] !== undefined) {
            this._xScale = plotData["xScale"];
        }
        if (plotData["yScale"] !== undefined) {
            this._yScale = plotData["yScale"];
        }
        if (plotData["zScale"] !== undefined) {
            this._zScale = plotData["zScale"];
        }
        if (plotData["shapeLegendTitle"] !== undefined) {
            this.shapeLegendTitle = plotData["shapeLegendTitle"];
        }
        if (plotData["upAxis"] !== undefined) {
            this._upAxis = plotData["upAxis"];
            this._updateCameraUpVector();
        }
        for (var plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
            var plot = plotData["plots"][plotIdx];
            if (plot["plotType"] === "imageStack") {
                this.addImgStack(plot["values"], plot["indices"], plot["attributes"], {
                    name: plot["name"],
                    size: plot["size"],
                    colorScale: plot["colorScale"],
                    showLegend: plot["showLegend"],
                    fontSize: plot["fontSize"],
                    fontColor: plot["fontColor"],
                    legendTitle: plot["legendTitle"],
                    legendTitleFontSize: plot["legendTitleFontSize"],
                    legendTitleFontColor: plot["legendTitleFontColor"],
                    legendPosition: plot["legendPosition"],
                    showAxes: plot["showAxes"],
                    axisLabels: plot["axisLabels"],
                    axisColors: plot["axisColors"],
                    tickBreaks: plot["tickBreaks"],
                    showTickLines: plot["showTickLines"],
                    tickLineColors: plot["tickLineColors"],
                    intensityMode: plot["intensityMode"],
                    channelColors: plot["channelColors"],
                    channelOpacities: plot["channelOpacities"]
                });
            }
            else if (plot["plotType"] === "meshObject") {
                this.addMeshObject(plot["meshString"], {
                    meshScaling: plot["meshScaling"],
                    meshRotation: plot["meshRotation"],
                    meshOffset: plot["meshOffset"]
                });
            }
            else if (plot["plotType"] === "meshStream") {
                this.addMeshStream(plot["rootUrl"], plot["filePrefix"], plot["fileSuffix"], plot["fileIteratorStart"], plot["fileIteratorEnd"], plot["frameDelay"], {
                    meshRotation: plot["meshRotation"],
                    meshOffset: plot["meshOffset"]
                });
            }
            else if (["pointCloud", "heatMap", "surface", "shapeCloud"].indexOf(plot["plotType"]) !== -1) {
                this.addPlot(plot["coordinates"], plot["plotType"], plot["colorBy"], plot["colorVar"], {
                    name: plot["name"],
                    size: plot["size"],
                    colorScale: plot["colorScale"],
                    customColorScale: plot["customColorScale"],
                    colorScaleInverted: plot["colorScaleInverted"],
                    sortedCategories: plot["sortedCategories"],
                    showLegend: plot["showLegend"],
                    legendShowShape: plot["legendShowShape"],
                    fontSize: plot["fontSize"],
                    fontColor: plot["fontColor"],
                    legendTitle: plot["legendTitle"],
                    legendTitleFontSize: plot["legendTitleFontSize"],
                    legendTitleFontColor: plot["legendTitleFontColor"],
                    legendPosition: plot["legendPosition"],
                    showAxes: plot["showAxes"],
                    axisLabels: plot["axisLabels"],
                    axisColors: plot["axisColors"],
                    tickBreaks: plot["tickBreaks"],
                    showTickLines: plot["showTickLines"],
                    tickLineColors: plot["tickLineColors"],
                    hasAnimation: plot["hasAnimation"],
                    animationTargets: plot["animationTargets"],
                    animationDelay: plot["animationDelay"],
                    animationDuration: plot["animationDuration"],
                    animationLoop: plot["animationLoop"],
                    folded: plot["folded"],
                    foldedEmbedding: plot["foldedEmbedding"],
                    foldAnimDelay: plot["foldAnimDelay"],
                    foldAnimDuration: plot["foldAnimDuration"],
                    foldAnimLoop: plot["foldAnimLoop"],
                    colnames: plot["colnames"],
                    rownames: plot["rownames"],
                    shape: plot["shape"],
                    shading: plot["shading"],
                    dpInfo: plot["dpInfo"],
                    addClusterLabels: plot["addClusterLabels"]
                });
            }
        }
        if (plotData["labels"]) {
            this._annotationManager.fixedLabels = true;
            var labelData = plotData["labels"];
            if (labelData.length > 0) {
                if (Array.isArray(labelData[0])) {
                    this._annotationManager.addLabels(labelData);
                }
                else {
                    for (var i = 0; i < labelData.length; i++) {
                        var label = labelData[i];
                        if (label["text"] && label["position"]) {
                            this._annotationManager.addLabel(label["text"], label["position"]);
                        }
                    }
                }
            }
        }
        if (plotData["cameraAlpha"] !== undefined) {
            this.camera.alpha = plotData["cameraAlpha"];
        }
        if (plotData["cameraBeta"] !== undefined) {
            this.camera.beta = plotData["cameraBeta"];
        }
        if (plotData["cameraRadius"] !== undefined) {
            this.camera.radius = plotData["cameraRadius"];
        }
    };
    Plots.prototype.createButtons = function (whichBtns) {
        var _this = this;
        if (whichBtns === void 0) { whichBtns = ["json", "label", "publish", "record", "turntable"]; }
        if (whichBtns.indexOf("turntable") !== -1) {
            var turntableBtn = document.createElement("div");
            turntableBtn.className = "button";
            turntableBtn.onclick = function () { return _this.toggleTurntable(); };
            turntableBtn.innerHTML = SVGs_1.buttonSVGs.turntable;
            turntableBtn.title = "Toggle turntable animation.";
            this._buttonBar.appendChild(turntableBtn);
            this._turntableBtn = turntableBtn;
            if (this.turntable) {
                turntableBtn.className = "button active";
            }
        }
        if (whichBtns.indexOf("json") !== -1) {
            var jsonBtn = document.createElement("div");
            jsonBtn.className = "button";
            jsonBtn.onclick = this._downloadJson.bind(this);
            jsonBtn.innerHTML = SVGs_1.buttonSVGs.toJson;
            jsonBtn.title = "Download the plot as json file.";
            this._buttonBar.appendChild(jsonBtn);
        }
        if (whichBtns.indexOf("label") !== -1) {
            var labelBtn = document.createElement("div");
            labelBtn.className = "button";
            labelBtn.onclick = this._annotationManager.toggleLabelControl.bind(this._annotationManager);
            labelBtn.innerHTML = SVGs_1.buttonSVGs.labels;
            labelBtn.title = "Show or hide the label manager.";
            this._buttonBar.appendChild(labelBtn);
        }
        if (whichBtns.indexOf("record") !== -1) {
            var recordBtn = document.createElement("div");
            recordBtn.className = "button";
            recordBtn.onclick = this._startRecording.bind(this);
            recordBtn.innerHTML = SVGs_1.buttonSVGs.record;
            recordBtn.title = "Record the plot as a gif.";
            this._buttonBar.appendChild(recordBtn);
        }
        if (whichBtns.indexOf("publish") !== -1) {
            var publishBtn = document.createElement("div");
            publishBtn.className = "button";
            publishBtn.onclick = this._createPublishForm.bind(this);
            publishBtn.innerHTML = SVGs_1.buttonSVGs.publish;
            publishBtn.title = "Publish the plot to bp.bleb.li.";
            this._buttonBar.appendChild(publishBtn);
        }
    };
    Plots.prototype._prepDownloadObj = function () {
        this._downloadObj["turntable"] = this.turntable;
        this._downloadObj["rotationRate"] = this.rotationRate;
        this._downloadObj["backgroundColor"] = this._backgroundColor;
        this._downloadObj["xScale"] = this._xScale;
        this._downloadObj["yScale"] = this._yScale;
        this._downloadObj["zScale"] = this._zScale;
        this._downloadObj["shapeLegendTitle"] = this.shapeLegendTitle;
        this._downloadObj["cameraAlpha"] = this.camera.alpha;
        this._downloadObj["cameraBeta"] = this.camera.beta;
        this._downloadObj["cameraRadius"] = this.camera.radius;
        this._downloadObj["labels"] = this._annotationManager.exportLabels();
        this._downloadObj["cameraAlpha"] = this.camera.alpha;
        this._downloadObj["cameraBeta"] = this.camera.beta;
        this._downloadObj["cameraRadius"] = this.camera.radius;
        this._downloadObj["upAxis"] = this._upAxis;
    };
    Plots.prototype._downloadJson = function () {
        var dlElement = document.createElement("a");
        this._prepDownloadObj();
        var dlContent = encodeURIComponent(JSON.stringify(this._downloadObj));
        dlElement.setAttribute("href", "data:text/plain;charset=utf-8," + dlContent);
        dlElement.setAttribute("download", "babyplots_export.json");
        dlElement.style.display = "none";
        document.body.appendChild(dlElement);
        dlElement.click();
        document.body.removeChild(dlElement);
    };
    Plots.prototype._createPublishForm = function () {
        if (this._publishFormOverlay !== undefined) {
            return;
        }
        var formOverlay = document.createElement("div");
        formOverlay.id = "publishOverlay_" + this._uniqID;
        formOverlay.style.position = "absolute";
        var r = this.canvas.getBoundingClientRect();
        if (this.Python) {
            formOverlay.style.top = "0px";
            formOverlay.style.left = "0px";
            formOverlay.style.width = "100%";
            formOverlay.style.height = "100%";
        }
        else {
            formOverlay.style.top = r.y + "px";
            formOverlay.style.left = r.x + "px";
            formOverlay.style.width = r.width + "px";
            formOverlay.style.height = r.height + "px";
        }
        formOverlay.style.backgroundColor = "#ffffff66";
        var formBox = document.createElement("div");
        formBox.style.width = "275px";
        formBox.style.margin = "42px auto";
        formBox.style.backgroundColor = "white";
        formBox.style.padding = "15px 30px";
        formBox.style.borderRadius = "10px";
        formBox.style.boxShadow = "0 0 10px #0003";
        formBox.className = "bbp publish-form";
        formOverlay.appendChild(formBox);
        var formInfo = document.createElement("p");
        formInfo.innerText = "Upload the plot to your account on https://bp.bleb.li. Only you will be able to see it. You can change the access settings in your account.";
        formInfo.className = "form-info";
        formBox.appendChild(formInfo);
        var usernameLabel = document.createElement("label");
        usernameLabel.id = "publishUsernameLabel_" + this._uniqID;
        usernameLabel.innerText = "Username:";
        var usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.id = "publishUsername_" + this._uniqID;
        var passwordLabel = document.createElement("label");
        passwordLabel.id = "publishPasswordLabel_" + this._uniqID;
        passwordLabel.innerText = "Password:";
        var passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.id = "publishPassword_" + this._uniqID;
        var titleLabel = document.createElement("label");
        titleLabel.id = "publishTitleLabel_" + this._uniqID;
        titleLabel.innerText = "Plot title:";
        var titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.id = "publishTitle_" + this._uniqID;
        var msg = document.createElement("p");
        msg.id = "publishMessage_" + this._uniqID;
        var publishBtn = document.createElement("button");
        publishBtn.className = "publish-btn";
        publishBtn.id = "publishBtn_" + this._uniqID;
        publishBtn.onclick = this._tryPublish.bind(this);
        publishBtn.innerText = "Login and publish";
        var cancelBtn = document.createElement("button");
        cancelBtn.className = "cancel-btn";
        cancelBtn.id = "cancelBtn_" + this._uniqID;
        cancelBtn.onclick = this._cancelPublish.bind(this);
        cancelBtn.innerText = "Cancel";
        var closeBtn = document.createElement("button");
        closeBtn.className = "close-btn";
        closeBtn.id = "closeBtn_" + this._uniqID;
        closeBtn.onclick = this._cancelPublish.bind(this);
        closeBtn.innerText = "Close";
        closeBtn.style.display = "none";
        formBox.appendChild(usernameLabel);
        formBox.appendChild(usernameInput);
        formBox.appendChild(passwordLabel);
        formBox.appendChild(passwordInput);
        formBox.appendChild(titleLabel);
        formBox.appendChild(titleInput);
        formBox.appendChild(msg);
        formBox.appendChild(publishBtn);
        formBox.appendChild(cancelBtn);
        formBox.appendChild(closeBtn);
        this._publishFormOverlay = formOverlay;
        this.canvas.parentNode.appendChild(formOverlay);
    };
    Plots.prototype._resizePublishOverlay = function () {
        if (this._publishFormOverlay === undefined) {
            return;
        }
        var r = this.canvas.getBoundingClientRect();
        this._publishFormOverlay.style.left = r.x + "px";
        this._publishFormOverlay.style.top = r.y + "px";
        this._publishFormOverlay.style.width = r.width + "px";
        this._publishFormOverlay.style.height = r.height + "px";
    };
    Plots.prototype._tryPublish = function () {
        this.thumbnail(80, (function (thumb_data) {
            this._prepDownloadObj();
            axios({
                method: 'post',
                url: 'https://bp.bleb.li/api/publish',
                headers: {
                    'Content-Type': "application/json;charset=UTF-8"
                },
                data: {
                    username: document.getElementById("publishUsername_" + this._uniqID).value,
                    password: document.getElementById("publishPassword_" + this._uniqID).value,
                    plotData: JSON.stringify(this._downloadObj),
                    plotName: document.getElementById("publishTitle_" + this._uniqID).value,
                    thumb: thumb_data
                },
            })
                .then((function (response) {
                var msg = document.getElementById("publishMessage_" + this._uniqID);
                msg.innerText = "Successfully published plot!";
                msg.className = "message success";
                document.getElementById("publishUsername_" + this._uniqID).style.display = "none";
                document.getElementById("publishUsernameLabel_" + this._uniqID).style.display = "none";
                document.getElementById("publishPassword_" + this._uniqID).style.display = "none";
                document.getElementById("publishPasswordLabel_" + this._uniqID).style.display = "none";
                document.getElementById("publishTitle_" + this._uniqID).style.display = "none";
                document.getElementById("publishTitleLabel_" + this._uniqID).style.display = "none";
                document.getElementById("publishBtn_" + this._uniqID).style.display = "none";
                document.getElementById("cancelBtn_" + this._uniqID).style.display = "none";
                document.getElementById("closeBtn_" + this._uniqID).style.display = "block";
            }).bind(this))
                .catch((function (response) {
                if (response.response.data["status"] === "not authorized") {
                    console.log("wrong credentials");
                    var msg = document.getElementById("publishMessage_" + this._uniqID);
                    msg.innerText = "Invalid username or password.";
                    msg.className = "message warning";
                }
                console.log(response);
            }).bind(this));
        }).bind(this));
    };
    Plots.prototype._cancelPublish = function () {
        this._publishFormOverlay.remove();
        this._publishFormOverlay = undefined;
    };
    Plots.prototype._resetAnimation = function () {
        this._hasAnim = true;
        for (var idx = 0; idx < this.plots.length; idx++) {
            this.plots[idx].resetAnimation();
        }
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
        this._axes[0].axisData.range = [rangeX, rangeY, rangeZ];
        this._axes[0].update(this.camera, true);
    };
    Plots.prototype.pauseAnimation = function () {
        this.animPaused = true;
        this._streamControlBtn.className = "button streamctrl play";
    };
    Plots.prototype.playAnimation = function () {
        this.animPaused = false;
        this._streamControlBtn.className = "button streamctrl pause";
    };
    Plots.prototype.toggleTurntable = function () {
        this.turntable = !this.turntable;
        if (this.turntable) {
            this._turntableBtn.className = "button active";
        }
        else {
            this._turntableBtn.className = "button";
        }
    };
    Plots.prototype.setAnimationFrame = function () {
        for (var idx = 0; idx < this.plots.length; idx++) {
            var animPlot = this.plots[idx];
            if (animPlot.allLoaded) {
                animPlot.goToFrame(parseInt(this._animationSlider.value));
            }
        }
    };
    Plots.prototype._toggleLoopAnimation = function () {
        if (this._loopingAnim) {
            this._loopingAnim = false;
            for (var idx = 0; idx < this.plots.length; idx++) {
                this.plots[idx].setLooping(false);
            }
            this._loopBtn.className = "button";
        }
        else {
            this._loopingAnim = true;
            for (var idx = 0; idx < this.plots.length; idx++) {
                this.plots[idx].setLooping(true);
            }
            this._loopBtn.className = "button active";
        }
        if (!this._hasAnim) {
            this._resetAnimation();
        }
    };
    Plots.prototype._startRecording = function () {
        this._recording = true;
    };
    Plots.prototype._prepRender = function () {
        if (this.turntable) {
            this.camera.alpha += this.rotationRate;
        }
        if (this._hasAnim && !this.animPaused) {
            var anyAnim = false;
            for (var idx = 0; idx < this.plots.length; idx++) {
                var animPlot = this.plots[idx];
                var animState = animPlot.update();
                if (animState) {
                    anyAnim = true;
                    if (animPlot.allLoaded && this._streamControlBtn.className === "button streamctrl loading") {
                        this._streamControlBtn.className = "button streamctrl pause";
                        this._animationSlider.disabled = false;
                    }
                    if (animPlot.hasOwnProperty("frameIndex")) {
                        this._animationSlider.value = animPlot.frameIndex.toString();
                    }
                }
            }
            this._hasAnim = anyAnim;
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
                this._axes[0].axisData.range = [rangeX, rangeY, rangeZ];
                this._axes[0].update(this.camera, true);
            }
        }
        if (this._axes) {
            for (var i = 0; i < this._axes.length; i++) {
                this._axes[i].update(this.camera);
            }
        }
        if (this._fsUIDirty) {
            this.uiLayer = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            this._updateLegend(this.uiLayer);
            this._annotationManager.redrawInfo();
            this._fsUIDirty = false;
        }
        this._annotationManager.update();
    };
    Plots.prototype._afterRender = function () {
        if (this._recording) {
            if (this._turned === 0) {
                var worker = "./";
                if (this.R) {
                    worker = "lib/babyplots-1/";
                }
                this._capturer = new CCapture({
                    format: "gif",
                    framerate: 30,
                    verbose: false,
                    display: false,
                    quality: 50,
                    workersPath: worker
                });
                this._capturer.start();
                this.rotationRate = 0.02;
                if (this.turntable) {
                    this._wasTurning = true;
                }
                else {
                    this.turntable = true;
                }
                var loadingOverlay = document.createElement("div");
                loadingOverlay.className = "bbp overlay";
                loadingOverlay.id = "GIFloadingOverlay_" + this._uniqID;
                var loadingText = document.createElement("h5");
                loadingText.className = ".loading-message";
                loadingText.innerText = "Recording GIF...";
                loadingText.id = "GIFloadingText_" + this._uniqID;
                loadingOverlay.appendChild(loadingText);
                this.canvas.parentNode.appendChild(loadingOverlay);
            }
            if (this._turned < 2 * Math.PI) {
                this._turned += this.rotationRate;
                this._capturer.capture(this.canvas);
            }
            else {
                this._recording = false;
                this._capturer.stop();
                var loadingText = document.getElementById("GIFloadingText_" + this._uniqID);
                loadingText.innerText = "Saving GIF...";
                this._capturer.save((function (blob) {
                    downloadjs_1.default(blob, "babyplots.gif", 'image/gif');
                    document.getElementById("GIFloadingText_" + this._uniqID).remove();
                    document.getElementById("GIFloadingOverlay_" + this._uniqID).remove();
                }).bind(this));
                this._turned = 0;
                this.rotationRate = 0.01;
                this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
                if (!this._wasTurning) {
                    this.turntable = false;
                }
            }
        }
    };
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
        var opts = {
            size: 1,
            colorScale: null,
            showLegend: false,
            fontSize: 11,
            fontColor: "black",
            legendTitle: null,
            legendTitleFontSize: 16,
            legendTitleFontColor: "black",
            legendPosition: null,
            showAxes: [false, false, false],
            axisLabels: ["X", "Y", "Z"],
            axisColors: ["#666666", "#666666", "#666666"],
            tickBreaks: [2, 2, 2],
            showTickLines: [[false, false], [false, false], [false, false]],
            tickLineColors: [["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"]],
            intensityMode: "alpha",
            channelColors: ["#ff0000", "#00ff00", "#0000ff"],
            channelOpacities: [1, 1, 1]
        };
        Object.assign(opts, options);
        this._downloadObj["plots"].push({
            plotType: "imageStack",
            values: values,
            indices: indices,
            attributes: attributes,
            size: opts.size,
            colorScale: opts.colorScale,
            showLegend: opts.showLegend,
            fontSize: opts.fontSize,
            fontColor: opts.fontColor,
            legendTitle: opts.legendTitle,
            legendTitleFontSize: opts.legendTitleFontSize,
            legendTitleFontColor: opts.legendTitleFontColor,
            legendPosition: opts.legendPosition,
            showAxes: opts.showAxes,
            axisLabels: opts.axisLabels,
            axisColors: opts.axisColors,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColors: opts.tickLineColors,
            intensityMode: opts.intensityMode,
            channelColors: opts.channelColors,
            channelOpacities: [1, 1, 1]
        });
        var legendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: opts.legendPosition
        };
        legendData.fontSize = opts.fontSize;
        legendData.fontColor = opts.fontColor;
        legendData.legendTitle = opts.legendTitle;
        legendData.legendTitleFontSize = opts.legendTitleFontSize;
        legendData.legendTitleFontColor = opts.legendTitleFontColor;
        var plot = new ImgStack_1.ImgStack(this.scene, values, indices, attributes, legendData, opts.size, this._backgroundColor, opts.intensityMode, this._xScale, this._yScale, this._zScale, opts.channelColors, opts.channelOpacities);
        this.plots.push(plot);
        this._updateLegend(this.uiLayer);
        this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;
        return this;
    };
    Plots.prototype.addPlot = function (coordinates, plotType, colorBy, colorVar, options) {
        if (options === void 0) { options = {}; }
        var opts = {
            name: null,
            size: 1,
            xScale: 1,
            yScale: 1,
            zScale: 1,
            colorScale: "Oranges",
            customColorScale: [],
            colorScaleInverted: false,
            sortedCategories: [],
            showLegend: false,
            fontSize: 11,
            fontColor: "black",
            legendTitle: null,
            legendTitleFontSize: 16,
            legendTitleFontColor: "black",
            legendPosition: null,
            legendShowShape: false,
            showAxes: [false, false, false],
            axisLabels: ["X", "Y", "Z"],
            axisColors: ["#666666", "#666666", "#666666"],
            tickBreaks: [2, 2, 2],
            showTickLines: [[false, false], [false, false], [false, false]],
            tickLineColors: [["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"], ["#aaaaaa", "#aaaaaa"]],
            hasAnimation: false,
            animationTargets: null,
            animationDelay: null,
            animationDuration: null,
            animationLoop: false,
            foldAnimLoop: null,
            colnames: null,
            rownames: null,
            shape: null,
            shading: true,
            dpInfo: null,
            addClusterLabels: false,
            labels: null,
            labelSize: undefined,
            labelColor: undefined,
            folded: null,
            foldedEmbedding: null,
            foldAnimDelay: null,
            foldAnimDuration: null,
        };
        Object.assign(opts, options);
        if (opts.folded) {
            logging_1.deprecationWarning("folded", "hasAnimation");
            if (!opts.hasAnimation) {
                opts.hasAnimation = opts.folded;
            }
        }
        if (opts.foldedEmbedding) {
            logging_1.deprecationWarning("foldedEmbedding", "animationTargets");
            if (!opts.animationTargets) {
                opts.animationTargets = opts.foldedEmbedding;
            }
        }
        if (opts.foldAnimDelay) {
            logging_1.deprecationWarning("foldAnimDelay", "animationDelay");
            if (!opts.animationDelay) {
                opts.animationDelay = opts.foldAnimDelay;
            }
        }
        if (opts.foldAnimDuration) {
            logging_1.deprecationWarning("foldAnimDuration", "animationDuration");
            if (!opts.animationDuration) {
                opts.animationDuration = opts.foldAnimDuration;
            }
        }
        if (opts.foldAnimLoop) {
            logging_1.deprecationWarning("foldAnimLoop", "animationLoop");
            if (!opts.animationLoop) {
                opts.animationLoop = opts.foldAnimLoop;
            }
        }
        this._downloadObj["plots"].push({
            plotType: plotType,
            coordinates: coordinates,
            colorBy: colorBy,
            colorVar: colorVar,
            name: opts.name,
            size: opts.size,
            colorScale: opts.colorScale,
            customColorScale: opts.customColorScale,
            colorScaleInverted: opts.colorScaleInverted,
            sortedCategories: opts.sortedCategories,
            showLegend: opts.showLegend,
            fontSize: opts.fontSize,
            fontColor: opts.fontColor,
            legendTitle: opts.legendTitle,
            legendTitleFontSize: opts.legendTitleFontSize,
            legendTitleFontColor: opts.legendTitleFontColor,
            legendPosition: opts.legendPosition,
            legendShowShape: opts.legendShowShape,
            showAxes: opts.showAxes,
            axisLabels: opts.axisLabels,
            axisColors: opts.axisColors,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColors: opts.tickLineColors,
            hasAnimation: opts.hasAnimation,
            animationTargets: opts.animationTargets,
            animationDelay: opts.animationDelay,
            animationDuration: opts.animationDuration,
            animationLoop: opts.animationLoop,
            colnames: opts.colnames,
            rownames: opts.rownames,
            shape: opts.shape,
            shading: opts.shading,
            dpInfo: opts.dpInfo,
            addClusterLabels: opts.addClusterLabels,
            labels: opts.labels,
            labelSize: opts.labelSize,
            labelColor: opts.labelColor
        });
        var coordColors = [];
        var legendData;
        var rangeX;
        var rangeY;
        var rangeZ;
        this._hasAnim = opts.hasAnimation;
        if (opts.hasAnimation) {
            var replayBtn = document.createElement("div");
            replayBtn.className = "button";
            replayBtn.innerHTML = SVGs_1.buttonSVGs.replay;
            replayBtn.onclick = this._resetAnimation.bind(this);
            this._buttonBar.appendChild(replayBtn);
            var loopBtn = document.createElement("div");
            if (opts.animationLoop) {
                loopBtn.className = "button active";
            }
            else {
                loopBtn.className = "button";
            }
            loopBtn.innerHTML = SVGs_1.buttonSVGs.loop;
            loopBtn.onclick = this._toggleLoopAnimation.bind(this);
            this._buttonBar.appendChild(loopBtn);
            this._loopBtn = loopBtn;
        }
        switch (colorBy) {
            case "categories":
                var groups = colorVar;
                var uniqueGroups = getUniqueVals(groups);
                uniqueGroups.sort();
                if (opts.sortedCategories) {
                    if (uniqueGroups.length === opts.sortedCategories.length) {
                        if (JSON.stringify(uniqueGroups) === JSON.stringify(opts.sortedCategories.slice(0).sort())) {
                            uniqueGroups = opts.sortedCategories;
                        }
                    }
                }
                var nColors = uniqueGroups.length;
                var colors = chroma_js_1.default.scale(chroma_js_1.default.brewer.Paired).mode('lch').colors(nColors);
                if (opts.colorScale === "custom") {
                    if (opts.customColorScale !== undefined && opts.customColorScale.length !== 0) {
                        if (opts.colorScaleInverted) {
                            colors = chroma_js_1.default.scale(opts.customColorScale).domain([1, 0]).mode('lch').colors(nColors);
                        }
                        else {
                            colors = chroma_js_1.default.scale(opts.customColorScale).mode('lch').colors(nColors);
                        }
                    }
                    else {
                        opts.colorScale = "Paired";
                    }
                }
                else {
                    if (opts.colorScale && chroma_js_1.default.brewer.hasOwnProperty(opts.colorScale)) {
                        if (opts.colorScaleInverted) {
                            colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).domain([1, 0]).mode('lch').colors(nColors);
                        }
                        else {
                            colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).mode('lch').colors(nColors);
                        }
                    }
                    else {
                        opts.colorScale = "Paired";
                    }
                }
                for (var i = 0; i < nColors; i++) {
                    colors[i] += "ff";
                }
                for (var i = 0; i < colorVar.length; i++) {
                    var colorIndex = uniqueGroups.indexOf(groups[i]);
                    coordColors.push(colors[colorIndex]);
                }
                legendData = {
                    showLegend: opts.showLegend,
                    discrete: true,
                    breaks: uniqueGroups,
                    colorScale: opts.colorScale,
                    customColorScale: opts.customColorScale,
                    inverted: false,
                    position: opts.legendPosition
                };
                break;
            case "values":
                var min_1 = colorVar.min();
                var max_1 = colorVar.max();
                var colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer.Oranges).mode('lch');
                if (opts.colorScale === "custom") {
                    if (opts.customColorScale !== undefined && opts.customColorScale.length !== 0) {
                        if (opts.colorScaleInverted) {
                            colorfunc_1 = chroma_js_1.default.scale(opts.customColorScale).domain([1, 0]).mode('lch');
                        }
                        else {
                            colorfunc_1 = chroma_js_1.default.scale(opts.customColorScale).mode('lch');
                        }
                    }
                    else {
                        opts.colorScale = "Oranges";
                    }
                }
                else {
                    if (opts.colorScale && chroma_js_1.default.brewer.hasOwnProperty(opts.colorScale)) {
                        if (opts.colorScaleInverted) {
                            colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).domain([1, 0]).mode('lch');
                        }
                        else {
                            colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).mode('lch');
                        }
                    }
                    else {
                        opts.colorScale = "Oranges";
                    }
                }
                var norm = colorVar.slice().map(function (v) { return (v - min_1) / (max_1 - min_1); });
                coordColors = norm.map(function (v) { return colorfunc_1(v).alpha(1).hex("rgba"); });
                legendData = {
                    showLegend: opts.showLegend,
                    discrete: false,
                    breaks: [min_1.toString(), max_1.toString()],
                    colorScale: opts.colorScale,
                    customColorScale: opts.customColorScale,
                    inverted: opts.colorScaleInverted,
                    position: opts.legendPosition
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
                    colorScale: "",
                    customColorScale: opts.customColorScale,
                    inverted: false,
                    position: opts.legendPosition
                };
                break;
        }
        legendData.fontSize = opts.fontSize;
        legendData.fontColor = opts.fontColor;
        legendData.legendTitle = opts.legendTitle;
        legendData.legendTitleFontSize = opts.legendTitleFontSize;
        legendData.legendTitleFontColor = opts.legendTitleFontColor;
        legendData.showShape = opts.legendShowShape;
        var plot;
        var scale;
        var boundingBox;
        switch (plotType) {
            case "pointCloud":
                plot = new PointCloud_1.PointCloud(this.scene, coordinates, coordColors, opts.size, legendData, opts.hasAnimation, opts.animationTargets, opts.animationDelay, opts.animationDuration, this._xScale, this._yScale, this._zScale, opts.name, opts.addClusterLabels, this._annotationManager);
                boundingBox = plot.mesh.getBoundingInfo().boundingBox;
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
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
            case "surface":
                plot = new Surface_1.Surface(this.scene, coordinates, coordColors, opts.size, legendData, this._xScale, this._yScale, this._zScale, opts.name);
                rangeX = [0, coordinates.length * this._xScale];
                rangeZ = [0, coordinates[0].length * this._zScale];
                rangeY = [
                    matrixMin(coordinates) * this._yScale,
                    matrixMax(coordinates) * this._yScale
                ];
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
            case "shapeCloud":
                plot = new ShapeCloud_1.ShapeCloud(this.scene, coordinates, coordColors, opts.shape, opts.shading, opts.size, legendData, this._xScale, this._yScale, this._zScale, opts.name, opts.dpInfo);
                boundingBox = plot.mesh.getBoundingInfo().boundingBox;
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
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
            case "heatMap":
                plot = new HeatMap_1.HeatMap(this.scene, coordinates, coordColors, opts.size, legendData, this._xScale, this._yScale, this._zScale, opts.name);
                rangeX = [0, coordinates.length * this._xScale];
                rangeZ = [0, coordinates[0].length * this._zScale];
                rangeY = [
                    matrixMin(coordinates) * this._yScale,
                    matrixMax(coordinates) * this._yScale
                ];
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
            case "line":
                plot = new Line_1.Line(this.scene, coordinates, coordColors, opts.size, legendData, opts.hasAnimation, opts.animationDelay, opts.animationDuration, this._xScale, this._yScale, this._zScale, opts.name, opts.labels, opts.labelSize, opts.labelColor, this._annotationManager);
                boundingBox = plot.mesh.getBoundingInfo().boundingBox;
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
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ];
                break;
        }
        if (opts.animationLoop) {
            this._loopingAnim = true;
            plot.setLooping(true);
        }
        this.plots.push(plot);
        this._fsUIDirty = true;
        var axisData = {
            showAxes: opts.showAxes,
            static: true,
            axisLabels: opts.axisLabels,
            range: [rangeX, rangeY, rangeZ],
            color: opts.axisColors,
            scale: scale,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColor: opts.tickLineColors,
            showPlanes: [false, false, false],
            planeColor: ["#cccccc88", "#cccccc88", "#cccccc88"],
            plotType: plotType,
            colnames: opts.colnames,
            rownames: opts.rownames
        };
        this._axes.push(new Axes_1.Axes(axisData, this.scene, plotType == "heatMap"));
        this._cameraFitPlot(rangeX, rangeY, rangeZ);
        return this;
    };
    Plots.prototype.addMeshObject = function (meshString, options) {
        var opts = {
            meshScaling: [1, 1, 1],
            meshRotation: [0, 0, 0],
            meshOffset: [0, 0, 0]
        };
        Object.assign(opts, options);
        this._downloadObj["plots"].push({
            plotType: "meshObject",
            meshString: meshString,
            meshScaling: opts.meshScaling,
            meshRotation: opts.meshRotation,
            meshOffset: opts.meshOffset
        });
        var legendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: undefined
        };
        var plot = new MeshObject_1.MeshObject(this.scene, meshString, legendData, this._xScale, this._yScale, this._zScale, opts.meshScaling, opts.meshRotation, opts.meshOffset);
        this.plots.push(plot);
        return this;
    };
    Plots.prototype.addMeshStream = function (rootUrl, filePrefix, fileSuffix, fileIteratorStart, fileIteratorEnd, frameDelay, options) {
        var opts = {
            meshRotation: [0, 0, 0],
            meshOffset: [0, 0, 0],
            clearCoat: false,
            clearCoatIntensity: 1,
        };
        Object.assign(opts, options);
        this._downloadObj["plots"].push({
            plotType: "meshStream",
            rootUrl: rootUrl,
            filePrefix: filePrefix,
            fileSuffix: fileSuffix,
            fileIteratorStart: fileIteratorStart,
            fileIteratorEnd: fileIteratorEnd,
            frameDelay: frameDelay,
            meshRotation: opts.meshRotation,
            meshOffset: opts.meshOffset,
            clearCoat: opts.clearCoat,
            clearCoatIntensity: opts.clearCoatIntensity
        });
        var legendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: undefined
        };
        var plot = new MeshStream_1.MeshStream(this.scene, rootUrl, filePrefix, fileSuffix, fileIteratorStart, fileIteratorEnd, legendData, this._xScale, this._yScale, this._zScale, frameDelay, opts.meshRotation, opts.meshOffset, opts.clearCoat, opts.clearCoatIntensity);
        this._hasAnim = true;
        this.plots.push(plot);
        this.camera.wheelPrecision = 1;
        this._streamControlBtn.className = "button streamctrl loading";
        this._animationSlider.max = (plot.frameTotal - 1).toString();
        this._animationSlider.className = "anim-slider";
        return this;
    };
    Plots.prototype._updateLegend = function (uiLayer) {
        if (this._legend) {
            this._legend.dispose();
        }
        var rightFree = true;
        var leftFree = true;
        var spaceLeft;
        var spaceRight;
        var shapeSpace = 0;
        var shapes = [];
        for (var i = 0; i < this.plots.length; i++) {
            var plot = this.plots[i];
            var legendData = plot.legendData;
            if (!legendData.legendTitleFontSize) {
                legendData.legendTitleFontSize = 16;
            }
            if (!legendData.fontSize) {
                legendData.fontSize = 12;
            }
            if (["right", "left"].indexOf(legendData.position) === -1) {
                legendData.position = null;
            }
            if (legendData.showShape) {
                shapeSpace += legendData.fontSize + 5;
                shapes.push([plot.name, plot.shape]);
            }
            if (legendData.showLegend) {
                if (legendData.position === null) {
                    if (rightFree) {
                        legendData.position = "right";
                        rightFree = false;
                        if (legendData.discrete) {
                            spaceRight = legendData.breaks.length * (legendData.fontSize + 2);
                        }
                        else {
                            spaceRight = 115;
                        }
                    }
                    else if (leftFree) {
                        legendData.position = "left";
                        leftFree = false;
                        if (legendData.discrete) {
                            spaceLeft = legendData.breaks.length * (legendData.fontSize + 2);
                        }
                        else {
                            spaceLeft = 115;
                        }
                    }
                    else {
                        legendData.showLegend = false;
                    }
                }
                else {
                    if (legendData.position === "right") {
                        rightFree = false;
                        if (legendData.discrete) {
                            spaceRight = legendData.breaks.length * (legendData.fontSize + 2);
                        }
                        else {
                            spaceRight = 115;
                        }
                    }
                    else {
                        leftFree = false;
                        if (legendData.discrete) {
                            spaceRight = legendData.breaks.length * (legendData.fontSize + 2);
                        }
                        else {
                            spaceRight = 115;
                        }
                    }
                }
            }
        }
        if (shapeSpace > 0) {
            if (this.shapeLegendTitle && this.shapeLegendTitle !== "") {
                shapeSpace += 100;
            }
            if (rightFree) {
                this._shapeLegendPosition = "right";
            }
            else if (leftFree) {
                this._shapeLegendPosition = "left";
            }
            else {
                if (spaceRight <= spaceLeft) {
                    this._shapeLegendPosition = "right";
                }
                else {
                    this._shapeLegendPosition = "left";
                }
            }
        }
        var shapeLegendData = {
            title: this.shapeLegendTitle,
            spacing: shapeSpace,
            shapes: shapes
        };
        var shapeLegendDrawn = false;
        for (var i = 0; i < this.plots.length; i++) {
            var lgndData = this.plots[i].legendData;
            if (lgndData.showLegend) {
                if (lgndData.position === this._shapeLegendPosition) {
                    uiLayer = this._createPlotLegend(lgndData, uiLayer, shapeLegendData);
                    shapeLegendDrawn = true;
                }
                else {
                    uiLayer = this._createPlotLegend(lgndData, uiLayer);
                }
            }
        }
        if (!shapeLegendDrawn) {
            this._drawStandaloneShapeLegend(uiLayer, shapeSpace, shapeLegendData);
        }
        this._legend = uiLayer;
    };
    Plots.prototype._drawStandaloneShapeLegend = function (uiLayer, shapeSpace, shapeLegendData) {
        var grid = new controls_1.Grid();
        uiLayer.addControl(grid);
        var padding = (this.canvas.height - shapeSpace / 2) / 2;
        grid.addRowDefinition(padding, true);
        grid.addRowDefinition(shapeSpace, true);
        grid.addRowDefinition(padding, true);
        var legendWidth = 0.2;
        var legendColumn = 1;
        if (this._shapeLegendPosition === "right") {
            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
        }
        else {
            grid.addColumnDefinition(legendWidth);
            grid.addColumnDefinition(1 - legendWidth);
            legendColumn = 0;
        }
        var shapeLegendGrid = this._createShapeLegend(this.plots[0].legendData, shapeLegendData);
        grid.addControl(shapeLegendGrid, 1, legendColumn);
    };
    Plots.prototype._createPlotLegend = function (legendData, uiLayer, shapeLegendData) {
        if (!legendData.showLegend) {
            return uiLayer;
        }
        var grid = new controls_1.Grid();
        uiLayer.addControl(grid);
        var n = legendData.breaks.length;
        var breakN;
        var legendWidth = 0.2;
        var nCols = 1;
        var legendBodyHeight = 0.9;
        var legendMinPixels;
        if (legendData.discrete) {
            legendMinPixels = legendData.breaks.length * (legendData.fontSize + 2);
        }
        else {
            legendMinPixels = 115;
        }
        if (legendData.legendTitle && legendData.legendTitle !== "") {
            legendMinPixels += legendData.legendTitleFontSize + 5;
        }
        if (shapeLegendData !== undefined) {
            grid.addRowDefinition(0.05);
            var totalReqPixels = legendMinPixels + shapeLegendData.spacing;
            legendBodyHeight = legendMinPixels / totalReqPixels;
            var shapeBodyHeight = shapeLegendData.spacing / totalReqPixels;
            grid.addRowDefinition(legendBodyHeight - 0.05);
            grid.addRowDefinition(shapeBodyHeight - 0.05);
            grid.addRowDefinition(0.05);
        }
        else {
            grid.addRowDefinition(0.05);
            grid.addRowDefinition(legendBodyHeight);
            grid.addRowDefinition(0.05);
        }
        if (legendData.discrete) {
            legendData.fontSize;
            nCols = Math.ceil(((legendData.fontSize + 2) * n) / (legendBodyHeight * this.canvas.height * 0.7));
            breakN = Math.ceil(n / nCols);
            legendWidth = 0.1 + (0.1 * nCols);
        }
        var legendColumn = 1;
        if (legendData.position === "right") {
            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
        }
        else {
            grid.addColumnDefinition(legendWidth);
            grid.addColumnDefinition(1 - legendWidth);
            legendColumn = 0;
        }
        if (shapeLegendData) {
            var shapeLegendGrid = this._createShapeLegend(legendData, shapeLegendData);
            grid.addControl(shapeLegendGrid, 2, legendColumn);
        }
        var legendBody = new controls_1.Grid();
        legendBody.paddingLeftInPixels = 10;
        legendBody.paddingRightInPixels = 10;
        legendBody.addRowDefinition(0.2);
        legendBody.addRowDefinition(0.7);
        legendBody.addRowDefinition(0.1);
        grid.addControl(legendBody, 1, legendColumn);
        if (legendData.legendTitle && legendData.legendTitle !== "") {
            var legendTitle = new controls_1.TextBlock();
            legendTitle.text = legendData.legendTitle;
            legendTitle.color = legendData.legendTitleFontColor;
            legendTitle.fontWeight = "bold";
            legendTitle.fontSize = legendData.legendTitleFontSize + "px";
            legendTitle.verticalAlignment = controls_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            legendTitle.horizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            legendTitle.textWrapping = true;
            legendBody.addControl(legendTitle, 0, legendColumn);
        }
        if (!legendData.discrete) {
            var innerGrid = new controls_1.Grid();
            innerGrid.addColumnDefinition(0.2);
            innerGrid.addColumnDefinition(0.8);
            legendBody.addControl(innerGrid, 1, 0);
            var nBreaks = 115;
            var labelSpace = 0.15;
            if (legendBodyHeight * this.canvas.height * 0.7 < 100) {
                nBreaks = 10;
                labelSpace = 0.45;
                innerGrid.addRowDefinition(1);
            }
            else if (legendBodyHeight * this.canvas.height * 0.7 < 150) {
                nBreaks = 50;
                labelSpace = 0.3;
                innerGrid.addRowDefinition(1);
            }
            else {
                var padding = ((legendBodyHeight * this.canvas.height * 0.7) - 115) / 2;
                innerGrid.addRowDefinition(padding, true);
                innerGrid.addRowDefinition(115, true);
                innerGrid.addRowDefinition(padding, true);
            }
            var colors = void 0;
            if (legendData.colorScale === "custom") {
                colors = chroma_js_1.default.scale(legendData.customColorScale).mode('lch').colors(nBreaks);
            }
            else {
                colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(nBreaks);
            }
            var scaleGrid = new controls_1.Grid();
            for (var i = 0; i < nBreaks; i++) {
                scaleGrid.addRowDefinition(1 / nBreaks);
                var legendColor = new controls_1.Rectangle();
                if (legendData.inverted) {
                    legendColor.background = colors[i];
                }
                else {
                    legendColor.background = colors[colors.length - i - 1];
                }
                legendColor.thickness = 0;
                legendColor.width = 0.5;
                legendColor.height = 1;
                scaleGrid.addControl(legendColor, i, 0);
            }
            var labelGrid = new controls_1.Grid();
            labelGrid.addColumnDefinition(1);
            labelGrid.addRowDefinition(labelSpace);
            labelGrid.addRowDefinition(1 - labelSpace * 2);
            labelGrid.addRowDefinition(labelSpace);
            if (this.canvas.height < 130) {
                innerGrid.addControl(scaleGrid, 0, 0);
                innerGrid.addControl(labelGrid, 0, 1);
            }
            else {
                innerGrid.addControl(scaleGrid, 1, 0);
                innerGrid.addControl(labelGrid, 1, 1);
            }
            var minText = new controls_1.TextBlock();
            minText.text = parseFloat(legendData.breaks[0]).toFixed(2);
            minText.color = legendData.fontColor;
            minText.fontSize = legendData.fontSize + "px";
            minText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelGrid.addControl(minText, 2, 0);
            var maxText = new controls_1.TextBlock();
            maxText.text = parseFloat(legendData.breaks[1]).toFixed(2);
            maxText.color = legendData.fontColor;
            maxText.fontSize = legendData.fontSize + "px";
            maxText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelGrid.addControl(maxText, 0, 0);
        }
        else {
            var innerGrid = new controls_1.Grid();
            if (nCols > 1) {
                for (var i = 0; i < nCols; i++) {
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                }
            }
            else {
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.9);
            }
            for (var i = 0; i < n && i < breakN; i++) {
                if (n > breakN) {
                    innerGrid.addRowDefinition(1 / breakN);
                }
                else {
                    innerGrid.addRowDefinition(1 / n);
                }
            }
            legendBody.addControl(innerGrid, 1, 0);
            var colors = void 0;
            if (legendData.colorScale === "custom") {
                colors = chroma_js_1.default.scale(legendData.customColorScale).mode('lch').colors(n);
            }
            else {
                colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(n);
            }
            for (var i = 0; i < n; i++) {
                var legendColor = new controls_1.Rectangle();
                legendColor.background = colors[i];
                legendColor.thickness = 0;
                legendColor.width = legendData.fontSize + "px";
                legendColor.height = legendData.fontSize + "px";
                var column = Math.floor(i / breakN);
                var row = i - column * breakN;
                innerGrid.addControl(legendColor, row, column * 2);
                var legendText = new controls_1.TextBlock();
                legendText.text = legendData.breaks[i].toString();
                legendText.color = legendData.fontColor;
                legendText.fontSize = legendData.fontSize + "px";
                legendText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                innerGrid.addControl(legendText, row, column * 2 + 1);
            }
        }
        return uiLayer;
    };
    Plots.prototype._createShapeLegend = function (legendData, shapeLegendData) {
        var shapeLegendGrid = new controls_1.Grid();
        legendData.fontColor = legendData.fontColor || "black";
        legendData.fontSize = legendData.fontSize || 11;
        legendData.legendTitleFontColor = legendData.legendTitleFontColor || "black";
        legendData.legendTitleFontSize = legendData.legendTitleFontSize || 16;
        if (shapeLegendData.title && shapeLegendData.title !== "") {
            shapeLegendGrid.paddingLeftInPixels = 10;
            shapeLegendGrid.paddingRightInPixels = 10;
            shapeLegendGrid.addRowDefinition(legendData.legendTitleFontSize + 5, true);
            shapeLegendGrid.addRowDefinition(shapeLegendData.spacing - (legendData.legendTitleFontSize + 5), true);
            shapeLegendGrid.addRowDefinition(0.05);
            var shapeLegendTitle = new controls_1.TextBlock();
            shapeLegendTitle.text = shapeLegendData.title;
            shapeLegendTitle.color = legendData.legendTitleFontColor;
            shapeLegendTitle.fontWeight = "bold";
            if (legendData.legendTitleFontSize) {
                shapeLegendTitle.fontSize = legendData.legendTitleFontSize + "px";
            }
            else {
                shapeLegendTitle.fontSize = "16px";
            }
            shapeLegendTitle.verticalAlignment = controls_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            shapeLegendTitle.horizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            shapeLegendTitle.textWrapping = true;
            shapeLegendGrid.addControl(shapeLegendTitle, 0, 0);
        }
        else {
            shapeLegendGrid.addRowDefinition(0.05);
            shapeLegendGrid.addRowDefinition(shapeLegendData.spacing, true);
            shapeLegendGrid.addRowDefinition(0.05);
        }
        var shapeLegendBody = new controls_1.Grid();
        shapeLegendBody.addColumnDefinition(legendData.fontSize + 6, true);
        shapeLegendBody.addColumnDefinition(0.9);
        var rowHeight = 1 / shapeLegendData.shapes.length;
        for (var i = 0; i < shapeLegendData.shapes.length; i++) {
            var shapeDef = shapeLegendData.shapes[i];
            shapeLegendBody.addRowDefinition(rowHeight);
            var url = "data:image/svg+xml;base64," + window.btoa(SVGs_1.legendSVGs[shapeDef[1]]);
            var shapeIcon = new controls_1.Image(shapeDef[0], url);
            shapeIcon.width = legendData.fontSize + 2 + "px";
            shapeIcon.height = legendData.fontSize + 2 + "px";
            shapeLegendBody.addControl(shapeIcon, i, 0);
            var shapeText = new controls_1.TextBlock();
            shapeText.text = shapeDef[0];
            shapeText.color = legendData.fontColor;
            shapeText.fontSize = legendData.fontSize + "px";
            shapeText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            shapeLegendBody.addControl(shapeText, i, 1);
        }
        shapeLegendGrid.addControl(shapeLegendBody, 1, 0);
        return shapeLegendGrid;
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
        this._fsUIDirty = true;
        this._resizePublishOverlay();
        this._engine.resize();
        return this;
    };
    Plots.prototype.thumbnail = function (size, saveCallback) {
        screenshotTools_1.ScreenshotTools.CreateScreenshot(this._engine, this.camera, size, saveCallback);
    };
    Plots.prototype.dispose = function () {
        this.scene.dispose();
        this._engine.dispose();
        var btnbar = document.getElementById("buttonBar_" + this._uniqID);
        btnbar.remove();
        var lblCntrl = document.getElementById("labelControl_" + this._uniqID);
        lblCntrl.remove();
    };
    Plots.prototype.addLabels = function (labelList) {
        this._annotationManager.addLabels(labelList);
    };
    return Plots;
}());
exports.Plots = Plots;
//# sourceMappingURL=babyplots.js.map