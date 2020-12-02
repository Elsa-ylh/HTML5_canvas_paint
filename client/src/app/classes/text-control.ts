export class TextControl {
    private height: number = 0;
    private width: number = 0;
    private sizeFont: number = 0;
    private textPreview: string[] = [];
    private textLine: string[] = [];
    private textStack: string[] = [];
    private indexLine: number = 0;
    private indexLastLine: number = 0;
    private indexOfLettersInLine: number = 0;
    private nbOfLettersInLine: number = 0;
    private ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D, sizeFont: number, height?: number, width?: number /*text?: string*/) {
        if (height !== undefined) this.setHeight(height);
        if (width !== undefined) this.setWidth(width);
        this.setSizeFont(sizeFont);
        this.ctx = ctx;
    }

    clearText(): void {
        this.height = 0;
        this.width = 0;
        this.sizeFont = 0;
        this.indexLine = 0;
        this.indexLastLine = 0;
        this.indexOfLettersInLine = 0;
        this.nbOfLettersInLine = 0;
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
        this.textLine.push(letter);
        this.indexOfLettersInLine++;
    }

    arrowTop(): void {
        if (this.indexLine >= 1) {
            if (!this.nbOfLettersInLine) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine--;
            }
            if (this.nbOfLettersInLine && this.nbOfLettersInLine > this.textLine.length) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine--;
            }
        }
        if (this.nbOfLettersInLine && this.nbOfLettersInLine < this.textLine.length) {
            console.log(this.indexLine);
        }
    }
    arrowBottom(): void {
        if (this.indexLine < this.indexLastLine) {
            if (!this.nbOfLettersInLine) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine--;
            }
            if (this.nbOfLettersInLine && this.nbOfLettersInLine > this.textStack.length) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine--;
            }
        }
        if (this.nbOfLettersInLine && this.nbOfLettersInLine < this.textStack.length) {
            console.log(this.indexLine);
        }
    }

    arrowLeft(): void {
        this.indexOfLettersInLine--;
        if (this.textLine.length >= 0) {
            const letter: string | undefined = this.textLine.pop();
            if (letter !== undefined) {
                this.textStack.push(letter);
            }
        }
        if (this.indexOfLettersInLine < 0 && this.indexLine >= 1) {
            this.getText();
            this.textLine = [];
            this.textStack = [];
            this.indexLine--;
            const lineText: string = this.textPreview[this.indexLine];
            this.indexOfLettersInLine = lineText.length;
            for (let index = 0; index <= this.indexOfLettersInLine - 1; index++) {
                this.textLine.push(lineText[index]);
            }
        }
        console.log(this.indexOfLettersInLine);
    }

    arrowRight(): void {
        let checkArrowRight = true;
        if (this.textStack.length >= 0) {
            const letter: string | undefined = this.textStack.pop();
            if (letter !== undefined) {
                this.textLine.push(letter);
                this.indexOfLettersInLine++;
                checkArrowRight = false;
            }
        }
        if (checkArrowRight && this.textStack.length === 0 && this.indexLine < this.indexLastLine) {
            this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '');
            this.textLine = [];
            this.textStack = [];
            this.indexOfLettersInLine = 0;
            this.indexLine++;
            const lineText = this.textPreview[this.indexLine];
            for (let index = lineText.length - 1; index >= 0; index--) {
                this.textStack.push(lineText[index]);
            }
        }
        console.log(this.indexOfLettersInLine);
    }

    backspace(): void {
        this.indexOfLettersInLine--;
        if (this.indexOfLettersInLine >= 0) {
            this.textLine.pop();
        }
        if (this.indexOfLettersInLine < 0 && this.indexLine >= 1) {
            this.textPreview[this.indexLine] = '';
            for (let index = this.indexLine; index < this.indexLastLine; index++) {
                this.textPreview[index] = this.textPreview[index + 1];
            }
            this.indexLastLine--;
            this.textPreview.pop();
            this.indexLine--;
            this.textLine = [];
            const textLine = this.textPreview[this.indexLine];
            for (let index = 0; index < textLine.length; index++) {
                this.textLine[index] = textLine[index];
            }
            this.indexOfLettersInLine = this.textLine.length;
        }
    }

    delete(): void {
        if (this.textStack.length) {
            this.textStack.pop();
        }
        if (!this.textStack.length && this.indexLine < this.indexLastLine) {
            const textLine = this.textPreview[this.indexLine + 1];
            for (let index = this.indexLine + 1; index < this.indexLastLine; index++) {
                this.textPreview[index] = this.textPreview[index + 1];
            }
            this.textPreview.pop();
            this.indexLastLine--;
            // tslint:disable:prefer-for-of
            for (let index = 0; index < textLine.length; index++) {
                this.textStack.push(textLine[index]);
            }
        }
    }

    enter(): void {
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '');
        for (let index = this.textPreview.length - 1; index > this.indexLine; index--) {
            this.textPreview[index + 1] = this.textPreview[index];
        }
        this.indexOfLettersInLine = 0;
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
        let tmpText: string[] = [];
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
        this.textPreview.forEach((element) => {
            if (this.nbLetterInLine(this.ctx, element)) {
                tmpText = this.divisePourUneLine(tmpText, element, this.nbOfLettersInLine);
            } else {
                tmpText.push(element);
            }
        });
        return tmpText;
    }

    getTextWithCursor(): string[] {
        let tmpText: string[] = [];
        this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + '|' + this.tmpLineTextStack();
        this.textPreview.forEach((element) => {
            if (this.nbLetterInLine(this.ctx, element)) {
                tmpText = this.divisePourUneLine(tmpText, element, this.nbOfLettersInLine);
            } else {
                tmpText.push(element);
            }
        });
        return tmpText;
    }
    private divisePourUneLine(text: string[], line: string, nbOfLettersInLine: number): string[] {
        let oneLine = '';
        // tslint:disable:prefer-for-of
        for (let index = 0; index < line.length; index++) {
            const element = line[index];
            if (oneLine.length + 1 >= nbOfLettersInLine) {
                oneLine += element;
                text.push(oneLine);
                oneLine = '';
            } else {
                oneLine += element;
            }
        }
        text.push(oneLine);
        return text;
    }

    // creer une fonction donnant le nombre de lettre dans une ligne
    private nbLetterInLine(ctx: CanvasRenderingContext2D, text: string): boolean {
        let check = false;
        let mtp = '';
        for (let index = 0; index < text.length; index++) {
            mtp += text[index];
            if (!this.checkWidthText(ctx, mtp) && !check) {
                check = true;
                this.nbOfLettersInLine = index;
                return check;
            }
        }
        return false;
    }

    checkWidthText(ctx: CanvasRenderingContext2D, text: string): boolean {
        return Math.abs(ctx.measureText(text).width) <= Math.abs(this.width);
    }
    checkHeightText(nbLineBreak: number): boolean {
        return (nbLineBreak + 1) * this.sizeFont <= Math.abs(this.height + 1);
    }
}
