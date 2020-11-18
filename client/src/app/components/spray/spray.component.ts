import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SprayChange } from '@app/classes/spray-change';
import { SprayWarningComponent } from '@app/components/spray-warning/spray-warning.component';
import { SprayService } from '@app/services/tools/spray.service';

/* tslint:disable:no-empty */

@Component({
    selector: 'app-spray',
    templateUrl: './spray.component.html',
    styleUrls: ['./spray.component.scss'],
})
export class SprayComponent {
    constructor(public errorMsg: MatDialog, public sprayService: SprayService) {}

    message: MatDialogRef<SprayWarningComponent>;
    private minValue: number = 0;
    private maxValue: number = 100;

    sendInput(sprayChange: SprayChange): void {
        if (
            !sprayChange.zoneDiameter &&
            !sprayChange.dropDiameter &&
            sprayChange.nbEmission > this.minValue &&
            sprayChange.nbEmission < this.maxValue
        ) {
            this.sprayService.setDensity(sprayChange.nbEmission);
        } else {
            this.message = this.errorMsg.open(SprayWarningComponent, {
                width: '300',
            });
        }
    }
}
