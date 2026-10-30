# Sumthing LAN Party

Five anniversary minigames for **3–10 players**, controlled from phones with a separate host screen. Every minigame starts at zero and has its own winner. There is no aggregate championship.

**[Open the arcade](https://andrehazes020.github.io/sumthing-lanparty/)**

## Play

1. Open the arcade on the shared laptop/TV and choose **Host a party**.
2. Players scan the QR code or open the join link and enter their names.
3. Wait for at least three players. Choose any game from the host menu.
4. Use **Continue / Reveal** for story reveals and phase transitions. **Finish this game** shows its winners. **Return to arcade** ends the current game and opens the selection menu.
5. Keep the host tab open. Reloads reconnect within that tab. A new host tab does not inherit the host's secret. Rooms expire after six hours; expired records are removed when a subsequent room is created.

A one-player practice-room option is available on the landing page. The host must also join from a separate player tab or phone to play in it.

## The five games

- **Sumthing Doesn’t Add Up:** phone answers, timed quiz, story reveals and authoritative scoring.
- **The Usual Sumthings:** private bluff writing, anonymous voting, truth reveals and deception points.
- **Krugerplein Chaos:** shared movement, exclusive item claims, deliveries, cooperative sofa pickup, neighbourhood errands and recoverable moving-day mischief across four chapters.
- **Restore Rush:** tap to plant, hold/release to water, swipe litter, time coral placement and trace flowers. Shared restoration progress and individual scores.
- **Sumthing Sketchy:** private prompts, touch drawing, shared drawing gallery, guesses and host acceptance of close answers.

This first version uses **clearly identified sample content**. Actual character portraits, company stories, office interiors and project-specific restoration art still require the material in [the collection guide](CONTENT_GUIDE.md).

## Customize company content

Open **Your company content** in the host lobby. Download the sample JSON, edit it, then import the file or paste the JSON. Apply it before starting a game. A pack affects that room only and is stored with that room.

- `title`: the edition name.
- `sample`: set `false` after replacing fictional demo content.
- `quiz`: `question`, exactly four `answers`, a zero-based `correct` answer index, and `story`.
- `characters`: `name`, `description`, `prompt`, `truth`, and `story` for each character round.
- `sketch`: short prompt strings. Exact normalized matches score automatically; the host can award a close answer during reveal. Accepted guesses also credit the artist.

Photos, portraits, revised map geometry and ecosystem-specific artwork are supplied separately for a source update. Do not commit private event packs to this public repository; importing a pack in a room does not commit it here. Anyone with the room join link can join while the lobby is open.

## Run and test locally

Node.js 24 is recommended. There are no package dependencies.

```sh
npm test
npm run dev
```

Open `http://127.0.0.1:8000`. The local server uses an in-memory SQLite database by default. To preserve local rooms, set `LANPARTY_DB` to a writable database-file path outside source control. To test multiple players, use separate browser tabs with the same join link. A localhost link is not available to other phones over the internet.

## Hosting

GitHub Pages serves the browser app and the hosted backend maintains shared rooms in Cloudflare D1 through Sites. `settings.js` points at the deployed API. Room and player secrets never appear in join URLs; the backend stores their SHA-256 hashes, authorizes host operations and omits answer keys until reveal. The shared state uses optimistic concurrency with retry and one-second polling; local movement is animated between updates.

The Pages workflow runs the nine rule/API tests before deploying only public browser assets. The source for all game rules and API authorization is in `server/`. `deploy/` contains the deployed Sites route adapter, schema migration and hosting manifest. The Sites deployment uses its maintained Vinext starter and D1 binding `DB`.

## Krugerplein references

The north-up map is traced from **PDOK 2023 aerial imagery**, RD bbox `123030,485080,123300,485330`, with public address coordinates. Building locations and the square's general shape are grounded in that reference. Building extrusion, interiors, character placement and small fixtures are stylised. The gameplay view crops to the playable area. Office doors, caravan placement during Sumthing's years and the laboratory entrance need owner confirmation.

- Former registered office: Krugerplein 36A in Sumthing’s July 2024 terms.
- Café Oost: Krugerplein 40.
- Basnoe: Krugerplein 4-h.
- Caravan: near 32A in a January 2025 event application; not proof of its position in every year.

[Five-year news research and sources](research/krugerplein-2021-2026.md) covers 30 October 2021 through 30 October 2026. Public reporting is distinct from user-supplied office anecdotes and fictional arcade missions. No private individual or business is presented as committing a real offence.

Imagery reference: PDOK / Beeldmateriaal, CC BY 4.0, [PDOK Viewer](https://app.pdok.nl/viewer/). QR encoder: qrcode-generator 2.0.4 by Kazuhiko Arase, MIT; license notice retained in `assets/qrcode.js`.

## Validation and event rehearsal

The tests cover player limits, private answers, scoring, all restoration gestures, bluff authorship, drawings, exclusive deliveries, concurrency, host authorization and CORS. Rehearse all five games with the actual phones and event Wi-Fi before the celebration. This is a playable first edition, not a completed one-hour content pack or a load-tested production event service.
