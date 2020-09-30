import { MouseButton } from '@app/classes/mouse-button';
export class EventOfTest {
    constructor() {}
    public mouseEvent = {
        offsetX: 25,
        offsetY: 10,
        button: MouseButton.Left,
    } as MouseEvent;
    public mouseEvent1 = {
        offsetX: 0,
        offsetY: 0,
        button: MouseButton.Left,
    } as MouseEvent;
    public mouseEvent2 = {
        offsetX: 50,
        offsetY: 50,
        button: MouseButton.Left,
    } as MouseEvent;
    public mouseEvent3 = {
        offsetX: 0,
        offsetY: 10,
        button: MouseButton.Left,
    } as MouseEvent;
    public mouseEventR = {
        offsetX: 0,
        offsetY: 0,
        button: MouseButton.Right,
    } as MouseEvent;
    public backspceEvant = new KeyboardEvent('backspace');
}
