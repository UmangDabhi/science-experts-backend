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
exports.Progress = void 0;
const course_entity_1 = require("../../course/entities/course.entity");
const base_entity_1 = require("../../Helper/base.entity");
const module_entity_1 = require("../../module/entities/module.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const typeorm_1 = require("typeorm");
let Progress = class Progress extends base_entity_1.BaseEntity {
};
exports.Progress = Progress;
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.progress),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", user_entity_1.User)
], Progress.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course, (course) => course.progress),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.Course)
], Progress.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => module_entity_1.ModuleEntity, (module) => module.progress),
    (0, typeorm_1.JoinColumn)({ name: 'module_id' }),
    __metadata("design:type", module_entity_1.ModuleEntity)
], Progress.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Progress.prototype, "completed_at", void 0);
exports.Progress = Progress = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Unique)(['student', 'course', 'module'])
], Progress);
//# sourceMappingURL=progress.entity.js.map