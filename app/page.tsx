import { Suspense } from "react"
import Hero from "@/components/hero"
import FeaturedPrograms from "@/components/featured-programs"
import LatestNews from "@/components/latest-news"
import Partners from "@/components/partners"
import ChatbotButton from "@/components/chatbot-button"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="h-[600px] flex items-center justify-center">Loading...</div>}>
        <Hero />
      </Suspense>

      <div className="container mx-auto px-4 py-12 space-y-20">
        <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Loading...</div>}>
          <FeaturedPrograms />
        </Suspense>

        <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Loading...</div>}>
          <LatestNews />
        </Suspense>

        <Suspense fallback={<div className="h-[400px] flex items-center justify-center">Loading...</div>}>
          <Partners />
        </Suspense>
      </div>

      <ChatbotButton />
    </main>
  )
}
