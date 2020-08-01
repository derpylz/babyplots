import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Color3 } from "@babylonjs/core/Maths/math";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Plot, LegendData } from "./babyplots";
import chroma from "chroma-js";



export class ImgStack extends Plot {
    private _backgroundColor: string;
    private _intensityMode: string;
    private _channelCoords: number[][][];
    private _channelCoordIntensities: number[][];
    constructor(scene: Scene, values: number[], indices: number[], attributes: { dim: number[] }, legendData: LegendData, size: number, backgroundColor: string, intensityMode: string) {
        let colSize = attributes.dim[0];
        let rowSize = attributes.dim[1];
        let channels = attributes.dim[2];
        let slices = attributes.dim[3];
        let channelSize = colSize * rowSize;
        let sliceSize = channelSize * channels;
        let coords = [];
        let Intensities = [];
        for (let i = 0; i < channels; i++) {
            coords.push([]);
            Intensities.push([]);
        }
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            let slice = Math.floor(index / sliceSize);
            let sliceIndex = index - sliceSize * slice;
            let channel = Math.floor(sliceIndex / channelSize);
            let channelIndex = sliceIndex - channelSize * channel;
            let row = Math.floor(channelIndex / colSize);
            let col = channelIndex % colSize;
            coords[channel].push([col, row, slice * size]);
            Intensities[channel].push(values[i]);
        }
        super(scene, [], [], 1, legendData);
        this._channelCoords = coords;
        this._channelCoordIntensities = Intensities;
        this._backgroundColor = backgroundColor;
        this._intensityMode = intensityMode;
        this.meshes = [];
        this._createImgStack();
    }

    private _createImgStack(): void {
        let positions = [];
        let colors = [];
        for (let c = 0; c < this._channelCoords.length; c++) {
            const channelIntensities = this._channelCoordIntensities[c];
            if (channelIntensities.length === 0) {
                continue;
            }
            const channelCoords = this._channelCoords[c];
            let channelColor: string;
            if (c == 0) {
                channelColor = "#ff0000";
            } else if (c == 1) {
                channelColor = "#00ff00";
            } else {
                channelColor = "#0000ff";
            }
            let channelColorRGB = chroma(channelColor).rgb();
            channelColorRGB[0] = channelColorRGB[0] / 255;
            channelColorRGB[1] = channelColorRGB[1] / 255;
            channelColorRGB[2] = channelColorRGB[2] / 255;
            if (this._intensityMode === "alpha") {
                let alphaLevels = 10;
                let minIntensity = channelIntensities.min();
                let alphaPositions: number[][] = [];
                let alphaColors: number[][] = [];
                let alphaIntensities: number[] = [];
                for (let i = 0; i < alphaLevels; i++) {
                    alphaPositions.push([]);
                    alphaColors.push([]);
                    alphaIntensities.push((i + 1) * (1 / alphaLevels));
                }

                for (let p = 0; p < channelCoords.length; p++) {
                    for (let intens = 0; intens < alphaIntensities.length; intens++) {
                        const testIntensity = alphaIntensities[intens];
                        if ((channelIntensities[p] - minIntensity) / (1 - minIntensity) <= testIntensity) {
                            alphaPositions[intens].push(channelCoords[p][2], channelCoords[p][0], channelCoords[p][1]);
                            alphaColors[intens].push(channelColorRGB[0], channelColorRGB[1], channelColorRGB[2], 1);
                            break;
                        }
                    }
                }

                for (let intensIdx = 0; intensIdx < alphaIntensities.length; intensIdx++) {
                    if (alphaColors[intensIdx].length <= 4) {
                        continue;
                    }
                    let customMesh = new Mesh(`custom-${c}_${intensIdx}`, this._scene);
                    const intensity = alphaIntensities[intensIdx];
                    let vertexData = new VertexData();
                    vertexData.positions = alphaPositions[intensIdx];
                    vertexData.colors = alphaColors[intensIdx];
                    vertexData.applyToMesh(customMesh, true);
                    let mat = new StandardMaterial(`mat-${c}_${intensIdx}`, this._scene);
                    mat.emissiveColor = new Color3(1, 1, 1);
                    mat.disableLighting = true;
                    mat.pointsCloud = true;
                    mat.pointSize = this._size;
                    mat.alpha = intensity;
                    customMesh.material = mat;
                    this.meshes.push(customMesh);
                }

            } else {
                for (let p = 0; p < channelCoords.length; p++) {
                    positions.push(channelCoords[p][2], channelCoords[p][0], channelCoords[p][1]);
                    if (this._intensityMode === "mix") {
                        let colormix = chroma.mix(this._backgroundColor, channelColor, channelIntensities[p]).rgb();
                        colors.push(colormix[0] / 255, colormix[1] / 255, colormix[2] / 255, 1);
                    } else {;
                        colors.push(channelColorRGB[0], channelColorRGB[1], channelColorRGB[2], 1);
                    }
                }
                let customMesh = new Mesh(`custom-${c}`, this._scene);
                let vertexData = new VertexData();
                vertexData.positions = positions;
                vertexData.colors = colors;
                vertexData.applyToMesh(customMesh, true);
                let mat = new StandardMaterial(`mat-${c}`, this._scene);
                mat.emissiveColor = new Color3(1, 1, 1);
                mat.disableLighting = true;
                mat.pointsCloud = true;
                mat.pointSize = this._size;
                customMesh.material = mat;
                this.meshes.push(customMesh);
            }
        }
    }
}