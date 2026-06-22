# TradingToolsHub Agent Entrypoint

This is the Codex-facing project entrypoint for TradingToolsHub.

## Load First

Before changing TradingToolsHub, read:

1. `/srv/BusinessOps/AGENTS.md`
2. `/srv/BusinessOps/CLAUDE.md`
3. `/root/.claude/projects/-srv-BusinessOps/memory/trading_directory.md`
4. `/root/.claude/projects/-srv-BusinessOps/memory/tth_session_*.md`
5. `/root/.claude/projects/-srv-BusinessOps/memory/feedback_tth_*.md`
6. Queue files under `/srv/BusinessOps/TradingToolsHub_SEO/`

## Project Shape

- Live site: `https://tradingtoolshub.com`
- Code path: `/srv/BusinessOps/tradingtoolshub`
- Stack: Astro static site + Tailwind
- Primary focus: trading tools directory, prop-firm SEO, affiliate monetization,
  comparison/review/listicle/guide pages.
- Prop-firm strategy is a protected strategic focus. Do not undo it.

## Useful Commands

- `npm run build`
- `npm run dev`
- `git status --short --untracked-files=all`

## Queue And Automation Files

- `/srv/BusinessOps/TradingToolsHub_SEO/content_queue.json`
- `/srv/BusinessOps/TradingToolsHub_SEO/blog_queue.json`
- `/srv/BusinessOps/TradingToolsHub_SEO/youtube_guides_queue.json`
- `/srv/BusinessOps/logs/tth_content.log`
- `/srv/BusinessOps/logs/tth_blog.log`
- `/srv/BusinessOps/logs/tth_seo.log`

## Safety Rules

- Do not delete or rewrite prop-firm work without explicit founder approval.
- Do not guess affiliate URLs. Leave them empty unless verified.
- Check existing tool JSON schema before adding profiles.
- Expect large generated content batches. Preserve existing local changes.

