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

import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { AssetContainer } from "@babylonjs/core/assetContainer";
import { Scene } from "@babylonjs/core/scene";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { LegendData, Plot } from "./babyplots";
import { Axis, Color3, Space, Vector3 } from "@babylonjs/core/Maths/math";

import "@babylonjs/loaders/glTF";
import { FramingBehavior } from "@babylonjs/core/Behaviors/Cameras/framingBehavior";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";


export class MeshStream extends Plot {
    private _rootUrl: string;
    private _filenames: string[] = [];
    private _allLoaded: boolean = false;
    private _frameIndex: number = 0;
    private _prevTime: number = performance.now();
    private _containers: AssetContainer[] = [];
    private _camera: ArcRotateCamera;

    frameDelay: number;
    worldextends: { min: Vector3; max: Vector3; };

    constructor(
        scene: Scene,
        camera: ArcRotateCamera,
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
        this._camera = camera;
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
        let loadingContainers: Promise<AssetContainer>[] = [];
        let t0 = performance.now();
        loadingContainers.push(this._loadMesh(this._filenames[0]));

        // load subsequent containers
        for (let idx = 1; idx < this._filenames.length; idx++) {
            const filename = this._filenames[idx];
            // start loading container
            loadingContainers.push(this._loadMesh(filename));
            // wait until previous mesh is loaded
            const prevContainer = await loadingContainers[loadingContainers.length - 2];
            const remTime = this.frameDelay - (performance.now() - t0);
            if (remTime > 0) {
                await _sleep(remTime);
            }
            this._containers.push(prevContainer);
            if (idx > 1) {
                // remove the meshes before the previous frame from the scene
                this._containers[this._containers.length - 2].removeAllFromScene();
            }
            // add the previous meshes to the scene
            prevContainer.addAllToScene();
            t0 = performance.now();
            if (idx === 1) {
                this.worldextends = this._scene.getWorldExtends();
                this._camera.useFramingBehavior = true;
                let framingBehavior = this._camera.getBehaviorByName("Framing") as FramingBehavior;
                framingBehavior.framingTime = 0;
                framingBehavior.elevationReturnTime = -1;
                this._camera.lowerRadiusLimit = 0;
                framingBehavior.zoomOnBoundingInfo(this.worldextends.min, this.worldextends.max);
            }
        }
        const prevContainer = await loadingContainers[this._filenames.length - 2];
        const lastContainer = await loadingContainers[this._filenames.length - 1];
        this._containers.push(lastContainer);
        prevContainer.removeAllFromScene();
        lastContainer.addAllToScene();
        this._allLoaded = true;
        this._frameIndex = 0;
    }

    async _loadMesh(filename: string): Promise<AssetContainer> {
        let container = await SceneLoader.LoadAssetContainerAsync(
            this._rootUrl, filename, this._scene
        ).then(container => {
            let rootMesh = container.meshes[0];
            rootMesh.rotationQuaternion = null;
            rootMesh.rotate(Axis.X, Math.PI / 2, Space.LOCAL);
            return container;
        });
        return container;
    }

    update(): boolean {
        if (this._allLoaded) {
            let timeNow = performance.now();
            if (timeNow - this._prevTime > this.frameDelay) {
                this._prevTime = timeNow;
                if (this._frameIndex === 0) {
                    this._containers[this._containers.length - 1].removeAllFromScene();
                } else {
                    this._containers[this._frameIndex - 1].removeAllFromScene();
                }
                this._containers[this._frameIndex].addAllToScene();
                if (this._frameIndex === this._containers.length - 1) {
                    this._frameIndex = 0;
                } else {
                    this._frameIndex++;
                }
            }
            // go through the loaded meshes sequentially, then reset.
        }
        return true;
    }
}

function _sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
