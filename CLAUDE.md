# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Сойдёт" (slug: horosho) — a Russian-language mobile app for learning and practicing DBT (dialectical behavior therapy) skills: theory articles, a dictionary, a diary card, and support tools. Expo / React Native with expo-router, plain JavaScript (.jsx/.js, no TypeScript). All UI text, data content, and the CHANGELOG are in Russian.

## Commands

- `npm start` — start the Expo dev server (`npm run ios` / `npm run android` / `npm run web` for a specific platform)
- Development runs on a dev client (`expo-dev-client`), not Expo Go. `npm run ios:device` builds it locally with Xcode and installs it on a connected iPhone. `APP_VARIANT=development` (set by that script and by the EAS `development` profile) makes `app.config.js` switch to the name "Сойдёт (dev)" and the bundle id `app.mitenka.sojdet.dev`, so the dev build installs alongside the App Store app instead of replacing it. Rebuild after native changes (new native deps, config plugins, `app.json` native fields). `ios/` and `android/` are generated and gitignored.
- `npm run lint` — ESLint via `expo lint`
- There is no test suite.
- `npm run reset-project` is left over from the Expo template and won't work (`scripts/` doesn't exist).
- Release builds use EAS: profiles `development`, `preview`, `production`, `production-apk` in `eas.json`. App version lives in both `package.json` and `app.json` (`expo.version`) — bump both together.

## Architecture

### Content pipeline (the key non-obvious part)

App content (theory articles, dictionary) is JSON in `data/` (`theory.json`, `dictionary.json`) with versions in `data/meta.json`. It flows like this:

1. Bundled JSON is seeded into AsyncStorage on first launch (`services/dataService.js` → `initializeData`).
2. The app reads content only from AsyncStorage (`services/contentService.js`), never directly from the bundled files at render time.
3. `services/updateService.js` checks `https://raw.githubusercontent.com/mitenka/horosho/main/data/meta.json` and downloads updated JSON over the air when server versions exceed local ones.

Consequence: **any edit to `data/theory.json` or `data/dictionary.json` must be accompanied by incrementing the corresponding version in `data/meta.json`** — otherwise already-installed apps (and even local dev sessions with populated AsyncStorage) will never pick up the change. Pushing to `main` publishes content updates to all users.

### Articles are JSON block trees

Theory articles are arrays of typed blocks (`heading`, `paragraph`, `list`, `quote`, `note`, `checklist`, and interactive widgets `cards`, `quiz`, `scenario`, `boxBreathing`). `README.md` is the reference for these block schemas. Rendering is dispatched by `components/article/ArticleElement.jsx` to one component per type in `components/article/`. To add a new block type: create the component, register it in `ArticleElement.jsx`, document the schema in `README.md`.

### State management

A single `DataProvider` (`contexts/DataContext.js`, mounted in `app/_layout.jsx`) exposes everything through the `useData()` hook. The other files in `contexts/` (`contentContext`, `diaryContext`, `behaviorsContext`, `readingProgressContext`, `updateContext`) are **plain custom hooks, not React contexts** despite their names — `DataProvider` calls them and spreads their values into one context value.

All persistence is AsyncStorage under `@horosho/`-prefixed keys defined centrally in `services/storageConfig.js`; `services/dataService.js` is the aggregation point that re-exports the per-domain services (diary, settings, reading progress, content, updates).

New settings need their default added in two places: `initializeSettings` in `services/settingsService.js` (persisted defaults, merged into existing settings) and the initial `useState` in `DataProvider` (pre-load value).

### Diary reminders

Local notifications only (no push; `promptToConfigurePushNotifications: false` in `eas.json`). `services/reminderService.js` → `rescheduleDiaryReminders()` is idempotent: it cancels every notification with the `diary-reminder-` id prefix, then schedules one per day for the next 14 days (iOS caps pending local notifications at 64). It skips today if the time has already passed or today's diary is marked complete. It runs on app start and on return to the foreground (`DataProvider`), when today's completion is toggled (`DiaryCompletionToggle`), and when reminder settings change. Any new code that changes the reminder settings or today's completion status should call it too. Permissions are requested only from an explicit user action (`ensureNotificationPermissions`).

### Routing and features

File-based routes via expo-router: `app/(tabs)/` holds the five tabs (index = diary card, theory, dictionary, support, settings); `app/block/[id].jsx` and `app/article/[id].jsx` are the theory drill-down screens. Feature components are grouped by tab: `components/practice/` (diary card), `components/theory/`, `components/article/`, `components/support/`.

### Conventions

- Dark theme with hardcoded colors; the base background `#2d2d4a` appears in `app/_layout.jsx`, `app.json`, and screen styles.
- The `useFeminineVerbs` setting toggles gendered Russian verb forms in UI text — keep both forms in mind when writing user-facing strings.
- `CHANGELOG.md` is maintained in Russian, Keep a Changelog format.

## SDK version note

The project is intentionally on **Expo SDK 54**. A full migration to SDK 56 (native tabs, expo-router's react-navigation fork, app.json schema cleanup) was completed and verified on 2026-07-17 but deliberately rolled back; it is preserved in the git stash entry "SDK 56 migration + native tabs experiment (rolled back 2026-07-17)". Key gotchas for a future upgrade: the `@react-navigation/*` imports need the `sdk-56-expo-router-react-navigation-replace` codemod, `NativeTabs` named exports (`Icon`, `Label`, `VectorIcon`) became `NativeTabs.Trigger.*` members, and `newArchEnabled`/`privacy`/`privacyPolicyUrl`/`edgeToEdgeEnabled` must be removed from app.json.
