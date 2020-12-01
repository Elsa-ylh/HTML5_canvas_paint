export class TextControl {
    private height: number = 0;
    private width: number = 0;
    private sizeFont: number = 0;
    private textPreview: string[] = [];
    private textLine: string[] = [];
    private textStack: string[] = [];
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
        this.textStack = [];
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
        if (this.textLine.length > 0 && this.nbOfLettersInLine) {
            const letter: string | undefined = this.textLine.pop();
            if (letter !== undefined) {
                this.textStack.push(letter);
                this.nbOfLettersInLine--;
            }
        }
        if (!this.nbOfLettersInLine && this.indexLine >= 1) {
            this.getText();
            this.textLine = [];
            this.textStack = [];
            this.indexLine--;
            const line: string = this.textPreview[this.indexLine];
            this.nbOfLettersInLine = line.length - 1;
            for (let index = 0; index <= this.nbOfLettersInLine; index++) {
                this.textLine.push(line[index]);
            }
        }
    }

    arrowRight(): void {
        if (this.textStack.length > 0) {
            const letter: string | undefined = this.textStack.pop();
            if (letter !== undefined) {
                this.textLine.push(letter);
                this.nbOfLettersInLine++;
            }
        }
    }

    backspace(): void {
        if (this.nbOfLettersInLine) {
            this.textLine.pop();
            this.nbOfLettersInLine--;
        }
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

    private tmpLineText(text: string[], addLetter: string): string {
        let lineText = '';
        text.forEach((letter) => {
            lineText += letter;
        });
        lineText += addLetter;

        return lineText;
    }
    private tmpLineTextStack(): string {
        let text = '';

        if (this.textStack.length)
            for (let index = this.textStack.length - 1; index >= 0; index--) {
                text += this.textStack[index];
            }
        return text;
    }

    getText(): string[] {
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
        return this.textPreview;
    }

    getTextWithCursor(): string[] {
        let tmpText: string[] = [];
        this.textPreview.forEach((element) => {
            tmpText.push(element);
        });
        tmpText[this.indexLine] = this.tmpLineText(this.textLine, '') + '|' + this.tmpLineTextStack();
        return tmpText;
    }
    // creer une fonction donnant le nombre de lettre dans une ligne

    checkWidthText(ctx: CanvasRenderingContext2D, text: string): boolean {
        return Math.abs(ctx.measureText(text).width) <= Math.abs(this.width);
    }
    checkHeightText(nbLineBreak: number): boolean {
        return (nbLineBreak + 1) * this.sizeFont <= Math.abs(this.height + 1);
    }
}
