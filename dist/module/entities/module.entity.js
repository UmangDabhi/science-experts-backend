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
exports.ModuleEntity = void 0;
const course_entity_1 = require("../../course/entities/course.entity");
const enrollment_entity_1 = require("../../enrollment/entities/enrollment.entity");
const base_entity_1 = require("../../Helper/base.entity");
const constants_1 = require("../../Helper/constants");
const progress_entity_1 = require("../../progress/entities/progress.entity");
const review_entity_1 = require("../../reviews/entities/review.entity");
const typeorm_1 = require("typeorm");
let ModuleEntity = class ModuleEntity extends base_entity_1.BaseEntity {
};
exports.ModuleEntity = ModuleEntity;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ModuleEntity.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ModuleEntity.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ModuleEntity.prototype, "thumbnail_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ModuleEntity.prototype, "video_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ModuleEntity.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.modules),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.Course)
], ModuleEntity.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: constants_1.Is_Free_To_Watch,
        default: constants_1.Is_Free_To_Watch.NO,
    }),
    __metadata("design:type", Boolean)
], ModuleEntity.prototype, "is_free_to_watch", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => enrollment_entity_1.Enrollment, (enrollments) => enrollments.course),
    __metadata("design:type", Array)
], ModuleEntity.prototype, "enrollments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => progress_entity_1.Progress, (progress) => progress.module),
    __metadata("design:type", Array)
], ModuleEntity.prototype, "progress", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.module),
    __metadata("design:type", Array)
], ModuleEntity.prototype, "review", void 0);
exports.ModuleEntity = ModuleEntity = __decorate([
    (0, typeorm_1.Entity)('module')
], ModuleEntity);
//# sourceMappingURL=module.entity.js.map