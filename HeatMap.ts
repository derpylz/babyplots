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
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { BoxBuilder } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { PlaneBuilder } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Plot, LegendData, matrixMax } from "./babyplots";

export class HeatMap extends Plot {
    constructor(
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1
    ) {
        super(scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale);
        this._createHeatMap();
    }
    private _createHeatMap(): void {
        let boxes = [];
        for (let row = 0; row < this._coords.length; row++) {
            const rowCoords = this._coords[row];
            for (let column = 0; column < rowCoords.length; column++) {
                const coord = rowCoords[column];
                if (coord > 0) {
                    let height = coord * this.yScale;
                    let box = BoxBuilder.CreateBox("box_" + row + "-" + column, {
                        height: height,
                        width: this.xScale * this._size,
                        depth: this.zScale * this._size
                    }, this._scene);
                    box.position = new Vector3(
                        row * this.xScale + 0.5 * this.xScale,
                        height / 2,
                        column * this.zScale + 0.5 * this.zScale
                    );
                    let mat = new StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = Color3.FromHexString(
                        this._coordColors[column + row * rowCoords.length].substring(0, 7)
                    );
                    box.material = mat;
                    boxes.push(box);
                }
                else {
                    let box = PlaneBuilder.CreatePlane(
                        "box_" + row + "-" + column,
                        {
                            width: this.xScale * this._size,
                            height: this.zScale * this._size
                        }, this._scene);
                    box.position = new Vector3(
                        row * this.xScale + 0.5 * this.xScale,
                        0,
                        column * this.zScale + 0.5 * this.zScale
                    );
                    box.rotation.x = Math.PI / 2;
                    let mat = new StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = Color3.FromHexString(
                        this._coordColors[column + row * rowCoords.length].substring(0, 7)
                    );
                    mat.backFaceCulling = false;
                    box.material = mat;
                    boxes.push(box);
                }
            }
        }
        this.meshes = boxes;
        Object.defineProperty(this, "alpha", {
            set(newAlpha) {
                for (let i = 0; i < this.meshes.length; i++) {
                    const box = this.meshes[i] as Mesh;
                    box.material.alpha = newAlpha;
                }
            }
        });
    }
}
