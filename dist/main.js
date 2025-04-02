"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./Helper/all-exceptions.filter");
const response_intercepter_1 = require("./interceptors/response.intercepter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalInterceptors(new response_intercepter_1.ResponseInterceptor());
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map