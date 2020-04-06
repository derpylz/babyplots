import { Scene } from "@babylonjs/core/scene";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Vector3, Color4, Color3 } from "@babylonjs/core/Maths/math";
import { BoxBuilder } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
import { Rectangle, TextBlock, Grid, Control } from "@babylonjs/gui/2D/controls";
import { ScreenshotTools } from "@babylonjs/core/Misc/screenshotTools";
import chroma from "chroma-js";

import { LabelManager } from "./Label";

/**
 * Interface for object containing information about axis setup.
 */
export interface AxisData {
    showAxes: boolean[];
    static: boolean;
    axisLabels: string[];
    range: number[][];
    color: string[];
    scale: number[];
    tickBreaks: number[];
    showTickLines: boolean[][];
    tickLineColor: string[][];
    showPlanes: boolean[];
    planeColor: string[];
    plotType: string;
    colnames: string[];
    rownames: string[];
}

import { Axes } from "./Axes";

export function matrixMax(matrix: number[][]): number {
    let maxRow = matrix.map(function (row) { return Math.max.apply(Math, row); });
    let max = Math.max.apply(null, maxRow);
    return max
}

export interface LegendData {
    showLegend: boolean;
    discrete: boolean;
    breaks: string[];
    colorScale: string;
    fontSize?: number;
    fontColor?: string;
    legendTitle?: string;
    legendTitleFontSize?: number;
}

export abstract class Plot {
    protected _coords: number[][];
    protected _coordColors: string[];
    protected _groups: string[];
    protected _groupNames: string[];
    protected _size: number = 1;
    protected _scene: Scene;

    mesh: Mesh;
    meshes: Mesh[];
    selection: number[]; // contains indices of cells in selection cube
    legendData: LegendData;

    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData) {
        this._scene = scene;
        this._coords = coordinates;
        this._coordColors = colorVar;
        this._size = size;
        this.legendData = legendData;
    }

    updateSize(): void { }
    update(): boolean { return false }
}

import { ImgStack } from "./ImgStack";
import { PointCloud } from "./PointCloud";
import { Surface } from "./Surface";
import { HeatMap } from "./HeatMap";
import { FileTools } from "@babylonjs/core/Misc/fileTools";

declare global {
    interface Array<T> {
        min(): number;
        max(): number;
    }
}

Array.prototype.min = function (): number {
    if (this.length > 65536) {
        let r = this[0];
        this.forEach(function (v: number, _i: any, _a: any) { if (v < r) r = v; });
        return r;
    } else {
        return Math.min.apply(null, this);
    }
}

