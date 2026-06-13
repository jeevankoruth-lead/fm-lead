# FM-Lead → Cloudflare Pages Deployment
## Follow These Steps NOW

### 1. Open Cloudflare
👉 **Go to:** https://dash.cloudflare.com/

---

### 2. Navigate to Pages
- Click **"Workers & Pages"** (left sidebar)
- Click **"Create application"**
- Click **"Pages"** tab
- Click **"Connect to Git"**

---

### 3. Select Repository
- Find: **`jeevankoruth-lead/fm-lead`**
- Click **"Begin setup"**

---

### 4. Configure Build Settings

**Project name:** `fm-lead` (or whatever you prefer)

**Production branch:** `main`

**Framework preset:** Hugo (select from dropdown)

**Build command:**
```
hugo --gc --minify
```

**Build output directory:**
```
public
```

---

### 5. Environment Variables
Click **"Add variable"**

**Variable 1:**
- Name: `HUGO_VERSION`
- Value: `0.155.3`

**Variable 2 (IMPORTANT):**
- Name: `HUGO_ENV`
- Value: `production`

---

### 6. Deploy!
Click **"Save and Deploy"**

⏱️ **Wait 2-3 minutes** for build to complete

---

## ✅ Verify Deployment

Once complete, you'll see:
- ✅ Build successful
- ✅ Temporary URL: `https://fm-lead-XXX.pages.dev`
- 🌐 Click the URL to see your site live!

---

## 🔗 Add Custom Domain (After First Deploy)

1. Go to **"Custom domains"** tab
2. Click **"Set up a custom domain"**
3. Enter: `fmlead.com`
4. Click **"Continue"**
5. Follow DNS instructions (auto if domain in Cloudflare)

---

## 🎯 Expected Build Output

Look for these in the build logs:
```
Pages: 45
Static files: 44
Processed images: 39
Total in 600-800 ms
```

If you see errors, check:
- ✅ HUGO_VERSION is exactly `0.155.3`
- ✅ Build command has no typos
- ✅ Output directory is `public` (lowercase)

---

## 🚀 You're Done!

From now on:
1. Make changes locally
2. `git push`
3. Cloudflare auto-deploys
4. Site updates in 2-3 minutes

**Current status:** Ready to deploy! 🎉
