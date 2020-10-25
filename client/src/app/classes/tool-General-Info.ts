import { SubToolselected } from './sub-tool-selected';

export interface ToolGeneralInfo {
    primaryColor: string;
    secondaryColor: string;
    lineWidth: number;
    shiftPressed: boolean;
    selectSubTool: SubToolselected;
    canvasSelected: boolean;
}
