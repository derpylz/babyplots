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
import { Plot, LegendData } from "./babyplots";
export declare class PointCloud extends Plot {
    private _pointPicking;
    private _selectionCallback;
    private _folded;
    private _foldedEmbedding;
    private _foldVectors;
    private _foldCounter;
    private _foldAnimFrames;
    private _foldVectorFract;
    private _foldDelay;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData, folded?: boolean, foldedEmbedding?: number[][], foldAnimDelay?: number, foldAnimDuration?: number, xScale?: number, yScale?: number, zScale?: number);
    /**
     * Positions spheres according to coordinates in a SPS
     */
    private _createPointCloud;
    resetAnimation(): void;
    update(): boolean;
}
