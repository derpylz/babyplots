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
import { Vector3, Color4, Color3 } from "@babylonjs/core/Maths/math";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { FloatArray } from "@babylonjs/core/types";
import { PickingInfo } from "@babylonjs/core/Collisions/pickingInfo";
import { Plot, LegendData } from "./babyplots";

export class PointCloud extends Plot {
    private _pointPicking: boolean = false;
    private _selectionCallback = function (selection: number[]) { return false; };
    private _folded: boolean;
    private _looping: boolean = false;
    private _animDirection: number = 1;
    private _foldedEmbedding: number[][];
    private _foldVectors: Vector3[] = [];
    private _foldCounter: number = 0;
    private _foldAnimFrames: number = 200;
    private _foldVectorFract: Vector3[] = [];
    private _foldDelay: number = 100;
    constructor(
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        folded?: boolean,
        foldedEmbedding?: number[][],
        foldAnimDelay?: number,
        foldAnimDuration?: number,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
        name: string = "point cloud"
    ) {
        super(name, "point", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale);
        this._folded = folded;
        if (foldAnimDelay) {
            this._foldDelay = foldAnimDelay;
        }
        if (foldAnimDuration) {
            this._foldAnimFrames = foldAnimDuration;
        }
        if (folded) {
            if (foldedEmbedding) {
                for (let i = 0; i < foldedEmbedding.length; i++) {
                    if (foldedEmbedding[i].length == 2) {
                        foldedEmbedding[i].push(0);
                    }
                    let fv = new Vector3(
                        coordinates[i][0] * this.xScale,
                        coordinates[i][2] * this.zScale,
                        coordinates[i][1] * this.yScale
                    ).subtractFromFloats(
                        foldedEmbedding[i][0] * this.xScale,
                        0,
                        foldedEmbedding[i][1] * this.yScale,
                    );
                    this._foldVectors.push(fv);
                    this._foldVectorFract.push(fv.divide(new Vector3(this._foldAnimFrames, this._foldAnimFrames, this._foldAnimFrames)));
                }
                this._foldedEmbedding = foldedEmbedding;
            } else {
                foldedEmbedding = JSON.parse(JSON.stringify(coordinates));
                for (let i = 0; i < foldedEmbedding.length; i++) {
                    foldedEmbedding[i][2] = 0;
                    let fv = new Vector3(
                        coordinates[i][0] * this.xScale,
                        coordinates[i][2] * this.zScale,
                        coordinates[i][1] * this.yScale
                    ).subtractFromFloats(
                        foldedEmbedding[i][0] * this.xScale,
                        0,
                        foldedEmbedding[i][1] * this.yScale
                    );
                    this._foldVectors.push(fv);
                    this._foldVectorFract.push(fv.divide(new Vector3(this._foldAnimFrames, this._foldAnimFrames, this._foldAnimFrames)));
                }
                this._foldedEmbedding = foldedEmbedding;
            }
        }
        this._createPointCloud();
    }
    /**
     * Positions spheres according to coordinates in a SPS
     */
    private _createPointCloud(): void {
        // prototype cell
        let customMesh = new Mesh("custom", this._scene);
        // Set arrays for positions and indices
        let positions = [];
        let colors = [];
        if (this._folded) {
            for (let p = 0; p < this._coords.length; p++) {
                positions.push(
                    this._foldedEmbedding[p][0] * this.xScale,
                    this._foldedEmbedding[p][2] * this.zScale,
                    this._foldedEmbedding[p][1] * this.yScale
                );
                let col = Color4.FromHexString(this._coordColors[p]);
                colors.push(col.r, col.g, col.b, col.a);
            }
        } else {
            for (let p = 0; p < this._coords.length; p++) {
                positions.push(
                    this._coords[p][0] * this.xScale,
                    this._coords[p][2] * this.zScale,
                    this._coords[p][1] * this.yScale
                );
                let col = Color4.FromHexString(this._coordColors[p]);
                colors.push(col.r, col.g, col.b, col.a);
            }
        }
        var vertexData = new VertexData();
        // Assign positions
        vertexData.positions = positions;
        vertexData.colors = colors;
        // Apply vertexData to custom mesh
        vertexData.applyToMesh(customMesh, true);
        var mat = new StandardMaterial("mat", this._scene);
        mat.emissiveColor = new Color3(1, 1, 1);
        mat.disableLighting = true;
        mat.pointsCloud = true;
        mat.pointSize = this._size;
        customMesh.material = mat;
        this.mesh = customMesh;
        Object.defineProperty(this, "alpha", {
            set(newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    }

    resetAnimation(): void {
        this._folded = true;
        let positionFunction = function (positions: FloatArray) {
            let numberOfVertices = positions.length / 3;
            for (let i = 0; i < numberOfVertices; i++) {
                positions[i * 3] = this._foldedEmbedding[i][0] * this.xScale;
                positions[i * 3 + 1] = this._foldedEmbedding[i][2] * this.zScale;
                positions[i * 3 + 2] = this._foldedEmbedding[i][1] * this.yScale;
            }
        }
        this.mesh.updateMeshPositions(positionFunction.bind(this), true);
        this.mesh.refreshBoundingInfo();
        this._foldCounter = 0;
        this._animDirection = 1;
    }

    setLooping(looping: boolean): void {
        this._looping = looping;
        this.resetAnimation();
    }

    update(): boolean {
        if (this.mesh && this._folded) {
            if (this._foldCounter < this._foldDelay) {
                this._foldCounter += 1;
            } else if (this._foldCounter < this._foldAnimFrames + this._foldDelay) {
                let positionFunction = function (this: PointCloud, positions: FloatArray) {
                    let numberOfVertices = positions.length / 3;
                    for (let i = 0; i < numberOfVertices; i++) {
                        let posVector = new Vector3(
                            positions[i * 3],
                            positions[i * 3 + 1],
                            positions[i * 3 + 2]
                        );
                        let vectorFractDir = this._foldVectorFract[i].multiplyByFloats(
                            this._animDirection,
                            this._animDirection,
                            this._animDirection
                        )
                        posVector = posVector.addInPlace(vectorFractDir);
                        positions[i * 3] = posVector.x;
                        positions[i * 3 + 1] = posVector.y;
                        positions[i * 3 + 2] = posVector.z;
                    }
                }
                this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                this._foldCounter += 1;
            } else {
                if (this._looping) {
                    this._foldCounter = 0;
                    this._animDirection *= -1;
                } else {
                    this._folded = false;
                    let positionFunction = function (positions: FloatArray) {
                        let numberOfVertices = positions.length / 3;
                        for (let i = 0; i < numberOfVertices; i++) {
                            positions[i * 3] = this._coords[i][0] * this.xScale;
                            positions[i * 3 + 1] = this._coords[i][2] * this.zScale;
                            positions[i * 3 + 2] = this._coords[i][1] * this.yScale;
                        }
                    }
                    this.mesh.updateMeshPositions(positionFunction.bind(this), true);
                }
                this.mesh.refreshBoundingInfo();
            }
        }
        return this._folded;
    }
}
