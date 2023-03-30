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
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { LegendData } from "../utils/LegendData";
import { CoordinatePlot } from "../utils/Plot";
import chroma from "chroma-js";


export class Surface extends CoordinatePlot {
    constructor(
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
        name: string = "surface",
    ) {
        super(name, "surface", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale);
        this._createSurface();
        this.allLoaded = true;
    }
    private _createSurface(): void {
        var surface = new Mesh("surface", this._scene);
        var positions = [];
        var indices = [];
        for (let row = 0; row < this._coords.length; row++) {
            const rowCoords = this._coords[row];
            for (let column = 0; column < rowCoords.length; column++) {
                const coord = rowCoords[column];
                positions.push(
                    column * this.xScale,
                    coord * this.yScale,
                    row * this.zScale
                );
                if (row < this._coords.length - 1 && column < rowCoords.length - 1) {
                    indices.push(
                        column + row * rowCoords.length,
                        rowCoords.length + row * rowCoords.length + column,
                        column + row * rowCoords.length + 1,
                        column + row * rowCoords.length + 1,
                        rowCoords.length + row * rowCoords.length + column,
                        rowCoords.length + row * rowCoords.length + column + 1
                    );
                }
            }
        }
        var colors = [];
        for (let i = 0; i < this._coordColors.length; i++) {
            const hex = this._coordColors[i];
            let rgba = chroma(hex).rgba();
            colors.push(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]);
        }
        var normals = [];
        var vertexData = new VertexData();
        VertexData.ComputeNormals(positions, indices, normals);
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.colors = colors;
        vertexData.normals = normals;
        vertexData.applyToMesh(surface);
        var mat = new StandardMaterial("surfaceMat", this._scene);
        mat.backFaceCulling = false;
        mat.alpha = 1;
        surface.material = mat;
        this.mesh = surface;

        var propertyDescriptor = Object.getOwnPropertyDescriptor(this, "alpha");
         if (!propertyDescriptor) {
            Object.defineProperty(this, "alpha", {
                set(newAlpha) {
                    this.mesh.material.alpha = newAlpha;
                }
            });
        }
    }

    updateProperties(coordinates: number[][], colors: string[], legendData: LegendData): void {
       this.mesh.dispose();

       this._coords = coordinates;
       this._coordColors = colors;
       this.legendData = legendData;
       this._createSurface();
    }
}
