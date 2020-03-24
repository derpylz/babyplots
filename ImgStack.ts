// import { Scene, Mesh, VertexData, StandardMaterial, Color3 } from "babylonjs";
import { Scene } from "@babylonjs/core/scene";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import "@babylonjs/core/Meshes/meshBuilder";
import { Color3 } from "@babylonjs/core/Maths/math";
import { VertexData } from "@babylonjs/core/Meshes/mesh.vertexData";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Plot, LegendData } from "./babyplots";

export class ImgStack extends Plot {
    private _channels: number[];
    constructor(scene: Scene, values: number[], indices: number[], attributes: { dim: number[] }, legendData: LegendData, size: number) {
        let point_channel = [];
        let colSize = attributes.dim[0];
        let rowSize = attributes.dim[1];
        let channels = attributes.dim[2];
        let slices = attributes.dim[3];
        let channelSize = colSize * rowSize;
        let sliceSize = channelSize * channels;
        let coords = [];
        let colorVar = [];
        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            let slice = Math.floor(index / sliceSize);
            let sliceIndex = index - sliceSize * slice;
            let channel = Math.floor(sliceIndex / channelSize);
            let channelIndex = sliceIndex - channelSize * channel;
            let row = Math.floor(channelIndex / colSize);
            let col = channelIndex % colSize;
            coords.push([col, row, slice * size]);
            colorVar.push(values[i]);
            point_channel.push(channel);
        }
        super(scene, coords, colorVar, 1, legendData);
        this._channels = point_channel;
        this._createImgStack();
    }

    private _createImgStack(): void {
        let customMesh = new Mesh("custom", this._scene);
        let positions = [];
        let colors = [];
        for (let p = 0; p < this._coords.length; p++) {
            positions.push(this._coords[p][2], this._coords[p][0], this._coords[p][1]);
            if (this._channels[p] == 0) {
                colors.push(1, 0, 0, this._coordColors[p]);
            } else if (this._channels[p] == 1) {
                colors.push(0, 1, 0, this._coordColors[p]);
            } else {
                colors.push(0, 0, 1, this._coordColors[p]);
            }
        }
        let vertexData = new VertexData();
        vertexData.positions = positions;
        vertexData.colors = colors;
        vertexData.applyToMesh(customMesh, true);
        let mat = new StandardMaterial("mat", this._scene);
        mat.emissiveColor = new Color3(1, 1, 1);
        mat.disableLighting = true;
        mat.pointsCloud = true;
        mat.pointSize = this._size;
        customMesh.material = mat;
        this.mesh = customMesh;
    }
}