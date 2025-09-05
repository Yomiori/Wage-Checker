# 🚀 Quick Reference: Development Workflow

## **Daily Development Process**

### **1. Start Development Session**
```bash
# Open VS Code with your project
code .

# Start Live Server (right-click index.html → "Open with Live Server")
# Or use Command Palette: Ctrl+Shift+P → "Live Server: Open with Live Server"
```

### **2. Make Changes & Test**
- Edit your HTML, CSS, or JavaScript files
- Live Server automatically refreshes browser
- Test at `http://localhost:5500`

### **3. Commit Changes to GitHub**
```bash
# In VS Code Source Control (Ctrl+Shift+G):
# 1. Review changes in diff view
# 2. Stage files (click + next to files)
# 3. Write commit message
# 4. Commit (Ctrl+Enter)
# 5. Sync/Push (click sync button)
```

### **4. Automatic Deployment**
- Netlify automatically deploys when you push to `main` branch
- Check deployment status at netlify.com
- Live site updates in 1-2 minutes

---

## **Essential VS Code Shortcuts**

| Action | Shortcut |
|--------|----------|
| Open Terminal | `Ctrl + `` |
| Source Control | `Ctrl + Shift + G` |
| Command Palette | `Ctrl + Shift + P` |
| Extensions | `Ctrl + Shift + X` |
| File Explorer | `Ctrl + Shift + E` |
| Find in Files | `Ctrl + Shift + F` |

---

## **Git Commands Quick Reference**

```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
```

---

## **Common Commit Message Formats**

```
Add: New salary calculation feature
Fix: Contact form validation bug
Update: Experience level styling
Style: Improve mobile responsiveness
Docs: Update README with new features
Refactor: Optimize data service performance
```

---

## **Troubleshooting Quick Fixes**

### **Live Server Not Working**
- Right-click `index.html` → "Open with Live Server"
- Or Command Palette → "Live Server: Open with Live Server"

### **Can't Push to GitHub**
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### **Netlify Deploy Failed**
- Check Netlify dashboard for error logs
- Verify all files are committed to GitHub
- Check file paths are correct

### **Contact Form Not Working**
- Test on live Netlify site (not localhost)
- Check Netlify Forms dashboard
- Verify form has `data-netlify="true"`

---

## **File Structure Reference**

```
salary-checker/
├── index.html              # Main page
├── contact.html            # Contact form
├── styles.css              # Main styles
├── README.md               # Project docs
├── netlify.toml           # Deploy config
├── .gitignore             # Git exclusions
└── js/
    ├── app.js             # Main logic
    ├── data-service.js    # API integration
    └── [other js files]   # Features
```

---

## **Important URLs**

- **Local Development**: `http://localhost:5500`
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/salary-checker`
- **Live Site**: `https://your-site.netlify.app`
- **Netlify Dashboard**: `https://app.netlify.com`

---

## **Emergency Recovery**

### **Undo Last Commit**
```bash
git reset --soft HEAD~1
```

### **Discard Local Changes**
```bash
git checkout -- filename.html
# Or discard all changes:
git checkout -- .
```

### **Rollback Deployment**
- Go to Netlify dashboard
- Click "Deploys" tab
- Click "..." on previous deploy → "Publish deploy"

---

**Keep this reference handy for quick workflow reminders!** 📌
