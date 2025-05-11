"use client";

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/context/LanguageContext"

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer_about_title")}</h3>
            <p className="text-blue-100 mb-4">
              {t("footer_about_text")}
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/unesco" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com/unesco" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://www.instagram.com/unesco" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://www.linkedin.com/company/unesco" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="https://www.youtube.com/user/unesco" className="text-blue-100 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer_links_title")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-blue-100 hover:text-white transition-colors">
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-blue-100 hover:text-white transition-colors">
                  {t("forum")}
                </Link>
              </li>
              <li>
                <Link href="/cours" className="text-blue-100 hover:text-white transition-colors">
                  {t("courses")}
                </Link>
              </li>
              <li>
                <Link href="/mobilite" className="text-blue-100 hover:text-white transition-colors">
                  {t("mobility")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-white transition-colors">
                  {t("footer_contact_link")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer_contact_title")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-blue-100">{t("footer_address")}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-blue-100">+41 22 917 78 00</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-blue-100">contact@unesco.org</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">{t("footer_newsletter_title")}</h3>
            <p className="text-blue-100 mb-4">
              {t("footer_newsletter_text")}
            </p>
            <form className="space-y-2">
              <Input
                type="email"
                placeholder={t("footer_newsletter_placeholder")}
                className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
              />
              <Button className="w-full bg-white text-blue-900 hover:bg-blue-100">{t("footer_newsletter_button")}</Button>
            </form>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8 text-center text-blue-200">
          <p>© {new Date().getFullYear()} UNESCO. {t("footer_rights")}</p>
        </div>
      </div>
    </footer>
  )
}
