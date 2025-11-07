# Install Node.js on Windows

## Quick Installation Steps

### Step 1: Download Node.js

1. Open your web browser
2. Go to: **https://nodejs.org/**
3. Click the **"LTS"** (Long Term Support) button - should be version 20.x or 18.x
4. The download will start automatically (file: `node-v20.x.x-x64.msi`)

### Step 2: Run the Installer

1. Find the downloaded file (usually in `Downloads` folder)
2. Double-click `node-v20.x.x-x64.msi`
3. Click **"Next"** through the wizard
4. Accept the license agreement
5. Keep default installation location: `C:\Program Files\nodejs\`
6. **IMPORTANT:** Make sure "Add to PATH" is checked ✅
7. Click **"Install"**
8. Wait for installation to complete (1-2 minutes)
9. Click **"Finish"**

### Step 3: Verify Installation

1. **Close and reopen** your terminal/PowerShell (important!)
2. Open a new PowerShell or Command Prompt
3. Type these commands:

```powershell
node --version
# Should show: v20.x.x

npm --version
# Should show: 10.x.x
```

If you see version numbers, **you're ready!** ✅

### Step 4: Install WildPraxis Dependencies

Now that Node.js is installed, come back to Cursor and run:

```bash
npm install @supabase/supabase-js zod
```

Or I can run it for you after you verify Node.js is installed!

---

## Alternative: Using Chocolatey (Advanced Users)

If you have Chocolatey installed:

```powershell
# Run PowerShell as Administrator
choco install nodejs-lts -y

# Restart terminal, then verify
node --version
npm --version
```

---

## Troubleshooting

### "node is not recognized" after installation

**Solution:** You need to restart your terminal!

1. Close ALL PowerShell/Command Prompt windows
2. Close Cursor/VSCode
3. Reopen Cursor
4. Try again

### Still not working?

Check if Node.js is in your PATH:

```powershell
$env:Path -split ';' | Select-String "nodejs"
```

Should show: `C:\Program Files\nodejs\`

If not, add it manually:
1. Press `Win + X`, select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit"
6. Click "New"
7. Add: `C:\Program Files\nodejs\`
8. Click "OK" on all windows
9. Restart terminal

---

## After Installation

Once Node.js is installed and verified:

1. Come back to Cursor
2. Tell me "Node.js is installed"
3. I'll install the WildPraxis dependencies for you!

---

**Installation should take 5-10 minutes total.**

**Then we can continue with Phase 1 implementation!** 🚀

