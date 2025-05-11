"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

const programs = [
  {
    id: 1,
    slug: "education-au-changement-climatique",
    title: {
      fr: "Éducation au Changement Climatique",
      en: "Climate Change Education",
    },
    description: {
      fr: "Programmes éducatifs sur le changement climatique et les actions pour un avenir durable.",
      en: "Educational programs on climate change and actions for a sustainable future.",
    },
    image: "/images/climat.jpg",
  },
  {
    id: 2,
    slug: "biodiversite-ecosystemes",
    title: {
      fr: "Biodiversité et Écosystèmes",
      en: "Biodiversity and Ecosystems",
    },
    description: {
      fr: "Exploration de la biodiversité et de l'importance des écosystèmes pour notre planète.",
      en: "Exploring biodiversity and the importance of ecosystems for our planet.",
    },
    image: "/images/biodiversite.jpg",
  },
  {
    id: 3,
    slug: "economie-circulaire",
    title: {
      fr: "Économie Circulaire",
      en: "Circular Economy",
    },
    description: {
      fr: "Apprentissage des principes de l'économie circulaire et de la gestion durable des ressources.",
      en: "Learning the principles of circular economy and sustainable resource management.",
    },
    image: "/images/economie.jpg",
  },
]

export default function FeaturedPrograms() {
  const { t, language } = useLanguage();
  return (
    <section id="nos-programmes" className="py-8 scroll-mt-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t("featured_title")}</h2>
          <p className="text-gray-600 mt-2">{t("featured_subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Link href={`/programmes/${program.slug}`} key={program.id}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative h-48 w-full">
                <Image src={program.image || "/placeholder.svg"} alt={program.title[language]} fill className="object-cover" />
            </div>
            <CardHeader>
                <CardTitle>{program.title[language]}</CardTitle>
                <CardDescription>{program.description[language]}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button className="bg-blue-600 hover:bg-blue-700 w-full">{t("featured_more")}</Button>
            </CardFooter>
          </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
