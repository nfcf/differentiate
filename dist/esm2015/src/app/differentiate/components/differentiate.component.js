import * as tslib_1 from "tslib";
/*
 * Comparision Tool will layout two comparision trees side by side and feed them an internal object
 * heirarchy created for internal use from JSON objects given to this component.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DifferentiateNodeType, DifferentiateNodeStatus } from '../interfaces/differentiate.interfaces';
let DifferentiateComponent = class DifferentiateComponent {
    constructor() {
        this.allowRevert = false;
        this.allowAdvance = false;
        this.attributeOrderIsImportant = true;
        this.onlyShowDifferences = false;
        this.leftSideToolTip = "take left side";
        this.rightSideToolTip = "take right side";
        this.onrevert = new EventEmitter();
        this.onadvance = new EventEmitter();
        this.ondifference = new EventEmitter();
    }
    set namedRootObject(value) {
        let x = value.replace(" ", "");
        if (x.length) {
            this.categorizeBy = value.split(",");
        }
        else {
            this.categorizeBy = undefined;
        }
    }
    generateNodeId() {
        const min = 1;
        const max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    transformNodeToOriginalStructure(node, parent) {
        let json = {};
        let array = [];
        node.map((item) => {
            if (item.status !== DifferentiateNodeStatus.removed) {
                if (parent === DifferentiateNodeType.json) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.pair) {
                        json[item.name] = item.value;
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        const x = this.transformNodeToOriginalStructure(item.children, item.parent);
                        if (item.name.length) {
                            json[item.name] = x;
                        }
                        else {
                            json = [x];
                        }
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        json[item.name] = this.transformNodeToOriginalStructure(item.children, item.parent);
                    }
                }
                else if (parent === DifferentiateNodeType.array) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        array.push(this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        array.push(this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                }
            }
        });
        return array.length ? array : json;
    }
    transformNodeToInternalStruction(node) {
        let result = node;
        if (node instanceof Array) {
            const children = [];
            const p = DifferentiateNodeType.array;
            node.map((item, i) => {
                const jsonValue = this.transformNodeToInternalStruction(item);
                if (jsonValue instanceof Array) {
                    if (!this.attributeOrderIsImportant) {
                        jsonValue.sort((a, b) => { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map((x, i) => {
                            x.index = i;
                            x.altName = "" + i;
                        });
                    }
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: "",
                        altName: "" + i,
                        value: "",
                        parent: p,
                        type: DifferentiateNodeType.array,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: "",
                        altName: "" + i,
                        value: jsonValue,
                        parent: p,
                        type: DifferentiateNodeType.literal,
                        status: DifferentiateNodeStatus.default,
                        children: []
                    });
                }
            });
            result = children;
        }
        else if (node instanceof Object) {
            const list = Object.keys(node);
            const children = [];
            const p = DifferentiateNodeType.json;
            if (!this.attributeOrderIsImportant) {
                list.sort((a, b) => { return a <= b ? -1 : 1; });
            }
            list.map((item, i) => {
                const jsonValue = this.transformNodeToInternalStruction(node[item]);
                if (jsonValue instanceof Array) {
                    if (!this.attributeOrderIsImportant) {
                        jsonValue.sort((a, b) => { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map((x, i) => {
                            x.index = i;
                            x.altName = "" + i;
                        });
                    }
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: item,
                        altName: "" + i,
                        value: "",
                        parent: p,
                        type: DifferentiateNodeType.json,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children.push({
                        id: this.generateNodeId(),
                        index: i,
                        name: item,
                        altName: "" + i,
                        value: jsonValue,
                        parent: p,
                        type: DifferentiateNodeType.pair,
                        status: DifferentiateNodeStatus.default,
                        children: []
                    });
                }
            });
            result = children;
        }
        return result;
    }
    itemInArray(side, node) {
        let result;
        const key = node.type === DifferentiateNodeType.literal ?
            (node.value ? String(node.value).toUpperCase() : "") :
            node.type === DifferentiateNodeType.array ?
                node.altName :
                node.name;
        side.map((item) => {
            if (item.type === DifferentiateNodeType.literal) {
                if (item.value && String(item.value).toUpperCase() === key) {
                    result = item;
                }
            }
            else if (item.type === DifferentiateNodeType.array) {
                if (item.altName === key) {
                    result = item;
                }
            }
            else {
                if (item.name === key) {
                    result = item;
                }
            }
        });
        return result;
    }
    leftItemFromRightItem(leftNode, rightNode) {
        let result;
        if (!leftNode || !rightNode) {
            return result;
        }
        const key = rightNode.type === DifferentiateNodeType.literal ?
            (rightNode.value ? rightNode.value.toUpperCase() : "") :
            rightNode.type === DifferentiateNodeType.array ?
                rightNode.altName :
                rightNode.name;
        if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value && String(leftNode.value).toUpperCase() === key) {
                result = leftNode;
            }
        }
        else if (leftNode.type === DifferentiateNodeType.array) {
            if (leftNode.altName === key) {
                result = leftNode;
            }
        }
        else {
            if (leftNode.name === key) {
                result = leftNode;
            }
        }
        return result;
    }
    compare(leftNode, rightNode) {
        if (leftNode.type !== rightNode.type) {
            leftNode.status = DifferentiateNodeStatus.typeChanged;
            rightNode.status = DifferentiateNodeStatus.typeChanged;
            leftNode.counterpart = rightNode.id;
            rightNode.counterpart = leftNode.id;
        }
        else if (leftNode.type === DifferentiateNodeType.literal) {
            if (leftNode.value !== rightNode.value) {
                leftNode.status = DifferentiateNodeStatus.valueChanged;
                rightNode.status = DifferentiateNodeStatus.valueChanged;
                leftNode.counterpart = rightNode.id;
                rightNode.counterpart = leftNode.id;
            }
        }
        else if (leftNode.type === DifferentiateNodeType.pair) {
            if (leftNode.name !== rightNode.name) {
                leftNode.status = DifferentiateNodeStatus.nameChanged;
                rightNode.status = DifferentiateNodeStatus.nameChanged;
                leftNode.counterpart = rightNode.id;
                rightNode.counterpart = leftNode.id;
            }
            if (leftNode.value !== rightNode.value) {
                leftNode.status = DifferentiateNodeStatus.valueChanged;
                rightNode.status = DifferentiateNodeStatus.valueChanged;
                leftNode.counterpart = rightNode.id;
                rightNode.counterpart = leftNode.id;
            }
        }
        else {
            if (leftNode.name !== rightNode.name) {
                leftNode.status = DifferentiateNodeStatus.nameChanged;
                rightNode.status = DifferentiateNodeStatus.nameChanged;
                leftNode.counterpart = rightNode.id;
                rightNode.counterpart = leftNode.id;
            }
            this.unify(leftNode.children, rightNode.children);
        }
    }
    reIndex(list) {
        list.map((item, i) => {
            item.index = i;
            this.reIndex(item.children);
        });
    }
    copyInto(side, item, index, status) {
        if (item) {
            const newItem = JSON.parse(JSON.stringify(item));
            side.splice(index, 0, newItem);
            this.reIndex(side);
            item.status = status;
            newItem.status = status;
            item.counterpart = newItem.id;
            newItem.counterpart = item.id;
            this.setChildrenStatus(item.children, status);
            this.setChildrenStatus(newItem.children, status);
        }
    }
    setChildrenStatus(list, status) {
        list.map((x) => {
            x.status = status;
            this.setChildrenStatus(x.children, status);
        });
    }
    unify(leftSide, rightSide) {
        let i = 0, j = 0, looping = true;
        while (looping) {
            let leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            let rightItemInLeftSide = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;
            if (!leftItemInRightSide && i < leftSide.length) {
                if (!rightSide.length) {
                    while (i < leftSide.length) {
                        this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                        j++;
                        i++;
                    }
                }
                else {
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                    j++;
                    i++;
                }
            }
            if (!rightItemInLeftSide && j < rightSide.length) {
                if (!leftSide.length) {
                    while (j < rightSide.length) {
                        this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                        j++;
                        i++;
                    }
                }
                else {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                }
            }
            if (!leftItemInRightSide) {
                leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
            }
            if (!rightItemInLeftSide) {
                rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
            }
            if (leftItemInRightSide && leftItemInRightSide.index !== i) {
                while (i < leftSide.length) {
                    leftItemInRightSide = this.leftItemFromRightItem(rightSide[i], leftSide[i]);
                    if (leftItemInRightSide) {
                        leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                        break;
                    }
                    else {
                        this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                        j++;
                        i++;
                    }
                }
            }
            if (rightItemInLeftSide && rightItemInLeftSide.index !== j) {
                while (j < rightSide.length) {
                    rightItemInLeftSide = this.leftItemFromRightItem(leftSide[j], rightSide[j]);
                    if (rightItemInLeftSide) {
                        rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
                        break;
                    }
                    else {
                        this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                        j++;
                        i++;
                    }
                }
            }
            if (leftItemInRightSide && i < leftSide.length) {
                let x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                let x = this.itemInArray(leftSide, rightSide[j]);
                if (x && x.index !== rightItemInLeftSide.index) {
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                    j++;
                    i++;
                    rightItemInLeftSide = i < leftSide.length ? leftSide[i] : undefined;
                }
            }
            if (leftItemInRightSide && rightItemInLeftSide) {
                if (leftItemInRightSide.parent !== rightItemInLeftSide.parent) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    this.copyInto(rightSide, leftSide[i], i, DifferentiateNodeStatus.removed);
                }
                else {
                    this.compare(leftItemInRightSide, rightItemInLeftSide);
                }
                j++;
                i++;
            }
            looping = (i < leftSide.length || j < rightSide.length);
        }
    }
    toInternalStruction(leftNode, rightNode) {
        const result = {
            leftSide: this.transformNodeToInternalStruction(leftNode),
            rightSide: this.transformNodeToInternalStruction(rightNode)
        };
        this.unify(result.leftSide, result.rightSide);
        if (this.onlyShowDifferences) {
            result.leftSide = this.filterUnchanged(result.leftSide);
            result.rightSide = this.filterUnchanged(result.rightSide);
        }
        return result;
    }
    filterUnchanged(list) {
        const result = [];
        list.map((item) => {
            item.children = this.filterUnchanged(item.children);
            if ((item.type > DifferentiateNodeType.pair && item.children.length) ||
                item.status !== DifferentiateNodeStatus.default) {
                result.push(item);
            }
        });
        result.map((x, i) => {
            x.index = i;
            x.altName = "" + i;
        });
        return result;
    }
    ngOnChanges(changes) {
        if (changes.attributeOrderIsImportant ||
            changes.onlyShowDifferences ||
            changes.leftSideObject ||
            changes.namedRootObject ||
            changes.rightSideObject) {
            this.ready = false;
            this.ngOnInit();
        }
    }
    ngOnInit() {
        setTimeout(() => this.init(), 666);
    }
    categorizedName(item) {
        let name = "";
        this.categorizeBy.map((category) => {
            if (item.name === category) {
                name = item.value;
            }
        });
        return name;
    }
    sideCategorizedName(side) {
        side.map((item) => {
            const names = [];
            item.children.map((child) => {
                const name = this.categorizedName(child);
                if (String(name).length) {
                    names.push(name);
                }
            });
            item.categorizeBy = names.length > 1 ? names.join(" - ") : names[0];
            item.collapsed = true;
        });
    }
    init() {
        if (this.leftSideObject && this.rightSideObject) {
            const left = (this.leftSideObject instanceof Array) ? this.leftSideObject : [this.leftSideObject];
            const right = (this.rightSideObject instanceof Array) ? this.rightSideObject : [this.rightSideObject];
            const comparision = this.toInternalStruction(left, right);
            if (this.categorizeBy) {
                this.sideCategorizedName(comparision.leftSide);
                this.sideCategorizedName(comparision.rightSide);
            }
            this.leftSide = [{
                    id: this.generateNodeId(),
                    name: "",
                    value: "Root",
                    index: 0,
                    parent: DifferentiateNodeType.array,
                    type: DifferentiateNodeType.array,
                    expanded: true,
                    isRoot: true,
                    children: comparision.leftSide
                }];
            this.rightSide = [{
                    id: this.generateNodeId(),
                    name: "",
                    value: "Root",
                    index: 0,
                    parent: DifferentiateNodeType.array,
                    type: DifferentiateNodeType.array,
                    expanded: true,
                    isRoot: true,
                    children: comparision.rightSide
                }];
            setTimeout(() => {
                this.ready = true;
                this.fireCountDifference();
            }, 333);
        }
    }
    fireCountDifference() {
        let count = 0;
        this.leftSide[0].children.map((listItem) => {
            listItem.children.map((item) => {
                if (item.status !== DifferentiateNodeStatus.default) {
                    count++;
                }
            });
        });
        this.ondifference.emit(count);
    }
    lookupChildOf(side, parentObject, id) {
        let foundItem = undefined;
        if (side.id === id) {
            foundItem = { parent: parentObject, node: side };
        }
        else if (side.children.length) {
            side.children.map((item) => {
                if (!foundItem) {
                    foundItem = this.lookupChildOf(item, undefined, id);
                    if (foundItem && foundItem.parent === undefined) {
                        foundItem.parent = side;
                    }
                    else if (item.id === id) {
                        foundItem = { parent: side, node: item };
                    }
                }
            });
        }
        return foundItem;
    }
    performAdvanceToRight(leftSideInfo, rightSideInfo, status, i) {
        const modifiedChildren = this.leftSide[0].children[i].children;
        if (status === DifferentiateNodeStatus.removed) {
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.added) {
            leftSideInfo.parent.children.splice(leftSideInfo.node.index, 1);
            rightSideInfo.parent.children.splice(rightSideInfo.node.index, 1);
            this.reIndex(leftSideInfo.parent.children);
            this.reIndex(rightSideInfo.parent.children);
        }
        else if (status === DifferentiateNodeStatus.nameChanged) {
            leftSideInfo.node.name = rightSideInfo.node.name;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.valueChanged) {
            rightSideInfo.node.value = leftSideInfo.node.value;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.typeChanged) {
            leftSideInfo.node.type = rightSideInfo.node.type;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            leftSideInfo.node.children = rightSideInfo.node.children;
        }
        setTimeout(() => {
            this.onadvance.emit({
                index: i,
                node: this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
            });
            this.fireCountDifference();
        }, 66);
    }
    performAdvanceToLeft(leftSideInfo, rightSideInfo, status, i) {
        const modifiedChildren = this.rightSide[0].children[i].children;
        if (status === DifferentiateNodeStatus.added) {
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.removed) {
            leftSideInfo.parent.children.splice(leftSideInfo.node.index, 1);
            rightSideInfo.parent.children.splice(rightSideInfo.node.index, 1);
            this.reIndex(leftSideInfo.parent.children);
            this.reIndex(rightSideInfo.parent.children);
        }
        else if (status === DifferentiateNodeStatus.nameChanged) {
            rightSideInfo.node.name = leftSideInfo.node.name;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.valueChanged) {
            leftSideInfo.node.value = rightSideInfo.node.value;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            this.setChildrenStatus(rightSideInfo.node.children, rightSideInfo.node.status);
        }
        else if (status === DifferentiateNodeStatus.typeChanged) {
            rightSideInfo.node.type = leftSideInfo.node.type;
            rightSideInfo.node.status = DifferentiateNodeStatus.default;
            leftSideInfo.node.status = DifferentiateNodeStatus.default;
            this.setChildrenStatus(leftSideInfo.node.children, leftSideInfo.node.status);
            rightSideInfo.node.children = leftSideInfo.node.children;
        }
        setTimeout(() => {
            this.onrevert.emit({
                index: i,
                node: this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
            });
            this.fireCountDifference();
        }, 66);
    }
    advance(event) {
        const index = parseInt(event.node.path.split(",")[1]);
        if (event.type === 'advance') {
            this.performAdvanceToLeft(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.id), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.counterpart), event.node.status, index);
        }
        else {
            this.performAdvanceToRight(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.counterpart), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.id), event.node.status, index);
        }
    }
    autoExpand(event) {
        const index = parseInt(event.split(",")[1]);
        const lc = this.rightSide[0].children[index];
        const rc = this.leftSide[0].children[index];
        lc.collapsed = !lc.collapsed;
        rc.collapsed = !rc.collapsed;
    }
    onhover(event) {
        const index = parseInt(event.path.split(",")[1]);
        this.rightSide[0].children[index].children[event.index].hover = event.hover;
        this.leftSide[0].children[index].children[event.index].hover = event.hover;
    }
};
tslib_1.__decorate([
    Input("allowRevert")
], DifferentiateComponent.prototype, "allowRevert", void 0);
tslib_1.__decorate([
    Input("allowAdvance")
], DifferentiateComponent.prototype, "allowAdvance", void 0);
tslib_1.__decorate([
    Input("attributeOrderIsImportant")
], DifferentiateComponent.prototype, "attributeOrderIsImportant", void 0);
tslib_1.__decorate([
    Input("onlyShowDifferences")
], DifferentiateComponent.prototype, "onlyShowDifferences", void 0);
tslib_1.__decorate([
    Input("leftSideObject")
], DifferentiateComponent.prototype, "leftSideObject", void 0);
tslib_1.__decorate([
    Input("rightSideObject")
], DifferentiateComponent.prototype, "rightSideObject", void 0);
tslib_1.__decorate([
    Input("leftSideToolTip")
], DifferentiateComponent.prototype, "leftSideToolTip", void 0);
tslib_1.__decorate([
    Input("rightSideToolTip")
], DifferentiateComponent.prototype, "rightSideToolTip", void 0);
tslib_1.__decorate([
    Input('namedRootObject')
], DifferentiateComponent.prototype, "namedRootObject", null);
tslib_1.__decorate([
    Output("onrevert")
], DifferentiateComponent.prototype, "onrevert", void 0);
tslib_1.__decorate([
    Output("onadvance")
], DifferentiateComponent.prototype, "onadvance", void 0);
tslib_1.__decorate([
    Output("ondifference")
], DifferentiateComponent.prototype, "ondifference", void 0);
DifferentiateComponent = tslib_1.__decorate([
    Component({
        selector: 'differentiate',
        template: "<div class=\"spinner\" *ngIf=\"!ready\">\r\n    <svg \r\n        version=\"1.1\" \r\n        id=\"loader\" \r\n        xmlns=\"http://www.w3.org/2000/svg\" \r\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\" \r\n        x=\"0px\" \r\n        y=\"0px\"\r\n        width=\"40px\" \r\n        height=\"40px\" \r\n        viewBox=\"0 0 50 50\" \r\n        style=\"enable-background:new 0 0 50 50;\" \r\n        xml:space=\"preserve\">\r\n        <path \r\n            fill=\"#000\" \r\n            d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\r\n            <animateTransform attributeType=\"xml\"\r\n                attributeName=\"transform\"\r\n                type=\"rotate\"\r\n                from=\"0 25 25\"\r\n                to=\"360 25 25\"\r\n                dur=\"0.6s\"\r\n                repeatCount=\"indefinite\"/>\r\n    </path>\r\n  </svg>\r\n</div>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"left-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [rightSideToolTip]=\"rightSideToolTip\"\r\n    [showLeftActionButton]=\"allowAdvance\" \r\n    [children]=\"leftSide\"></differentiate-tree>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"right-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [leftSideToolTip]=\"leftSideToolTip\"\r\n    [showRightActionButton]=\"allowRevert\" \r\n    [children]=\"rightSide\"></differentiate-tree>\r\n\r\n",
        styles: [":host{border:1px solid rgba(0,0,0,.1);box-sizing:border-box;display:block;max-width:100vw;max-height:300px;overflow-y:auto;position:relative;width:100%}:host .spinner{margin:0 auto 1em;height:222px;width:20%;text-align:center;padding:1em;display:inline-block;vertical-align:top;position:absolute;top:0;left:10%;z-index:2}:host svg path,:host svg rect{fill:#1c0696}"]
    })
], DifferentiateComponent);
export { DifferentiateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZGlmZmVyZW50aWF0ZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZGlmZmVyZW50aWF0ZS9jb21wb25lbnRzL2RpZmZlcmVudGlhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7QUFDSCxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsdUJBQXVCLEVBQ3hCLE1BQU0sd0NBQXdDLENBQUM7QUFRaEQsSUFBYSxzQkFBc0IsR0FBbkMsTUFBYSxzQkFBc0I7SUFtRGpDO1FBM0NBLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBR3BCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBR3JCLDhCQUF5QixHQUFHLElBQUksQ0FBQztRQUdqQyx3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFTNUIsb0JBQWUsR0FBRyxnQkFBZ0IsQ0FBQztRQUduQyxxQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQztRQWNyQyxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUc5QixjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUcvQixpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFJbEMsQ0FBQztJQXJCRCxJQUFJLGVBQWUsQ0FBQyxLQUFhO1FBQy9CLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRTtZQUNaLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QzthQUFNO1lBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7U0FDL0I7SUFD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QyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUN2RixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFDRCxVQUFVLENBQUMsS0FBSztRQUNkLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFNUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFDN0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUM7SUFDL0IsQ0FBQztJQUNELE9BQU8sQ0FBQyxLQUFLO1FBQ1gsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUM1RSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0lBQzdFLENBQUM7Q0FDRixDQUFBO0FBNW1CQztJQURDLEtBQUssQ0FBQyxhQUFhLENBQUM7MkRBQ0Q7QUFHcEI7SUFEQyxLQUFLLENBQUMsY0FBYyxDQUFDOzREQUNEO0FBR3JCO0lBREMsS0FBSyxDQUFDLDJCQUEyQixDQUFDO3lFQUNGO0FBR2pDO0lBREMsS0FBSyxDQUFDLHFCQUFxQixDQUFDO21FQUNEO0FBRzVCO0lBREMsS0FBSyxDQUFDLGdCQUFnQixDQUFDOzhEQUNWO0FBR2Q7SUFEQyxLQUFLLENBQUMsaUJBQWlCLENBQUM7K0RBQ1Q7QUFHaEI7SUFEQyxLQUFLLENBQUMsaUJBQWlCLENBQUM7K0RBQ1U7QUFHbkM7SUFEQyxLQUFLLENBQUMsa0JBQWtCLENBQUM7Z0VBQ1c7QUFHckM7SUFEQyxLQUFLLENBQUMsaUJBQWlCLENBQUM7NkRBU3hCO0FBR0Q7SUFEQyxNQUFNLENBQUMsVUFBVSxDQUFDO3dEQUNXO0FBRzlCO0lBREMsTUFBTSxDQUFDLFdBQVcsQ0FBQzt5REFDVztBQUcvQjtJQURDLE1BQU0sQ0FBQyxjQUFjLENBQUM7NERBQ1c7QUFqRHZCLHNCQUFzQjtJQUxsQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsZUFBZTtRQUN6QixndERBQTZDOztLQUU5QyxDQUFDO0dBQ1csc0JBQXNCLENBb25CbEM7U0FwbkJZLHNCQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENvbXBhcmlzaW9uIFRvb2wgd2lsbCBsYXlvdXQgdHdvIGNvbXBhcmlzaW9uIHRyZWVzIHNpZGUgYnkgc2lkZSBhbmQgZmVlZCB0aGVtIGFuIGludGVybmFsIG9iamVjdFxyXG4gKiBoZWlyYXJjaHkgY3JlYXRlZCBmb3IgaW50ZXJuYWwgdXNlIGZyb20gSlNPTiBvYmplY3RzIGdpdmVuIHRvIHRoaXMgY29tcG9uZW50LlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gIERpZmZlcmVudGlhdGVOb2RlLFxyXG4gIERpZmZlcmVudGlhdGVOb2RlVHlwZSxcclxuICBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1c1xyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvZGlmZmVyZW50aWF0ZS5pbnRlcmZhY2VzJztcclxuaW1wb3J0IHsgVGhyb3dTdG10IH0gZnJvbSAnQGFuZ3VsYXIvY29tcGlsZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdkaWZmZXJlbnRpYXRlJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgRGlmZmVyZW50aWF0ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuICBcclxuICBsZWZ0U2lkZTtcclxuICByaWdodFNpZGU7XHJcbiAgcmVhZHk6IGJvb2xlYW47XHJcbiAgY2F0ZWdvcml6ZUJ5OiBzdHJpbmdbXTtcclxuXHJcbiAgQElucHV0KFwiYWxsb3dSZXZlcnRcIilcclxuICBhbGxvd1JldmVydCA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJhbGxvd0FkdmFuY2VcIilcclxuICBhbGxvd0FkdmFuY2UgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwiYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudFwiKVxyXG4gIGF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQgPSB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJvbmx5U2hvd0RpZmZlcmVuY2VzXCIpXHJcbiAgb25seVNob3dEaWZmZXJlbmNlcyA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJsZWZ0U2lkZU9iamVjdFwiKVxyXG4gIGxlZnRTaWRlT2JqZWN0XHJcblxyXG4gIEBJbnB1dChcInJpZ2h0U2lkZU9iamVjdFwiKVxyXG4gIHJpZ2h0U2lkZU9iamVjdDtcclxuXHJcbiAgQElucHV0KFwibGVmdFNpZGVUb29sVGlwXCIpXHJcbiAgbGVmdFNpZGVUb29sVGlwID0gXCJ0YWtlIGxlZnQgc2lkZVwiO1xyXG5cclxuICBASW5wdXQoXCJyaWdodFNpZGVUb29sVGlwXCIpXHJcbiAgcmlnaHRTaWRlVG9vbFRpcCA9IFwidGFrZSByaWdodCBzaWRlXCI7XHJcblxyXG4gIEBJbnB1dCgnbmFtZWRSb290T2JqZWN0JylcclxuICBzZXQgbmFtZWRSb290T2JqZWN0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIGxldCB4ID0gdmFsdWUucmVwbGFjZShcIiBcIiwgXCJcIik7XHJcblxyXG4gICAgaWYgKHgubGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcml6ZUJ5ID0gdmFsdWUuc3BsaXQoXCIsXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jYXRlZ29yaXplQnkgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBAT3V0cHV0KFwib25yZXZlcnRcIilcclxuICBvbnJldmVydCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uYWR2YW5jZVwiKVxyXG4gIG9uYWR2YW5jZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dChcIm9uZGlmZmVyZW5jZVwiKVxyXG4gIG9uZGlmZmVyZW5jZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgY29uc3RydWN0b3IoXHQpIHtcclxuXHQgIFxyXG4gIH1cclxuICBwcml2YXRlIGdlbmVyYXRlTm9kZUlkKCkge1xyXG4gICAgY29uc3QgbWluID0gMTtcclxuICAgIGNvbnN0IG1heCA9IDEwMDAwXHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pbjtcclxuICB9XHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShub2RlLCBwYXJlbnQpIHtcclxuICAgIGxldCBqc29uID0ge307XHJcbiAgICBsZXQgYXJyYXkgPSBbXTtcclxuXHJcbiAgICBub2RlLm1hcCggKGl0ZW06IERpZmZlcmVudGlhdGVOb2RlKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCkge1xyXG4gICAgICAgIGlmIChwYXJlbnQgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKSB7ICAgIFxyXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpcikge1xyXG4gICAgICAgICAgICBqc29uW2l0ZW0ubmFtZV0gPSBpdGVtLnZhbHVlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICAgICAgICBjb25zdCB4ID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLm5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAganNvbltpdGVtLm5hbWVdID0geDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBqc29uID0gW3hdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pIHtcclxuICAgICAgICAgICAganNvbltpdGVtLm5hbWVdID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChwYXJlbnQgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSl7XHJcbiAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCkpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFycmF5Lmxlbmd0aCA/IGFycmF5IDoganNvbjtcclxuICB9XHJcbiAgcHJpdmF0ZSB0cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihub2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gbm9kZTtcclxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgY29uc3QgY2hpbGRyZW46IERpZmZlcmVudGlhdGVOb2RlW10gPSBbXTtcclxuICAgICAgY29uc3QgcCA9IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheTtcclxuICAgICAgbm9kZS5tYXAoIChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3QganNvblZhbHVlOiBhbnkgPSB0aGlzLnRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKGl0ZW0pO1xyXG4gICAgICAgIGlmIChqc29uVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQpIHtcclxuICAgICAgICAgICAganNvblZhbHVlLnNvcnQoKGEsYikgPT4ge3JldHVybiBhLm5hbWUgPD0gYi5uYW1lID8gLTE6IDF9KTtcclxuICAgICAgICAgICAganNvblZhbHVlLm1hcCggKHg6IERpZmZlcmVudGlhdGVOb2RlLCBpKSA9PntcclxuICAgICAgICAgICAgICB4LmluZGV4ID0gaTtcclxuICAgICAgICAgICAgICB4LmFsdE5hbWUgPSBcIlwiICsgaTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZTogXCJcIixcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IGpzb25WYWx1ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogXCJcIixcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwsXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9ICAgICAgXHJcbiAgICAgIH0pO1xyXG4gICAgICByZXN1bHQgPSBjaGlsZHJlbjtcclxuICAgIH0gZWxzZSBpZiAobm9kZSBpbnN0YW5jZW9mIE9iamVjdCkge1xyXG4gICAgICBjb25zdCBsaXN0ID0gT2JqZWN0LmtleXMobm9kZSk7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBEaWZmZXJlbnRpYXRlTm9kZVtdID0gW107XHJcbiAgICAgIGNvbnN0IHAgPSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbjtcclxuICAgICAgaWYgKCF0aGlzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQpIHtcclxuICAgICAgICBsaXN0LnNvcnQoKGEsYikgPT4ge3JldHVybiBhIDw9IGIgPyAtMTogMX0pO1xyXG4gICAgICB9XHJcbiAgICAgIGxpc3QubWFwKCAoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGpzb25WYWx1ZTogYW55ID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihub2RlW2l0ZW1dKTtcclxuICAgICAgICBpZiAoanNvblZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50KSB7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5zb3J0KChhLGIpID0+IHtyZXR1cm4gYS5uYW1lIDw9IGIubmFtZSA/IC0xOiAxfSk7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5tYXAoICh4OiBEaWZmZXJlbnRpYXRlTm9kZSwgaSkgPT4ge1xyXG4gICAgICAgICAgICAgIHguaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogaXRlbSxcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uLFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBqc29uVmFsdWVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0sXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZToganNvblZhbHVlLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyLFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgcmVzdWx0ID0gY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpdGVtSW5BcnJheShzaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLCBub2RlOiBEaWZmZXJlbnRpYXRlTm9kZSkge1xyXG4gICAgbGV0IHJlc3VsdDogRGlmZmVyZW50aWF0ZU5vZGU7XHJcbiAgICBjb25zdCBrZXkgPSBub2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsID9cclxuICAgICAgICAgICAgICAgIChub2RlLnZhbHVlID8gU3RyaW5nKG5vZGUudmFsdWUpLnRvVXBwZXJDYXNlKCkgOiBcIlwiKSA6XHJcbiAgICAgICAgICAgICAgICBub2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSA/XHJcbiAgICAgICAgICAgICAgICBub2RlLmFsdE5hbWUgOlxyXG4gICAgICAgICAgICAgICAgbm9kZS5uYW1lO1xyXG5cclxuICAgIHNpZGUubWFwKCAoaXRlbTogRGlmZmVyZW50aWF0ZU5vZGUpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgICBpZiAoaXRlbS52YWx1ZSAmJiBTdHJpbmcoaXRlbS52YWx1ZSkudG9VcHBlckNhc2UoKSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgIH0gIFxyXG4gICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgICAgaWYgKGl0ZW0uYWx0TmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgIH0gIFxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChpdGVtLm5hbWUgPT09IGtleSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbGVmdEl0ZW1Gcm9tUmlnaHRJdGVtKGxlZnROb2RlOiBEaWZmZXJlbnRpYXRlTm9kZSwgcmlnaHROb2RlOiBEaWZmZXJlbnRpYXRlTm9kZSkge1xyXG4gICAgbGV0IHJlc3VsdDogRGlmZmVyZW50aWF0ZU5vZGU7XHJcbiAgICBpZiAoIWxlZnROb2RlIHx8ICFyaWdodE5vZGUpIHtcclxuICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGNvbnN0IGtleSA9IHJpZ2h0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCA/XHJcbiAgICAgICAgICAgICAgICAgICAgKHJpZ2h0Tm9kZS52YWx1ZSA/IHJpZ2h0Tm9kZS52YWx1ZS50b1VwcGVyQ2FzZSgpIDogXCJcIikgOlxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkgP1xyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0Tm9kZS5hbHROYW1lIDpcclxuICAgICAgICAgICAgICAgICAgICByaWdodE5vZGUubmFtZTtcclxuXHJcbiAgICBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLnZhbHVlICYmIFN0cmluZyhsZWZ0Tm9kZS52YWx1ZSkudG9VcHBlckNhc2UoKSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbGVmdE5vZGU7XHJcbiAgICAgIH0gIFxyXG4gICAgfSBlbHNlIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLmFsdE5hbWUgPT09IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGxlZnROb2RlO1xyXG4gICAgICB9ICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5uYW1lID09PSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSBsZWZ0Tm9kZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY29tcGFyZShsZWZ0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUsIHJpZ2h0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUpIHtcclxuICAgIGlmIChsZWZ0Tm9kZS50eXBlICE9PSByaWdodE5vZGUudHlwZSkge1xyXG4gICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZDtcclxuICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkO1xyXG4gICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICB9IGVsc2UgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS52YWx1ZSAhPT0gcmlnaHROb2RlLnZhbHVlKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLm5hbWUgIT09IHJpZ2h0Tm9kZS5uYW1lKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS52YWx1ZSAhPT0gcmlnaHROb2RlLnZhbHVlKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5uYW1lICE9PSByaWdodE5vZGUubmFtZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVuaWZ5KGxlZnROb2RlLmNoaWxkcmVuLCByaWdodE5vZGUuY2hpbGRyZW4pO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHJlSW5kZXgobGlzdDogRGlmZmVyZW50aWF0ZU5vZGVbXSkge1xyXG4gICAgbGlzdC5tYXAoKGl0ZW0sIGkpID0+IHtcclxuICAgICAgaXRlbS5pbmRleCA9IGk7XHJcbiAgICAgIHRoaXMucmVJbmRleChpdGVtLmNoaWxkcmVuKTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGNvcHlJbnRvKFxyXG4gICAgICAgICAgICAgIHNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10sXHJcbiAgICAgICAgICAgICAgaXRlbTogRGlmZmVyZW50aWF0ZU5vZGUsXHJcbiAgICAgICAgICAgICAgaW5kZXg6IG51bWJlcixcclxuICAgICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzKSB7XHJcbiAgICBcclxuICAgIGlmIChpdGVtKSB7XHJcbiAgICAgIGNvbnN0IG5ld0l0ZW0gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGl0ZW0pKTtcclxuICAgICAgc2lkZS5zcGxpY2UoaW5kZXgsIDAsIG5ld0l0ZW0pO1xyXG4gICAgICB0aGlzLnJlSW5kZXgoc2lkZSk7XHJcbiAgXHJcbiAgICAgIGl0ZW0uc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICBuZXdJdGVtLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgaXRlbS5jb3VudGVycGFydCA9IG5ld0l0ZW0uaWQ7XHJcbiAgICAgIG5ld0l0ZW0uY291bnRlcnBhcnQgPSBpdGVtLmlkO1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGl0ZW0uY2hpbGRyZW4sIHN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhuZXdJdGVtLmNoaWxkcmVuLCBzdGF0dXMpXHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgc2V0Q2hpbGRyZW5TdGF0dXMobGlzdCwgc3RhdHVzKXtcclxuICAgIGxpc3QubWFwKCAoeCkgPT4ge1xyXG4gICAgICB4LnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyh4LmNoaWxkcmVuLCBzdGF0dXMpXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSB1bmlmeShsZWZ0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSwgcmlnaHRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdKSB7XHJcbiAgICBsZXQgaSA9IDAsIGogPSAwLCBsb29waW5nID0gdHJ1ZTtcclxuXHJcbiAgICB3aGlsZSAobG9vcGluZykge1xyXG4gICAgICBsZXQgbGVmdEl0ZW1JblJpZ2h0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gdGhpcy5pdGVtSW5BcnJheShyaWdodFNpZGUsIGxlZnRTaWRlW2ldKSA6IHVuZGVmaW5lZDtcclxuICAgICAgbGV0IHJpZ2h0SXRlbUluTGVmdFNpZGU6IERpZmZlcmVudGlhdGVOb2RlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyB0aGlzLml0ZW1JbkFycmF5KGxlZnRTaWRlLCByaWdodFNpZGVbal0pIDogdW5kZWZpbmVkO1xyXG5cclxuICAgICAgaWYgKCFsZWZ0SXRlbUluUmlnaHRTaWRlICYmIGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBpZiAoIXJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIHdoaWxlIChpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUludG8ocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSwgaSwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8ocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSwgaSwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCk7XHJcbiAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoIXJpZ2h0SXRlbUluTGVmdFNpZGUgJiYgaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBpZiAoIWxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgd2hpbGUgKGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghbGVmdEl0ZW1JblJpZ2h0U2lkZSkge1xyXG4gICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHJpZ2h0U2lkZVtqXSA6IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXJpZ2h0SXRlbUluTGVmdFNpZGUpIHtcclxuICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlICYmIGxlZnRJdGVtSW5SaWdodFNpZGUuaW5kZXggIT09IGkpIHtcclxuICAgICAgICB3aGlsZSAoaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IHRoaXMubGVmdEl0ZW1Gcm9tUmlnaHRJdGVtKHJpZ2h0U2lkZVtpXSwgbGVmdFNpZGVbaV0pO1xyXG4gICAgICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUpIHtcclxuICAgICAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gcmlnaHRTaWRlW2pdIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUludG8ocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSwgaSwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJpZ2h0SXRlbUluTGVmdFNpZGUgJiYgcmlnaHRJdGVtSW5MZWZ0U2lkZS5pbmRleCAhPT0gaikge1xyXG4gICAgICAgIHdoaWxlIChqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgcmlnaHRJdGVtSW5MZWZ0U2lkZSA9IHRoaXMubGVmdEl0ZW1Gcm9tUmlnaHRJdGVtKGxlZnRTaWRlW2pdLCByaWdodFNpZGVbal0pO1xyXG4gICAgICAgICAgaWYgKHJpZ2h0SXRlbUluTGVmdFNpZGUpIHtcclxuICAgICAgICAgICAgcmlnaHRJdGVtSW5MZWZ0U2lkZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyBsZWZ0U2lkZVtpXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUgJiYgaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy5pdGVtSW5BcnJheShyaWdodFNpZGUsIGxlZnRTaWRlW2ldKTtcclxuICAgICAgICBpZiAoeCAmJiB4LmluZGV4ICE9PSBsZWZ0SXRlbUluUmlnaHRTaWRlLmluZGV4KSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyByaWdodFNpZGVbal0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChyaWdodEl0ZW1JbkxlZnRTaWRlICYmIGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLml0ZW1JbkFycmF5KGxlZnRTaWRlLCByaWdodFNpZGVbal0pO1xyXG4gICAgICAgIGlmICh4ICYmIHguaW5kZXggIT09IHJpZ2h0SXRlbUluTGVmdFNpZGUuaW5kZXgpIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8ocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSwgaSwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCk7XHJcbiAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgcmlnaHRJdGVtSW5MZWZ0U2lkZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyBsZWZ0U2lkZVtpXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUgJiYgcmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlLnBhcmVudCAhPT0gcmlnaHRJdGVtSW5MZWZ0U2lkZS5wYXJlbnQpIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb21wYXJlKGxlZnRJdGVtSW5SaWdodFNpZGUsIHJpZ2h0SXRlbUluTGVmdFNpZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBqKys7aSsrO1xyXG4gICAgICB9XHJcbiAgICAgIGxvb3BpbmcgPSAoaSA8IGxlZnRTaWRlLmxlbmd0aCB8fCBqIDwgcmlnaHRTaWRlLmxlbmd0aCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgdG9JbnRlcm5hbFN0cnVjdGlvbihsZWZ0Tm9kZSwgcmlnaHROb2RlKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB7XHJcbiAgICAgIGxlZnRTaWRlOiB0aGlzLnRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKGxlZnROb2RlKSxcclxuICAgICAgcmlnaHRTaWRlOiB0aGlzLnRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKHJpZ2h0Tm9kZSlcclxuICAgIH07XHJcbiAgICB0aGlzLnVuaWZ5KHJlc3VsdC5sZWZ0U2lkZSwgcmVzdWx0LnJpZ2h0U2lkZSk7XHJcblxyXG4gICAgaWYgKHRoaXMub25seVNob3dEaWZmZXJlbmNlcykge1xyXG4gICAgICByZXN1bHQubGVmdFNpZGUgPSB0aGlzLmZpbHRlclVuY2hhbmdlZChyZXN1bHQubGVmdFNpZGUpO1xyXG4gICAgICByZXN1bHQucmlnaHRTaWRlID0gdGhpcy5maWx0ZXJVbmNoYW5nZWQocmVzdWx0LnJpZ2h0U2lkZSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwcml2YXRlIGZpbHRlclVuY2hhbmdlZChsaXN0OiBEaWZmZXJlbnRpYXRlTm9kZVtdKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBbXTtcclxuICAgIFxyXG4gICAgbGlzdC5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgIGl0ZW0uY2hpbGRyZW4gPSB0aGlzLmZpbHRlclVuY2hhbmdlZChpdGVtLmNoaWxkcmVuKTtcclxuICAgICAgaWYgKChpdGVtLnR5cGUgPiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpciAmJiBpdGVtLmNoaWxkcmVuLmxlbmd0aCkgfHxcclxuICAgICAgICAgIGl0ZW0uc3RhdHVzICE9PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0KSB7XHJcbiAgICAgICAgcmVzdWx0LnB1c2goaXRlbSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmVzdWx0Lm1hcCggKHg6IERpZmZlcmVudGlhdGVOb2RlLCBpKSA9PiB7XHJcbiAgICAgIHguaW5kZXggPSBpO1xyXG4gICAgICB4LmFsdE5hbWUgPSBcIlwiICsgaTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcclxuICAgIGlmIChjaGFuZ2VzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQgfHxcclxuICAgICAgY2hhbmdlcy5vbmx5U2hvd0RpZmZlcmVuY2VzIHx8XHJcbiAgICAgIGNoYW5nZXMubGVmdFNpZGVPYmplY3QgfHxcclxuICAgICAgY2hhbmdlcy5uYW1lZFJvb3RPYmplY3QgfHxcclxuICAgICAgY2hhbmdlcy5yaWdodFNpZGVPYmplY3QpIHtcclxuICAgICAgdGhpcy5yZWFkeSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLm5nT25Jbml0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHNldFRpbWVvdXQoKCk9PnRoaXMuaW5pdCgpLDY2Nik7XHJcbiAgfVxyXG4gIHByaXZhdGUgY2F0ZWdvcml6ZWROYW1lKGl0ZW0pIHtcclxuICAgIGxldCBuYW1lID0gXCJcIjtcclxuICAgIHRoaXMuY2F0ZWdvcml6ZUJ5Lm1hcCgoY2F0ZWdvcnkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0gY2F0ZWdvcnkpIHtcclxuICAgICAgICBuYW1lID0gaXRlbS52YWx1ZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gbmFtZTtcclxuICB9XHJcbiAgcHJpdmF0ZSBzaWRlQ2F0ZWdvcml6ZWROYW1lKHNpZGUpIHtcclxuICAgIHNpZGUubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBuYW1lcyA9IFtdO1xyXG4gICAgICBpdGVtLmNoaWxkcmVuLm1hcCgoY2hpbGQpID0+IHtcclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5jYXRlZ29yaXplZE5hbWUoY2hpbGQpO1xyXG4gICAgICAgIGlmKFN0cmluZyhuYW1lKS5sZW5ndGgpIHtcclxuICAgICAgICAgIG5hbWVzLnB1c2gobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgICAgaXRlbS5jYXRlZ29yaXplQnkgPSBuYW1lcy5sZW5ndGggPiAxID8gbmFtZXMuam9pbihcIiAtIFwiKSA6IG5hbWVzWzBdO1xyXG4gICAgICBpdGVtLmNvbGxhcHNlZCA9IHRydWU7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBpbml0KCkge1xyXG4gICAgaWYgKHRoaXMubGVmdFNpZGVPYmplY3QgJiYgdGhpcy5yaWdodFNpZGVPYmplY3QpIHtcclxuICAgICAgY29uc3QgbGVmdCA9ICh0aGlzLmxlZnRTaWRlT2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpICA/IHRoaXMubGVmdFNpZGVPYmplY3QgOiBbdGhpcy5sZWZ0U2lkZU9iamVjdF1cclxuICAgICAgY29uc3QgcmlnaHQgPSAodGhpcy5yaWdodFNpZGVPYmplY3QgaW5zdGFuY2VvZiBBcnJheSkgID8gdGhpcy5yaWdodFNpZGVPYmplY3QgOiBbdGhpcy5yaWdodFNpZGVPYmplY3RdXHJcbiAgICAgIGNvbnN0IGNvbXBhcmlzaW9uID0gdGhpcy50b0ludGVybmFsU3RydWN0aW9uKGxlZnQsIHJpZ2h0KTtcclxuICAgICAgaWYgKHRoaXMuY2F0ZWdvcml6ZUJ5KSB7XHJcbiAgICAgICAgdGhpcy5zaWRlQ2F0ZWdvcml6ZWROYW1lKGNvbXBhcmlzaW9uLmxlZnRTaWRlKTtcclxuICAgICAgICB0aGlzLnNpZGVDYXRlZ29yaXplZE5hbWUoY29tcGFyaXNpb24ucmlnaHRTaWRlKTtcclxuICAgICAgfSAgXHJcbiAgICAgIHRoaXMubGVmdFNpZGUgPSBbe1xyXG4gICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgbmFtZTogXCJcIixcclxuICAgICAgICB2YWx1ZTogXCJSb290XCIsXHJcbiAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgcGFyZW50OiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgIGV4cGFuZGVkOiB0cnVlLFxyXG4gICAgICAgIGlzUm9vdDogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogY29tcGFyaXNpb24ubGVmdFNpZGVcclxuICAgICAgfV07XHJcbiAgICAgIHRoaXMucmlnaHRTaWRlPSBbe1xyXG4gICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgbmFtZTogXCJcIixcclxuICAgICAgICB2YWx1ZTogXCJSb290XCIsXHJcbiAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgcGFyZW50OiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgIGV4cGFuZGVkOiB0cnVlLFxyXG4gICAgICAgIGlzUm9vdDogdHJ1ZSxcclxuICAgICAgICBjaGlsZHJlbjogY29tcGFyaXNpb24ucmlnaHRTaWRlXHJcbiAgICAgIH1dO1xyXG4gICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgdGhpcy5yZWFkeSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5maXJlQ291bnREaWZmZXJlbmNlKCk7XHJcbiAgICAgIH0sMzMzKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBmaXJlQ291bnREaWZmZXJlbmNlKCkge1xyXG4gICAgbGV0IGNvdW50ID0gMDtcclxuICAgIHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW4ubWFwKCAobGlzdEl0ZW0pID0+IHtcclxuICAgICAgbGlzdEl0ZW0uY2hpbGRyZW4ubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGlmKGl0ZW0uc3RhdHVzICE9PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0KSB7XHJcbiAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgdGhpcy5vbmRpZmZlcmVuY2UuZW1pdChjb3VudCk7XHJcbiAgfVxyXG4gIHByaXZhdGUgbG9va3VwQ2hpbGRPZihzaWRlLCBwYXJlbnRPYmplY3QsIGlkKSB7XHJcbiAgICBsZXQgZm91bmRJdGVtID0gdW5kZWZpbmVkO1xyXG4gICAgaWYgKHNpZGUuaWQgPT09IGlkKSB7XHJcbiAgICAgIGZvdW5kSXRlbSA9IHtwYXJlbnQ6IHBhcmVudE9iamVjdCwgbm9kZTogc2lkZX07XHJcbiAgICB9IGVsc2UgaWYgKHNpZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XHJcbiAgICAgIHNpZGUuY2hpbGRyZW4ubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICAgIGlmICghZm91bmRJdGVtKSB7XHJcbiAgICAgICAgICBmb3VuZEl0ZW0gPSB0aGlzLmxvb2t1cENoaWxkT2YoaXRlbSwgdW5kZWZpbmVkLCBpZCk7XHJcbiAgICAgICAgICBpZiAoZm91bmRJdGVtICYmIGZvdW5kSXRlbS5wYXJlbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBmb3VuZEl0ZW0ucGFyZW50ID0gc2lkZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuICAgICAgICAgICAgZm91bmRJdGVtID0ge3BhcmVudDogc2lkZSwgbm9kZTogaXRlbX07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gXHJcbiAgICByZXR1cm4gZm91bmRJdGVtO1xyXG4gIH1cclxuICBwcml2YXRlIHBlcmZvcm1BZHZhbmNlVG9SaWdodChsZWZ0U2lkZUluZm8sIHJpZ2h0U2lkZUluZm8sIHN0YXR1cywgaSkge1xyXG4gICAgY29uc3QgbW9kaWZpZWRDaGlsZHJlbiA9IHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baV0uY2hpbGRyZW47XHJcbiAgICBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGxlZnRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKHJpZ2h0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHRoaXMucmVJbmRleChsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgICAgdGhpcy5yZUluZGV4KHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5uYW1lID0gcmlnaHRTaWRlSW5mby5ub2RlLm5hbWU7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUudmFsdWUgPSBsZWZ0U2lkZUluZm8ubm9kZS52YWx1ZTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUudHlwZSA9IHJpZ2h0U2lkZUluZm8ubm9kZS50eXBlO1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiA9IHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbjtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT57XHJcbiAgICAgIHRoaXMub25hZHZhbmNlLmVtaXQoe1xyXG4gICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgIG5vZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUobW9kaWZpZWRDaGlsZHJlbiwgRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmZpcmVDb3VudERpZmZlcmVuY2UoKTtcclxuICAgIH0sIDY2KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBwZXJmb3JtQWR2YW5jZVRvTGVmdChsZWZ0U2lkZUluZm8sIHJpZ2h0U2lkZUluZm8sIHN0YXR1cywgaSkge1xyXG4gICAgY29uc3QgbW9kaWZpZWRDaGlsZHJlbiA9IHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuO1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuLnNwbGljZShsZWZ0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuLnNwbGljZShyaWdodFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICB0aGlzLnJlSW5kZXgobGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbik7XHJcbiAgICAgIHRoaXMucmVJbmRleChyaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbik7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQpIHtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLm5hbWUgPSBsZWZ0U2lkZUluZm8ubm9kZS5uYW1lO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUudmFsdWUgPSByaWdodFNpZGVJbmZvLm5vZGUudmFsdWU7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkKSB7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS50eXBlID0gbGVmdFNpZGVJbmZvLm5vZGUudHlwZTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuID0gbGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+e1xyXG4gICAgICB0aGlzLm9ucmV2ZXJ0LmVtaXQoe1xyXG4gICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgIG5vZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUobW9kaWZpZWRDaGlsZHJlbiwgRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmZpcmVDb3VudERpZmZlcmVuY2UoKTtcclxuICAgIH0sIDY2KTtcclxuICB9XHJcbiAgYWR2YW5jZShldmVudCkge1xyXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChldmVudC5ub2RlLnBhdGguc3BsaXQoXCIsXCIpWzFdKTtcclxuXHJcbiAgICBpZiAoZXZlbnQudHlwZSA9PT0gJ2FkdmFuY2UnKSB7XHJcbiAgICAgIHRoaXMucGVyZm9ybUFkdmFuY2VUb0xlZnQoXHJcbiAgICAgICAgdGhpcy5sb29rdXBDaGlsZE9mKHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLmxlZnRTaWRlWzBdLCBldmVudC5ub2RlLmlkKSwgXHJcbiAgICAgICAgdGhpcy5sb29rdXBDaGlsZE9mKHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XSwgdGhpcy5yaWdodFNpZGVbMF0sIGV2ZW50Lm5vZGUuY291bnRlcnBhcnQpLCBcclxuICAgICAgICBldmVudC5ub2RlLnN0YXR1cywgaW5kZXgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5wZXJmb3JtQWR2YW5jZVRvUmlnaHQoXHJcbiAgICAgICAgdGhpcy5sb29rdXBDaGlsZE9mKHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLmxlZnRTaWRlWzBdLCBldmVudC5ub2RlLmNvdW50ZXJwYXJ0KSwgXHJcbiAgICAgICAgdGhpcy5sb29rdXBDaGlsZE9mKHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XSwgdGhpcy5yaWdodFNpZGVbMF0sIGV2ZW50Lm5vZGUuaWQpLCBcclxuICAgICAgICBldmVudC5ub2RlLnN0YXR1cywgaW5kZXgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBhdXRvRXhwYW5kKGV2ZW50KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGV2ZW50LnNwbGl0KFwiLFwiKVsxXSk7XHJcbiAgICBjb25zdCBsYyA9IHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIGNvbnN0IHJjID0gdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF07XHJcbiAgICBcclxuICAgIGxjLmNvbGxhcHNlZCA9ICFsYy5jb2xsYXBzZWQ7XHJcbiAgICByYy5jb2xsYXBzZWQgPSAhcmMuY29sbGFwc2VkO1xyXG4gIH1cclxuICBvbmhvdmVyKGV2ZW50KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGV2ZW50LnBhdGguc3BsaXQoXCIsXCIpWzFdKTtcclxuXHJcbiAgICB0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF0uY2hpbGRyZW5bZXZlbnQuaW5kZXhdLmhvdmVyID0gZXZlbnQuaG92ZXI7XHJcbiAgICB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XS5jaGlsZHJlbltldmVudC5pbmRleF0uaG92ZXIgPSBldmVudC5ob3ZlcjtcclxuICB9XHJcbn1cclxuIl19