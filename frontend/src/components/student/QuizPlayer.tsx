'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';

interface QuizPlayerProps {
    quiz: any;
    onComplete: (score: number) => void;
}

export function QuizPlayer({ quiz, onComplete }: QuizPlayerProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
    const [answers, setAnswers] = useState<number[][]>([]);
    const [showResults, setShowResults] = useState(false);

    // Safety check for questions format
    const questions = Array.isArray(quiz.questions) ? quiz.questions : [];

    if (questions.length === 0) {
        return <div className="text-center p-8">No questions in this quiz.</div>;
    }

    const handleNext = () => {
        if (selectedOptions.length > 0) {
            const newAnswers = [...answers];
            newAnswers[currentQuestionIndex] = selectedOptions;
            setAnswers(newAnswers);

            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                setSelectedOptions([]);
            } else {
                finishQuiz(newAnswers);
            }
        }
    };

    const finishQuiz = (finalAnswers: number[][]) => {
        let score = 0;
        finalAnswers.forEach((ans, idx) => {
            const correct = questions[idx].correctAnswers !== undefined ? questions[idx].correctAnswers : [questions[idx].correctAnswer];
            if (JSON.stringify([...ans].sort()) === JSON.stringify([...correct].sort())) {
                score++;
            }
        });
        const percentage = Math.round((score / questions.length) * 100);
        setShowResults(true);
        onComplete(percentage);
    };

    if (showResults) {
        const score = answers.reduce((acc, ans, idx) => {
            const correct = questions[idx].correctAnswers !== undefined ? questions[idx].correctAnswers : [questions[idx].correctAnswer];
            return acc + (JSON.stringify([...ans].sort()) === JSON.stringify([...correct].sort()) ? 1 : 0);
        }, 0);
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-lg mx-auto text-center border border-slate-200 dark:border-slate-700 shadow-xl"
            >
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-slate-500 mb-6">You scored {percentage}% ({score}/{questions.length})</p>

                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-4 mb-8 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <button
                    onClick={() => window.location.reload()} // Simple reload to restart or specific logic
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Retake Quiz
                </button>
            </motion.div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="max-w-2xl mx-auto py-10">
            <div className="mb-8 flex items-center justify-between text-sm text-slate-500">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestionIndex) / questions.length) * 100)}% Progress</span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mb-10 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                    className="h-full bg-blue-600 rounded-full"
                />
            </div>

            <motion.div
                key={currentQuestionIndex}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <h2 className="text-2xl font-bold mb-8 leading-relaxed">
                    {currentQuestion.text}
                </h2>

                <div className="space-y-4">
                    {currentQuestion.options.map((option: string, idx: number) => {
                        const isSelected = selectedOptions.includes(idx);
                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (isSelected) {
                                        setSelectedOptions(selectedOptions.filter((o) => o !== idx));
                                    } else {
                                        setSelectedOptions([...selectedOptions, idx]);
                                    }
                                }}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between group ${isSelected
                                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-600'
                                    }`}
                            >
                                <span className={`font-medium ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {option}
                                </span>
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                                    }`}>
                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                                </div>
                            </button>
                        )
                    })}
                </div>

                <div className="mt-10 flex justify-end">
                    <button
                        onClick={handleNext}
                        disabled={selectedOptions.length === 0}
                        className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                    >
                        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        <ArrowRight size={20} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
