import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { DialogCreateNewDrawingComponent } from '@app/components/dialog-create-new-drawing/dialog-create-new-drawing.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SwitchToolService } from '@app/services/switchTool-service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
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

    // keybind control o for new drawing
    @HostListener('window:keydown', ['$event']) onKeyDown(o: KeyboardEvent): void {
        o.preventDefault();
        if (o.ctrlKey && o.code === 'KeyO') {
            this.clearCanvas();
        }
    }
}
