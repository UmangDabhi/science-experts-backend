"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const serve_static_1 = require("@nestjs/serve-static");
const typeorm_1 = require("@nestjs/typeorm");
const path_1 = require("path");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const certificate_module_1 = require("./certificate/certificate.module");
const course_module_1 = require("./course/course.module");
const enrollment_module_1 = require("./enrollment/enrollment.module");
const file_module_1 = require("./file/file.module");
const log_entity_1 = require("./log/log.entity");
const logging_intercepter_1 = require("./log/logging.intercepter");
const material_module_1 = require("./material/material.module");
const module_module_1 = require("./module/module.module");
const payment_module_1 = require("./payment/payment.module");
const user_module_1 = require("./user/user.module");
const category_module_1 = require("./category/category.module");
const standard_module_1 = require("./standard/standard.module");
const progress_module_1 = require("./progress/progress.module");
const reviews_module_1 = require("./reviews/reviews.module");
const path = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'public'),
                serveRoot: '/public/',
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'build'),
                exclude: ['/api*', '/public*'],
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: path.resolve(__dirname, '..', '.env'),
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    ssl: {
                        rejectUnauthorized: false,
                    },
                    extra: {
                        ssl: {
                            rejectUnauthorized: false,
                        },
                    },
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature([log_entity_1.Log]),
            user_module_1.UserModule,
            course_module_1.CourseModule,
            module_module_1.ModuleModule,
            enrollment_module_1.EnrollmentModule,
            payment_module_1.PaymentModule,
            certificate_module_1.CertificateModule,
            material_module_1.MaterialModule,
            auth_module_1.AuthModule,
            file_module_1.FileModule,
            category_module_1.CategoryModule,
            standard_module_1.StandardModule,
            certificate_module_1.CertificateModule,
            progress_module_1.ProgressModule,
            reviews_module_1.ReviewsModule,
            payment_module_1.PaymentModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_intercepter_1.LoggingInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map