"use client";

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

const partners = [
  { id: 1, name: "Partner 1", logo: "/images/part1.jpg" },
  { id: 2, name: "Partner 2", logo: "/images/part2.jpg" },
  { id: 3, name: "Partner 3", logo: "/images/part3.jpg" },
  { id: 4, name: "Partner 4", logo: "/images/part4.jpg" },
  { id: 5, name: "Partner 5", logo: "/images/part5.jpg" },
  { id: 6, name: "Partner 6", logo: "/images/part6.jpg" },
]

export default function Partners() {
  const { t } = useLanguage();
  return (
    <section className="py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t("partners_title")}</h2>
          <p className="text-gray-600 mt-2">{t("partners_subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center h-32"
          >
            <div className="relative h-16 w-full">
              <Image src={partner.logo || "/placeholder.svg"} alt={partner.name} fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
