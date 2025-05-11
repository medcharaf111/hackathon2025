"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext"
import { translations } from "@/lib/i18n"
import React from "react";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions?: { _id: string }[];
  type?: string;
  level?: string;
}

export default function QuizListPage() {
  const { t } = useLanguage();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [scores, setScores] = useState<{ [quizId: string]: number | null }>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    level: "primaire",
    questions: [
      { question: "", options: ["", "", "", ""], answer: 0 },
    ],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    // Check login
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (userStr) setUser(JSON.parse(userStr));
    fetch("http://localhost:5000/api/quiz")
      .then((res) => res.json())
      .then((data) => {
        setQuizzes(data);
        // Fetch scores for each quiz if logged in
        if (userStr && token) {
          const userObj = JSON.parse(userStr);
          const userId = userObj.id || userObj._id;
          Promise.all(
            data.map((quiz: Quiz) =>
              fetch(`http://localhost:5000/api/quiz/${quiz._id}/score?userId=${userId}`)
                .then((res) => res.json())
                .then((scoreData) => ({ quizId: quiz._id, score: scoreData.score }))
            )
          ).then((scoresArr) => {
            const scoresObj: { [quizId: string]: number | null } = {};
            scoresArr.forEach(({ quizId, score }) => {
              scoresObj[quizId] = score;
            });
            setScores(scoresObj);
            setLoading(false);
          });
        } else {
          setLoading(false);
        }
      });
  }, [router]);

  if (loading) {
    return <main className="container mx-auto px-4 py-12"><div>{t("quiz_loading")}</div></main>;
  }

  // User role/level
  const isGuest = !user;
  const isProfessor = user && user.profession === "professor";
  const isStudent = user && user.profession === "student";
  const userLevel = user?.niveauEducation;

  // Level color map
  const levelColors: Record<string, string> = {
    primaire: "bg-blue-100 text-blue-800",
    secondaire: "bg-green-100 text-green-800",
    universitaire: "bg-orange-100 text-orange-800",
    all: "bg-gray-100 text-gray-600",
  };

  // Filter quizzes for guests
  const visibleQuizzes = isGuest
    ? quizzes.filter(q => q.type === "standard")
    : quizzes;

  // Handlers for modal form
  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }
  function handleQuestionChange(idx: number, field: string, value: any) {
    setForm(f => {
      const questions = [...f.questions];
      if (field === "options") {
        questions[idx].options = value;
      } else {
        (questions[idx] as any)[field] = value;
      }
      return { ...f, questions };
    });
  }
  function addQuestion() {
    setForm(f => ({ ...f, questions: [...f.questions, { question: "", options: ["", "", "", ""], answer: 0 }] }));
    setQuestionIndex(form.questions.length); // go to new question
  }
  function removeQuestion(idx: number) {
    setForm(f => {
      const newQuestions = f.questions.filter((_, i) => i !== idx);
      return { ...f, questions: newQuestions.length ? newQuestions : [{ question: "", options: ["", "", "", ""], answer: 0 }] };
    });
    setQuestionIndex(i => Math.max(0, i - (idx === i ? 1 : 0)));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch("http://localhost:5000/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user._id,
          title: form.title,
          description: form.description,
          level: form.level,
          questions: form.questions,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        setFormError(errData.message || "Erreur lors de la création du quiz");
        throw new Error(errData.message || "Erreur lors de la création du quiz");
      }
      setShowModal(false);
      setForm({ title: "", description: "", level: "primaire", questions: [{ question: "", options: ["", "", "", ""], answer: 0 }] });
      // Refresh quizzes
      const data = await fetch("http://localhost:5000/api/quiz").then(r => r.json());
      setQuizzes(data);
    } catch (err) {
      // error already set in setFormError
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteQuiz(quizId: string) {
    if (!window.confirm("Voulez-vous vraiment supprimer ce quiz ?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/quiz/${quizId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || user._id }),
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.message || "Erreur lors de la suppression du quiz");
        return;
      }
      // Refresh quizzes
      const data = await fetch("http://localhost:5000/api/quiz").then(r => r.json());
      setQuizzes(data);
    } catch (err) {
      alert("Erreur lors de la suppression du quiz");
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t("quiz_title")}</h1>
      {isProfessor && (
        <div className="mb-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold" onClick={() => setShowModal(true)}>
            + Ajouter un quiz
          </button>
        </div>
      )}
      {/* Modal for quiz creation */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-2">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Créer un nouveau quiz</h2>
            {formError && <div className="mb-4 text-red-600 font-semibold">{formError}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Titre</label>
                <input name="title" value={form.title} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Niveau</label>
                <select name="level" value={form.level} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required>
                  <option value="primaire">Primaire</option>
                  <option value="secondaire">Secondaire</option>
                  <option value="universitaire">Universitaire</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Questions</label>
                <div className="space-y-4">
                  <div className="border rounded p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Question {questionIndex + 1} / {form.questions.length}</span>
                      {form.questions.length > 1 && (
                        <button type="button" className="text-red-500" onClick={() => removeQuestion(questionIndex)}>Supprimer</button>
                      )}
                    </div>
                    <input
                      className="w-full border rounded px-2 py-1 mb-2"
                      placeholder="Intitulé de la question"
                      value={form.questions[questionIndex].question}
                      onChange={e => handleQuestionChange(questionIndex, "question", e.target.value)}
                      required
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {form.questions[questionIndex].options.map((opt, oIdx) => (
                        <input
                          key={oIdx}
                          className="border rounded px-2 py-1"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={e => {
                            const newOpts = [...form.questions[questionIndex].options];
                            newOpts[oIdx] = e.target.value;
                            handleQuestionChange(questionIndex, "options", newOpts);
                          }}
                          required
                        />
                      ))}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Bonne réponse</label>
                      <select
                        value={form.questions[questionIndex].answer}
                        onChange={e => handleQuestionChange(questionIndex, "answer", Number(e.target.value))}
                        className="border rounded px-2 py-1"
                      >
                        {form.questions[questionIndex].options.map((opt, oIdx) => (
                          <option key={oIdx} value={oIdx}>{opt ? opt : `Option ${oIdx + 1}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-between mt-4">
                      <button type="button" className="px-3 py-1 rounded bg-gray-200" disabled={questionIndex === 0} onClick={() => setQuestionIndex(i => Math.max(0, i - 1))}>Précédent</button>
                      <button type="button" className="px-3 py-1 rounded bg-gray-200" disabled={questionIndex === form.questions.length - 1} onClick={() => setQuestionIndex(i => Math.min(form.questions.length - 1, i + 1))}>Suivant</button>
                    </div>
                  </div>
                  <button type="button" className="bg-green-600 text-white px-3 py-1 rounded mt-2" onClick={addQuestion}>Ajouter une question</button>
                </div>
              </div>
              <div className="flex justify-between">
                <button type="button" className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 font-semibold" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold" disabled={submitting}>
                  {submitting ? "Création..." : "Créer le quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleQuizzes.map((quiz) => {
          const isStandard = quiz.type === "standard";
          const isCustom = quiz.type === "custom";
          // Standard quizzes: always accessible
          let canAccess = true;
          if (isCustom) {
            canAccess = isProfessor || (isStudent && quiz.level === userLevel);
          }
          return (
            <div key={quiz._id} className="flex flex-col h-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow mb-4">
              {isStandard && (
                <div className="text-xs text-gray-500 mb-1">Quizz standards</div>
              )}
              {isCustom && quiz.level && (
                <div className={`text-xs mb-1 inline-block px-2 py-0.5 rounded ${levelColors[quiz.level] || "bg-gray-100 text-gray-600"}`}>
                  {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
                </div>
              )}
              <Link
                href={canAccess ? `/quiz/${quiz._id}` : "#"}
                className={`flex-1 flex flex-col ${!canAccess && isCustom ? "opacity-60 pointer-events-none" : ""}`}
                tabIndex={canAccess ? 0 : -1}
                aria-disabled={!canAccess}
              >
                <h2 className="text-xl font-bold mb-2">{quiz.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">{quiz.description}</p>
                {scores[quiz._id] !== undefined && scores[quiz._id] !== null && (
                  <div className="mt-2 text-blue-700 font-semibold">{t("quiz_your_score")} : {scores[quiz._id]}</div>
                )}
                {!canAccess && isCustom && (
                  <div className="mt-2 text-red-500 font-semibold text-sm">Accès réservé à un autre niveau</div>
                )}
              </Link>
              {isProfessor && (
                <div className="flex justify-end mt-4">
                  <button
                    className="text-red-600 hover:underline text-sm font-semibold"
                    onClick={() => handleDeleteQuiz(quiz._id)}
                  >
                    Supprimer ce quiz
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
} 