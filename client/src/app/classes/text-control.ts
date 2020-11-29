export class TextControl {
    private height: number = 0;
    private width: number = 0;
    private sizeFont: number = 0;
    private textPreview: string[] = [];
    private textLine: string[] = [];
    // private textStack:string[]=[];
    private indexLine: number = 0;
    private indexLastLine: number = 0;
    private nbOfLettersInLine: number = 0;
    private ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D, sizeFont: number, height?: number, width?: number /*text?: string*/) {
        if (height !== undefined) this.setHeight(height);
        if (width !== undefined) this.setWidth(width);
        this.setSizeFont(sizeFont);
        this.ctx = ctx;
    }

    clearText(): void {
        this.textPreview = [];
        this.textLine = [];
    }
    setCtx(ctx: CanvasRenderingContext2D): void {
        this.ctx = ctx;
    }
    setHeight(height: number): void {
        this.height = Math.abs(height);
    }
    setWidth(width: number): void {
        this.width = Math.abs(width);
    }
    setSizeFont(sizeFont: number): void {
        this.sizeFont = Math.abs(sizeFont);
    }
    textFont(font: string): void {
        this.ctx.font = font;
    }
    addLetter(letter: string): void {
        if (this.nbOfLettersInLine && this.indexLine && this.indexLastLine) {
            console.log(this.textLine);
        }
        this.textLine.push(letter);
        this.nbOfLettersInLine++;
    }
    // this.checkWidthText(this.ctx,this.tmpLineText(this.textLine,letter))
    arrowTop(): void {
        console.log(this.textLine);
    }
    arrowBottom(): void {
        console.log(this.textLine);
    }

    arrowLeft(): void {
        console.log(this.textLine);
    }

    arrowRight(): void {
        console.log(this.textLine);
    }

    backspace(): void {
        console.log(this.textLine);
    }

    delete(): void {
        console.log(this.textLine);
    }

    enter(): void {
        this.textPreview.push(this.tmpLineText(this.textLine, ''));
        this.nbOfLettersInLine = 0;
        this.textLine = [];
        this.indexLine++;
        this.indexLastLine = this.textPreview.length;
    }

    tmpLineText(text: string[], addLetter: string): string {
        let lineText = '';
        text.forEach((letter) => {
            lineText += letter;
        });
        lineText += addLetter;
        return lineText;
    }
    getText(): string[] {
        this.textPreview.push(this.tmpLineText(this.textLine, ''));
        console.log(this.textPreview);
        return this.textPreview;
    }
    // creer une fonction donnant le nombre de lettre dans une ligne

    checkWidthText(ctx: CanvasRenderingContext2D, text: string): boolean {
        return Math.abs(ctx.measureText(text).width) <= Math.abs(this.width);
    }
    checkHeightText(nbLineBreak: number): boolean {
        return (nbLineBreak + 1) * this.sizeFont <= Math.abs(this.height + 1);
    }
}
