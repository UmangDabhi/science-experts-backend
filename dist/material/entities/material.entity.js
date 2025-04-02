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
exports.Material = void 0;
const course_entity_1 = require("../../course/entities/course.entity");
const base_entity_1 = require("../../Helper/base.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Material = class Material extends base_entity_1.BaseEntity {
};
exports.Material = Material;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Material.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Material.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Material.prototype, "material_url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.materials),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.Course)
], Material.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (tutor) => tutor.courses),
    (0, typeorm_1.JoinColumn)({ name: 'tutor_id' }),
    __metadata("design:type", user_entity_1.User)
], Material.prototype, "tutor", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Material.prototype, "amount", void 0);
exports.Material = Material = __decorate([
    (0, typeorm_1.Entity)()
], Material);
//# sourceMappingURL=material.entity.js.map