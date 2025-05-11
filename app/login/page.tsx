"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  // Login handler
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('login-email') as HTMLInputElement).value;
    const motDePasse = (form.elements.namedItem('login-password') as HTMLInputElement).value;
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userChanged'));
        alert('Connexion réussie !');
        // Optionally redirect here
      } else {
        alert(data.message || "Erreur lors de la connexion");
      }
    } catch (err) {
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  // Signup handler
  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const nom = (form.elements.namedItem('signup-nom') as HTMLInputElement).value;
    const prenom = (form.elements.namedItem('signup-prenom') as HTMLInputElement).value;
    const age = (form.elements.namedItem('signup-age') as HTMLInputElement).value;
    const email = (form.elements.namedItem('signup-email') as HTMLInputElement).value;
    const motDePasse = (form.elements.namedItem('signup-password') as HTMLInputElement).value;
    const lieu = (form.elements.namedItem('signup-lieu') as HTMLInputElement).value;
    const niveauEducation = (form.elements.namedItem('signup-niveau') as HTMLSelectElement).value;
    const profession = (form.elements.namedItem('signup-profession') as HTMLSelectElement).value;
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, motDePasse, niveauEducation, lieu, age: Number(age), profession })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userChanged'));
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        // Optionally switch to login tab
      } else {
        alert(data.message || "Erreur lors de l'inscription");
      }
    } catch (err) {
      alert("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userChanged'));
    setIsLoggedIn(false);
    alert('Déconnexion réussie !');
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {isLoggedIn ? (
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Vous êtes connecté</h2>
            <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700">Se déconnecter</Button>
          </div>
        ) : (
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Se connecter</TabsTrigger>
            <TabsTrigger value="signup">Créer un compte</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">Se connecter</h2>
            </div>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="login-email" type="email" placeholder="Votre email" required />
              </div>
              <div>
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input id="login-password" name="login-password" type="password" placeholder="Votre mot de passe" required />
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-center text-gray-800">S'inscrire</h2>
            </div>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="signup-nom">Nom</Label>
                  <Input id="signup-nom" name="signup-nom" type="text" placeholder="Votre nom" required />
                </div>
                <div className="flex-1">
                  <Label htmlFor="signup-prenom">Prénom</Label>
                  <Input id="signup-prenom" name="signup-prenom" type="text" placeholder="Votre prénom" required />
                </div>
              </div>
              <div>
                <Label htmlFor="signup-age">Âge</Label>
                <Input id="signup-age" name="signup-age" type="number" min="0" placeholder="Votre âge" required />
              </div>
              <div>
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" name="signup-email" type="email" placeholder="Votre email" required />
              </div>
              <div>
                <Label htmlFor="signup-password">Mot de passe</Label>
                <Input id="signup-password" name="signup-password" type="password" placeholder="Votre mot de passe" required />
              </div>
              <div>
                <Label htmlFor="signup-lieu">Lieu de résidence</Label>
                <Input id="signup-lieu" name="signup-lieu" type="text" placeholder="Votre lieu de résidence" required />
              </div>
              <div>
                <Label htmlFor="signup-niveau">Niveau d'éducation</Label>
                <select id="signup-niveau" name="signup-niveau" required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Sélectionnez votre niveau</option>
                  <option value="primaire">Primaire</option>
                  <option value="secondaire">Secondaire</option>
                  <option value="universitaire">Universitaire</option>
                </select>
              </div>
              <div>
                <Label htmlFor="signup-profession">Profession</Label>
                <select id="signup-profession" name="signup-profession" required className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Sélectionnez votre profession</option>
                  <option value="student">Étudiant</option>
                  <option value="professor">Professeur</option>
                </select>
              </div>
              <Button type="submit" className="w-full mt-4" disabled={loading}>{loading ? 'Inscription...' : 'Créer un compte'}</Button>
            </form>
          </TabsContent>
        </Tabs>
        )}
      </div>
    </div>
  )
} 