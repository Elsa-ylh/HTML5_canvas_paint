// import { SubToolselected } from '@app/classes/sub-tool-selected';
// import { AbsUndoRedo } from '@app/classes/undo-redo/abs-undo-redo';
// import { Vec2 } from '@app/classes/vec2';
// import { DrawingService } from '@app/services/drawing/drawing.service';
// import { TextService } from '@app/services/tools/text.service';

// export class TextAction extends AbsUndoRedo {
//     constructor(
//         private mousePosition: Vec2,
//         private mouseDownCord: Vec2,
//         private primaryColor: string,
//         private sizeFont: number,
//         private fontStyle: string,
//         private textAlign: number,
//         private FontStyleItalic : boolean,
//         private FontStyleBold : boolean,
//         private selectSubTool: SubToolselected,
//         private textService: TextService,
//         private drawingService: DrawingService,
//     ) {
//         super();
//     }

//     apply(): void {

//         this.drawingService.baseCtx.strokeStyle = this.primaryColor;
//         this.drawingService.baseCtx.fillStyle = this.primaryColor;
//         //this.textService
//         this.textService.clearEffectTool();
//     }
// }
