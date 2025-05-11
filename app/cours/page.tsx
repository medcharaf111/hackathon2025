"use client";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Award, Users, Filter } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/i18n"
import { useEffect, useState } from "react";

const courseCategories = [
  { id: "all", label: "Tous les Cours" },
  { id: "climate", label: "Changement Climatique" },
  { id: "biodiversity", label: "Biodiversité" },
  { id: "economy", label: "Économie Durable" },
  { id: "education", label: "Éducation" },
]

const courseLinks: { [key: string]: string } = {
  all: "https://sdgacademy.org/",
  climate: "https://sdgacademy.org/course/climate-action-sdg-13/",
  biodiversity: "https://sdgacademy.org/course/biodiversity-and-ecosystems/",
  economy: "https://sdgacademy.org/course/circular-economy/",
  education: "https://en.unesco.org/themes/education",
};

const courseCategoryTranslationKeys: { [key: string]: keyof typeof translations["fr"] } = {
  all: "courses_category_all",
  climate: "courses_category_climate",
  biodiversity: "courses_category_biodiversity",
  economy: "courses_category_economy",
  education: "courses_category_education",
};

export default function CoursesPage() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addForm, setAddForm] = useState<{ title: string; level: string; file: File | null }>({ title: "", level: "", file: null });
  const [adding, setAdding] = useState(false);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (u) setUser(JSON.parse(u));
    else setUser(null);
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    let url = "http://localhost:5000/api/courses";
    if (user.profession === "student" && user.niveauEducation) {
      url += `?level=${user.niveauEducation}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, refresh]);

  if (!user) {
    return <div className="container mx-auto px-4 py-12 text-center text-lg">{t("login")} requis pour accéder à cette page.</div>;
  }
  if (user.profession !== "professor" && user.profession !== "student") {
    return <div className="container mx-auto px-4 py-12 text-center text-lg">Accès réservé aux étudiants et professeurs.</div>;
  }

  // Add course handler (professor only)
  async function handleAddCourse(e: any) {
    e.preventDefault();
    setAdding(true);
    setError("");
    console.log("User in add course:", user);
    if (!user || !user._id) {
      setError("Utilisateur non chargé. Veuillez vous reconnecter.");
      setAdding(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", addForm.title);
    formData.append("level", addForm.level);
    if (addForm.file) formData.append("file", addForm.file);
    formData.append("userId", user._id);
    try {
      const res = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de l'ajout du cours");
      } else {
        setAddForm({ title: "", level: "", file: null });
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
          <h1 className="text-4xl font-bold">{t("courses_title")}</h1>
          <p className="text-gray-600 mt-2">{t("courses_subtitle")}</p>
        </div>
      </div>

      {/* Professor add form */}
      {user.profession === "professor" && (
        <form className="mb-8 bg-gray-50 p-6 rounded-lg border max-w-xl" onSubmit={handleAddCourse}>
          <h2 className="text-xl font-semibold mb-4">Ajouter un cours</h2>
          <div className="mb-2">
            <label className="block mb-1">Titre du cours</label>
            <input type="text" className="w-full border rounded px-3 py-2" required value={addForm.title} onChange={e => setAddForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Niveau d'éducation</label>
            <select className="w-full border rounded px-3 py-2" required value={addForm.level} onChange={e => setAddForm(f => ({ ...f, level: e.target.value }))}>
              <option value="">Sélectionnez le niveau</option>
              <option value="primaire">Primaire</option>
              <option value="secondaire">Secondaire</option>
              <option value="universitaire">Universitaire</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Fichier PDF</label>
            <input type="file" accept="application/pdf" required onChange={e => setAddForm(f => ({ ...f, file: e.target.files && e.target.files[0] ? e.target.files[0] : null }))} />
                        </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Button type="submit" className="mt-2" disabled={adding}>{adding ? "Ajout..." : "Ajouter le cours"}</Button>
        </form>
      )}

      {/* Courses list */}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 && <div className="col-span-full text-center text-gray-500">Aucun cours trouvé.</div>}
          {courses.map((course: any) => (
            <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="relative h-48 w-full flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-6xl">📄</span>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl">{course.title}</CardTitle>
                <CardDescription>Niveau : {course.level.charAt(0).toUpperCase() + course.level.slice(1)}</CardDescription>
                <CardDescription>Ajouté par : {course.createdBy?.nom} {course.createdBy?.prenom}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                <a href={`http://localhost:5000${course.fileUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Voir le PDF</a>
                    </CardContent>
                  </Card>
                ))}
        </div>
      )}
    </main>
  );
}