Array.prototype.max = function (): number {
    if (this.length > 65536) {
        let r = this[0];
        this.forEach(function (v: number, _i: any, _a: any) { if (v > r) r = v; });
        return r;
    } else {
        return Math.max.apply(null, this);
    }
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

export class Plots {
    private _engine: Engine;
    private _hl1: HemisphericLight;
    private _hl2: HemisphericLight;
    protected _legend: AdvancedDynamicTexture;
    protected _showLegend: boolean = true;
    private _hasAnim: boolean = false;
    private _axes: Axes;
    private _downloadObj: {} = {};
    private _buttonBar: HTMLDivElement;
    private _labelManager: LabelManager;
    private _backgroundColor: string;

    canvas: HTMLCanvasElement;
    scene: Scene;
    camera: ArcRotateCamera;
    plots: Plot[] = [];
    turntable: boolean = false;
    rotationRate: number = 0.01;
    fixedSize = false;
    ymax: number = 0;
    R: boolean = false;

    /**
     * Initialize the 3d visualization
     * @param canvasElement ID of the canvas element in the dom
     * @param backgroundColor Background color of the plot
     */
    constructor(canvasElement: string, backgroundColor: string = "#ffffffff") {
        // setup enginge and scene
        this._backgroundColor = backgroundColor;
        this.canvas = document.getElementById(canvasElement) as HTMLCanvasElement;
        this._engine = new Engine(this.canvas, true, {preserveDrawingBuffer: true, stencil: true});
        this.scene = new Scene(this._engine);

        // camera
        this.camera = new ArcRotateCamera("Camera", 0, 0, 10, Vector3.Zero(), this.scene);
        this.camera.attachControl(this.canvas, true);
        this.scene.activeCamera = this.camera;
        this.camera.inputs.attached.keyboard.detachControl(this.canvas);
        this.camera.wheelPrecision = 50;

        // background color
        this.scene.clearColor = Color4.FromHexString(backgroundColor);

        // two lights to illuminate the cells uniformly (top and bottom)
        this._hl1 = new HemisphericLight("HemiLight", new Vector3(0, 1, 0), this.scene);
        this._hl1.diffuse = new Color3(1, 1, 1);
        this._hl1.specular = new Color3(0, 0, 0);
        // bottom light slightly weaker for better depth perception and orientation
        this._hl2 = new HemisphericLight("HemiLight", new Vector3(0, -1, 0), this.scene);
        this._hl2.diffuse = new Color3(0.8, 0.8, 0.8);
        this._hl2.specular = new Color3(0, 0, 0);

        this._labelManager = new LabelManager(this.canvas, this.scene, this.ymax, this.camera);

        this.scene.registerBeforeRender(this._prepRender.bind(this));

        this.scene.registerAfterRender(this._afterRender.bind(this));

    }

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
        if (plotData["coordinates"] && plotData["plotType"] && plotData["colorBy"]) {
            this.addPlot(
                plotData["coordinates"],
                plotData["plotType"],
                plotData["colorBy"],
                plotData["colorVar"],
                {
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
                }
            )
        } else if (plotData["values"] && plotData["indices"] && plotData["attributes"]) {
            this.addImgStack(
                plotData["values"],
                plotData["indices"],
                plotData["attributes"],
                {
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
                }
            )
        }
        if (plotData["labels"]) {
            this._labelManager.fixed = true;
            let labelData = plotData["labels"];
            for (let i = 0; i < labelData.length; i++) {
                const label = labelData[i];
                if (label["text"] && label["position"]) {
                    this._labelManager.addLabel(label["text"], label["position"]);
                }
            }
        }
    }

    createButtons(): void {
        let buttonBar = document.createElement("div");
        buttonBar.className = "button-bar"
        let jsonBtn = document.createElement("div");
        jsonBtn.className = "button"
        jsonBtn.onclick = this._downloadJson.bind(this);
        let jsonBtnImg = document.createElement("img");
        jsonBtnImg.src = "./lib/babyplots-0.1/content/to_json.png";
        jsonBtn.appendChild(jsonBtnImg);
        buttonBar.appendChild(jsonBtn);
        let labelBtn = document.createElement("div");
        labelBtn.className = "button"
        labelBtn.onclick = this._labelManager.toggleLabelControl.bind(this._labelManager);
        let labelBtnImg = document.createElement("img");
        labelBtnImg.src = "./lib/babyplots-0.1/content/labels.png";
        labelBtn.appendChild(labelBtnImg);
        buttonBar.appendChild(labelBtn);
        buttonBar.style.top = this.canvas.clientTop + 5 + "px";
        buttonBar.style.left = this.canvas.clientLeft + 5 + "px";
        this.canvas.parentNode.appendChild(buttonBar);
        this._buttonBar = buttonBar;
        // this._createLabelForms();
    }

    private _downloadJson() {
        let dlElement = document.createElement("a");
        this._downloadObj["labels"] = this._labelManager.exportLabels();
        let dlContent = encodeURIComponent(JSON.stringify(this._downloadObj));
        dlElement.setAttribute("href", "data:text/plain;charset=utf-8," + dlContent);
        dlElement.setAttribute("download", "babyplots_export.json");
        dlElement.style.display = "none";
        document.body.appendChild(dlElement);
        dlElement.click();
        document.body.removeChild(dlElement);
    }

    /**
     * Register before render
     */
    private _prepRender(): void {
        // rotate camera around plot if turntable is true
        if (this.turntable) {
            this.camera.alpha += this.rotationRate;
        }
        // update plots with animations
        if (this._hasAnim) {
            this._hasAnim = this.plots[0].update();
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
                this._axes.axisData.range = [rangeX, rangeY, rangeZ]
                this._axes.update(this.camera, true);
            }
        }
        // update axis drawing
        if (this._axes) {
            this._axes.update(this.camera);
        }

        // update labels
        this._labelManager.update();

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
    }

    /**
     * Currently not used
     */
    private _afterRender(): void { }

    /**
     * Zoom camera to fit the complete SPS into the field of view
     */
    private _cameraFitPlot(xRange: number[], yRange: number[], zRange: number[]): void {
        let xSize = xRange[1] - xRange[0];
        let ySize = yRange[1] - yRange[0];
        let zSize = zRange[1] - zRange[0];
        let box = BoxBuilder.CreateBox('bdbx', {
            width: xSize, height: ySize, depth: zSize
        }, this.scene);
        let xCenter = xRange[1] - xSize / 2;
        let yCenter = yRange[1] - ySize / 2;
        let zCenter = zRange[1] - zSize / 2;
        box.position = new Vector3(xCenter, yCenter, zCenter);
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
        box.dispose();
        this.camera.alpha = 0;
        this.camera.beta = 1; // 0 is top view, Pi is bottom
        this.ymax = yRange[1];
    }

    addImgStack(
        values: number[],
        indices: number[],
        attributes: { dim: number[] },
        options = {
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
        }
    ) {
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
        }
        let legendData: LegendData = {
            showLegend: false,
            discrete: false,
            breaks: [],
            colorScale: ""
        }
        legendData.fontSize = options.fontSize;
        legendData.fontColor = options.fontColor;
        legendData.legendTitle = options.legendTitle;
        legendData.legendTitleFontSize = options.legendTitleFontSize;

        let plot = new ImgStack(this.scene, values, indices, attributes, legendData, options.size);
        this.plots.push(plot);
        this._updateLegend();
        this._cameraFitPlot([0, attributes.dim[2]], [0, attributes.dim[0]], [0, attributes.dim[1]]);
        this.camera.wheelPrecision = 1;
        return this;
    }

    addPlot(
        coordinates: number[][],
        plotType: string,
        colorBy: string,
        colorVar: string[] | number[],
        options = {
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
        }
    ): Plots {
        // create plot data object for download as json button
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
        }

        let coordColors: string[] = [];
        var legendData: LegendData;
        let rangeX: number[];
        let rangeY: number[];
        let rangeZ: number[];
        this._hasAnim = options.folded;

        switch (colorBy) {
            case "categories":
                // color plot by discrete categories
                let groups = colorVar as string[];
                let uniqueGroups = getUniqueVals(groups);
                let nColors = uniqueGroups.length;
                // Paired is default color scale for discrete variable coloring
                let colors = chroma.scale(chroma.brewer.Paired).mode('lch').colors(nColors);
                // check if user selected color scale is a valid chromajs color brewer name
                if (options.colorScale && chroma.brewer.hasOwnProperty(options.colorScale)) {
                    colors = chroma.scale(chroma.brewer[options.colorScale]).mode('lch').colors(nColors);
                } else {
                    // set colorScale variable to default for legend if user selected is not valid
                    options.colorScale = "Paired";
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
                    colorScale: options.colorScale
                }
                break;
            case "values":
                // color by a continuous variable
                let min = colorVar.min();
                let max = colorVar.max();
                // Oranges is default color scale for continuous variable coloring
                let colorfunc = chroma.scale(chroma.brewer.Oranges).mode('lch');
                // check if user selected color scale is a valid chromajs color brewer name
                if (options.colorScale && chroma.brewer.hasOwnProperty(options.colorScale)) {
                    colorfunc = chroma.scale(chroma.brewer[options.colorScale]).mode('lch');
                } else {
                    // set colorScale variable to default for legend if user selected is not valid
                    options.colorScale = "Oranges";
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
                    colorScale: options.colorScale
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
                    colorScale: ""
                }
                break;
        }
        // add remaining properties to legend object
        legendData.fontSize = options.fontSize;
        legendData.fontColor = options.fontColor;
        legendData.legendTitle = options.legendTitle;
        legendData.legendTitleFontSize = options.legendTitleFontSize;

        let plot: Plot;
        let scale: number[];
        switch (plotType) {
            case "pointCloud":
                plot = new PointCloud(this.scene, coordinates, coordColors, options.size, legendData, options.folded, options.foldedEmbedding, options.foldAnimDelay, options.foldAnimDuration);
                let boundingBox = plot.mesh.getBoundingInfo().boundingBox;
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
                scale = [1, 1, 1]
                break;
            case "surface":
                plot = new Surface(this.scene, coordinates, coordColors, options.size, legendData);
                rangeX = [0, coordinates.length];
                rangeZ = [0, coordinates[0].length]
                rangeY = [0, options.size];
                scale = [
                    1,
                    matrixMax(coordinates) / options.size,
                    1
                ]
                break
            case "heatMap":
                plot = new HeatMap(this.scene, coordinates, coordColors, options.size, legendData);
                rangeX = [0, coordinates.length];
                rangeZ = [0, coordinates[0].length]
                rangeY = [0, options.size];
                scale = [
                    1,
                    matrixMax(coordinates) / options.size,
                    1
                ]
                break
        }

        this.plots.push(plot);
        this._updateLegend();
        let axisData: AxisData = {
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
        }
        this._axes = new Axes(axisData, this.scene, plotType == "heatMap");
        this._cameraFitPlot(rangeX, rangeY, rangeZ);
        return this
    }

    /**
     * Creates a color legend for the plot
     */
    private _updateLegend(): void {
        if (this._legend) { this._legend.dispose(); }
        let legendData = this.plots[0].legendData;
        let n;
        let breakN = 20;
        if (legendData.showLegend) {

            // create fullscreen GUI texture
            let advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
            // create grid for placing legend in correct position
            let grid = new Grid();
            advancedTexture.addControl(grid);

            // main position of legend (right middle)

            let legendWidth = 0.2;

            if (legendData.discrete) {
                // number of clusters
                n = legendData.breaks.length;

                if (n > breakN * 2) {
                    legendWidth = 0.4;
                } else if (n > breakN) {
                    legendWidth = 0.3;
                }
            }

            grid.addColumnDefinition(1 - legendWidth);
            grid.addColumnDefinition(legendWidth);
            if (legendData.legendTitle && legendData.legendTitle !== "") {
                grid.addRowDefinition(0.1);
                grid.addRowDefinition(0.85);
                grid.addRowDefinition(0.05)
            } else {
                grid.addRowDefinition(0.05);
                grid.addRowDefinition(0.9);
                grid.addRowDefinition(0.05);
            }

            if (legendData.legendTitle) {
                let legendTitle = new TextBlock();
                legendTitle.text = legendData.legendTitle;
                legendTitle.color = legendData.fontColor;
                legendTitle.fontWeight = "bold";
                if (legendData.legendTitleFontSize) {
                    legendTitle.fontSize = legendData.legendTitleFontSize + "px";
                } else {
                    legendTitle.fontSize = "20px";
                }
                legendTitle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
                legendTitle.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                grid.addControl(legendTitle, 0, 1);
            }

            // for continuous measures display viridis color bar and max and min values.
            if (!legendData.discrete) {

                let innerGrid = new Grid();
                innerGrid.addColumnDefinition(0.2);
                innerGrid.addColumnDefinition(0.8);
                innerGrid.addRowDefinition(1);
                grid.addControl(innerGrid, 1, 1);

                let nBreaks = 265;
                let labelSpace = 0.05;
                if (this.canvas.height < 70) {
                    nBreaks = 10;
                    labelSpace = 0.45;
                } else if (this.canvas.height < 130) {
                    nBreaks = 50;
                    labelSpace = 0.3;
                } else if (this.canvas.height < 350) {
                    nBreaks = 100;
                    labelSpace = 0.15
                }
                // viridis color bar
                let colors = chroma.scale(chroma.brewer[legendData.colorScale]).mode('lch').colors(nBreaks);
                let scaleGrid = new Grid();
                for (let i = 0; i < nBreaks; i++) {
                    scaleGrid.addRowDefinition(1 / nBreaks);
                    let legendColor = new Rectangle();
                    legendColor.background = colors[colors.length - i - 1];
                    legendColor.thickness = 0;
                    legendColor.width = 0.5;
                    legendColor.height = 1;
                    scaleGrid.addControl(legendColor, i, 0);
                }
                innerGrid.addControl(scaleGrid, 0, 0);

                // label text
                let labelGrid = new Grid();
                labelGrid.addColumnDefinition(1);
                labelGrid.addRowDefinition(labelSpace);
                labelGrid.addRowDefinition(1 - labelSpace * 2);
                labelGrid.addRowDefinition(labelSpace);
                innerGrid.addControl(labelGrid, 0, 1);

                let minText = new TextBlock();
                minText.text = parseFloat(legendData.breaks[0]).toFixed(4).toString();
                minText.color = legendData.fontColor;
                minText.fontSize = legendData.fontSize + "px";
                minText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                labelGrid.addControl(minText, 2, 0);

                let maxText = new TextBlock();
                maxText.text = parseFloat(legendData.breaks[1]).toFixed(4).toString();
                maxText.color = legendData.fontColor;
                maxText.fontSize = legendData.fontSize + "px";
                maxText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                labelGrid.addControl(maxText, 0, 0);
            } else {
                // inner Grid contains legend rows and columns for color and text
                var innerGrid = new Grid();
                // two legend columns when more than 15 colors
                if (n > breakN * 2) {
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                } else if (n > breakN) {
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                    innerGrid.addColumnDefinition(0.1);
                    innerGrid.addColumnDefinition(0.4);
                } else {
                    innerGrid.addColumnDefinition(0.2);
                    innerGrid.addColumnDefinition(0.8);
                }
                for (let i = 0; i < n && i < breakN; i++) {
                    if (n > breakN) {
                        innerGrid.addRowDefinition(1 / breakN);
                    } else {
                        innerGrid.addRowDefinition(1 / n);
                    }
                }
                grid.addControl(innerGrid, 1, 1);

                let colors = chroma.scale(chroma.brewer[legendData.colorScale]).mode('lch').colors(n);

                // add color box and legend text
                for (let i = 0; i < n; i++) {
                    // color
                    var legendColor = new Rectangle();
                    legendColor.background = colors[i];
                    legendColor.thickness = 0;
                    legendColor.width = legendData.fontSize + "px";
                    legendColor.height = legendData.fontSize + "px";
                    // use second column for many entries
                    if (i > breakN * 2 - 1) {
                        innerGrid.addControl(legendColor, i - breakN * 2, 4);
                    } else if (i > breakN - 1) {
                        innerGrid.addControl(legendColor, i - breakN, 2);
                    } else {
                        innerGrid.addControl(legendColor, i, 0);
                    }
                    // text
                    var legendText = new TextBlock();
                    legendText.text = legendData.breaks[i].toString();
                    legendText.color = legendData.fontColor;
                    legendText.fontSize = legendData.fontSize + "px";
                    legendText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
                    // use second column for many entries
                    if (i > breakN * 2 - 1) {
                        innerGrid.addControl(legendText, i - breakN * 2, 5);
                    }
                    if (i > breakN - 1) {
                        innerGrid.addControl(legendText, i - breakN, 3);
                    } else {
                        innerGrid.addControl(legendText, i, 1);
                    }
                }
            }
            this._legend = advancedTexture;
        }
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

    resize(width?: number, height?: number): Plots {
        if (width !== undefined && height !== undefined) {
            if (this.R) {
                let pad = parseInt(document.body.style.padding.substring(0, document.body.style.padding.length - 2));
                this.canvas.width = width - 2 * pad;
                this.canvas.height = height - 2 * pad;
            } else {
                this.canvas.width = width;
                this.canvas.height = height;
            }
        }
        this._updateLegend();
        this._engine.resize();
        return this
    }

    thumbnail(size: number, saveCallback: (data: string) => void): void {
        ScreenshotTools.CreateScreenshot(this._engine, this.camera, size, saveCallback);
    }

    dispose(): void {
        this.scene.dispose();
        this._engine.dispose();
    }
    
}
