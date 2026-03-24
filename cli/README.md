# skillshope

The CLI for [Skill Shope](https://skillshope.com) — install AI skills, MCP servers, and agent configs from the terminal.

## Install

```bash
npx skillshope install <slug>
```

Or install globally:

```bash
npm install -g skillshope
```

## Commands

```
skillshope install <slug>   Install a skill by name
skillshope login            Save your download token for paid skills
skillshope whoami           Show auth status
skillshope list             List installed skills in current project
skillshope help             Show help
```

## Examples

```bash
# Install a free community skill
npx skillshope install pdf-processing

# Install a paid skill (requires purchase + login)
npx skillshope install mcp-forge

# List what's installed
npx skillshope list
```

## How it works

1. Looks up the skill on the [Skill Shope registry](https://skillshope.com)
2. Free skills download immediately
3. Paid skills require a purchase at skillshope.com, then `skillshope login` with your download token
4. Files are installed to `.agents/skills/<name>/` in your project

## For publishers

List your AI skills and earn 85% of every sale:

```bash
# Publish via the web
https://skillshope.com/publish

# Or via API (CI/CD)
curl -X POST https://skillshope.com/api/publish \
  -H "Authorization: Bearer sk_..." \
  -H "Content-Type: application/json" \
  -d @listing.json
```

See the [Publisher Guide](https://skillshope.com/about) and [JSON schema](https://skillshope.com/skill-schema.json).

## Links

- [Browse skills](https://skillshope.com/browse)
- [Publish a skill](https://skillshope.com/publish)
- [Terms](https://skillshope.com/terms) · [Privacy](https://skillshope.com/privacy)

## License

Copyright 2026 Skill Shope. All rights reserved.
