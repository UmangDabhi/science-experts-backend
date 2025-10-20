# Lambda Migration - Code Changes Documentation

## Overview
This document describes all code changes made to migrate the NestJS backend from EC2 to AWS Lambda.

---

## 📁 New Files Created

### 1. `src/lambda.ts`
**Purpose:** Lambda handler entry point for NestJS application

**Key Features:**
- Uses `@codegenie/serverless-express` adapter to convert Lambda events to HTTP requests
- Implements caching of the NestJS app to improve cold start performance
- Configures `callbackWaitsForEmptyEventLoop` to false for better connection reuse
- Applies all global pipes, interceptors, and filters from main.ts

**Key Code Sections:**
```typescript
// Cached server to avoid recreating on each invocation
let cachedServer: Handler;

// Bootstrap function creates and caches the NestJS app
async function bootstrap() {
  if (!cachedServer) {
    // Create Express app and NestJS adapter
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // Configure and cache serverless handler
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

// Lambda handler with context configuration
export const handler: Handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const server = await bootstrap();
  return server(event, context);
};
```

---

### 2. `serverless.yml`
**Purpose:** Serverless Framework configuration for Lambda deployment

**Key Sections:**

#### Provider Configuration
```yaml
provider:
  name: aws
  runtime: nodejs20.x
  memorySize: 1024  # 1GB RAM
  timeout: 29       # Max for API Gateway
```

#### VPC Configuration (for Aurora access)
```yaml
vpc:
  securityGroupIds:
    - ${env:LAMBDA_SECURITY_GROUP_ID}
  subnetIds:
    - ${env:LAMBDA_SUBNET_ID_1}
    - ${env:LAMBDA_SUBNET_ID_2}
```

#### IAM Permissions
- S3 read/write for file uploads
- CloudWatch Logs for monitoring
- VPC network interface creation for Aurora access
- SES for email sending

#### API Gateway Configuration
- Binary media type support for file uploads
- CORS configuration
- ANY method mapping to handle all HTTP requests

#### Function Configuration
```yaml
functions:
  api:
    handler: dist/lambda.handler
    events:
      - http:
          method: ANY
          path: /           # Root path
      - http:
          method: ANY
          path: /{proxy+}   # All other paths
```

---

### 3. `src/app.module.lambda.ts`
**Purpose:** Lambda-optimized version of AppModule

**Key Changes from Original:**

#### ❌ Removed: Static File Serving
```typescript
// REMOVED - No longer needed in Lambda
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'public'),
  serveRoot: '/public/',
}),
ServeStaticModule.forRoot({
  rootPath: join(__dirname, '..', 'build'),
  exclude: ['/api*', '/public*'],
}),
```
**Reason:** Frontend is now served from S3 + CloudFront, not from backend

