(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@sedeh/differentiate', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory((global.sedeh = global.sedeh || {}, global.sedeh.differentiate = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    var DifferentiateNodeType;
    (function (DifferentiateNodeType) {
        DifferentiateNodeType[DifferentiateNodeType["literal"] = 1] = "literal";
        DifferentiateNodeType[DifferentiateNodeType["pair"] = 2] = "pair";
        DifferentiateNodeType[DifferentiateNodeType["json"] = 3] = "json";
        DifferentiateNodeType[DifferentiateNodeType["array"] = 4] = "array";
    })(DifferentiateNodeType || (DifferentiateNodeType = {}));
    var DifferentiateNodeStatus;
    (function (DifferentiateNodeStatus) {
        DifferentiateNodeStatus[DifferentiateNodeStatus["default"] = 1] = "default";
        DifferentiateNodeStatus[DifferentiateNodeStatus["typeChanged"] = 2] = "typeChanged";
        DifferentiateNodeStatus[DifferentiateNodeStatus["nameChanged"] = 3] = "nameChanged";
        DifferentiateNodeStatus[DifferentiateNodeStatus["valueChanged"] = 4] = "valueChanged";
        DifferentiateNodeStatus[DifferentiateNodeStatus["added"] = 5] = "added";
        DifferentiateNodeStatus[DifferentiateNodeStatus["removed"] = 6] = "removed";
    })(DifferentiateNodeStatus || (DifferentiateNodeStatus = {}));

    var DifferentiateComponent = /** @class */ (function () {
        function DifferentiateComponent() {
            this.allowRevert = false;
            this.allowAdvance = false;
            this.attributeOrderIsImportant = true;
            this.onlyShowDifferences = false;
            this.leftSideToolTip = "take left side";
            this.rightSideToolTip = "take right side";
            this.onrevert = new core.EventEmitter();
            this.onadvance = new core.EventEmitter();
            this.ondifference = new core.EventEmitter();
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
        __decorate([
            core.Input("allowRevert")
        ], DifferentiateComponent.prototype, "allowRevert", void 0);
        __decorate([
            core.Input("allowAdvance")
        ], DifferentiateComponent.prototype, "allowAdvance", void 0);
        __decorate([
            core.Input("attributeOrderIsImportant")
        ], DifferentiateComponent.prototype, "attributeOrderIsImportant", void 0);
        __decorate([
            core.Input("onlyShowDifferences")
        ], DifferentiateComponent.prototype, "onlyShowDifferences", void 0);
        __decorate([
            core.Input("leftSideObject")
        ], DifferentiateComponent.prototype, "leftSideObject", void 0);
        __decorate([
            core.Input("rightSideObject")
        ], DifferentiateComponent.prototype, "rightSideObject", void 0);
        __decorate([
            core.Input("leftSideToolTip")
        ], DifferentiateComponent.prototype, "leftSideToolTip", void 0);
        __decorate([
            core.Input("rightSideToolTip")
        ], DifferentiateComponent.prototype, "rightSideToolTip", void 0);
        __decorate([
            core.Input('namedRootObject')
        ], DifferentiateComponent.prototype, "namedRootObject", null);
        __decorate([
            core.Output("onrevert")
        ], DifferentiateComponent.prototype, "onrevert", void 0);
        __decorate([
            core.Output("onadvance")
        ], DifferentiateComponent.prototype, "onadvance", void 0);
        __decorate([
            core.Output("ondifference")
        ], DifferentiateComponent.prototype, "ondifference", void 0);
        DifferentiateComponent = __decorate([
            core.Component({
                selector: 'differentiate',
                template: "<div class=\"spinner\" *ngIf=\"!ready\">\r\n    <svg \r\n        version=\"1.1\" \r\n        id=\"loader\" \r\n        xmlns=\"http://www.w3.org/2000/svg\" \r\n        xmlns:xlink=\"http://www.w3.org/1999/xlink\" \r\n        x=\"0px\" \r\n        y=\"0px\"\r\n        width=\"40px\" \r\n        height=\"40px\" \r\n        viewBox=\"0 0 50 50\" \r\n        style=\"enable-background:new 0 0 50 50;\" \r\n        xml:space=\"preserve\">\r\n        <path \r\n            fill=\"#000\" \r\n            d=\"M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z\">\r\n            <animateTransform attributeType=\"xml\"\r\n                attributeName=\"transform\"\r\n                type=\"rotate\"\r\n                from=\"0 25 25\"\r\n                to=\"360 25 25\"\r\n                dur=\"0.6s\"\r\n                repeatCount=\"indefinite\"/>\r\n    </path>\r\n  </svg>\r\n</div>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"left-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [rightSideToolTip]=\"rightSideToolTip\"\r\n    [showLeftActionButton]=\"allowAdvance\" \r\n    [children]=\"leftSide\"></differentiate-tree>\r\n<differentiate-tree \r\n    *ngIf=\"leftSide && rightSide\"\r\n    class=\"root\" \r\n    level=\"0\" \r\n    side=\"right-side\" \r\n    (onexpand)=\"autoExpand($event)\"\r\n    (onhover)=\"onhover($event)\"\r\n    (onrevert)=\"advance($event)\"\r\n    [leftSideToolTip]=\"leftSideToolTip\"\r\n    [showRightActionButton]=\"allowRevert\" \r\n    [children]=\"rightSide\"></differentiate-tree>\r\n\r\n",
                styles: [":host{border:1px solid rgba(0,0,0,.1);box-sizing:border-box;display:block;max-width:100vw;max-height:300px;overflow-y:auto;position:relative;width:100%}:host .spinner{margin:0 auto 1em;height:222px;width:20%;text-align:center;padding:1em;display:inline-block;vertical-align:top;position:absolute;top:0;left:10%;z-index:2}:host svg path,:host svg rect{fill:#1c0696}"]
            })
        ], DifferentiateComponent);
        return DifferentiateComponent;
    }());

    var DifferentiateTree = /** @class */ (function () {
        function DifferentiateTree() {
            this.collapsed = true;
            this.showLeftActionButton = false;
            this.showRightActionButton = false;
            this.status = 1;
            this.side = "";
            this.level = "0";
            this.objectPath = "";
            this.leftSideToolTip = "take left side";
            this.rightSideToolTip = "take right side";
            this.onhover = new core.EventEmitter();
            this.onrevert = new core.EventEmitter();
            this.onexpand = new core.EventEmitter();
        }
        DifferentiateTree.prototype.ngOnInit = function () {
            this.depth = parseInt(this.level);
        };
        DifferentiateTree.prototype.bubleup = function (event) {
            event.side = this.side;
            this.onhover.emit(event);
        };
        DifferentiateTree.prototype.keyup = function (event) {
            var code = event.which;
            if (code === 13) {
                event.target.click();
            }
        };
        DifferentiateTree.prototype.changCounter = function () {
            var count = 0;
            this.children.map(function (item) {
                if (item.status !== DifferentiateNodeStatus.default) {
                    count++;
                }
            });
            return count;
        };
        DifferentiateTree.prototype.expand = function (event) {
            this.onexpand.emit(this.objectPath);
        };
        DifferentiateTree.prototype.autoExpand = function (event) {
            this.onexpand.emit(event);
        };
        DifferentiateTree.prototype.advanceToRightSide = function (child) {
            child.path = this.objectPath + (this.objectPath.length ? ',' : '') + child.index;
            this.onrevert.emit({ type: "advance", node: child });
        };
        DifferentiateTree.prototype.advanceToLeftSide = function (child) {
            child.path = this.objectPath + (this.objectPath.length ? ',' : '') + child.index;
            this.onrevert.emit({ type: "revert", node: child });
        };
        DifferentiateTree.prototype.advance = function (event) {
            // bubble up the undo event.
            this.onrevert.emit(event);
        };
        DifferentiateTree.prototype.mouseOvered = function (event, flag, i) {
            event.preventDefault();
            if (this.depth === 2) {
                event.stopPropagation();
                this.onhover.emit({
                    hover: flag,
                    index: i,
                    path: this.objectPath
                });
            }
        };
        __decorate([
            core.Input("collapsed")
        ], DifferentiateTree.prototype, "collapsed", void 0);
        __decorate([
            core.Input("children")
        ], DifferentiateTree.prototype, "children", void 0);
        __decorate([
            core.Input("showLeftActionButton")
        ], DifferentiateTree.prototype, "showLeftActionButton", void 0);
        __decorate([
            core.Input("showRightActionButton")
        ], DifferentiateTree.prototype, "showRightActionButton", void 0);
        __decorate([
            core.Input("status")
        ], DifferentiateTree.prototype, "status", void 0);
        __decorate([
            core.Input("side")
        ], DifferentiateTree.prototype, "side", void 0);
        __decorate([
            core.Input("level")
        ], DifferentiateTree.prototype, "level", void 0);
        __decorate([
            core.Input("objectPath")
        ], DifferentiateTree.prototype, "objectPath", void 0);
        __decorate([
            core.Input("categorizeBy")
        ], DifferentiateTree.prototype, "categorizeBy", void 0);
        __decorate([
            core.Input("leftSideToolTip")
        ], DifferentiateTree.prototype, "leftSideToolTip", void 0);
        __decorate([
            core.Input("rightSideToolTip")
        ], DifferentiateTree.prototype, "rightSideToolTip", void 0);
        __decorate([
            core.Output("onhover")
        ], DifferentiateTree.prototype, "onhover", void 0);
        __decorate([
            core.Output("onrevert")
        ], DifferentiateTree.prototype, "onrevert", void 0);
        __decorate([
            core.Output("onexpand")
        ], DifferentiateTree.prototype, "onexpand", void 0);
        DifferentiateTree = __decorate([
            core.Component({
                selector: 'differentiate-tree',
                template: "<div *ngIf=\"categorizeBy\" \r\n  class=\"diff-heading\" \r\n  (click)=\"expand($event)\">\r\n  <span class=\"arrow\" *ngIf=\"collapsed\">&#9658;</span>\r\n  <span class=\"arrow\" *ngIf=\"!collapsed\">&#9660;</span>\r\n  <span [textContent]=\"categorizeBy\"></span>\r\n  <span class=\"counter\" [textContent]=\"changCounter()\"></span>\r\n</div>\r\n<ul [class]=\"side\" [class.child]=\"depth ===2 || (categorizeBy && categorizeBy.length)\" [class.collapsed]=\"categorizeBy && collapsed\">\r\n  <li  *ngFor=\"let child of children\" \r\n    (mouseout)=\"depth === 2 ? mouseOvered($event, false, child.index) : null\"\r\n    (mouseover)=\"depth === 2 ? mouseOvered($event, true, child.index) : null\"\r\n    [class.hover]=\"child.hover\"\r\n    [class.added]=\"child.status === 5\" \r\n    [class.removed]=\"child.status === 6\" \r\n    [class.type-changed]=\"child.status === 2\" \r\n    [class.name-changed]=\"child.status === 3\" \r\n    [class.value-changed]=\"child.status === 4\">\r\n    <div \r\n      class='tree-node' \r\n      [ngClass]=\"'depth-' + depth\" \r\n      [class.left-action]=\"showLeftActionButton\"\r\n      [class.right-action]=\"showRightActionButton\" \r\n      [class.collapsed]=\"child.collapsed\" \r\n      [id] = \"child.id\">\r\n      <span [title]=\"rightSideToolTip\"\r\n        class=\"do\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToRightSide(child)\"\r\n        *ngIf=\"showLeftActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n      <span *ngIf='child.name && child.name!=null'\r\n        class='name' \r\n        [innerHTML]=\"child.name.length ? child.name : '&nbsp;'\">\r\n      </span>\r\n      <span *ngIf='child.value != undefined && child.value!=null'\r\n        class='value' \r\n        [class.string]=\"depth > 0 && child.value && child.value.length\"\r\n        [innerHTML]=\"child.value != undefined  ? ''+child.value : '&nbsp;'\">\r\n      </span>\r\n      <span [title]=\"leftSideToolTip\"\r\n        class=\"undo\" \r\n        tabindex=\"0\"\r\n        aria-hidden=\"true\"\r\n        (keyup)=\"keyup($event)\"\r\n        (click)=\"advanceToLeftSide(child)\"\r\n        *ngIf=\"showRightActionButton && status !== child.status && child.status > 1\">&#9100;</span>\r\n    </div>\r\n    <differentiate-tree *ngIf=\"child.children.length\" \r\n        [level]=\"depth+1\" \r\n        [status]=\"child.status\" \r\n        [collapsed]=\"child.collapsed\"\r\n        [categorizeBy]=\"child.categorizeBy\"\r\n        [showLeftActionButton]=\"showLeftActionButton\" \r\n        [leftSideToolTip]=\"leftSideToolTip\"\r\n        [showRightActionButton]=\"showRightActionButton\" \r\n        [rightSideToolTip]=\"rightSideToolTip\"\r\n        [objectPath]=\"objectPath + (objectPath.length ? ',':'') + child.index\"\r\n        (onhover)=\"bubleup($event)\"\r\n        (onrevert)=\"advance($event)\"\r\n        (onexpand)=\"autoExpand($event)\"\r\n        [class.child-node]=\"child.parent != 4\" \r\n        [children]='child.children'></differentiate-tree>\r\n    <div *ngIf=\"child.status > 2\" class=\"upper\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n    <div *ngIf=\"child.status > 2\" class=\"lower\" [class.collapsed]=\"child.collapsed\" [ngClass]=\"'depth-' + depth\" ></div>\r\n  </li>\r\n</ul>\r\n\r\n",
                styles: [":host{box-sizing:border-box;width:100%}:host.root{float:left;width:50%}:host.child-node{float:left}.diff-heading{padding:5px;font-weight:700;background:rgba(0,0,0,.02);border-bottom:1px solid rgba(0,0,0,.1);color:#666;cursor:pointer}.diff-heading .arrow{color:#999;font-size:.6rem;font-weight:700}.diff-heading .counter{float:right;border-radius:50%;width:16px;text-align:center;background-color:rgba(0,0,0,.4);font-size:.8rem;color:#fff}.diff-heading:first-child{border-top:1px solid rgba(0,0,0,.1)}ul{box-sizing:border-box;list-style:none;padding:0;width:100%}ul .collapsed,ul.collapsed{display:none!important}ul li .hover{background-color:rgba(0,0,0,.1)}ul li .hover .do,ul li .hover .undo{color:#000!important}ul li .tree-node{position:relative}ul li .tree-node.depth-0{display:none}ul li .tree-node .do,ul li .tree-node .undo{cursor:pointer;color:#751e1e;position:absolute;text-align:center;top:0;width:18px;z-index:2;height:100%}ul li .tree-node .undo{right:0}ul li .tree-node .do{left:0}ul.undefined li:hover{background-color:rgba(0,0,0,.1)}ul.left-side{border-right:1px solid rgba(0,0,0,.1);margin:0}ul.left-side li{position:relative;display:table;width:100%}ul.left-side li .do{border-right:1px solid #ddd;font-size:1.3rem;line-height:1.3rem;transform:scale(-1,1)}ul.left-side li .tree-node.left-action:before{position:absolute;top:0;left:0;width:18px;z-index:1;background:rgba(0,0,0,.02);height:100%;border-right:1px solid #ddd;content:\" \";display:block}ul.left-side li.added .name,ul.left-side li.added .value{opacity:.2;font-style:italic}ul.left-side li.added .upper{border-radius:0 0 100%;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;top:0;right:0}ul.left-side li.added .upper.depth-1{border:2px solid #245024;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-2{border:2px dotted #378637;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-3{border:1px solid #48ad48;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-4{border:1px dotted #57d657;border-top-width:0;border-left-width:0}ul.left-side li.added .upper.depth-5{border:1px dashed #67fa67;border-top-width:0;border-left-width:0}ul.left-side li.added .lower{border-radius:0 100% 0 0;box-sizing:border-box;height:50%;position:absolute;pointer-events:none;width:50%;bottom:0;right:0}ul.left-side li.added .lower.depth-1{border:2px solid #245024;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-2{border:2px dotted #378637;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-3{border:1px solid #48ad48;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-4{border:1px dotted #57d657;border-bottom-width:0;border-left-width:0}ul.left-side li.added .lower.depth-5{border:1px dashed #67fa67;border-bottom-width:0;border-left-width:0}ul.left-side li.removed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.removed .upper:after{content:\" - \";color:#962323;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.removed .lower{display:none}ul.left-side li.removed .tree-node span,ul.left-side li.type-changed .tree-node span{color:#962323}ul.left-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;width:66px;top:0;right:0;pointer-events:none}ul.left-side li.name-changed .upper:after{content:\" ~ \";color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.name-changed .tree-node .name{color:#000060}ul.left-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:66px;top:0;right:0}ul.left-side li.value-changed .upper:after{content:\" ~ \";color:#000060;font-weight:700;float:right;padding-right:10px;font-size:1.2rem;line-height:1.2rem}ul.left-side li.value-changed .tree-node .value{color:#000060}ul.right-side{border-left:1px solid rgba(0,0,0,.1);margin:0}ul.right-side li{position:relative;display:table;width:100%}ul.right-side li .undo{border-left:1px solid #ddd;font-size:1.3rem;line-height:1.3rem}ul.right-side li .tree-node.right-action:after{position:absolute;top:0;right:0;width:18px;z-index:1;background:rgba(0,0,0,.02);height:100%;border-left:1px solid #ddd;content:\" \";display:block}ul.right-side li.added .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;width:90%;top:0;left:0}ul.right-side li.added .upper:after{content:\"+\";color:#4a4;font-weight:700;padding-left:5px;font-size:1.2rem;line-height:1.2rem}ul.right-side li.added .lower{display:none}ul.right-side li.added .tree-node span{color:#4a4}ul.right-side li.removed .name,ul.right-side li.removed .value{-webkit-text-decoration-line:line-through;text-decoration-line:line-through;-webkit-text-decoration-color:#962323;text-decoration-color:#962323}ul.right-side li.removed .upper{border-radius:0 0 0 100%;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;top:0}ul.right-side li.removed .upper.depth-1{border:2px solid #600000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-2{border:2px dotted maroon;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-3{border:1px solid #a00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-4{border:1px dotted #c00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .upper.depth-5{border:1px dashed #f00000;border-top-width:0;border-right-width:0}ul.right-side li.removed .lower{border-radius:100% 0 0;box-sizing:border-box;height:50%;width:10%;position:absolute;pointer-events:none;bottom:0}ul.right-side li.removed .lower.depth-1{border:2px solid #600000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-2{border:2px dotted maroon;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-3{border:1px solid #a00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-4{border:1px dotted #c00000;border-bottom-width:0;border-right-width:0}ul.right-side li.removed .lower.depth-5{border:1px dashed #f00000;border-bottom-width:0;border-right-width:0}ul.right-side li.type-changed .tree-node span{color:#962323}ul.right-side li.name-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.name-changed .upper:before{content:\" ~ \";color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.name-changed .tree-node .name{color:#000060}ul.right-side li.value-changed .upper{box-sizing:border-box;height:100%;position:absolute;pointer-events:none;top:0;left:0}ul.right-side li.value-changed .upper:before{content:\" ~ \";color:#000060;font-weight:700;float:right;padding-left:5px;font-size:20px;line-height:16px}ul.right-side li.value-changed .tree-node .value{color:#000060}ul .tree-node{box-sizing:border-box;color:#7c9eb2;display:table;padding:0;position:relative;margin:0;width:100%}ul .tree-node.depth-0{padding-left:5px}ul .tree-node.depth-1{padding-left:20px}ul .tree-node.depth-2{padding-left:40px}ul .tree-node.depth-3{padding-left:60px}ul .tree-node.depth-4{padding-left:80px}ul .tree-node.depth-5{padding-left:100px}ul .tree-node.depth-6{padding-left:120px}ul .tree-node.depth-7{padding-left:140px}ul .tree-node.depth-8{padding-left:160px}ul .tree-node.depth-9{padding-left:180px}ul .tree-node.depth-10{padding-left:200px}ul .tree-node .name{color:#444;font-weight:700}ul .tree-node .name:after{content:\":\"}ul .tree-node .value.string:after,ul .tree-node .value.string:before{content:'\"'}"]
            })
        ], DifferentiateTree);
        return DifferentiateTree;
    }());

    var DifferentiateModule = /** @class */ (function () {
        function DifferentiateModule() {
        }
        DifferentiateModule = __decorate([
            core.NgModule({
                imports: [
                    common.CommonModule
                ],
                declarations: [
                    DifferentiateComponent,
                    DifferentiateTree
                ],
                exports: [
                    DifferentiateComponent
                ],
                entryComponents: [],
                providers: [],
                schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
            })
        ], DifferentiateModule);
        return DifferentiateModule;
    }());

    exports.DifferentiateComponent = DifferentiateComponent;
    exports.DifferentiateModule = DifferentiateModule;
    exports.DifferentiateTree = DifferentiateTree;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sedeh-differentiate.umd.js.map
