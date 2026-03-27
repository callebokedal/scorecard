# Golf Scorecard app

A react Golf Scorecard Web App - perfect for you mobile phone.

## Goal

A simple to use Golf Scorecard app for 1-4 players. The app let's you manage courses, game details (Scorecards) for each player and view leaderboard for each game - both current and historical.

Except score per hole, the app also let's you track number of putts, tee accuracy (long/short/left/right/hit or miss), penalty shots (water, out of bounds or other), bunkers (near green/fairway) per player and hole.

## App demo


You can test the app here:
https://callebokedal.github.io/scorecard/#/scorecards

It should laso be possible to save this file locally and use that instead.
Remember that the web browsers local storage is used to save all items - to remember to export your data to have a backup.

## App functionality
- It should be possible to manage clubs:
    - Unqiue uid
    - Name
    - Address
    - Optional note
- It should be possible to manage courses per club (one or more):
    - Unqiue uid
    - Number of holes (9, 18, other)
    - Slope for this course
    - Par for each hole
    - Slope index per hole
    - Optional lenght per hole
    - Optional note per hole
- It should be possible to manage players:
    - Unqiue uid
    - Name
    - HCP
    - Default tee
- It should be possible to create and register "scorecards" for tracking scores and details during a round (and show stats and results afterwards)
    - Unqiue uid
    - Let the user select a course to play on (from the club/course register)
        - It should also be possible to select "No course" (meaning that there will be no par or slope info for this scorecard to measure against)
    - Let the user select number of hole (max is max number for elected course, but could also be less, say 9 out of 18 holes)
    - Date of play
    - Name (pre-fill selected course name - if present - but allow user to edit)
    - Number of players (1-4)
- Scoring system: **Stableford**
    - HCP strokes are allocated per hole based on the hole's slope index (standard Swedish method)
    - Playing handicap = player HCP adjusted for course slope rating
    - Stableford points per hole are calculated automatically from strokes played vs. par + HCP strokes on that hole
    - Both strokes played and Stableford points are shown per hole in the scorecard view
- Scores calculated automatically when the users clicks on icons/buttons to add or remove shots/penalties
- Data should be stored using localStorage in the browser (next version might store on server side)
- It should be possible to import/export clubs and individual courses in YAML and JSON format
- It should be possible to import/export players and optionally their scores in YAML and JSON format
- It should be possible to import/export each "scorecard" in YAML and JSON format

## UX Design
- Basically white/gray background but with various green colors for highlighted elements
- Scores and texts in black, gray, blue, green and red color. White text color if background in green.
- Use gradients/shadows to separate some elements, like scrollable elements
- Expect standing mobile phone as default screen even if the app also should work in landscape mode or on desktop.
- The app should have a top menu/nav bar
- Some pages might also have a footer

## Pages
Pages are, except for links in certain situations, accessible via a hamburger menu icon, top right in the top nav. App title in the middle ovh the top nav.
- Clubs (including courses as tabs)
- Players
- List of scorecards
- For selected scorecard:
    - Tab: "Scorecard" - for managing the current round (default tab for ongoing games)
        - **Hole navigator** at the top: prev/next arrows, current hole number, Par, SI (stroke index) and length (if set). An amber warning is shown if scores are missing on earlier holes.
        - **Player accordions** (one per player, green header):
            - Header shows: player name, HCP strokes awarded on this hole (if any), current strokes and Stableford points for the hole, a ✏ quick-entry button
            - Tap the header to expand/collapse the detail form
            - The ✏ button opens a **quick score numpad** (without expanding the accordion): tap 1–9 for the stroke count, `10+` for higher scores (10–25), `Clear` to remove the score, or the ✕ button to mark the hole as skipped
        - **Hole detail form** (expanded accordion body):
            - **Score**: +/− counter with Stableford points shown; ✕ button to skip the hole
            - **Putts**: +/− counter
            - **Tee shot**: circular D-pad navigator (Long / Left / Right / Short / Hit in the middle); club selector button opens a modal to pick the club used (Woods, Hybrids, Irons); Miss button marks a missed tee shot
            - **Bunkers**: separate counters for near-green bunkers, fairway bunkers and other
            - **Penalties**: counters for Water, OOB and Other
        - A **Mark Round as Complete** button appears once all holes are entered; completed rounds can be reopened

    - Tab: "Leaderboard" - showing current stats (default tab for completed games)
        - **Toolbar** (top-right): Net/Gross toggle and orientation toggle
        - **Compact portrait table** (default / portrait mode):
            - Players sorted by Stableford points (descending), then name
            - Columns: Rank, Name (HCP below), Strokes, Points, HCP diff (+/− vs expected 2p/hole as a coloured badge), Thru (holes completed)
        - **Detailed landscape table** (landscape mode):
            - One column per hole played, plus totals
            - Header rows: Par per hole, Slope Index per hole
            - Each player row shows: name + HCP + playing HCP, per-hole strokes with golf scoring notation (see below), Stableford points per hole, HCP strokes as dots (·), total strokes and total points
        - **Orientation toggle**: cycles Auto → Landscape → Portrait; choice is remembered across sessions
        - **Net / Gross toggle**: controls the scoring shapes in the landscape table
            - **Gross** (default): shapes reflect strokes vs par (standard golf notation)
            - **Net**: shapes reflect strokes vs par adjusted for HCP strokes — a bogey on a hole where you receive an extra stroke shows as par; friendlier view for higher-HCP players
        - **Golf scoring notation** (landscape table):
            - Double circle (green filled) = Eagle or better (−2 or less)
            - Single circle (green filled) = Birdie (−1)
            - Plain number = Par (0)
            - Single square = Bogey (+1)
            - Double square = Double bogey (+2)
            - Filled double square = Triple bogey or worse (+3 or more)
- Statistics per Player
- Statistics per scorecard
- Settings
    - Theme: Dark/light mode
    - Language: English (default) / Swedish

## Technical stack
- Based on container managed by podman on MacOS
- React 18 with plain JavaScript
- Vite as build tool
- Tailwind CSS for styling
- React Query for server state (when/if needed)
- Zustand for client state (when/if needed)
- react-i18next - since at least English/Swedish are to be supported for texts and labels

## Production build

Builds a fully self-contained single HTML file with all JS and CSS inlined — open directly in a browser or share without a server.

```sh
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm run build"
# Output: docs/index.html
```

---

## Development build instructions
```sh

# To install dependencies but without using npm on the host machine (by design)
# New dependencies can also be installed this way, after updating package.json
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm install"
#podman run -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm install"

# Security Audit can be executed using
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm audit"
# -> Should return with "found 0 vulnerabilities", or else -> evaulate and try to fix

# To run the application (development environment):
podman run --rm -p 5177:5177 -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm run dev -- --host 0.0.0.0"

# ---- Not "fully" verified commands below

# To update?
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine \
  sh -c "npm install -g npm-check-updates && ncu -u && npm install"

podman run --rm -v $(pwd):/app:z -w /app node:22-alpine sh -c "npm update"

# First time
# Create project with Vite
podman run --rm -v $(pwd):/app:z -w /app node:22-alpine \
  sh -c "npm create vite@latest . -- --template react && npm install"

# Build image and start (not tested yet)
podman-compose up --build

# Or, without compose (tested ok)
podman build -t scorcard-dev .
podman run -p 5177:5177 -v ./src:/app/src:z scorcard-dev
```