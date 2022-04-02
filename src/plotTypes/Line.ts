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
import { LegendData } from "../utils/LegendData";
import { CoordinatePlot } from "../utils/Plot";
import { AnnotationManager } from "../utils/Label";
import { LinesBuilder } from "@babylonjs/core/Meshes/Builders/linesBuilder";

export class Line extends CoordinatePlot {
    labels: string[];
    labelSize: number;
    labelColor: string;

    private _hasAnimation: boolean;
    private _looping: boolean = false;
    private _animDirection: number = 1;
    private _animationCounter: number = 0;
    private _animationFrames: number = 200;
    private _animationDelay: number = 100;
    private _framesPerSegment: number;
    private _segmentVectors: Vector3[] = [];
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
        labelSize?: number,
        labelColor?: string,
        annotationManager?: AnnotationManager
    ) {
        super(name, "line", scene, coordinates, colorVar, size, legendData, xScale, yScale, zScale);
        this._hasAnimation = hasAnimation;
        this._animationDelay = this._animationDelay ?? animationDelay;
        this._animationFrames = this._animationFrames ?? animationDuration;
        if (labels && labels.length === coordinates.length && annotationManager) {
            this.labels = labels;
            this.labelSize = labelSize;
            this.labelColor = labelColor;
            this._addLabels(annotationManager);
        }

        if (this._hasAnimation) {
            this._framesPerSegment = Math.ceil(this._animationFrames / (this._coords.length - 1));
            this._animationFrames = this._framesPerSegment * (this._coords.length - 1);
            for (let iSegment = 0; iSegment < this._coords.length - 1; iSegment++) {
                const segmentStart = this._coords[iSegment];
                const segmentEnd = this._coords[iSegment + 1];
                let fv = new Vector3(
                    segmentEnd[0] * this.xScale,
                    segmentEnd[1] * this.yScale,
                    segmentEnd[2] * this.zScale
                ).subtractFromFloats(
                    segmentStart[0] * this.xScale,
                    segmentStart[1] * this.yScale,
                    segmentStart[2] * this.zScale
                )
                this._segmentVectors.push(
                    fv.divide(
                        new Vector3(
                            this._framesPerSegment,
                            this._framesPerSegment,
                            this._framesPerSegment
                        )
                    )
                );
            }
        }

        this._createLine();
        this.allLoaded = true;
    }
    /**
     * Positions spheres according to coordinates in a SPS
     */
    private _createLine(): void {
        let lineCoords: Vector3[] = [];
        let lineColors: Color4[] = [];

        if (this._hasAnimation) {
            lineCoords[0] = new Vector3(
                this._coords[0][0] * this.xScale,
                this._coords[0][1] * this.yScale,
                this._coords[0][2] * this.zScale
            );
            lineCoords[1] = lineCoords[0].add(this._segmentVectors[0]);
            lineColors.push(
                Color4.FromHexString(this._coordColors[0]),
                Color4.FromHexString(this._coordColors[1])
            );
        } else {
            for (let i = 0; i < this._coords.length; i++) {
                const point = this._coords[i];
                lineCoords.push(new Vector3(
                    point[0] * this.xScale,
                    point[1] * this.yScale,
                    point[2] * this.zScale
                ));
                const pointColor = this._coordColors[i];
                lineColors.push(Color4.FromHexString(pointColor));
            }
        }
        let lines = LinesBuilder.CreateLines(
            "lines",
            { points: lineCoords, colors: lineColors }
        )

        this.mesh = lines;
    }

    private _addLabels(annotationManager: AnnotationManager): void {
        for (let i = 0; i < this.labels.length; i++) {
            let col = this.labelColor;
            if (this.labelColor === "match") {
                col = this._coordColors[i];
            }
            annotationManager.addLabel(this.labels[i], this._coords[i], col, this.labelSize, this);
        }
        annotationManager.fixLabels();
    }

    resetAnimation(): void {
        this._hasAnimation = true;
        this.mesh.dispose();
        let lineCoords: Vector3[] = [];
        let lineColors: Color4[] = [];

        lineCoords[0] = new Vector3(
            this._coords[0][0] * this.xScale,
            this._coords[0][1] * this.yScale,
            this._coords[0][2] * this.zScale
        );
        lineCoords[1] = lineCoords[0].add(this._segmentVectors[0]);

        lineColors.push(
            Color4.FromHexString(this._coordColors[0]),
            Color4.FromHexString(this._coordColors[1])
        );

        let lines = LinesBuilder.CreateLines(
            "lines",
            { points: lineCoords, colors: lineColors }
        )

        this.mesh = lines;
        this._animationCounter = 0;
    }

    setLooping(looping: boolean): void {
        this._looping = looping;
        this.resetAnimation();
    }

    update(): boolean {

        if (this.mesh && this._hasAnimation) {
            if (this._animationCounter < this._animationDelay) {
                this._animationCounter += 1;
                return this._hasAnimation;
            }
            if (this._animationCounter < this._animationFrames + this._animationDelay) {
                let animFrame = this._animationCounter - this._animationDelay;
                let currSegment = Math.floor(animFrame / this._framesPerSegment);
                let lineCoords: Vector3[] = [];
                let lineColors: Color4[] = [];
                lineCoords[0] = new Vector3(
                    this._coords[0][0] * this.xScale,
                    this._coords[0][1] * this.yScale,
                    this._coords[0][2] * this.zScale
                );
                lineColors[0] = Color4.FromHexString(this._coordColors[0]);
                for (let i = 0; i < currSegment; i++) {
                    lineCoords.push(new Vector3(
                        this._coords[i + 1][0] * this.xScale,
                        this._coords[i + 1][1] * this.yScale,
                        this._coords[i + 1][2] * this.zScale
                    ));
                    lineColors.push(Color4.FromHexString(this._coordColors[i + 1]));
                }
                let progressOnSegment = animFrame % this._framesPerSegment;
                lineCoords.push(
                    lineCoords[currSegment].add(
                        this._segmentVectors[currSegment].multiplyByFloats(
                            progressOnSegment,
                            progressOnSegment,
                            progressOnSegment
                        )
                    )
                );
                lineColors.push(Color4.FromHexString(this._coordColors[currSegment + 1]));

                this.mesh.dispose();
                let lines = LinesBuilder.CreateLines(
                    "lines",
                    { points: lineCoords, colors: lineColors }
                )
                this.mesh = lines;
                this._animationCounter += 1;
            } else {
                if (this._looping) {
                    this._animationCounter = 0;
                } else {
                    this._hasAnimation = false;

                    let lineCoords: Vector3[] = [];
                    let lineColors: Color4[] = [];

                    for (let i = 0; i < this._coords.length; i++) {
                        const point = this._coords[i];
                        lineCoords.push(new Vector3(
                            point[0] * this.xScale,
                            point[1] * this.yScale,
                            point[2] * this.zScale
                        ));
                        const pointColor = this._coordColors[i];
                        lineColors.push(Color4.FromHexString(pointColor));
                    }
                    let lines = LinesBuilder.CreateLines(
                        "lines",
                        { points: lineCoords, colors: lineColors }
                    )

                    this.mesh.dispose();
                    this.mesh = lines;
                }
            }
        }

        return this._hasAnimation;
    }
}