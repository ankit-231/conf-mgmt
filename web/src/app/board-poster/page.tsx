import type { Metadata } from "next"

import { BoardMembersPoster } from "@/components/board-members-poster"

export const metadata: Metadata = {
  title: "Board Members Poster",
}

export default function BoardPosterPage() {
  return (
    <div className="flex min-h-svh items-start justify-center bg-muted py-10">
      <BoardMembersPoster />
    </div>
  )
}
