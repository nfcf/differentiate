import { OnInit, OnChanges, EventEmitter } from '@angular/core';
export declare class DifferentiateComponent implements OnInit, OnChanges {
    leftSide: any;
    rightSide: any;
    allowRevert: boolean;
    attributeOrderIsImportant: boolean;
    onlyShowDifferences: boolean;
    leftSideObject: any;
    rightSideObject: any;
    onrevert: EventEmitter<{}>;
    constructor();
    private generateNodeId;
    private transformNodeToOriginalStructure;
    private transformNodeToInternalStruction;
    private itemInArray;
    private leftItemFromRightItem;
    private compare;
    private reIndex;
    private copyInto;
    private setChildrenStatus;
    private unify;
    private toInternalStruction;
    private filterUnchanged;
    ngOnChanges(changes: any): void;
    ngOnInit(): void;
    private lookupChildOf;
    revert(event: any): void;
    onhover(event: any): void;
}
