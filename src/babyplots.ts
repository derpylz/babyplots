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

import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Vector3, Color4, Color3 } from "@babylonjs/core/Maths/math";
import { CreateBox } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Rectangle, TextBlock, Grid, Control, Image } from "@babylonjs/gui/2D/controls";
import { ScreenshotTools } from "@babylonjs/core/Misc/screenshotTools";
import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { PointerEventTypes, PointerInfo } from "@babylonjs/core/Events/pointerEvents";
import chroma from "chroma-js";
import download from "downloadjs";
import { v4 as uuidv4 } from "uuid";
import { deprecationWarning } from "./utils/logging";

const axios = require('axios').default;

import { AnnotationManager } from "./utils/Label";

import { LegendData, ShapeLegendData } from "./utils/LegendData";

import { AxisData, Axes } from "./utils/Axes";

export class CustomLoadingScreen implements ILoadingScreen {
    //optional, but needed due to interface definitions
    public loadingUIBackgroundColor: string
    constructor(public loadingUIText: string) { }
    public displayLoadingUI() {
    }

    public hideLoadingUI() {
    }
}

interface CustomCCaptureSettings extends CCapture.Settings {
  onProgress: (pct: any) => void;
}

export function getArrayMin(arr: Array<number | string>): number {
    if (arr.length > 65536) {
        let r = this[0];
        arr.forEach(function (v: number, _i: any, _a: any) { if (v < r) r = v; });
        return r;
    } else {
        return Math.min.apply(null, arr);
    }

}

export function getArrayMax(arr: Array<number | string>): number {
    if (arr.length > 65536) {
        let r = this[0];
        arr.forEach(function (v: number, _i: any, _a: any) { if (v > r) r = v; });
        return r;
    } else {
        return Math.max.apply(null, arr);
    }
}

export function matrixMax(matrix: number[][]): number {
    let maxRow = matrix.map(function (row) { return getArrayMax(row); });
    let max = getArrayMax(maxRow);
    return max
}

export function matrixMin(matrix: number[][]): number {
    let minRow = matrix.map(function (row) { return getArrayMin(row); });
    let min = getArrayMin(minRow);
    return min
}

export function getUniqueVals(source: string[]): string[] {
    let length = source.length;
    let result: string[] = [];
    let seen = new Set();

    outer:
    for (let index = 0; index < length; index++) {
        let value = source[index];
        if (seen.has(value)) continue outer;
        seen.add(value);
        result.push(value);
    }

    return result;
}

import { Plot, CoordinatePlot } from "./utils/Plot";
import { ImgStack } from "./plotTypes/ImgStack";
import { ShapeCloud } from "./plotTypes/ShapeCloud";
import { PointCloud } from "./plotTypes/PointCloud";
import { Surface } from "./plotTypes/Surface";
import { HeatMap } from "./plotTypes/HeatMap";
import { MeshStream } from "./plotTypes/MeshStream";
import { MeshObject } from "./plotTypes/MeshObject";
import { Line } from "./plotTypes/Line";
import { BoundingBox } from "@babylonjs/core/Culling/boundingBox";
import { styleText } from "./utils/styleText";
import { buttonSVGs, legendSVGs } from "./utils/SVGs";
import { ILoadingScreen } from "@babylonjs/core/Loading/loadingScreen";

export const PLOTTYPES = {
    'pointCloud': ['coordinates', 'colorBy', 'colorVar'],
    'shapeCloud': ['coordinates', 'colorBy', 'colorVar'],
    'surface': ['coordinates', 'colorBy', 'colorVar'],
    'heatMap': ['coordinates', 'colorBy', 'colorVar'],
    'imageStack': ['values', 'indices', 'attributes'],
    'meshObject': ['meshString'],
    'Line': ['coordinates', 'colorBy', 'colorVar']
}

/**
 * Takes a reasonable guess if a plot can be created from the provided object
 * @param plotData Object containing data to be checked for valid plot information
 */
export function isValidPlot(plotData: {}): boolean {
    for (let plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
        const plot = plotData["plots"][plotIdx];
        let pltType = plot["plotType"]
        if (PLOTTYPES.hasOwnProperty(pltType)) {
            for (let i = 0; i < PLOTTYPES[pltType].length; i++) {
                const prop = PLOTTYPES[pltType][i];
                if (plot[prop] === undefined) {
                    console.log('Plot ' + plotIdx + ' is missing property:' + prop);
                    return false;
                }
            }
        } else {
            console.log('Unrecognized plot type')
            return false;
        }
    }
    return true;
}

export class Plots {
    private _engine: Engine;
    private _hl1: HemisphericLight;
    private _hl2: HemisphericLight;
    protected _legend: AdvancedDynamicTexture;
    protected _showLegend: boolean = true;
    private _hasAnim: boolean = false;
    private _loopingAnim: boolean = false;
    private _buttonBar: HTMLDivElement;
    private _turntableBtn: HTMLDivElement;
    private _loopBtn: HTMLElement;
    private _streamControlBtn: HTMLDivElement;
    private _animationSlider: HTMLInputElement;
    private _axes: Axes[] = [];
    private _downloadObj: {} = {};
    private _annotationManager: AnnotationManager;
    private _backgroundColor: string;
    private _recording: boolean = false;
    private _recordingQuality: number = 50;
    private _recordingFrameRate: number = 30;
    private _recordingFileName: string = "babyplots.gif";
    private _origRotationRate: number;
    private _turned: number = 0;
    private _capturer: CCapture;
    private _wasTurning: boolean = false;
    private _xScale: number = 1;
    private _yScale: number = 1;
    private _zScale: number = 1;
    private _publishFormOverlay: HTMLDivElement;
    private _recordingFormOverlay: HTMLDivElement;
    private _uniqID: string;
    private _shapeLegendPosition: string;
    private _fsUIDirty: boolean = true;
    private _upAxis: string = "+y";
    private _xRange: number[] = [0, 0];
    private _yRange: number[] = [0, 0];
    private _zRange: number[] = [0, 0];
    private _highlightSphere: Mesh;

    /** HTML canvas element for this babyplots visualization. */
    canvas: HTMLCanvasElement;
    /** Babylonjs scene object. */
    scene: Scene;
    /** Camera of the visualization */
    camera: ArcRotateCamera;
    /** Array of plots in this visualization. */
    plots: Plot[] = [];
    /** Turn the camera around the plots. */
    turntable: boolean;
    /** Rotation speed of the turntable camera. */
    rotationRate: number;
    /** Highest point on the y axis of any plot. Used for positioning the camera and labels. */
    ymax: number = 0;
    /** This variable should be exclusively set by the babyplots R package. It controls some specific options for babyplots behavior in the RStudio viewer. */
    R: boolean = false;
    /** This variable should be exclusively set by the babyplots Python package. It controls some specific options for babyplots behavior in the Jupyter notebook. */
    Python: boolean = false;
    /** Title of the legend showing the names and plot types of multiple plots, if at least one plot has showShape enabled. */
    shapeLegendTitle: string = "";
    /** AdvancedDynamicTexture for the full screen UI */
    uiLayer: AdvancedDynamicTexture;
    /** Play or pause state of all animations */
    animPaused: boolean = false;
    /** Path to the directory containing the CCapture worker script */
    workerPath: string;


    /**
     * Initialize the 3d visualization
     * 
     * @param canvasElement ID of the canvas element in the DOM
     * @param options Object with general options. See a list of possible options [here](https://bp.bleb.li/documentation/js#plotsObject).
     */
    constructor(canvasElement: string, options = {}) {
        // create unique id, needed if multiple babyplots canvases are on the same page.
        this._uniqID = uuidv4();

        // apply options
        // default settings
        let opts = {
            backgroundColor: "#ffffffff",
            xScale: 1,
            yScale: 1,
            zScale: 1,
            turntable: false,
            rotationRate: 0.005,
            shapeLegendTitle: "",
            upAxis: "+y",
            workerPath: "./",
        }
        Object.assign(opts, options);

        this.turntable = opts.turntable;
        this.rotationRate = opts.rotationRate;
        this.shapeLegendTitle = opts.shapeLegendTitle;
        this.workerPath = opts.workerPath;

        // setup enginge and scene
        this._backgroundColor = opts.backgroundColor;
        this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new Scene(this._engine);

        // camera
        this.camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.inputs.attached.keyboard.detachControl();
        this.camera.wheelPrecision = 50;
        this._upAxis = opts.upAxis;
        this._updateCameraUpVector();

        // background color
        this.scene.clearColor = Color4.FromHexString(opts.backgroundColor);

        // Loading screen
        var loadingScreen = new CustomLoadingScreen("Loading");
        this._engine.loadingScreen = loadingScreen;

        // Axis scales
        this._xScale = opts.xScale;
        this._yScale = opts.yScale;
        this._zScale = opts.zScale;

        // two lights to illuminate the plot uniformly (top and bottom)
        this._hl1 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this.scene);
        this._hl1.diffuse = new Color3(1, 1, 1);
        this._hl1.specular = new Color3(0.01, 0.01, 0.01);
        // bottom light slightly weaker for better depth perception and orientation
        this._hl2 = new HemisphericLight("HemiLight", new Vector3(0, -1, 0), this.scene);
        this._hl2.diffuse = new Color3(0.8, 0.8, 0.8);
        this._hl2.specular = new Color3(0.01, 0.01, 0.01);

