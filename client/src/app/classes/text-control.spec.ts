// import { inject, TestBed } from '@angular/core/testing';
import { canvasTestHelper } from '@app/classes/canvas-test-helper';
import { TextControl } from './text-control';

// tslint:disable:no-magic-numbers
// tslint:disable:no-any
// tslint:disable:no-string-literal


fdescribe('TextControl', () => {
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let textControl: TextControl;
    beforeEach(() => {
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub.canvas.width = 100;
        previewCtxStub.canvas.height = 100;
        textControl = new TextControl(previewCtxStub);

        });

    it('should create an instance', () => {
        expect(new TextControl(previewCtxStub)).toBeTruthy();
    });

    it('should setWidth 50', () => {
        textControl.setWidth(50);
        expect(textControl['width']).toEqual(50);
    });

    it('should setCtx previewCtx', () => {
        textControl.setCtx(previewCtxStub);
        expect(textControl['ctx']).toEqual(previewCtxStub);
    });

    it('getFont should return Times New Roman', () => {
        const font = '20px "Times New Roman"';
        baseCtxStub.font= font;
        textControl.setCtx(baseCtxStub);
        expect(textControl.getFont()).toEqual(font);
    });

    it('getText should return text', () => {
        let text : string = "test";
        textControl.addLetter(text);
        expect(textControl.getText()).toEqual(text);
    });
    it('getTextWithCursor should return text', () => {
        const textTest = 'test';
        textControl['nbOfLettersInLine']=50;
        for (let index = 0; index < textTest.length; index++) {
            textControl['textLine'][index] = textTest[index];
        }
        const text= textControl.getTextWithCursor();
        console.log(text);
        console.log (textControl[`textPreview`]);
        expect(text).toEqual(textTest+"|");
    });

    it('checkWidthText should return false if text size < width ', () => {
        const textOnCanvas = 'test';
        const width = 10;
        expect(textControl.checkWidthText(baseCtxStub, textOnCanvas, width)).toEqual(false);
    });

    it('checkWidthText should return true if text size < width ', () => {
        const textOnCanvas = 'test';
        const width = 150;
        expect(textControl.checkWidthText(baseCtxStub, textOnCanvas, width)).toEqual(true);
    });

    it('checkHeightText should return true', () => {
        const nbLine = 3;
        const sizeFont = 20;
        const height = 150;
        expect(textControl.checkHeightText(nbLine, sizeFont, height)).toEqual(true);
    });

    it('checkHeightText should return false', () => {
      const nbLine = 3;
      const sizeFont = 20;
      const height = 10;
      expect(textControl.checkHeightText(nbLine, sizeFont, height)).toEqual(false);
  });
  it('should nbLetterInLineSpy',()=>{
     textControl['width'] = 20;
    const textOnCanvas = 'test';
    textControl.checkWidthText(previewCtxStub, textOnCanvas, textControl['width']);
     spyOn<any>(textControl, 'nbLetterInLine').and.callThrough();
    expect(textControl['nbLetterInLine'](previewCtxStub, textOnCanvas)).toEqual(false);

  })
  it('should nbLetterInLineSpy equal true',()=>{
    textControl['width'] = 20;
   const textOnCanvas = 'test               ';
   textControl.checkWidthText(previewCtxStub, textOnCanvas, textControl['width']);
    spyOn<any>(textControl, 'nbLetterInLine').and.callThrough();
   expect(textControl['nbLetterInLine'](previewCtxStub, textOnCanvas)).toEqual(true);

 })

});
