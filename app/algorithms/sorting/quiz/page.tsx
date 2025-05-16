"use client";

import { useState, useEffect } from 'react';
import { quizQuestions, QuizQuestion } from '../quiz-data';
import { GitGraph, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);

  // Initialize quiz with 10 random questions
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setAnswers(new Array(10).fill(-1));
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      // Update answers
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = selectedOption;
      setAnswers(newAnswers);

      // Update score if correct
      if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }

      // Move to next question or show results
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }
  };

  const resetQuiz = () => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswers(new Array(10).fill(-1));
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
      </div>
      
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-black/50 backdrop-blur-xl shadow-lg" : ""
      )}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitGraph className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">AlgoViz</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/algorithms/sorting" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Sorting Visualizer
            </Link>
          </nav>
        </div>
      </header>

      <main className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto">
          {!showResult ? (
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-2xl font-bold">Sorting Algorithms Quiz</h1>
                  <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl mb-6">{questions[currentQuestionIndex].question}</h2>
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option, index) => (
                    <div 
                      key={index}
                      className={cn(
                        "p-4 rounded-lg border border-white/10 cursor-pointer transition-all",
                        selectedOption === index 
                          ? "bg-purple-500/20 border-purple-500" 
                          : "hover:bg-white/5"
                      )}
                      onClick={() => handleOptionSelect(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center",
                          selectedOption === index 
                            ? "border-purple-500" 
                            : "border-white/30"
                        )}>
                          {selectedOption === index && (
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-medium"
              >
                {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            </div>
          ) : (
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
                <p className="text-gray-400">You scored {score} out of {questions.length}</p>
                
                <div className="mt-6 mb-8 relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000"
                    style={{ width: `${(score / questions.length) * 100}%` }}
                  ></div>
                </div>
                
                {score === questions.length ? (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 mb-8">
                    <p className="font-medium">Perfect Score! Excellent job!</p>
                  </div>
                ) : score >= questions.length * 0.7 ? (
                  <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 mb-8">
                    <p className="font-medium">Great job! You have a solid understanding of sorting algorithms.</p>
                  </div>
                ) : score >= questions.length * 0.5 ? (
                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 mb-8">
                    <p className="font-medium">Good effort! You're on the right track.</p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 mb-8">
                    <p className="font-medium">Keep practicing! Sorting algorithms can be tricky.</p>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold mb-2">Review Your Answers</h2>
                {questions.map((question, index) => (
                  <div key={index} className="p-4 rounded-lg border border-white/10 bg-white/5">
                    <p className="font-medium mb-2">{index + 1}. {question.question}</p>
                    <div className="ml-4 space-y-1 text-sm">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className={cn(
                          "flex items-center",
                          optIndex === question.correctAnswer && "text-green-400",
                          answers[index] === optIndex && optIndex !== question.correctAnswer && "text-red-400"
                        )}>
                          <span className="mr-2">
                            {optIndex === question.correctAnswer && "✓"}
                            {answers[index] === optIndex && optIndex !== question.correctAnswer && "✗"}
                          </span>
                          <span>{option}</span>
                          {optIndex === question.correctAnswer && answers[index] !== optIndex && (
                            <span className="ml-2 text-green-400 text-xs">(Correct answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={resetQuiz}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-lg font-medium"
                >
                  Try Again
                </Button>
                <Link href="/algorithms/sorting" className="flex-1">
                  <Button 
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium"
                  >
                    Back to Sorting Visualizer
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
