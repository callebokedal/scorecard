# Golf Scorecard app

A react Golf Scorecard Web App - perfect for you mobile phone.

## Goal

A simple to use Golf Scorecard app for 1-4 players. The app let's you manage courses, game details (Scorecards) for each player and view leaderboard for each game - both current and historical.

Except score per hole, the app also let's you track number of putts, tee accuracy (long/short/left/right/hit or miss), penalty shots (water, out of bounds or other), bunkers (near green/fairway) per player and hole.

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
        - I think I want this area to look like this:
            - Top Nav: back arrow - Name of course + date - menu to the right
            - Main area:
                - Prev hole arrow - "Hole <num> - <par> <slope> - Next hole arrow
                - Accordion for each player: <Player name> - HCP - current total strokes - current total points
                - Accordion body (details for this hole):
                    - "Score" (+) <strokes> (-) and calculated Stableford points for this hole [<- Note: elements in vertical order]
                    - "Putts" (+) <score> (-) [<- Note: elements in vertical order]
                    - "Tee shot" (left/long/short/right/hit) [Rounded 5-way navigator with "Hit" in the middle]
                        - Also a round "miss" at the bottom/side of this 5-way navigator
                    - "Bunkers" (near green) (on fairway) [<- Title at top, icon buttons below]
                    - "Penalties" (water) (out of bounds) (other) [<- Title at top, icon buttons below]

    - Tab: "Leaderboard" - showing current stats (default tab for completed games)
        - Quite compact info list if in vertical mode
            - Table of players sorted by score, then name
            - Each row should contain
                - Idx, Name (HCP on row below), Score, Points, Thru (at what hole)
        - Detailed info table in landscape mode
            - Detailed statitics for all holes and players
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