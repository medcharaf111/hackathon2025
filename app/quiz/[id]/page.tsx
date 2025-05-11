"use client";
import { useEffect, useState } from "react";
import StarRating from "@/components/ui/StarRating";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: { question: string; options: string[]; answer: number }[];
  averageRating: number;
}

export default function QuizDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:5000/api/quiz/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setQuiz(data);
        setUserAnswers(Array(data.questions.length).fill(-1));
        setLoading(false);
      });
  }, [id]);

  if (loading || !quiz) return <div className="container mx-auto px-4 py-12">Chargement...</div>;

  const handleAnswer = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleRate = async (rating: number) => {
    setUserRating(rating);
    setRatingSubmitting(true);
    await fetch(`http://localhost:5000/api/quiz/${quiz._id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    setRatingSubmitting(false);
    setRatingSubmitted(true);
    // Optionally refresh quiz data for new average
    fetch(`http://localhost:5000/api/quiz/${quiz._id}`)
      .then((res) => res.json())
      .then((data) => setQuiz(data));
  };

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <Link href="/quiz" className="inline-block mb-4 text-blue-600 hover:underline font-semibold">← Retour à la liste des quiz</Link>
      <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
      <p className="mb-6 text-gray-700">{quiz.description}</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        {quiz.questions.map((q, qIdx) => (
          <div key={qIdx} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="font-semibold mb-2">{q.question}</div>
            <div className="flex flex-col gap-2">
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q${qIdx}`}
                    checked={userAnswers[qIdx] === optIdx}
                    onChange={() => handleAnswer(qIdx, optIdx)}
                    disabled={showResults}
                  />
                  <span>{opt}</span>
                  {showResults && q.answer === optIdx && (
                    <span className="ml-2 text-green-600 font-bold">(Bonne réponse)</span>
                  )}
                  {showResults && userAnswers[qIdx] === optIdx && userAnswers[qIdx] !== q.answer && (
                    <span className="ml-2 text-red-600 font-bold">(Votre réponse)</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
        {!showResults && (
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">
            Soumettre mes réponses
          </button>
        )}
        {showResults && (
          <div className="text-xl font-semibold text-blue-700 mt-4">
            Score : {userAnswers.filter((a, i) => a === quiz.questions[i].answer).length} / {quiz.questions.length}
          </div>
        )}
      </form>
      <div className="mt-10">
        <h2 className="text-lg font-bold mb-2">Notez ce quiz :</h2>
        <StarRating value={userRating || 0} onChange={handleRate} readOnly={ratingSubmitting || ratingSubmitted} size={32} />
        {ratingSubmitted && <div className="text-green-600 mt-2">Merci pour votre note !</div>}
      </div>
    </main>
  );
} 