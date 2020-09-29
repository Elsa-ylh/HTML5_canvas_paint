import { Component, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSliderChange } from '@angular/material/slider';
import { DomSanitizer } from '@angular/platform-browser';
import { cursorName } from '@app/classes/cursor-name';
import { ToolUsed } from '@app/classes/tool';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { RectangleService } from '@app/services/tools/rectangle.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    // We need this alias for the enum so ngSwitchCase look way better than just numbers.
    // I can't stand reading numbers anymore.
    // tslint:disable-next-line: typedef
    toolUsed = ToolUsed;

    showAttributes: boolean;
    isDialogOpen: boolean = false;
    lineWidth: number;
    pxSize: number;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;

    private isPencilChecked: boolean = false;
    private isEraserChecked: boolean = false;
    private isBrushChecked: boolean = false;
    private isLineChecked: boolean = false;
    private isRectangleChecked: boolean = false;
    private isEllipseChecked: boolean = false;
    private isColorChecked: boolean = false;

    constructor(
        public drawingService: DrawingService,
        private dialogCreator: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public toolService: ToolService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
        public brushService: BrushService,
        public eraserService: EraserService,
        public colorService: ColorService,
    ) {
        this.showAttributes = true;
        this.toolService.switchTool(ToolUsed.Color); // default tool on the sidebar
        this.iconRegistry.addSvgIcon('eraser', this.sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.newDrawingRef = this.dialogCreator.open(DialogCreateNewDrawingComponent);
            this.newDrawingRef.afterClosed().subscribe(() => {
                this.isDialogOpen = false;
            });
        }
    }

    createNewDrawing(): void {
        this.dialogCreator.open(DialogCreateNewDrawingComponent);
    }

    openUserGuide(): void {
        this.checkDocumentationRef = this.dialogCreator.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
    }

    pickPencil(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Pencil);
    }

    // the following get are used to make sure the display of sidebar tools are
    // are properly pressed on
    get pencilChecked(): boolean {
        return this.isPencilChecked;
    }

    pickEraser(): void {
        this.drawingService.cursorUsed = cursorName.eraser;
        this.toolService.switchTool(ToolUsed.Eraser);
    }

    get eraserChecked(): boolean {
        return this.isEraserChecked;
    }

    pickBrush(subTool: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Brush);
        if (this.drawingService.baseCtx.lineWidth < this.brushService.pixelMinBrush) {
            this.drawingService.baseCtx.lineWidth = this.drawingService.previewCtx.lineWidth = this.pxSize = this.brushService.pixelMinBrush;
        } else this.pxSize = this.drawingService.previewCtx.lineWidth = this.drawingService.baseCtx.lineWidth;
        this.toolService.currentTool.subToolSelect = subTool;
    }

    get brushChecked(): boolean {
        return this.isBrushChecked;
    }

    pickLine(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Line);
    }

    get lineChecked(): boolean {
        return this.isLineChecked;
    }

    pickRectangle(subTool: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Rectangle);
        this.toolService.currentTool.subToolSelect = subTool;
    }

    get rectangleChecked(): boolean {
        return this.isRectangleChecked;
    }

    pickEllipse(subTool2: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Ellipse);
        this.toolService.currentTool.subToolSelect = subTool2;
    }

    get ellipseChecked(): boolean {
        return this.isEllipseChecked;
    }

    pickColor(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Color);
    }

    get colorChecked(): boolean {
        return this.isColorChecked;
    }

    sliderSliding(args: MatSliderChange): void {
        if (args.value) {
            this.drawingService.baseCtx.lineWidth = args.value;
            this.drawingService.previewCtx.lineWidth = args.value;
        }
    }

    resetCheckedButton(): void {
        this.isPencilChecked = false;
        this.isEraserChecked = false;
        this.isBrushChecked = false;
        this.isLineChecked = false;
        this.isRectangleChecked = false;
        this.isEllipseChecked = false;
        this.isColorChecked = false;
    }

    // keybind control o for new drawing
    @HostListener('window:keydown.control.o', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (!this.isDialogOpen && !this.drawingService.isCanvasBlank()) {
            event.preventDefault();
            this.clearCanvas();
            this.isDialogOpen = true;
        }
    }

    @HostListener('window:keydown.1', ['$event']) onKeyDown1(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isRectangleChecked = true;
            this.pickRectangle(1);
        }
    }

    @HostListener('window:keydown.2', ['$event']) onKeyDown2(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isEllipseChecked = true;
            this.pickEllipse(1);
        }
    }

    @HostListener('window:keydown.e', ['$event'])
    changeEraserMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isEraserChecked = true;
            this.pickEraser();
        }
    }

    @HostListener('window:keydown.c', ['$event'])
    changePencilMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isPencilChecked = true;
            this.pickPencil();
        }
    }
    @HostListener('window:keydown.w', ['$event'])
    changeBrushMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isBrushChecked = true;
            this.pickBrush(1);
        }
    }
}
