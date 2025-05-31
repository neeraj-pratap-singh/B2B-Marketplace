# 🚀 Complete Setup Guide - B2B Marketplace

**Get the project running in 5 minutes with this step-by-step guide.**

## 📋 Prerequisites

Ensure you have these installed on your system:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB** (Choose one option below)

## 🎯 Quick Setup (Recommended)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd b2b-marketplace-new

# Install dependencies
npm install
```

### Step 2: Database Setup

**Choose Option A (Docker) or Option B (Local MongoDB)**

#### Option A: Docker MongoDB (Easiest)

```bash
# Install Docker Desktop if not already installed
# Then run:
docker-compose up -d mongodb

# Verify it's running
docker ps | grep mongodb
```

#### Option B: Local MongoDB

```bash
# Install MongoDB Community Server from https://www.mongodb.com/try/download/community

# Start MongoDB (choose your OS):

# macOS with Homebrew:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

### Step 3: Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your settings
```

**Required .env.local content:**
```env
# For Docker MongoDB:
MONGODB_URI=mongodb://localhost:27017/b2b-marketplace

# For Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/b2b-marketplace

# Required for Next.js:
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Seed Database

```bash
# Populate with 100 sample listings
npm run seed
```

**Expected output:**
```
🌱 Starting comprehensive database seeding with 100 listings...
✅ Connected to MongoDB
✅ Created 100 listings
🎉 Comprehensive database seeding completed successfully!
```

### Step 5: Start Application

```bash
# Start development server
npm run dev
```

**🎉 Success! Open http://localhost:3000**

---

## 🐳 Docker Complete Setup

For a completely containerized environment:

### Step 1: Docker Compose Setup

```bash
# Clone repository
git clone <your-repo-url>
cd b2b-marketplace-new

# Create environment file for Docker
cp .env.example .env.docker
```

**Edit .env.docker:**
```env
MONGODB_URI=mongodb://mongodb:27017/b2b-marketplace
NEXTAUTH_SECRET=docker-secret-key-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000
```

### Step 2: Build and Run

```bash
# Build and start all services
docker-compose up --build -d

# Check if services are running
docker-compose ps

# Seed the database
docker-compose exec app npm run seed
```

### Step 3: Access Application

- **Application**: http://localhost:3000
- **MongoDB**: localhost:27017

---

## 🔧 Troubleshooting

### Issue: "MONGODB_URI not found"

**Solution:**
```bash
# Ensure .env.local exists
ls -la .env.local

# If missing, create it:
echo 'MONGODB_URI=mongodb://localhost:27017/b2b-marketplace
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
NEXTAUTH_URL=http://localhost:3000' > .env.local
```

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Issue: "Cannot connect to MongoDB"

**Solutions:**

1. **Check if MongoDB is running:**
   ```bash
   # For local MongoDB
   mongosh --eval "db.runCommand({ connectionStatus: 1 })"
   
   # For Docker
   docker ps | grep mongodb
   ```

2. **Restart MongoDB:**
   ```bash
   # Docker
   docker-compose restart mongodb
   
   # Local (macOS)
   brew services restart mongodb-community
   
   # Local (Linux)
   sudo systemctl restart mongod
   ```

### Issue: "Seeding fails"

**Solution:**
```bash
# Clear existing data and try again
mongosh b2b-marketplace --eval "db.dropDatabase()"
npm run seed
```

### Issue: Docker problems

**Solutions:**
```bash
# Restart Docker Desktop
# Then:
docker-compose down
docker-compose up --build -d
```

---

## 📦 Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run seed` | Seed database with 100 listings |
| `npm run lint` | Check code quality |
| `npm run type-check` | TypeScript validation |

---

## 🧪 Verify Setup

After setup, verify everything works:

### 1. Homepage Test
- Visit http://localhost:3000
- Should see professional homepage with hero section

### 2. Search Test
- Click "Search Products" or visit http://localhost:3000/search
- Should see 100 listings loaded
- Test search with "Samsung" or "Nike"

### 3. Filtering Test
- Select "Televisions" category
- Use brand filter (Samsung, LG, Sony)
- Should see filtered results

### 4. API Test
```bash
# Test search API
curl "http://localhost:3000/api/search?q=samsung&category=all"
```

---

## 🌐 Production Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# MONGODB_URI=your-production-mongodb-uri
# NEXTAUTH_SECRET=production-secret-key
```

### Docker Production

```bash
# Build production image
docker build -t b2b-marketplace .

# Run with production environment
docker run -p 3000:3000 \
  -e MONGODB_URI=your-production-uri \
  -e NEXTAUTH_SECRET=production-secret \
  b2b-marketplace
```

---

## 📊 Project Overview

**What you'll get:**
- **100 B2B listings** across 2 categories (TVs & Shoes)
- **Advanced search** with filtering and pagination
- **Professional UI** with responsive design
- **Real-world data** with suppliers, MOQs, and pricing
- **Production-ready** codebase with TypeScript

**Key Features:**
- ✅ Full-text search across products
- ✅ Dynamic category filtering
- ✅ Responsive design (mobile/desktop)
- ✅ Professional B2B marketplace UI
- ✅ MongoDB with optimized indexes
- ✅ Docker containerization
- ✅ TypeScript for type safety

---

## 🆘 Getting Help

If you encounter issues:

1. **Check this guide** - Most common issues are covered
2. **Check terminal output** - Error messages usually indicate the problem
3. **Verify prerequisites** - Ensure Node.js and MongoDB are properly installed
4. **Clear cache** - Try `rm -rf .next node_modules && npm install`
5. **Use Docker** - If local setup fails, try the Docker approach

**Common File Locations:**
- Environment: `.env.local`
- Database connection: `src/lib/mongodb.ts`
- Seed script: `scripts/seed.ts`
- API routes: `src/app/api/`

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB running (local or Docker)
- [ ] `.env.local` configured
- [ ] Database seeded (`npm run seed`)
- [ ] Application running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Search functionality works
- [ ] Filtering works

**🎉 If all items are checked, you're ready to go!** 