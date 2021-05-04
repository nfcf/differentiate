import * as tslib_1 from "tslib";
/*
 * Comparision Tool will layout two comparision trees side by side and feed them an internal object
 * heirarchy created for internal use from JSON objects given to this component.
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DifferentiateNodeType, DifferentiateNodeStatus } from '../interfaces/differentiate.interfaces';
var DifferentiateComponent = /** @class */ (function () {
    function DifferentiateComponent() {
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
    Object.defineProperty(DifferentiateComponent.prototype, "namedRootObject", {
        set: function (value) {
            var x = value.replace(" ", "");
            if (x.length) {
                this.categorizeBy = value.split(",");
            }
            else {
                this.categorizeBy = undefined;
            }
        },
        enumerable: true,
        configurable: true
    });
    DifferentiateComponent.prototype.generateNodeId = function () {
        var min = 1;
        var max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    DifferentiateComponent.prototype.transformNodeToOriginalStructure = function (node, parent) {
        var _this = this;
        var json = {};
        var array = [];
        node.map(function (item) {
            if (item.status !== DifferentiateNodeStatus.removed) {
                if (parent === DifferentiateNodeType.json) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.pair) {
                        json[item.name] = item.value;
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        var x = _this.transformNodeToOriginalStructure(item.children, item.parent);
                        if (item.name.length) {
                            json[item.name] = x;
                        }
                        else {
                            json = [x];
                        }
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        json[item.name] = _this.transformNodeToOriginalStructure(item.children, item.parent);
                    }
                }
                else if (parent === DifferentiateNodeType.array) {
                    if (item.type === DifferentiateNodeType.literal) {
                        array.push(item.value);
                    }
                    else if (item.type === DifferentiateNodeType.json) {
                        array.push(_this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        array.push(_this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                }
            }
        });
        return array.length ? array : json;
    };
    DifferentiateComponent.prototype.transformNodeToInternalStruction = function (node) {
        var _this = this;
        var result = node;
        if (node instanceof Array) {
            var children_1 = [];
            var p_1 = DifferentiateNodeType.array;
            node.map(function (item, i) {
                var jsonValue = _this.transformNodeToInternalStruction(item);
                if (jsonValue instanceof Array) {
                    if (!_this.attributeOrderIsImportant) {
                        jsonValue.sort(function (a, b) { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map(function (x, i) {
                            x.index = i;
                            x.altName = "" + i;
                        });
                    }
                    children_1.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: "",
                        altName: "" + i,
                        value: "",
                        parent: p_1,
                        type: DifferentiateNodeType.array,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children_1.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: "",
                        altName: "" + i,
                        value: jsonValue,
                        parent: p_1,
                        type: DifferentiateNodeType.literal,
                        status: DifferentiateNodeStatus.default,
                        children: []
                    });
                }
            });
            result = children_1;
        }
        else if (node instanceof Object) {
            var list = Object.keys(node);
            var children_2 = [];
            var p_2 = DifferentiateNodeType.json;
            if (!this.attributeOrderIsImportant) {
                list.sort(function (a, b) { return a <= b ? -1 : 1; });
            }
            list.map(function (item, i) {
                var jsonValue = _this.transformNodeToInternalStruction(node[item]);
                if (jsonValue instanceof Array) {
                    if (!_this.attributeOrderIsImportant) {
                        jsonValue.sort(function (a, b) { return a.name <= b.name ? -1 : 1; });
                        jsonValue.map(function (x, i) {
                            x.index = i;
                            x.altName = "" + i;
                        });
                    }
                    children_2.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: item,
                        altName: "" + i,
                        value: "",
                        parent: p_2,
                        type: DifferentiateNodeType.json,
                        status: DifferentiateNodeStatus.default,
                        children: jsonValue
                    });
                }
                else {
                    children_2.push({
                        id: _this.generateNodeId(),
                        index: i,
                        name: item,
                        altName: "" + i,
                        value: jsonValue,
                        parent: p_2,
                        type: DifferentiateNodeType.pair,
                        status: DifferentiateNodeStatus.default,
                        children: []
                    });
                }
            });
            result = children_2;
        }
        return result;
    };
    DifferentiateComponent.prototype.itemInArray = function (side, node) {
        var result;
        var key = node.type === DifferentiateNodeType.literal ?
            (node.value ? String(node.value).toUpperCase() : "") :
            node.type === DifferentiateNodeType.array ?
                node.altName :
                node.name;
        side.map(function (item) {
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
    };
    DifferentiateComponent.prototype.leftItemFromRightItem = function (leftNode, rightNode) {
        var result;
        if (!leftNode || !rightNode) {
            return result;
        }
        var key = rightNode.type === DifferentiateNodeType.literal ?
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
    };
    DifferentiateComponent.prototype.compare = function (leftNode, rightNode) {
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
    };
    DifferentiateComponent.prototype.reIndex = function (list) {
        var _this = this;
        list.map(function (item, i) {
            item.index = i;
            _this.reIndex(item.children);
        });
    };
    DifferentiateComponent.prototype.copyInto = function (side, item, index, status) {
        if (item) {
            var newItem = JSON.parse(JSON.stringify(item));
            side.splice(index, 0, newItem);
            this.reIndex(side);
            item.status = status;
            newItem.status = status;
            item.counterpart = newItem.id;
            newItem.counterpart = item.id;
            this.setChildrenStatus(item.children, status);
            this.setChildrenStatus(newItem.children, status);
        }
    };
    DifferentiateComponent.prototype.setChildrenStatus = function (list, status) {
        var _this = this;
        list.map(function (x) {
            x.status = status;
            _this.setChildrenStatus(x.children, status);
        });
    };
    DifferentiateComponent.prototype.unify = function (leftSide, rightSide) {
        var i = 0, j = 0, looping = true;
        while (looping) {
            var leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            var rightItemInLeftSide = j < rightSide.length ? this.itemInArray(leftSide, rightSide[j]) : undefined;
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
                var x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                var x = this.itemInArray(leftSide, rightSide[j]);
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
    };
    DifferentiateComponent.prototype.toInternalStruction = function (leftNode, rightNode) {
        var result = {
            leftSide: this.transformNodeToInternalStruction(leftNode),
            rightSide: this.transformNodeToInternalStruction(rightNode)
        };
        this.unify(result.leftSide, result.rightSide);
        if (this.onlyShowDifferences) {
            result.leftSide = this.filterUnchanged(result.leftSide);
            result.rightSide = this.filterUnchanged(result.rightSide);
        }
        return result;
    };
    DifferentiateComponent.prototype.filterUnchanged = function (list) {
        var _this = this;
        var result = [];
        list.map(function (item) {
            item.children = _this.filterUnchanged(item.children);
            if ((item.type > DifferentiateNodeType.pair && item.children.length) ||
                item.status !== DifferentiateNodeStatus.default) {
                result.push(item);
            }
        });
        result.map(function (x, i) {
            x.index = i;
            x.altName = "" + i;
        });
        return result;
    };
    DifferentiateComponent.prototype.ngOnChanges = function (changes) {
        if (changes.attributeOrderIsImportant ||
            changes.onlyShowDifferences ||
            changes.leftSideObject ||
            changes.namedRootObject ||
            changes.rightSideObject) {
            this.ready = false;
            this.ngOnInit();
        }
    };
    DifferentiateComponent.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () { return _this.init(); }, 666);
    };
    DifferentiateComponent.prototype.categorizedName = function (item) {
        var name = "";
        this.categorizeBy.map(function (category) {
            if (item.name === category) {
                name = item.value;
            }
        });
        return name;
    };
    DifferentiateComponent.prototype.sideCategorizedName = function (side) {
        var _this = this;
        side.map(function (item) {
            var names = [];
            item.children.map(function (child) {
                var name = _this.categorizedName(child);
                if (String(name).length) {
                    names.push(name);
                }
            });
            item.categorizeBy = names.length > 1 ? names.join(" - ") : names[0];
            item.collapsed = true;
        });
    };
    DifferentiateComponent.prototype.init = function () {
        var _this = this;
        if (this.leftSideObject && this.rightSideObject) {
            var left = (this.leftSideObject instanceof Array) ? this.leftSideObject : [this.leftSideObject];
            var right = (this.rightSideObject instanceof Array) ? this.rightSideObject : [this.rightSideObject];
            var comparision = this.toInternalStruction(left, right);
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
            setTimeout(function () {
                _this.ready = true;
                _this.fireCountDifference();
            }, 333);
        }
    };
    DifferentiateComponent.prototype.fireCountDifference = function () {
        var count = 0;
        this.leftSide[0].children.map(function (listItem) {
            listItem.children.map(function (item) {
                if (item.status !== DifferentiateNodeStatus.default) {
                    count++;
                }
            });
        });
        this.ondifference.emit(count);
    };
    DifferentiateComponent.prototype.lookupChildOf = function (side, parentObject, id) {
        var _this = this;
        var foundItem = undefined;
        if (side.id === id) {
            foundItem = { parent: parentObject, node: side };
        }
        else if (side.children.length) {
            side.children.map(function (item) {
                if (!foundItem) {
                    foundItem = _this.lookupChildOf(item, undefined, id);
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
    };
    DifferentiateComponent.prototype.performAdvanceToRight = function (leftSideInfo, rightSideInfo, status, i) {
        var _this = this;
        var modifiedChildren = this.leftSide[0].children[i].children;
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
        setTimeout(function () {
            _this.onadvance.emit({
                index: i,
                node: _this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
            });
            _this.fireCountDifference();
        }, 66);
    };
    DifferentiateComponent.prototype.performAdvanceToLeft = function (leftSideInfo, rightSideInfo, status, i) {
        var _this = this;
        var modifiedChildren = this.rightSide[0].children[i].children;
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
        setTimeout(function () {
            _this.onrevert.emit({
                index: i,
                node: _this.transformNodeToOriginalStructure(modifiedChildren, DifferentiateNodeType.json)
            });
            _this.fireCountDifference();
        }, 66);
    };
    DifferentiateComponent.prototype.advance = function (event) {
        var index = parseInt(event.node.path.split(",")[1]);
        if (event.type === 'advance') {
            this.performAdvanceToLeft(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.id), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.counterpart), event.node.status, index);
        }
        else {
            this.performAdvanceToRight(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.counterpart), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.id), event.node.status, index);
        }
    };
    DifferentiateComponent.prototype.autoExpand = function (event) {
        var index = parseInt(event.split(",")[1]);
        var lc = this.rightSide[0].children[index];
        var rc = this.leftSide[0].children[index];
        lc.collapsed = !lc.collapsed;
        rc.collapsed = !rc.collapsed;
    };
    DifferentiateComponent.prototype.onhover = function (event) {
        var index = parseInt(event.path.split(",")[1]);
        this.rightSide[0].children[index].children[event.index].hover = event.hover;
        this.leftSide[0].children[index].children[event.index].hover = event.hover;
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
    return DifferentiateComponent;
}());
export { DifferentiateComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Ac2VkZWgvZGlmZmVyZW50aWF0ZS8iLCJzb3VyY2VzIjpbInNyYy9hcHAvZGlmZmVyZW50aWF0ZS9jb21wb25lbnRzL2RpZmZlcmVudGlhdGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7O0dBR0c7QUFDSCxPQUFPLEVBQ0wsU0FBUyxFQUdULEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFFTCxxQkFBcUIsRUFDckIsdUJBQXVCLEVBQ3hCLE1BQU0sd0NBQXdDLENBQUM7QUFRaEQ7SUFtREU7UUEzQ0EsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFHcEIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFHckIsOEJBQXlCLEdBQUcsSUFBSSxDQUFDO1FBR2pDLHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQVM1QixvQkFBZSxHQUFHLGdCQUFnQixDQUFDO1FBR25DLHFCQUFnQixHQUFHLGlCQUFpQixDQUFDO1FBY3JDLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzlCLGNBQVMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRy9CLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztJQUlsQyxDQUFDO0lBckJELHNCQUFJLG1EQUFlO2FBQW5CLFVBQW9CLEtBQWE7WUFDL0IsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFL0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFO2dCQUNaLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUN0QztpQkFBTTtnQkFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQzthQUMvQjtRQUNILENBQUM7OztPQUFBO0lBY08s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QTRCO1FBQ3ZFLElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ3BDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDO1lBQ3RELFNBQVMsQ0FBQyxNQUFNLEdBQUcsdUJBQXVCLENBQUMsV0FBVyxDQUFDO1lBQ3ZELFFBQVEsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztZQUNwQyxTQUFTLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7U0FDckM7YUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsT0FBTyxFQUFFO1lBQzFELElBQUksUUFBUSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsS0FBSyxFQUFFO2dCQUN0QyxRQUFRLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLFlBQVksQ0FBQztnQkFDdkQsU0FBUyxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxZQUFZLENBQUM7Z0JBQ3hELFFBQVEsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsU0FBUyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQ3JDO1NBQ0Y7YUFBTSxJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUsscUJBQXFCLENBQUMsSUFBSSxFQUFFO1lBQ3ZELElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsSUFBSSxFQUFFO2dCQUNwQyxRQUFRLENBQUMsTUFBTSxHQUFHLHVCQUF1QixDQUFDLFdBQVcsQ0FBQztnQkFDdEQsU0FBUyxDQUFDLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxXQUFXLENBQUM7Z0JBQ3ZELFFBQVEsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDcEMsU0FBUyxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsRUFBRSxDQUFDO2FBQ3JDO1lBQ0QsSUFBSSxRQUFRLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxLQUFL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LENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDN0UsQ0FBQztJQTNtQkQ7UUFEQyxLQUFLLENBQUMsYUFBYSxDQUFDOytEQUNEO0lBR3BCO1FBREMsS0FBSyxDQUFDLGNBQWMsQ0FBQztnRUFDRDtJQUdyQjtRQURDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQzs2RUFDRjtJQUdqQztRQURDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQzt1RUFDRDtJQUc1QjtRQURDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQztrRUFDVjtJQUdkO1FBREMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO21FQUNUO0lBR2hCO1FBREMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO21FQUNVO0lBR25DO1FBREMsS0FBSyxDQUFDLGtCQUFrQixDQUFDO29FQUNXO0lBR3JDO1FBREMsS0FBSyxDQUFDLGlCQUFpQixDQUFDO2lFQVN4QjtJQUdEO1FBREMsTUFBTSxDQUFDLFVBQVUsQ0FBQzs0REFDVztJQUc5QjtRQURDLE1BQU0sQ0FBQyxXQUFXLENBQUM7NkRBQ1c7SUFHL0I7UUFEQyxNQUFNLENBQUMsY0FBYyxDQUFDO2dFQUNXO0lBakR2QixzQkFBc0I7UUFMbEMsU0FBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGVBQWU7WUFDekIsZ3REQUE2Qzs7U0FFOUMsQ0FBQztPQUNXLHNCQUFzQixDQW9uQmxDO0lBQUQsNkJBQUM7Q0FBQSxBQXBuQkQsSUFvbkJDO1NBcG5CWSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBDb21wYXJpc2lvbiBUb29sIHdpbGwgbGF5b3V0IHR3byBjb21wYXJpc2lvbiB0cmVlcyBzaWRlIGJ5IHNpZGUgYW5kIGZlZWQgdGhlbSBhbiBpbnRlcm5hbCBvYmplY3RcclxuICogaGVpcmFyY2h5IGNyZWF0ZWQgZm9yIGludGVybmFsIHVzZSBmcm9tIEpTT04gb2JqZWN0cyBnaXZlbiB0byB0aGlzIGNvbXBvbmVudC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEaWZmZXJlbnRpYXRlTm9kZSxcclxuICBEaWZmZXJlbnRpYXRlTm9kZVR5cGUsXHJcbiAgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXNcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL2RpZmZlcmVudGlhdGUuaW50ZXJmYWNlcyc7XHJcbmltcG9ydCB7IFRocm93U3RtdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbXBpbGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZGlmZmVyZW50aWF0ZScsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL2RpZmZlcmVudGlhdGUuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL2RpZmZlcmVudGlhdGUuY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIERpZmZlcmVudGlhdGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcbiAgXHJcbiAgbGVmdFNpZGU7XHJcbiAgcmlnaHRTaWRlO1xyXG4gIHJlYWR5OiBib29sZWFuO1xyXG4gIGNhdGVnb3JpemVCeTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcImFsbG93UmV2ZXJ0XCIpXHJcbiAgYWxsb3dSZXZlcnQgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwiYWxsb3dBZHZhbmNlXCIpXHJcbiAgYWxsb3dBZHZhbmNlID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcImF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnRcIilcclxuICBhdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50ID0gdHJ1ZTtcclxuXHJcbiAgQElucHV0KFwib25seVNob3dEaWZmZXJlbmNlc1wiKVxyXG4gIG9ubHlTaG93RGlmZmVyZW5jZXMgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KFwibGVmdFNpZGVPYmplY3RcIilcclxuICBsZWZ0U2lkZU9iamVjdFxyXG5cclxuICBASW5wdXQoXCJyaWdodFNpZGVPYmplY3RcIilcclxuICByaWdodFNpZGVPYmplY3Q7XHJcblxyXG4gIEBJbnB1dChcImxlZnRTaWRlVG9vbFRpcFwiKVxyXG4gIGxlZnRTaWRlVG9vbFRpcCA9IFwidGFrZSBsZWZ0IHNpZGVcIjtcclxuXHJcbiAgQElucHV0KFwicmlnaHRTaWRlVG9vbFRpcFwiKVxyXG4gIHJpZ2h0U2lkZVRvb2xUaXAgPSBcInRha2UgcmlnaHQgc2lkZVwiO1xyXG5cclxuICBASW5wdXQoJ25hbWVkUm9vdE9iamVjdCcpXHJcbiAgc2V0IG5hbWVkUm9vdE9iamVjdCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICBsZXQgeCA9IHZhbHVlLnJlcGxhY2UoXCIgXCIsIFwiXCIpO1xyXG5cclxuICAgIGlmICh4Lmxlbmd0aCkge1xyXG4gICAgICB0aGlzLmNhdGVnb3JpemVCeSA9IHZhbHVlLnNwbGl0KFwiLFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2F0ZWdvcml6ZUJ5ID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQE91dHB1dChcIm9ucmV2ZXJ0XCIpXHJcbiAgb25yZXZlcnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmFkdmFuY2VcIilcclxuICBvbmFkdmFuY2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIEBPdXRwdXQoXCJvbmRpZmZlcmVuY2VcIilcclxuICBvbmRpZmZlcmVuY2UgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFx0KSB7XHJcblx0ICBcclxuICB9XHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZU5vZGVJZCgpIHtcclxuICAgIGNvbnN0IG1pbiA9IDE7XHJcbiAgICBjb25zdCBtYXggPSAxMDAwMFxyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XHJcbiAgfVxyXG4gIHByaXZhdGUgdHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUobm9kZSwgcGFyZW50KSB7XHJcbiAgICBsZXQganNvbiA9IHt9O1xyXG4gICAgbGV0IGFycmF5ID0gW107XHJcblxyXG4gICAgbm9kZS5tYXAoIChpdGVtOiBEaWZmZXJlbnRpYXRlTm9kZSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgICBpZiAocGFyZW50ID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbikgeyAgICBcclxuICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIpIHtcclxuICAgICAgICAgICAganNvbltpdGVtLm5hbWVdID0gaXRlbS52YWx1ZTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5uYW1lLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgIGpzb25baXRlbS5uYW1lXSA9IHg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAganNvbiA9IFt4XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKSB7XHJcbiAgICAgICAgICAgIGpzb25baXRlbS5uYW1lXSA9IHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAocGFyZW50ID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpe1xyXG4gICAgICAgICAgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtLnZhbHVlKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbikge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudHJhbnNmb3JtTm9kZVRvT3JpZ2luYWxTdHJ1Y3R1cmUoaXRlbS5jaGlsZHJlbiwgaXRlbS5wYXJlbnQpKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0uY2hpbGRyZW4sIGl0ZW0ucGFyZW50KSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcnJheS5sZW5ndGggPyBhcnJheSA6IGpzb247XHJcbiAgfVxyXG4gIHByaXZhdGUgdHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obm9kZSkge1xyXG4gICAgbGV0IHJlc3VsdCA9IG5vZGU7XHJcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuOiBEaWZmZXJlbnRpYXRlTm9kZVtdID0gW107XHJcbiAgICAgIGNvbnN0IHAgPSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXk7XHJcbiAgICAgIG5vZGUubWFwKCAoaXRlbSwgaSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGpzb25WYWx1ZTogYW55ID0gdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihpdGVtKTtcclxuICAgICAgICBpZiAoanNvblZhbHVlIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50KSB7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5zb3J0KChhLGIpID0+IHtyZXR1cm4gYS5uYW1lIDw9IGIubmFtZSA/IC0xOiAxfSk7XHJcbiAgICAgICAgICAgIGpzb25WYWx1ZS5tYXAoICh4OiBEaWZmZXJlbnRpYXRlTm9kZSwgaSkgPT57XHJcbiAgICAgICAgICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgeC5hbHROYW1lID0gXCJcIiArIGk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBqc29uVmFsdWVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZToganNvblZhbHVlLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsLFxyXG4gICAgICAgICAgICBzdGF0dXM6IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSAgICAgIFxyXG4gICAgICB9KTtcclxuICAgICAgcmVzdWx0ID0gY2hpbGRyZW47XHJcbiAgICB9IGVsc2UgaWYgKG5vZGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcclxuICAgICAgY29uc3QgbGlzdCA9IE9iamVjdC5rZXlzKG5vZGUpO1xyXG4gICAgICBjb25zdCBjaGlsZHJlbjogRGlmZmVyZW50aWF0ZU5vZGVbXSA9IFtdO1xyXG4gICAgICBjb25zdCBwID0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb247XHJcbiAgICAgIGlmICghdGhpcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50KSB7XHJcbiAgICAgICAgbGlzdC5zb3J0KChhLGIpID0+IHtyZXR1cm4gYSA8PSBiID8gLTE6IDF9KTtcclxuICAgICAgfVxyXG4gICAgICBsaXN0Lm1hcCggKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICBjb25zdCBqc29uVmFsdWU6IGFueSA9IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obm9kZVtpdGVtXSk7XHJcbiAgICAgICAgaWYgKGpzb25WYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCkge1xyXG4gICAgICAgICAgICBqc29uVmFsdWUuc29ydCgoYSxiKSA9PiB7cmV0dXJuIGEubmFtZSA8PSBiLm5hbWUgPyAtMTogMX0pO1xyXG4gICAgICAgICAgICBqc29uVmFsdWUubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+IHtcclxuICAgICAgICAgICAgICB4LmluZGV4ID0gaTtcclxuICAgICAgICAgICAgICB4LmFsdE5hbWUgPSBcIlwiICsgaTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjaGlsZHJlbi5wdXNoKHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgICAgIG5hbWU6IGl0ZW0sXHJcbiAgICAgICAgICAgIGFsdE5hbWU6IFwiXCIgKyBpLFxyXG4gICAgICAgICAgICB2YWx1ZTogXCJcIixcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbixcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjoganNvblZhbHVlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBpdGVtLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IGpzb25WYWx1ZSxcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpcixcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHJlc3VsdCA9IGNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXRlbUluQXJyYXkoc2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSwgbm9kZTogRGlmZmVyZW50aWF0ZU5vZGUpIHtcclxuICAgIGxldCByZXN1bHQ6IERpZmZlcmVudGlhdGVOb2RlO1xyXG4gICAgY29uc3Qga2V5ID0gbm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCA/XHJcbiAgICAgICAgICAgICAgICAobm9kZS52YWx1ZSA/IFN0cmluZyhub2RlLnZhbHVlKS50b1VwcGVyQ2FzZSgpIDogXCJcIikgOlxyXG4gICAgICAgICAgICAgICAgbm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkgP1xyXG4gICAgICAgICAgICAgICAgbm9kZS5hbHROYW1lIDpcclxuICAgICAgICAgICAgICAgIG5vZGUubmFtZTtcclxuXHJcbiAgICBzaWRlLm1hcCggKGl0ZW06IERpZmZlcmVudGlhdGVOb2RlKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgICAgaWYgKGl0ZW0udmFsdWUgJiYgU3RyaW5nKGl0ZW0udmFsdWUpLnRvVXBwZXJDYXNlKCkgPT09IGtleSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICB9ICBcclxuICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICAgIGlmIChpdGVtLmFsdE5hbWUgPT09IGtleSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gaXRlbTtcclxuICAgICAgICB9ICBcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoaXRlbS5uYW1lID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxlZnRJdGVtRnJvbVJpZ2h0SXRlbShsZWZ0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUsIHJpZ2h0Tm9kZTogRGlmZmVyZW50aWF0ZU5vZGUpIHtcclxuICAgIGxldCByZXN1bHQ6IERpZmZlcmVudGlhdGVOb2RlO1xyXG4gICAgaWYgKCFsZWZ0Tm9kZSB8fCAhcmlnaHROb2RlKSB7XHJcbiAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBrZXkgPSByaWdodE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwgP1xyXG4gICAgICAgICAgICAgICAgICAgIChyaWdodE5vZGUudmFsdWUgPyByaWdodE5vZGUudmFsdWUudG9VcHBlckNhc2UoKSA6IFwiXCIpIDpcclxuICAgICAgICAgICAgICAgICAgICByaWdodE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5ID9cclxuICAgICAgICAgICAgICAgICAgICByaWdodE5vZGUuYWx0TmFtZSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLm5hbWU7XHJcblxyXG4gICAgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS52YWx1ZSAmJiBTdHJpbmcobGVmdE5vZGUudmFsdWUpLnRvVXBwZXJDYXNlKCkgPT09IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGxlZnROb2RlO1xyXG4gICAgICB9ICBcclxuICAgIH0gZWxzZSBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5hbHROYW1lID09PSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSBsZWZ0Tm9kZTtcclxuICAgICAgfSAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobGVmdE5vZGUubmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbGVmdE5vZGU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbXBhcmUobGVmdE5vZGU6IERpZmZlcmVudGlhdGVOb2RlLCByaWdodE5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBpZiAobGVmdE5vZGUudHlwZSAhPT0gcmlnaHROb2RlLnR5cGUpIHtcclxuICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQ7XHJcbiAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZDtcclxuICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgfSBlbHNlIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUgIT09IHJpZ2h0Tm9kZS52YWx1ZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyKSB7XHJcbiAgICAgIGlmIChsZWZ0Tm9kZS5uYW1lICE9PSByaWdodE5vZGUubmFtZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUgIT09IHJpZ2h0Tm9kZS52YWx1ZSkge1xyXG4gICAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobGVmdE5vZGUubmFtZSAhPT0gcmlnaHROb2RlLm5hbWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51bmlmeShsZWZ0Tm9kZS5jaGlsZHJlbiwgcmlnaHROb2RlLmNoaWxkcmVuKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSByZUluZGV4KGxpc3Q6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGxpc3QubWFwKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgIGl0ZW0uaW5kZXggPSBpO1xyXG4gICAgICB0aGlzLnJlSW5kZXgoaXRlbS5jaGlsZHJlbik7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjb3B5SW50byhcclxuICAgICAgICAgICAgICBzaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLFxyXG4gICAgICAgICAgICAgIGl0ZW06IERpZmZlcmVudGlhdGVOb2RlLFxyXG4gICAgICAgICAgICAgIGluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cykge1xyXG4gICAgXHJcbiAgICBpZiAoaXRlbSkge1xyXG4gICAgICBjb25zdCBuZXdJdGVtID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShpdGVtKSk7XHJcbiAgICAgIHNpZGUuc3BsaWNlKGluZGV4LCAwLCBuZXdJdGVtKTtcclxuICAgICAgdGhpcy5yZUluZGV4KHNpZGUpO1xyXG4gIFxyXG4gICAgICBpdGVtLnN0YXR1cyA9IHN0YXR1cztcclxuICAgICAgbmV3SXRlbS5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIGl0ZW0uY291bnRlcnBhcnQgPSBuZXdJdGVtLmlkO1xyXG4gICAgICBuZXdJdGVtLmNvdW50ZXJwYXJ0ID0gaXRlbS5pZDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhpdGVtLmNoaWxkcmVuLCBzdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobmV3SXRlbS5jaGlsZHJlbiwgc3RhdHVzKVxyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHNldENoaWxkcmVuU3RhdHVzKGxpc3QsIHN0YXR1cyl7XHJcbiAgICBsaXN0Lm1hcCggKHgpID0+IHtcclxuICAgICAgeC5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMoeC5jaGlsZHJlbiwgc3RhdHVzKVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgdW5pZnkobGVmdFNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10sIHJpZ2h0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSkge1xyXG4gICAgbGV0IGkgPSAwLCBqID0gMCwgbG9vcGluZyA9IHRydWU7XHJcblxyXG4gICAgd2hpbGUgKGxvb3BpbmcpIHtcclxuICAgICAgbGV0IGxlZnRJdGVtSW5SaWdodFNpZGU6IERpZmZlcmVudGlhdGVOb2RlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IHRoaXMuaXRlbUluQXJyYXkocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIGxldCByaWdodEl0ZW1JbkxlZnRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gdGhpcy5pdGVtSW5BcnJheShsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdKSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgIGlmICghbGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKCFyaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFyaWdodEl0ZW1JbkxlZnRTaWRlICYmIGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKCFsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIHdoaWxlIChqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoIWxlZnRJdGVtSW5SaWdodFNpZGUpIHtcclxuICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyByaWdodFNpZGVbal0gOiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFyaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgcmlnaHRJdGVtSW5MZWZ0U2lkZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyBsZWZ0U2lkZVtpXSA6IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBsZWZ0SXRlbUluUmlnaHRTaWRlLmluZGV4ICE9PSBpKSB7XHJcbiAgICAgICAgd2hpbGUgKGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSB0aGlzLmxlZnRJdGVtRnJvbVJpZ2h0SXRlbShyaWdodFNpZGVbaV0sIGxlZnRTaWRlW2ldKTtcclxuICAgICAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlKSB7XHJcbiAgICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHJpZ2h0U2lkZVtqXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gIFxyXG4gICAgICB9XHJcbiAgICAgIGlmIChyaWdodEl0ZW1JbkxlZnRTaWRlICYmIHJpZ2h0SXRlbUluTGVmdFNpZGUuaW5kZXggIT09IGopIHtcclxuICAgICAgICB3aGlsZSAoaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSB0aGlzLmxlZnRJdGVtRnJvbVJpZ2h0SXRlbShsZWZ0U2lkZVtqXSwgcmlnaHRTaWRlW2pdKTtcclxuICAgICAgICAgIGlmIChyaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlICYmIGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuaXRlbUluQXJyYXkocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSk7XHJcbiAgICAgICAgaWYgKHggJiYgeC5pbmRleCAhPT0gbGVmdEl0ZW1JblJpZ2h0U2lkZS5pbmRleCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gcmlnaHRTaWRlW2pdIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiBqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGxldCB4ID0gdGhpcy5pdGVtSW5BcnJheShsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdKTtcclxuICAgICAgICBpZiAoeCAmJiB4LmluZGV4ICE9PSByaWdodEl0ZW1JbkxlZnRTaWRlLmluZGV4KSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChsZWZ0SXRlbUluUmlnaHRTaWRlICYmIHJpZ2h0SXRlbUluTGVmdFNpZGUpIHtcclxuICAgICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZS5wYXJlbnQgIT09IHJpZ2h0SXRlbUluTGVmdFNpZGUucGFyZW50KSB7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKGxlZnRTaWRlLCByaWdodFNpZGVbal0sIGosIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKTtcclxuICAgICAgICAgIHRoaXMuY29weUludG8ocmlnaHRTaWRlLCBsZWZ0U2lkZVtpXSwgaSwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29tcGFyZShsZWZ0SXRlbUluUmlnaHRTaWRlLCByaWdodEl0ZW1JbkxlZnRTaWRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaisrO2krKztcclxuICAgICAgfVxyXG4gICAgICBsb29waW5nID0gKGkgPCBsZWZ0U2lkZS5sZW5ndGggfHwgaiA8IHJpZ2h0U2lkZS5sZW5ndGgpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdE5vZGUsIHJpZ2h0Tm9kZSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0ge1xyXG4gICAgICBsZWZ0U2lkZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihsZWZ0Tm9kZSksXHJcbiAgICAgIHJpZ2h0U2lkZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9JbnRlcm5hbFN0cnVjdGlvbihyaWdodE5vZGUpXHJcbiAgICB9O1xyXG4gICAgdGhpcy51bmlmeShyZXN1bHQubGVmdFNpZGUsIHJlc3VsdC5yaWdodFNpZGUpO1xyXG5cclxuICAgIGlmICh0aGlzLm9ubHlTaG93RGlmZmVyZW5jZXMpIHtcclxuICAgICAgcmVzdWx0LmxlZnRTaWRlID0gdGhpcy5maWx0ZXJVbmNoYW5nZWQocmVzdWx0LmxlZnRTaWRlKTtcclxuICAgICAgcmVzdWx0LnJpZ2h0U2lkZSA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKHJlc3VsdC5yaWdodFNpZGUpO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcHJpdmF0ZSBmaWx0ZXJVbmNoYW5nZWQobGlzdDogRGlmZmVyZW50aWF0ZU5vZGVbXSkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gW107XHJcbiAgICBcclxuICAgIGxpc3QubWFwKCAoaXRlbSkgPT4ge1xyXG4gICAgICBpdGVtLmNoaWxkcmVuID0gdGhpcy5maWx0ZXJVbmNoYW5nZWQoaXRlbS5jaGlsZHJlbik7XHJcbiAgICAgIGlmICgoaXRlbS50eXBlID4gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIgJiYgaXRlbS5jaGlsZHJlbi5sZW5ndGgpIHx8XHJcbiAgICAgICAgICBpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCkge1xyXG4gICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJlc3VsdC5tYXAoICh4OiBEaWZmZXJlbnRpYXRlTm9kZSwgaSkgPT4ge1xyXG4gICAgICB4LmluZGV4ID0gaTtcclxuICAgICAgeC5hbHROYW1lID0gXCJcIiArIGk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcbiAgICBpZiAoY2hhbmdlcy5hdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50IHx8XHJcbiAgICAgIGNoYW5nZXMub25seVNob3dEaWZmZXJlbmNlcyB8fFxyXG4gICAgICBjaGFuZ2VzLmxlZnRTaWRlT2JqZWN0IHx8XHJcbiAgICAgIGNoYW5nZXMubmFtZWRSb290T2JqZWN0IHx8XHJcbiAgICAgIGNoYW5nZXMucmlnaHRTaWRlT2JqZWN0KSB7XHJcbiAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgdGhpcy5uZ09uSW5pdCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpPT50aGlzLmluaXQoKSw2NjYpO1xyXG4gIH1cclxuICBwcml2YXRlIGNhdGVnb3JpemVkTmFtZShpdGVtKSB7XHJcbiAgICBsZXQgbmFtZSA9IFwiXCI7XHJcbiAgICB0aGlzLmNhdGVnb3JpemVCeS5tYXAoKGNhdGVnb3J5KSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLm5hbWUgPT09IGNhdGVnb3J5KSB7XHJcbiAgICAgICAgbmFtZSA9IGl0ZW0udmFsdWU7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG5hbWU7XHJcbiAgfVxyXG4gIHByaXZhdGUgc2lkZUNhdGVnb3JpemVkTmFtZShzaWRlKSB7XHJcbiAgICBzaWRlLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgbmFtZXMgPSBbXTtcclxuICAgICAgaXRlbS5jaGlsZHJlbi5tYXAoKGNoaWxkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMuY2F0ZWdvcml6ZWROYW1lKGNoaWxkKTtcclxuICAgICAgICBpZihTdHJpbmcobmFtZSkubGVuZ3RoKSB7XHJcbiAgICAgICAgICBuYW1lcy5wdXNoKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIGl0ZW0uY2F0ZWdvcml6ZUJ5ID0gbmFtZXMubGVuZ3RoID4gMSA/IG5hbWVzLmpvaW4oXCIgLSBcIikgOiBuYW1lc1swXTtcclxuICAgICAgaXRlbS5jb2xsYXBzZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgaW5pdCgpIHtcclxuICAgIGlmICh0aGlzLmxlZnRTaWRlT2JqZWN0ICYmIHRoaXMucmlnaHRTaWRlT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGxlZnQgPSAodGhpcy5sZWZ0U2lkZU9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSAgPyB0aGlzLmxlZnRTaWRlT2JqZWN0IDogW3RoaXMubGVmdFNpZGVPYmplY3RdXHJcbiAgICAgIGNvbnN0IHJpZ2h0ID0gKHRoaXMucmlnaHRTaWRlT2JqZWN0IGluc3RhbmNlb2YgQXJyYXkpICA/IHRoaXMucmlnaHRTaWRlT2JqZWN0IDogW3RoaXMucmlnaHRTaWRlT2JqZWN0XVxyXG4gICAgICBjb25zdCBjb21wYXJpc2lvbiA9IHRoaXMudG9JbnRlcm5hbFN0cnVjdGlvbihsZWZ0LCByaWdodCk7XHJcbiAgICAgIGlmICh0aGlzLmNhdGVnb3JpemVCeSkge1xyXG4gICAgICAgIHRoaXMuc2lkZUNhdGVnb3JpemVkTmFtZShjb21wYXJpc2lvbi5sZWZ0U2lkZSk7XHJcbiAgICAgICAgdGhpcy5zaWRlQ2F0ZWdvcml6ZWROYW1lKGNvbXBhcmlzaW9uLnJpZ2h0U2lkZSk7XHJcbiAgICAgIH0gIFxyXG4gICAgICB0aGlzLmxlZnRTaWRlID0gW3tcclxuICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgdmFsdWU6IFwiUm9vdFwiLFxyXG4gICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgIHBhcmVudDogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICBleHBhbmRlZDogdHJ1ZSxcclxuICAgICAgICBpc1Jvb3Q6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IGNvbXBhcmlzaW9uLmxlZnRTaWRlXHJcbiAgICAgIH1dO1xyXG4gICAgICB0aGlzLnJpZ2h0U2lkZT0gW3tcclxuICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgIG5hbWU6IFwiXCIsXHJcbiAgICAgICAgdmFsdWU6IFwiUm9vdFwiLFxyXG4gICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgIHBhcmVudDogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5LFxyXG4gICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICBleHBhbmRlZDogdHJ1ZSxcclxuICAgICAgICBpc1Jvb3Q6IHRydWUsXHJcbiAgICAgICAgY2hpbGRyZW46IGNvbXBhcmlzaW9uLnJpZ2h0U2lkZVxyXG4gICAgICB9XTtcclxuICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgICB9LDMzMyk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgZmlyZUNvdW50RGlmZmVyZW5jZSgpIHtcclxuICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuLm1hcCggKGxpc3RJdGVtKSA9PiB7XHJcbiAgICAgIGxpc3RJdGVtLmNoaWxkcmVuLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICBpZihpdGVtLnN0YXR1cyAhPT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCkge1xyXG4gICAgICAgICAgY291bnQrKztcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIHRoaXMub25kaWZmZXJlbmNlLmVtaXQoY291bnQpO1xyXG4gIH1cclxuICBwcml2YXRlIGxvb2t1cENoaWxkT2Yoc2lkZSwgcGFyZW50T2JqZWN0LCBpZCkge1xyXG4gICAgbGV0IGZvdW5kSXRlbSA9IHVuZGVmaW5lZDtcclxuICAgIGlmIChzaWRlLmlkID09PSBpZCkge1xyXG4gICAgICBmb3VuZEl0ZW0gPSB7cGFyZW50OiBwYXJlbnRPYmplY3QsIG5vZGU6IHNpZGV9O1xyXG4gICAgfSBlbHNlIGlmIChzaWRlLmNoaWxkcmVuLmxlbmd0aCkge1xyXG4gICAgICBzaWRlLmNoaWxkcmVuLm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgICBpZiAoIWZvdW5kSXRlbSkge1xyXG4gICAgICAgICAgZm91bmRJdGVtID0gdGhpcy5sb29rdXBDaGlsZE9mKGl0ZW0sIHVuZGVmaW5lZCwgaWQpO1xyXG4gICAgICAgICAgaWYgKGZvdW5kSXRlbSAmJiBmb3VuZEl0ZW0ucGFyZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm91bmRJdGVtLnBhcmVudCA9IHNpZGU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kSXRlbSA9IHtwYXJlbnQ6IHNpZGUsIG5vZGU6IGl0ZW19O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IFxyXG4gICAgcmV0dXJuIGZvdW5kSXRlbTtcclxuICB9XHJcbiAgcHJpdmF0ZSBwZXJmb3JtQWR2YW5jZVRvUmlnaHQobGVmdFNpZGVJbmZvLCByaWdodFNpZGVJbmZvLCBzdGF0dXMsIGkpIHtcclxuICAgIGNvbnN0IG1vZGlmaWVkQ2hpbGRyZW4gPSB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2ldLmNoaWxkcmVuO1xyXG4gICAgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMucmVtb3ZlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuLnNwbGljZShsZWZ0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuLnNwbGljZShyaWdodFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICB0aGlzLnJlSW5kZXgobGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbik7XHJcbiAgICAgIHRoaXMucmVJbmRleChyaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbik7XHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUubmFtZSA9IHJpZ2h0U2lkZUluZm8ubm9kZS5uYW1lO1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQpIHtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnZhbHVlID0gbGVmdFNpZGVJbmZvLm5vZGUudmFsdWU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnR5cGUgPSByaWdodFNpZGVJbmZvLm5vZGUudHlwZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4gPSByaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW47XHJcbiAgICB9XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+e1xyXG4gICAgICB0aGlzLm9uYWR2YW5jZS5lbWl0KHtcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICBub2RlOiB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKG1vZGlmaWVkQ2hpbGRyZW4sIERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5maXJlQ291bnREaWZmZXJlbmNlKCk7XHJcbiAgICB9LCA2Nik7XHJcbiAgfVxyXG4gIHByaXZhdGUgcGVyZm9ybUFkdmFuY2VUb0xlZnQobGVmdFNpZGVJbmZvLCByaWdodFNpZGVJbmZvLCBzdGF0dXMsIGkpIHtcclxuICAgIGNvbnN0IG1vZGlmaWVkQ2hpbGRyZW4gPSB0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpXS5jaGlsZHJlbjtcclxuICAgIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmFkZGVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UobGVmdFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICByaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UocmlnaHRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgdGhpcy5yZUluZGV4KGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgICB0aGlzLnJlSW5kZXgocmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkKSB7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5uYW1lID0gbGVmdFNpZGVJbmZvLm5vZGUubmFtZTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnZhbHVlID0gcmlnaHRTaWRlSW5mby5ub2RlLnZhbHVlO1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZCkge1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUudHlwZSA9IGxlZnRTaWRlSW5mby5ub2RlLnR5cGU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiA9IGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PntcclxuICAgICAgdGhpcy5vbnJldmVydC5lbWl0KHtcclxuICAgICAgICBpbmRleDogaSxcclxuICAgICAgICBub2RlOiB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKG1vZGlmaWVkQ2hpbGRyZW4sIERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uKVxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5maXJlQ291bnREaWZmZXJlbmNlKCk7XHJcbiAgICB9LCA2Nik7XHJcbiAgfVxyXG4gIGFkdmFuY2UoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQubm9kZS5wYXRoLnNwbGl0KFwiLFwiKVsxXSk7XHJcblxyXG4gICAgaWYgKGV2ZW50LnR5cGUgPT09ICdhZHZhbmNlJykge1xyXG4gICAgICB0aGlzLnBlcmZvcm1BZHZhbmNlVG9MZWZ0KFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XSwgdGhpcy5sZWZ0U2lkZVswXSwgZXZlbnQubm9kZS5pZCksIFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMucmlnaHRTaWRlWzBdLCBldmVudC5ub2RlLmNvdW50ZXJwYXJ0KSwgXHJcbiAgICAgICAgZXZlbnQubm9kZS5zdGF0dXMsIGluZGV4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGVyZm9ybUFkdmFuY2VUb1JpZ2h0KFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XSwgdGhpcy5sZWZ0U2lkZVswXSwgZXZlbnQubm9kZS5jb3VudGVycGFydCksIFxyXG4gICAgICAgIHRoaXMubG9va3VwQ2hpbGRPZih0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMucmlnaHRTaWRlWzBdLCBldmVudC5ub2RlLmlkKSwgXHJcbiAgICAgICAgZXZlbnQubm9kZS5zdGF0dXMsIGluZGV4KTtcclxuICAgIH1cclxuICB9XHJcbiAgYXV0b0V4cGFuZChldmVudCkge1xyXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChldmVudC5zcGxpdChcIixcIilbMV0pO1xyXG4gICAgY29uc3QgbGMgPSB0aGlzLnJpZ2h0U2lkZVswXS5jaGlsZHJlbltpbmRleF07XHJcbiAgICBjb25zdCByYyA9IHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgXHJcbiAgICBsYy5jb2xsYXBzZWQgPSAhbGMuY29sbGFwc2VkO1xyXG4gICAgcmMuY29sbGFwc2VkID0gIXJjLmNvbGxhcHNlZDtcclxuICB9XHJcbiAgb25ob3ZlcihldmVudCkge1xyXG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludChldmVudC5wYXRoLnNwbGl0KFwiLFwiKVsxXSk7XHJcblxyXG4gICAgdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLmNoaWxkcmVuW2V2ZW50LmluZGV4XS5ob3ZlciA9IGV2ZW50LmhvdmVyO1xyXG4gICAgdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0uY2hpbGRyZW5bZXZlbnQuaW5kZXhdLmhvdmVyID0gZXZlbnQuaG92ZXI7XHJcbiAgfVxyXG59XHJcbiJdfQ==