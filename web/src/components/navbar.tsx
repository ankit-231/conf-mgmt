"use client"

import * as React from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { INSTALLATION_CEREMONY_PATH } from "@/config/routes"

function Navbar() {
  const [hidden, setHidden] = React.useState(false)
  const lastScrollY = React.useRef(0)

  React.useEffect(() => {
    lastScrollY.current = window.scrollY

    function handleScroll() {
      const currentScrollY = window.scrollY
      const scrolledDown = currentScrollY > lastScrollY.current

      // small threshold near the top so it doesn't flicker hidden on tiny scrolls
      setHidden(scrolledDown && currentScrollY > 64)
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur transition-transform duration-300 supports-[backdrop-filter]:bg-background/60 md:translate-y-0 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="font-semibold text-brand-maroon">
          Rotaract Club of Kathmandu Metropolis
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href={INSTALLATION_CEREMONY_PATH}
            className="text-sm font-medium text-foreground hover:text-brand-maroon"
          >
            Installation Ceremony 2026/27
          </Link>
        </nav>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={<Link href={INSTALLATION_CEREMONY_PATH} />}
              >
                Installation Ceremony 2026/27
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
