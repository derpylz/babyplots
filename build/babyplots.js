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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plots = exports.isValidPlot = exports.PLOTTYPES = exports.getUniqueVals = exports.matrixMin = exports.matrixMax = exports.Plot = void 0;
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
var axios = require('axios').default;
var Label_1 = require("./Label");
var Axes_1 = require("./Axes");
var Plot = /** @class */ (function () {
    function Plot(scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale) {
        if (xScale === void 0) { xScale = 1; }
        if (yScale === void 0) { yScale = 1; }
        if (zScale === void 0) { zScale = 1; }
        this._size = 1;
        this._scene = scene;
        this._coords = coordinates;
        this._coordColors = colorVar;
        this._size = size;
        this.legendData = legendData;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }
    Plot.prototype.updateSize = function () { };
    Plot.prototype.update = function () { return false; };
    Plot.prototype.resetAnimation = function () { };
    return Plot;
}());
exports.Plot = Plot;
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
var ImgStack_1 = require("./ImgStack");
var ShapeCloud_1 = require("./ShapeCloud");
var PointCloud_1 = require("./PointCloud");
var Surface_1 = require("./Surface");
var HeatMap_1 = require("./HeatMap");
var styleText_1 = require("./styleText");
var SVGs_1 = require("./SVGs");
exports.PLOTTYPES = {
    'pointCloud': ['coordinates', 'colorBy', 'colorVar'],
    'surface': ['coordinates', 'colorBy', 'colorVar'],
    'heatMap': ['coordinates', 'colorBy', 'colorVar'],
    'imageStack': ['values', 'indices', 'attributes']
};
/**
 * Takes a reasonable guess if a plot can be created from the provided object
 * @param plotData Object containing data to be checked for valid plot information
 */
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
var Plots = /** @class */ (function () {
    /**
     * Initialize the 3d visualization
     *
     * @param canvasElement ID of the canvas element in the DOM
     * @param options Object with general options. See a list of possible options [here](https://bp.bleb.li/documentation/js#plotsObject).
     */
    function Plots(canvasElement, options) {
        if (options === void 0) { options = {}; }
        this._showLegend = true;
        this._hasAnim = false;
        this._axes = [];
        this._downloadObj = {};
        this._recording = false;
        this._turned = 0;
        this._wasTurning = false;
        this._xScale = 1;
        this._yScale = 1;
        this._zScale = 1;
        /** Array of plots in this visualization. */
        this.plots = [];
        /** Highest point on the y axis of any plot. Used for positioning the camera and labels. */
        this.ymax = 0;
        /** This variable should be exclusively set by the babyplots R package. It controls some specific options for babyplots behavior in the RStudio viewer. */
        this.R = false;
        // create unique id, needed if multiple babyplots canvases are on the same page.
        this._uniqID = uuid_1.v4();
        // apply options
        // default settings
        var opts = {
            backgroundColor: "#ffffffff",
            xScale: 1,
            yScale: 1,
            zScale: 1,
            turntable: false,
            rotationRate: 0.01
        };
        Object.assign(opts, options);
        this.turntable = opts.turntable;
        this.rotationRate = opts.rotationRate;
        // setup enginge and scene
        this._backgroundColor = opts.backgroundColor;
        this.canvas = document.getElementById(canvasElement);
        this._engine = new engine_1.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new scene_1.Scene(this._engine);
        // camera
        this.camera = new arcRotateCamera_1.ArcRotateCamera("Camera", 0, 0, 10, math_1.Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.inputs.attached.keyboard.detachControl();
        this.camera.wheelPrecision = 50;
        // background color
        this.scene.clearColor = math_1.Color4.FromHexString(opts.backgroundColor);
        // Axis scales
        this._xScale = opts.xScale;
        this._yScale = opts.yScale;
        this._zScale = opts.zScale;
        // two lights to illuminate the cells uniformly (top and bottom)
        this._hl1 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, 1, 0), this.scene);
        this._hl1.diffuse = new math_1.Color3(1, 1, 1);
        this._hl1.specular = new math_1.Color3(0, 0, 0);
        // bottom light slightly weaker for better depth perception and orientation
        this._hl2 = new hemisphericLight_1.HemisphericLight("HemiLight", new math_1.Vector3(0, -1, 0), this.scene);
        this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
        this._hl2.specular = new math_1.Color3(0, 0, 0);
        this._annotationManager = new Label_1.AnnotationManager(this.canvas, this.scene, this.ymax, this.camera);
        this.scene.registerBeforeRender(this._prepRender.bind(this));
        this.scene.registerAfterRender(this._afterRender.bind(this));
        // create container for buttons
        // create css style
        var styleElem = document.createElement("style");
        styleElem.appendChild(document.createTextNode(styleText_1.styleText));
        document.getElementsByTagName('head')[0].appendChild(styleElem);
        // create ui elements
        var buttonBar = document.createElement("div");
        buttonBar.className = "bbp button-bar";
        buttonBar.style.top = this.canvas.clientTop + 5 + "px";
        buttonBar.style.left = this.canvas.clientLeft + 5 + "px";
        this.canvas.parentNode.appendChild(buttonBar);
        this._buttonBar = buttonBar;
        // prepare download object
        this._downloadObj = {
            plots: []
        };
    }
    /**
     * Load a visualization from a saved JSON object. The R, JavaScript and Python implementations of babyplots as well as the NPC allow the export of visualizations as JSON files. Loading of a saved visualization using fromJSON() overwrites previously set properties of the Plots object.
     *
     * @param plotData Javascript Object with plot data.
     */
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
        for (var plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
            var plot = plotData["plots"][plotIdx];
            if (plot["plotType"] === "imageStack") {
                this.addImgStack(plot["values"], plot["indices"], plot["attributes"], {
                    size: plot["size"],
                    colorScale: plot["colorScale"],
                    showLegend: plot["showLegend"],
                    fontSize: plot["fontSize"],
                    fontColor: plot["fontColor"],
                    legendTitle: plot["legendTitle"],
                    legendTitleFontSize: plot["legendTitleFontSize"],
                    legendPosition: plot["legendPosition"],
                    showAxes: plot["showAxes"],
                    axisLabels: plot["axisLabels"],
                    axisColors: plot["axisColors"],
                    tickBreaks: plot["tickBreaks"],
                    showTickLines: plot["showTickLines"],
                    tickLineColors: plot["tickLineColors"],
                    intensityMode: plot["intensityMode"]
                });
            }
            else if (["pointCloud", "heatMap", "surface", "shapeCloud"].indexOf(plot["plotType"]) !== -1) {
                this.addPlot(plot["coordinates"], plot["plotType"], plot["colorBy"], plot["colorVar"], {
                    size: plot["size"],
                    colorScale: plot["colorScale"],
                    customColorScale: plot["customColorScale"],
                    colorScaleInverted: plot["colorScaleInverted"],
                    sortedCategories: plot["sortedCategories"],
                    showLegend: plot["showLegend"],
                    fontSize: plot["fontSize"],
                    fontColor: plot["fontColor"],
                    legendTitle: plot["legendTitle"],
                    legendTitleFontSize: plot["legendTitleFontSize"],
                    legendPosition: plot["legendPosition"],
                    showAxes: plot["showAxes"],
                    axisLabels: plot["axisLabels"],
                    axisColors: plot["axisColors"],
                    tickBreaks: plot["tickBreaks"],
                    showTickLines: plot["showTickLines"],
                    tickLineColors: plot["tickLineColors"],
                    folded: plot["folded"],
                    foldedEmbedding: plot["foldedEmbedding"],
                    foldAnimDelay: plot["foldAnimDelay"],
                    foldAnimDuration: plot["foldAnimDuration"],
                    colnames: plot["colnames"],
                    rownames: plot["rownames"],
                    shape: plot["shape"]
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
                    // legacy label saving
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
    /**
     * Create UI buttons to control certain babyplots features.
     *
     * @param whichBtns Array of buttons to create. Any combination of ["json", "label", "publish", "record"] is allowed.
     *
     * "json": creates a button that triggers the download of the plot data in .json file format.
     *
     * "label": creates a button that opens the label manager that allows creation and editing of labels.
     *
     * "publish": creates a button that opens the publish to bp.bleb.li form.
     *
     * "record": creates a button to record the plot as a gif. (Requires inclusion of CCapture.js and its gif.worker.js).
     */
    Plots.prototype.createButtons = function (whichBtns) {
        if (whichBtns === void 0) { whichBtns = ["json", "label", "publish", "record"]; }
        if (whichBtns.indexOf("json") !== -1) {
            var jsonBtn = document.createElement("div");
            jsonBtn.className = "button";
            jsonBtn.onclick = this._downloadJson.bind(this);
            jsonBtn.innerHTML = SVGs_1.buttonSVGs.toJson;
            this._buttonBar.appendChild(jsonBtn);
        }
        if (whichBtns.indexOf("label") !== -1) {
            var labelBtn = document.createElement("div");
            labelBtn.className = "button";
            labelBtn.onclick = this._annotationManager.toggleLabelControl.bind(this._annotationManager);
            labelBtn.innerHTML = SVGs_1.buttonSVGs.labels;
            this._buttonBar.appendChild(labelBtn);
        }
        if (whichBtns.indexOf("record") !== -1) {
            var recordBtn = document.createElement("div");
            recordBtn.className = "button";
            recordBtn.onclick = this._startRecording.bind(this);
            recordBtn.innerHTML = SVGs_1.buttonSVGs.record;
            this._buttonBar.appendChild(recordBtn);
        }
        if (whichBtns.indexOf("publish") !== -1) {
            var publishBtn = document.createElement("div");
            publishBtn.className = "button";
            publishBtn.onclick = this._createPublishForm.bind(this);
            publishBtn.innerHTML = SVGs_1.buttonSVGs.publish;
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
        this._downloadObj["cameraAlpha"] = this.camera.alpha;
        this._downloadObj["cameraBeta"] = this.camera.beta;
        this._downloadObj["cameraRadius"] = this.camera.radius;
        this._downloadObj["labels"] = this._annotationManager.exportLabels();
        this._downloadObj["cameraAlpha"] = this.camera.alpha;
        this._downloadObj["cameraBeta"] = this.camera.beta;
        this._downloadObj["cameraRadius"] = this.camera.radius;
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
        formOverlay.style.top = r.y + "px";
        formOverlay.style.left = r.x + "px";
        formOverlay.style.width = r.width + "px";
        formOverlay.style.height = r.height + "px";
        formOverlay.style.backgroundColor = "#ffffff66";
        var formBox = document.createElement("div");
        formBox.style.width = "180px";
        formBox.style.margin = "42px auto";
        formBox.style.backgroundColor = "white";
        formBox.style.padding = "15px 30px";
        formBox.style.borderRadius = "10px";
        formBox.style.boxShadow = "0 0 10px #0003";
        formBox.className = "bbp publish-form";
        formOverlay.appendChild(formBox);
        // Upload description text
        var formInfo = document.createElement("p");
        formInfo.innerText = "Upload the plot to your account on https://bp.bleb.li. Only you will be able to see it. You can change the access settings in your account.";
        formInfo.className = "form-info";
        formBox.appendChild(formInfo);
        // Inputs and their labels
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
        // message placeholder
        var msg = document.createElement("p");
        msg.id = "publishMessage_" + this._uniqID;
        // Buttons
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
        // Add all form elements to the form
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
        this.plots[0].resetAnimation();
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
    Plots.prototype._startRecording = function () {
        this._recording = true;
    };
    /**
     * Register before render
     */
    Plots.prototype._prepRender = function () {
        // rotate camera around plot if turntable is true
        if (this.turntable) {
            this.camera.alpha += this.rotationRate;
        }
        // update plots with animations
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
                this._axes[0].axisData.range = [rangeX, rangeY, rangeZ];
                this._axes[0].update(this.camera, true);
            }
        }
        // update axis drawing
        if (this._axes) {
            for (var i = 0; i < this._axes.length; i++) {
                this._axes[i].update(this.camera);
            }
        }
        // update labels
        this._annotationManager.update();
        // for (let pltIdx = 0; pltIdx < this.plots.length; pltIdx++) {
        //     const plot = this.plots[pltIdx];
        //     plot.update();          
        // }
        // if (this._mouseOverCheck) {
        //     const pickResult = this._scene.pick(this._scene.pointerX, this._scene.pointerY);
        //     const faceId = pickResult.faceId;
        //     if (faceId == -1) {
        //         return;
        //     }
        //     const idx = this._SPS.pickedParticles[faceId].idx;
        //     this._mouseOverCallback(idx);
        // }
    };
    Plots.prototype._afterRender = function () {
        if (this._recording) {
            // start recording:
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
                // create capturer, enable turning
                this._capturer.start();
                this.rotationRate = 0.02;
                // to return turntable option to its initial state after recording
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
            // recording in progress:
            if (this._turned < 2 * Math.PI) {
                // while recording, count rotation and capture screenshots
                this._turned += this.rotationRate;
                this._capturer.capture(this.canvas);
            }
            else {
                // after capturing 360°, stop capturing and save gif
                this._recording = false;
                this._capturer.stop();
                var loadingText = document.getElementById("GIFloadingText_" + this._uniqID);
                loadingText.innerText = "Saving GIF...";
                this._capturer.save(function (blob) {
                    downloadjs_1.default(blob, "babyplots.gif", 'image/gif');
                    document.getElementById("GIFloadingText_" + this._uniqID).remove();
                    document.getElementById("GIFloadingOverlay_" + this._uniqID).remove();
                });
                this._turned = 0;
                this.rotationRate = 0.01;
                this._hl2.diffuse = new math_1.Color3(0.8, 0.8, 0.8);
                if (!this._wasTurning) {
                    this.turntable = false;
                }
            }
        }
    };
    /**
     * Zoom camera to fit the complete SPS into the field of view
     */
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
        this.camera.beta = 1; // 0 is top view, Pi is bottom
        this.ymax = yRange[1];
    };
    /**
     * Creates a 3-dimensional visualization of an RGB image stack, as generated from e.g. a fluorescent microscope, and adds it to the Plots object to visualize it in a canvas. The data must be in a special format for this function which is optimized for size. The easiest way to create this visualization is using the R implementation of babyplots, which includes a function to directly read .tif files.
     *
     * @param values An array of intensity values. Currently only 8-bit images are supported (0-255).
     * @param indices Indices of the values in the original image.
     * @param attributes Image attributes. Only a "dim" attribute is needed containing the dimensions (x, y, c, z) of the image.
     * @param options An object with options to customize the visualization.
     *
     * Find a list of possible options [here](https://bp.bleb.li/documentation/js#addImgStack).
     */
    Plots.prototype.addImgStack = function (values, indices, attributes, options) {
        // default options
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
            intensityMode: "alpha"
        };
        // apply user options
        Object.assign(opts, options);
        // prepare object for download as json button
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
            intensityMode: opts.intensityMode
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
        var plot = new ImgStack_1.ImgStack(this.scene, values, indices, attributes, legendData, opts.size, this._backgroundColor, opts.intensityMode, this._xScale, this._yScale, this._zScale);
        this.plots.push(plot);
        this._updateLegend();
        this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;
        return this;
    };
    /**
     * Creates a plot and adds it to the Plots object to visualize it in a canvas. The plot types section below enumerates the different kinds of visualizations that can be created using this method.
     *
     * @param coordinates An array of arrays with coordinates of data points.
     * @param plotType The name of one of the plot types. Either "pointCloud", "heatMap", or "surface".
     * @param colorBy How to interpret the colorVar parameter, either "direct", "categories", or "values". If colorVar is an array of hex strings, colorBy should be "direct". If colorVar is an array of discrete values (e.g. category names), colorBy should be "categories". If colorVar is an array of continuous values, colorBy should be "values".
     * @param colorVar an array of hex strings, category names, or values, corresponding to the data points in the coordinates parameter.
     * @param options An object with general and plot type specific options.
     *
     * Find a list of possible options [here](https://bp.bleb.li/documentation/js#addPlot).
     */
    Plots.prototype.addPlot = function (coordinates, plotType, colorBy, colorVar, options) {
        if (options === void 0) { options = {}; }
        // default options
        var opts = {
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
            legendShapeTitle: null,
            legendShapeFontSize: 16,
            legendShapeTitleFontColor: "black",
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
            rownames: null,
            shape: null,
            shading: true
        };
        // apply user options
        Object.assign(opts, options);
        // create plot data object for download as json button
        this._downloadObj["plots"].push({
            plotType: plotType,
            coordinates: coordinates,
            colorBy: colorBy,
            colorVar: colorVar,
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
            showShape: opts.legendShowShape,
            legendShapeTitle: opts.legendShapeTitle,
            legendShapeTitleFontSize: opts.legendShapeFontSize,
            legendShowTitleFontColor: opts.legendShapeTitleFontColor,
            showAxes: opts.showAxes,
            axisLabels: opts.axisLabels,
            axisColors: opts.axisColors,
            tickBreaks: opts.tickBreaks,
            showTickLines: opts.showTickLines,
            tickLineColors: opts.tickLineColors,
            folded: opts.folded,
            foldedEmbedding: opts.foldedEmbedding,
            foldAnimDelay: opts.foldAnimDelay,
            foldAnimDuration: opts.foldAnimDuration,
            colnames: opts.colnames,
            rownames: opts.rownames,
            shape: opts.shape,
            shading: opts.shading
        });
        var coordColors = [];
        var legendData;
        var rangeX;
        var rangeY;
        var rangeZ;
        this._hasAnim = opts.folded;
        if (opts.folded) {
            var replayBtn = document.createElement("div");
            replayBtn.className = "button";
            replayBtn.innerHTML = SVGs_1.buttonSVGs.replay;
            replayBtn.onclick = this._resetAnimation.bind(this);
            this._buttonBar.appendChild(replayBtn);
        }
        switch (colorBy) {
            case "categories":
                // color plot by discrete categories
                var groups = colorVar;
                var uniqueGroups = getUniqueVals(groups);
                // sortedCategories can contain an array of category names to order the groups for coloring.
                // sortedCategories must be of same length as unique groups in colorVar.
                // if no custom ordering is performed through sortedCategories, groups will be sorted alphabetically.
                uniqueGroups.sort();
                if (opts.sortedCategories) {
                    if (uniqueGroups.length === opts.sortedCategories.length) {
                        // sortedCategories must contain the same category names as those present in colorVar.
                        if (JSON.stringify(uniqueGroups) === JSON.stringify(opts.sortedCategories.slice(0).sort())) {
                            uniqueGroups = opts.sortedCategories;
                        }
                    }
                }
                var nColors = uniqueGroups.length;
                // Paired is default color scale for discrete variable coloring
                var colors = chroma_js_1.default.scale(chroma_js_1.default.brewer.Paired).mode('lch').colors(nColors);
                // check if color scale should be custom
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
                        // set colorScale variable to default for legend if custom color scale is invalid
                        opts.colorScale = "Paired";
                    }
                }
                else {
                    // check if user selected color scale is a valid chromajs color brewer name
                    if (opts.colorScale && chroma_js_1.default.brewer.hasOwnProperty(opts.colorScale)) {
                        if (opts.colorScaleInverted) {
                            colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).domain([1, 0]).mode('lch').colors(nColors);
                        }
                        else {
                            colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).mode('lch').colors(nColors);
                        }
                    }
                    else {
                        // set colorScale variable to default for legend if user selected is not valid
                        opts.colorScale = "Paired";
                    }
                }
                for (var i = 0; i < nColors; i++) {
                    colors[i] += "ff";
                }
                // apply colors to plot points
                for (var i = 0; i < colorVar.length; i++) {
                    var colorIndex = uniqueGroups.indexOf(groups[i]);
                    coordColors.push(colors[colorIndex]);
                }
                // prepare object for legend drawing
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
                // color by a continuous variable
                var min_1 = colorVar.min();
                var max_1 = colorVar.max();
                // Oranges is default color scale for continuous variable coloring
                var colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer.Oranges).mode('lch');
                // check if color scale should be custom
                if (opts.colorScale === "custom") {
                    // check if custom color scale is valid
                    if (opts.customColorScale !== undefined && opts.customColorScale.length !== 0) {
                        if (opts.colorScaleInverted) {
                            colorfunc_1 = chroma_js_1.default.scale(opts.customColorScale).domain([1, 0]).mode('lch');
                        }
                        else {
                            colorfunc_1 = chroma_js_1.default.scale(opts.customColorScale).mode('lch');
                        }
                    }
                    else {
                        // set colorScale variable to default for legend if custom color scale is invalid
                        opts.colorScale = "Oranges";
                    }
                }
                else {
                    // check if user selected color scale is a valid chromajs color brewer name
                    if (opts.colorScale && chroma_js_1.default.brewer.hasOwnProperty(opts.colorScale)) {
                        if (opts.colorScaleInverted) {
                            colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).domain([1, 0]).mode('lch');
                        }
                        else {
                            colorfunc_1 = chroma_js_1.default.scale(chroma_js_1.default.brewer[opts.colorScale]).mode('lch');
                        }
                    }
                    else {
                        // set colorScale variable to default for legend if user selected is not valid
                        opts.colorScale = "Oranges";
                    }
                }
                // normalize the values to 0-1 range
                var norm = colorVar.slice().map(function (v) { return (v - min_1) / (max_1 - min_1); });
                // apply colors to plot points
                coordColors = norm.map(function (v) { return colorfunc_1(v).alpha(1).hex("rgba"); });
                // prepare object for legend drawing
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
                // color by color hex strings in colorVar
                for (var i = 0; i < colorVar.length; i++) {
                    var cl = colorVar[i];
                    cl = chroma_js_1.default(cl).hex();
                    if (cl.length == 7) {
                        cl += "ff";
                    }
                    coordColors.push(cl);
                }
                // prepare object for legend drawing
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
        // add remaining properties to legend object
        legendData.fontSize = opts.fontSize;
        legendData.fontColor = opts.fontColor;
        legendData.legendTitle = opts.legendTitle;
        legendData.legendTitleFontSize = opts.legendTitleFontSize;
        legendData.legendTitleFontColor = opts.legendTitleFontColor;
        legendData.showShape = opts.legendShowShape;
        legendData.legendShapeTitle = opts.legendShapeTitle;
        legendData.legendShapeTitleFontSize = opts.legendShapeFontSize;
        legendData.legendShowTitleFontColor = opts.legendShapeTitleFontColor;
        var plot;
        var scale;
        var boundingBox;
        switch (plotType) {
            case "pointCloud":
                plot = new PointCloud_1.PointCloud(this.scene, coordinates, coordColors, opts.size, legendData, opts.folded, opts.foldedEmbedding, opts.foldAnimDelay, opts.foldAnimDuration, this._xScale, this._yScale, this._zScale);
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
                plot = new Surface_1.Surface(this.scene, coordinates, coordColors, opts.size, legendData, this._xScale, this._yScale, this._zScale);
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
                plot = new ShapeCloud_1.ShapeCloud(this.scene, coordinates, coordColors, opts.shape, opts.shading, opts.size, legendData, this._xScale, this._yScale, this._zScale);
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
                plot = new HeatMap_1.HeatMap(this.scene, coordinates, coordColors, opts.size, legendData, this._xScale, this._yScale, this._zScale);
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
        }
        this.plots.push(plot);
        this._updateLegend();
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
    /**
     * Creates a color legend for the plots
     */
    Plots.prototype._updateLegend = function () {
        if (this._legend) {
            this._legend.dispose();
        }
        // create fullscreen GUI texture
        var uiLayer = advancedDynamicTexture_1.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var rightFree = true;
        var leftFree = true;
        for (var i = 0; i < this.plots.length; i++) {
            var plot = this.plots[i];
            var legendData = plot.legendData;
            if (["right", "left"].indexOf(legendData.position) === -1) {
                legendData.position = null;
            }
            if (legendData.showLegend) {
                if (legendData.position === null) {
                    if (rightFree) {
                        legendData.position = "right";
                        rightFree = false;
                    }
                    else if (leftFree) {
                        legendData.position = "left";
                        leftFree = false;
                    }
                    else {
                        legendData.showLegend = false;
                    }
                }
                else {
                    if (legendData.position === "right") {
                        rightFree = false;
                    }
                    else {
                        leftFree = false;
                    }
                }
                uiLayer = this._createPlotLegend(legendData, uiLayer);
            }
        }
        this._legend = uiLayer;
    };
    Plots.prototype._createPlotLegend = function (legendData, uiLayer) {
        if (!legendData.showLegend) {
            return uiLayer;
        }
        var n;
        var breakN = 15;
        if (this.canvas.height > 220) {
            breakN = 20;
        }
        if (this.canvas.height > 650) {
            breakN = 40;
        }
        // create grid for placing legend in correct position
        var grid = new controls_1.Grid();
        uiLayer.addControl(grid);
        // main position of legend (right middle)
        var legendWidth = 0.2;
        if (legendData.discrete) {
            // number of clusters
            n = legendData.breaks.length;
            if (n > breakN * 2) {
                legendWidth = 0.4;
            }
            else if (n > breakN) {
                legendWidth = 0.3;
            }
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
            legendTitle.color = legendData.legendTitleFontColor;
            legendTitle.fontWeight = "bold";
            if (legendData.legendTitleFontSize) {
                legendTitle.fontSize = legendData.legendTitleFontSize + "px";
            }
            else {
                legendTitle.fontSize = "20px";
            }
            legendTitle.verticalAlignment = controls_1.Control.VERTICAL_ALIGNMENT_BOTTOM;
            legendTitle.horizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
            grid.addControl(legendTitle, 0, legendColumn);
        }
        // for continuous measures display color bar and max and min values.
        if (!legendData.discrete) {
            var innerGrid_1 = new controls_1.Grid();
            innerGrid_1.addColumnDefinition(0.2);
            innerGrid_1.addColumnDefinition(0.8);
            grid.addControl(innerGrid_1, 1, legendColumn);
            var nBreaks = 115;
            var labelSpace = 0.15;
            if (this.canvas.height < 70) {
                nBreaks = 10;
                labelSpace = 0.45;
                innerGrid_1.addRowDefinition(1);
            }
            else if (this.canvas.height < 130) {
                nBreaks = 50;
                labelSpace = 0.3;
                innerGrid_1.addRowDefinition(1);
            }
            else {
                var padding = (this.canvas.height - 115) / 2;
                innerGrid_1.addRowDefinition(padding, true);
                innerGrid_1.addRowDefinition(115, true);
                innerGrid_1.addRowDefinition(padding, true);
            }
            // color bar
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
                var legendColor_1 = new controls_1.Rectangle();
                if (legendData.inverted) {
                    legendColor_1.background = colors[i];
                }
                else {
                    legendColor_1.background = colors[colors.length - i - 1];
                }
                legendColor_1.thickness = 0;
                legendColor_1.width = 0.5;
                legendColor_1.height = 1;
                scaleGrid.addControl(legendColor_1, i, 0);
            }
            // label text
            var labelGrid = new controls_1.Grid();
            labelGrid.addColumnDefinition(1);
            labelGrid.addRowDefinition(labelSpace);
            labelGrid.addRowDefinition(1 - labelSpace * 2);
            labelGrid.addRowDefinition(labelSpace);
            if (this.canvas.height < 130) {
                innerGrid_1.addControl(scaleGrid, 0, 0);
                innerGrid_1.addControl(labelGrid, 0, 1);
            }
            else {
                innerGrid_1.addControl(scaleGrid, 1, 0);
                innerGrid_1.addControl(labelGrid, 1, 1);
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
            // inner Grid contains legend rows and columns for color and text
            var innerGrid = new controls_1.Grid();
            // two legend columns when more than 15 colors
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
            grid.addControl(innerGrid, 1, legendColumn);
            var colors = void 0;
            if (legendData.colorScale === "custom") {
                colors = chroma_js_1.default.scale(legendData.customColorScale).mode('lch').colors(n);
            }
            else {
                colors = chroma_js_1.default.scale(chroma_js_1.default.brewer[legendData.colorScale]).mode('lch').colors(n);
            }
            // add color box and legend text
            for (var i = 0; i < n; i++) {
                // color
                var legendColor = new controls_1.Rectangle();
                legendColor.background = colors[i];
                legendColor.thickness = 0;
                legendColor.width = legendData.fontSize + "px";
                legendColor.height = legendData.fontSize + "px";
                // use second column for many entries
                if (i > breakN * 2 - 1) {
                    innerGrid.addControl(legendColor, i - breakN * 2, 4);
                }
                else if (i > breakN - 1) {
                    innerGrid.addControl(legendColor, i - breakN, 2);
                }
                else {
                    innerGrid.addControl(legendColor, i, 0);
                }
                // text
                var legendText = new controls_1.TextBlock();
                legendText.text = legendData.breaks[i].toString();
                legendText.color = legendData.fontColor;
                legendText.fontSize = legendData.fontSize + "px";
                legendText.textHorizontalAlignment = controls_1.Control.HORIZONTAL_ALIGNMENT_LEFT;
                // use second column for many entries
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
        return uiLayer;
    };
    /**
     * Start rendering the scene
     */
    Plots.prototype.doRender = function () {
        var _this = this;
        this._engine.runRenderLoop(function () {
            _this.scene.render();
        });
        return this;
    };
    /**
     * Resizes the visualization to the current size of the canvas. This method should be bound to a resize event of the canvas. It is also recommended to call the resize() method once after the doRender() call.
     *
     * @param width Optional: Width of the canvas
     * @param height Optional: Height of the canvas
     */
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
        this._resizePublishOverlay();
        this._engine.resize();
        return this;
    };
    /**
     * Saves a screenshot of the visualization.
     *
     * @param size Width and height of square thumbnail in pixels
     * @param saveCallback Function that takes the created screenshot as base64 encoded string.
     */
    Plots.prototype.thumbnail = function (size, saveCallback) {
        screenshotTools_1.ScreenshotTools.CreateScreenshot(this._engine, this.camera, size, saveCallback);
    };
    /**
     * Releases all held resources of the Plots visualization. Useful to clear memory, after a visualization is no longer needed.
     */
    Plots.prototype.dispose = function () {
        this.scene.dispose();
        this._engine.dispose();
    };
    /**
     * Add labels from a list of labels.
     *
     * @param labelList List of lists with the first three elements of the inner lists being the x, y and z coordinates, and the fourth the label text.
     */
    Plots.prototype.addLabels = function (labelList) {
        this._annotationManager.addLabels(labelList);
    };
    return Plots;
}());
exports.Plots = Plots;
//# sourceMappingURL=babyplots.js.map