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
import { LegendData, CoordinatePlot } from "../babyplots";

export class PointCloud extends CoordinatePlot {
    private _pointPicking: boolean = false;
    private _selectionCallback = function (selection: number[]) { return false; };
    private _hasAnimation: boolean;
    private _looping: boolean = false;
    private _animDirection: number = 1;
    private _animationTargets: number[][];
    private _animationVectors: Vector3[] = [];
    private _animationCounter: number = 0;
    private _animationFrames: number = 200;
    private _animationVectorFract: Vector3[] = [];
    private _animationDelay: number = 100;
    constructor(
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        hasAnimation?: boolean,
        animationTargets?: number[][],
        animationDelay?: number,
        animationDuration?: number,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
        name: string = "point cloud"
    ) {
        super(name, "point", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale);
        this._hasAnimation = hasAnimation;
        if (animationDelay) {
            this._animationDelay = animationDelay;
        }
        if (animationDuration) {
            this._animationFrames = animationDuration;
        }
        if (hasAnimation) {
            if (animationTargets) {
                for (let i = 0; i < animationTargets.length; i++) {
                    if (animationTargets[i].length == 2) {
                        animationTargets[i].push(0);
                    }
                    let fv = new Vector3(
                        coordinates[i][0] * this.xScale,
                        coordinates[i][2] * this.zScale,
                        coordinates[i][1] * this.yScale
                    ).subtractFromFloats(
                        animationTargets[i][0] * this.xScale,
                        0,
                        animationTargets[i][1] * this.yScale,
                    );
                    this._animationVectors.push(fv);
                    this._animationVectorFract.push(fv.divide(new Vector3(this._animationFrames, this._animationFrames, this._animationFrames)));
                }
                this._animationTargets = animationTargets;
            } else {
                animationTargets = JSON.parse(JSON.stringify(coordinates));
                for (let i = 0; i < animationTargets.length; i++) {
                    animationTargets[i][2] = 0;
                    let fv = new Vector3(
                        coordinates[i][0] * this.xScale,
                        coordinates[i][2] * this.zScale,
                        coordinates[i][1] * this.yScale
                    ).subtractFromFloats(
                        animationTargets[i][0] * this.xScale,
                        0,
                        animationTargets[i][1] * this.yScale
                    );
                    this._animationVectors.push(fv);
                    this._animationVectorFract.push(fv.divide(new Vector3(this._animationFrames, this._animationFrames, this._animationFrames)));
                }
                this._animationTargets = animationTargets;
            }
        }
        this._createPointCloud();
        this.allLoaded = true;
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
        if (this._hasAnimation) {
            for (let p = 0; p < this._coords.length; p++) {
                positions.push(
                    this._animationTargets[p][0] * this.xScale,
                    this._animationTargets[p][2] * this.zScale,
                    this._animationTargets[p][1] * this.yScale
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
        this._hasAnimation = true;
        let positionFunction = function (this: PointCloud, positions: FloatArray) {
            let numberOfVertices = positions.length / 3;
            for (let i = 0; i < numberOfVertices; i++) {
                positions[i * 3] = this._animationTargets[i][0] * this.xScale;
                positions[i * 3 + 1] = this._animationTargets[i][2] * this.zScale;
                positions[i * 3 + 2] = this._animationTargets[i][1] * this.yScale;
            }
        }
        this.mesh.updateMeshPositions(positionFunction.bind(this), true);
        this.mesh.refreshBoundingInfo();
        this._animationCounter = 0;
        this._animDirection = 1;
    }

    setLooping(looping: boolean): void {
        this._looping = looping;
        this.resetAnimation();
    }

    update(): boolean {
        if (this.mesh && this._hasAnimation) {
            if (this._animationCounter < this._animationDelay) {
                this._animationCounter += 1;
            } else if (this._animationCounter < this._animationFrames + this._animationDelay) {
                let positionFunction = function (this: PointCloud, positions: FloatArray) {
                    let numberOfVertices = positions.length / 3;
                    for (let i = 0; i < numberOfVertices; i++) {
                        let posVector = new Vector3(
                            positions[i * 3],
                            positions[i * 3 + 1],
                            positions[i * 3 + 2]
                        );
                        let vectorFractDir = this._animationVectorFract[i].multiplyByFloats(
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
                this._animationCounter += 1;
            } else {
                if (this._looping) {
                    this._animationCounter = 0;
                    this._animDirection *= -1;
                } else {
                    this._hasAnimation = false;
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
        return this._hasAnimation;
    }
}
