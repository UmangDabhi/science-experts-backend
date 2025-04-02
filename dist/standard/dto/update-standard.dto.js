"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStandardDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_standard_dto_1 = require("./create-standard.dto");
class UpdateStandardDto extends (0, mapped_types_1.PartialType)(create_standard_dto_1.CreateStandardDto) {
}
exports.UpdateStandardDto = UpdateStandardDto;
//# sourceMappingURL=update-standard.dto.js.map