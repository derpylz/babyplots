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
import "@babylonjs/core/Meshes/thinInstanceMesh";
import { Plot, LegendData } from "./babyplots";
export declare class ShapeCloud extends Plot {
    private _shading;
    shape: string;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], shape: string, shading: boolean, size: number, legendData: LegendData, xScale?: number, yScale?: number, zScale?: number);
    /**
     * Creates shapes at coordinates
     */
    private _createShapeCloud;
}
