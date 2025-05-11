"use client";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/LanguageContext"

export default function Hero() {
  const { t } = useLanguage();
  return (
    <div className="relative bg-white overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/mian.jpg"
          alt="Sustainable development"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/50 mix-blend-multiply" />
      </div>

      <div className="relative container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("hero_title")}
          </h1>
          <p className="mt-6 text-xl text-white/90 max-w-xl">
            {t("hero_subtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full shadow-lg px-8 py-4 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 border-0"
            >
              <a href="#nos-programmes">{t("hero_discover")}</a>
            </Button>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full shadow-lg px-8 py-4 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 border-0"
            >
              <a href="/login">{t("hero_join")}</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
