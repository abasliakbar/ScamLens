# ScamLens

ScamLens is a small cross-platform Expo app for learning to spot warning signs in messages and URLs. Its Low, Medium, and High results come from a short set of visible demo rules. They are educational indicators, not a security scan or a guarantee that anything is safe or unsafe.

## What it does

- Paste a message or URL and review the signals the local demo rules detected.
- Fill the checker with sample account, delivery, and gift-card messages.
- Reopen recent results and clear history saved on this device.
- Keep all analysis on-device; the MVP does not send text to a server.

## Run

Start the Expo workflow from the Replit preview. To check the package types from the workspace, run:

```sh
pnpm --filter @workspace/scamlens run typecheck
```

## Local analysis notes

The analyzer looks for urgency, requests for account access, money or gift-card requests, shortened links, HTTP links, and language discouraging independent verification. Its patterns are intentionally limited and can miss scams or flag legitimate messages. Verify unexpected requests through a trusted contact method, and never share passwords or one-time codes based on a message.

History is stored locally with AsyncStorage and is limited to the 50 most recent checks. Clearing history removes the saved results from this device.
