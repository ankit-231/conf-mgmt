"use client";

import { ProgressProvider as BProgressProvider } from "@bprogress/next/app";

const ProgressProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <BProgressProvider
            height="4px"
            color="var(--primary)"
            options={{ showSpinner: false }}
            shallowRouting
        >
            {children}
        </BProgressProvider>
    );
};

export default ProgressProvider;
