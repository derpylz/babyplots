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
import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
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
export interface shapeLegendData {
    title: string;
    spacing: number;
    shapes: string[][];
}
export interface LegendData {
    showLegend: boolean;
    discrete: boolean;
    breaks: string[];
    colorScale: string;
    inverted: boolean;
    position: string;
    showShape?: boolean;
    customColorScale?: string[];
    fontSize?: number;
    fontColor?: string;
    legendTitle?: string;
    legendTitleFontSize?: number;
    legendTitleFontColor?: string;
}
export declare abstract class Plot {
    protected _scene: Scene;
    allLoaded: boolean;
    name: string;
    shape: string;
    mesh: Mesh;
    meshes: Mesh[];
    legendData: LegendData;
    xScale: number;
    yScale: number;
    zScale: number;
    pickable: boolean;
    constructor(name: string, shape: string, scene: Scene, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    update(): boolean;
    resetAnimation(): void;
    setLooping(looping: boolean): void;
}
export declare abstract class CoordinatePlot extends Plot {
    protected _coords: number[][];
    protected _coordColors: string[];
    protected _groups: string[];
    protected _groupNames: string[];
    protected _size: number;
    pickable: boolean;
    selection: number[];
    dpInfo: string[];
    constructor(name: string, shape: string, scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    getPick(pickResult: PickingInfo): {
        target: TransformNode;
        info: string;
    };
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
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
export declare const PLOTTYPES: {
    pointCloud: string[];
    shapeCloud: string[];
    surface: string[];
    heatMap: string[];
    imageStack: string[];
};
export declare function isValidPlot(plotData: {}): boolean;
export declare class Plots {
    private _engine;
    private _hl1;
    private _hl2;
    protected _legend: AdvancedDynamicTexture;
    protected _showLegend: boolean;
    private _hasAnim;
    private _loopingAnim;
    private _buttonBar;
    private _turntableBtn;
    private _loopBtn;
    private _streamControlBtn;
    private _axes;
    private _downloadObj;
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
    private _shapeLegendPosition;
    private _fsUIDirty;
    canvas: HTMLCanvasElement;
    scene: Scene;
    camera: ArcRotateCamera;
    plots: Plot[];
    turntable: boolean;
    rotationRate: number;
    ymax: number;
    R: boolean;
    Python: boolean;
    shapeLegendTitle: string;
    uiLayer: AdvancedDynamicTexture;
    animPaused: boolean;
    constructor(canvasElement: string, options?: {});
    fromJSON(plotData: {}): void;
    createButtons(whichBtns?: string[]): void;
    private _prepDownloadObj;
    private _downloadJson;
    private _createPublishForm;
    private _resizePublishOverlay;
    private _tryPublish;
    private _cancelPublish;
    private _resetAnimation;
    pauseAnimation(): void;
    playAnimation(): void;
    toggleTurntable(): void;
    private _toggleLoopAnimation;
    private _startRecording;
    private _prepRender;
    private _afterRender;
    private _cameraFitPlot;
    addImgStack(values: number[], indices: number[], attributes: {
        dim: number[];
    }, options: {}): this;
    addPlot(coordinates: number[][], plotType: string, colorBy: string, colorVar: string[] | number[], options?: {}): Plots;
    addMeshStream(rootUrl: string, filePrefix: string, fileSuffix: string, fileIteratorStart: number, fileIteratorEnd: number, frameDelay: number, options: {}): Plots;
    private _updateLegend;
    private _drawStandaloneShapeLegend;
    private _createPlotLegend;
    private _createShapeLegend;
    doRender(): Plots;
    resize(width?: number, height?: number): Plots;
    thumbnail(size: number, saveCallback: (data: string) => void): void;
    dispose(): void;
    addLabels(labelList: [[number, number, number, string]]): void;
}
