import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SprayChange } from '@app/classes/sprayChange';
import { SprayWarningComponent } from '@app/components/spray-warning/spray-warning.component';
import { SprayService } from '@app/services/tools/spray.service';

@Component({
    selector: 'app-spray',
    templateUrl: './spray.component.html',
    styleUrls: ['./spray.component.scss'],
})
export class SprayComponent {
    constructor(public errorMsg: MatDialog, public sprayService: SprayService) {}

    message: MatDialogRef<SprayWarningComponent>;

    sendInput(sprayChange: SprayChange): void {
        if (!sprayChange.zoneDiameter && !sprayChange.dropDiameter && sprayChange.nbEmission > 0 && sprayChange.nbEmission < 100) {
            this.sprayService.setDensity(sprayChange.nbEmission);
        } else {
            this.message = this.errorMsg.open(SprayWarningComponent, {
                width: '300',
            });
        }
    }
}
