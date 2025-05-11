"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"

const news = [
  {
    id: 1,
    title: {
      fr: "Conférence Internationale sur l'Éducation Durable",
      en: "International Conference on Sustainable Education",
    },
    date: {
      fr: "15 Mai 2023",
      en: "May 15, 2023",
    },
    excerpt: {
      fr: "Rejoignez-nous pour la conférence internationale sur l'éducation au développement durable.",
      en: "Join us for the international conference on education for sustainable development.",
    },
    image: "/images/1.jpg",
  },
  {
    id: 2,
    title: {
      fr: "Nouveau Partenariat pour l'Éducation Climatique",
      en: "New Partnership for Climate Education",
    },
    date: {
      fr: "3 Avril 2023",
      en: "April 3, 2023",
    },
    excerpt: {
      fr: "Nous avons établi un nouveau partenariat pour renforcer l'éducation climatique dans les écoles.",
      en: "We have established a new partnership to strengthen climate education in schools.",
    },
    image: "/images/2.jpg",
  },
  {
    id: 3,
    title: {
      fr: "Lancement du Programme de Certification Verte",
      en: "Launch of the Green Certification Program",
    },
    date: {
      fr: "28 Mars 2023",
      en: "March 28, 2023",
    },
    excerpt: {
      fr: "Notre nouveau programme de certification verte est maintenant disponible pour les établissements scolaires.",
      en: "Our new green certification program is now available for schools.",
    },
    image: "/images/3.jpg",
  },
  {
    id: 4,
    title: {
      fr: "Atelier sur les Objectifs de Développement Durable",
      en: "Workshop on Sustainable Development Goals",
    },
    date: {
      fr: "15 Mars 2023",
      en: "March 15, 2023",
    },
    excerpt: {
      fr: "Participez à notre atelier sur l'intégration des ODD dans les programmes scolaires.",
      en: "Join our workshop on integrating SDGs into school curricula.",
    },
    image: "/images/4.jpg",
  },
]

export default function LatestNews() {
  const { t, language } = useLanguage();
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t("news_title")}</h2>
          <p className="text-gray-600 mt-2">{t("news_subtitle")}</p>
        </div>
        <Button variant="link" className="text-green-600 flex items-center gap-1">
          {t("news_all")} <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.map((item) => (
          <a href={`/actualites/${item.id.toString()}`} className="block group" key={item.id}>
            <Card className="flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 md:h-auto md:w-1/3 flex-shrink-0">
                <Image src={item.image || "/placeholder.svg"} alt={item.title[language]} fill className="object-cover" />
              </div>
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {item.date[language]}
                  </div>
                  <CardTitle className="text-lg group-hover:text-blue-700 transition-colors">{item.title[language]}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600">{item.excerpt[language]}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="text-green-600 p-0">{t("news_read")}</Button>
                </CardFooter>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </section>
  )
}
