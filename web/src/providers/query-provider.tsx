"use client";

// Note that this is provided by ChatGPT
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function QueryProvider({ children }: { children: ReactNode }) {
    // below is provided by ChatGPT, see official docs for why this is needed to be done and why
    // const queryClient = new QueryClient(); is dangerous
    // From the docs https://tanstack.com/query/latest/docs/framework/react/guides/ssr#initial-setup :
    //
    // NEVER DO THIS:
    // const queryClient = new QueryClient()
    //
    // Creating the queryClient at the file root level makes the cache shared
    // between all requests and means _all_ data gets passed to _all_ users.
    // Besides being bad for performance, this also leaks any sensitive data.
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
