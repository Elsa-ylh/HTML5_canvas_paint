export class TextControl {
    private width: number = 0;
    private textPreview: string[] = [];
    private textLine: string[] = [];
    private textStack: string[] = [];
    private indexLine: number = 0;
    private indexLastLine: number = 0;
    private indexOfLettersInLine: number = 0;
    private nbOfLettersInLine: number = 0;
    private ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D, width?: number /*text?: string*/) {
        // if (height !== undefined) this.setHeight(height);
        if (width !== undefined) this.setWidth(width);
        //this.setSizeFont(sizeFont);
        this.ctx = ctx;
    }

    clearText(): void {
        this.width = 0;
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
    setWidth(width: number): void {
        this.width = Math.abs(width);
    }
    textFont(font: string): void {
        this.ctx.font = font;
    }
    addLetter(letter: string): void {
        // tslint:disable:prefer-for-of
        for (let index = 0; index < letter.length; index++) {
            this.textLine.push(letter[index]);
            this.indexOfLettersInLine++;
        }
    }
    getFont(): string {
        return this.ctx.font;
    }
    arrowTop(): void {
        if (this.indexLine >= 1) {
            if (!this.nbOfLettersInLine) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine--;
                this.setCursorPos();
            }
            if (this.nbOfLettersInLine && this.nbOfLettersInLine > this.textLine.length) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine--;
                const textLine = this.textPreview[this.indexLine];
                if (this.checkWidthText(this.ctx, textLine, this.width)) {
                    this.setCursorPos();
                } else {
                    const nbLine = Math.trunc(this.textPreview[this.indexLine].length / this.nbOfLettersInLine);
                    if (nbLine * this.nbOfLettersInLine + this.indexLastLine > this.textPreview[this.indexLine].length) {
                        this.indexLastLine = this.textPreview[this.indexLine].length;
                    } else {
                        this.indexLastLine = nbLine * this.nbOfLettersInLine + this.indexLastLine;
                    }
                    this.setCursorPos();
                }
            }
        }
        console.log(this.nbOfLettersInLine);
        if (this.nbOfLettersInLine && this.nbOfLettersInLine < this.textLine.length) {
            this.indexOfLettersInLine -= this.nbOfLettersInLine;
            this.setCursorPos();
        }
    }

    arrowBottom(): void {
        if (this.indexLine < this.indexLastLine) {
            if (!this.nbOfLettersInLine) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine++;
                this.setCursorPos();
            }
            if (this.nbOfLettersInLine && this.nbOfLettersInLine > this.textStack.length) {
                this.textPreview[this.indexLine] = this.tmpLineText(this.textLine, '') + this.tmpLineTextStack();
                this.indexLine++;
                this.setCursorPos();
            }
        }
        console.log(this.nbOfLettersInLine);
        if (this.nbOfLettersInLine && this.nbOfLettersInLine < this.textStack.length) {
            this.indexOfLettersInLine += this.nbOfLettersInLine;
            this.setCursorPos();
        }
    }

    private setCursorPos(): void {
        const textLine: string = this.textPreview[this.indexLine];
        this.textLine = [];
        this.textStack = [];
        for (let index = 0; index < textLine.length; index++) {
            const element = textLine[index];
            if (this.indexOfLettersInLine >= index) {
                this.textLine.push(element);
            }
        }
        for (let index = textLine.length - 1; index > this.indexOfLettersInLine; index--) {
            this.textStack.push(textLine[index]);
        }
        console.log(this.indexOfLettersInLine);
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
                tmpText = this.endLineReturn(tmpText, element, this.nbOfLettersInLine);
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
                tmpText = this.endLineReturn(tmpText, element, this.nbOfLettersInLine);
            } else {
                tmpText.push(element);
            }
        });
        return tmpText;
    }
    private endLineReturn(text: string[], line: string, nbOfLettersInLine: number): string[] {
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

    // number of letters in a single line
    private nbLetterInLine(ctx: CanvasRenderingContext2D, text: string): boolean {
        let check = false;
        let mtp = '';
        // tslint:disable:prefer-for-of
        for (let index = 0; index < text.length; index++) {
            mtp += text[index];
            if (!this.checkWidthText(ctx, mtp, this.width) && !check) {
                check = true;
                this.nbOfLettersInLine = index;
                return check;
            }
        }
        return false;
    }

    //Check if text size < preview rectangle width (line return)
    checkWidthText(ctx: CanvasRenderingContext2D, text: string, width: number): boolean {
        return Math.abs(ctx.measureText(text).width) <= Math.abs(width);
    }

    //Check if text size < preview rectangle height (do not show text in the opposite case)
    checkHeightText(nbLineBreak: number, sizeFont: number, height: number): boolean {
        return (nbLineBreak + 1) * sizeFont <= Math.abs(height + 1);
    }
}
