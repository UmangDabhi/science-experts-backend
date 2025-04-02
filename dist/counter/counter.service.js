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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const counter_entity_1 = require("./counter.entity");
let CounterService = class CounterService {
    constructor(counterRepository) {
        this.counterRepository = counterRepository;
    }
    async getNextStudentId() {
        let [counter] = await this.counterRepository.find();
        if (!counter) {
            counter = this.counterRepository.create();
            counter.lastStudentId = 1000;
            await this.counterRepository.save(counter);
        }
        const nextId = counter.lastStudentId + 1;
        counter.lastStudentId = nextId;
        await this.counterRepository.save(counter);
        return `CD_${nextId}`;
    }
};
exports.CounterService = CounterService;
exports.CounterService = CounterService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(counter_entity_1.Counter)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CounterService);
//# sourceMappingURL=counter.service.js.map