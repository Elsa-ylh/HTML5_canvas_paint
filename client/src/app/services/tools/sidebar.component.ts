import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSliderChange } from '@angular/material/slider/public-api';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ServiceTool, SwitchToolService } from '@app/services/switchTool-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    sliderSize = false;
    pxSize = 4;
    constructor(
        private switchToolServ: SwitchToolService,
        private drawingService: DrawingService,
        private dialogNewDrawing: MatDialog,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {}
    ngOnInit(): void {
        this.iconRegistry.addSvgIcon('eraser', this.sanitizer.bypassSecurityTrustResourceUrl('assets/clarity_eraser-solid.svg'));
    }
    SetPencil = () => this.switchToolServ.switchTool(0);
    SetEraser = () => this.switchToolServ.switchTool(1);
    clearCanvas(): void {
        if (!this.drawingService.isCanvasBlank()) {
            this.dialogNewDrawing.open(DialogCreateNewDrawingComponent);
        }
    }

    createNewDrawing(): void {
        this.dialogNewDrawing.open(DialogCreateNewDrawingComponent);
    }
    public sliderSliding(args: MatSliderChange): void {
        console.log(args.value);
        if (args.value) {
            this.drawingService.baseCtx.lineWidth = args.value;
            this.drawingService.previewCtx.lineWidth = args.value;
        }
    }

    // keybind control o for new drawing
    @HostListener('window:keydown', ['$event']) onKeyDown(o: KeyboardEvent): void {
        o.preventDefault();
        if (o.ctrlKey && o.code === 'KeyO') {
            this.clearCanvas();
        }
    }

    naturalBrushTool() {
        this.switchToolServ.switchTool(ServiceTool.brushServie);
        this.sliderSize = true;
        this.drawingService.baseCtx.lineWidth = this.pxSize;
        this.drawingService.previewCtx.lineWidth = this.pxSize;
    }
}
