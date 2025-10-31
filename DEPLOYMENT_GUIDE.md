# Science Experts Backend - Deployment Guide

Complete migration from AWS to the cost-effective serverless stack.

## New Tech Stack (2025)

| Service | Platform | Purpose | Cost |
|---------|----------|---------|------|
| **Backend** | Render | NestJS API hosting | $0-$7/mo |
| **Database** | Neon.tech | PostgreSQL serverless | $0 |
| **Storage** | Cloudflare R2 | Object storage | $0-$1/mo |
| **Frontend** | Vercel | React hosting | $0 |
| **Total** | | | **$0-$8/mo** |

---

## Step 1: Database Setup (Neon.tech)

### 1.1 Create Neon Database

1. Go to [https://neon.tech/](https://neon.tech/)
2. Sign up/login with GitHub
3. Click "Create Project"
4. Configure:
   - **Project name**: `scienceexperts-db`
   - **Region**: Choose closest to your users
   - **PostgreSQL version**: 16 (latest)
5. Click "Create Project"

### 1.2 Get Database Credentials

1. In Neon dashboard, go to your project
2. Click "Connection Details"
3. Copy the connection string or individual values:
   ```
   DB_HOST=ep-xxx-xxx.xxx.aws.neon.tech
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=scienceexperts_db
   DB_SSL=true
   ```

### 1.3 Migrate Existing Data (Optional)

If you have existing data in AWS Aurora:

```bash
# Export from AWS Aurora
pg_dump -h your-aurora-host.rds.amazonaws.com \
  -U postgres \
  -d scienceexperts_db \
  -F c \
  -f backup.dump

# Import to Neon
pg_restore -h ep-xxx.neon.tech \
  -U your_neon_username \
  -d scienceexperts_db \
  -v backup.dump
```

**Note**: Neon auto-pauses after 5 minutes of inactivity (free tier), saving costs.

---

## Step 2: Storage Setup (Cloudflare R2)

### 2.1 Create R2 Bucket

1. Go to [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
2. Navigate to **R2 Object Storage**
3. Click "Create bucket"
4. Configure:
   - **Bucket name**: `scienceexperts-uploads`
   - **Location**: Automatic (global CDN)
5. Click "Create bucket"

### 2.2 Generate R2 API Tokens

1. In R2 dashboard, click "Manage R2 API Tokens"
2. Click "Create API Token"
3. Configure:
   - **Token name**: `scienceexperts-backend`
   - **Permissions**: Read & Write
   - **TTL**: Never expire
4. Click "Create API Token"
5. **Save these credentials** (shown only once):
   ```
   R2_ACCESS_KEY_ID=xxx
   R2_SECRET_ACCESS_KEY=xxx
   ```
6. Note your Account ID from the R2 dashboard

### 2.3 Configure Public Access (Optional)

For public read access (like profile images):

1. Go to your bucket settings
2. Enable "Public access" or set up custom domain
3. Your public URL will be: `https://pub-<account_id>.r2.dev`

### 2.4 Migrate Existing Files from S3

```bash
# Install AWS CLI and configure
aws configure

# Sync from S3 to R2 (R2 is S3-compatible)
aws s3 sync s3://your-old-bucket/ s3://scienceexperts-uploads/ \
  --endpoint-url https://<account_id>.r2.cloudflarestorage.com \
  --profile r2
```

Or use rclone for faster transfer:
```bash
rclone sync s3:your-old-bucket r2:scienceexperts-uploads
```

---

## Step 3: Backend Deployment (Render)

### 3.1 Prepare Repository

1. Push code to GitHub (if not already):
   ```bash
   git add .
   git commit -m "Migrate to Render/Neon/R2 stack"
   git push origin main
   ```

### 3.2 Create Render Web Service

1. Go to [https://render.com/](https://render.com/)
2. Sign up/login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `scienceexperts-backend`
   - **Region**: Oregon (or closest to your users)
   - **Branch**: `main`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free (or Starter $7/mo for better performance)

### 3.3 Set Environment Variables

In Render dashboard, add all environment variables from `.env.example`:

**Database (Neon)**:
```
DB_HOST=ep-xxx.neon.tech
DB_PORT=5432
DB_USERNAME=your_neon_username
DB_PASSWORD=your_neon_password
DB_DATABASE=scienceexperts_db
DB_SSL=true
```

**Cloudflare R2**:
```
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_BUCKET_NAME=scienceexperts-uploads
R2_PUBLIC_URL=https://pub-<account_id>.r2.dev
```

**JWT & App**:
```
NODE_ENV=production
JWT_SECRET=your_super_secret_key
JWT_EXPIRATION=7d
```

**Razorpay**:
```
RAZORPAY_MODE=live
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

**Email (SMTP)**:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Science Experts
```

**URLs** (set after deployment):
```
BACKEND_URL=https://your-service.onrender.com
FRONTEND_URL=https://your-app.vercel.app
```

### 3.4 Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Wait for deployment to complete (~5 minutes)
4. Your API will be live at: `https://your-service.onrender.com`

### 3.5 Test Deployment

```bash
# Health check
curl https://your-service.onrender.com/api/health

# Test API endpoint
curl https://your-service.onrender.com/api/auth/login
```

---

## Step 4: Frontend Deployment (Vercel)

### 4.1 Update Frontend Environment Variables

In your frontend `.env`:
```
REACT_APP_API_URL=https://your-service.onrender.com/api
```

### 4.2 Deploy to Vercel

1. Go to [https://vercel.com/](https://vercel.com/)
2. Sign up/login with GitHub
3. Click "Add New..." → "Project"
4. Import your frontend repository
5. Configure:
   - **Framework Preset**: React (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build` or `dist`
6. Add environment variable:
   - `REACT_APP_API_URL=https://your-service.onrender.com/api`
7. Click "Deploy"

### 4.3 Update Backend with Frontend URL

Go back to Render dashboard and update:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

## Step 5: Cleanup Old AWS Resources

⚠️ **IMPORTANT**: Only do this after verifying the new stack works!

### 5.1 Verify Migration

- [ ] Backend API working on Render
- [ ] Frontend deployed on Vercel
- [ ] Database connected to Neon
- [ ] Files uploading to R2
- [ ] All features working end-to-end

### 5.2 Delete AWS Resources

1. **AWS Lambda**: Delete function and API Gateway
2. **AWS S3**: Delete bucket (after backing up)
3. **AWS RDS Aurora**: Delete cluster (after backing up)
4. **AWS VPC/Security Groups**: Delete if not used elsewhere

### 5.3 Remove AWS Files (Local)

```bash
# Remove Lambda-specific files
rm src/lambda.ts
rm src/app.module.lambda.ts
rm serverless.yml

# Optional: Remove from git history
git rm src/lambda.ts src/app.module.lambda.ts serverless.yml
git commit -m "Remove AWS Lambda deployment files"
```

---

## Cost Comparison

### Old AWS Stack
| Service | Cost/Month |
|---------|------------|
| Lambda | $10-50 |
| RDS Aurora Serverless | $30-100 |
| S3 + Data Transfer | $5-20 |
| VPC | $5 |
| **Total** | **$50-175/mo** |

### New Serverless Stack
| Service | Cost/Month |
|---------|------------|
| Render (Free) | $0 |
| Neon.tech (Free) | $0 |
| Cloudflare R2 | $0-1 |
| Vercel (Free) | $0 |
| **Total** | **$0-1/mo** |

**Savings**: ~$50-175/month = **$600-2,100/year** 💰

---

## Performance Notes

### Free Tier Limitations

**Render Free**:
- Sleeps after 15 min inactivity
- First request after sleep: ~30s cold start
- Solution: Upgrade to Starter ($7/mo) for always-on

**Neon Free**:
- Auto-pauses after 5 min inactivity
- First query after pause: ~1-2s cold start
- 512 MB storage limit
- Solution: Upgrade to Pro ($19/mo) for more storage

**R2 Free**:
- 10 GB storage
- 10 million Class A operations/month
- Unlimited bandwidth (no egress fees!)
- Solution: Only pay for storage/operations beyond free tier

### Recommended for Production

For best performance at minimal cost:
- **Render Starter**: $7/mo (always-on, no cold starts)
- **Neon Free**: $0 (sufficient for most apps)
- **R2 Free**: $0 (generous limits)
- **Total**: **$7/mo**

Still **~$50-170/mo savings** vs AWS!

---

## Monitoring & Maintenance

### Health Checks

Add health endpoint in `src/main.ts` if not already:
```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

### Render Monitoring

- View logs in Render dashboard
- Set up health check endpoint
- Configure alerts for downtime

### Neon Monitoring

- Monitor database usage in Neon dashboard
- Set up connection pooling for better performance
- Enable auto-pause to save costs

### R2 Monitoring

- View storage usage in Cloudflare dashboard
- Monitor bandwidth (unlimited egress!)
- Set up bucket policies for security

---

## Troubleshooting

### Database Connection Issues

```typescript
// Ensure SSL is enabled for Neon
DB_SSL=true
```

### R2 Upload Failures

```typescript
// Check R2 credentials and bucket name
// Verify endpoint URL format
```

### Render Build Failures

```bash
# Check build logs in Render dashboard
# Ensure all dependencies in package.json
# Verify Node version compatibility
```

---

## Support & Resources

- **Render Docs**: [https://render.com/docs](https://render.com/docs)
- **Neon Docs**: [https://neon.tech/docs](https://neon.tech/docs)
- **Cloudflare R2 Docs**: [https://developers.cloudflare.com/r2/](https://developers.cloudflare.com/r2/)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)

---

## Migration Checklist

- [ ] Create Neon database
- [ ] Create Cloudflare R2 bucket
- [ ] Generate R2 API tokens
- [ ] Update backend code (R2 integration)
- [ ] Deploy to Render
- [ ] Configure environment variables
- [ ] Test API endpoints
- [ ] Deploy frontend to Vercel
- [ ] Test end-to-end functionality
- [ ] Migrate existing data (if any)
- [ ] Update DNS/domains
- [ ] Monitor for 24-48 hours
- [ ] Delete AWS resources (after verification)

---

**Congratulations! You've successfully migrated to a $0-8/mo serverless stack! 🎉**
