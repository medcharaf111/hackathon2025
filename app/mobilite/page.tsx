"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Globe, ArrowRight } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";

const mobilityCategories = [
  { id: "all", label: "Tous les Programmes" },
  { id: "exchange", label: "Échanges" },
  { id: "internship", label: "Stages" },
  { id: "volunteer", label: "Volontariat" },
  { id: "research", label: "Recherche" },
]

const mobilityProgramLinks: { [key: string]: string } = {
  exchange: "https://en.unesco.org/themes/education/mobility",
  internship: "https://careers.unesco.org/go/Internships/781902/",
  volunteer: "https://en.unesco.org/youth",
  research: "https://en.unesco.org/themes/education/mobility",
};

export default function MobilityPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ title: "", description: "", image: null as File | null, location: "", duration: "", deadline: "", category: "exchange" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const mobilityCategoryTranslationKeys: { [key: string]: keyof typeof translations["fr"] } = {
    all: "mobility_category_all",
    exchange: "mobility_category_exchange",
    internship: "mobility_category_internship",
    volunteer: "mobility_category_volunteer",
    research: "mobility_category_research",
  };

  useEffect(() => {
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (u) setUser(JSON.parse(u));
    else setUser(null);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/mobility/programs")
      .then(res => res.json())
      .then(data => { setPrograms(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [refresh]);

  async function handleAddProgram(e: any) {
    e.preventDefault();
    setAdding(true);
    setError("");
    if (!user || !user._id) {
      setError("Utilisateur non chargé. Veuillez vous reconnecter.");
      setAdding(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", addForm.title);
    formData.append("description", addForm.description);
    if (addForm.image) formData.append("image", addForm.image);
    formData.append("location", addForm.location);
    formData.append("duration", addForm.duration);
    formData.append("deadline", addForm.deadline);
    formData.append("category", addForm.category);
    formData.append("userId", user._id);
    try {
      const res = await fetch("http://localhost:5000/api/mobility/programs", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de l'ajout du programme");
      } else {
        setAddForm({ title: "", description: "", image: null, location: "", duration: "", deadline: "", category: "exchange" });
        setRefresh(r => r + 1);
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setAdding(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">{t("mobility_title")}</h1>
          <p className="text-gray-600 mt-2">{t("mobility_subtitle")}</p>
        </div>
      </div>

      <div className="relative h-80 w-full mb-12 rounded-xl overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
          alt="Mobilité internationale"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent flex items-center">
          <div className="text-white p-8 max-w-lg">
            <h2 className="text-3xl font-bold mb-4">{t("mobility_hero_title")}</h2>
            <p className="mb-6">{t("mobility_hero_text")}</p>
            <Button className="bg-white text-blue-800 hover:bg-gray-100">{t("mobility_learn_more")}</Button>
          </div>
        </div>
      </div>

      {/* Professor add program form */}
      {user && user.profession === "professor" && (
        <form className="mb-8 bg-gray-50 p-6 rounded-lg border max-w-xl" onSubmit={handleAddProgram}>
          <h2 className="text-xl font-semibold mb-4">Ajouter un programme de mobilité</h2>
          <div className="mb-2">
            <label className="block mb-1">Titre</label>
            <input type="text" className="w-full border rounded px-3 py-2" required value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Description</label>
            <textarea className="w-full border rounded px-3 py-2" required value={addForm.description} onChange={e => setAddForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Image (optionnelle)</label>
            <input type="file" accept="image/*" onChange={e => setAddForm(f => ({ ...f, image: e.target.files && e.target.files[0] ? e.target.files[0] : null }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Lieu</label>
            <input type="text" className="w-full border rounded px-3 py-2" required value={addForm.location} onChange={e => setAddForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Durée</label>
            <input type="text" className="w-full border rounded px-3 py-2" required value={addForm.duration} onChange={e => setAddForm(f => ({ ...f, duration: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Date limite</label>
            <input type="text" className="w-full border rounded px-3 py-2" required value={addForm.deadline} onChange={e => setAddForm(f => ({ ...f, deadline: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Catégorie</label>
            <select className="w-full border rounded px-3 py-2" required value={addForm.category} onChange={e => setAddForm(f => ({ ...f, category: e.target.value }))}>
              <option value="exchange">Échanges</option>
              <option value="internship">Stages</option>
              <option value="volunteer">Volontariat</option>
              <option value="research">Recherche</option>
            </select>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Button type="submit" className="mt-2" disabled={adding}>{adding ? "Ajout..." : "Ajouter le programme"}</Button>
        </form>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex overflow-x-auto pb-2 mb-8">
          {mobilityCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex-shrink-0">
              {t(mobilityCategoryTranslationKeys[category.id as string])}
            </TabsTrigger>
          ))}
        </TabsList>

        {mobilityCategories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs
                .filter((program) => program.category === category.id || category.id === "all")
                .map((program) => (
                  <Card key={program._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                    <div className="relative h-48 w-full">
                      {program.image ? (
                      <Image
                          src={program.image.startsWith('/uploads/') ? `http://localhost:5000${program.image}` : program.image}
                        alt={program.title}
                        fill
                        className="object-cover"
                      />
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center text-4xl text-gray-400">🌍</div>
                      )}
                      {program.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-600">{t("mobility_featured")}</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{program.title}</CardTitle>
                      <CardDescription>{program.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{program.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{program.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{t("mobility_deadline")}: {program.deadline}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex gap-2 w-full">
                        <button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold"
                          onClick={() => {
                            console.log("Navigating to", `/mobilite/apply/${program._id}`);
                            router.push(`/mobilite/apply/${program._id}`);
                          }}
                        >
                          {t("mobility_apply")}
                        </button>
                        {user && user.profession === "professor" && program.createdBy && String(program.createdBy._id) === String(user._id) && (
                          <button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 font-semibold"
                            onClick={async () => {
                              if (!confirm('Supprimer ce programme ?')) return;
                              const res = await fetch(`http://localhost:5000/api/mobility/programs/${program._id}`, {
                                method: 'DELETE',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId: user._id })
                              });
                              if (res.ok) setRefresh(r => r + 1);
                            }}
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">{t("mobility_testimonials_title")}</CardTitle>
            <CardDescription className="text-blue-700">{t("mobility_testimonials_subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="italic text-gray-700 mb-2">{t("mobility_testimonial1")}</p>
                <p className="text-sm font-semibold">- Sophie Martin, France</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="italic text-gray-700 mb-2">{t("mobility_testimonial2")}</p>
                <p className="text-sm font-semibold">- Ahmed Hassan, Égypte</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="text-blue-700 p-0 flex items-center">
              {t("mobility_more_testimonials")} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800">{t("mobility_faq_title")}</CardTitle>
            <CardDescription className="text-blue-700">{t("mobility_faq_subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">{t("mobility_faq_q1_title")}</h4>
                <p className="text-gray-700 text-sm">{t("mobility_faq_q1_text")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">{t("mobility_faq_q2_title")}</h4>
                <p className="text-gray-700 text-sm">{t("mobility_faq_q2_text")}</p>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">{t("mobility_faq_q3_title")}</h4>
                <p className="text-gray-700 text-sm">{t("mobility_faq_q3_text")}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="link" className="text-blue-700 p-0 flex items-center">
              {t("mobility_more_faq")} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
