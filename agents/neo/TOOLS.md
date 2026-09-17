# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup: camera names and locations, SSH hosts and aliases, preferred TTS voices, speaker/room names, device nicknames, anything environment-specific.

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

## CrewCmd (localhost:3000)

- Auth for API: `Authorization: Bearer $(cat ~/.crewcmd/heartbeat-secret)` (session cookie not available to cron runs).
- Endpoints (dev server at ~/Developer/my-opensource/crewcmd, Homebrew postgres@17 via DATABASE_URL):
  - Tasks: `GET /api/tasks?workspaceId=<id>&status=queued`
  - Agents: `GET /api/agents?workspaceId=<id>`
  - Dispatch: `POST /api/agents/{callsign}/task`
  - Note: `/api/workspaces/{id}/tasks` does NOT exist (404 HTML); use query-param scope.
- psql not on PATH: use `/opt/homebrew/opt/postgresql/bin/psql postgres://roger@localhost:5432/crewcmd` for ground-truth checks.
- 2026-09-12 00:21 dispatch: server healthy, 0 queued tasks (5 in_progress, 4 review, 2 blocked); `/api/agents` returned empty (`source:"none"`) — agents appear deregistered, no queued work affected. Silent stop.
- 2026-09-12 03:33 dispatch: 0 queued (DB-confirmed; 5 in_progress, 4 review, 2 blocked), agents still `[]`/`source:"none"`. Nothing dispatchable. Silent stop.
- 2026-09-12 05:05 dispatch: 0 queued (DB-confirmed; 5 in_progress, 4 review, 2 blocked), agents still `[]`/`source:"none"`. Silent stop.
- 2026-09-12 05:50 dispatch: 0 queued (DB-confirmed), agents still `[]`/`source:"none"`. Nothing dispatchable. Silent stop.
- 2026-09-12 06:52 dispatch: 0 queued (DB-confirmed; 5 in_progress, 4 review, 2 blocked), agents still `[]`/`source:"none"`. Silent stop.
- 2026-09-12 11:19 dispatch: server still DOWN (curl 000); DB-confirmed 0 queued. Silent stop.
- 2026-09-13 13:14 dispatch: port 3000 now held by Open WebUI (com.docker, PID varies) — /api/* returns SPA HTML or Open WebUI 401 JSON, not CrewCmd. CrewCmd dev server not listening; earlier 401 explained (wrong app on port). DB ground truth: 0 queued tasks. Nothing dispatchable. Silent stop. If future runs need the API, restart crewcmd dev server or move Open WebUI off :3000.
- 2026-09-13 12:11 dispatch: server healthy (/api/health 200) but heartbeat-secret bearer now returns 401 on /api/tasks (previously worked). DB ground truth via psql: 0 queued tasks; agents rows exist again (NEO/CRESTODIAN online, FORGE/SPARK offline, all tied to runtime 271eeb30). Nothing to dispatch; investigate 401 auth change before next dispatch that needs write access (comments/dispatch).
- 2026-09-12 08:02 dispatch: dev server at :3000 DOWN (curl connection refused, HTTP 000). DB still up (postgres); 0 queued tasks (5 in_progress, 4 review, 2 blocked, 1865 done) → nothing dispatchable either way. Silent stop; no brief (not a brief run).
- 2026-09-12 05:06 daily brief: `/api/tasks` and `/api/inbox` both returned `[]` (known API regression — DB has data). DB ground truth: 0 tasks updated in last 12h (last touch 2026-08-29), no new completions; 7 old unread critical/high inbox items (all ≥2026-08-07, mostly prior briefs). Nothing notable → no brief sent. Inbox schema note: columns are snake_case (`workspace_id`, `status` not `read`); unread = `status='unread'`.

---

Add whatever helps you do your job. This is your cheat sheet.

## Related

- [Agent workspace](/concepts/agent-workspace)
