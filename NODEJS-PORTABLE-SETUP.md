# Node.js Portable Setup (No Installation Required)

## Perfect for Locked-Down Systems!

This guide helps you use Node.js **without installation or admin rights**.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Download Portable Node.js

1. Go to: **https://nodejs.org/en/download**
2. Scroll down to "Additional Platforms"
3. Click **"Windows Binary (.zip)"** for **64-bit**
   - Should be something like: `node-v20.11.0-win-x64.zip`
   - **NOT** the .msi installer!

**Direct link (Node.js 20 LTS):**
```
https://nodejs.org/dist/v20.11.0/node-v20.11.0-win-x64.zip
```

### Step 2: Extract to Your Project

1. Download the .zip file (about 30MB)
2. Extract it to your WLA_App folder:
   ```
   C:\Users\JerrelTGilliam\.cursor\WLA_App\node-portable\
   ```

You should have this structure:
```
WLA_App/
├── node-portable/
│   ├── node.exe          ← The portable Node.js
│   ├── npm               ← npm folder
│   ├── npm.cmd           ← npm command
│   └── ...other files
├── app/
├── lib/
├── package.json
└── ...
```

### Step 3: Test Portable Node.js

Open PowerShell in your WLA_App folder and run:

```powershell
.\node-portable\node.exe --version
```

Should show: `v20.11.0` (or similar) ✅

```powershell
.\node-portable\npm.cmd --version
```

Should show: `10.x.x` (or similar) ✅

### Step 4: Install Dependencies

Now install the Supabase package:

```powershell
.\node-portable\npm.cmd install @supabase/supabase-js
```

That's it! 🎉

---

## 🔧 Alternative: Let Me Create a Script for You

I can create a PowerShell script that handles everything automatically!

---

## 📝 Usage

### Running npm commands

Instead of `npm install`, use:
```powershell
.\node-portable\npm.cmd install
```

Instead of `npm run dev`, use:
```powershell
.\node-portable\npm.cmd run dev
```

### Running node commands

Instead of `node script.js`, use:
```powershell
.\node-portable\node.exe script.js
```

---

## 💡 Pro Tip: Create Aliases

To make it easier, create aliases in your PowerShell profile:

```powershell
# Add these to your PowerShell profile
Set-Alias node "$PSScriptRoot\node-portable\node.exe"
Set-Alias npm "$PSScriptRoot\node-portable\npm.cmd"
```

Or just create simple wrapper scripts (see next section).

---

## 📦 What Gets Installed

When you run `npm install`, it will:
1. Read `package.json`
2. Download `@supabase/supabase-js` package
3. Create/update `node_modules/` folder
4. Create `package-lock.json`

All in your WLA_App folder - **no system changes!**

---

## ✅ Advantages

- ✅ No admin rights needed
- ✅ No installation required
- ✅ No system changes
- ✅ Can delete anytime (just remove the folder)
- ✅ Portable (can copy to USB drive)
- ✅ Microsoft security won't block it

---

## 🗑️ To Uninstall

Just delete the `node-portable` folder. That's it!

---

## 🐛 Troubleshooting

### "Execution policy" error

If you get a PowerShell execution policy error:

```powershell
# Run this first
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Then try your npm command again.

### Still blocked by security?

Try this alternative location:
```
C:\Users\JerrelTGilliam\Documents\node-portable\
```

Or even your Downloads folder temporarily.

---

## 🎯 Next Steps After Setup

Once you have portable Node.js working:

1. ✅ Run `.\node-portable\npm.cmd install` (installs Supabase)
2. 📖 Follow `SUPABASE_SETUP_GUIDE.md` to set up database
3. 🔧 Start updating API routes (see `TODO-PHASE1.md`)

---

**This is the perfect solution for locked-down corporate environments!** 🚀

