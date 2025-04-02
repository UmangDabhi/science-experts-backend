"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Standard = void 0;
const course_entity_1 = require("../../course/entities/course.entity");
const base_entity_1 = require("../../Helper/base.entity");
const typeorm_1 = require("typeorm");
let Standard = class Standard extends base_entity_1.BaseEntity {
};
exports.Standard = Standard;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Standard.prototype, "standard", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => course_entity_1.Course, (course) => course.standards),
    __metadata("design:type", Array)
], Standard.prototype, "courses", void 0);
exports.Standard = Standard = __decorate([
    (0, typeorm_1.Entity)()
], Standard);
//# sourceMappingURL=standard.entity.js.map