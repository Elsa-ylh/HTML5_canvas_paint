import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';

export interface RGB {
    red: string;
    green: string;
    blue: string;
}

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    constructor() {}
    primaryColor: string;
    secondaryColor: string;

    testMethod(): void {
        console.log("it's working");
    }

    // Copyright all reserved to the respective author. Our work has been highly inspired by him and there is
    // is some form of paraphrasing and recoding to make it adapted to our use cases.
    // https://malcoded.com/posts/angular-color-picker/
    // Drawing a rainbow-gradient
    drawPalette(ctx: CanvasRenderingContext2D, dimension: Vec2): void {
        ctx.clearRect(0, 0, dimension.x, dimension.y);
        const gradient = ctx.createLinearGradient(0, 0, 0, dimension.y);

        gradient.addColorStop(0, 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 0, 0, 1)');

        ctx.beginPath();
        ctx.rect(0, 0, dimension.x, dimension.y);
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.closePath();
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
