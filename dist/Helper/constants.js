"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStoragePath = exports.ResponseMessage = exports.Is_Free_To_Watch = exports.Is_Approved = exports.Is_Paid = exports.Role = void 0;
const common_1 = require("@nestjs/common");
const path_1 = require("path");
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["TUTOR"] = "tutor";
    Role["STUDENT"] = "student";
})(Role || (exports.Role = Role = {}));
exports.Is_Paid = {
    YES: true,
    NO: false,
};
exports.Is_Approved = {
    YES: true,
    NO: false,
};
exports.Is_Free_To_Watch = {
    YES: true,
    NO: false,
};
const ResponseMessage = (message) => (0, common_1.SetMetadata)('responseMessage', message);
exports.ResponseMessage = ResponseMessage;
exports.localStoragePath = (0, path_1.join)(__dirname, '..', '..', 'public', 'uploads');
//# sourceMappingURL=constants.js.map