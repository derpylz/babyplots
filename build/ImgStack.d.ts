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
export declare class ImgStack extends Plot {
    private _backgroundColor;
    private _intensityMode;
    private _channelCoords;
    private _channelCoordIntensities;
    constructor(scene: Scene, values: number[], indices: number[], attributes: {
        dim: number[];
    }, legendData: LegendData, size: number, backgroundColor: string, intensityMode: string, xScale?: number, yScale?: number, zScale?: number);
    private _createImgStack;
}
