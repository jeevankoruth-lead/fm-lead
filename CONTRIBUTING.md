# Contributing Guidelines

## Commit Message Convention

Use a lightweight prefix to make history scannable:

- `content:` post/article text, front matter, references, media placement
- `style:` markdown structure, heading hierarchy, list formatting, readability
- `build:` Hugo config/build pipeline and scripts
- `theme:` layout, CSS, partials, theme overrides
- `chore:` housekeeping updates (archetypes, docs, repo maintenance)

### Format

`<prefix>: <short imperative summary>`

Examples:

- `content: add ATS transfer testing technical article`
- `style: normalize headings and bullet lists in muser posts`
- `chore: add focus technical academic archetype`
- `theme: tweak single article typography spacing`

## Scope Guidance

- Keep one logical change per commit when possible.
- Prefer small, reviewable commits over large mixed commits.
- If a commit includes multiple areas, choose the dominant prefix.

## Optional Body Template

When needed, add a short body:

- Why the change was needed
- What was changed
- Any validation run (for example: `hugo --renderToMemory`)
