"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/i18n"

const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const pathname = usePathname()
  const [user, setUser] = useState<{ nom: string, prenom: string } | null>(null)

  useEffect(() => {
    function updateUser() {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          try {
            setUser(JSON.parse(userStr))
          } catch {
            setUser(null)
          }
        } else {
          setUser(null)
        }
      }
    }
    updateUser()
    window.addEventListener("userChanged", updateUser)
    return () => window.removeEventListener("userChanged", updateUser)
  }, [])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">EDUPLANET</span>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                EP
              </div>
              <span className="font-semibold text-lg hidden sm:inline-block">EDUPLANET</span>
            </div>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-8">
          {[
            { name: t("home"), href: "/" },
            { name: t("about"), href: "/a-propos" },
            { name: t("forum"), href: "/forum" },
            { name: t("courses"), href: "/cours" },
            { name: t("mobility"), href: "/mobilite" },
            { name: t("quiz"), href: "/quiz" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors relative py-2",
                pathname === item.href &&
                  "text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-600",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {language === "fr" ? "Français" : "English"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[
                { code: "fr", name: "Français" },
                { code: "en", name: "English" },
              ].map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as "fr" | "en")}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-blue-700">{user.prenom} {user.nom}</span>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.dispatchEvent(new Event('userChanged'));
                }}
              >
                {t("logout")}
              </Button>
            </div>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <Button className="bg-blue-600 hover:bg-blue-700">{t("join")}</Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <span className="sr-only">EDUPLANET</span>
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                  EP
                </div>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {[
                    { name: t("home"), href: "/" },
                    { name: t("about"), href: "/a-propos" },
                    { name: t("forum"), href: "/forum" },
                    { name: t("courses"), href: "/cours" },
                    { name: t("mobility"), href: "/mobilite" },
                    { name: t("quiz"), href: "/quiz" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50",
                        pathname === item.href && "text-blue-600",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: "fr", name: "Français" },
                        { code: "en", name: "English" },
                      ].map((lang) => (
                        <Button
                          key={lang.code}
                          variant={language === lang.code ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            language === lang.code ? "bg-blue-600 hover:bg-blue-700" : ""
                          )}
                          onClick={() => setLanguage(lang.code as "fr" | "en")}
                        >
                          {lang.name}
                        </Button>
                      ))}
                    </div>
                    {user ? (
                      <div className="flex flex-col items-center gap-2 w-full">
                        <span className="font-semibold text-blue-700 w-full text-center">{user.prenom} {user.nom}</span>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white w-full px-3 py-1 text-sm"
                          onClick={() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.dispatchEvent(new Event('userChanged'));
                          }}
                        >
                          {t("logout")}
                        </Button>
                      </div>
                    ) : (
                      <Link href="/login" passHref legacyBehavior>
                        <Button className="bg-blue-600 hover:bg-blue-700 w-full">{t("join")}</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
