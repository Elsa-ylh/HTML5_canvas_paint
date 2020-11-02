import { Component, HostListener } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { cursorName } from '@app/classes/cursor-name';
import { SubToolselected } from '@app/classes/sub-tool-selected';
import { ToolUsed } from '@app/classes/tool';
import { CarrouselPictureComponent } from '@app/components/carrousel-picture/carrousel-picture.component';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DialogExportDrawingComponent } from '@app/components/dialog-export-locally/dialog-export-locally.component';
import { WriteTextDialogUserGuideComponent } from '@app/components/write-text-dialog-user-guide/write-text-dialog-user-guide.component';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolService } from '@app/services/tool-service';
import { BrushService } from '@app/services/tools/brush.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser-service';
import { LineService } from '@app/services/tools/line.service';
import { PencilService } from '@app/services/tools/pencil-service';
import { PolygonService } from '@app/services/tools/polygon.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SelectionEllipseService } from '@app/services/tools/selection-service/selection-ellipse.service';
import { SelectionRectangleService } from '@app/services/tools/selection-service/selection-rectangle.service';
// import { SelectionService } from '@app/services/tools/selection-service/selection-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    // This file is longer than 350 lines because of all the hostlistener, but we have no over choice than to put them in this componant
    // tslint:disable:max-file-line-count
    // We need this alias for the enum so ngSwitchCase look way better than just numbers.
    // I can't stand reading numbers anymore.
    // tslint:disable-next-line: typedef
    toolUsed = ToolUsed;

    isDialogOpen: boolean = false;
    lineWidth: number;
    newDrawingRef: MatDialogRef<DialogCreateNewDrawingComponent>;
    checkDocumentationRef: MatDialogRef<WriteTextDialogUserGuideComponent>;
    newCarrouselRef: MatDialogRef<CarrouselPictureComponent>;
    private isPencilChecked: boolean = false;
    private isEraserChecked: boolean = false;
    private isBrushChecked: boolean = false;
    private isLineChecked: boolean = false;
    private isRectangleChecked: boolean = false;
    private isEllipseChecked: boolean = false;
    private isColorChecked: boolean = false;
    private isDropperChecked: boolean = false;
    // private isSelectionChecked: boolean = false;
    private isSelectionEllipseChecked: boolean = false;
    private isSelectionRectangleChecked: boolean = false;
    private isPolygonChecked: boolean = false;

    constructor(
        public drawingService: DrawingService,
        private dialogCreator: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
        public toolService: ToolService,
        public rectangleService: RectangleService,
        public ellipseService: EllipseService,
        public brushService: BrushService,
        public pencilService: PencilService,
        public eraserService: EraserService,
        public colorService: ColorService,
        public lineService: LineService,
        // public selectionService: SelectionService,
        public polygonService: PolygonService,
        public selectionRectangleService: SelectionRectangleService,
        public selectionEllipseService: SelectionEllipseService,
    ) {
        this.toolService.switchTool(ToolUsed.Color); // default tool on the sidebar
        this.iconRegistry.addSvgIcon('eraser', this.sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
        this.iconRegistry.addSvgIcon('polygon', this.sanitizer.bypassSecurityTrustResourceUrl('assets/polygon.svg'));
    }

    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.newDrawingRef = this.dialogCreator.open(DialogCreateNewDrawingComponent);
            this.newDrawingRef.afterClosed().subscribe(() => {
                this.isDialogOpen = false;
            });
        }
    }

    exportDrawing(): void {
        this.dialogCreator.open(DialogExportDrawingComponent);
    }

    createNewDrawing(): void {
        this.dialogCreator.open(DialogCreateNewDrawingComponent);
    }

    openCarrouse(): void {
        this.newCarrouselRef = this.dialogCreator.open(CarrouselPictureComponent, {
            width: '90%',
            height: '90%',
        });
    }

    openUserGuide(): void {
        this.checkDocumentationRef = this.dialogCreator.open(WriteTextDialogUserGuideComponent, {
            width: '90%',
            height: '100%',
        });
    }

    pickPencil(): void {
        this.drawingService.cursorUsed = cursorName.pencil;
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
        this.toolService.currentTool.subToolSelect = subTool;
        if (this.drawingService.baseCtx.lineWidth < this.brushService.pixelMinBrush) {
            this.drawingService.baseCtx.lineWidth = this.drawingService.previewCtx.lineWidth = this.brushService.pixelMinBrush;
        } else this.drawingService.previewCtx.lineWidth = this.drawingService.baseCtx.lineWidth;
    }

    get brushChecked(): boolean {
        return this.isBrushChecked;
    }

    pickLine(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Line);
        this.toolService.currentTool.subToolSelect = SubToolselected.tool1;
    }

    get lineChecked(): boolean {
        return this.isLineChecked;
    }

    pickRectangle(subTool: SubToolselected): void {
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

    pickPolygon(subTool3: number): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Polygon);
        this.toolService.currentTool.subToolSelect = subTool3;
    }

    get polygonChecked(): boolean {
        return this.isPolygonChecked;
    }

    pickColor(): void {
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.Color);
    }

    get colorChecked(): boolean {
        return this.isColorChecked;
    }

    pickDropper(): void {
        this.drawingService.cursorUsed = 'pointer';
        this.toolService.switchTool(ToolUsed.Dropper);
    }

    get dropperChecked(): boolean {
        return this.isDropperChecked;
    }

    pickSelectionRectangle(): void {
        // debugger;
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.SelectionRectangle);
    }

    get selectionRectangleChecked(): boolean {
        return this.isSelectionRectangleChecked;
    }

    pickSelectionEllipse(): void {
        // debugger;
        this.drawingService.cursorUsed = cursorName.default;
        this.toolService.switchTool(ToolUsed.SelectionEllipse);
    }

    get selectionEllipseChecked(): boolean {
        return this.isSelectionEllipseChecked;
    }

    resetCheckedButton(): void {
        this.isPencilChecked = false;
        this.isEraserChecked = false;
        this.isBrushChecked = false;
        this.isLineChecked = false;
        this.isRectangleChecked = false;
        this.isEllipseChecked = false;
        this.isColorChecked = false;
        this.isDropperChecked = false;
        // this.isSelectionChecked = false;
        this.isSelectionEllipseChecked = false;
        this.isSelectionRectangleChecked = false;
    }

    checkboxChangeToggle(args: MatCheckboxChange): void {
        this.toolService.currentTool.subToolSelect = args.checked ? SubToolselected.tool2 : SubToolselected.tool1;
    }

    // keybind control o for new drawing
    @HostListener('window:keydown.control.o', ['$event']) onKeyDown(event: KeyboardEvent): void {
        if (!this.isDialogOpen && !this.drawingService.isCanvasBlank()) {
            event.preventDefault();
            this.clearCanvas();
            this.isDialogOpen = true;
        }
    }

    @HostListener('window:keydown.1', ['$event']) changeRectnagleMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isRectangleChecked = true;
            this.pickRectangle(1);
        }
    }

    @HostListener('window:keydown.2', ['$event']) changleEllipseMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isEllipseChecked = true;
            this.pickEllipse(SubToolselected.tool1);
        }
    }

    @HostListener('window:keydown.3', ['$event'])
    changePolygonMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isPolygonChecked = true;
            this.pickPolygon(SubToolselected.tool3);
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
            this.pickBrush(SubToolselected.tool1);
        }
    }

    @HostListener('window:keydown.l', ['$event'])
    changeLineMode(event: KeyboardEvent): void {
        if (this.toolService.currentToolName !== ToolUsed.Color) {
            this.resetCheckedButton();
            this.isLineChecked = true;
            this.pickLine();
        }
    }

    @HostListener('window:keydown.i', ['$event'])
    changeDropperMode(event: KeyboardEvent): void {
        this.resetCheckedButton();
        this.isDropperChecked = true;
        this.pickDropper();
    }

    @HostListener('window:keydown.r', ['$event'])
    changeSelectionRectangleMode(event: KeyboardEvent): void {
        this.resetCheckedButton();
        // this.isSelectionChecked = true;
        this.isSelectionRectangleChecked = true;
        this.pickSelectionRectangle();
    }

    @HostListener('window:keydown.s', ['$event']) changeSelectionEllipseMode(event: KeyboardEvent): void {
        this.resetCheckedButton();
        // this.isSelectionChecked = true;
        this.isSelectionEllipseChecked = true;
        this.pickSelectionRectangle();
    }

    @HostListener('window:keydown.control.a', ['$event']) selectAllCanvas(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.selectAll();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.selectAll();
        }
    }

    @HostListener('window:keydown.ArrowLeft', ['$event']) onLeftArrow(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onLeftArrow();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onLeftArrow();
        }
    }

    @HostListener('window:keydown.ArrowRight', ['$event']) onRightArrow(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onRightArrow();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onRightArrow();
        }
    }

    @HostListener('window:keydown.ArrowDown', ['$event']) onDownArrow(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onDownArrow();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onDownArrow();
        }
    }

    @HostListener('window:keydown.ArrowUp', ['$event']) onUpArrow(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onUpArrow();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onUpArrow();
        }
    }
    @HostListener('window:keyup.ArrowLeft', ['$event']) onLeftArrowUp(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onLeftArrowUp();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onLeftArrowUp();
        }
    }

    @HostListener('window:keyup.ArrowRight', ['$event']) onRightArrowUp(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onRightArrowUp();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onRightArrowUp();
        }
    }

    @HostListener('window:keyup.ArrowDown', ['$event']) onDownArrowUp(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onDownArrowUp();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onDownArrowUp();
        }
    }

    @HostListener('window:keyup.ArrowUp', ['$event']) onUpArrowUp(event: KeyboardEvent): void {
        event.preventDefault();
        if (this.toolService.currentToolName === ToolUsed.SelectionRectangle) {
            this.selectionRectangleService.onUpArrowUp();
        } else if (this.toolService.currentToolName === ToolUsed.SelectionEllipse) {
            this.selectionEllipseService.onUpArrowUp();
        }
    }
}
