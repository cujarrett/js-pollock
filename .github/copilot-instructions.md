## Philosophy: Grug-Brained Development

## Copilot Rules
- **Never run `git commit`, `git push`, or any git command that writes to or modifies repository history or remotes.** If a task requires committing or pushing, stop and tell the user to run the git command manually.

### Pre-commit safety check

Whenever files are ready to be committed (after a set of changes is complete, or when the user asks), automatically perform this check on every changed file **before** telling the user to commit. Report the results inline — do not wait to be asked.

Check for:
1. **Hardcoded secrets** — passwords, API keys, tokens, private keys, connection strings with credentials
2. **Sensitive identifiers** — AWS account IDs, Cloudflare account/tunnel IDs, internal IPs beyond those documented in `copilot-instructions.md`, UUIDs that are runtime secrets
3. **Personal data** — email addresses, names, or other PII not already public

If all checks pass, state "All files safe to commit." If any issue is found, describe it and suggest a fix before the user commits.

> "Complexity very, very bad." — [grugbrain.dev](https://grugbrain.dev/)

- **Say no.** The best weapon against complexity is the word "no". No new feature, no new abstraction, until it earns its place.
- **No abstraction until a pattern repeats three times.** Let cut points emerge naturally from the code; don't invent them up front.
- **80/20 solutions.** Ship 80% of the value with 20% of the code. Ugly but working beats elegant but over-engineered.
- **Chesterton's Fence.** Understand why code exists before removing it. If you don't see the use, go away and think.
- **Boring, obvious code wins.** Intermediate variables with good names beat clever one-liners. Easier to debug.
- **DRY is not a law.** A little copy-paste beats a complex abstraction built for two cases.
- **No FOLD** (Fear Of Looking Dumb). If something is too complex, say so. That's a signal to simplify, not a personal failing.
