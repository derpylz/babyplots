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
import { LegendData, Plot } from "../babyplots";
import { Axis, Space, Vector3 } from "@babylonjs/core/Maths/math";

import "@babylonjs/loaders/glTF";
import { FramingBehavior } from "@babylonjs/core/Behaviors/Cameras/framingBehavior";
import { PBRMaterial } from "@babylonjs/core";


export class MeshStream extends Plot {
    private _rootUrl: string;
    private _filenames: string[] = [];
    private _prevTime: number = performance.now();
    private _containers: AssetContainer[] = [];
    private _camera: ArcRotateCamera;
    private _rotation: number[];
    private _offset: number[];
    private _clearCoat: boolean;
    private _clearCoatIntensity: number;

    frameIndex: number = 0;
    frameTotal: number;
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
        rotation: number[] = [],
        offset: number[] = [],
        clearCoat: boolean = false,
        clearCoatIntensity: number = 1,
        name: string = "mesh stream"
    ) {
        super(name, "meshStream", scene, legendData, xScale, yScale, zScale);
        this._camera = camera;
        this._rootUrl = rootUrl;
        this.frameDelay = frameDelay;
        this._rotation = rotation;
        this._offset = offset;
        this._clearCoat = clearCoat;
        this._clearCoatIntensity = clearCoatIntensity;
        for (let iter = fileIteratorStart; iter <= fileIteratorEnd; iter++) {
            this._filenames.push(filePrefix + iter.toString() + fileSuffix);
        }
        this.frameTotal = this._filenames.length;
        this._createMeshStream();
    }

    async _createMeshStream(): Promise<void> {
        // load meshes one by one, store them and display them as they come in

        let loadingContainers: Promise<AssetContainer>[] = [];
        // load containers
        for (let idx = 0; idx < this._filenames.length; idx++) {
            const filename = this._filenames[idx];
            // start loading container
            loadingContainers.push(this._loadMesh(filename));
        }
        const firstScene = await loadingContainers[0];
        firstScene.addAllToScene();
        this._containers.push(firstScene)
        // position camera
        this.worldextends = this._scene.getWorldExtends();
        let mm = this.worldextends.min.add(this.worldextends.max);
        let midpoint = mm.multiply(new Vector3(0.5, 0.5, 0.5));
        this._camera.target = midpoint.addInPlaceFromFloats(
            this._offset[0], this._offset[1], this._offset[2]
        );
        this._camera.alpha = 0;
        this._camera.beta = 1;
        this._camera.useFramingBehavior = true;
        let framingBehavior = this._camera.getBehaviorByName("Framing") as FramingBehavior;
        framingBehavior.framingTime = 0;
        framingBehavior.elevationReturnTime = -1;
        this._camera.lowerRadiusLimit = 0;
        framingBehavior.zoomOnBoundingInfo(this.worldextends.min, this.worldextends.max);
        this._containers = this._containers.concat(await Promise.all(loadingContainers));
        this.allLoaded = true;
        this.frameIndex = 0;
        firstScene.removeAllFromScene();
    }

    async _loadMesh(filename: string): Promise<AssetContainer> {
        let container = SceneLoader.LoadAssetContainerAsync(
            this._rootUrl, filename, this._scene
        ).then(container => {
            if (this._rotation.length === 3) {
                let rootMesh = container.meshes[0];
                rootMesh.rotationQuaternion = null;
                rootMesh.rotate(Axis.X, this._rotation[0], Space.LOCAL);
                rootMesh.rotate(Axis.Y, this._rotation[1], Space.LOCAL);
                rootMesh.rotate(Axis.Z, this._rotation[2], Space.LOCAL);
            }
            // if (this._offset.length === 3) {
            //     let rootMesh = container.meshes[0];
            //     rootMesh.position = new Vector3(
            //         this._offset[0],
            //         this._offset[1],
            //         this._offset[2]
            //     );
            // }
            if (this._clearCoat) {
                let materials = container.materials;
                materials.forEach((mat, _) => {
                    (mat as PBRMaterial).clearCoat.isEnabled = true;
                    (mat as PBRMaterial).clearCoat.intensity = this._clearCoatIntensity;
                });
            }
            this.frameIndex++;
            return container;
        });
        return container;
    }

    goToFrame(n: number): void {
        if (this.allLoaded && n >= 0 && n < this.frameTotal) {
            for (let fi = 0; fi < this._containers.length; fi++) {
                this._containers[fi].removeAllFromScene();
            }
            this._containers[n].addAllToScene();
            this.frameIndex = n + 1;
            if (this.frameIndex === this._containers.length) {
                this.frameIndex = 0;
            }
        }
    }

    update(): boolean {
        if (this.allLoaded) {
            let timeNow = performance.now();
            if (timeNow - this._prevTime > this.frameDelay) {
                this._prevTime = timeNow;
                if (this.frameIndex === 0) {
                    this._containers[this._containers.length - 1].removeAllFromScene();
                } else {
                    this._containers[this.frameIndex - 1].removeAllFromScene();
                }
                this._containers[this.frameIndex].addAllToScene();
                if (this.frameIndex === this._containers.length - 1) {
                    this.frameIndex = 0;
                } else {
                    this.frameIndex++;
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
