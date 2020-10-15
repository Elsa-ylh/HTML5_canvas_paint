// to do undo redo

export abstract class AbsUndoRedo {
    constructor() {}

    // apply element
    public reapply(): void {}

    // removes element
    public deapply(): void {}
}
