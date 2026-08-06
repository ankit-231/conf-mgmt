import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { BoardMembersPoster } from "@/components/board-members-poster";
import { INSTALLATION_CEREMONY_PATH } from "@/config/routes";

export default function Home() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="flex flex-col items-center gap-6 px-4 py-10">
                <Button
                    size="lg"
                    nativeButton={false}
                    render={<Link href={INSTALLATION_CEREMONY_PATH} />}
                >
                    Installation Ceremony 2026/27
                </Button>
                <BoardMembersPoster />
            </main>
        </div>
    );
}
