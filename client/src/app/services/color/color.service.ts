import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

export enum GradientStyle {
    rainbow,
    squarePalette,
}

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: string;
    secondaryColor: string;

    testMethod(): void {
        console.log("it's working");
    }

    // https://malcoded.com/posts/angular-color-picker/
    // I copied the gradient made at that position
    private rainbowGradient(gradient: CanvasGradient): void {
        // fractions make more sense to do seperation between colors
        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(1 / 6, 'rgba(255, 255, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(2 / 6, 'rgba(0, 255, 0, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(3 / 6, 'rgba(0, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(4 / 6, 'rgba(0, 0, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(5 / 6, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
    }

    // Copyright all reserved to the respective author. Our work has been highly inspired by him and there is
    // is some form of paraphrasing and recoding to make it adapted to our use cases.
    // https://malcoded.com/posts/angular-color-picker/
    // Drawing a rainbow-gradient
    drawPalette(ctx: CanvasRenderingContext2D, dimension: Vec2, style: GradientStyle): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        let gradient;

        switch (style) {
            case GradientStyle.rainbow:
            default:
                gradient = ctx.createLinearGradient(0, 0, dimension.x, 0);
                this.rainbowGradient(gradient); // choose which gradient
                break;
        }

        ctx.beginPath();
        ctx.rect(0, 0, dimension.x, dimension.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
    }

    drawDot(ctx: CanvasRenderingContext2D, dimension: Vec2, event: MouseEvent): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        ctx.strokeStyle = '#000';
        ctx.fillStyle = '#FFF';
        debugger;
        ctx.fillRect(event.offsetX / 1.5, event.offsetY / 1.333, 10, 10);
    }

    // Ce code est complètement inspiré sans gêne de
    // https://malcoded.com/posts/angular-color-picker/#detecting-mouse-events-on-the-color-slider
    getColor(position: Vec2, ctx: CanvasRenderingContext2D): void {
        // const rgb = ctx.getImageData(position.x, position.y, 1, 1).data as Uint8ClampedArray;
        // rgb[0];
        // return { red: rgb};
    }

    swapColor(): void {
        const temp = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
    }
}
