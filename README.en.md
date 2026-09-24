# AI Restart

**Siri AI on a Mac whose system language it doesn't support — in one click.**

[Русская версия](README.md)

The new Siri with Apple Intelligence only turns on if the Mac **booted** with English as the system language. Switch your language back afterwards and Siri AI keeps working until the next restart. AI Restart does all of that for you: one button in the menu bar, and after the restart you have Siri AI with the system already back in your language.

- It doesn't hack anything and doesn't touch system files: it only changes the language in your own settings and restarts the Mac the normal way.
- No network access, no data collection. The code is open — check it yourself.
- No administrator rights needed.
- Zero background cost: no CPU, no wakeups.

> Not affiliated with Apple. Apple can close this path in any macOS update — Siri AI would then simply stop turning on.

## Requirements

- An Apple Silicon Mac (M1 or later).
- macOS 27.0
- Siri language: **English (United States)** — System Settings → Apple Intelligence & Siri.

## Installation

1. Download `AI-Restart.dmg` from [Releases](../../releases/latest).
2. Open the image and drag **AI Restart** to Applications.
3. On the first launch macOS says it cannot verify the developer. Open **System Settings → Privacy & Security** and click **Open Anyway** at the bottom.
4. Done. The AI Restart icon appears on the right of the menu bar. The app adds itself to login items.

To make sure the image wasn't tampered with, compare its checksum with the one in the release notes:

```bash
shasum -a 256 ~/Downloads/AI-Restart.dmg
```

## How to use it

Menu bar icon → **Restart…**:

1. The app quits your apps gracefully, switches the system to English and restarts the Mac.
2. For 20–60 seconds after login everything is in English: the system is bringing Siri AI up.
3. Then your language comes back by itself and your apps reopen — already in it. You get an "Enhanced Siri is ready" notification.

Restart and shut down the Mac **only through AI Restart**: after a regular restart from the Apple menu Siri AI stays the old one until next time. For shutting down there's **Shut Down…** — Siri AI comes up the same way on the next boot.

If some app refuses to quit (it's waiting for you to save a document, say), the restart is cancelled with a message.

### If you've never had Siri AI

Apple Intelligence only puts you on the waitlist while the system is in English. The menu has **First Setup**, which walks you through it and opens the right settings.

### ChatGPT in Siri

You can only sign in to ChatGPT while the system is in English — in other languages macOS considers it unavailable. Until it's connected the menu has **Connect ChatGPT…**: the restart stops in English and opens the settings, you sign in and press Done. Back in your language the settings will show "Sign In…" and "ChatGPT unavailable" again — that's not true, it works. Don't press "Sign In…" in your own language.

## Battery percentage next to the battery

A bonus for anyone annoyed by the percentage drawn **inside** the battery in macOS 27. **Settings → Battery Percentage in Menu Bar** — and the number is back next to the battery, the way it used to be:

- the icon is built from the system's own assets and matches it pixel for pixel: the charging bolt, red on a low battery, yellow in Low Power Mode;
- two looks to choose from: like macOS 27 (filled) and like macOS 26 (thin outline);
- click it for time remaining, battery capacity, cycle count and the apps using the most energy.
- your own low-battery threshold (5, 10, 15 or 20 %) with a notification;
- you can make the percentage open the AI Restart menu, so there's only one icon in the menu bar.

The system battery disappears while this is on and comes back when you turn the feature off or uninstall the app.

## Languages

The app works with **any** system language: before restarting it remembers your language and later restores exactly that.

The language list matters in one case only: if you install the app while the system is **already** in English — then it asks which language to return to. The list covers languages Apple Intelligence does not support: Russian, Ukrainian, Belarusian, Kazakh, Uzbek, Azerbaijani, Armenian, Georgian, Catalan, Czech, Greek, Finnish, Hebrew, Croatian, Hungarian, Indonesian, Malay, Polish, Romanian, Slovak, Thai.

If Apple Intelligence already supports your language, you probably don't need this app.

**The app's interface** is Russian if the system is Russian, and English in every other case. The language comes from the saved return language.

## FAQ

**Is this a hack?** No. It doesn't patch the system or touch its files. It does what you would do by hand: changes the language in Language & Region, restarts the Mac and changes it back.

**Why a restart?** macOS decides whether to turn Siri AI on only at boot. There is no way to do it without a restart.

**What does it do in the background?** Nothing. The battery percentage redraws on system events (the charge changed, the charger was plugged in); everything else is computed only when you open the menu.

**How do I uninstall it?** Menu bar icon → Settings → Uninstall AI Restart. Your language is restored, the login item is removed, settings and logs are erased. Then drag the app to the Trash.

**Something went wrong.** Still in English more than five minutes after login — icon → **Restore Language…**. Siri AI didn't turn on — restart through the app once more. Logs are in `~/Library/Application Support/AIRestart/` (`login.log`, `errors.log`) — attach them to an [issue](../../issues/new/choose). The log lines are in Russian; attach them as they are.

The full manual opens from the menu: **Instructions**.

## Building from source

All you need is macOS: it's built with the bundled `osacompile` and `hdiutil`, no Xcode, no dependencies.

```bash
./build.command
```

The image lands in `dist/AI-Restart.dmg`. To get the styled image window (background, icon layout), allow Terminal to control Finder: System Settings → Privacy & Security → Automation. Without it the image still builds, just unstyled.

### What lives where

```
src/
  app.js              the app: menu bar, menus, actions
  login.js            started by the login agent: restores the language
  lib/
    core.js           processes, files, locking, notifications
    prefs.js          system language: reading, writing, choosing the return language
    apps.js           which apps to quit and open again
    readiness.js      waiting for Siri AI to be ready after login
    flow.js           restart and login: the whole sequence of steps
    setup.js          self-install, login agent, uninstall, first setup
    dialogs.js        the app's windows
    glyph.js          the menu bar icon
    battery.js        battery percentage and the battery icon
    i18n.js           every interface string: Russian and English
  dmg-background.js   draws the DMG window background
  Инструкция.txt      the manual from the menu, in Russian
  Guide.txt           the same in English
tools/make-icon.js    draws the app icon
build.command         builds the app and the DMG
```

The app is written in JavaScript for Automation (JXA) — plain JavaScript with Cocoa access that macOS runs natively — so the `.app` contains the same readable files as `src/` (only `app.js` is compiled into `Scripts/main.scpt`). Code comments, log lines and the development history are in Russian.

## License

[MIT](LICENSE).

Siri, Apple Intelligence and macOS are trademarks of Apple Inc. This project is not affiliated with Apple.
