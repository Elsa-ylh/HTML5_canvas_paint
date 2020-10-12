import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatListModule } from '@angular/material/list';
import { WriteTextDialogUserGuideComponent } from './write-text-dialog-user-guide.component';

describe('WriteTextDialogUserGuideComponent', () => {
    let component: WriteTextDialogUserGuideComponent;
    let fixture: ComponentFixture<WriteTextDialogUserGuideComponent>;

    const txtDiversListSelection = 'Divers';
    const txtDrawListSelection = 'Dessiner';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [WriteTextDialogUserGuideComponent],
            imports: [MatButtonToggleModule, MatListModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WriteTextDialogUserGuideComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Is a change for with the user guide list of the various section with something bad', () => {
        component.diversListSelection();
        const hasboolSelecteur = component.testDataGuide(txtDrawListSelection);
        expect(hasboolSelecteur).toEqual(false);
    });
    it('Is a change for with the User Guide list from the various section', () => {
        component.diversListSelection();
        const hasboolSelecteur = component.testDataGuide(txtDiversListSelection);
        expect(hasboolSelecteur).toEqual(true);
    });
    it('Est un changement pour avec la liste du guide utilisateur de la section pinceau avec quelque chose de mauvais', () => {
        component.drawListSelection();
        const hasboolSelecteur = component.testDataGuide(txtDiversListSelection);
        expect(hasboolSelecteur).toEqual(false);
    });
    it('Is a change for with the user guide list of the brush section', () => {
        component.drawListSelection();
        const hasboolSelecteur = component.testDataGuide(txtDrawListSelection);
        expect(hasboolSelecteur).toEqual(true);
    });
});
