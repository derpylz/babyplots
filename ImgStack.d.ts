import { Scene } from "babylonjs";
import { Plot, LegendData } from "./babyplots";
export declare class ImgStack extends Plot {
    private _channels;
    constructor(scene: Scene, values: number[], indices: number[], attributes: {
        dim: number[];
    }, legendData: LegendData, size: number);
    private _createImgStack;
}