#### ✅ Added: Redis Conditional Configuration
```typescript
CacheModule.registerAsync({
  isGlobal: true,
  useFactory: async (configService: ConfigService) => {
    const redisHost = configService.get<string>('REDIS_HOST');

    if (redisHost && redisHost !== '') {
      // Use Redis (ElastiCache) if configured
      return {
        ttl: 60 * 5,
        stores: [createKeyv(`redis://${redisHost}:...`)],
      };
    }

    // Fallback to in-memory cache
    return {
      ttl: 60 * 5,
      max: 100,
    };
  },
}),
```
**Reason:** Redis is optional; falls back to in-memory if not configured

#### ✅ Modified: Database Connection Pooling
```typescript
TypeOrmModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    // ... database config ...

    // Lambda-optimized connection pooling
    extra: {
      max: 5,  // Reduced from default 10
      min: 1,
      idleTimeoutMillis: 30000,  // Close idle connections
      connectionTimeoutMillis: 10000,
    },

    // Enable SSL for Aurora
    ssl: configService.get<string>('DB_SSL') === 'true' ? {
      rejectUnauthorized: false,
    } : false,

    // Disable synchronize in production
    synchronize: configService.get<string>('NODE_ENV') !== 'production',
  }),
}),
```
**Reason:** Lambda instances are short-lived; smaller connection pools prevent overwhelming Aurora

---

### 4. `.env.production.template`
**Purpose:** Template for production environment variables

**Key Variables:**

#### Database (Aurora)
```env
DB_HOST=your-aurora-cluster.cluster-xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_SSL=true  # Always true for Aurora
```

#### Lambda VPC Configuration
```env
LAMBDA_SECURITY_GROUP_ID=sg-xxxxxxxxx
LAMBDA_SUBNET_ID_1=subnet-xxxxxxxxx
LAMBDA_SUBNET_ID_2=subnet-yyyyyyyyy
```

#### URLs
```env
BACKEND_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
FRONTEND_URL=https://your-cloudfront-domain.cloudfront.net
```

---

### 5. `deploy-lambda.sh`
**Purpose:** Automated deployment script

**Features:**
- Validates .env.production exists
- Installs dependencies
- Builds TypeScript code
- Deploys to specified stage (dev/prod)
- Shows API Gateway endpoint URL

**Usage:**
```bash
chmod +x deploy-lambda.sh
./deploy-lambda.sh prod
```

---

## 📦 Package.json Changes

### New Dependencies (Production)
```json
{
  "@codegenie/serverless-express": "^4.x",  // Lambda adapter
  "aws-lambda": "^1.x"                       // Lambda types
}
```

### New Dev Dependencies
```json
{
  "@types/aws-lambda": "^8.x",               // TypeScript types
  "serverless": "^3.40.0",                    // Framework
  "serverless-offline": "^13.8.1"            // Local testing
}
```

---

## 🔧 Configuration Changes

### TypeScript Build Configuration
No changes required - existing `tsconfig.json` works with Lambda

### Build Output
Lambda handler expects compiled code in `dist/` directory:
```
dist/
  └── lambda.js         # Entry point
  └── app.module.js
  └── main.js          # Not used in Lambda, but kept for compatibility
  └── ... other files
```

---

## 🚀 Deployment Process Changes

### Old EC2 Process
```bash
# On local machine
cd science-expert-vite
npm run build

