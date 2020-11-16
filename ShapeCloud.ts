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
import "@babylonjs/core/Meshes/thinInstanceMesh";
import { SphereBuilder } from "@babylonjs/core/Meshes/Builders/sphereBuilder";
import { BoxBuilder } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { TorusBuilder } from "@babylonjs/core/Meshes/Builders/torusBuilder";
import { CylinderBuilder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder";
import { Color3, Color4, Matrix } from "@babylonjs/core/Maths/math";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Plot, LegendData } from "./babyplots";

export class ShapeCloud extends Plot {
    private _shape: string;
    private _shading: boolean;
    constructor(
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        shape: string,
        shading: boolean,
        size: number,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1
    ) {
        super(scene, coordinates, colorVar, size * 0.1, legendData, xScale, yScale, zScale);
        this._shape = shape;
        this._shading = shading;
        this._createShapeCloud();
    }
    /**
     * Creates shapes at coordinates
     */
    private _createShapeCloud(): void {
        let instanceCount = this._coords.length;

        let matricesData = new Float32Array(16 * instanceCount);
        let colorData = new Float32Array(4 * instanceCount);

        // set position and color data for shapes
        for (let i = 0; i < instanceCount; i++) {
            let matrix = Matrix.Translation(
                this._coords[i][0] * this.xScale,
                this._coords[i][1] * this.zScale,
                this._coords[i][2] * this.yScale
            );

            matrix.copyToArray(matricesData, i * 16);

            let col = Color4.FromHexString(this._coordColors[i]);

            colorData.set(col.asArray(), i * 4);
        }

        let origMesh: Mesh;

        switch (this._shape) {
            case "box":
                origMesh = BoxBuilder.CreateBox("root", { size: this._size });
                break;
            case "sphere":
                origMesh = SphereBuilder.CreateSphere("root", { diameter: this._size });
                break;
            case "cone":
                origMesh = CylinderBuilder.CreateCylinder("root", { height: this._size, diameterBottom: this._size, diameterTop: 0 }, this._scene);
                break;
            case "torus":
                origMesh = TorusBuilder.CreateTorus("root", { diameter: this._size, thickness: this._size * 0.5 }, this._scene);
                break;
            case "cylinder":
                origMesh = CylinderBuilder.CreateCylinder("root", { height: this._size, diameter: this._size }, this._scene);
                break;
            default:
                origMesh = BoxBuilder.CreateBox("root", { size: 1 });
                break;
        }
        
        origMesh.thinInstanceSetBuffer("matrix", matricesData, 16, true);
        origMesh.thinInstanceSetBuffer("color", colorData, 4, true);

        let mat = new StandardMaterial("shapeMat", this._scene);
        if (!this._shading) {
            mat.disableLighting = true;
            mat.emissiveColor = Color3.White();
        }
        origMesh.material = mat;
        
        this.mesh = origMesh;
        Object.defineProperty(this, "alpha", {
            set(newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    }
}