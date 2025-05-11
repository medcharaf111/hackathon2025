"use client";
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

export default function AboutPage() {
  const { t } = useLanguage();
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">{t("about_title")}</h1>

        <div className="relative h-80 w-full mb-8 rounded-xl overflow-hidden">
          <Image src="/images/apropos.jpg" alt="Notre mission" fill className="object-cover" />
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>{t("about_mission_title")}</h2>
          <p>{t("about_mission_text")}</p>

          <h2>{t("about_vision_title")}</h2>
          <p>{t("about_vision_text")}</p>

          <h2>{t("about_objectives_title")}</h2>
          <ul>
            <li>{t("about_objective1")}</li>
            <li>{t("about_objective2")}</li>
            <li>{t("about_objective3")}</li>
            <li>{t("about_objective4")}</li>
            <li>{t("about_objective5")}</li>
          </ul>

          <h2>{t("about_approach_title")}</h2>
          <p>{t("about_approach_text")}</p>

          <div className="my-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">{t("about_join_title")}</h3>
            <p className="text-blue-700 mb-4">{t("about_join_text")}</p>
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-lg font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            >
              <Link href="/login">{t("about_join_button")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
