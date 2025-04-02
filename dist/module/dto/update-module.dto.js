"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateModuleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_module_dto_1 = require("./create-module.dto");
class UpdateModuleDto extends (0, mapped_types_1.PartialType)(create_module_dto_1.CreateModuleDto) {
}
exports.UpdateModuleDto = UpdateModuleDto;
//# sourceMappingURL=update-module.dto.js.map