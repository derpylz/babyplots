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
import { Vector3, Color4 } from "@babylonjs/core/Maths/math";
import { LegendData, CoordinatePlot } from "../babyplots";
import { AnnotationManager } from "../utils/Label";
import { LinesBuilder } from "@babylonjs/core/Meshes/Builders/linesBuilder";

export class Line extends CoordinatePlot {
    labels:string[]

    private _hasAnimation: boolean;
    private _looping: boolean = false;
    private _animDirection: number = 1;
    private _animationFrames: number = 200;
    private _animationDelay: number = 100;
    constructor(
        scene: Scene,
        coordinates: number[][],
        colorVar: string[],
        size: number,
        legendData: LegendData,
        hasAnimation?: boolean,
        animationDelay?: number,
        animationDuration?: number,
        xScale: number = 1,
        yScale: number = 1,
        zScale: number = 1,
        name: string = "line",
        labels?: string[],
        annotationManager?: AnnotationManager
    ) {
        super(name, "line", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale);
        this._hasAnimation = hasAnimation;
        if (labels && labels.length === coordinates.length && annotationManager) {
            this.labels = labels;
            this._addLabels(annotationManager);
        }
        this._createLine();
        this.allLoaded = true;
    }
    /**
     * Positions spheres according to coordinates in a SPS
     */
    private _createLine(): void {
        let lineCoords: Vector3[] = [];
        for (let i = 0; i < this._coords.length; i++) {
            const point = this._coords[i];
            lineCoords.push(new Vector3(point[0], point[1], point[2]));
        }
        let lineColors: Color4[] = [];
        for (let i = 0; i < this._coordColors.length; i++) {
            const pointColor = this._coordColors[i];
            lineColors.push(Color4.FromHexString(pointColor));
        }
        let lines = LinesBuilder.CreateLines(
            "lines",
            {points: lineCoords, colors: lineColors}
        )

        this.mesh = lines;
    }

    private _addLabels(annotationManager: AnnotationManager): void {
        for (let i = 0; i < this.labels.length; i++) {
            annotationManager.addLabel(this.labels[i], this._coords[i]);
        }
        annotationManager.fixLabels();
    }
}