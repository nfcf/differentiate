/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
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
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            /** @type {?} */
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
    /**
     * @return {?}
     */
    DifferentiateComponent.prototype.generateNodeId = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var min = 1;
        /** @type {?} */
        var max = 10000;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    /**
     * @param {?} node
     * @param {?} parent
     * @return {?}
     */
    DifferentiateComponent.prototype.transformNodeToOriginalStructure = /**
     * @param {?} node
     * @param {?} parent
     * @return {?}
     */
    function (node, parent) {
        var _this = this;
        /** @type {?} */
        var json = {};
        /** @type {?} */
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
                        /** @type {?} */
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
                        array.push(_this.transformNodeToOriginalStructure(item, item.parent));
                    }
                    else if (item.type === DifferentiateNodeType.array) {
                        array.push(_this.transformNodeToOriginalStructure(item.children, item.parent));
                    }
                }
            }
        });
        return array.length ? array : json;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DifferentiateComponent.prototype.transformNodeToInternalStruction = /**
     * @param {?} node
     * @return {?}
     */
    function (node) {
        var _this = this;
        /** @type {?} */
        var result = node;
        if (node instanceof Array) {
            /** @type {?} */
            var children_1 = [];
            /** @type {?} */
            var p_1 = DifferentiateNodeType.array;
            node.map(function (item, i) {
                /** @type {?} */
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
            /** @type {?} */
            var list = Object.keys(node);
            /** @type {?} */
            var children_2 = [];
            /** @type {?} */
            var p_2 = DifferentiateNodeType.json;
            if (!this.attributeOrderIsImportant) {
                list.sort(function (a, b) { return a <= b ? -1 : 1; });
            }
            list.map(function (item, i) {
                /** @type {?} */
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
    /**
     * @param {?} side
     * @param {?} node
     * @return {?}
     */
    DifferentiateComponent.prototype.itemInArray = /**
     * @param {?} side
     * @param {?} node
     * @return {?}
     */
    function (side, node) {
        /** @type {?} */
        var result;
        /** @type {?} */
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
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    DifferentiateComponent.prototype.leftItemFromRightItem = /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    function (leftNode, rightNode) {
        /** @type {?} */
        var result;
        if (!leftNode || !rightNode) {
            return result;
        }
        /** @type {?} */
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
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    DifferentiateComponent.prototype.compare = /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    function (leftNode, rightNode) {
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
    /**
     * @param {?} list
     * @return {?}
     */
    DifferentiateComponent.prototype.reIndex = /**
     * @param {?} list
     * @return {?}
     */
    function (list) {
        var _this = this;
        list.map(function (item, i) {
            item.index = i;
            _this.reIndex(item.children);
        });
    };
    /**
     * @param {?} side
     * @param {?} item
     * @param {?} index
     * @param {?} status
     * @return {?}
     */
    DifferentiateComponent.prototype.copyInto = /**
     * @param {?} side
     * @param {?} item
     * @param {?} index
     * @param {?} status
     * @return {?}
     */
    function (side, item, index, status) {
        if (item) {
            /** @type {?} */
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
    /**
     * @param {?} list
     * @param {?} status
     * @return {?}
     */
    DifferentiateComponent.prototype.setChildrenStatus = /**
     * @param {?} list
     * @param {?} status
     * @return {?}
     */
    function (list, status) {
        var _this = this;
        list.map(function (x) {
            x.status = status;
            _this.setChildrenStatus(x.children, status);
        });
    };
    /**
     * @param {?} leftSide
     * @param {?} rightSide
     * @return {?}
     */
    DifferentiateComponent.prototype.unify = /**
     * @param {?} leftSide
     * @param {?} rightSide
     * @return {?}
     */
    function (leftSide, rightSide) {
        /** @type {?} */
        var i = 0;
        /** @type {?} */
        var j = 0;
        /** @type {?} */
        var looping = true;
        while (looping) {
            /** @type {?} */
            var leftItemInRightSide = i < leftSide.length ? this.itemInArray(rightSide, leftSide[i]) : undefined;
            /** @type {?} */
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
                /** @type {?} */
                var x = this.itemInArray(rightSide, leftSide[i]);
                if (x && x.index !== leftItemInRightSide.index) {
                    this.copyInto(leftSide, rightSide[j], j, DifferentiateNodeStatus.added);
                    j++;
                    i++;
                    leftItemInRightSide = j < rightSide.length ? rightSide[j] : undefined;
                }
            }
            if (rightItemInLeftSide && j < rightSide.length) {
                /** @type {?} */
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
    /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    DifferentiateComponent.prototype.toInternalStruction = /**
     * @param {?} leftNode
     * @param {?} rightNode
     * @return {?}
     */
    function (leftNode, rightNode) {
        /** @type {?} */
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
    /**
     * @param {?} list
     * @return {?}
     */
    DifferentiateComponent.prototype.filterUnchanged = /**
     * @param {?} list
     * @return {?}
     */
    function (list) {
        var _this = this;
        /** @type {?} */
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
    /**
     * @param {?} changes
     * @return {?}
     */
    DifferentiateComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes.attributeOrderIsImportant ||
            changes.onlyShowDifferences ||
            changes.leftSideObject ||
            changes.namedRootObject ||
            changes.rightSideObject) {
            this.ready = false;
            this.ngOnInit();
        }
    };
    /**
     * @return {?}
     */
    DifferentiateComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        setTimeout(function () { return _this.init(); }, 666);
    };
    /**
     * @param {?} item
     * @return {?}
     */
    DifferentiateComponent.prototype.categorizedName = /**
     * @param {?} item
     * @return {?}
     */
    function (item) {
        /** @type {?} */
        var name = "";
        this.categorizeBy.map(function (category) {
            if (item.name === category) {
                name = item.value;
            }
        });
        return name;
    };
    /**
     * @param {?} side
     * @return {?}
     */
    DifferentiateComponent.prototype.sideCategorizedName = /**
     * @param {?} side
     * @return {?}
     */
    function (side) {
        var _this = this;
        side.map(function (item) {
            /** @type {?} */
            var names = [];
            item.children.map(function (child) {
                /** @type {?} */
                var name = _this.categorizedName(child);
                if (String(name).length) {
                    names.push(name);
                }
            });
            item.categorizeBy = names.length > 1 ? names.join(" - ") : names[0];
            item.collapsed = true;
        });
    };
    /**
     * @return {?}
     */
    DifferentiateComponent.prototype.init = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.leftSideObject && this.rightSideObject) {
            /** @type {?} */
            var left = (this.leftSideObject instanceof Array) ? this.leftSideObject : [this.leftSideObject];
            /** @type {?} */
            var right = (this.rightSideObject instanceof Array) ? this.rightSideObject : [this.rightSideObject];
            /** @type {?} */
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
    /**
     * @return {?}
     */
    DifferentiateComponent.prototype.fireCountDifference = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
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
    /**
     * @param {?} side
     * @param {?} parentObject
     * @param {?} id
     * @return {?}
     */
    DifferentiateComponent.prototype.lookupChildOf = /**
     * @param {?} side
     * @param {?} parentObject
     * @param {?} id
     * @return {?}
     */
    function (side, parentObject, id) {
        var _this = this;
        /** @type {?} */
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
    /**
     * @param {?} leftSideInfo
     * @param {?} rightSideInfo
     * @param {?} status
     * @param {?} i
     * @return {?}
     */
    DifferentiateComponent.prototype.performAdvanceToRight = /**
     * @param {?} leftSideInfo
     * @param {?} rightSideInfo
     * @param {?} status
     * @param {?} i
     * @return {?}
     */
    function (leftSideInfo, rightSideInfo, status, i) {
        var _this = this;
        /** @type {?} */
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
    /**
     * @param {?} leftSideInfo
     * @param {?} rightSideInfo
     * @param {?} status
     * @param {?} i
     * @return {?}
     */
    DifferentiateComponent.prototype.performAdvanceToLeft = /**
     * @param {?} leftSideInfo
     * @param {?} rightSideInfo
     * @param {?} status
     * @param {?} i
     * @return {?}
     */
    function (leftSideInfo, rightSideInfo, status, i) {
        var _this = this;
        /** @type {?} */
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
    /**
     * @param {?} event
     * @return {?}
     */
    DifferentiateComponent.prototype.advance = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var index = parseInt(event.node.path.split(",")[1]);
        if (event.type === 'advance') {
            this.performAdvanceToLeft(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.id), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.counterpart), event.node.status, index);
        }
        else {
            this.performAdvanceToRight(this.lookupChildOf(this.leftSide[0].children[index], this.leftSide[0], event.node.counterpart), this.lookupChildOf(this.rightSide[0].children[index], this.rightSide[0], event.node.id), event.node.status, index);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DifferentiateComponent.prototype.autoExpand = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var index = parseInt(event.split(",")[1]);
        /** @type {?} */
        var lc = this.rightSide[0].children[index];
        /** @type {?} */
        var rc = this.leftSide[0].children[index];
        lc.collapsed = !lc.collapsed;
        rc.collapsed = !rc.collapsed;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    DifferentiateComponent.prototype.onhover = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var index = parseInt(event.path.split(",")[1]);
        this.rightSide[0].children[index].children[event.index].hover = event.hover;
        this.leftSide[0].children[index].children[event.index].hover = event.hover;
    };
    DifferentiateComponent.decorators = [
        { type: Component, args: [{
                    selector: 'differentiate',
                    template: "<div class=\"spinner\" *ngIf=\"!ready\">\r\n    <svg \r\n        version=\"1.1\" \r\n        id=\"loader\" \r\n        xmlns=\"http://www.w3.org/2000/svg\" \r\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\" \r\n        x=\"0px\" \r\n        y=\"0px\"\r\n        width=\"40px\" \r\n        height=\"40px\" \r\n        viewBox=\"0 0 50 50\" \r\n        style=\"enable-background:new 0 0 50 50;\" \r\n        xml:space=\"preserve\">\r\n        <path \r\n            fill=\"#000\" \r\n            d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\r\n            <animateTransform attributeType=\"xml\"\r\n                attributeName=\"transform\"\r\n                type=\"rotate\"\r\n                from=\"0 25 25\"\r\n                to=\"360 25 25\"\r\n                dur=\"0.6s\"\r\n                repeatCount=\"indefinite\"/>\r\n    </path>\r\n  </svg>\r\n</div>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"left-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [rightSideToolTip]=\"rightSideToolTip\"\r\n    [showLeftActionButton]=\"allowAdvance\" \r\n    [children]=\"leftSide\"></differentiate-tree>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"right-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [leftSideToolTip]=\"leftSideToolTip\"\r\n    [showRightActionButton]=\"allowRevert\" \r\n    [children]=\"rightSide\"></differentiate-tree>\r\n\r\n",
                    styles: [":host{border:1px solid rgba(0,0,0,.1);box-sizing:border-box;display:block;max-width:100vw;max-height:300px;overflow-y:auto;position:relative;width:100%}:host .spinner{margin:0 auto 1em;height:222px;width:20%;text-align:center;padding:1em;display:inline-block;vertical-align:top;position:absolute;top:0;left:10%;z-index:2}:host svg path,:host svg rect{fill:#1c0696}"]
                }] }
    ];
    /** @nocollapse */
    DifferentiateComponent.ctorParameters = function () { return []; };
    DifferentiateComponent.propDecorators = {
        allowRevert: [{ type: Input, args: ["allowRevert",] }],
        allowAdvance: [{ type: Input, args: ["allowAdvance",] }],
        attributeOrderIsImportant: [{ type: Input, args: ["attributeOrderIsImportant",] }],
        onlyShowDifferences: [{ type: Input, args: ["onlyShowDifferences",] }],
        leftSideObject: [{ type: Input, args: ["leftSideObject",] }],
        rightSideObject: [{ type: Input, args: ["rightSideObject",] }],
        leftSideToolTip: [{ type: Input, args: ["leftSideToolTip",] }],
        rightSideToolTip: [{ type: Input, args: ["rightSideToolTip",] }],
        namedRootObject: [{ type: Input, args: ['namedRootObject',] }],
        onrevert: [{ type: Output, args: ["onrevert",] }],
        onadvance: [{ type: Output, args: ["onadvance",] }],
        ondifference: [{ type: Output, args: ["ondifference",] }]
    };
    return DifferentiateComponent;
}());
export { DifferentiateComponent };
if (false) {
    /** @type {?} */
    DifferentiateComponent.prototype.leftSide;
    /** @type {?} */
    DifferentiateComponent.prototype.rightSide;
    /** @type {?} */
    DifferentiateComponent.prototype.ready;
    /** @type {?} */
    DifferentiateComponent.prototype.categorizeBy;
    /** @type {?} */
    DifferentiateComponent.prototype.allowRevert;
    /** @type {?} */
    DifferentiateComponent.prototype.allowAdvance;
    /** @type {?} */
    DifferentiateComponent.prototype.attributeOrderIsImportant;
    /** @type {?} */
    DifferentiateComponent.prototype.onlyShowDifferences;
    /** @type {?} */
    DifferentiateComponent.prototype.leftSideObject;
    /** @type {?} */
    DifferentiateComponent.prototype.rightSideObject;
    /** @type {?} */
    DifferentiateComponent.prototype.leftSideToolTip;
    /** @type {?} */
    DifferentiateComponent.prototype.rightSideToolTip;
    /** @type {?} */
    DifferentiateComponent.prototype.onrevert;
    /** @type {?} */
    DifferentiateComponent.prototype.onadvance;
    /** @type {?} */
    DifferentiateComponent.prototype.ondifference;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlmZmVyZW50aWF0ZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9kaWZmZXJlbnRpYXRlLyIsInNvdXJjZXMiOlsic3JjL2FwcC9kaWZmZXJlbnRpYXRlL2NvbXBvbmVudHMvZGlmZmVyZW50aWF0ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFDTCxTQUFTLEVBR1QsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUVMLHFCQUFxQixFQUNyQix1QkFBdUIsRUFDeEIsTUFBTSx3Q0FBd0MsQ0FBQzs7SUEyRDlDOzJCQTNDYyxLQUFLOzRCQUdKLEtBQUs7eUNBR1EsSUFBSTttQ0FHVixLQUFLOytCQVNULGdCQUFnQjtnQ0FHZixpQkFBaUI7d0JBY3pCLElBQUksWUFBWSxFQUFFO3lCQUdqQixJQUFJLFlBQVksRUFBRTs0QkFHZixJQUFJLFlBQVksRUFBRTtLQUloQztJQXRCRCxzQkFDSSxtREFBZTs7Ozs7UUFEbkIsVUFDb0IsS0FBYTs7WUFDL0IsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFL0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3RDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUM7YUFDL0I7U0FDRjs7O09BQUE7Ozs7SUFjTywrQ0FBYzs7Ozs7UUFDcEIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDOztRQUNkLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQTtRQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdB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OytCQUduQixLQUFLLFNBQUMsY0FBYzs0Q0FHcEIsS0FBSyxTQUFDLDJCQUEyQjtzQ0FHakMsS0FBSyxTQUFDLHFCQUFxQjtpQ0FHM0IsS0FBSyxTQUFDLGdCQUFnQjtrQ0FHdEIsS0FBSyxTQUFDLGlCQUFpQjtrQ0FHdkIsS0FBSyxTQUFDLGlCQUFpQjttQ0FHdkIsS0FBSyxTQUFDLGtCQUFrQjtrQ0FHeEIsS0FBSyxTQUFDLGlCQUFpQjsyQkFXdkIsTUFBTSxTQUFDLFVBQVU7NEJBR2pCLE1BQU0sU0FBQyxXQUFXOytCQUdsQixNQUFNLFNBQUMsY0FBYzs7aUNBekV4Qjs7U0F5QmEsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ29tcGFyaXNpb24gVG9vbCB3aWxsIGxheW91dCB0d28gY29tcGFyaXNpb24gdHJlZXMgc2lkZSBieSBzaWRlIGFuZCBmZWVkIHRoZW0gYW4gaW50ZXJuYWwgb2JqZWN0XHJcbiAqIGhlaXJhcmNoeSBjcmVhdGVkIGZvciBpbnRlcm5hbCB1c2UgZnJvbSBKU09OIG9iamVjdHMgZ2l2ZW4gdG8gdGhpcyBjb21wb25lbnQuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRGlmZmVyZW50aWF0ZU5vZGUsXHJcbiAgRGlmZmVyZW50aWF0ZU5vZGVUeXBlLFxyXG4gIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzXHJcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy9kaWZmZXJlbnRpYXRlLmludGVyZmFjZXMnO1xyXG5pbXBvcnQgeyBUaHJvd1N0bXQgfSBmcm9tICdAYW5ndWxhci9jb21waWxlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2RpZmZlcmVudGlhdGUnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi9kaWZmZXJlbnRpYXRlLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi9kaWZmZXJlbnRpYXRlLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBEaWZmZXJlbnRpYXRlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIFxyXG4gIGxlZnRTaWRlO1xyXG4gIHJpZ2h0U2lkZTtcclxuICByZWFkeTogYm9vbGVhbjtcclxuICBjYXRlZ29yaXplQnk6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJhbGxvd1JldmVydFwiKVxyXG4gIGFsbG93UmV2ZXJ0ID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcImFsbG93QWR2YW5jZVwiKVxyXG4gIGFsbG93QWR2YW5jZSA9IGZhbHNlO1xyXG5cclxuICBASW5wdXQoXCJhdHRyaWJ1dGVPcmRlcklzSW1wb3J0YW50XCIpXHJcbiAgYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCA9IHRydWU7XHJcblxyXG4gIEBJbnB1dChcIm9ubHlTaG93RGlmZmVyZW5jZXNcIilcclxuICBvbmx5U2hvd0RpZmZlcmVuY2VzID0gZmFsc2U7XHJcblxyXG4gIEBJbnB1dChcImxlZnRTaWRlT2JqZWN0XCIpXHJcbiAgbGVmdFNpZGVPYmplY3RcclxuXHJcbiAgQElucHV0KFwicmlnaHRTaWRlT2JqZWN0XCIpXHJcbiAgcmlnaHRTaWRlT2JqZWN0O1xyXG5cclxuICBASW5wdXQoXCJsZWZ0U2lkZVRvb2xUaXBcIilcclxuICBsZWZ0U2lkZVRvb2xUaXAgPSBcInRha2UgbGVmdCBzaWRlXCI7XHJcblxyXG4gIEBJbnB1dChcInJpZ2h0U2lkZVRvb2xUaXBcIilcclxuICByaWdodFNpZGVUb29sVGlwID0gXCJ0YWtlIHJpZ2h0IHNpZGVcIjtcclxuXHJcbiAgQElucHV0KCduYW1lZFJvb3RPYmplY3QnKVxyXG4gIHNldCBuYW1lZFJvb3RPYmplY3QodmFsdWU6IHN0cmluZykge1xyXG4gICAgbGV0IHggPSB2YWx1ZS5yZXBsYWNlKFwiIFwiLCBcIlwiKTtcclxuXHJcbiAgICBpZiAoeC5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5jYXRlZ29yaXplQnkgPSB2YWx1ZS5zcGxpdChcIixcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmNhdGVnb3JpemVCeSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBPdXRwdXQoXCJvbnJldmVydFwiKVxyXG4gIG9ucmV2ZXJ0ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25hZHZhbmNlXCIpXHJcbiAgb25hZHZhbmNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBAT3V0cHV0KFwib25kaWZmZXJlbmNlXCIpXHJcbiAgb25kaWZmZXJlbmNlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcdCkge1xyXG5cdCAgXHJcbiAgfVxyXG4gIHByaXZhdGUgZ2VuZXJhdGVOb2RlSWQoKSB7XHJcbiAgICBjb25zdCBtaW4gPSAxO1xyXG4gICAgY29uc3QgbWF4ID0gMTAwMDBcclxuICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkpICsgbWluO1xyXG4gIH1cclxuICBwcml2YXRlIHRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKG5vZGUsIHBhcmVudCkge1xyXG4gICAgbGV0IGpzb24gPSB7fTtcclxuICAgIGxldCBhcnJheSA9IFtdO1xyXG5cclxuICAgIG5vZGUubWFwKCAoaXRlbTogRGlmZmVyZW50aWF0ZU5vZGUpID0+IHtcclxuICAgICAgaWYgKGl0ZW0uc3RhdHVzICE9PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKSB7XHJcbiAgICAgICAgaWYgKHBhcmVudCA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pIHsgICAgXHJcbiAgICAgICAgICBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyKSB7XHJcbiAgICAgICAgICAgIGpzb25baXRlbS5uYW1lXSA9IGl0ZW0udmFsdWU7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0uY2hpbGRyZW4sIGl0ZW0ucGFyZW50KTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0ubmFtZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICBqc29uW2l0ZW0ubmFtZV0gPSB4O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGpzb24gPSBbeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbikge1xyXG4gICAgICAgICAgICBqc29uW2l0ZW0ubmFtZV0gPSB0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0uY2hpbGRyZW4sIGl0ZW0ucGFyZW50KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHBhcmVudCA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KXtcclxuICAgICAgICAgIGlmIChpdGVtLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsKSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24pIHtcclxuICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnRyYW5zZm9ybU5vZGVUb09yaWdpbmFsU3RydWN0dXJlKGl0ZW0sIGl0ZW0ucGFyZW50KSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0udHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5KSB7XHJcbiAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShpdGVtLmNoaWxkcmVuLCBpdGVtLnBhcmVudCkpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYXJyYXkubGVuZ3RoID8gYXJyYXkgOiBqc29uO1xyXG4gIH1cclxuICBwcml2YXRlIHRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKG5vZGUpIHtcclxuICAgIGxldCByZXN1bHQgPSBub2RlO1xyXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICBjb25zdCBjaGlsZHJlbjogRGlmZmVyZW50aWF0ZU5vZGVbXSA9IFtdO1xyXG4gICAgICBjb25zdCBwID0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5O1xyXG4gICAgICBub2RlLm1hcCggKGl0ZW0sIGkpID0+IHtcclxuICAgICAgICBjb25zdCBqc29uVmFsdWU6IGFueSA9IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24oaXRlbSk7XHJcbiAgICAgICAgaWYgKGpzb25WYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICBpZiAoIXRoaXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCkge1xyXG4gICAgICAgICAgICBqc29uVmFsdWUuc29ydCgoYSxiKSA9PiB7cmV0dXJuIGEubmFtZSA8PSBiLm5hbWUgPyAtMTogMX0pO1xyXG4gICAgICAgICAgICBqc29uVmFsdWUubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+e1xyXG4gICAgICAgICAgICAgIHguaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogXCJcIixcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBcIlwiLFxyXG4gICAgICAgICAgICBwYXJlbnQ6IHAsXHJcbiAgICAgICAgICAgIHR5cGU6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjoganNvblZhbHVlXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IGpzb25WYWx1ZSxcclxuICAgICAgICAgICAgcGFyZW50OiBwLFxyXG4gICAgICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCxcclxuICAgICAgICAgICAgc3RhdHVzOiBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0LFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW11cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gICAgICBcclxuICAgICAgfSk7XHJcbiAgICAgIHJlc3VsdCA9IGNoaWxkcmVuO1xyXG4gICAgfSBlbHNlIGlmIChub2RlIGluc3RhbmNlb2YgT2JqZWN0KSB7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSBPYmplY3Qua2V5cyhub2RlKTtcclxuICAgICAgY29uc3QgY2hpbGRyZW46IERpZmZlcmVudGlhdGVOb2RlW10gPSBbXTtcclxuICAgICAgY29uc3QgcCA9IERpZmZlcmVudGlhdGVOb2RlVHlwZS5qc29uO1xyXG4gICAgICBpZiAoIXRoaXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCkge1xyXG4gICAgICAgIGxpc3Quc29ydCgoYSxiKSA9PiB7cmV0dXJuIGEgPD0gYiA/IC0xOiAxfSk7XHJcbiAgICAgIH1cclxuICAgICAgbGlzdC5tYXAoIChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3QganNvblZhbHVlOiBhbnkgPSB0aGlzLnRyYW5zZm9ybU5vZGVUb0ludGVybmFsU3RydWN0aW9uKG5vZGVbaXRlbV0pO1xyXG4gICAgICAgIGlmIChqc29uVmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgaWYgKCF0aGlzLmF0dHJpYnV0ZU9yZGVySXNJbXBvcnRhbnQpIHtcclxuICAgICAgICAgICAganNvblZhbHVlLnNvcnQoKGEsYikgPT4ge3JldHVybiBhLm5hbWUgPD0gYi5uYW1lID8gLTE6IDF9KTtcclxuICAgICAgICAgICAganNvblZhbHVlLm1hcCggKHg6IERpZmZlcmVudGlhdGVOb2RlLCBpKSA9PiB7XHJcbiAgICAgICAgICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgeC5hbHROYW1lID0gXCJcIiArIGk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY2hpbGRyZW4ucHVzaCh7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmdlbmVyYXRlTm9kZUlkKCksXHJcbiAgICAgICAgICAgIGluZGV4OiBpLFxyXG4gICAgICAgICAgICBuYW1lOiBpdGVtLFxyXG4gICAgICAgICAgICBhbHROYW1lOiBcIlwiICsgaSxcclxuICAgICAgICAgICAgdmFsdWU6IFwiXCIsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmpzb24sXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IGpzb25WYWx1ZVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNoaWxkcmVuLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogdGhpcy5nZW5lcmF0ZU5vZGVJZCgpLFxyXG4gICAgICAgICAgICBpbmRleDogaSxcclxuICAgICAgICAgICAgbmFtZTogaXRlbSxcclxuICAgICAgICAgICAgYWx0TmFtZTogXCJcIiArIGksXHJcbiAgICAgICAgICAgIHZhbHVlOiBqc29uVmFsdWUsXHJcbiAgICAgICAgICAgIHBhcmVudDogcCxcclxuICAgICAgICAgICAgdHlwZTogRGlmZmVyZW50aWF0ZU5vZGVUeXBlLnBhaXIsXHJcbiAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdCxcclxuICAgICAgICAgICAgY2hpbGRyZW46IFtdXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICByZXN1bHQgPSBjaGlsZHJlbjtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGl0ZW1JbkFycmF5KHNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10sIG5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0OiBEaWZmZXJlbnRpYXRlTm9kZTtcclxuICAgIGNvbnN0IGtleSA9IG5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwgP1xyXG4gICAgICAgICAgICAgICAgKG5vZGUudmFsdWUgPyBTdHJpbmcobm9kZS52YWx1ZSkudG9VcHBlckNhc2UoKSA6IFwiXCIpIDpcclxuICAgICAgICAgICAgICAgIG5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmFycmF5ID9cclxuICAgICAgICAgICAgICAgIG5vZGUuYWx0TmFtZSA6XHJcbiAgICAgICAgICAgICAgICBub2RlLm5hbWU7XHJcblxyXG4gICAgc2lkZS5tYXAoIChpdGVtOiBEaWZmZXJlbnRpYXRlTm9kZSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICAgIGlmIChpdGVtLnZhbHVlICYmIFN0cmluZyhpdGVtLnZhbHVlKS50b1VwcGVyQ2FzZSgpID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0gZWxzZSBpZiAoaXRlbS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXkpIHtcclxuICAgICAgICBpZiAoaXRlbS5hbHROYW1lID09PSBrZXkpIHtcclxuICAgICAgICAgIHJlc3VsdCA9IGl0ZW07XHJcbiAgICAgICAgfSAgXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKGl0ZW0ubmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgICByZXN1bHQgPSBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBsZWZ0SXRlbUZyb21SaWdodEl0ZW0obGVmdE5vZGU6IERpZmZlcmVudGlhdGVOb2RlLCByaWdodE5vZGU6IERpZmZlcmVudGlhdGVOb2RlKSB7XHJcbiAgICBsZXQgcmVzdWx0OiBEaWZmZXJlbnRpYXRlTm9kZTtcclxuICAgIGlmICghbGVmdE5vZGUgfHwgIXJpZ2h0Tm9kZSkge1xyXG4gICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG4gICAgY29uc3Qga2V5ID0gcmlnaHROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5saXRlcmFsID9cclxuICAgICAgICAgICAgICAgICAgICAocmlnaHROb2RlLnZhbHVlID8gcmlnaHROb2RlLnZhbHVlLnRvVXBwZXJDYXNlKCkgOiBcIlwiKSA6XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSA/XHJcbiAgICAgICAgICAgICAgICAgICAgcmlnaHROb2RlLmFsdE5hbWUgOlxyXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0Tm9kZS5uYW1lO1xyXG5cclxuICAgIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUubGl0ZXJhbCkge1xyXG4gICAgICBpZiAobGVmdE5vZGUudmFsdWUgJiYgU3RyaW5nKGxlZnROb2RlLnZhbHVlKS50b1VwcGVyQ2FzZSgpID09PSBrZXkpIHtcclxuICAgICAgICByZXN1bHQgPSBsZWZ0Tm9kZTtcclxuICAgICAgfSAgXHJcbiAgICB9IGVsc2UgaWYgKGxlZnROb2RlLnR5cGUgPT09IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSkge1xyXG4gICAgICBpZiAobGVmdE5vZGUuYWx0TmFtZSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gbGVmdE5vZGU7XHJcbiAgICAgIH0gIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGxlZnROb2RlLm5hbWUgPT09IGtleSkge1xyXG4gICAgICAgIHJlc3VsdCA9IGxlZnROb2RlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb21wYXJlKGxlZnROb2RlOiBEaWZmZXJlbnRpYXRlTm9kZSwgcmlnaHROb2RlOiBEaWZmZXJlbnRpYXRlTm9kZSkge1xyXG4gICAgaWYgKGxlZnROb2RlLnR5cGUgIT09IHJpZ2h0Tm9kZS50eXBlKSB7XHJcbiAgICAgIGxlZnROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnR5cGVDaGFuZ2VkO1xyXG4gICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQ7XHJcbiAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgIH0gZWxzZSBpZiAobGVmdE5vZGUudHlwZSA9PT0gRGlmZmVyZW50aWF0ZU5vZGVUeXBlLmxpdGVyYWwpIHtcclxuICAgICAgaWYgKGxlZnROb2RlLnZhbHVlICE9PSByaWdodE5vZGUudmFsdWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChsZWZ0Tm9kZS50eXBlID09PSBEaWZmZXJlbnRpYXRlTm9kZVR5cGUucGFpcikge1xyXG4gICAgICBpZiAobGVmdE5vZGUubmFtZSAhPT0gcmlnaHROb2RlLm5hbWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZDtcclxuICAgICAgICByaWdodE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgbGVmdE5vZGUuY291bnRlcnBhcnQgPSByaWdodE5vZGUuaWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLmNvdW50ZXJwYXJ0ID0gbGVmdE5vZGUuaWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnROb2RlLnZhbHVlICE9PSByaWdodE5vZGUudmFsdWUpIHtcclxuICAgICAgICBsZWZ0Tm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy52YWx1ZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZDtcclxuICAgICAgICBsZWZ0Tm9kZS5jb3VudGVycGFydCA9IHJpZ2h0Tm9kZS5pZDtcclxuICAgICAgICByaWdodE5vZGUuY291bnRlcnBhcnQgPSBsZWZ0Tm9kZS5pZDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGxlZnROb2RlLm5hbWUgIT09IHJpZ2h0Tm9kZS5uYW1lKSB7XHJcbiAgICAgICAgbGVmdE5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMubmFtZUNoYW5nZWQ7XHJcbiAgICAgICAgcmlnaHROb2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkO1xyXG4gICAgICAgIGxlZnROb2RlLmNvdW50ZXJwYXJ0ID0gcmlnaHROb2RlLmlkO1xyXG4gICAgICAgIHJpZ2h0Tm9kZS5jb3VudGVycGFydCA9IGxlZnROb2RlLmlkO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudW5pZnkobGVmdE5vZGUuY2hpbGRyZW4sIHJpZ2h0Tm9kZS5jaGlsZHJlbik7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgcmVJbmRleChsaXN0OiBEaWZmZXJlbnRpYXRlTm9kZVtdKSB7XHJcbiAgICBsaXN0Lm1hcCgoaXRlbSwgaSkgPT4ge1xyXG4gICAgICBpdGVtLmluZGV4ID0gaTtcclxuICAgICAgdGhpcy5yZUluZGV4KGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgY29weUludG8oXHJcbiAgICAgICAgICAgICAgc2lkZTogRGlmZmVyZW50aWF0ZU5vZGVbXSxcclxuICAgICAgICAgICAgICBpdGVtOiBEaWZmZXJlbnRpYXRlTm9kZSxcclxuICAgICAgICAgICAgICBpbmRleDogbnVtYmVyLFxyXG4gICAgICAgICAgICAgIHN0YXR1czogRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMpIHtcclxuICAgIFxyXG4gICAgaWYgKGl0ZW0pIHtcclxuICAgICAgY29uc3QgbmV3SXRlbSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoaXRlbSkpO1xyXG4gICAgICBzaWRlLnNwbGljZShpbmRleCwgMCwgbmV3SXRlbSk7XHJcbiAgICAgIHRoaXMucmVJbmRleChzaWRlKTtcclxuICBcclxuICAgICAgaXRlbS5zdGF0dXMgPSBzdGF0dXM7XHJcbiAgICAgIG5ld0l0ZW0uc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICBpdGVtLmNvdW50ZXJwYXJ0ID0gbmV3SXRlbS5pZDtcclxuICAgICAgbmV3SXRlbS5jb3VudGVycGFydCA9IGl0ZW0uaWQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMoaXRlbS5jaGlsZHJlbiwgc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKG5ld0l0ZW0uY2hpbGRyZW4sIHN0YXR1cylcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBzZXRDaGlsZHJlblN0YXR1cyhsaXN0LCBzdGF0dXMpe1xyXG4gICAgbGlzdC5tYXAoICh4KSA9PiB7XHJcbiAgICAgIHguc3RhdHVzID0gc3RhdHVzO1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHguY2hpbGRyZW4sIHN0YXR1cylcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIHVuaWZ5KGxlZnRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZVtdLCByaWdodFNpZGU6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGxldCBpID0gMCwgaiA9IDAsIGxvb3BpbmcgPSB0cnVlO1xyXG5cclxuICAgIHdoaWxlIChsb29waW5nKSB7XHJcbiAgICAgIGxldCBsZWZ0SXRlbUluUmlnaHRTaWRlOiBEaWZmZXJlbnRpYXRlTm9kZSA9IGkgPCBsZWZ0U2lkZS5sZW5ndGggPyB0aGlzLml0ZW1JbkFycmF5KHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0pIDogdW5kZWZpbmVkO1xyXG4gICAgICBsZXQgcmlnaHRJdGVtSW5MZWZ0U2lkZTogRGlmZmVyZW50aWF0ZU5vZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHRoaXMuaXRlbUluQXJyYXkobGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICBpZiAoIWxlZnRJdGVtSW5SaWdodFNpZGUgJiYgaSA8IGxlZnRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgICAgd2hpbGUgKGkgPCBsZWZ0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghcmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiBqIDwgcmlnaHRTaWRlLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICghbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICB3aGlsZSAoaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFsZWZ0SXRlbUluUmlnaHRTaWRlKSB7XHJcbiAgICAgICAgbGVmdEl0ZW1JblJpZ2h0U2lkZSA9IGogPCByaWdodFNpZGUubGVuZ3RoID8gcmlnaHRTaWRlW2pdIDogdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghcmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgIHJpZ2h0SXRlbUluTGVmdFNpZGUgPSBpIDwgbGVmdFNpZGUubGVuZ3RoID8gbGVmdFNpZGVbaV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUgJiYgbGVmdEl0ZW1JblJpZ2h0U2lkZS5pbmRleCAhPT0gaSkge1xyXG4gICAgICAgIHdoaWxlIChpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gdGhpcy5sZWZ0SXRlbUZyb21SaWdodEl0ZW0ocmlnaHRTaWRlW2ldLCBsZWZ0U2lkZVtpXSk7XHJcbiAgICAgICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSkge1xyXG4gICAgICAgICAgICBsZWZ0SXRlbUluUmlnaHRTaWRlID0gaiA8IHJpZ2h0U2lkZS5sZW5ndGggPyByaWdodFNpZGVbal0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9ICBcclxuICAgICAgfVxyXG4gICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSAmJiByaWdodEl0ZW1JbkxlZnRTaWRlLmluZGV4ICE9PSBqKSB7XHJcbiAgICAgICAgd2hpbGUgKGogPCByaWdodFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gdGhpcy5sZWZ0SXRlbUZyb21SaWdodEl0ZW0obGVmdFNpZGVbal0sIHJpZ2h0U2lkZVtqXSk7XHJcbiAgICAgICAgICBpZiAocmlnaHRJdGVtSW5MZWZ0U2lkZSkge1xyXG4gICAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgICBqKys7aSsrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiBpIDwgbGVmdFNpZGUubGVuZ3RoKSB7XHJcbiAgICAgICAgbGV0IHggPSB0aGlzLml0ZW1JbkFycmF5KHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0pO1xyXG4gICAgICAgIGlmICh4ICYmIHguaW5kZXggIT09IGxlZnRJdGVtSW5SaWdodFNpZGUuaW5kZXgpIHtcclxuICAgICAgICAgIHRoaXMuY29weUludG8obGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSwgaiwgRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpO1xyXG4gICAgICAgICAgaisrO2krKztcclxuICAgICAgICAgIGxlZnRJdGVtSW5SaWdodFNpZGUgPSBqIDwgcmlnaHRTaWRlLmxlbmd0aCA/IHJpZ2h0U2lkZVtqXSA6IHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHJpZ2h0SXRlbUluTGVmdFNpZGUgJiYgaiA8IHJpZ2h0U2lkZS5sZW5ndGgpIHtcclxuICAgICAgICBsZXQgeCA9IHRoaXMuaXRlbUluQXJyYXkobGVmdFNpZGUsIHJpZ2h0U2lkZVtqXSk7XHJcbiAgICAgICAgaWYgKHggJiYgeC5pbmRleCAhPT0gcmlnaHRJdGVtSW5MZWZ0U2lkZS5pbmRleCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhyaWdodFNpZGUsIGxlZnRTaWRlW2ldLCBpLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKTtcclxuICAgICAgICAgIGorKztpKys7XHJcbiAgICAgICAgICByaWdodEl0ZW1JbkxlZnRTaWRlID0gaSA8IGxlZnRTaWRlLmxlbmd0aCA/IGxlZnRTaWRlW2ldIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAobGVmdEl0ZW1JblJpZ2h0U2lkZSAmJiByaWdodEl0ZW1JbkxlZnRTaWRlKSB7XHJcbiAgICAgICAgaWYgKGxlZnRJdGVtSW5SaWdodFNpZGUucGFyZW50ICE9PSByaWdodEl0ZW1JbkxlZnRTaWRlLnBhcmVudCkge1xyXG4gICAgICAgICAgdGhpcy5jb3B5SW50byhsZWZ0U2lkZSwgcmlnaHRTaWRlW2pdLCBqLCBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCk7XHJcbiAgICAgICAgICB0aGlzLmNvcHlJbnRvKHJpZ2h0U2lkZSwgbGVmdFNpZGVbaV0sIGksIERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmNvbXBhcmUobGVmdEl0ZW1JblJpZ2h0U2lkZSwgcmlnaHRJdGVtSW5MZWZ0U2lkZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGorKztpKys7XHJcbiAgICAgIH1cclxuICAgICAgbG9vcGluZyA9IChpIDwgbGVmdFNpZGUubGVuZ3RoIHx8IGogPCByaWdodFNpZGUubGVuZ3RoKTtcclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSB0b0ludGVybmFsU3RydWN0aW9uKGxlZnROb2RlLCByaWdodE5vZGUpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHtcclxuICAgICAgbGVmdFNpZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdE5vZGUpLFxyXG4gICAgICByaWdodFNpZGU6IHRoaXMudHJhbnNmb3JtTm9kZVRvSW50ZXJuYWxTdHJ1Y3Rpb24ocmlnaHROb2RlKVxyXG4gICAgfTtcclxuICAgIHRoaXMudW5pZnkocmVzdWx0LmxlZnRTaWRlLCByZXN1bHQucmlnaHRTaWRlKTtcclxuXHJcbiAgICBpZiAodGhpcy5vbmx5U2hvd0RpZmZlcmVuY2VzKSB7XHJcbiAgICAgIHJlc3VsdC5sZWZ0U2lkZSA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKHJlc3VsdC5sZWZ0U2lkZSk7XHJcbiAgICAgIHJlc3VsdC5yaWdodFNpZGUgPSB0aGlzLmZpbHRlclVuY2hhbmdlZChyZXN1bHQucmlnaHRTaWRlKTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHByaXZhdGUgZmlsdGVyVW5jaGFuZ2VkKGxpc3Q6IERpZmZlcmVudGlhdGVOb2RlW10pIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xyXG4gICAgXHJcbiAgICBsaXN0Lm1hcCggKGl0ZW0pID0+IHtcclxuICAgICAgaXRlbS5jaGlsZHJlbiA9IHRoaXMuZmlsdGVyVW5jaGFuZ2VkKGl0ZW0uY2hpbGRyZW4pO1xyXG4gICAgICBpZiAoKGl0ZW0udHlwZSA+IERpZmZlcmVudGlhdGVOb2RlVHlwZS5wYWlyICYmIGl0ZW0uY2hpbGRyZW4ubGVuZ3RoKSB8fFxyXG4gICAgICAgICAgaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQpIHtcclxuICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXN1bHQubWFwKCAoeDogRGlmZmVyZW50aWF0ZU5vZGUsIGkpID0+IHtcclxuICAgICAgeC5pbmRleCA9IGk7XHJcbiAgICAgIHguYWx0TmFtZSA9IFwiXCIgKyBpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG4gICAgaWYgKGNoYW5nZXMuYXR0cmlidXRlT3JkZXJJc0ltcG9ydGFudCB8fFxyXG4gICAgICBjaGFuZ2VzLm9ubHlTaG93RGlmZmVyZW5jZXMgfHxcclxuICAgICAgY2hhbmdlcy5sZWZ0U2lkZU9iamVjdCB8fFxyXG4gICAgICBjaGFuZ2VzLm5hbWVkUm9vdE9iamVjdCB8fFxyXG4gICAgICBjaGFuZ2VzLnJpZ2h0U2lkZU9iamVjdCkge1xyXG4gICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubmdPbkluaXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgc2V0VGltZW91dCgoKT0+dGhpcy5pbml0KCksNjY2KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjYXRlZ29yaXplZE5hbWUoaXRlbSkge1xyXG4gICAgbGV0IG5hbWUgPSBcIlwiO1xyXG4gICAgdGhpcy5jYXRlZ29yaXplQnkubWFwKChjYXRlZ29yeSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS5uYW1lID09PSBjYXRlZ29yeSkge1xyXG4gICAgICAgIG5hbWUgPSBpdGVtLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuYW1lO1xyXG4gIH1cclxuICBwcml2YXRlIHNpZGVDYXRlZ29yaXplZE5hbWUoc2lkZSkge1xyXG4gICAgc2lkZS5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5hbWVzID0gW107XHJcbiAgICAgIGl0ZW0uY2hpbGRyZW4ubWFwKChjaGlsZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLmNhdGVnb3JpemVkTmFtZShjaGlsZCk7XHJcbiAgICAgICAgaWYoU3RyaW5nKG5hbWUpLmxlbmd0aCkge1xyXG4gICAgICAgICAgbmFtZXMucHVzaChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgICBpdGVtLmNhdGVnb3JpemVCeSA9IG5hbWVzLmxlbmd0aCA+IDEgPyBuYW1lcy5qb2luKFwiIC0gXCIpIDogbmFtZXNbMF07XHJcbiAgICAgIGl0ZW0uY29sbGFwc2VkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5sZWZ0U2lkZU9iamVjdCAmJiB0aGlzLnJpZ2h0U2lkZU9iamVjdCkge1xyXG4gICAgICBjb25zdCBsZWZ0ID0gKHRoaXMubGVmdFNpZGVPYmplY3QgaW5zdGFuY2VvZiBBcnJheSkgID8gdGhpcy5sZWZ0U2lkZU9iamVjdCA6IFt0aGlzLmxlZnRTaWRlT2JqZWN0XVxyXG4gICAgICBjb25zdCByaWdodCA9ICh0aGlzLnJpZ2h0U2lkZU9iamVjdCBpbnN0YW5jZW9mIEFycmF5KSAgPyB0aGlzLnJpZ2h0U2lkZU9iamVjdCA6IFt0aGlzLnJpZ2h0U2lkZU9iamVjdF1cclxuICAgICAgY29uc3QgY29tcGFyaXNpb24gPSB0aGlzLnRvSW50ZXJuYWxTdHJ1Y3Rpb24obGVmdCwgcmlnaHQpO1xyXG4gICAgICBpZiAodGhpcy5jYXRlZ29yaXplQnkpIHtcclxuICAgICAgICB0aGlzLnNpZGVDYXRlZ29yaXplZE5hbWUoY29tcGFyaXNpb24ubGVmdFNpZGUpO1xyXG4gICAgICAgIHRoaXMuc2lkZUNhdGVnb3JpemVkTmFtZShjb21wYXJpc2lvbi5yaWdodFNpZGUpO1xyXG4gICAgICB9ICBcclxuICAgICAgdGhpcy5sZWZ0U2lkZSA9IFt7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIHZhbHVlOiBcIlJvb3RcIixcclxuICAgICAgICBpbmRleDogMCxcclxuICAgICAgICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgZXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjb21wYXJpc2lvbi5sZWZ0U2lkZVxyXG4gICAgICB9XTtcclxuICAgICAgdGhpcy5yaWdodFNpZGU9IFt7XHJcbiAgICAgICAgaWQ6IHRoaXMuZ2VuZXJhdGVOb2RlSWQoKSxcclxuICAgICAgICBuYW1lOiBcIlwiLFxyXG4gICAgICAgIHZhbHVlOiBcIlJvb3RcIixcclxuICAgICAgICBpbmRleDogMCxcclxuICAgICAgICBwYXJlbnQ6IERpZmZlcmVudGlhdGVOb2RlVHlwZS5hcnJheSxcclxuICAgICAgICB0eXBlOiBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuYXJyYXksXHJcbiAgICAgICAgZXhwYW5kZWQ6IHRydWUsXHJcbiAgICAgICAgaXNSb290OiB0cnVlLFxyXG4gICAgICAgIGNoaWxkcmVuOiBjb21wYXJpc2lvbi5yaWdodFNpZGVcclxuICAgICAgfV07XHJcbiAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZpcmVDb3VudERpZmZlcmVuY2UoKTtcclxuICAgICAgfSwzMzMpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIGZpcmVDb3VudERpZmZlcmVuY2UoKSB7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbi5tYXAoIChsaXN0SXRlbSkgPT4ge1xyXG4gICAgICBsaXN0SXRlbS5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYoaXRlbS5zdGF0dXMgIT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQpIHtcclxuICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICB0aGlzLm9uZGlmZmVyZW5jZS5lbWl0KGNvdW50KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBsb29rdXBDaGlsZE9mKHNpZGUsIHBhcmVudE9iamVjdCwgaWQpIHtcclxuICAgIGxldCBmb3VuZEl0ZW0gPSB1bmRlZmluZWQ7XHJcbiAgICBpZiAoc2lkZS5pZCA9PT0gaWQpIHtcclxuICAgICAgZm91bmRJdGVtID0ge3BhcmVudDogcGFyZW50T2JqZWN0LCBub2RlOiBzaWRlfTtcclxuICAgIH0gZWxzZSBpZiAoc2lkZS5jaGlsZHJlbi5sZW5ndGgpIHtcclxuICAgICAgc2lkZS5jaGlsZHJlbi5tYXAoIChpdGVtKSA9PiB7XHJcbiAgICAgICAgaWYgKCFmb3VuZEl0ZW0pIHtcclxuICAgICAgICAgIGZvdW5kSXRlbSA9IHRoaXMubG9va3VwQ2hpbGRPZihpdGVtLCB1bmRlZmluZWQsIGlkKTtcclxuICAgICAgICAgIGlmIChmb3VuZEl0ZW0gJiYgZm91bmRJdGVtLnBhcmVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGZvdW5kSXRlbS5wYXJlbnQgPSBzaWRlO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlkID09PSBpZCkge1xyXG4gICAgICAgICAgICBmb3VuZEl0ZW0gPSB7cGFyZW50OiBzaWRlLCBub2RlOiBpdGVtfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBcclxuICAgIHJldHVybiBmb3VuZEl0ZW07XHJcbiAgfVxyXG4gIHByaXZhdGUgcGVyZm9ybUFkdmFuY2VUb1JpZ2h0KGxlZnRTaWRlSW5mbywgcmlnaHRTaWRlSW5mbywgc3RhdHVzLCBpKSB7XHJcbiAgICBjb25zdCBtb2RpZmllZENoaWxkcmVuID0gdGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpXS5jaGlsZHJlbjtcclxuICAgIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnJlbW92ZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuYWRkZWQpIHtcclxuICAgICAgbGVmdFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UobGVmdFNpZGVJbmZvLm5vZGUuaW5kZXgsIDEpO1xyXG4gICAgICByaWdodFNpZGVJbmZvLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UocmlnaHRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgdGhpcy5yZUluZGV4KGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgICB0aGlzLnJlSW5kZXgocmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4pO1xyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLm5hbWVDaGFuZ2VkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLm5hbWUgPSByaWdodFNpZGVJbmZvLm5vZGUubmFtZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS52YWx1ZSA9IGxlZnRTaWRlSW5mby5ub2RlLnZhbHVlO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy50eXBlQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS50eXBlID0gcmlnaHRTaWRlSW5mby5ub2RlLnR5cGU7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuID0gcmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuO1xyXG4gICAgfVxyXG4gICAgc2V0VGltZW91dCgoKSA9PntcclxuICAgICAgdGhpcy5vbmFkdmFuY2UuZW1pdCh7XHJcbiAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgbm9kZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShtb2RpZmllZENoaWxkcmVuLCBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbilcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgfSwgNjYpO1xyXG4gIH1cclxuICBwcml2YXRlIHBlcmZvcm1BZHZhbmNlVG9MZWZ0KGxlZnRTaWRlSW5mbywgcmlnaHRTaWRlSW5mbywgc3RhdHVzLCBpKSB7XHJcbiAgICBjb25zdCBtb2RpZmllZENoaWxkcmVuID0gdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baV0uY2hpbGRyZW47XHJcbiAgICBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5hZGRlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKHJpZ2h0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5yZW1vdmVkKSB7XHJcbiAgICAgIGxlZnRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGxlZnRTaWRlSW5mby5ub2RlLmluZGV4LCAxKTtcclxuICAgICAgcmlnaHRTaWRlSW5mby5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKHJpZ2h0U2lkZUluZm8ubm9kZS5pbmRleCwgMSk7XHJcbiAgICAgIHRoaXMucmVJbmRleChsZWZ0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgICAgdGhpcy5yZUluZGV4KHJpZ2h0U2lkZUluZm8ucGFyZW50LmNoaWxkcmVuKTtcclxuICAgIH0gZWxzZSBpZiAoc3RhdHVzID09PSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5uYW1lQ2hhbmdlZCkge1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUubmFtZSA9IGxlZnRTaWRlSW5mby5ub2RlLm5hbWU7XHJcbiAgICAgIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMgPSBEaWZmZXJlbnRpYXRlTm9kZVN0YXR1cy5kZWZhdWx0O1xyXG4gICAgICB0aGlzLnNldENoaWxkcmVuU3RhdHVzKGxlZnRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCBsZWZ0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMocmlnaHRTaWRlSW5mby5ub2RlLmNoaWxkcmVuLCByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgfSBlbHNlIGlmIChzdGF0dXMgPT09IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLnZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICBsZWZ0U2lkZUluZm8ubm9kZS52YWx1ZSA9IHJpZ2h0U2lkZUluZm8ubm9kZS52YWx1ZTtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnN0YXR1cyA9IERpZmZlcmVudGlhdGVOb2RlU3RhdHVzLmRlZmF1bHQ7XHJcbiAgICAgIHRoaXMuc2V0Q2hpbGRyZW5TdGF0dXMobGVmdFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIGxlZnRTaWRlSW5mby5ub2RlLnN0YXR1cylcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhyaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4sIHJpZ2h0U2lkZUluZm8ubm9kZS5zdGF0dXMpXHJcbiAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMudHlwZUNoYW5nZWQpIHtcclxuICAgICAgcmlnaHRTaWRlSW5mby5ub2RlLnR5cGUgPSBsZWZ0U2lkZUluZm8ubm9kZS50eXBlO1xyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzID0gRGlmZmVyZW50aWF0ZU5vZGVTdGF0dXMuZGVmYXVsdDtcclxuICAgICAgdGhpcy5zZXRDaGlsZHJlblN0YXR1cyhsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbiwgbGVmdFNpZGVJbmZvLm5vZGUuc3RhdHVzKVxyXG4gICAgICByaWdodFNpZGVJbmZvLm5vZGUuY2hpbGRyZW4gPSBsZWZ0U2lkZUluZm8ubm9kZS5jaGlsZHJlbjtcclxuICAgIH1cclxuICAgIHNldFRpbWVvdXQoKCkgPT57XHJcbiAgICAgIHRoaXMub25yZXZlcnQuZW1pdCh7XHJcbiAgICAgICAgaW5kZXg6IGksXHJcbiAgICAgICAgbm9kZTogdGhpcy50cmFuc2Zvcm1Ob2RlVG9PcmlnaW5hbFN0cnVjdHVyZShtb2RpZmllZENoaWxkcmVuLCBEaWZmZXJlbnRpYXRlTm9kZVR5cGUuanNvbilcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuZmlyZUNvdW50RGlmZmVyZW5jZSgpO1xyXG4gICAgfSwgNjYpO1xyXG4gIH1cclxuICBhZHZhbmNlKGV2ZW50KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IHBhcnNlSW50KGV2ZW50Lm5vZGUucGF0aC5zcGxpdChcIixcIilbMV0pO1xyXG5cclxuICAgIGlmIChldmVudC50eXBlID09PSAnYWR2YW5jZScpIHtcclxuICAgICAgdGhpcy5wZXJmb3JtQWR2YW5jZVRvTGVmdChcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMubGVmdFNpZGVbMF0sIGV2ZW50Lm5vZGUuaWQpLCBcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLnJpZ2h0U2lkZVswXSwgZXZlbnQubm9kZS5jb3VudGVycGFydCksIFxyXG4gICAgICAgIGV2ZW50Lm5vZGUuc3RhdHVzLCBpbmRleCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnBlcmZvcm1BZHZhbmNlVG9SaWdodChcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5sZWZ0U2lkZVswXS5jaGlsZHJlbltpbmRleF0sIHRoaXMubGVmdFNpZGVbMF0sIGV2ZW50Lm5vZGUuY291bnRlcnBhcnQpLCBcclxuICAgICAgICB0aGlzLmxvb2t1cENoaWxkT2YodGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLCB0aGlzLnJpZ2h0U2lkZVswXSwgZXZlbnQubm9kZS5pZCksIFxyXG4gICAgICAgIGV2ZW50Lm5vZGUuc3RhdHVzLCBpbmRleCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIGF1dG9FeHBhbmQoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQuc3BsaXQoXCIsXCIpWzFdKTtcclxuICAgIGNvbnN0IGxjID0gdGhpcy5yaWdodFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdO1xyXG4gICAgY29uc3QgcmMgPSB0aGlzLmxlZnRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XTtcclxuICAgIFxyXG4gICAgbGMuY29sbGFwc2VkID0gIWxjLmNvbGxhcHNlZDtcclxuICAgIHJjLmNvbGxhcHNlZCA9ICFyYy5jb2xsYXBzZWQ7XHJcbiAgfVxyXG4gIG9uaG92ZXIoZXZlbnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQoZXZlbnQucGF0aC5zcGxpdChcIixcIilbMV0pO1xyXG5cclxuICAgIHRoaXMucmlnaHRTaWRlWzBdLmNoaWxkcmVuW2luZGV4XS5jaGlsZHJlbltldmVudC5pbmRleF0uaG92ZXIgPSBldmVudC5ob3ZlcjtcclxuICAgIHRoaXMubGVmdFNpZGVbMF0uY2hpbGRyZW5baW5kZXhdLmNoaWxkcmVuW2V2ZW50LmluZGV4XS5ob3ZlciA9IGV2ZW50LmhvdmVyO1xyXG4gIH1cclxufVxyXG4iXX0=