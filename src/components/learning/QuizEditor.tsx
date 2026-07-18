"use client";

import { useState, useTransition } from "react";
import { saveQuiz } from "@/app/dashboard/learning-actions";
import type { QuizQuestion } from "@/types/database";

const emptyQuestion: QuizQuestion = { q: "", options: ["", "", "", ""], answer_index: 0 };

export function QuizEditor({
  courseId,
  initialQuestions,
  initialPassingScore,
}: {
  courseId: string;
  initialQuestions: QuizQuestion[];
  initialPassingScore: number;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initialQuestions.length > 0 ? initialQuestions : [emptyQuestion]
  );
  const [passingScore, setPassingScore] = useState(initialPassingScore);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex: number, oIndex: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, j) => (j === oIndex ? value : o)) } : q
      )
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, { ...emptyQuestion, options: ["", "", "", ""] }]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await saveQuiz(courseId, questions, passingScore);
      setMessage(result.error ?? "Saqlandi!");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="card flex items-center gap-3 p-4">
        <label className="text-sm text-ink-2" htmlFor="passing_score">
          O&apos;tish balli (%)
        </label>
        <input
          id="passing_score"
          type="number"
          min={0}
          max={100}
          value={passingScore}
          onChange={(e) => setPassingScore(Number(e.target.value))}
          className="w-24 rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-ink focus:border-brand focus:outline-none"
        />
      </div>

      {questions.map((question, qIndex) => (
        <div key={qIndex} className="card flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-ink-2">Savol {qIndex + 1}</span>
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="text-xs text-danger hover:underline"
            >
              O&apos;chirish
            </button>
          </div>

          <input
            value={question.q}
            onChange={(e) => updateQuestion(qIndex, { q: e.target.value })}
            placeholder="Savol matni"
            className="w-full rounded-lg border border-line bg-bg-2 px-3 py-2 text-ink focus:border-brand focus:outline-none"
          />

          <div className="flex flex-col gap-2">
            {question.options.map((option, oIndex) => (
              <label key={oIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${qIndex}`}
                  checked={question.answer_index === oIndex}
                  onChange={() => updateQuestion(qIndex, { answer_index: oIndex })}
                />
                <input
                  value={option}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                  placeholder={`Variant ${oIndex + 1}`}
                  className="w-full rounded-lg border border-line bg-bg-2 px-3 py-1.5 text-sm text-ink focus:border-brand focus:outline-none"
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-card"
      >
        + Savol qo&apos;shish
      </button>

      {message && <p className="text-sm text-ink-2">{message}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="brand-gradient rounded-lg px-4 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {isPending ? "Saqlanmoqda..." : "Imtihonni saqlash"}
      </button>
    </div>
  );
}
