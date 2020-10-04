import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { Color3, Vector3 } from "@babylonjs/core/Maths/math";
import { BoxBuilder } from "@babylonjs/core/Meshes/Builders/boxBuilder";
import { PlaneBuilder } from "@babylonjs/core/Meshes/Builders/planeBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Plot, LegendData, matrixMax } from "./babyplots";

export class HeatMap extends Plot {
    scaleColumn: number;
    scaleRow: number;
    constructor(scene: Scene, coordinates: number[][], colorVar: string[], size: number, scaleColumn: number, scaleRow: number, legendData: LegendData) {
        super(scene, coordinates, colorVar, size, legendData);
        this.scaleColumn = scaleColumn;
        this.scaleRow = scaleRow;
        this._createHeatMap();
    }
    private _createHeatMap(): void {
        let max = matrixMax(this._coords);
        let boxes = [];
        for (let row = 0; row < this._coords.length; row++) {
            const rowCoords = this._coords[row];
            for (let column = 0; column < rowCoords.length; column++) {
                const coord = rowCoords[column];
                if (coord > 0) {
                    let height = coord / max * this._size;
                    let box = BoxBuilder.CreateBox("box_" + row + "-" + column, {
                        height: height,
                        width: this.scaleColumn,
                        depth: this.scaleRow
                    }, this._scene);
                    box.position = new Vector3(
                        row * this.scaleColumn + 0.5 * this.scaleColumn,
                        height / 2,
                        column * this.scaleRow + 0.5 * this.scaleRow
                    );
                    let mat = new StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = Color3.FromHexString(this._coordColors[column + row * rowCoords.length].substring(0, 7));
                    box.material = mat;
                    boxes.push(box);
                }
                else {
                    let box = PlaneBuilder.CreatePlane("box_" + row + "-" + column, { width: this.scaleColumn, height: this.scaleRow }, this._scene);
                    box.position = new Vector3(
                        row * this.scaleColumn + 0.5 * this.scaleColumn,
                        0,
                        column * this.scaleRow + 0.5 * this.scaleRow
                    );
                    box.rotation.x = Math.PI / 2;
                    let mat = new StandardMaterial("box_" + row + "-" + column + "_color", this._scene);
                    mat.alpha = 1;
                    mat.diffuseColor = Color3.FromHexString(this._coordColors[column + row * rowCoords.length].substring(0, 7));
                    mat.backFaceCulling = false;
                    box.material = mat;
                    boxes.push(box);
                }
            }
        }
        this.meshes = boxes;
        Object.defineProperty(this, "alpha", {
            set(newAlpha) {
                for (let i = 0; i < this.meshes.length; i++) {
                    const box = this.meshes[i] as Mesh;
                    box.material.alpha = newAlpha;
                }
            }
        });
    }
}
