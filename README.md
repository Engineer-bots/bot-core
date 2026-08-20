# bot-core

Discord 봇을 만들 때 매번 반복되는 부트스트랩 로직만 모아둔 코어 패키지.
기능(커맨드, 모듈)은 포함하지 않는다 — EE-ONE-D의 `src/shared/*`에서
Discord/봇 실행에 필요한 범용 부분만 추출했다.

## 포함된 것

- `config.ts` — zod 기반 env 스키마(`baseEnvSchema`) + `loadConfig`. 각 봇은
  `baseEnvSchema.extend({...})`로 자기 필드(DB URL 등)를 추가한다.
- `logger.ts` — pino 로거 생성.
- `client.ts` — Discord client 생성 + 슬래시 커맨드 등록.
- `dispatch.ts` — 인터랙션을 정적 커맨드에 매칭해서 실행. DB 기반 동적
  커맨드가 필요하면 `resolveDynamic` 콜백으로 주입.
- `module.ts` — `BotModule`/`SlashCommand`/`CoreContext` 타입과 모듈 로더.
  각 봇은 `CoreContext`를 extend해서 `db` 등 자기 컨텍스트를 정의한다.
- `events.ts` — 이벤트 핸들러 에러를 로깅하고 삼키는 래퍼.
- `presence.ts` — 봇 프레즌스(활동 상태) 설정 헬퍼.
- `cache.ts` — 범용 `TTLCache`.

## 포함되지 않은 것

특정 봇의 기능(커스텀 커맨드 DB 스키마, 임베드, 크롤러 등), ORM/DB 클라이언트
자체(Prisma 등은 각 봇이 직접 붙인다), riceminer(Python) 포팅.

## 사용 예

```ts
import { baseEnvSchema, loadConfig, createLogger, createDiscordClient,
  registerCommands, dispatchCommand, loadModules, CoreContext } from "bot-core";
import { z } from "zod";

const envSchema = baseEnvSchema.extend({ DATABASE_URL: z.string().url() });
const config = loadConfig(envSchema);
const logger = createLogger({ name: "my-bot", level: config.LOG_LEVEL });
const { client, rest } = createDiscordClient(config);

interface AppContext extends CoreContext {
  db: MyDbClient;
}
```
