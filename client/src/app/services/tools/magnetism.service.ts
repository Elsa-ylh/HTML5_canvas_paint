import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { GridService } from './grid.service';

@Injectable({
    providedIn: 'root',
})
export class MagnetismService {
    private horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    private verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(private gridService: GridService, private snackBar: MatSnackBar) {}

    activateMagnetism(): void {
        // const gridInfo: ImageData = this.gridService.getGridData();
        this.snackBar.open("Vous avez besoin d'activer la grille avec le bouton «grille» et peser sur «m» pour activer le magnétisme.", 'ok', {
            duration: 10000,
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
        });
    }
}
