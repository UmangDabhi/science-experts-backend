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
exports.Log = void 0;
const typeorm_1 = require("typeorm");
let Log = class Log {
};
exports.Log = Log;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Log.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 10, nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255, nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], Log.prototype, "requestBody", void 0);
__decorate([
    (0, typeorm_1.Column)('json', { nullable: true }),
    __metadata("design:type", Object)
], Log.prototype, "responseBody", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "requestUser", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Log.prototype, "statusCode", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Log.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 3, nullable: true }),
    __metadata("design:type", Number)
], Log.prototype, "executionTime", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], Log.prototype, "error", void 0);
exports.Log = Log = __decorate([
    (0, typeorm_1.Entity)()
], Log);
//# sourceMappingURL=log.entity.js.map