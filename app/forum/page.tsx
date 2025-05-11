"use client";
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Eye, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/i18n"

const forumCategories = [
  { id: "discussions" },
  { id: "education" },
  { id: "projects" },
  { id: "resources" },
];

export default function ForumPage() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", content: "", category: forumCategories[0].id });
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<{ [postId: string]: string }>({});
  const [replySubmitting, setReplySubmitting] = useState<{ [postId: string]: boolean }>({});

  useEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setUserId(parsed._id || null);
      } catch {}
    }
    fetch("http://localhost:5000/api/forum")
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!user) {
      alert("Vous devez être connecté pour poster.");
      setSubmitting(false);
      return;
    }
    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch (e) {
      alert("Erreur de session utilisateur. Veuillez vous reconnecter.");
      setSubmitting(false);
      return;
    }
    const userId = parsedUser && parsedUser._id;
    console.log('User object from localStorage:', parsedUser);
    console.log('userId extracted:', userId);
    if (!userId) {
      alert("Utilisateur non valide. Veuillez vous reconnecter.");
      setSubmitting(false);
      return;
    }
    const postBody = { ...form, author: userId };
    console.log('POST body to /api/forum:', postBody);
    const res = await fetch("http://localhost:5000/api/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody)
    });
    if (res.ok) {
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setForm({ title: "", content: "", category: forumCategories[0].id });
    } else {
      alert("Erreur lors de la création du post.");
    }
    setSubmitting(false);
  };

  const handleLike = async (postId: string) => {
    if (!userId) {
      alert("Vous devez être connecté pour aimer un post.");
      return;
    }
    const res = await fetch(`http://localhost:5000/api/forum/${postId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      const updatedPost = await res.json();
      setPosts(posts => posts.map(post => post._id === postId ? updatedPost : post));
    }
  };

  const handleReply = async (postId: string) => {
    if (!userId) {
      alert("Vous devez être connecté pour répondre à un post.");
      return;
    }
    const content = replyContent[postId];
    if (!content || !content.trim()) {
      alert("Le message de la réponse ne peut pas être vide.");
      return;
    }
    setReplySubmitting(rs => ({ ...rs, [postId]: true }));
    const res = await fetch(`http://localhost:5000/api/forum/${postId}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, content })
    });
    if (res.ok) {
      const updatedPost = await res.json();
      setPosts(posts => posts.map(post => post._id === postId ? updatedPost : post));
      setReplyContent(rc => ({ ...rc, [postId]: "" }));
    }
    setReplySubmitting(rs => ({ ...rs, [postId]: false }));
  };

  const handleReplyLike = async (postId: string, replyId: string) => {
    if (!userId) {
      alert("Vous devez être connecté pour aimer une réponse.");
      return;
    }
    const res = await fetch(`http://localhost:5000/api/forum/${postId}/reply/${replyId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    if (res.ok) {
      const updatedPost = await res.json();
      setPosts(posts => posts.map(post => post._id === postId ? updatedPost : post));
    }
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Forum</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Nouveau Post</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Titre</label>
          <input name="title" value={form.title} onChange={handleInput} className="w-full border rounded px-3 py-2" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Catégorie</label>
          <select name="category" value={form.category} onChange={handleInput} className="w-full border rounded px-3 py-2">
            {forumCategories.map(cat => <option key={cat.id} value={cat.id}>{t(cat.id as any)}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Message</label>
          <textarea name="content" value={form.content} onChange={handleInput} className="w-full border rounded px-3 py-2" rows={4} required />
        </div>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>{submitting ? "Publication..." : "Publier"}</Button>
      </form>
      <Tabs defaultValue={forumCategories[0].id} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
          {forumCategories.map((category) => (
            <TabsTrigger key={category.id} value={category.id}>
              {t(category.id as any)}
            </TabsTrigger>
          ))}
        </TabsList>
        {forumCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            {loading ? <div>Chargement...</div> :
              posts.filter(post => post.category === category.id).map((post) => (
                <Card key={post._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-700 hover:text-blue-800 transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      Par {post.author?.nom || "Utilisateur"} • {new Date(post.createdAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <div className="px-6 pb-4 text-gray-800 whitespace-pre-line">{post.content}</div>
                  <div className="px-6 pb-4 flex items-center gap-4">
                    <button
                      className={`flex items-center gap-1 text-blue-600 font-semibold hover:underline disabled:opacity-50`}
                      onClick={() => handleLike(post._id)}
                      disabled={!userId || (userId === (post.author?._id || post.author))}
                    >
                      <ThumbsUp className="h-4 w-4" />
                      {post.likes?.length || 0}
                    </button>
                  </div>
                  {/* Replies Section */}
                  <div className="px-6 pb-4">
                    <div className="mb-2 font-semibold text-blue-700">Réponses :</div>
                    {post.replies && post.replies.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {post.replies.map((reply: any, idx: number) => (
                          <div key={reply._id || idx} className="bg-blue-50 rounded p-2 text-sm">
                            <span className="font-semibold text-blue-800">{reply.author?.nom || "Utilisateur"}</span>
                            <span className="mx-2 text-gray-500">• {new Date(reply.createdAt).toLocaleString()}</span>
                            <div className="mt-1 text-gray-800 whitespace-pre-line">{reply.content}</div>
                            <button
                              className={`flex items-center gap-1 text-blue-600 font-semibold hover:underline disabled:opacity-50 mt-2`}
                              onClick={() => handleReplyLike(post._id, reply._id)}
                              disabled={!userId || (userId === (reply.author?._id || reply.author))}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              {reply.likes?.length || 0}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 mb-4">Aucune réponse pour l'instant.</div>
                    )}
                    {/* Reply Form */}
                    {userId && (
                      <form
                        onSubmit={e => { e.preventDefault(); handleReply(post._id); }}
                        className="flex flex-col gap-2"
                      >
                        <textarea
                          className="w-full border rounded px-3 py-2 text-sm"
                          rows={2}
                          placeholder="Votre réponse..."
                          value={replyContent[post._id] || ""}
                          onChange={e => setReplyContent(rc => ({ ...rc, [post._id]: e.target.value }))}
                          disabled={replySubmitting[post._id]}
                        />
                        <button
                          type="submit"
                          className="self-end bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm font-semibold disabled:opacity-50"
                          disabled={replySubmitting[post._id]}
                        >
                          {replySubmitting[post._id] ? "Publication..." : "Répondre"}
                        </button>
                      </form>
                    )}
                  </div>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
