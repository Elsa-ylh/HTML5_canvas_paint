import { SubToolselected } from '@app/classes/sub-tool-selected';

export interface ToolGeneralInfo {
    primaryColor: string;
    secondaryColor: string;
    lineWidth: number;
    shiftPressed: boolean;
    selectSubTool: SubToolselected;
    canvasSelected: boolean;
}
