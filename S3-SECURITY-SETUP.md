# S3 Bucket Security Configuration

## 🚨 Current Issue Identified

Your S3 bucket (`science-experts-uploads`) currently has **public read access**, which means:
- Direct URLs work without authentication: `https://science-experts-uploads.s3.eu-north-1.amazonaws.com/Book/Books/file.pdf`
- Signed URLs provide no additional security
- Anyone with the direct URL can access files

## 🔧 Required S3 Security Configuration

### 1. **Remove Public Access**

#### AWS Console Steps:
1. Go to **AWS S3 Console** → `science-experts-uploads` bucket
2. Click **Permissions** tab
3. **Block Public Access Settings** → Edit
4. Enable all four options:
   - ✅ Block all public ACLs
   - ✅ Ignore public ACLs
   - ✅ Block all public bucket policies
   - ✅ Ignore public bucket policies
5. Click **Save changes**

#### AWS CLI Command:
```bash
aws s3api put-public-access-block \
  --bucket science-experts-uploads \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 2. **Remove Existing Public Policies**

#### Check Current Policy:
```bash
aws s3api get-bucket-policy --bucket science-experts-uploads
```

#### Remove Public Policy:
```bash
aws s3api delete-bucket-policy --bucket science-experts-uploads
```

### 3. **Set Proper IAM-Only Access**

Create a bucket policy that only allows your application's IAM user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::science-experts-uploads/*",
      "Condition": {
        "StringNotEquals": {
          "aws:PrincipalArn": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USER"
        }
      }
    },
    {
      "Sid": "AllowApplicationAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:user/YOUR_IAM_USER"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::science-experts-uploads/*"
    }
  ]
}
```

#### Apply Policy:
```bash
aws s3api put-bucket-policy --bucket science-experts-uploads --policy file://bucket-policy.json
```

## ✅ Verification Steps

After implementing the security changes:

### 1. **Test Direct URL Access (Should Fail)**
```bash
curl -I https://science-experts-uploads.s3.eu-north-1.amazonaws.com/Book/Books/file.pdf
# Expected: HTTP 403 Forbidden
```

### 2. **Test Signed URL Access (Should Work)**
```bash
# Use the new download API endpoints:
# GET /books/download/:id
# GET /material/download/:id
# GET /papers/download/:id
```

### 3. **Verify Bucket Security**
```bash
aws s3api get-public-access-block --bucket science-experts-uploads
# Should show all blocks enabled
```

## 🔒 New Secure Download Flow

### **Before (Insecure)**
```
Frontend → GET /books → Direct S3 URL → Public Access ❌
```

### **After (Secure)**
```
Frontend → GET /books/download/:id → Access Check → Signed URL → Limited Access ✅
```

## 📋 New API Endpoints

### **Books Download**
```http
GET /books/download/:id
Authorization: Bearer <jwt-token>

Response:
{
  "success": true,
  "message": "Book download URL generated",
  "data": {
    "download_url": "https://science-experts-uploads.s3.eu-north-1.amazonaws.com/...",
    "expires_in": 3600
  }
}
```

### **Materials Download**
```http
GET /material/download/:id
Authorization: Bearer <jwt-token>

Response:
{
  "success": true,
  "message": "Material download URL generated",
  "data": {
    "download_url": "https://science-experts-uploads.s3.eu-north-1.amazonaws.com/...",
    "expires_in": 3600
  }
}
```

### **Papers Download**
```http
GET /papers/download/:id
Authorization: Bearer <jwt-token>

Response:
{
  "success": true,
  "message": "Paper download URL generated",
  "data": {
    "download_url": "https://science-experts-uploads.s3.eu-north-1.amazonaws.com/...",
    "expires_in": 3600
  }
}
```

## 🛡️ Access Control Logic

### **Books Access**
- ✅ Admin users: Full access
- ✅ Tutor who created the book
- ✅ Students who purchased the book
- ❌ Other users: Access denied

### **Materials Access**
- ✅ Admin users: Full access
- ✅ Tutor who created the material
- ✅ Students who purchased the material
- ❌ Other users: Access denied

### **Papers Access**
- ✅ Admin users: Full access
- ✅ Tutor who created the paper
- ✅ Students who purchased the paper
- ❌ Other users: Access denied

## ⚠️ Important Notes

1. **Breaking Change**: After implementing S3 security, direct URLs in existing responses will no longer work
2. **Frontend Updates**: Update frontend to use new download endpoints instead of direct URLs
3. **Mobile Apps**: Update mobile apps to use new secure download flow
4. **URL Expiration**: Signed URLs expire in 1 hour (configurable)
5. **Performance**: Download endpoints check user permissions before generating signed URLs

## 🔄 Migration Strategy

### **Phase 1: Deploy New APIs**
- ✅ Deploy secure download endpoints
- Keep existing interceptor for backward compatibility
- Test new endpoints

### **Phase 2: Update Frontend**
- Replace direct URL usage with download API calls
- Update file download components
- Test download functionality

### **Phase 3: Secure S3 Bucket**
- Apply S3 security configuration
- Verify direct URLs are blocked
- Monitor for any issues

### **Phase 4: Cleanup**
- Remove old direct URL handling if needed
- Update documentation
- Train team on new secure flow

## 📊 Security Benefits

- **✅ Access Control**: Only authorized users can download files
- **✅ Time-Limited Access**: URLs expire automatically
- **✅ Audit Trail**: All downloads are logged with user information
- **✅ Purchase Validation**: Ensures users have paid for content
- **✅ Role-Based Security**: Different access levels for different user types

This implementation provides enterprise-level security for your educational content while maintaining a smooth user experience!