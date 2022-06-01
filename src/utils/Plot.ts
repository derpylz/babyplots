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

import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { LegendData } from "./LegendData";

export abstract class Plot {
    protected _scene: Scene;

    allLoaded: boolean = false;
    name: string;
    shape: string;
    mesh: Mesh;
    meshes: Mesh[];
    legendData: LegendData;
    xScale: number;
    yScale: number;
    zScale: number;
    pickable: boolean = false;

    /**
     * Basic constructor of a plot.
     * @param name Name of the plot, default is plot type, used for legend
     * @param shape For shapeCloud plots, shape of the points
     * @param scene BabylonJS scene of the Plots instance
     * @param legendData LegendData object
     * @param xScale scaling factor for x-axis
     * @param yScale scaling factor for y-axis
     * @param zScale scaling factor for z-axis
     */
    constructor(
        name: string,
        shape: string,
        scene: Scene,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
    ) {
        this.name = name;
        this.shape = shape;
        this._scene = scene;
        this.legendData = legendData;
        this.xScale = xScale;
        this.yScale = yScale;
        this.zScale = zScale;
    }

    goToFrame(n: number): void { }
    update(): boolean { return false }
    resetAnimation(): void { }
    setLooping(looping: boolean): void { }
    dispose(): void {
        if (this.mesh !== undefined) {
            this.mesh.dispose()
        }
        if (this.meshes !== undefined) {
            for (let i = 0; i < this.meshes.length; i++) {
                const m = this.meshes[i];
                m.dispose();
            }
        }
    }
}

export abstract class CoordinatePlot extends Plot {
    protected _coords: number[][];
    protected _coordColors: string[];
    protected _groups: string[];
    protected _groupNames: string[];
    protected _size: number = 1;

    /** Are points pickable */
    pickable: boolean = true;
    /** Contains indices of selected points */
    selection: number[];
    /** Info on data points to display when clicked (shapeCloud only) */
    dpInfo: string[];

    /**
     * Basic constructor of a plot with coordinates.
     * @param name Name of the plot, default is plot type, used for legend
     * @param shape For shapeCloud plots, shape of the points
     * @param scene Babylonjs scene of the Plots instance
     * @param coordinates Coordinates of the points
     * @param colorVar Color variable of the points
     * @param size Size of the points
     * @param legendData LegendData object
     * @param xScale scaling factor for x-axis
     * @param yScale scaling factor for y-axis
     * @param zScale scaling factor for z-axis
     */
    constructor(
        name: string,
        shape: string,
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1
    ) {
        super(name, shape, scene, legendData, xScale, yScale, zScale);
        this._coords = coordinates;
        this._coordColors = colorVar;
        this._size = size;
    }

    getPick(pickResult: PickingInfo): { target: TransformNode, info: string } { return null }
}