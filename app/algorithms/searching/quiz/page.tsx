"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { GitGraph, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { searchQuizData } from '../quiz-data';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  // Select 10 random questions for the quiz
  const [questions, setQuestions] = useState(() => {
    const shuffled = [...searchQuizData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  });
  
  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setAnswers(newAnswers);
  };
  
  // Go to next question or show results
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      showResults();
    }
  };
  
  // Go to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  // Calculate score and show results
  const showResults = () => {
    let totalScore = 0;
    
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === questions[i].correctAnswer) {
        totalScore++;
      }
    }
    
    setScore(totalScore);
    setShowResult(true);
  };
  
  // Reset quiz
  const resetQuiz = () => {
    const shuffled = [...searchQuizData].sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 10));
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setScore(0);
  };
  
  // Track scroll position for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Get the current question
  const question = questions[currentQuestionIndex];
  
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
            <Link href="/algorithms/searching" className="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back to Search Visualizer
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
                  <h1 className="text-2xl font-bold">Search Algorithms Quiz</h1>
                  <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl mb-4">{question.question}</h2>
                <div className="space-y-3">
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex}
                      className={cn(
                        "p-4 rounded-lg border border-white/10 cursor-pointer transition-all",
                        answers[currentQuestionIndex] === optIndex 
                          ? "bg-purple-500/20 border-purple-500" 
                          : "bg-white/5 hover:bg-white/10"
                      )}
                      onClick={() => handleOptionSelect(optIndex)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white/10 hover:bg-white/20 flex-1"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={answers[currentQuestionIndex] === undefined}
                  className={cn(
                    "flex-1",
                    currentQuestionIndex === questions.length - 1
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                      : "bg-purple-600 hover:bg-purple-700"
                  )}
                >
                  {currentQuestionIndex === questions.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Quiz Results</h1>
                <div className="inline-block rounded-full bg-white/10 p-6 mb-4">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                    {score} / {questions.length}
                  </div>
                  <div className="text-gray-400">
                    {score === questions.length 
                      ? "Perfect! You're a search algorithm expert!" 
                      : score >= questions.length * 0.7 
                        ? "Great job! You know your search algorithms well!" 
                        : "Keep learning! You'll get better with practice!"}
                  </div>
                </div>
              </div>

              <div className="mb-8 space-y-6">
                <h2 className="text-xl font-semibold">Question Review</h2>
                {questions.map((question, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Question {index + 1}</span>
                      {answers[index] === question.correctAnswer ? (
                        <span className="text-green-400 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Correct
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          Incorrect
                        </span>
                      )}
                    </div>
                    <p className="mb-3">{question.question}</p>
                    <div className="space-y-2">
                      {question.options.map((option, optIndex) => (
                        <div 
                          key={optIndex}
                          className={cn(
                            "p-2 px-4 rounded border",
                            optIndex === question.correctAnswer 
                              ? "border-green-500 bg-green-500/10" 
                              : optIndex === answers[index] && optIndex !== question.correctAnswer
                                ? "border-red-500 bg-red-500/10" 
                                : "border-white/10 bg-white/5"
                          )}
                        >
                          <div className="flex justify-between">
                            <span>{option}</span>
                            {optIndex === question.correctAnswer && answers[index] !== optIndex && (
                              <span className="ml-2 text-green-400 text-xs">(Correct answer)</span>
                            )}
                          </div>
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
                <Link href="/algorithms/searching" className="flex-1">
                  <Button 
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium"
                  >
                    Back to Search Visualizer
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