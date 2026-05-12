# Zexus App — Coming Soon template

Drop-in files for the new `zexus-app` repo deployed at `app.zexus.xyz`.

## How to use

1. **Create the new Next.js project** (if you haven't yet):

   ```bash
   cd C:\Users\playg\Desktop\ZXS
   git clone https://github.com/ZexusGovernance/zexus-app.git
   cd zexus-app
   npx create-next-app@latest .
   ```

   When prompted choose: TypeScript Yes, ESLint Yes, Tailwind Yes,
   `src/` directory No, App Router Yes, Turbopack Yes, import alias `@/*`.

2. **Copy these files** from `_zexus-app-template/` into the new repo:

   ```
   _zexus-app-template/app/page.tsx    →  zexus-app/app/page.tsx   (overwrite)
   _zexus-app-template/app/layout.tsx  →  zexus-app/app/layout.tsx (overwrite)
   ```

3. **Copy the favicon** from the main project:

   ```
   zexus-governance/app/icon.png       →  zexus-app/app/icon.png
   zexus-governance/app/apple-icon.png →  zexus-app/app/apple-icon.png
   ```

4. **Install Vercel Analytics** in the new repo:

   ```bash
   cd zexus-app
   npm install @vercel/analytics
   ```

5. **Commit & push:**

   ```bash
   git add .
   git commit -m "Coming Soon page for app.zexus.xyz"
   git push
   ```

6. **Vercel auto-deploys** the new repo to your `zexus-app` Vercel project,
   which is already wired to `app.zexus.xyz`. Within ~1 minute the live page
   appears at https://app.zexus.xyz.

## What the page does

- Big "The Zexus App is Coming." headline with the gradient text
- Live countdown to Q3 2026 (default: July 1, 2026 — change in `app/page.tsx`)
- "Pre-Launch" pulsing pill at the top
- "← Join the Waitlist" button linking back to `zexus.xyz`
- Same dark + gold aesthetic as the main site
- Fade-in stagger on page load
- Animated gold orbs in the background

## Tweaks you may want

- **Launch date** — `LAUNCH_DATE` constant in `app/page.tsx` (line ~7)
- **Headline copy** — same file, around the `<h1>` element
- **Description** — same file, the `<p>` below the headline
- **Hide the page from Google for now** — in `app/layout.tsx`, change
  `robots: { index: true, follow: true }` to `index: false, follow: false`.
  This is useful if you want the subdomain to live without yet being
  discoverable through search. Re-enable indexing closer to launch.

## When real dApp content replaces this

Drop the contents of `app/page.tsx` and replace with your actual app routes.
The rest of the setup (Vercel project, DNS, env vars) stays the same.
