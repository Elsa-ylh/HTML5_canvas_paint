// to do undo redo

export abstract class AbsUndoRedo {
    // constructor() {}
    // list of data =>contains
    private dataList: AbsUndoRedo[] = [];

    setdataList(dataTab: AbsUndoRedo[]): void {
        this.dataList = dataTab;
    }

    getdataList(): AbsUndoRedo[] {
        return this.dataList;
    }

    // apply element
    reapply(): void {
        //
    }

    // removes element
    deapply(): void {
        //
    }
}
