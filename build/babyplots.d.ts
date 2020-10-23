import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { AdvancedDynamicTexture } from "@babylonjs/gui/2D/advancedDynamicTexture";
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
export declare const buttonSVGs: {
    logo: string;
    toJson: string;
    labels: string;
    publish: string;
    replay: string;
    record: string;
};
export declare const styleText: string;
export declare function matrixMax(matrix: number[][]): number;
export interface LegendData {
    showLegend: boolean;
    discrete: boolean;
    breaks: string[];
    colorScale: string;
    inverted: boolean;
    position: string;
    customColorScale?: string[];
    fontSize?: number;
    fontColor?: string;
    legendTitle?: string;
    legendTitleFontSize?: number;
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
export declare function getUniqueVals(source: string[]): string[];
export declare const PLOTTYPES: {
    pointCloud: string[];
    surface: string[];
    heatMap: string[];
    imgStack: string[];
};
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
    canvas: HTMLCanvasElement;
    scene: Scene;
    camera: ArcRotateCamera;
    plots: Plot[];
    turntable: boolean;
    rotationRate: number;
    fixedSize: boolean;
    ymax: number;
    R: boolean;
    constructor(canvasElement: string, options?: {});
    fromJSON(plotData: {}): void;
    createButtons(whichBtns?: string[]): void;
    private _downloadJson;
    private _resetAnimation;
    private _startRecording;
    private _prepRender;
    private _afterRender;
    private _cameraFitPlot;
    addImgStack(values: number[], indices: number[], attributes: {
        dim: number[];
    }, options: {}): this;
    addPlot(coordinates: number[][], plotType: string, colorBy: string, colorVar: string[] | number[], options?: {}): Plots;
    private _updateLegend;
    private _createPlotLegend;
    doRender(): Plots;
    resize(width?: number, height?: number): Plots;
    thumbnail(size: number, saveCallback: (data: string) => void): void;
    dispose(): void;
    addLabels(labelList: [[number, number, number, string]]): void;
}
