# How to Convert Markdown to DOCX

## 📄 Your Strategy Documents

All your planning documents are saved in: `C:\Users\JerrelTGilliam\.cursor\WLA_App\`

**Key Files:**
1. ✅ **EXECUTIVE_SUMMARY_COMPLETE.md** - 80+ page consolidated summary
2. ✅ **GRANT_FUNDING_STRATEGY.md** - 60+ page grant proposal framework
3. ✅ **MOBILE_APP_DEPLOYMENT_GUIDE.md** - 50+ page technical guide
4. ✅ **WILDPRAXIS_BUSINESS_PLAN.md** - Full business plan
5. ✅ **BUSINESS_MODEL_SUMMARY.md** - Quick reference
6. ✅ **WLA_PARTNERSHIP_AGREEMENT.md** - Partnership terms

---

## Method 1: Pandoc (Recommended - Professional Results)

### Install Pandoc (One-Time Setup)

**Windows:**
```powershell
# Download from: https://pandoc.org/installing.html
# Or use chocolatey:
choco install pandoc
```

**Mac:**
```bash
brew install pandoc
```

### Convert Single File to DOCX

```powershell
cd C:\Users\JerrelTGilliam\.cursor\WLA_App

# Convert Executive Summary
pandoc EXECUTIVE_SUMMARY_COMPLETE.md -o EXECUTIVE_SUMMARY_COMPLETE.docx

# Convert Grant Strategy
pandoc GRANT_FUNDING_STRATEGY.md -o GRANT_FUNDING_STRATEGY.docx

# Convert Mobile Guide
pandoc MOBILE_APP_DEPLOYMENT_GUIDE.md -o MOBILE_APP_DEPLOYMENT_GUIDE.docx
```

### Convert with Better Formatting

```powershell
# With table of contents and page numbers
pandoc EXECUTIVE_SUMMARY_COMPLETE.md -o EXECUTIVE_SUMMARY_COMPLETE.docx --toc --toc-depth=3 --reference-doc=custom-reference.docx
```

### Convert All at Once

```powershell
# Convert all markdown files
Get-ChildItem *.md | ForEach-Object {
    pandoc $_.Name -o ($_.BaseName + ".docx")
}
```

---

## Method 2: Online Converters (Quick & Easy)

### Recommended Sites:

1. **Vertopal** - https://www.vertopal.com/en/convert/md-to-docx
   - Upload .md file
   - Download .docx
   - Free, no account needed

2. **CloudConvert** - https://cloudconvert.com/md-to-docx
   - Upload .md file
   - Click "Convert"
   - Download .docx
   - Free with limits

3. **Dillinger.io** - https://dillinger.io/
   - Copy/paste markdown
   - Export as "Styled HTML" or use extensions
   - Then save as DOCX from Word

### Steps:
1. Open website
2. Upload or paste your .md file
3. Click "Convert" or "Export"
4. Download the .docx file
5. Open in Microsoft Word
6. Make any final formatting adjustments

---

## Method 3: Microsoft Word (Manual but Customizable)

### Steps:

1. **Open the .md file in a text editor**
   - Notepad, VS Code, or Cursor
   - Select All (Ctrl+A)
   - Copy (Ctrl+C)

2. **Open Microsoft Word**
   - New blank document
   - Paste (Ctrl+V)
   - Word will detect markdown formatting

3. **Apply Styles**
   - Select headings and apply Heading 1, 2, 3
   - Format tables
   - Add page numbers
   - Insert table of contents

4. **Save as DOCX**
   - File → Save As
   - Choose .docx format

---

## Method 4: Google Docs (Cloud-Based)

### Steps:

1. **Upload to Google Drive**
   - Go to drive.google.com
   - Upload your .md file

2. **Open with Google Docs**
   - Right-click file
   - Open with → Google Docs
   - Google will convert automatically

3. **Export as DOCX**
   - File → Download → Microsoft Word (.docx)

---

## Recommended Workflow

### For Grant Applications:

```powershell
# 1. Convert Executive Summary
pandoc EXECUTIVE_SUMMARY_COMPLETE.md -o "WildPraxis Executive Summary.docx" --toc

# 2. Convert Grant Strategy
pandoc GRANT_FUNDING_STRATEGY.md -o "WildPraxis Grant Proposal.docx" --toc

# 3. Convert Business Plan
pandoc WILDPRAXIS_BUSINESS_PLAN.md -o "WildPraxis Business Plan.docx" --toc
```

### For Presentations:

```powershell
# Business Model Summary (shorter, for meetings)
pandoc BUSINESS_MODEL_SUMMARY.md -o "WildPraxis Business Model.docx"

# Partnership Agreement
pandoc WLA_PARTNERSHIP_AGREEMENT.md -o "WLA Partnership Terms.docx"
```

---

## Formatting Tips for Professional Documents

### After Converting to DOCX:

1. **Add Cover Page**
   - Insert → Cover Page
   - Add: Title, Date, Company name, Logo

2. **Table of Contents**
   - References → Table of Contents
   - Choose automatic style

3. **Headers and Footers**
   - Insert → Header → Choose style
   - Add: Company name, document title
   - Insert → Footer → Add page numbers

4. **Adjust Styles**
   - Home → Styles
   - Modify Heading 1, 2, 3 fonts and colors
   - Apply consistent formatting

5. **Add Branding**
   - Insert logo on cover page
   - Use brand colors in headings
   - Add company contact info in footer

6. **Check Layout**
   - Page Layout → Margins → Normal (1" all sides)
   - Page Layout → Size → Letter (8.5" × 11")
   - Review page breaks

---

## Quick Reference Commands

### Convert Single File:
```powershell
pandoc INPUT.md -o OUTPUT.docx
```

### With Table of Contents:
```powershell
pandoc INPUT.md -o OUTPUT.docx --toc
```

### With Custom Styling:
```powershell
pandoc INPUT.md -o OUTPUT.docx --reference-doc=template.docx
```

### Batch Convert All:
```powershell
Get-ChildItem *.md | ForEach-Object {
    pandoc $_.Name -o ($_.BaseName + ".docx")
}
```

---

## Troubleshooting

### Problem: Pandoc not recognized
**Solution**: Add Pandoc to your PATH or use full path:
```powershell
"C:\Program Files\Pandoc\pandoc.exe" INPUT.md -o OUTPUT.docx
```

### Problem: Tables not formatted well
**Solution**: Use `--reference-doc` with a template that has table styles

### Problem: Images not showing
**Solution**: Make sure image paths are relative and images are in correct folder

### Problem: Formatting looks off
**Solution**: Open in Word and use "Clear Formatting" then reapply styles manually

---

## Next Steps

1. **Install Pandoc** (if not already installed)
2. **Run conversion commands** above
3. **Open in Microsoft Word**
4. **Review and format** as needed
5. **Save in your documents folder**

---

**Tip**: Keep the .md files as your "source of truth" and regenerate .docx files whenever you update content. Markdown is easier to edit and version control!

---

*Created: October 12, 2025*  
*For: String Theory Solutions / WildPraxis Documentation*

