# NestJS Project Structure Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Root Directory Structure](#root-directory-structure)
3. [Source Code Architecture](#source-code-architecture)
4. [Folder Organization Patterns](#folder-organization-patterns)
5. [Code Architecture](#code-architecture)
6. [Naming Conventions](#naming-conventions)
7. [Best Practices](#best-practices)
8. [Module Patterns](#module-patterns)
9. [Development Guidelines](#development-guidelines)

## Project Overview

This is a comprehensive NestJS backend application built for an educational platform. The project follows a modular, scalable architecture with clear separation of concerns, robust error handling, and comprehensive caching strategies.

**Key Technologies:**
- NestJS (Node.js framework)
- TypeORM (Database ORM)
- PostgreSQL (Database)
- Redis (Caching)
- AWS S3 (File storage)
- JWT Authentication
- Class Validator & Class Transformer

## Root Directory Structure

```
science-expert-backend/
├── .claude/                    # Claude AI configuration
├── .git/                       # Git version control
├── build/                      # Production build files
├── dist/                       # Compiled TypeScript output
├── node_modules/               # Dependencies
├── public/                     # Static assets served publicly
├── src/                        # Source code (main application)
├── test/                       # Test files
├── uploads/                    # File upload storage
├── .env                        # Environment variables
├── .eslintrc.js               # ESLint configuration
├── .gitignore                 # Git ignore rules
├── .prettierrc                # Prettier formatting rules
├── nest-cli.json              # NestJS CLI configuration
├── package.json               # Project metadata and dependencies
├── package-lock.json          # Lock file for dependencies
├── README.md                  # Project documentation
├── S3-SECURITY-SETUP.md       # AWS S3 security documentation
├── tsconfig.json              # TypeScript configuration
└── tsconfig.build.json        # TypeScript build configuration
```

## Source Code Architecture

The `src/` directory follows a feature-based modular architecture:

```
src/
├── admission/                 # Admission management module
├── assets/                    # Static assets and resources
├── auth/                      # Authentication & authorization
├── blogs/                     # Blog management module
├── books/                     # Book resources module
├── category/                  # Category management
├── college/                   # College information module
├── college-courses/           # College course relationships
├── counter/                   # Counter/statistics service
├── course/                    # Course management module
├── email/                     # Email automation & templates
├── enrollment/                # Student enrollment module
├── file/                      # File upload & management
├── Helper/                    # Shared utilities and common code
├── interceptors/              # Global interceptors
├── language/                  # Language/localization module
├── log/                       # Logging system
├── material/                  # Educational materials module
├── module/                    # Course module management
├── papers/                    # Paper/document resources
├── payment/                   # Payment processing
├── progress/                  # Student progress tracking
├── quiz/                      # Quiz system
├── reviews/                   # Review & rating system
├── standard/                  # Educational standards
├── tutor_req/                 # Tutor request management
├── user/                      # User management
├── app.controller.spec.ts     # App controller tests
├── app.controller.ts          # Main app controller
├── app.module.ts              # Root module
├── app.service.ts             # Main app service
└── main.ts                    # Application bootstrap
```

## Folder Organization Patterns

### Feature Module Structure
Each feature module follows a consistent pattern:

```
feature-name/
├── dto/                       # Data Transfer Objects
│   ├── create-feature.dto.ts
│   ├── update-feature.dto.ts
│   └── query-feature.dto.ts
├── entities/                  # Database entities
│   ├── feature.entity.ts
│   └── feature-relation.entity.ts
├── feature.controller.ts      # REST API endpoints
├── feature.module.ts          # Module definition
├── feature.service.ts         # Business logic
└── feature-helper.service.ts  # Additional services (optional)
```

### Helper Directory Structure
The `Helper/` directory contains shared utilities:

```
Helper/
├── dto/                       # Shared DTOs
├── interfaces/                # TypeScript interfaces
├── message/                   # Response messages & API constants
│   ├── api.message.ts        # API endpoint constants
│   ├── cache.const.ts        # Cache key constants
│   ├── error.message.ts      # Error message constants
│   └── response.message.ts   # Success message constants
├── modules/                   # Shared modules
├── pagination/                # Pagination utilities
├── services/                  # Shared services
│   ├── cache.service.ts      # Cache management
│   ├── s3-url.service.ts     # AWS S3 operations
│   └── secure-download.service.ts
├── all-exceptions.filter.ts   # Global exception filter
├── base.entity.ts            # Base entity class
└── constants.ts              # Application constants
```

## Code Architecture

### Entity Pattern
All entities extend a base entity class:

```typescript
// Helper/base.entity.ts
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date | null;
}

// Example entity
@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;
}
```

### Service Pattern
Services contain business logic and database operations:

```typescript
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // Other dependencies...
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Business logic implementation
  }
}
```

### Controller Pattern
Controllers handle HTTP requests and use decorators for metadata:

```typescript
@Controller('user')
@UseInterceptors(SignedUrlInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  @Post(API_ENDPOINT.CREATE_USER)
  @ResponseMessage(MESSAGES.USER_CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    this.cacheService.deleteMultiple([CACHE_KEY.USERS]);
    return this.userService.create(createUserDto);
  }
}
```

### DTO Pattern
DTOs use class-validator for validation:

```typescript
export class CreateUserDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(6, 100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
```

## Naming Conventions

### Files and Folders
- **Modules**: `feature-name/` (kebab-case)
- **Controllers**: `feature.controller.ts`
- **Services**: `feature.service.ts`
- **Entities**: `feature.entity.ts`
- **DTOs**: `create-feature.dto.ts`, `update-feature.dto.ts`
- **Module files**: `feature.module.ts`

### Classes and Interfaces
- **Classes**: `PascalCase` (e.g., `UserService`, `CreateUserDto`)
- **Interfaces**: `PascalCase` with `I` prefix when needed
- **Enums**: `UPPER_SNAKE_CASE` (e.g., `Role.STUDENT`)

### Variables and Functions
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Functions**: `camelCase`
- **Database columns**: `snake_case`

### API Endpoints
- **Base paths**: `/api/{feature}` (automatically prefixed)
- **CRUD operations**:
  - GET `/feature` (list)
  - GET `/feature/:id` (get one)
  - POST `/feature` (create)
  - PATCH `/feature/:id` (update)
  - DELETE `/feature/:id` (delete)

## Best Practices

### Dependency Injection
- Use constructor-based dependency injection
- Inject repositories using `@InjectRepository()`
- Services are injected as dependencies

### Error Handling
- Use NestJS built-in exception classes
- Global exception filter handles all errors
- Custom error messages defined in `Helper/message/error.message.ts`

### Validation
- Use `class-validator` decorators in DTOs
- Global validation pipe configured in `main.ts`
- Custom validation rules when needed

### Caching Strategy
- Redis-based caching with `@nestjs/cache-manager`
- Cache keys defined in constants
- Cache invalidation on data mutations
- Interceptor-based caching for GET endpoints

### Database Relations
- Use TypeORM decorators for relationships
- Lazy loading for large relations
- Proper indexing on foreign keys

### Authentication & Authorization
- JWT-based authentication
- Guard-based route protection
- Role-based access control using enums

### Response Format
- Consistent API response structure via interceptors
- Success responses include `success`, `message`, `data`, `timestamp`
- Error responses include `success: false`, `message`, `timestamp`, `path`

## Module Patterns

### Module Registration
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([Entity1, Entity2]),
    // Other module imports
  ],
  controllers: [FeatureController],
  providers: [FeatureService, HelperService],
  exports: [FeatureService], // Export if used by other modules
})
export class FeatureModule {}
```

### Root Module Structure
The `AppModule` serves as the root module:
- Database configuration using `TypeOrmModule.forRootAsync()`
- Global configuration using `ConfigModule.forRoot()`
- Redis caching setup
- Static file serving
- All feature modules imported

### Global Providers
Global providers configured in `AppModule`:
- `APP_INTERCEPTOR`: Response transformation and logging
- `APP_FILTER`: Global exception handling
- `APP_PIPE`: Global validation

## Development Guidelines

### Environment Configuration
- Use `ConfigModule` for environment variables
- Environment-specific configurations in `.env` files
- Type-safe configuration using `ConfigService`

### File Uploads
- AWS S3 integration for file storage
- Secure URL generation for file access
- File type validation and size limits

### API Documentation
- Use constants for API endpoints (`Helper/message/api.message.ts`)
- Consistent response messages (`Helper/message/response.message.ts`)
- Clear error messages (`Helper/message/error.message.ts`)

### Testing Strategy
- Unit tests for services
- Integration tests for controllers
- E2E tests for complete workflows
- Mock external dependencies

### Security Measures
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- SQL injection prevention via TypeORM
- CORS configuration

### Performance Optimization
- Redis caching for frequently accessed data
- Database query optimization
- Pagination for large datasets
- Background job processing where applicable

### Code Quality
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode enabled
- Comprehensive error handling

This structure ensures maintainability, scalability, and consistency across the entire NestJS application. Follow these patterns when creating new features or modifying existing ones to maintain code quality and project coherence.