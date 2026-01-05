# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended) ⭐

### Step 1: Create Free Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account (no credit card required)

### Step 2: Create a Cluster
1. After signing in, click "Build a Database"
2. Choose the **FREE** tier (M0)
3. Select a cloud provider and region (choose closest to you)
4. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Go to "Database Access" in the left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username and password (save these!)
5. Set privileges to "Atlas admin" or "Read and write to any database"
6. Click "Add User"

### Step 4: Whitelist Your IP
1. Go to "Network Access" in the left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development) or add your current IP
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" in the left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare`)
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with `healthcare` or leave it

### Step 6: Add to .env File
Create `backend/.env` file:
```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=your_secret_key_here
```

---

## Option 2: Local MongoDB Installation

### Windows Installation:
1. Download MongoDB Community Server:
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, MSI package
   - Download and run the installer

2. During installation:
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Check "Run service as Network Service user"
   - Install MongoDB Compass (GUI tool) - optional but helpful

3. Start MongoDB:
   - MongoDB should start automatically as a Windows service
   - To verify, open Command Prompt and run:
     ```bash
     mongod --version
     ```

4. Create .env file:
   ```env
   MONGODB_URI=mongodb://localhost:27017/healthcare
   PORT=3000
   JWT_SECRET=your_secret_key_here
   ```

---

## After Setup:

1. Restart your server:
   ```bash
   cd backend
   npm start
   ```

2. You should see: "MongoDB connected successfully"

3. The database will be created automatically on first use

---

## Troubleshooting:

- **Connection timeout**: Check your MongoDB Atlas IP whitelist
- **Authentication failed**: Verify username/password in connection string
- **Local MongoDB not starting**: Check Windows Services, look for "MongoDB"

