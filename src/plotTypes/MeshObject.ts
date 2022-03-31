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



import { Axis, Space, Vector3 } from "@babylonjs/core/Maths/math";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";

import { LegendData } from "../utils/LegendData";
import { Plot } from "../utils/Plot";

import "@babylonjs/loaders/glTF";

export class MeshObject extends Plot {


    worldextends: { min: Vector3; max: Vector3}

    constructor(
        scene: Scene,
        meshString: string,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
        scaling: number[] = [],
        rotation: number[] = [],
        offset: number[] = [],
        name: string = "mesh object"
    ) {
        super(name, "meshObject", scene, legendData, xScale, yScale, zScale);
        SceneLoader.ImportMesh("", "", "data:" + meshString, scene, (meshes, _, __) => {
            let rootMesh = meshes[0]
            if (scaling.length === 3) {
                rootMesh.scaling = new Vector3(
                    scaling[0],
                    scaling[1],
                    scaling[2]
                );
            }
            if (rotation.length === 3) {
                rootMesh.rotationQuaternion = null;
                rootMesh.rotate(Axis.X, rotation[0], Space.LOCAL);
                rootMesh.rotate(Axis.Y, rotation[1], Space.LOCAL);
                rootMesh.rotate(Axis.Z, rotation[2], Space.LOCAL);
            }
            if (offset.length === 3) {
                meshes[0].position = new Vector3(
                    offset[0],
                    offset[1],
                    offset[2]
                );
            }
        });
    }
}