# HueX - AWS RDS Migration Guide

## Current Status

✅ **Backend is RDS-ready** but currently using SQLite for local development.

⚠️ **AWS Academy Learning Lab Restrictions**: Cannot create RDS instances due to IAM limitations.

## When You Have Full AWS Access

Follow these steps to migrate from SQLite to PostgreSQL on AWS RDS:

---

## Step 1: Create RDS PostgreSQL Instance

### Option A: AWS Console (Recommended for beginners)

1. Go to **AWS RDS Console**
2. Click **Create database**
3. Choose **PostgreSQL**
4. Select **Free tier** template (or your preferred tier)
5. Configure:
   - **DB instance identifier**: `huex-db`
   - **Master username**: `huex_admin`
   - **Master password**: (create a secure password)
   - **DB instance class**: `db.t3.micro` (free tier eligible)
   - **Storage**: 20 GB
   - **Public access**: Yes (for development)
   - **VPC security group**: Create new or use existing
6. Click **Create database**
7. Wait 5-10 minutes for creation

### Option B: AWS CLI

```bash
aws rds create-db-instance \
  --db-instance-identifier huex-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username huex_admin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --publicly-accessible \
  --backup-retention-period 7 \
  --storage-encrypted
```

---

## Step 2: Configure Security Group

Allow inbound connections on port 5432:

1. Go to **EC2 Console** → **Security Groups**
2. Find the RDS security group
3. Add inbound rule:
   - **Type**: PostgreSQL
   - **Port**: 5432
   - **Source**: Your IP (for development) or `0.0.0.0/0` (for testing only!)

---

## Step 3: Get RDS Endpoint

```bash
aws rds describe-db-instances \
  --db-instance-identifier huex-db \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

Output example: `huex-db.c9akciq32.us-east-1.rds.amazonaws.com`

---

## Step 4: Update Backend Configuration

### Update `.env` file:

```env
# Database Configuration (PostgreSQL on RDS)
DB_TYPE=postgres
DB_HOST=huex-db.c9akciq32.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_USERNAME=huex_admin
DB_PASSWORD=your-secure-password-here
DB_NAME=huex_production
DB_SSL=true

# JWT Configuration (keep existing)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# AWS Configuration
AWS_REGION=us-east-1

# Application
NODE_ENV=production
PORT=3000

# CORS (update with your mobile app domain)
CORS_ORIGIN=*
```

---

## Step 5: Test Connection

```bash
# Install PostgreSQL client (if not already installed)
# Windows: Download from postgresql.org
# Mac: brew install postgresql
# Linux: sudo apt-get install postgresql-client

# Test connection
psql -h huex-db.c9akciq32.us-east-1.rds.amazonaws.com \
     -U huex_admin \
     -d postgres
```

Enter your password when prompted. If successful, you'll see:
```
postgres=>
```

---

## Step 6: Deploy Backend

### Local Testing First:

```bash
cd backend
npm install
npm run start:dev
```

Check logs for:
```
[TypeOrmModule] Database connection established
Application is running on: http://localhost:3000
```

### Test Endpoints:

```bash
# Register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## Step 7: Production Deployment

### Option A: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd backend
eb init -p node.js huex-backend --region us-east-1

# Create environment
eb create huex-production

# Deploy
eb deploy
```

### Option B: AWS EC2

1. Launch EC2 instance (t2.micro for free tier)
2. SSH into instance
3. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
4. Clone your repository
5. Install dependencies: `npm install`
6. Set environment variables
7. Run with PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "huex-backend" -- run start:prod
   pm2 save
   pm2 startup
   ```

### Option C: Docker + ECS

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]
```

---

## Step 8: Update Mobile App

Update `apiService.js`:

```javascript
const API_URL = 'https://your-backend-url.com'; // Update this!

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

---

## Step 9: Database Migrations (Production)

For production, disable auto-sync and use migrations:

### Update `app.module.ts`:

```typescript
synchronize: false, // NEVER true in production!
```

### Create migrations:

```bash
npm run typeorm migration:generate -- -n InitialSchema
npm run typeorm migration:run
```

---

## Monitoring & Maintenance

### RDS Monitoring:

```bash
# Check DB status
aws rds describe-db-instances \
  --db-instance-identifier huex-db \
  --query 'DBInstances[0].DBInstanceStatus'

# View metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name DatabaseConnections \
  --dimensions Name=DBInstanceIdentifier,Value=huex-db \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Average
```

### Backups:

RDS automatically creates daily backups (retention: 7 days by default).

Manual snapshot:
```bash
aws rds create-db-snapshot \
  --db-instance-identifier huex-db \
  --db-snapshot-identifier huex-backup-$(date +%Y%m%d)
```

---

## Cost Optimization

### Free Tier Eligible:
- **db.t3.micro** instance
- **20 GB** storage
- **20 GB** backup storage
- **750 hours/month** for 12 months

### After Free Tier:
- Estimated cost: **~$15-20/month** for db.t3.micro
- Consider Reserved Instances for 40-60% savings
- Use Aurora Serverless for variable workloads

---

## Rollback Plan

If migration fails, revert to SQLite:

```env
DB_TYPE=sqlite
DB_NAME=database.sqlite
```

Restart backend:
```bash
npm run start:dev
```

---

## Security Best Practices

✅ **DO:**
- Use strong passwords (min 16 characters)
- Enable SSL/TLS connections
- Restrict security group to specific IPs
- Enable encryption at rest
- Regular backups
- Monitor CloudWatch logs

❌ **DON'T:**
- Expose RDS publicly in production
- Use default passwords
- Disable SSL
- Allow `0.0.0.0/0` in security groups (production)
- Store credentials in code

---

## Troubleshooting

### Connection timeout?
- Check security group rules
- Verify RDS is publicly accessible
- Check VPC/subnet configuration

### Authentication failed?
- Verify username/password
- Check DB_USERNAME and DB_PASSWORD in .env

### SSL error?
- Download RDS certificate: https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
- Add to TypeORM config:
  ```typescript
  ssl: {
    ca: fs.readFileSync('./rds-ca-bundle.pem').toString()
  }
  ```

---

## Support

For issues:
1. Check CloudWatch logs
2. Enable TypeORM logging: `logging: true`
3. Test connection with `psql`
4. Review RDS events in console
