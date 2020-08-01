import { Scene } from "@babylonjs/core/scene";
import { Plot, LegendData } from "./babyplots";
export declare class ImgStack extends Plot {
    private _backgroundColor;
    private _intensityMode;
    private _channelCoords;
    private _channelCoordIntensities;
    constructor(scene: Scene, values: number[], indices: number[], attributes: {
        dim: number[];
    }, legendData: LegendData, size: number, backgroundColor: string, intensityMode: string);
    private _createImgStack;
}