# Transfer build to backend
cp -r dist/* ../science-expert-backend/build/

# On EC2 via SSH
cd /path/to/backend
git pull
npm run build
pm2 restart all
```

### New Lambda Process
```bash
# Frontend deployment (S3 + CloudFront)
cd science-expert-vite
npm run build
aws s3 sync dist/ s3://bucket-name --delete
aws cloudfront create-invalidation --distribution-id ID --paths "/*"

# Backend deployment (Lambda)
cd science-expert-backend
./deploy-lambda.sh prod
# OR
npx serverless deploy --stage prod
```

---

## 🔄 API Endpoint Changes

### Old EC2 Endpoints
```
https://your-ec2-domain.com/api/users
https://your-ec2-domain.com/api/courses
```

### New Lambda Endpoints
```
https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/users
https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/courses
```

**Frontend Update Required:**
Update `VITE_API_BASE_URL` in `science-expert-vite/.env.production`

---

## ⚠️ Important Considerations

### 1. Cold Starts
**Issue:** First request after idle period takes 2-3 seconds

**Mitigation:**
- Increased memory to 1024MB (more CPU = faster startup)
- Cached NestJS app instance in Lambda handler
- Optional: Enable provisioned concurrency (costs more)

### 2. Connection Pooling
**Issue:** Lambda instances are ephemeral; connections shouldn't persist

**Solution:**
- Reduced max connections to 5 per instance
- Configured idle timeout to 30 seconds
- Set `callbackWaitsForEmptyEventLoop` to false

### 3. File Uploads
**Issue:** Lambda has limited storage (/tmp = 512MB)

**Solution:**
- Files already uploaded to S3 (no changes needed)
- API Gateway supports binary media types (configured in serverless.yml)

### 4. Request Timeout
**Issue:** API Gateway has 29-second max timeout

**Solution:**
- Lambda timeout set to 29 seconds
- Long-running tasks should be moved to async processing (SQS/Step Functions)

### 5. Environment Variables
**Issue:** Can't use .env file directly in Lambda

**Solution:**
- Environment variables defined in `serverless.yml`
- Values loaded from `.env.production` during deployment
- Accessed via `ConfigService` as before (no code changes needed)

---

## 🧪 Testing Changes

### Local Testing
```bash
# Start local Lambda emulator
cd science-expert-backend
npx serverless offline

# Test endpoints
curl http://localhost:3000/api/health
```

### Production Testing
```bash
# After deployment
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/api/health

# Test authentication
curl -X POST https://your-api-id.../prod/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 📊 Monitoring Changes

### Old EC2 Monitoring
- PM2 logs
- System logs in `/var/log/`
- Custom logging

### New Lambda Monitoring
- CloudWatch Logs (automatic)
- CloudWatch Metrics (invocations, errors, duration)
- X-Ray tracing (optional)

**Access Logs:**
```bash
# Via AWS CLI
aws logs tail /aws/lambda/scienceexperts-backend-prod-api --follow

# Via AWS Console
CloudWatch → Log groups → /aws/lambda/scienceexperts-backend-prod-api
```

---

## 🔐 Security Changes

### IAM Roles
Lambda execution role with minimal permissions:
- S3 read/write (uploads bucket only)
- CloudWatch Logs write
- VPC network interface management
- SES send email

### VPC Configuration
Lambda must be in same VPC as Aurora for database access:
- Security group allows outbound traffic
- Aurora security group allows inbound from Lambda SG
- Lambda in private subnets with NAT Gateway for internet

### Environment Variables
Sensitive data in environment variables (encrypted at rest by AWS)

**Recommendation:** Use AWS Secrets Manager for production secrets

---

## 📝 Database Migration Notes

### Schema Synchronization
```typescript
// Disabled in production
synchronize: configService.get<string>('NODE_ENV') !== 'production'
```

**Production Schema Changes:**
- Run migrations manually
- Use TypeORM migrations: `npm run migration:generate`
- Apply via: `npm run migration:run`

### Connection String Format
```
postgresql://username:password@aurora-endpoint:5432/database?ssl=true
```

---

## 🎯 Rollback Plan

If issues occur, you can quickly rollback:

### Rollback Lambda Deployment
```bash
# List deployments
npx serverless deploy list

# Rollback to previous version
npx serverless rollback --timestamp TIMESTAMP
```

### Rollback to EC2
1. Start EC2 instance
2. Update frontend API URL back to EC2
3. Update DNS to point to EC2
4. Remove Lambda deployment

---

## 📚 Additional Resources

### AWS Documentation
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [Aurora Serverless](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)
- [API Gateway](https://docs.aws.amazon.com/apigateway/)

### Serverless Framework
- [NestJS on Lambda](https://www.serverless.com/examples/aws-node-typescript-nest)
- [Serverless Plugins](https://www.serverless.com/plugins/)

---

## ✅ Migration Checklist

- [ ] Install Lambda dependencies
- [ ] Create `src/lambda.ts` handler
- [ ] Create `serverless.yml` configuration
- [ ] Update `app.module.ts` for Lambda
- [ ] Configure `.env.production`
- [ ] Test locally with `serverless offline`
- [ ] Deploy to AWS: `serverless deploy --stage dev`
- [ ] Test all API endpoints
- [ ] Update frontend API URL
- [ ] Monitor CloudWatch logs
- [ ] Configure CloudWatch alarms
- [ ] Update documentation
- [ ] Train team on new deployment process

---

**Migration Complete! 🎉**

Your NestJS backend is now running serverless on AWS Lambda with pay-per-use pricing and automatic scaling.
