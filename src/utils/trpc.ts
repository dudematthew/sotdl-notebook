import { createTRPCReact } from "@trpc/react-query";

import type { ApiRouter } from "@repo/crm-web/src/routers";

export const trpc = createTRPCReact<ApiRouter>();