        // create fullscreen GUI texture
        this.uiLayer = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);

        this._annotationManager = new AnnotationManager(this.canvas, this.scene, this.ymax, this.camera, this._backgroundColor, this.uiLayer, this._uniqID);

        this.scene.registerBeforeRender(this._prepRender.bind(this));

        this.scene.registerAfterRender(this._afterRender.bind(this));

        // create container for buttons
        // create css style
        let styleElem = document.createElement("style");
        styleElem.appendChild(document.createTextNode(styleText));
        document.getElementsByTagName('head')[0].appendChild(styleElem);

        // create ui elements
        let buttonBar = document.createElement("div");
        buttonBar.id = "buttonBar_" + this._uniqID;
        buttonBar.className = "bbp button-bar"
        buttonBar.style.top = this.canvas.clientTop + 5 + "px";
        buttonBar.style.left = this.canvas.clientLeft + 5 + "px";
        this.canvas.parentNode.appendChild(buttonBar);
        this._buttonBar = buttonBar;

        // animation and streaming buttons
        let streamCtrlBtn = document.createElement("div");
        streamCtrlBtn.className = "button streamctrl loading hidden";
        streamCtrlBtn.onclick = () => (this._streamControlBtn.className === "button streamctrl pause") ? this.pauseAnimation() : this.playAnimation();
        let streamCtrlLoading = document.createElement("div");
        streamCtrlLoading.className = "btn-label loading";
        streamCtrlLoading.innerHTML = buttonSVGs.loading;
        streamCtrlBtn.appendChild(streamCtrlLoading);
        let streamCtrlPlay = document.createElement("div");
        streamCtrlPlay.className = "btn-label play";
        streamCtrlPlay.innerHTML = buttonSVGs.play;
        streamCtrlBtn.appendChild(streamCtrlPlay);
        let streamCtrlPause = document.createElement("div");
        streamCtrlPause.className = "btn-label pause";
        streamCtrlPause.innerHTML = buttonSVGs.pause;
        streamCtrlBtn.appendChild(streamCtrlPause);
        this._buttonBar.appendChild(streamCtrlBtn);
        let animRange = document.createElement("input");
        animRange.type = "range";
        animRange.min = "0";
        animRange.max = "0";
        animRange.value = "0";
        animRange.step = "1";
        animRange.className = "anim-slider hidden";
        animRange.disabled = true;
        animRange.onchange = () => this.setAnimationFrame();
        this._animationSlider = animRange;
        this._buttonBar.appendChild(animRange);

        // setup point selection sphere
        this._highlightSphere = CreateSphere(
            "highlightSphere",
            { diameter: 0.0001 * (this.canvas.height + this.canvas.width) }
        );
        this._highlightSphere.isVisible = false;
        var material = new StandardMaterial("highlightSphereMat", this.scene);
        material.alpha = 1;
        material.diffuseColor = new Color3(1, 0, 0);
        this._highlightSphere.material = material;

        this._streamControlBtn = streamCtrlBtn;

        // prepare download object
        this._downloadObj = {
            plots: []
        };

        this.scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
            switch (pointerInfo.type) {
                case PointerEventTypes.POINTERPICK:
                    let pickInfo = pointerInfo.pickInfo;
                    for (let i = 0; i < this.plots.length; i++) {
                        let plot = this.plots[i];
                        if (!plot.pickable) {
                            continue;
                        }

                        if (pointerInfo.event.button == 0) { // Left mouse button
                            if (pickInfo.pickedMesh === plot.mesh) {
                                this._highlightSphere.isVisible = true;
                                let pick = (plot as CoordinatePlot).getPick(pickInfo);
                                this._highlightSphere.position = new Vector3(
                                    pickInfo.pickedPoint.x,
                                    pickInfo.pickedPoint.y,
                                    pickInfo.pickedPoint.z
                                );
                            }
                        }

                        if (pickInfo.pickedMesh === plot.mesh && (plot as CoordinatePlot).dpInfo) {
                            let pick = (plot as CoordinatePlot).getPick(pickInfo);
                            (this as Plots)._annotationManager.displayInfo(pick.info, pick.target);
                        }
                    }
                case PointerEventTypes.POINTERDOWN:
                    if (pointerInfo.event.button == 2) { // Right mouse button
                        this._highlightSphere.isVisible = false;
                    }
            }
        });
    }

    /**
     * Apply camera up-vector to camera.
     */
    private _updateCameraUpVector() {
        switch (this._upAxis) {
            case "+x":
                this.camera.upVector = new Vector3(1, 0, 0);
                break;
            case "-x":
                this.camera.upVector = new Vector3(-1, 0, 0);
                break;
            case "+z":
                this.camera.upVector = new Vector3(0, 0, 1);
                break;
            case "-z":
                this.camera.upVector = new Vector3(0, 0, -1);
                break;
            case "-y":
                this.camera.upVector = new Vector3(0, -1, 0);
                break;
            case "+y":
            default:
                this.camera.upVector = new Vector3(0, 1, 0);
                break;
        }
    }

    /**
     * Load a visualization from a saved JSON object. The R, JavaScript and Python implementations of babyplots as well as the NPC allow the export of visualizations as JSON files. Loading of a saved visualization using fromJSON() overwrites previously set properties of the Plots object.
     * 
     * @param plotData Javascript Object with plot data.
     */
    fromJSON(plotData: {}): void {
        if (plotData["turntable"] !== undefined) {
            this.turntable = plotData["turntable"];
        }
        if (plotData["rotationRate"] !== undefined) {
            this.rotationRate = plotData["rotationRate"];
        }
        if (plotData["backgroundColor"]) {
            this._backgroundColor = plotData["backgroundColor"];
            this.scene.clearColor = Color4.FromHexString(this._backgroundColor);
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
        for (let plotIdx = 0; plotIdx < plotData["plots"].length; plotIdx++) {
            const plot = plotData["plots"][plotIdx];
            if (plot["plotType"] === "imageStack") {
                this.addImgStack(
                    plot["values"],
                    plot["indices"],
                    plot["attributes"],
                    {
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
                    }
                )
            } else if (plot["plotType"] === "meshObject") {
                this.addMeshObject(
                    plot["meshString"],
                    {
                        meshScaling: plot["meshScaling"],
                        meshRotation: plot["meshRotation"],
                        meshOffset: plot["meshOffset"]
                    }
                )
            } else if (plot["plotType"] === "meshStream") {
                this.addMeshStream(
                    plot["rootUrl"],
                    plot["filePrefix"],
                    plot["fileSuffix"],
                    plot["fileIteratorStart"],
                    plot["fileIteratorEnd"],
                    plot["frameDelay"],
                    {
                        meshRotation: plot["meshRotation"],
                        meshOffset: plot["meshOffset"]
                    }
                )
            } else if (["pointCloud", "heatMap", "surface", "shapeCloud", "line"].indexOf(plot["plotType"]) !== -1) {
                this.addPlot(
                    plot["coordinates"],
                    plot["plotType"],
                    plot["colorBy"],
                    plot["colorVar"],
                    {
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
                        addClusterLabels: plot["addClusterLabels"],
                        labels: plot["labels"],
                        labelSize: plot["labelSize"],
                        labelColor: plot["labelColor"]
                    }
                )
            }
        }
        if (plotData["labels"]) {
            this._annotationManager.fixedLabels = true;
            let labelData = plotData["labels"];
            if (labelData.length > 0) {
                if (Array.isArray(labelData[0])) {
                    this._annotationManager.addLabels(labelData);
                } else {
                    // legacy label saving
                    for (let i = 0; i < labelData.length; i++) {
                        const label = labelData[i];
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
    }

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
     * 
     * "turntable": creates a button to enable or disable the turntable mode.
     */
    createButtons(whichBtns = ["json", "label", "publish", "record", "turntable"]): Plots {
        // Turntable button
        if (whichBtns.indexOf("turntable") !== -1) {
            let turntableBtn = document.createElement("div");
            turntableBtn.className = "button";
            turntableBtn.onclick = () => this.toggleTurntable();
            turntableBtn.innerHTML = buttonSVGs.turntable;
            turntableBtn.title = "Toggle turntable animation."
            this._buttonBar.appendChild(turntableBtn);
            this._turntableBtn = turntableBtn;
            if (this.turntable) {
                turntableBtn.className = "button active";
            }
        }
        // JSON download button
        if (whichBtns.indexOf("json") !== -1) {
            let jsonBtn = document.createElement("div");
            jsonBtn.className = "button";
            jsonBtn.onclick = this._downloadJson.bind(this);
            jsonBtn.innerHTML = buttonSVGs.toJson;
            jsonBtn.title = "Download the plot as json file.";
            this._buttonBar.appendChild(jsonBtn);
        }
        // Label editor button
        if (whichBtns.indexOf("label") !== -1) {
            let labelBtn = document.createElement("div");
            labelBtn.className = "button";
            labelBtn.onclick = this._annotationManager.toggleLabelControl.bind(this._annotationManager);
            labelBtn.innerHTML = buttonSVGs.labels;
            labelBtn.title = "Show or hide the label manager.";
            this._buttonBar.appendChild(labelBtn);
        }
        // Record plot animation as gif button
        if (whichBtns.indexOf("record") !== -1) {
            let recordBtn = document.createElement("div");
            recordBtn.className = "button";
            recordBtn.onclick = () => this._createRecordingForm();
            recordBtn.innerHTML = buttonSVGs.record;
            recordBtn.title = "Record the plot as a gif.";
            this._buttonBar.appendChild(recordBtn);
        }
        // Publish to bp.bleb.li button
        if (whichBtns.indexOf("publish") !== -1) {
            let publishBtn = document.createElement("div");
            publishBtn.className = "button";
            publishBtn.onclick = this._createPublishForm.bind(this);
            publishBtn.innerHTML = buttonSVGs.publish;
            publishBtn.title = "Publish the plot to bp.bleb.li.";
            this._buttonBar.appendChild(publishBtn);
        }
        return this;
    }

    /**
     * Prepare the download object for the Plots instance.
     * This is used to save the plot data in .json file format.
     * The individual plots are added to this object by their respective addPlot function calls.
     */
    private _prepDownloadObj() {
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
    }

    /**
     * Download the plot data in .json file format.
     */
    private _downloadJson() {
        let dlElement = document.createElement("a");
        this._prepDownloadObj();
        let dlContent = encodeURIComponent(JSON.stringify(this._downloadObj));
        dlElement.setAttribute("href", "data:text/plain;charset=utf-8," + dlContent);
        dlElement.setAttribute("download", "babyplots_export.json");
        dlElement.style.display = "none";
        document.body.appendChild(dlElement);
        dlElement.click();
        document.body.removeChild(dlElement);
    }

    /**
     * Create the html form for publishing the plot to bp.bleb.li.
     */
    private _createPublishForm() {
        // do nothing if the form already exists
        if (this._publishFormOverlay !== undefined) {
            return
        }

        let formOverlay = document.createElement("div");

        formOverlay.id = "publishOverlay_" + this._uniqID;
        formOverlay.style.position = "absolute";
        let r = this.canvas.getBoundingClientRect();
        if (this.Python) {
            formOverlay.style.top = "0px";
            formOverlay.style.left = "0px";
            formOverlay.style.width = "100%";
            formOverlay.style.height = "100%";
        } else {
            formOverlay.style.top = r.y + "px";
            formOverlay.style.left = r.x + "px";
            formOverlay.style.width = r.width + "px";
            formOverlay.style.height = r.height + "px";
        }
        formOverlay.style.backgroundColor = "#ffffff66";
        let formBox = document.createElement("div");
        formBox.style.width = "275px";
        formBox.style.margin = "42px auto";
        formBox.style.backgroundColor = "white";
        formBox.style.padding = "15px 30px";
        formBox.style.borderRadius = "10px";
        formBox.style.boxShadow = "0 0 10px #0003";
        formBox.className = "bbp publish-form"
        formOverlay.appendChild(formBox);
        // Upload description text
        let formInfo = document.createElement("p");
        formInfo.innerText = "Upload the plot to your account on https://bp.bleb.li. Only you will be able to see it. You can change the access settings in your account.";
        formInfo.className = "form-info";
        formBox.appendChild(formInfo);
        // Inputs and their labels
        let usernameLabel = document.createElement("label");
        usernameLabel.id = "publishUsernameLabel_" + this._uniqID;
        usernameLabel.innerText = "Username:";
        let usernameInput = document.createElement("input");
        usernameInput.type = "text";
        usernameInput.id = "publishUsername_" + this._uniqID;
        let passwordLabel = document.createElement("label");
        passwordLabel.id = "publishPasswordLabel_" + this._uniqID;
        passwordLabel.innerText = "Password:"
        let passwordInput = document.createElement("input");
        passwordInput.type = "password";
        passwordInput.id = "publishPassword_" + this._uniqID;
        let titleLabel = document.createElement("label");
        titleLabel.id = "publishTitleLabel_" + this._uniqID;
        titleLabel.innerText = "Plot title:";
        let titleInput = document.createElement("input");
        titleInput.type = "text";
        titleInput.id = "publishTitle_" + this._uniqID;
        // message placeholder
        let msg = document.createElement("p");
        msg.id = "publishMessage_" + this._uniqID;
        // Buttons
        let publishBtn = document.createElement("button");
        publishBtn.className = "publish-btn";
        publishBtn.id = "publishBtn_" + this._uniqID;
        publishBtn.onclick = this._tryPublish.bind(this);
        publishBtn.innerText = "Login and publish";
        let cancelBtn = document.createElement("button");
        cancelBtn.className = "cancel-btn";
        cancelBtn.id = "cancelBtn_" + this._uniqID;
        cancelBtn.onclick = this._cancelPublish.bind(this);
        cancelBtn.innerText = "Cancel";
        let closeBtn = document.createElement("button");
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
    }

    /**
     * On resize of the browser window, resize the publish form.
     */
    private _resizePublishOverlay() {
        // do nothing if the form does not exist
        if (this._publishFormOverlay === undefined) {
            return
        }
        let r = this.canvas.getBoundingClientRect();
        this._publishFormOverlay.style.left = r.x + "px";
        this._publishFormOverlay.style.top = r.y + "px";
        this._publishFormOverlay.style.width = r.width + "px";
        this._publishFormOverlay.style.height = r.height + "px";
    }

    /**
     * Try to publish the plot to bp.bleb.li.
     */
    private _tryPublish() {
        // Get a thumbnail of the plot
        this.thumbnail(80, (function (thumb_data) {
            this._prepDownloadObj();
            axios({
                method: 'post',
                url: 'https://bp.bleb.li/api/publish',
                headers: {
                    'Content-Type': "application/json;charset=UTF-8"
                },
                data: {
                    username: (document.getElementById("publishUsername_" + this._uniqID) as HTMLInputElement).value,
                    password: (document.getElementById("publishPassword_" + this._uniqID) as HTMLInputElement).value,
                    plotData: JSON.stringify(this._downloadObj),
                    plotName: (document.getElementById("publishTitle_" + this._uniqID) as HTMLInputElement).value,
                    thumb: thumb_data
                },

            }).then((function (_response) {
                let msg = document.getElementById("publishMessage_" + this._uniqID);
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
                        let msg = document.getElementById("publishMessage_" + this._uniqID);
                        msg.innerText = "Invalid username or password.";
                        msg.className = "message warning";
                    }
                    console.log(response);
                }).bind(this))
        }).bind(this));
    }

    /**
     * Cancel the publishing and remove the form.
     */
    private _cancelPublish() {
        this._publishFormOverlay.remove();
        this._publishFormOverlay = undefined;
    }

    /**
     * Reset the animation to the initial state.
     */
    private _resetAnimation() {
        this._hasAnim = true;
        for (let idx = 0; idx < this.plots.length; idx++) {
            this.plots[idx].resetAnimation();
        }
        let boundingBox = this.plots[0].mesh.getBoundingInfo().boundingBox;
        let rangeX = [
            boundingBox.minimumWorld.x,
            boundingBox.maximumWorld.x
        ]
        let rangeY = [
            boundingBox.minimumWorld.y,
            boundingBox.maximumWorld.y
        ]
        let rangeZ = [
            boundingBox.minimumWorld.z,
            boundingBox.maximumWorld.z
        ]
        this._axes[0].axisData.range = [rangeX, rangeY, rangeZ]
        this._axes[0].update(this.camera, true);
    }

    /**
     * Pause the animation at the current frame.
     */
    pauseAnimation(): Plots {
        this.animPaused = true;
        this._streamControlBtn.className = "button streamctrl play";
        return this;
    }

    /**
     * Resume the animation from the current frame.
     */
    playAnimation(): Plots {
        this.animPaused = false;
        this._streamControlBtn.className = "button streamctrl pause";
        return this;
    }

    /**
     * Toggle the turntable mode (rotation of the camera around the plot).
     */
    toggleTurntable(): Plots {
        this.turntable = !this.turntable;
        if (this.turntable) {
            this._turntableBtn.className = "button active";
        } else {
            this._turntableBtn.className = "button";
        }
        return this;
    }

    /**
     * Set the current frame of the animation to the value of the slider.
     */
    setAnimationFrame(): Plots {
        for (let idx = 0; idx < this.plots.length; idx++) {
            const animPlot = this.plots[idx];
            if (animPlot.allLoaded) {
                animPlot.goToFrame(parseInt(this._animationSlider.value));
            }
        }
        return this;
    }

    /**
     * Toggle the looping mode of the animation.
     */
    private _toggleLoopAnimation() {
        if (this._loopingAnim) {
            this._loopingAnim = false;
            for (let idx = 0; idx < this.plots.length; idx++) {
                this.plots[idx].setLooping(false);
            }
            this._loopBtn.className = "button";
        } else {
            this._loopingAnim = true;
            for (let idx = 0; idx < this.plots.length; idx++) {
                this.plots[idx].setLooping(true);
            }
            this._loopBtn.className = "button active";
        }
        if (!this._hasAnim) {
            this._resetAnimation();
        }

    }

    
    private _createRecordingForm() {
        // do not create a new form if one already exists
        if (this._recordingFormOverlay !== undefined) {
            return;
        }

        let formOverlay = document.createElement("div");
        formOverlay.id = "recordingFormOverlay_" + this._uniqID;
        formOverlay.style.position = "absolute";
        let r = this.canvas.getBoundingClientRect();
        if (this.Python) {
            // correctly position the form if the canvas is embedded in a Jupyter notebook
            formOverlay.style.top = "0px";
            formOverlay.style.left = "0px";
            formOverlay.style.width = "100%";
            formOverlay.style.height = "100%";
        } else {
            formOverlay.style.top = r.y + "px";
            formOverlay.style.left = r.x + "px";
            formOverlay.style.width = r.width + "px";
            formOverlay.style.height = r.height + "px";
        }
        formOverlay.style.backgroundColor = "#ffffff66";
        let formBox = document.createElement("div");
        formBox.style.width = "275px";
        formBox.style.margin = "42px auto";
        formBox.style.backgroundColor = "white";
        formBox.style.padding = "15px 30px";
        formBox.style.borderRadius = "10px";
        formBox.style.boxShadow = "0 0 10px #0003";
        formBox.className = "bbp record-form"
        formOverlay.appendChild(formBox);
        let formInfo = document.createElement("p");
        formInfo.innerText = "Create and download a GIF of your plot";
        formInfo.className = "form-info";
        formBox.appendChild(formInfo);
        // options for naming the file and setting the quality of the GIF
        let nameLabel = document.createElement("label");
        nameLabel.id = "recordNameLabel_" + this._uniqID;
        nameLabel.innerText = "File name:";
        let nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.id = "recordNameInput_" + this._uniqID;
        nameInput.value = "babyplots.gif";
        let qualityLabel = document.createElement("label");
        qualityLabel.id = "recordQualityLabel_" + this._uniqID;
        qualityLabel.innerText = "Quality:";
        // description of the quality option
        let qualityInfo = document.createElement("small");
        qualityInfo.innerText = "Higher quality GIFs will take longer to generate but reduce the flickering.";
        let qualityInput = document.createElement("input");
        qualityInput.id = "recordQualityInput_" + this._uniqID;
        qualityInput.type = "range";
        qualityInput.min = "1";
        qualityInput.max = "100";
        qualityInput.value = "50";
        // buttons to start the recording or dismiss the form
        let startBtn = document.createElement("button");
        startBtn.id = "recordStartBtn_" + this._uniqID;
        startBtn.innerText = "Start recording";
        startBtn.className = "publish-btn";
        startBtn.onclick = () => {
            // set options for the recording
            this._recordingFileName = nameInput.value;
            this._recordingQuality = parseInt(qualityInput.value);
            this._startRecording();
            this._recordingFormOverlay.remove();
            this._recordingFormOverlay = undefined;
        }
        let cancelBtn = document.createElement("button");
        cancelBtn.id = "recordCancelBtn_" + this._uniqID;
        cancelBtn.innerText = "Cancel";
        cancelBtn.className = "close-btn";
        cancelBtn.onclick = () => {
            this._recordingFormOverlay.remove();
            this._recordingFormOverlay = undefined;
        }

        // add all the elements to the form
        formBox.appendChild(nameLabel);
        formBox.appendChild(nameInput);
        formBox.appendChild(qualityLabel);
        formBox.appendChild(qualityInput);
        formBox.appendChild(qualityInfo);
        formBox.appendChild(startBtn);
        formBox.appendChild(cancelBtn);
        this._recordingFormOverlay = formOverlay;
        this.canvas.parentNode.appendChild(formOverlay);
    }

    /**
     * Start the gif recording.
     */
    private _startRecording() {
        this._recording = true;
    }

    /**
     * Register before render:
     * - rotate the camera around the plot if turntable mode is enabled
     * - update the animation slider if the animation is playing
     * - recalculate the bounding box of the plot if the animation is playing
     * - update the fullscreen UI
     * - update the annotation labels
     */
    private _prepRender(): void {
        // rotate camera around plot if turntable is true
        if (this.turntable) {
            this.camera.alpha += this.rotationRate;
        }
        // update plots with animations
        if (this._hasAnim && !this.animPaused) {
            let anyAnim = false;
            for (let idx = 0; idx < this.plots.length; idx++) {
                const animPlot = this.plots[idx];
                let animState = animPlot.update();
                if (animState) {
                    anyAnim = true;
                    if (animPlot.allLoaded && this._streamControlBtn.className === "button streamctrl loading") {
                        this._streamControlBtn.className = "button streamctrl pause";
                        this._animationSlider.disabled = false;
                    }
                    if (animPlot.hasOwnProperty("frameIndex")) {
                        this._animationSlider.value = (animPlot as MeshStream).frameIndex.toString();
                    }
                }
            }
            this._hasAnim = anyAnim;
            if (!this._hasAnim) {
                let boundingBox = this.plots[0].mesh.getBoundingInfo().boundingBox;
                let rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ]
                let rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ]
                let rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ]
                this._axes[0].axisData.range = [rangeX, rangeY, rangeZ]
                this._axes[0].update(this.camera, true);
            }
        }
        // update axis drawing
        if (this._axes) {
            for (let i = 0; i < this._axes.length; i++) {
                this._axes[i].update(this.camera);
            }
        }

        if (this._fsUIDirty) {
            // create fullscreen GUI texture
            this.uiLayer = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene);
            this._updateLegend(this.uiLayer);
            this._annotationManager.redrawInfo();
            this._fsUIDirty = false;
        }

        // update labels
        this._annotationManager.update();

    }


    /**
     * Register after render:
     * - update the gif recording if recording is enabled
     */
    private _afterRender(): void {
        if (this._recording) {
            // start recording:
            if (this._turned === 0) {
                let worker = this.workerPath;
                if (this.R) {
                    worker = "lib/babyplots-1/";
                }
                this._capturer = new CCapture({
                    format: "gif",
                    framerate: this._recordingFrameRate,
                    onProgress: (pct) => {
                        let loadingProgress = document.getElementById("GIFloadingProgress_" + this._uniqID);
                        loadingProgress.style.width = (pct * 100).toString() + "%";
                    },
                    verbose: false,
                    display: false,
                    quality: this._recordingQuality,
                    workersPath: worker
                } as CustomCCaptureSettings);
                // create capturer, enable turning
                this._capturer.start();
                this._origRotationRate = this.rotationRate;
                this.rotationRate = 0.02;
                // to return turntable option to its initial state after recording
                if (this.turntable) {
                    this._wasTurning = true;
                } else {
                    this.turntable = true;
                }
                let loadingOverlay = document.createElement("div");
                loadingOverlay.className = "bbp overlay";
                loadingOverlay.id = "GIFloadingOverlay_" + this._uniqID;
                let loadingBox = document.createElement("div");
                loadingBox.className = "bbp loading-box";
                let loadingText = document.createElement("h5");
                loadingText.className = "loading-message";
                loadingText.innerText = "Recording GIF...";
                loadingText.id = "GIFloadingText_" + this._uniqID;
                let loadingProgressContainer = document.createElement("div");
                loadingProgressContainer.className = "loading-progress-container";
                let loadingProgress = document.createElement("div");
                loadingProgress.className = "loading-progress";
                loadingProgress.style.width = "0%";
                loadingProgress.id = "GIFloadingProgress_" + this._uniqID;
                loadingProgressContainer.appendChild(loadingProgress);
                loadingBox.appendChild(loadingText);
                loadingBox.appendChild(loadingProgressContainer);
                loadingOverlay.appendChild(loadingBox);
                this.canvas.parentNode.appendChild(loadingOverlay);
            }
            // recording in progress:
            if (this._turned < 2 * Math.PI) {
                // while recording, count rotation and capture screenshots
                this._turned += this.rotationRate;
                this._capturer.capture(this.canvas);
                let loadingProgress = document.getElementById("GIFloadingProgress_" + this._uniqID);
                loadingProgress.style.width = (this._turned / (2 * Math.PI) * 100).toString() + "%";
            } else {
                // after capturing 360°, stop capturing and save gif
                this._recording = false;
                this._capturer.stop();
                let loadingProgress = document.getElementById("GIFloadingProgress_" + this._uniqID);
                loadingProgress.style.width = "0%";
                let loadingText = document.getElementById("GIFloadingText_" + this._uniqID);
                loadingText.innerText = "Saving GIF...";
                this._capturer.save((blob) => {
                    download(blob, this._recordingFileName, 'image/gif');
                    document.getElementById("GIFloadingOverlay_" + this._uniqID).remove();
                });
                this._turned = 0;
                this.rotationRate = this._origRotationRate;
                this._hl2.diffuse = new Color3(0.8, 0.8, 0.8);
                if (!this._wasTurning) {
                    this.turntable = false;
                }
            }
        }
    }

    /**
     * Zoom camera to fit the complete SPS into the field of view
     * @param xRange The min and max coordinates of the x-axis
     * @param yRange The min and max coordinates of the y-axis
     * @param zRange The min and max coordinates of the z-axis
     */
    private _cameraFitPlot(xRange: number[], yRange: number[], zRange: number[]): void {
        // if this was called from the first plot, just take the ranges given.
        // for subsequent plots, take the union of the ranges
        if (this.plots.length > 1) {
            xRange = [Math.min(xRange[0], this._xRange[0]), Math.max(xRange[1], this._xRange[1])];
            yRange = [Math.min(yRange[0], this._yRange[0]), Math.max(yRange[1], this._yRange[1])];
            zRange = [Math.min(zRange[0], this._zRange[0]), Math.max(zRange[1], this._zRange[1])];
        }
        this._xRange = xRange;
        this._yRange = yRange;
        this._zRange = zRange;
        // create a box that fits all plots
        let xSize = xRange[1] - xRange[0];
        let ySize = yRange[1] - yRange[0];
        let zSize = zRange[1] - zRange[0];
        let box = CreateBox('bdbx', {
            width: xSize, height: ySize, depth: zSize
        }, this.scene);
        // position the box in the center of the plot
        let xCenter = xRange[1] - xSize / 2;
        let yCenter = yRange[1] - ySize / 2;
        let zCenter = zRange[1] - zSize / 2;
        box.position = new Vector3(xCenter, yCenter, zCenter);
        // position the camera so that the box fits into the field of view
        this.camera.position = new Vector3(xCenter, ySize, zCenter);
        this.camera.target = new Vector3(xCenter, yCenter, zCenter);
        let radius = box.getBoundingInfo().boundingSphere.radiusWorld;
        let aspectRatio = this._engine.getAspectRatio(this.camera);
        let halfMinFov = this.camera.fov / 2;
        if (aspectRatio < 1) {
            halfMinFov = Math.atan(aspectRatio * Math.tan(this.camera.fov / 2));
        }
        let viewRadius = Math.abs(radius / Math.sin(halfMinFov));
        this.camera.radius = viewRadius;
        // We don't need the box anymore
        box.dispose();
        this.camera.alpha = 0;
        this.camera.beta = 1; // 0 is top view, Pi is bottom
        this.ymax = yRange[1];
    }

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
    addImgStack(
        values: number[],
        indices: number[],
        attributes: { dim: number[] },
        options: {}
    ): Plots {
        // default options
        let opts = {
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
        }
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
            intensityMode: opts.intensityMode,
            channelColors: opts.channelColors,
            channelOpacities: [1, 1, 1]
        })
        let legendData: LegendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: opts.legendPosition
        }
        legendData.fontSize = opts.fontSize;
        legendData.fontColor = opts.fontColor;
        legendData.legendTitle = opts.legendTitle;
        legendData.legendTitleFontSize = opts.legendTitleFontSize;
        legendData.legendTitleFontColor = opts.legendTitleFontColor;

        let plot = new ImgStack(
            this.scene,
            values,
            indices,
            attributes,
            legendData,
            opts.size,
            this._backgroundColor,
            opts.intensityMode,
            this._xScale,
            this._yScale,
            this._zScale,
            opts.channelColors,
            opts.channelOpacities
        );
        this.plots.push(plot);
        this._updateLegend(this.uiLayer);
        this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;
        return this;
    }

    private _parseOptions(options: {}) {
        // default options
        let opts = {
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
            labelSize: null,
            labelColor: null,
            // deprecated animation option names:
            folded: null,
            foldedEmbedding: null,
            foldAnimDelay: null,
            foldAnimDuration: null,
        }
        // apply user options
        Object.assign(opts, options);

        return opts;
    }

    private _getColorsAndLegend(options, colorBy: string,  colorVar: string[] | number[]): [string[], LegendData] {
        let coordColors: string[] = [];
        let legendData: LegendData;

        switch (colorBy) {
            case "categories":
                // color plot by discrete categories
                let groups = colorVar as string[];
                let uniqueGroups = getUniqueVals(groups);
                // sortedCategories can contain an array of category names to order the groups for coloring.
                // sortedCategories must be of same length as unique groups in colorVar.
                // if no custom ordering is performed through sortedCategories, groups will be sorted alphabetically.
                uniqueGroups.sort();
                if (options.sortedCategories) {
                    if (uniqueGroups.length === options.sortedCategories.length) {
                        // sortedCategories must contain the same category names as those present in colorVar.
                        if (JSON.stringify(uniqueGroups) === JSON.stringify(options.sortedCategories.slice(0).sort())) {
                            uniqueGroups = options.sortedCategories;
                        }
                    }
                }
                let nColors = uniqueGroups.length;
                // Paired is default color scale for discrete variable coloring
                let colors = chroma.scale(chroma.brewer.Paired).mode('lch').colors(nColors);
                // check if color scale should be custom
                if (options.colorScale === "custom") {
                    if (options.customColorScale !== undefined && options.customColorScale.length !== 0) {
                        if (options.colorScaleInverted) {
                            colors = chroma.scale(options.customColorScale).domain([1, 0]).mode('lch').colors(nColors);
                        } else {
                            colors = chroma.scale(options.customColorScale).mode('lch').colors(nColors);
                        }
                    } else {
                        // set colorScale variable to default for legend if custom color scale is invalid
                        options.colorScale = "Paired";
                    }
                } else {
                    // check if user selected color scale is a valid chromajs color brewer name
                    if (options.colorScale && chroma.brewer.hasOwnProperty(options.colorScale)) {
                        if (options.colorScaleInverted) {
                            colors = chroma.scale(chroma.brewer[options.colorScale]).domain([1, 0]).mode('lch').colors(nColors);
                        } else {
                            colors = chroma.scale(chroma.brewer[options.colorScale]).mode('lch').colors(nColors);
                        }
                    } else {
                        // set colorScale variable to default for legend if user selected is not valid
                        options.colorScale = "Paired";
                    }
                }
                for (let i = 0; i < nColors; i++) {
                    colors[i] += "ff";
                }
                // apply colors to plot points
                for (let i = 0; i < colorVar.length; i++) {
                    let colorIndex = uniqueGroups.indexOf(groups[i]);
                    coordColors.push(colors[colorIndex]);
                }
                // prepare object for legend drawing
                legendData = {
                    showLegend: options.showLegend,
                    discrete: true,
                    breaks: uniqueGroups,
                    colorScale: options.colorScale,
                    customColorScale: options.customColorScale,
                    inverted: false,
                    position: options.legendPosition
                }
                break;
            case "values":
                // color by a continuous variable
                let min = getArrayMin(colorVar);
                let max = getArrayMax(colorVar);
                // Oranges is default color scale for continuous variable coloring
                let colorfunc = chroma.scale(chroma.brewer.Oranges).mode('lch');
                // check if color scale should be custom
                if (options.colorScale === "custom") {
                    // check if custom color scale is valid
                    if (options.customColorScale !== undefined && options.customColorScale.length !== 0) {
                        if (options.colorScaleInverted) {
                            colorfunc = chroma.scale(options.customColorScale).domain([1, 0]).mode('lch');
                        } else {
                            colorfunc = chroma.scale(options.customColorScale).mode('lch');
                        }
                    } else {
                        // set colorScale variable to default for legend if custom color scale is invalid
                        options.colorScale = "Oranges";
                    }
                } else {
                    // check if user selected color scale is a valid chromajs color brewer name
                    if (options.colorScale && chroma.brewer.hasOwnProperty(options.colorScale)) {
                        if (options.colorScaleInverted) {
                            colorfunc = chroma.scale(chroma.brewer[options.colorScale]).domain([1, 0]).mode('lch');
                        } else {
                            colorfunc = chroma.scale(chroma.brewer[options.colorScale]).mode('lch');
                        }
                    } else {
                        // set colorScale variable to default for legend if user selected is not valid
                        options.colorScale = "Oranges";
                    }
                }
                // normalize the values to 0-1 range
                let norm = (colorVar as number[]).slice().map(v => (v - min) / (max - min));
                // apply colors to plot points
                coordColors = norm.map(v => colorfunc(v).alpha(1).hex("rgba"));
                // prepare object for legend drawing
                legendData = {
                    showLegend: options.showLegend,
                    discrete: false,
                    breaks: [min.toString(), max.toString()],
                    colorScale: options.colorScale,
                    customColorScale: options.customColorScale,
                    inverted: options.colorScaleInverted,
                    position: options.legendPosition
                }
                break;
            case "direct":
                // color by color hex strings in colorVar
                for (let i = 0; i < colorVar.length; i++) {
                    let cl = colorVar[i];
                    cl = chroma(cl).hex();
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
                    customColorScale: options.customColorScale,
                    inverted: false,
                    position: options.legendPosition
                }
                break;
        }
        // add remaining properties to legend object
        legendData.fontSize = options.fontSize;
        legendData.fontColor = options.fontColor;
        legendData.legendTitle = options.legendTitle;
        legendData.legendTitleFontSize = options.legendTitleFontSize;
        legendData.legendTitleFontColor = options.legendTitleFontColor;
        legendData.showShape = options.legendShowShape;

        return [coordColors, legendData]
    }

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
    addPlot(
        coordinates: number[][],
        plotType: string,
        colorBy: string,
        colorVar: string[] | number[],
        options = {}
    ): Plots {
        var opts = this._parseOptions(options);

        // warnings for deprecated animation option names
        // keeping these for a while to not break compatibility, but suggest using the new option names
        if (opts.folded) {
            deprecationWarning("folded", "hasAnimation");
            if (!opts.hasAnimation) {
                opts.hasAnimation = opts.folded;
            }
        }
        if (opts.foldedEmbedding) {
            deprecationWarning("foldedEmbedding", "animationTargets");
            if (!opts.animationTargets) {
                opts.animationTargets = opts.foldedEmbedding;
            }
        }
        if (opts.foldAnimDelay) {
            deprecationWarning("foldAnimDelay", "animationDelay");
            if (!opts.animationDelay) {
                opts.animationDelay = opts.foldAnimDelay;
            }
        }
        if (opts.foldAnimDuration) {
            deprecationWarning("foldAnimDuration", "animationDuration");
            if (!opts.animationDuration) {
                opts.animationDuration = opts.foldAnimDuration;
            }
        }
        if (opts.foldAnimLoop) {
            deprecationWarning("foldAnimLoop", "animationLoop");
            if (!opts.animationLoop) {
                opts.animationLoop = opts.foldAnimLoop;
            }
        }
        // create plot data object for download as json button
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
        })

        this._hasAnim = this._hasAnim || opts.hasAnimation;

        if (opts.hasAnimation) {
            let replayBtn = document.createElement("div");
            replayBtn.className = "button"
            replayBtn.innerHTML = buttonSVGs.replay;
            replayBtn.onclick = this._resetAnimation.bind(this);
            this._buttonBar.appendChild(replayBtn);
            let loopBtn = document.createElement("div");
            if (opts.animationLoop) {
                loopBtn.className = "button active"
            } else {
                loopBtn.className = "button"
            }
            loopBtn.innerHTML = buttonSVGs.loop;
            loopBtn.onclick = this._toggleLoopAnimation.bind(this);
            this._buttonBar.appendChild(loopBtn);
            this._loopBtn = loopBtn;
        }

        let [coordColors, legendData] = this._getColorsAndLegend(opts, colorBy, colorVar);

        let plot: Plot;
        let scale: number[];
        let rangeX: number[];
        let rangeY: number[];
        let rangeZ: number[];

        let boundingBox: BoundingBox;

        switch (plotType) {
            case "pointCloud":
                plot = new PointCloud(
                    this.scene,
                    coordinates,
                    coordColors,
                    opts.size,
                    legendData,
                    opts.hasAnimation,
                    opts.animationTargets,
                    opts.animationDelay,
                    opts.animationDuration,
                    this._xScale,
                    this._yScale,
                    this._zScale,
                    opts.name,
                    opts.addClusterLabels,
                    opts.labelSize,
                    opts.labelColor,
                    this._annotationManager
                );
                boundingBox = plot.mesh.getBoundingInfo().boundingBox;
                rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ]
                rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ]
                rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ]
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ]
                break;
            case "surface":
                plot = new Surface(
                    this.scene,
                    coordinates,
                    coordColors,
                    opts.size,
                    legendData,
                    this._xScale,
                    this._yScale,
                    this._zScale,
                    opts.name
                );
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
                ]
                break
            case "shapeCloud":
                plot = new ShapeCloud(
                    this.scene,
                    coordinates,
                    coordColors,
                    opts.shape,
                    opts.shading,
                    opts.size,
                    legendData,
                    this._xScale,
                    this._yScale,
                    this._zScale,
                    opts.name,
                    opts.dpInfo
                );
                boundingBox = plot.mesh.getBoundingInfo().boundingBox;
                rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ]
                rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ]
                rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ]
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ]
                break;
            case "heatMap":
                plot = new HeatMap(
                    this.scene,
                    coordinates,
                    coordColors,
                    opts.size,
                    legendData,
                    this._xScale,
                    this._yScale,
                    this._zScale,
                    opts.name
                );
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
                ]
                break
            case "line":
                plot = new Line(
                    this.scene,
                    coordinates,
                    coordColors,
                    opts.size,
                    legendData,
                    opts.hasAnimation,
                    opts.animationDelay,
                    opts.animationDuration,
                    this._xScale,
                    this._yScale,
                    this._zScale,
                    opts.name,
                    opts.labels,
                    opts.labelSize,
                    opts.labelColor,
                    this._annotationManager
                )
                boundingBox = plot.mesh.getBoundingInfo().boundingBox;
                rangeX = [
                    boundingBox.minimumWorld.x,
                    boundingBox.maximumWorld.x
                ]
                rangeY = [
                    boundingBox.minimumWorld.y,
                    boundingBox.maximumWorld.y
                ]
                rangeZ = [
                    boundingBox.minimumWorld.z,
                    boundingBox.maximumWorld.z
                ]
                scale = [
                    this._xScale,
                    this._yScale,
                    this._zScale,
                ]
                break;
        }

        if (opts.animationLoop) {
            this._loopingAnim = true;
            plot.setLooping(true);
        }
        this.plots.push(plot);
        this._fsUIDirty = true;
        let axisData: AxisData = {
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
        }
        this._axes.push(new Axes(axisData, this.scene, plotType == "heatMap"));
        this._cameraFitPlot(rangeX, rangeY, rangeZ);
        return this
    }

    /**
     * 
     * @param meshString A glTF object string
     * @param options An object with general and plot type specific options.
     * 
     * Find a list of possible options [here](https://bp.bleb.li/documentation/js#addMeshStream).
     */
    addMeshObject(
        meshString: string,
        options: {}
    ): Plots {
        // default options
        let opts = {
            meshScaling: [1, 1, 1],
            meshRotation: [0, 0, 0],
            meshOffset: [0, 0, 0]
        }
        // apply user options
        Object.assign(opts, options);
        // prepare object for download as json button
        this._downloadObj["plots"].push({
            plotType: "meshObject",
            meshString: meshString,
            meshScaling: opts.meshScaling,
            meshRotation: opts.meshRotation,
            meshOffset: opts.meshOffset
        });

        let legendData: LegendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: undefined
        };

        let plot = new MeshObject(
            this.scene,
            meshString,
            legendData,
            this._xScale,
            this._yScale,
            this._zScale,
            opts.meshScaling,
            opts.meshRotation,
            opts.meshOffset
        );

        this.plots.push(plot);
        return this
    }

    /**
     * Streams meshes from a url and displays them sequentially.
     * 
     * @param rootUrl 
     * @param filePrefix 
     * @param fileSuffix 
     * @param fileIteratorStart 
     * @param fileIteratorEnd 
     * @param options An object with general and plot type specific options.
     * 
     * Find a list of possible options [here](https://bp.bleb.li/documentation/js#addMeshStream).
     */
    addMeshStream(
        rootUrl: string,
        filePrefix: string,
        fileSuffix: string,
        fileIteratorStart: number,
        fileIteratorEnd: number,
        frameDelay: number,
        options: {}
    ): Plots {
        // default options
        let opts = {
            meshRotation: [0, 0, 0],
            meshOffset: [0, 0, 0],
            clearCoat: false,
            clearCoatIntensity: 1,
        }
        // apply user options
        Object.assign(opts, options);
        // prepare object for download as json button
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

        let legendData: LegendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: "",
            inverted: false,
            position: undefined
        };

        let plot = new MeshStream(
            this.scene,
            rootUrl,
            filePrefix,
            fileSuffix,
            fileIteratorStart,
            fileIteratorEnd,
            legendData,
            this._xScale,
            this._yScale,
            this._zScale,
            frameDelay,
            opts.meshRotation,
            opts.meshOffset,
            opts.clearCoat,
            opts.clearCoatIntensity
        );
        this._hasAnim = true;
        this.plots.push(plot);
        // this._updateLegend(this.uiLayer);
        // this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;

        this._streamControlBtn.className = "button streamctrl loading";
        this._animationSlider.max = (plot.frameTotal - 1).toString();
        this._animationSlider.className = "anim-slider";

        // let replayBtn = document.createElement("div");
        // replayBtn.className = "button"
        // replayBtn.innerHTML = buttonSVGs.replay;
        // replayBtn.onclick = this._resetAnimation.bind(this);
        // let loopBtn = document.createElement("div");

        return this;
    }

    /**
     * Creates a color legend for the plots
     */
    private _updateLegend(uiLayer: AdvancedDynamicTexture): void {
        if (this._legend) {
            let descendantsUiLayer = uiLayer.getDescendants();
            for (var i = 0; i < descendantsUiLayer.length; i++) {
                var control = descendantsUiLayer[i];
                uiLayer.removeControl(control);
            }

            let descendantsLegend = this._legend.getDescendants();
            for (var i = 0; i < descendantsLegend.length; i++) {
                var control = descendantsLegend[i];
                this._legend.removeControl(control);
            }
        }

        let rightFree = true;
        let leftFree = true;
        let spaceLeft: number;
        let spaceRight: number;
        let shapeSpace = 0;
        let shapes = [];
        for (let i = 0; i < this.plots.length; i++) {
            const plot = this.plots[i];
            let legendData = plot.legendData;
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
                        } else {
                            spaceRight = 115;
                        }
                    } else if (leftFree) {
                        legendData.position = "left";
                        leftFree = false;
                        if (legendData.discrete) {
                            spaceLeft = legendData.breaks.length * (legendData.fontSize + 2);
                        } else {
                            spaceLeft = 115;
                        }
                    } else {
                        legendData.showLegend = false;
                    }
                } else {
                    if (legendData.position === "right") {
                        rightFree = false;
                        if (legendData.discrete) {
                            spaceRight = legendData.breaks.length * (legendData.fontSize + 2);
                        } else {
                            spaceRight = 115;
                        }
                    } else {
                        leftFree = false;
                        if (legendData.discrete) {
                            spaceRight = legendData.breaks.length * (legendData.fontSize + 2);
                        } else {
                            spaceRight = 115;
                        }
                    }
                }
            }
        }

        // if shape legend is requested, decide on which side it should be placed:
        if (shapeSpace > 0) {
            if (this.shapeLegendTitle && this.shapeLegendTitle !== "") {
                shapeSpace += 100;
            }
            if (rightFree) {
                this._shapeLegendPosition = "right";
            } else if (leftFree) {
                this._shapeLegendPosition = "left";
            } else {
                if (spaceRight <= spaceLeft) {
                    this._shapeLegendPosition = "right";
                } else {
                    this._shapeLegendPosition = "left";
                }
            }
        }


        let shapeLegendData: ShapeLegendData = {
            title: this.shapeLegendTitle,
            spacing: shapeSpace,
            shapes: shapes
        }

        let shapeLegendDrawn = false;
        for (let i = 0; i < this.plots.length; i++) {
            const lgndData = this.plots[i].legendData;
            if (lgndData.showLegend) {
                if (lgndData.position === this._shapeLegendPosition) {
                    uiLayer = this._createPlotLegend(lgndData, uiLayer, shapeLegendData);
                    shapeLegendDrawn = true;
                } else {
                    uiLayer = this._createPlotLegend(lgndData, uiLayer);
                }
            }
        }

        if (!shapeLegendDrawn) {
            this._drawStandaloneShapeLegend(uiLayer, shapeSpace, shapeLegendData);
        }

        this._legend = uiLayer;
    }

    private _drawStandaloneShapeLegend(uiLayer: AdvancedDynamicTexture, shapeSpace: number, shapeLegendData: ShapeLegendData) {
        let grid = new Grid();
        uiLayer.addControl(grid);

        let padding = (this.canvas.height - shapeSpace / 2) / 2;
        grid.addRowDefinition(padding, true);
        grid.addRowDefinition(shapeSpace, true);
        grid.addRowDefinition(padding, true);

        let legendWidth = 0.2;
        let legendColumn = 1;
        if (this._shapeLegendPosition === "right") {
            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
        } else {
            grid.addColumnDefinition(legendWidth);
            grid.addColumnDefinition(1 - legendWidth);
            legendColumn = 0;
        }

        let shapeLegendGrid = this._createShapeLegend(this.plots[0].legendData, shapeLegendData);

        grid.addControl(shapeLegendGrid, 1, legendColumn);
    }

    private _createPlotLegend(legendData: LegendData, uiLayer: AdvancedDynamicTexture, shapeLegendData?: ShapeLegendData): AdvancedDynamicTexture {
        if (!legendData.showLegend) {
            return uiLayer;
        }
        // create grid for placing legend in correct position
        let grid = new Grid();
        uiLayer.addControl(grid);

        let n = legendData.breaks.length;
        let breakN: number;
        let legendWidth = 0.2;
        let nCols = 1;

        let legendBodyHeight = 0.9;
        let legendMinPixels: number;
        if (legendData.discrete) {
            legendMinPixels = legendData.breaks.length * (legendData.fontSize + 2);
        } else {
            legendMinPixels = 115;
        }
        if (legendData.legendTitle && legendData.legendTitle !== "") {
            legendMinPixels += legendData.legendTitleFontSize + 5;
        }

        // main position of legend (right middle)
        if (shapeLegendData !== undefined) {
            grid.addRowDefinition(0.05);
            let totalReqPixels = legendMinPixels + shapeLegendData.spacing;
            legendBodyHeight = legendMinPixels / totalReqPixels;
            let shapeBodyHeight = shapeLegendData.spacing / totalReqPixels;
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

        let legendColumn = 1;
        if (legendData.position === "right") {
            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
        } else {
            grid.addColumnDefinition(legendWidth);
            grid.addColumnDefinition(1 - legendWidth);
            legendColumn = 0;
        }

        // create shape legend

        if (shapeLegendData) {

            let shapeLegendGrid = this._createShapeLegend(legendData, shapeLegendData);

            grid.addControl(shapeLegendGrid, 2, legendColumn);
        }

        let legendBody = new Grid();

        legendBody.paddingLeftInPixels = 10;
        legendBody.paddingRightInPixels = 10;

        legendBody.addRowDefinition(0.2);
        legendBody.addRowDefinition(0.7);
        legendBody.addRowDefinition(0.1);

        grid.addControl(legendBody, 1, legendColumn);

        if (legendData.legendTitle && legendData.legendTitle !== "") {
            let legendTitle = new TextBlock();
            legendTitle.text = legendData.legendTitle;
            legendTitle.color = legendData.legendTitleFontColor;
            legendTitle.fontWeight = "bold";
            legendTitle.fontSize = legendData.legendTitleFontSize + "px";
            legendTitle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            legendTitle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            legendTitle.textWrapping = true;
            legendBody.addControl(legendTitle, 0, legendColumn);
        }

        // for continuous measures display color bar and max and min values.
        if (!legendData.discrete) {

            let innerGrid = new Grid();
            innerGrid.addColumnDefinition(0.2);
            innerGrid.addColumnDefinition(0.8);
            legendBody.addControl(innerGrid, 1, 0);

            let nBreaks = 115;
            let labelSpace = 0.15;
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
                let padding = ((legendBodyHeight * this.canvas.height * 0.7) - 115) / 2;
                innerGrid.addRowDefinition(padding, true);
                innerGrid.addRowDefinition(115, true);
                innerGrid.addRowDefinition(padding, true);
            }
            // color bar
            let colors: string[];
            if (legendData.colorScale === "custom") {
                colors = chroma.scale(legendData.customColorScale).mode('lch').colors(nBreaks);
            }
            else {
                colors = chroma.scale(chroma.brewer[legendData.colorScale]).mode('lch').colors(nBreaks);
            }
            let scaleGrid = new Grid();
            for (let i = 0; i < nBreaks; i++) {
                scaleGrid.addRowDefinition(1 / nBreaks);
                let legendColor = new Rectangle();
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

            // label text
            let labelGrid = new Grid();
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

            let minText = new TextBlock();
            minText.text = parseFloat(legendData.breaks[0]).toFixed(2);
            minText.color = legendData.fontColor;
            minText.fontSize = legendData.fontSize + "px";
            minText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelGrid.addControl(minText, 2, 0);

            let maxText = new TextBlock();
            maxText.text = parseFloat(legendData.breaks[1]).toFixed(2);
            maxText.color = legendData.fontColor;
            maxText.fontSize = legendData.fontSize + "px";
            maxText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            labelGrid.addControl(maxText, 0, 0);
        }
        else {
            // inner Grid contains legend rows and columns for color and text
            let innerGrid = new Grid();
            // define number of columns by the number of categories.
            if (nCols > 1) {
                for (let i = 0; i < nCols; i++) {
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                }
            }
            else {
                innerGrid.addColumnDefinition(0.1);
                innerGrid.addColumnDefinition(0.9);
            }
            for (let i = 0; i < n && i < breakN; i++) {
                if (n > breakN) {
                    innerGrid.addRowDefinition(1 / breakN);
                }
                else {
                    innerGrid.addRowDefinition(1 / n);
                }
            }
            legendBody.addControl(innerGrid, 1, 0);

            let colors: string[];
            if (legendData.colorScale === "custom") {
                colors = chroma.scale(legendData.customColorScale).mode('lch').colors(n);
            }
            else {
                colors = chroma.scale(chroma.brewer[legendData.colorScale]).mode('lch').colors(n);
            }

            // add color box and legend text
            for (let i = 0; i < n; i++) {
                // color
                let legendColor = new Rectangle();
                legendColor.background = colors[i];
                legendColor.thickness = 0;
                legendColor.width = legendData.fontSize + "px";
                legendColor.height = legendData.fontSize + "px";

                let column = Math.floor(i / breakN);
                let row = i - column * breakN;

                innerGrid.addControl(legendColor, row, column * 2);

                // text
                let legendText = new TextBlock();
                legendText.text = legendData.breaks[i].toString();
                legendText.color = legendData.fontColor;
                legendText.fontSize = legendData.fontSize + "px";
                legendText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

                innerGrid.addControl(legendText, row, column * 2 + 1);
            }
        }
        return uiLayer;
    }

    private _createShapeLegend(legendData: LegendData, shapeLegendData: ShapeLegendData) {
        let shapeLegendGrid = new Grid();
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
            // shape legend title
            let shapeLegendTitle = new TextBlock();
            shapeLegendTitle.text = shapeLegendData.title;
            shapeLegendTitle.color = legendData.legendTitleFontColor;
            shapeLegendTitle.fontWeight = "bold";
            if (legendData.legendTitleFontSize) {
                shapeLegendTitle.fontSize = legendData.legendTitleFontSize + "px";
            }
            else {
                shapeLegendTitle.fontSize = "16px";
            }
            shapeLegendTitle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
            shapeLegendTitle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            shapeLegendTitle.textWrapping = true;
            shapeLegendGrid.addControl(shapeLegendTitle, 0, 0);
        } else {
            shapeLegendGrid.addRowDefinition(0.05);
            shapeLegendGrid.addRowDefinition(shapeLegendData.spacing, true);
            shapeLegendGrid.addRowDefinition(0.05);
        }
        let shapeLegendBody = new Grid();
        shapeLegendBody.addColumnDefinition(legendData.fontSize + 6, true);
        shapeLegendBody.addColumnDefinition(0.9);
        let rowHeight = 1 / shapeLegendData.shapes.length;
        for (let i = 0; i < shapeLegendData.shapes.length; i++) {
            const shapeDef = shapeLegendData.shapes[i];
            shapeLegendBody.addRowDefinition(rowHeight);
            // shape
            let url = "data:image/svg+xml;base64," + window.btoa(legendSVGs[shapeDef[1]]);
            let shapeIcon = new Image(shapeDef[0], url);
            shapeIcon.width = legendData.fontSize + 2 + "px";
            shapeIcon.height = legendData.fontSize + 2 + "px";

            shapeLegendBody.addControl(shapeIcon, i, 0);

            // text
            let shapeText = new TextBlock();
            shapeText.text = shapeDef[0];
            shapeText.color = legendData.fontColor;
            shapeText.fontSize = legendData.fontSize + "px";
            shapeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

            shapeLegendBody.addControl(shapeText, i, 1);
        }

        shapeLegendGrid.addControl(shapeLegendBody, 1, 0);
        return shapeLegendGrid;
    }

    /**
     * Start rendering the scene
     */
    doRender(): Plots {
        this._engine.runRenderLoop(() => {
            this.scene.render();
        });
        return this;
    }

    /**
     * Resizes the visualization to the current size of the canvas. This method should be bound to a resize event of the canvas. It is also recommended to call the resize() method once after the doRender() call.
     * 
     * @param width Optional: Width of the canvas
     * @param height Optional: Height of the canvas
     */
    resize(width?: number, height?: number): Plots {
        if (width !== undefined && height !== undefined) {
            this.canvas.width = width;
            this.canvas.height = height;
        }
        this._fsUIDirty = true;
        this._resizePublishOverlay();
        this._engine.resize();
        return this;
    }

    /**
     * Saves a screenshot of the visualization.
     * 
     * @param size Width and height of square thumbnail in pixels
     * @param saveCallback Function that takes the created screenshot as base64 encoded string.
     */
    thumbnail(size: number, saveCallback: (data: string) => void): Plots {
        ScreenshotTools.CreateScreenshot(this._engine, this.camera, size, saveCallback);
        return this;
    }

    /**
     * Releases all held resources of the Plots visualization. Useful to clear memory, after a visualization is no longer needed.
     */
    dispose(): void {
        this.scene.dispose();
        this._engine.dispose();
        // remove UI
        let btnbar = document.getElementById("buttonBar_" + this._uniqID);
        btnbar.remove();
        let lblCntrl = document.getElementById("labelControl_" + this._uniqID);
        lblCntrl.remove();
    }

    removePlot(index: number): Plots {
        let plot = this.plots[index];
        if (plot === undefined) return;
        this._annotationManager.removeLabelsByPlot(plot);
        plot.dispose();
        this.plots.splice(index);
        this._downloadObj["plots"].splice(index);
        return this;
    }

    /**
     * Add labels from a list of labels.
     * 
     * @param labelList List of lists with the first three elements of the inner lists being the x, y and z coordinates, and the fourth the label text.
     */
    addLabels(labelList: [[number, number, number, string, string?, number?]]): Plots {
        this._annotationManager.addLabels(labelList);
        return this;
    }

    update(index: number, coordinates: number[][], colorBy: string, colorVar: string[] | number[], options = {}): void {
        let plot = this.plots[index];
        if (plot === undefined) return;

        let opts = this._parseOptions(options);

        let [coordColors, legendData] = this._getColorsAndLegend(opts, colorBy, colorVar);

        plot.updateProperties(coordinates, coordColors, legendData);

        let boundingBox = plot.mesh.getBoundingInfo().boundingBox;
        let rangeX = [
            boundingBox.minimumWorld.x,
            boundingBox.maximumWorld.x
        ]
        let rangeY = [
            boundingBox.minimumWorld.y,
            boundingBox.maximumWorld.y
        ]
        let rangeZ = [
            boundingBox.minimumWorld.z,
            boundingBox.maximumWorld.z
        ]

        this._annotationManager.update();
        this._axes[0].axisData.range = [rangeX, rangeY, rangeZ]
        this._axes[0].update(this.camera, true);
        this._updateLegend(this.uiLayer);
    }
}
