# INSIGHT JNVST Coaching Centre — Website

A complete, ready-to-deploy website for INSIGHT JNVST Coaching Centre, Hailakandi, Assam.

## What's inside

```
index.html                 → the whole website (all sections)
style.css                  → all design/styling
script.js                  → all interactivity (menu, dark mode, quiz, forms, gallery...)
manifest.json              → lets phones "Add to Home Screen"
robots.txt, sitemap.xml    → SEO basics for Google
404.html                   → shown if a page/link doesn't exist
privacy-policy.html
terms-and-conditions.html
disclaimer.html
assets/images/             → logo, founder photo, campus photos, icons
assets/brochure.pdf        → your uploaded brochure, linked from "Download Brochure"
```

Everything is plain HTML/CSS/JavaScript — no build step, no npm, no server required. This means you can edit it directly in **Acode** and it will just work.

## 1. Deploy to GitHub Pages (free)

1. On github.com, create a new **public** repository, e.g. `insight-jnvst`.
2. Upload every file and folder from this project into that repository, **keeping the folder structure** (the `assets` folder must stay a folder, not be flattened).
   - Easiest on mobile: use the GitHub app or github.com's "Add file → Upload files" in your browser, and drag the whole folder in.
3. In the repository, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`. Save.
5. Wait 1–2 minutes. Your site will be live at:
   `https://YOUR-GITHUB-USERNAME.github.io/insight-jnvst/`

## 2. Update these placeholder links (one-time, 4 files)

Search for the text `your-username` and replace it with your real GitHub username + repo name, in:
- `index.html` (2 places: `canonical` link and `og:url`)
- `robots.txt` (1 place)
- `sitemap.xml` (4 places)

In Acode, use **Find & Replace** (usually a search icon in the editor) to do this quickly across each file.

## 3. Things you'll likely want to update yourself

- **Testimonials** (`index.html`, search for `id="testimonials"`): currently clearly labelled placeholders, as requested. Replace the placeholder text with real parent/student feedback once you have it — don't invent names or quotes.
- **Fees / batch timing**: not shown on the site yet since these weren't finalised. Add them to the Course or Admission section whenever you're ready — ask me and I can do this for you.
- **Social media icons**: not added yet since no links were given (a broken/empty icon looks worse than no icon). Send me your Facebook/Instagram/YouTube links any time and I'll add them to the footer.

## 4. How a few features work (so nothing feels like a "black box")

- **Dark mode** — toggled by the moon/sun icon in the navbar, remembered on the visitor's device.
- **Free Practice Quiz** — original questions written in the JNVST pattern (not real exam papers, for copyright reasons), scored instantly in the browser. No account, no server.
- **FAQ search ("Ask INSIGHT")** — a free, no-cost search box that filters the FAQ list by keyword. It is not a paid AI chatbot — this was the option chosen to keep the site fully free to run.
- **Admission form** — validates the fields, then opens WhatsApp with all details pre-filled, sent to +91 76380 53535. Nothing is stored anywhere else.
- **Map** — embedded with a keyless Google Maps link (no API key needed, no billing risk).

## 5. Deliberately left out for now

Full offline mode (a "service worker") was left out on purpose — it's the single most common source of "my site won't update / shows old content" bugs for a first GitHub Pages project, and this site doesn't strictly need to work offline. The site is still installable to a phone's home screen via `manifest.json`. If you want true offline support later, just ask.

## 6. If something looks broken after you edit

The site is one connected system — the safest changes are:
- Editing **text** inside existing tags (safe).
- Replacing an image file in `assets/images/` **with the same filename** (safe).

Riskier changes — deleting a whole `<section>`, removing a closing `</div>`, or renaming an image file without updating `index.html` — can break the layout. If you're not sure, copy the section you're about to edit somewhere safe first, or just send me the change you want and I'll do it directly.
