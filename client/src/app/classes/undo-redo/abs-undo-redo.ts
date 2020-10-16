// to do undo redo

export abstract class AbsUndoRedo {
    constructor() {}
    // list of data +> contains 
    private dataList: AbsUndoRedo[] = [];

    public setdataList(dataTab: AbsUndoRedo[]): void {
        this.dataList = dataTab;
    }

    public getdataList(): AbsUndoRedo[] {
        return this.dataList;
    }

    // apply element
    public reapply(): void {}

    // removes element
    public deapply(): void {}
}
