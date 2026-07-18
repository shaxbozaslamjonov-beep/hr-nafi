"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitExam } from "@/app/dashboard/learning-actions";

type PublicQuestion = { q: string; options: string[] };

export function ExamForm({
  courseId,
  questions,
  passingScore,
}: {
  courseId: string;
  questions: PublicQuestion[];
  passingScore: number;
}) {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      const res = await submitExam(courseId, answers);
      if (res.error) {
        setError(res.error);
        return;
      }
      setResult({ score: res.score ?? 0, passed: (res.score ?? 0) >= passingScore });
    });
  }

  if (result) {
    return (
      <div className="card p-8 text-center">
        <p className="font-heading text-4xl font-bold">{result.score}%</p>
        {result.passed ? (
          <>
            <p className="mt-3 font-medium text-success">Tabriklaymiz, imtihondan o&apos;tdingiz!</p>
            <Link
              href="/dashboard/student/certificates"
              className="brand-gradient mt-4 inline-block rounded-lg px-4 py-2 text-sm font-semibold text-white"
            >
              Sertifikatni ko&apos;rish
            </Link>
          </>
        ) : (
          <p className="mt-3 text-sm text-ink-2">
            O&apos;tish balli: {passingScore}%. Darslarni qayta ko&apos;rib chiqib, qayta urinib ko&apos;ring.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="card p-5">
          <p className="font-medium">
            {qIndex + 1}. {question.q}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {question.options.map((option, oIndex) => (
              <label key={oIndex} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`q-${qIndex}`}
                  checked={answers[qIndex] === oIndex}
                  onChange={() =>
                    setAnswers((prev) => prev.map((a, i) => (i === qIndex ? oIndex : a)))
                  }
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}

      {error && <p className="text-sm text-danger">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || answers.includes(-1)}
        className="brand-gradient rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Yuborilmoqda..." : "Imtihonni yakunlash"}
      </button>
    </div>
  );
}
