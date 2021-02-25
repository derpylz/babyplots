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

import { AssetContainer } from "@babylonjs/core/assetContainer";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { LegendData, Plot } from "./babyplots";
import { Axis, Space } from "@babylonjs/core/Maths/math";

import "@babylonjs/loaders/glTF";


export class MeshStream extends Plot {
    private _rootUrl: string;
    private _filenames: string[] = [];
    private _allLoaded: boolean = false;
    private _frameIndex: number = 0;
    private _containers: Promise<AssetContainer>[] = [];

    frameDelay: number;

    constructor(
        scene: Scene,
        rootUrl: string,
        filePrefix: string,
        fileSuffix: string,
        fileIteratorStart: number,
        fileIteratorEnd: number,
        legendData: LegendData,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
        frameDelay: number = 200,
        name: string = "mesh stream"
    ) {
        super(name, "meshStream", scene, legendData, xScale, yScale, zScale);
        this._rootUrl = rootUrl;
        this.frameDelay = frameDelay;
        for (let iter = fileIteratorStart; iter <= fileIteratorEnd; iter++) {
            this._filenames.push(filePrefix + iter.toString() + fileSuffix);
        }
        this._createMeshStream();
    }

    async _createMeshStream(): Promise<void> {
        // load meshes one by one, store them and display them as they come in

        // start loading first mesh container
        this._containers.push(this._loadMeshAndWait(this._filenames[0]));

        // load subsequent containers
        for (let idx = 1; idx < this._filenames.length; idx++) {
            const filename = this._filenames[idx];
            // start loading container
            this._containers.push(this._loadMeshAndWait(filename));
            // wait until previous mesh is loaded
            const prevContainer = await this._containers[idx - 1];
            if (idx > 1) {
                // remove the meshes before the previous frame from the scene
                (await this._containers[idx - 2]).removeAllFromScene();
            }
            // add the previous meshes to the scene
            prevContainer.addAllToScene();
            console.log('added containter ' + idx);
        }
        const prevContainer = await this._containers[this._filenames.length - 2];
        const lastContainer = await this._containers[this._filenames.length - 1];
        prevContainer.removeAllFromScene();
        lastContainer.addAllToScene();
        this._allLoaded = true;
    }

    async _loadMeshAndWait(filename: string): Promise<AssetContainer> {
        const ensureDelay = _wait(this.frameDelay);
        let container = await SceneLoader.LoadAssetContainerAsync(
            this._rootUrl, filename, this._scene
        ).then(container => {
            let rootMesh = container.meshes[0];
            rootMesh.rotationQuaternion = null;
            rootMesh.rotate(Axis.X, Math.PI / 2, Space.LOCAL);
            return container;
        });
        await ensureDelay;
        return container;
    }

    update(): boolean {
        if (this._allLoaded) {
            // go through the loaded meshes sequentially, then reset.
        }
        return true;
    }
}

function _wait(delay: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(function () {
            resolve();
        }, delay);
    });
}


