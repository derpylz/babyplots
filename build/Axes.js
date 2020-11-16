"use strict";
/**
 * Babyplots - Easy, fast, interactive 3D visualizations
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
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Axes = void 0;
var mesh_1 = require("@babylonjs/core/Meshes/mesh");
var linesBuilder_1 = require("@babylonjs/core/Meshes/Builders/linesBuilder");
var math_1 = require("@babylonjs/core/Maths/math");
var dynamicTexture_1 = require("@babylonjs/core/Materials/Textures/dynamicTexture");
var standardMaterial_1 = require("@babylonjs/core/Materials/standardMaterial");
/**
 * Class to store and update plot axes.
 */
var Axes = /** @class */ (function () {
    /**
     * Create axes for plot.
     * @param axisData object containing all information about axis setup.
     * @param scene BABYLON scene.
     */
    function Axes(axisData, scene, heatmap) {
        if (heatmap === void 0) { heatmap = false; }
        this._axes = [];
        this._axisLabels = [];
        this._ticks = [];
        this._tickLabels = [];
        this._tickLines = [];
        this.axisData = axisData;
        this._scene = scene;
        this._createAxes(heatmap);
    }
    Axes.prototype._roundTicks = function (num, scale) {
        if (scale === void 0) { scale = 2; }
        if (!("" + num).includes("e")) {
            return +(Math.round(parseFloat(num.toString() + "e+" + scale.toString())) + "e-" + scale);
        }
        else {
            var arr = ("" + num).split("e");
            var sig = "";
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            return +(Math.round(parseFloat(+arr[0].toString() + "e" + sig.toString() + (+arr[1].toString() + scale.toString()))) + "e-" + scale);
        }
    };
    Axes.prototype._createAxes = function (heatmap) {
        if (heatmap === void 0) { heatmap = false; }
        if (heatmap) {
            // Tick breaks for heat map on x and z coordinates have to match columns and rows
            this.axisData.tickBreaks[0] = 1;
            this.axisData.tickBreaks[2] = 1;
        }
        // Apply scaling factor to tick break interval to get distance between ticks
        var xtickBreaks = this.axisData.tickBreaks[0] * this.axisData.scale[0];
        var ytickBreaks = this.axisData.tickBreaks[1] * this.axisData.scale[1];
        var ztickBreaks = this.axisData.tickBreaks[2] * this.axisData.scale[2];
        // Find minima and maxima of the axes as a multiple of the tick interval distance
        var xmin = Math.floor(this.axisData.range[0][0] / xtickBreaks) * xtickBreaks;
        var ymin = Math.floor(this.axisData.range[1][0] / ytickBreaks) * ytickBreaks;
        var zmin = Math.floor(this.axisData.range[2][0] / ztickBreaks) * ztickBreaks;
        var xmax = Math.ceil(this.axisData.range[0][1] / xtickBreaks) * xtickBreaks;
        var ymax = Math.ceil(this.axisData.range[1][1] / ytickBreaks) * ytickBreaks;
        var zmax = Math.ceil(this.axisData.range[2][1] / ztickBreaks) * ztickBreaks;
        // Create X axis
        if (this.axisData.showAxes[0]) {
            // Create axis line
            var axisX = linesBuilder_1.LinesBuilder.CreateLines("axisX", {
                points: [
                    new math_1.Vector3(xmin, ymin, zmin),
                    new math_1.Vector3(xmax, ymin, zmin)
                ]
            }, this._scene);
            // Apply axis color
            axisX.color = math_1.Color3.FromHexString(this.axisData.color[0]);
            this._axes.push(axisX);
            // Create axis label
            var xChar = this._makeTextPlane(this.axisData.axisLabels[0], 1, this.axisData.color[0]);
            // Place label near end of the axis
            xChar.position = new math_1.Vector3(xmax / 2, ymin - 0.5 * ymax, zmin);
            this._axisLabels.push(xChar);
            // Create ticks and tick lines
            var xTicks = [];
            // Find x coordinates for ticks
            // Negative ticks
            for (var i = 0; i < -Math.ceil(this.axisData.range[0][0] / xtickBreaks); i++) {
                xTicks.push(-(i + 1) * xtickBreaks);
            }
            // Positive ticks
            for (var i = 0; i <= Math.ceil(this.axisData.range[0][1] / xtickBreaks); i++) {
                xTicks.push(i * xtickBreaks);
            }
            // Usually ticks start with 0, heat map starts with 1
            var startTick = 0;
            if (heatmap) {
                startTick = 1;
            }
            // Create all ticks
            for (var i = startTick; i < xTicks.length; i++) {
                var tickPos = xTicks[i];
                if (heatmap) {
                    tickPos = tickPos - 0.5 * this.axisData.scale[0];
                }
                var tick = linesBuilder_1.LinesBuilder.CreateLines("xTicks", {
                    points: [
                        new math_1.Vector3(tickPos, ymin, zmin + 0.05 * xmax),
                        new math_1.Vector3(tickPos, ymin, zmin),
                        new math_1.Vector3(tickPos, ymin + 0.05 * ymax, zmin)
                    ]
                }, this._scene);
                tick.color = math_1.Color3.FromHexString(this.axisData.color[0]);
                this._ticks.push(tick);
                var tickLabel = this._roundTicks(tickPos / this.axisData.scale[0]).toString();
                if (heatmap) {
                    tickLabel = this.axisData.colnames[i - 1];
                }
                if (tickLabel === undefined) {
                    continue;
                }
                var tickChar = this._makeTextPlane(tickLabel, 0.6, this.axisData.color[0]);
                tickChar.position = new math_1.Vector3(tickPos, ymin - 0.1 * ymax, zmin);
                this._tickLabels.push(tickChar);
                if (this.axisData.showTickLines[0][0]) {
                    var tickLine = linesBuilder_1.LinesBuilder.CreateLines("xTickLines", {
                        points: [
                            new math_1.Vector3(tickPos, ymax, zmin),
                            new math_1.Vector3(tickPos, ymin, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = math_1.Color3.FromHexString(this.axisData.tickLineColor[0][0]);
                    this._tickLines.push(tickLine);
                }
                if (this.axisData.showTickLines[0][1]) {
                    var tickLine = linesBuilder_1.LinesBuilder.CreateLines("xTickLines", {
                        points: [
                            new math_1.Vector3(tickPos, ymin, zmax),
                            new math_1.Vector3(tickPos, ymin, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = math_1.Color3.FromHexString(this.axisData.tickLineColor[0][1]);
                    this._tickLines.push(tickLine);
                }
            }
        }
        // create Y axis
        if (this.axisData.showAxes[1]) {
            // axis
            var axisY = linesBuilder_1.LinesBuilder.CreateLines("axisY", {
                points: [
                    new math_1.Vector3(xmin, ymin, zmin),
                    new math_1.Vector3(xmin, ymax, zmin)
                ]
            }, this._scene);
            axisY.color = math_1.Color3.FromHexString(this.axisData.color[1]);
            this._axes.push(axisY);
            // label
            var yChar = this._makeTextPlane(this.axisData.axisLabels[1], 1, this.axisData.color[1]);
            yChar.position = new math_1.Vector3(xmin, ymax / 2, zmin - 0.5 * ymax);
            this._axisLabels.push(yChar);
            // y ticks and tick lines
            var yTicks = [];
            for (var i = 0; i < -Math.ceil(this.axisData.range[1][0] / ytickBreaks); i++) {
                yTicks.push(-(i + 1) * ytickBreaks);
            }
            for (var i = 0; i <= Math.ceil(this.axisData.range[1][1] / ytickBreaks); i++) {
                yTicks.push(i * ytickBreaks);
            }
            for (var i = 0; i < yTicks.length; i++) {
                var tickPos = yTicks[i];
                var tick = linesBuilder_1.LinesBuilder.CreateLines("yTicks", {
                    points: [
                        new math_1.Vector3(xmin, tickPos, zmin + 0.05 * zmax),
                        new math_1.Vector3(xmin, tickPos, zmin),
                        new math_1.Vector3(xmin + 0.05 * xmax, tickPos, zmin)
                    ]
                }, this._scene);
                tick.color = math_1.Color3.FromHexString(this.axisData.color[1]);
                this._ticks.push(tick);
                var tickLabel = this._roundTicks(tickPos / this.axisData.scale[1]);
                var tickChar = this._makeTextPlane(tickLabel.toString(), 0.6, this.axisData.color[1]);
                tickChar.position = new math_1.Vector3(xmin, tickPos, zmin - 0.05 * ymax);
                this._tickLabels.push(tickChar);
                // tick lines
                if (this.axisData.showTickLines[1][0]) {
                    var tickLine = linesBuilder_1.LinesBuilder.CreateLines("yTicksLines", {
                        points: [
                            new math_1.Vector3(xmax, tickPos, zmin),
                            new math_1.Vector3(xmin, tickPos, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = math_1.Color3.FromHexString(this.axisData.tickLineColor[1][0]);
                    this._tickLines.push(tickLine);
                }
                if (this.axisData.showTickLines[1][1]) {
                    var tickLine = linesBuilder_1.LinesBuilder.CreateLines("yTickLines", {
                        points: [
                            new math_1.Vector3(xmin, tickPos, zmax),
                            new math_1.Vector3(xmin, tickPos, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = math_1.Color3.FromHexString(this.axisData.tickLineColor[1][1]);
                    this._tickLines.push(tickLine);
                }
            }
        }
        // create Z axis
        if (this.axisData.showAxes[2]) {
            // axis
            var axisZ = linesBuilder_1.LinesBuilder.CreateLines("axisZ", {
                points: [
                    new math_1.Vector3(xmin, ymin, zmin),
                    new math_1.Vector3(xmin, ymin, zmax)
                ]
            }, this._scene);
            axisZ.color = math_1.Color3.FromHexString(this.axisData.color[2]);
            this._axes.push(axisZ);
            // label
            var zChar = this._makeTextPlane(this.axisData.axisLabels[2], 1, this.axisData.color[2]);
            zChar.position = new math_1.Vector3(xmin, ymin - 0.5 * ymax, zmax / 2);
            this._axisLabels.push(zChar);
            // z ticks and tick lines
            var zTicks = [];
            for (var i = 0; i < -Math.ceil(this.axisData.range[2][0] / ztickBreaks); i++) {
                zTicks.push(-(i + 1) * ztickBreaks);
            }
            for (var i = 0; i <= Math.ceil(this.axisData.range[2][1] / ztickBreaks); i++) {
                zTicks.push(i * ztickBreaks);
            }
            var startTick = 0;
            if (heatmap) {
                startTick = 1;
            }
            for (var i = startTick; i < zTicks.length; i++) {
                var tickPos = zTicks[i];
                if (heatmap) {
                    tickPos = tickPos - 0.5 * this.axisData.scale[2];
                }
                var tick = linesBuilder_1.LinesBuilder.CreateLines("zTicks", {
                    points: [
                        new math_1.Vector3(xmin + 0.05 * xmax, ymin, tickPos),
                        new math_1.Vector3(xmin, ymin, tickPos),
                        new math_1.Vector3(xmin, ymin + 0.05 * ymax, tickPos)
                    ]
                }, this._scene);
                tick.color = math_1.Color3.FromHexString(this.axisData.color[2]);
                this._ticks.push(tick);
                var tickLabel = this._roundTicks(tickPos / this.axisData.scale[2]).toString();
                if (heatmap) {
                    tickLabel = this.axisData.rownames[i - 1];
                }
                if (tickLabel === undefined) {
                    continue;
                }
                var tickChar = this._makeTextPlane(tickLabel, 0.6, this.axisData.color[2]);
                tickChar.position = new math_1.Vector3(xmin, ymin - 0.1 * ymax, tickPos);
                this._tickLabels.push(tickChar);
                // tick lines
                if (this.axisData.showTickLines[2][0]) {
                    var tickLine = linesBuilder_1.LinesBuilder.CreateLines("zTickLines", {
                        points: [
                            new math_1.Vector3(xmax, ymin, tickPos),
                            new math_1.Vector3(xmin, ymin, tickPos)
                        ]
                    }, this._scene);
                    tickLine.color = math_1.Color3.FromHexString(this.axisData.tickLineColor[2][0]);
                    this._tickLines.push(tickLine);
                }
                if (this.axisData.showTickLines[2][1]) {
                    var tickLine = linesBuilder_1.LinesBuilder.CreateLines("zTickLines", {
                        points: [
                            new math_1.Vector3(xmin, ymax, tickPos),
                            new math_1.Vector3(xmin, ymin, tickPos)
                        ]
                    }, this._scene);
                    tickLine.color = math_1.Color3.FromHexString(this.axisData.tickLineColor[2][1]);
                    this._tickLines.push(tickLine);
                }
            }
        }
    };
    Axes.prototype._makeTextPlane = function (text, size, color) {
        var dynamicTexture = new dynamicTexture_1.DynamicTexture("DynamicTexture", 75, this._scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, (40 - text.length * 4) + "px Arial", color, "transparent", true);
        var plane = mesh_1.Mesh.CreatePlane("TextPlane", size, this._scene, true);
        var material = new standardMaterial_1.StandardMaterial("TextPlaneMaterial", this._scene);
        material.backFaceCulling = false;
        material.specularColor = new math_1.Color3(0, 0, 0);
        material.diffuseTexture = dynamicTexture;
        plane.material = material;
        return plane;
    };
    Axes.prototype.update = function (camera, updateAxisData) {
        if (updateAxisData) {
            for (var i = 0; i < this._axes.length; i++) {
                this._axes[i].dispose();
            }
            for (var i = 0; i < this._axisLabels.length; i++) {
                this._axisLabels[i].dispose();
            }
            for (var i = 0; i < this._ticks.length; i++) {
                this._ticks[i].dispose();
            }
            for (var i = 0; i < this._tickLabels.length; i++) {
                this._tickLabels[i].dispose();
            }
            for (var i = 0; i < this._tickLines.length; i++) {
                this._tickLines[i].dispose();
            }
            this._createAxes();
        }
        if (this.axisData.showAxes) {
            var axis1 = math_1.Vector3.Cross(camera.position, math_1.Axis.Y);
            var axis2 = math_1.Vector3.Cross(axis1, camera.position);
            var axis3 = math_1.Vector3.Cross(axis1, axis2);
            for (var i = 0; i < this._axisLabels.length; i++) {
                this._axisLabels[i].rotation = math_1.Vector3.RotationFromAxis(axis1, axis2, axis3);
            }
            for (var i = 0; i < this._tickLabels.length; i++) {
                this._tickLabels[i].rotation = math_1.Vector3.RotationFromAxis(axis1, axis2, axis3);
            }
        }
    };
    return Axes;
}());
exports.Axes = Axes;
//# sourceMappingURL=Axes.js.map