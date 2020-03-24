// import { Scene, Mesh, VertexData, StandardMaterial } from "babylonjs";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/meshBuilder";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Plot, LegendData, matrixMax } from "./babyplots";
import chroma from "chroma-js";


export class Surface extends Plot {
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, legendData: LegendData) {
        super(scene, coordinates, colorVar, size, legendData);
        this._createSurface();
    }
    private _createSurface(): void {
        var max = matrixMax(this._coords);
        var surface = new Mesh("surface", this._scene);
        var positions = [];
        var indices = [];
        for (let row = 0; row < this._coords.length; row++) {
            const rowCoords = this._coords[row];
            for (let column = 0; column < rowCoords.length; column++) {
                const coord = rowCoords[column];
                positions.push(column, coord / max * this._size, row);
                if (row < this._coords.length - 1 && column < rowCoords.length - 1) {
                    indices.push(column + row * rowCoords.length, rowCoords.length + row * rowCoords.length + column, column + row * rowCoords.length + 1, column + row * rowCoords.length + 1, rowCoords.length + row * rowCoords.length + column, rowCoords.length + row * rowCoords.length + column + 1);
                }
            }
        }
        var colors = [];
        for (let i = 0; i < this._coordColors.length; i++) {
            const hex = this._coordColors[i];
            let rgba = chroma(hex).rgba();
            colors.push(rgba[0] / 255, rgba[1] / 255, rgba[2] / 255, rgba[3]);
        }
        var normals = [];
        var vertexData = new VertexData();
        VertexData.ComputeNormals(positions, indices, normals);
        vertexData.positions = positions;
        vertexData.indices = indices;
        vertexData.colors = colors;
        vertexData.normals = normals;
        vertexData.applyToMesh(surface);
        var mat = new StandardMaterial("surfaceMat", this._scene);
        mat.backFaceCulling = false;
        mat.alpha = 1;
        surface.material = mat;
        this.mesh = surface;
        Object.defineProperty(this, "alpha", {
            set(newAlpha) {
                this.mesh.material.alpha = newAlpha;
            }
        });
    }
}
