# Science Expert Backend

A comprehensive NestJS backend application for an educational platform that provides courses, materials, books, papers, and tutorials for students and tutors.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **User Management**: Student and tutor profiles with referral system
- **Educational Content**: Courses, materials, books, papers, and blogs
- **Payment System**: Integrated payment processing with balance management
- **Tutorial System**: Interactive joyride tutorials for new users
- **Progress Tracking**: Student progress monitoring and analytics
- **File Management**: AWS S3 integration for file storage
- **Caching**: Redis-based caching for improved performance
- **Real-time Updates**: Progress tracking and notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Redis (for caching)
- AWS S3 bucket (for file storage)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd science-expert-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_NAME=science_expert_db

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET=your_s3_bucket_name

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Database Setup**
   ```bash
   # Run database migrations (if applicable)
   npm run migration:run
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
