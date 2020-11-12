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

import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { LinesBuilder } from "@babylonjs/core/Meshes/Builders/linesBuilder";
import { LinesMesh } from "@babylonjs/core/Meshes/linesMesh";
import { Vector3, Axis, Color3} from "@babylonjs/core/Maths/math";
import { DynamicTexture } from "@babylonjs/core/Materials/Textures/dynamicTexture";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { AxisData } from "./babyplots";

/**
 * Class to store and update plot axes.
 */
export class Axes {
    private _axes: LinesMesh[] = [];
    private _axisLabels: Mesh[] = [];
    private _ticks: LinesMesh[] = [];
    private _tickLabels: Mesh[] = [];
    private _tickLines: LinesMesh[] = [];
    private _scene: Scene;
    axisData: AxisData;
    /**
     * Create axes for plot.
     * @param axisData object containing all information about axis setup.
     * @param scene BABYLON scene.
     */
    constructor(axisData: AxisData, scene: Scene, heatmap: boolean = false) {
        this.axisData = axisData;
        this._scene = scene;
        this._createAxes(heatmap);
    }
    private _roundTicks(num: number, scale: number = 2): number {
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
    }
    private _createAxes(heatmap: boolean = false): void {
        if (heatmap) {
            // Tick breaks for heat map on x and z coordinates have to match columns and rows
            this.axisData.tickBreaks[0] = 1;
            this.axisData.tickBreaks[2] = 1;
        }
        // Apply scaling factor to tick break interval to get distance between ticks
        let xtickBreaks = this.axisData.tickBreaks[0] * this.axisData.scale[0];
        let ytickBreaks = this.axisData.tickBreaks[1] * this.axisData.scale[1];
        let ztickBreaks = this.axisData.tickBreaks[2] * this.axisData.scale[2];
        // Find minima and maxima of the axes as a multiple of the tick interval distance
        let xmin = Math.floor(this.axisData.range[0][0] / xtickBreaks) * xtickBreaks;
        let ymin = Math.floor(this.axisData.range[1][0] / ytickBreaks) * ytickBreaks;
        let zmin = Math.floor(this.axisData.range[2][0] / ztickBreaks) * ztickBreaks;
        let xmax = Math.ceil(this.axisData.range[0][1] / xtickBreaks) * xtickBreaks;
        let ymax = Math.ceil(this.axisData.range[1][1] / ytickBreaks) * ytickBreaks;
        let zmax = Math.ceil(this.axisData.range[2][1] / ztickBreaks) * ztickBreaks;
        // Create X axis
        if (this.axisData.showAxes[0]) {
            // Create axis line
            let axisX = LinesBuilder.CreateLines("axisX", {
                points: [
                    new Vector3(xmin, ymin, zmin),
                    new Vector3(xmax, ymin, zmin)
                ]
            }, this._scene);
            // Apply axis color
            axisX.color = Color3.FromHexString(this.axisData.color[0]);
            this._axes.push(axisX);
            // Create axis label
            let xChar = this._makeTextPlane(this.axisData.axisLabels[0], 1, this.axisData.color[0]);
            // Place label near end of the axis
            xChar.position = new Vector3(xmax / 2, ymin - 0.5 * ymax, zmin);
            this._axisLabels.push(xChar);
            // Create ticks and tick lines
            let xTicks = [];
            // Find x coordinates for ticks
            // Negative ticks
            for (let i = 0; i < -Math.ceil(this.axisData.range[0][0] / xtickBreaks); i++) {
                xTicks.push(-(i + 1) * xtickBreaks);
            }
            // Positive ticks
            for (let i = 0; i <= Math.ceil(this.axisData.range[0][1] / xtickBreaks); i++) {
                xTicks.push(i * xtickBreaks);
            }
            // Usually ticks start with 0, heat map starts with 1
            let startTick = 0;
            if (heatmap) {
                startTick = 1;
            }
            // Create all ticks
            for (let i = startTick; i < xTicks.length; i++) {
                let tickPos = xTicks[i];
                if (heatmap) {
                    tickPos = tickPos - 0.5 * this.axisData.scale[0];
                }
                let tick = LinesBuilder.CreateLines("xTicks", {
                    points: [
                        new Vector3(tickPos, ymin, zmin + 0.05 * xmax),
                        new Vector3(tickPos, ymin, zmin),
                        new Vector3(tickPos, ymin + 0.05 * ymax, zmin)
                    ]
                }, this._scene);
                tick.color = Color3.FromHexString(this.axisData.color[0]);
                this._ticks.push(tick);
                let tickLabel = this._roundTicks(tickPos / this.axisData.scale[0]).toString();
                if (heatmap) {
                    tickLabel = this.axisData.colnames[i - 1];
                }
                if (tickLabel === undefined) {
                    continue;
                }
                let tickChar = this._makeTextPlane(tickLabel, 0.6, this.axisData.color[0]);
                tickChar.position = new Vector3(tickPos, ymin - 0.1 * ymax, zmin);
                this._tickLabels.push(tickChar);
                if (this.axisData.showTickLines[0][0]) {
                    let tickLine = LinesBuilder.CreateLines("xTickLines", {
                        points: [
                            new Vector3(tickPos, ymax, zmin),
                            new Vector3(tickPos, ymin, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = Color3.FromHexString(this.axisData.tickLineColor[0][0]);
                    this._tickLines.push(tickLine);
                }
                if (this.axisData.showTickLines[0][1]) {
                    let tickLine = LinesBuilder.CreateLines("xTickLines", {
                        points: [
                            new Vector3(tickPos, ymin, zmax),
                            new Vector3(tickPos, ymin, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = Color3.FromHexString(this.axisData.tickLineColor[0][1]);
                    this._tickLines.push(tickLine);
                }
            }
        }
        // create Y axis
        if (this.axisData.showAxes[1]) {
            // axis
            let axisY = LinesBuilder.CreateLines("axisY", {
                points: [
                    new Vector3(xmin, ymin, zmin),
                    new Vector3(xmin, ymax, zmin)
                ]
            }, this._scene);
            axisY.color = Color3.FromHexString(this.axisData.color[1]);
            this._axes.push(axisY);
            // label
            let yChar = this._makeTextPlane(this.axisData.axisLabels[1], 1, this.axisData.color[1]);
            yChar.position = new Vector3(xmin, ymax / 2, zmin - 0.5 * ymax);
            this._axisLabels.push(yChar);
            // y ticks and tick lines
            let yTicks = [];
            for (let i = 0; i < -Math.ceil(this.axisData.range[1][0] / ytickBreaks); i++) {
                yTicks.push(-(i + 1) * ytickBreaks);
            }
            for (let i = 0; i <= Math.ceil(this.axisData.range[1][1] / ytickBreaks); i++) {
                yTicks.push(i * ytickBreaks);
            }
            for (let i = 0; i < yTicks.length; i++) {
                let tickPos = yTicks[i];
                let tick = LinesBuilder.CreateLines("yTicks", {
                    points: [
                        new Vector3(xmin, tickPos, zmin + 0.05 * zmax),
                        new Vector3(xmin, tickPos, zmin),
                        new Vector3(xmin + 0.05 * xmax, tickPos, zmin)
                    ]
                }, this._scene);
                tick.color = Color3.FromHexString(this.axisData.color[1]);
                this._ticks.push(tick);
                let tickLabel = this._roundTicks(tickPos / this.axisData.scale[1]);
                let tickChar = this._makeTextPlane(tickLabel.toString(), 0.6, this.axisData.color[1]);
                tickChar.position = new Vector3(xmin, tickPos, zmin - 0.05 * ymax);
                this._tickLabels.push(tickChar);
                // tick lines
                if (this.axisData.showTickLines[1][0]) {
                    let tickLine = LinesBuilder.CreateLines("yTicksLines", {
                        points: [
                            new Vector3(xmax, tickPos, zmin),
                            new Vector3(xmin, tickPos, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = Color3.FromHexString(this.axisData.tickLineColor[1][0]);
                    this._tickLines.push(tickLine);
                }
                if (this.axisData.showTickLines[1][1]) {
                    let tickLine = LinesBuilder.CreateLines("yTickLines", {
                        points: [
                            new Vector3(xmin, tickPos, zmax),
                            new Vector3(xmin, tickPos, zmin)
                        ]
                    }, this._scene);
                    tickLine.color = Color3.FromHexString(this.axisData.tickLineColor[1][1]);
                    this._tickLines.push(tickLine);
                }
            }
        }
        // create Z axis
        if (this.axisData.showAxes[2]) {
            // axis
            let axisZ = LinesBuilder.CreateLines("axisZ", {
                points: [
                    new Vector3(xmin, ymin, zmin),
                    new Vector3(xmin, ymin, zmax)
                ]
            }, this._scene);
            axisZ.color = Color3.FromHexString(this.axisData.color[2]);
            this._axes.push(axisZ);
            // label
            let zChar = this._makeTextPlane(this.axisData.axisLabels[2], 1, this.axisData.color[2]);
            zChar.position = new Vector3(xmin, ymin - 0.5 * ymax, zmax / 2);
            this._axisLabels.push(zChar);
            // z ticks and tick lines
            let zTicks = [];
            for (let i = 0; i < -Math.ceil(this.axisData.range[2][0] / ztickBreaks); i++) {
                zTicks.push(-(i + 1) * ztickBreaks);
            }
            for (let i = 0; i <= Math.ceil(this.axisData.range[2][1] / ztickBreaks); i++) {
                zTicks.push(i * ztickBreaks);
            }
            let startTick = 0;
            if (heatmap) {
                startTick = 1;
            }
            for (let i = startTick; i < zTicks.length; i++) {
                let tickPos = zTicks[i];
                if (heatmap) {
                    tickPos = tickPos - 0.5 * this.axisData.scale[2];
                }
                let tick = LinesBuilder.CreateLines("zTicks", {
                    points: [
                        new Vector3(xmin + 0.05 * xmax, ymin, tickPos),
                        new Vector3(xmin, ymin, tickPos),
                        new Vector3(xmin, ymin + 0.05 * ymax, tickPos)
                    ]
                }, this._scene);
                tick.color = Color3.FromHexString(this.axisData.color[2]);
                this._ticks.push(tick);
                let tickLabel = this._roundTicks(tickPos / this.axisData.scale[2]).toString();
                if (heatmap) {
                    tickLabel = this.axisData.rownames[i - 1];
                }
                if (tickLabel === undefined) {
                    continue;
                }
                let tickChar = this._makeTextPlane(tickLabel, 0.6, this.axisData.color[2]);
                tickChar.position = new Vector3(xmin, ymin - 0.1 * ymax, tickPos);
                this._tickLabels.push(tickChar);
                // tick lines
                if (this.axisData.showTickLines[2][0]) {
                    let tickLine = LinesBuilder.CreateLines("zTickLines", {
                        points: [
                            new Vector3(xmax, ymin, tickPos),
                            new Vector3(xmin, ymin, tickPos)
                        ]
                    }, this._scene);
                    tickLine.color = Color3.FromHexString(this.axisData.tickLineColor[2][0]);
                    this._tickLines.push(tickLine);
                }
                if (this.axisData.showTickLines[2][1]) {
                    let tickLine = LinesBuilder.CreateLines("zTickLines", {
                        points: [
                            new Vector3(xmin, ymax, tickPos),
                            new Vector3(xmin, ymin, tickPos)
                        ]
                    }, this._scene);
                    tickLine.color = Color3.FromHexString(this.axisData.tickLineColor[2][1]);
                    this._tickLines.push(tickLine);
                }
            }
        }
    }
    private _makeTextPlane(text: string, size: number, color: string): Mesh {
        var dynamicTexture = new DynamicTexture("DynamicTexture", 75, this._scene, true);
        dynamicTexture.hasAlpha = true;
        dynamicTexture.drawText(text, 5, 40, (40 - text.length * 4) + "px Arial", color, "transparent", true);
        var plane = Mesh.CreatePlane("TextPlane", size, this._scene, true);
        var material = new StandardMaterial("TextPlaneMaterial", this._scene);
        material.backFaceCulling = false;
        material.specularColor = new Color3(0, 0, 0);
        material.diffuseTexture = dynamicTexture;
        plane.material = material;
        return plane;
    }
    update(camera: ArcRotateCamera, updateAxisData?: boolean): void {
        if (updateAxisData) {
            for (let i = 0; i < this._axes.length; i++) {
                this._axes[i].dispose();
            }
            for (let i = 0; i < this._axisLabels.length; i++) {
                this._axisLabels[i].dispose();
            }
            for (let i = 0; i < this._ticks.length; i++) {
                this._ticks[i].dispose();
            }
            for (let i = 0; i < this._tickLabels.length; i++) {
                this._tickLabels[i].dispose();
            }
            for (let i = 0; i < this._tickLines.length; i++) {
                this._tickLines[i].dispose();
            }
            this._createAxes();
        }
        if (this.axisData.showAxes) {
            let axis1 = Vector3.Cross(camera.position, Axis.Y);
            let axis2 = Vector3.Cross(axis1, camera.position);
            let axis3 = Vector3.Cross(axis1, axis2);
            for (let i = 0; i < this._axisLabels.length; i++) {
                this._axisLabels[i].rotation = Vector3.RotationFromAxis(axis1, axis2, axis3);
            }
            for (let i = 0; i < this._tickLabels.length; i++) {
                this._tickLabels[i].rotation = Vector3.RotationFromAxis(axis1, axis2, axis3);
            }
        }
    }
}
