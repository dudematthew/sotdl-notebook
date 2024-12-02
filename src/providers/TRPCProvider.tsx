import { fetchAuthSession } from "aws-amplify/auth";
import React, { useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { httpBatchLink } from "@trpc/client";

import { env } from "../env";
import { trpc } from "../utils/trpc";

const TRPCProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
          staleTime: Infinity,
          retry: 3,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          networkMode: "online",
        },
      },
    });

    const asyncStoragePersister = createAsyncStoragePersister({
      storage: AsyncStorage,
      key: "VILLAGE_CAREGIVING_CACHE",
    });

    persistQueryClient({
      queryClient: client,
      persister: asyncStoragePersister,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });

    return client;
  });

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${env.API_URL}/api/trpc`,
          async headers() {
            try {
              const session = await fetchAuthSession();
              const token = session.tokens?.accessToken.toString();
              return {
                Authorization: token ? `Bearer ${token}` : "",
              };
            } catch (error) {
              return {};
            }
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default TRPCProvider;
