"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProgressDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_progress_dto_1 = require("./create-progress.dto");
class UpdateProgressDto extends (0, mapped_types_1.PartialType)(create_progress_dto_1.CreateProgressDto) {
}
exports.UpdateProgressDto = UpdateProgressDto;
//# sourceMappingURL=update-progress.dto.js.map