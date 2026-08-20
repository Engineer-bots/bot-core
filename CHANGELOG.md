# Changelog

## [26.1.0] - 2026-08-20

### Added
- Discord 봇 부트스트랩 코어 최초 작성.
- `config`: zod 기반 `baseEnvSchema` + `loadConfig` (extend 가능한 env 스키마).
- `logger`: pino 로거 생성.
- `client`: Discord client 생성, 슬래시 커맨드 등록.
- `dispatch`: 정적 커맨드 디스패치 + `resolveDynamic` 동적 커맨드 훅.
- `module`: `CoreContext`/`BotModule`/`SlashCommand` 타입, `loadModules`.
- `events`: 이벤트 핸들러 에러 로깅 래퍼(`safeEventHandler`).
- `presence`: 봇 프레즌스 설정 헬퍼.
- `cache`: 범용 `TTLCache`.
