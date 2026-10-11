# ScamLens

A fraud detection system that analyzes messages and links to identify potential scams. The system provides educational indicators (Low, Medium, High risk) based on demo rules to help users spot warning signs in suspicious communications.

## Overview

ScamLens is designed to help users identify potential fraud by analyzing:
- Text messages
- URLs/links
- Social media messages
- Other digital communications

The analysis runs entirely on-device (client-side) and provides immediate feedback without sending data to external servers.

## Project Structure

```
scamlens/
├── artifacts/
│   └── scamlens/         # Expo/React Native mobile application
├── lib/
│   ├── api-client-react/ # React API client
│   ├── api-zod/          # API schema validation with Zod
│   └── db/               # Database layer (Drizzle ORM)
├── scripts/              # Utility scripts
├── vercel.json           # Vercel deployment config
├── package.json          # Workspace root
└── pnpm-workspace.yaml   # PNPM workspace configuration
```

## Key Features

- **Local Analysis**: All message/link analysis happens on the user's device
- **Educational Focus**: Results are indicators for learning, not definitive security guarantees
- **Cross-platform**: Built with Expo for iOS, Android, and web
- **Privacy-first**: No data leaves the user's device during analysis
- **Demo Rules**: Uses a limited set of visible rules for educational purposes

## How It Works

1. User receives a suspicious message or link from someone else
2. User pastes the content into ScamLens
3. App analyzes the content using local demo rules
4. Results show risk level (Low/Medium/High) with explanations
5. History is saved locally (last 50 checks)

## Analysis Criteria

The demo rules check for:
- Urgency language ("Act now!", "Limited time!")
- Requests for account access or credentials
- Money or gift-card requests
- Suspicious links (shortened URLs, HTTP instead of HTTPS)
- Language discouraging independent verification
- Other common social engineering tactics

## Development

### Prerequisites
- Node.js (with PNPM)
- Expo CLI (for mobile development)

### Setup
```bash
# Install dependencies
pnpm install

# Type check all packages
pnpm run typecheck

# Start the Expo app (from artifacts/scamlens/)
pnpm --filter @workspace/scamlens start
```

### Available Scripts
- `pnpm run typecheck` - Check TypeScript types across all packages
- `pnpm run build` - Build all packages
- Individual package scripts available via `pnpm --filter <package-name>`

## Important Disclaimer

⚠️ **Educational Use Only**: ScamLens provides educational indicators based on a limited set of demo rules. These results are **not**:
- A comprehensive security scan
- A guarantee that something is safe or unsafe
- A substitute for professional security advice
- Real-time threat intelligence

Always verify suspicious requests through trusted channels and never share passwords, OTPs, or sensitive information based solely on a message.

## License

MIT