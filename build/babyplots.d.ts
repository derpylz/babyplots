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
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
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
/**
 * Per plot legend information.
 */
export interface LegendData {
    /** Show or hide plot legend. */
    showLegend: boolean;
    /** Discrete or continuous color scale. */
    discrete: boolean;
    /** Categories if discrete, min and max values if continuous color scale. */
    breaks: string[];
    /** Name of the color scale. */
    colorScale: string;
    /** Is the color scale flipped? */
    inverted: boolean;
    /** Left or right position of this legend. If undefined, right is default. */
    position: string;
    /** Display shape/plot type in legend */
    showShape?: boolean;
    /** If color scale is not a colorbrewer palette, provide colors to construct the palette here. */
    customColorScale?: string[];
    /** Font size of the legend text. */
    fontSize?: number;
    /** Color of the legend text. */
    fontColor?: string;
    /** Title for the color legend. */
    legendTitle?: string;
    /** Font size of the color legend title. */
    legendTitleFontSize?: number;
    /** Color of the color legend title. */
    legendTitleFontColor?: string;
    /** Title for the shape legend. */
    legendShapeTitle?: string;
    /** Font size of the shape legend title. */
    legendShapeTitleFontSize?: number;
    /** Color of the shape legend title. */
    legendShowTitleFontColor?: string;
}
export declare abstract class Plot {
    protected _coords: number[][];
    protected _coordColors: string[];
    protected _groups: string[];
    protected _groupNames: string[];
    protected _size: number;
    protected _scene: Scene;
    mesh: Mesh;
    meshes: Mesh[];
    selection: number[];
    legendData: LegendData;
    xScale: number;
    yScale: number;
    zScale: number;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    updateSize(): void;
    update(): boolean;
    resetAnimation(): void;
}
declare global {
    interface Array<T> {
        min(): number;
        max(): number;
    }
}
export declare function matrixMax(matrix: number[][]): number;
export declare function matrixMin(matrix: number[][]): number;
export declare function getUniqueVals(source: string[]): string[];
export declare const PLOTTYPES: {
    pointCloud: string[];
    surface: string[];
    heatMap: string[];
    imageStack: string[];
};
/**
 * Takes a reasonable guess if a plot can be created from the provided object
 * @param plotData Object containing data to be checked for valid plot information
 */
export declare function isValidPlot(plotData: {}): boolean;
export declare class Plots {
    private _engine;
    private _hl1;
    private _hl2;
    protected _legend: AdvancedDynamicTexture;
    protected _showLegend: boolean;
    private _hasAnim;
    private _axes;
    private _downloadObj;
    private _buttonBar;
    private _annotationManager;
    private _backgroundColor;
    private _recording;
    private _turned;
    private _capturer;
    private _wasTurning;
    private _xScale;
    private _yScale;
    private _zScale;
    private _publishFormOverlay;
    private _uniqID;
    /** HTML canvas element for this babyplots visualization. */
    canvas: HTMLCanvasElement;
    /** Babylonjs scene object. */
    scene: Scene;
    /** Camera of the visualization */
    camera: ArcRotateCamera;
    /** Array of plots in this visualization. */
    plots: Plot[];
    /** Turn the camera around the plots. */
    turntable: boolean;
    /** Rotation speed of the turntable camera. */
    rotationRate: number;
    /** Highest point on the y axis of any plot. Used for positioning the camera and labels. */
    ymax: number;
    /** This variable should be exclusively set by the babyplots R package. It controls some specific options for babyplots behavior in the RStudio viewer. */
    R: boolean;
    /**
     * Initialize the 3d visualization
     *
     * @param canvasElement ID of the canvas element in the DOM
     * @param options Object with general options. See a list of possible options [here](https://bp.bleb.li/documentation/js#plotsObject).
     */
    constructor(canvasElement: string, options?: {});
    /**
     * Load a visualization from a saved JSON object. The R, JavaScript and Python implementations of babyplots as well as the NPC allow the export of visualizations as JSON files. Loading of a saved visualization using fromJSON() overwrites previously set properties of the Plots object.
     *
     * @param plotData Javascript Object with plot data.
     */
    fromJSON(plotData: {}): void;
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
    createButtons(whichBtns?: string[]): void;
    private _prepDownloadObj;
    private _downloadJson;
    private _createPublishForm;
    private _resizePublishOverlay;
    private _tryPublish;
    private _cancelPublish;
    private _resetAnimation;
    private _startRecording;
    /**
     * Register before render
     */
    private _prepRender;
    private _afterRender;
    /**
     * Zoom camera to fit the complete SPS into the field of view
     */
    private _cameraFitPlot;
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
    addImgStack(values: number[], indices: number[], attributes: {
        dim: number[];
    }, options: {}): this;
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
    addPlot(coordinates: number[][], plotType: string, colorBy: string, colorVar: string[] | number[], options?: {}): Plots;
    /**
     * Creates a color legend for the plots
     */
    private _updateLegend;
    private _createPlotLegend;
    /**
     * Start rendering the scene
     */
    doRender(): Plots;
    /**
     * Resizes the visualization to the current size of the canvas. This method should be bound to a resize event of the canvas. It is also recommended to call the resize() method once after the doRender() call.
     *
     * @param width Optional: Width of the canvas
     * @param height Optional: Height of the canvas
     */
    resize(width?: number, height?: number): Plots;
    /**
     * Saves a screenshot of the visualization.
     *
     * @param size Width and height of square thumbnail in pixels
     * @param saveCallback Function that takes the created screenshot as base64 encoded string.
     */
    thumbnail(size: number, saveCallback: (data: string) => void): void;
    /**
     * Releases all held resources of the Plots visualization. Useful to clear memory, after a visualization is no longer needed.
     */
    dispose(): void;
    /**
     * Add labels from a list of labels.
     *
     * @param labelList List of lists with the first three elements of the inner lists being the x, y and z coordinates, and the fourth the label text.
     */
    addLabels(labelList: [[number, number, number, string]]): void;
}
