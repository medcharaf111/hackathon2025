"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MobilityApplyPage() {
  const router = useRouter();
  const params = useParams();
  const programId = params?.programId as string;
  const [user, setUser] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<{ cv: File | null; passport: File | null; otherDetails: string }>({ cv: null, passport: null, otherDetails: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (u) setUser(JSON.parse(u));
    else setUser(null);
  }, []);

  // Fetch applications if professor
  useEffect(() => {
    if (user && user.profession === "professor") {
      setLoading(true);
      fetch(`http://localhost:5000/api/mobility/applications?programId=${programId}&userId=${user._id}`)
        .then(res => res.json())
        .then(data => { setApplications(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user, programId]);

  // Student submit handler
  async function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    if (!user || !user._id) {
      setError("Utilisateur non chargé. Veuillez vous reconnecter.");
      setSubmitting(false);
      return;
    }
    if (!form.cv || !form.passport) {
      setError("CV et passeport requis.");
      setSubmitting(false);
      return;
    }
    const formData = new FormData();
    formData.append("programId", programId);
    formData.append("userId", user._id);
    formData.append("cv", form.cv);
    formData.append("passport", form.passport);
    formData.append("otherDetails", form.otherDetails);
    try {
      const res = await fetch("http://localhost:5000/api/mobility/apply", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Erreur lors de la soumission");
      } else {
        setForm({ cv: null, passport: null, otherDetails: "" });
        alert("Candidature envoyée !");
        router.push("/mobilite");
      }
    } catch {
      setError("Erreur réseau");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) return <div className="container mx-auto px-4 py-12 text-center text-lg">Connexion requise.</div>;

  if (user.profession === "student") {
    return (
      <main className="container mx-auto px-4 py-12 max-w-xl">
        <h1 className="text-3xl font-bold mb-6">Candidature à la mobilité</h1>
        <form className="bg-gray-50 p-6 rounded-lg border" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">CV (PDF)</label>
            <input type="file" accept="application/pdf" required onChange={e => setForm(f => ({ ...f, cv: e.target.files && e.target.files[0] ? e.target.files[0] : null }))} />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Passeport (PDF ou image)</label>
            <input type="file" accept="application/pdf,image/*" required onChange={e => setForm(f => ({ ...f, passport: e.target.files && e.target.files[0] ? e.target.files[0] : null }))} />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Autres informations</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.otherDetails} onChange={e => setForm(f => ({ ...f, otherDetails: e.target.value }))} placeholder="Adresse, téléphone, motivation, etc." />
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <Button type="submit" className="mt-2" disabled={submitting}>{submitting ? "Envoi..." : "Envoyer la candidature"}</Button>
        </form>
      </main>
    );
  }

  if (user.profession === "professor") {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Candidatures reçues</h1>
        {loading ? <div>Chargement...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.length === 0 && <div className="col-span-full text-center text-gray-500">Aucune candidature pour ce programme.</div>}
            {applications.map((app: any) => (
              <div key={app._id} className="bg-white border rounded-lg p-4">
                <div className="font-semibold mb-2">{app.student?.nom} {app.student?.prenom}</div>
                <div>Email: {app.student?.email}</div>
                <div>Niveau: {app.student?.niveauEducation}</div>
                <div className="mt-2"><a href={`http://localhost:5000${app.cvUrl}`} target="_blank" className="text-blue-600 underline">Voir le CV</a></div>
                <div><a href={`http://localhost:5000${app.passportUrl}`} target="_blank" className="text-blue-600 underline">Voir le passeport</a></div>
                {app.otherDetails && <div className="mt-2 text-sm text-gray-700">{typeof app.otherDetails === 'string' ? app.otherDetails : JSON.stringify(app.otherDetails)}</div>}
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  return <div className="container mx-auto px-4 py-12 text-center text-lg">Accès réservé aux étudiants et professeurs.</div>;
} 