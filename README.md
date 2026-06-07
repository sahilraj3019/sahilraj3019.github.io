# Sahil Raj - Professional Recruiter-Focused Portfolio Website

A clean, responsive, and minimalist developer portfolio built using vanilla **HTML5**, **CSS3**, and **JavaScript (ES6+)**. This site has been engineered with a design system inspired by Vercel, Linear, and GitHub to load extremely fast, look professional, and present metrics that immediately appeal to recruiters.

## Project Structure

```
sahilraj15/
├── assets/
│   ├── images/
│   │   └── profile.jpg          # Profile photo
│   └── docs/
│       └── sahil_raj_resume.pdf # Recruiter-ready PDF Resume
├── index.html                   # Core semantic markup
├── styles.css                   # Custom stylesheets (dark theme first, responsive, print)
├── script.js                   # Interactive filters, toggles, form validators
├── sitemap.xml                  # Search engine mapping
├── robots.txt                   # Search crawler directives
├── GITHUB_README.md             # Markdown content for GitHub Profile README
└── README.md                    # Setup and deployment guide (this file)
```

---

## Local Development

Since this site is built purely with vanilla languages, you do not need to compile or build packages. You can open `index.html` directly in your browser. However, to test functions like theme cookies, sitemap paths, or image fetches fully, run a simple local server:

### Option A: Python HTTP Server (Pre-installed)
Open your terminal in this directory and run:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your web browser.

### Option B: Node.js Static Server
If you have Node.js installed:
```bash
npx -y serve
```
Then visit the local URL shown in your terminal.

---

## Hosting and Deployment Instructions

### 1. Creating a GitHub Repository
1. Log in to your GitHub account at [GitHub.com](https://github.com).
2. Click the **`+`** icon in the top-right corner of the header and select **New repository**.
3. Set the following options:
   - **Repository name**: `sahilraj3019.github.io` (Note: Using this exact format creates a user site that maps to your root URL, i.e., `https://sahilraj3019.github.io/`).
   - **Public/Private**: Select **Public** (required to host on GitHub Pages for free).
   - **Initialize this repository with**: Leave all unselected (do not add a README, `.gitignore`, or license here, as they are already in this workspace).
4. Click **Create repository**.

---

### 2. Uploading Files to GitHub
Open your command line/terminal in this workspace directory and execute the following commands to initialize Git and upload the code:

1. **Initialize Git repository**:
   ```bash
   git init
   ```
2. **Stage all files**:
   ```bash
   git add .
   ```
3. **Commit your files**:
   ```bash
   git commit -m "Initial commit: recruiter-focused portfolio site"
   ```
4. **Rename primary branch to `main`**:
   ```bash
   git branch -M main
   ```
5. **Link to your remote GitHub repository** (replace with your repository url if different):
   ```bash
   git remote add origin https://github.com/sahilraj3019/sahilraj3019.github.io.git
   ```
6. **Push files to GitHub**:
   ```bash
   git push -u origin main
   ```

---

### 3. Enabling GitHub Pages
If your repository is named exactly `sahilraj3019.github.io`, GitHub Pages may activate automatically. If it does not, or if you named the repository differently:

1. Go to your repository on GitHub.
2. Click on the **Settings** tab (gear icon at the top of the repository page).
3. Scroll down the left sidebar menu and click on **Pages** (under the "Code and automation" section).
4. Under **Build and deployment**:
   - **Source**: Select **Deploy from a branch**.
   - **Branch**: Set to **`main`** and select **`/ (root)`** as the folder.
5. Click **Save**.
6. Wait 1–2 minutes. A banner will appear at the top of the Pages section showing your live site URL (e.g., `https://sahilraj3019.github.io/`).

---

### 4. Connecting a Custom Domain
To connect your own domain (e.g., `www.sahilraj.com` or `portfolio.sahilraj.dev`) to GitHub Pages:

1. **Set Custom Domain in GitHub**:
   - Go to your repository settings page on GitHub, click **Pages** on the left.
   - Under **Custom domain**, type your domain name (e.g., `sahilraj.dev` or `www.sahilraj.dev`) and click **Save**.
   - This automatically creates a file named `CNAME` in your GitHub repository root.

2. **Configure DNS Records** with your Domain Registrar (Namecheap, GoDaddy, Cloudflare, etc.):
   - If using a subdomain like `www.sahilraj.dev`, add a **CNAME** record:
     - **Type**: `CNAME`
     - **Name/Host**: `www`
     - **Value/Target**: `sahilraj3019.github.io.` (make sure to include the trailing period).
   - If using an apex/root domain like `sahilraj.dev`, configure **A** records pointing to GitHub's IP addresses:
     - **Type**: `A` | **Host**: `@` | **Value**: `185.199.108.153`
     - **Type**: `A` | **Host**: `@` | **Value**: `185.199.109.153`
     - **Type**: `A` | **Host**: `@` | **Value**: `185.199.110.153`
     - **Type**: `A` | **Host**: `@` | **Value**: `185.199.111.153`

3. **Enable HTTPS**:
   - Once DNS propagates (takes 5 minutes to a few hours), return to the GitHub Pages Settings page.
   - Check the **Enforce HTTPS** box to ensure secure SSL connectivity.

---

### 5. Modifying and Updating the Portfolio in the Future
To add a new project, edit experiences, or update your skills list:

1. **Open the local workspace code** in your code editor (e.g., VS Code).
2. **To edit text/experience details**: Open `index.html` and edit the contents inside the respective `<section>` element tags (e.g., `<section id="experience">`).
3. **To add a project**: Create a new `<div class="project-card" data-tags="...">` block inside the `<div id="projects-grid">` node in `index.html`. Add suitable tags (`ai`, `frontend`, `fullstack`) so the navigation filter finds it.
4. **To replace your resume**: Save your new resume PDF with the file name `sahil_raj_resume.pdf` inside `assets/docs/` (overwriting the old one).
5. **To deploy updates live**: Run these commands in your terminal:
   ```bash
   git add .
   git commit -m "Update portfolio: added new project and updated resume"
   git push origin main
   ```
   GitHub Actions will detect the push and automatically deploy the updates in a minute.
