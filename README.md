# TCP Decision Tree Trainer

Becker-style practice for the TCP section of the CPA exam, built around the Entity Transaction Decision Trees (C corporation, S corporation, partnership or LLC) for Becker TCP T2 M2, T3 M1, T3 M2, T3 M3 and T3 M4.

Static site. No build step, no server, no framework. Open `index.html` or serve the folder.

## What is inside

- **Decision trees**: all 18 flows (three entities, three transactions, owner and entity side), the definitions cards and the side-by-side comparison table, with a recall mode that blurs every result node until you tap it.
- **Practice**: 158 original questions (80 MCQ, 55 numeric write-in, 23 short answer), each mapped to a tree node, a Becker module code, a one-line rule and the trap it is built around. Explanations follow the Becker chain: answer line, sourced arithmetic, ordering rule, remainder, check.
- **Miss log**: one line per miss in the format date, module, question ID, topic, why missed, rule. Trainer misses are logged automatically; Becker misses can be added by hand. Copy as text or download CSV.
- **Study plan**: the final week ranked from the Becker performance pull (`becker.js`), with checkable daily blocks.
- **Cheat sheet**: the six-page PDF embedded, with 2026 corrections for the figures that were 2025 amounts.
- **Claude tutor**: a chat panel that calls the Anthropic Messages API directly from the browser with your own key (default model `claude-sonnet-5-5`). It sees the question you are on, your progress summary and the cheat sheet, and answers in the Becker explanation format.

## Two ways to run the tutor

1. **GitHub Pages or any static host.** Settings, then paste an Anthropic API key. The key is stored only in your browser's localStorage and is sent only to `api.anthropic.com` (with the `anthropic-dangerous-direct-browser-access` header). It is never written to this repository. Progress exports strip the key.
2. **Render (or any Node host).** `server.js` serves the site and relays `/api/chat` to Anthropic with the key held in the `ANTHROPIC_API_KEY` environment variable, so nothing is typed into the browser. Set `APP_PIN` to gate the relay behind a short PIN on a public URL. The page detects the relay through `/api/health` and switches automatically.

## Put it online with Render

1. Push this repository to GitHub.
2. Open **[Deploy to Render](https://render.com/deploy?repo=https://github.com/zachcolpitts/tcp-decision-tree-trainer)** and sign in with GitHub. If Render cannot see the repository, choose **Configure account** and give Render access to `tcp-decision-tree-trainer`. (The same thing by hand: **New > Blueprint**, then pick the repository.) Render reads `render.yaml`.
3. Render asks for two values: `ANTHROPIC_API_KEY` (your key) and `APP_PIN` (any short PIN, or leave it blank for no gate).
4. Press **Apply**. A few minutes later the site is live at the `onrender.com` address Render shows. On the free plan the service sleeps after 15 idle minutes and takes about a minute to wake.

## Files

| File | Purpose |
|---|---|
| `index.html`, `styles.css`, `app.js` | Shell, dark theme, router, dashboard, trees, quiz engine, miss log, plan, settings |
| `chat.js` | Claude tutor panel, streaming, system prompt with 2026 key numbers |
| `trees.js`, `reference.js` | Decision tree flows and reference cards, extracted from the artifact |
| `questions-ccorp.js`, `questions-scorp.js`, `questions-partnership.js`, `questions-mixed.js` | Question bank |
| `plan.js`, `becker.js` | Study plan and the Becker performance data behind the ranking |
| `cheatsheet.js`, `tcp-cheat-sheet.pdf` | Cheat sheet text and PDF |

## Deploy to GitHub Pages

```bash
gh repo create tcp-decision-tree-trainer --public --source=. --push
gh api -X POST repos/{owner}/tcp-decision-tree-trainer/pages -f 'source[branch]=main' -f 'source[path]=/'
```

Or in the GitHub UI: Settings, Pages, Build and deployment, Source: Deploy from a branch, Branch: `main` / root.

## Adding questions

Append objects to any `questions-*.js` file using the schema already in those files (`id`, `module`, `entity`, `tree`, `topic`, `tags`, `type`, `difficulty`, `stem`, `choices`/`answer`/`accept`/`unit`/`tolerance`, `explanation`, `rule`, `trap`). Keep questions original; do not copy Becker content.
