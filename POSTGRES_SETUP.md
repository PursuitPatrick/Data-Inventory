# PostgreSQL Database Setup Guide

## 🚨 Current Status
The automatic database creation failed due to password authentication. You need to manually create the database.

## 🔑 Step 1: Find Your PostgreSQL Password
During PostgreSQL installation, you set a password for the `postgres` user. You need this password.

**Common passwords to try:**
- `postgres`
- `admin`
- `password`
- `123456`
- The password you specifically set during installation

## 🗄️ Step 2: Create Database Manually

### Option A: Using psql Command Line
1. Open a new PowerShell window
2. Navigate to PostgreSQL bin directory:
   ```powershell
   cd "C:\Program Files\PostgreSQL\17\bin"
   ```
3. Connect to PostgreSQL:
   ```powershell
   .\psql.exe -U postgres
   ```
4. Enter your password when prompted
5. Create the database:
   ```sql
   CREATE DATABASE inventory_db;
   ```
6. Verify it was created:
   ```sql
   \l
   ```
7. Exit psql:
   ```sql
   \q
   ```

### Option B: Using pgAdmin (GUI)
1. Open pgAdmin from Start Menu
2. Connect to your PostgreSQL server
3. Right-click on "Databases"
4. Select "Create" → "Database"
5. Enter "inventory_db" as the name
6. Click "Save"

## ✅ Step 3: Verify Database Creation
After creating the database, you can verify it exists by:
```powershell
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "\l"
```

## 🔧 Step 4: Update Backend Configuration
Once the database is created, you'll need to:
1. Install PostgreSQL client for Node.js: `npm install pg`
2. Update your backend to connect to the database
3. Create tables for your inventory system

## 🆘 Need Help?
If you can't remember your password:
1. Check if you wrote it down during installation
2. Try common passwords listed above
3. You may need to reset the postgres user password
4. Or reinstall PostgreSQL with a new password

## 📝 Next Steps
After creating the database, let me know and I'll help you:
- Set up the database connection in your Express backend
- Create the necessary tables for your inventory system
- Integrate it with your React frontend 