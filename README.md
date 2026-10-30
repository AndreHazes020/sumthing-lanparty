# Sumthing LAN Party

A browser game starter for a future company-specific game. The current edition is a three-question solo quiz with placeholder content. It has a player name, answer feedback, scoring, a results screen, replay, and a copy-link button. It works on phones and desktops. There are no dependencies or build step.

## Run locally

From this directory:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. A local link only works on your own device; publish before sharing with others.

## Customize

Edit `config.js` for the title, introduction, points per answer, and questions. Each question has a `prompt`, an `answers` array, a zero-based `correctIndex`, and an `explanation`. Edit `styles.css` for branding and colours. The current game is a starting point; its genre can change when the company brief arrives.

## Publish on GitHub Pages

1. Push these files to the `main` branch of the game repository.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source.
3. Open **Actions → Deploy game to GitHub Pages → Run workflow** (or push a new commit).
4. Use the URL returned by the deployment, usually `https://<owner>.github.io/<repository>/`.

The included workflow checks JavaScript syntax and deploys only the website assets. All asset paths are relative so project subdirectories work.

GitHub Pages availability depends on the account plan and repository visibility. See [GitHub Pages documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).

## Current scope and next decisions

Player names and scores stay in page memory and reset on reload. There are no accounts, shared rooms, shared leaderboard, or server. Sharing the link opens an independent game for each visitor. The demo makes no claim to synchronize players.

For shared multiplayer, we will add a hosted backend for rooms, player presence, authoritative game state, and scores; GitHub Pages can still serve the frontend. The company brief should define game mechanics, audience size, simultaneous versus independent play, branding, content, and access requirements.

All browser code, questions, and answer keys are visible to visitors. Keep confidential content and secrets out of this public starter. Public deployment is not employee access control.
