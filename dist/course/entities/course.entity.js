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
exports.Course = void 0;
const category_entity_1 = require("../../category/entities/category.entity");
const enrollment_entity_1 = require("../../enrollment/entities/enrollment.entity");
const base_entity_1 = require("../../Helper/base.entity");
const constants_1 = require("../../Helper/constants");
const material_entity_1 = require("../../material/entities/material.entity");
const module_entity_1 = require("../../module/entities/module.entity");
const progress_entity_1 = require("../../progress/entities/progress.entity");
const review_entity_1 = require("../../reviews/entities/review.entity");
const standard_entity_1 = require("../../standard/entities/standard.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Course = class Course extends base_entity_1.BaseEntity {
};
exports.Course = Course;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Course.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "detail_description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "thumbnail_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        enum: constants_1.Is_Paid,
        default: constants_1.Is_Paid.NO,
    }),
    __metadata("design:type", Boolean)
], Course.prototype, "is_paid", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'bigint',
        nullable: true,
    }),
    __metadata("design:type", Number)
], Course.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'int',
        default: 0,
    }),
    __metadata("design:type", Number)
], Course.prototype, "discount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "certificate_url", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0.0,
    }),
    __metadata("design:type", Number)
], Course.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'boolean',
        enum: constants_1.Is_Approved,
        default: constants_1.Is_Approved.NO,
    }),
    __metadata("design:type", Boolean)
], Course.prototype, "is_approved", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (tutor) => tutor.courses, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tutor_id' }),
    __metadata("design:type", user_entity_1.User)
], Course.prototype, "tutor", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => module_entity_1.ModuleEntity, (modules) => modules.course),
    __metadata("design:type", Array)
], Course.prototype, "modules", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => material_entity_1.Material, (materials) => materials.course, {
        nullable: true,
    }),
    __metadata("design:type", Array)
], Course.prototype, "materials", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => enrollment_entity_1.Enrollment, (enrollments) => enrollments.course),
    __metadata("design:type", Array)
], Course.prototype, "enrollments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => progress_entity_1.Progress, (progress) => progress.course),
    __metadata("design:type", Array)
], Course.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.course),
    __metadata("design:type", Array)
], Course.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (categories) => categories.courses),
    (0, typeorm_1.JoinTable)({
        name: 'course_category_mapping',
        joinColumn: { name: 'course_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Course.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => standard_entity_1.Standard, (standards) => standards.courses),
    (0, typeorm_1.JoinTable)({
        name: 'course_standard_mapping',
        joinColumn: { name: 'course_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'standard_id', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Course.prototype, "standards", void 0);
exports.Course = Course = __decorate([
    (0, typeorm_1.Entity)()
], Course);
//# sourceMappingURL=course.entity.js.map