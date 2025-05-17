"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchAIQuizQuestions, QuizQuestion } from '@/lib/ai-quiz-service';

// Import layout components
import { Header } from "@/components/header";
import { AppSidebar } from "@/components/app-sidebar";
import { ContentWrapper } from "@/components/content-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function CustomQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL
  const topic = searchParams?.get('topic') || '';
  const difficulty = searchParams?.get('difficulty') || 'medium';
  const currentScore = parseFloat(searchParams?.get('current_score') || '0.5');
  
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch questions from AI bot
  const fetchQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetchAIQuizQuestions(topic, currentScore);
      
      if (response.success && response.questions.length > 0) {
        setQuestions(response.questions);
        setAnswers(new Array(response.questions.length).fill(-1));
        setIsLoading(false);
      } else {
        setError(response.message || "Failed to load questions. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Initialize quiz
  useEffect(() => {
    fetchQuestions();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [topic, currentScore]);

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
    // Calculate new difficulty level based on performance
    const newScore = score / questions.length;
    
    // Reset quiz state
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
    
    // Redirect to the quiz page with the new difficulty
    router.push(`/quiz/custom?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&current_score=${newScore}`);
  };

  const getDifficultyText = () => {
    if (currentScore <= 0.3) return "Easy";
    if (currentScore >= 0.7) return "Hard";
    return "Medium";
  };

  if (isLoading) {
    return (
      <SidebarProvider defaultOpen={true}>
        <Header />
        <AppSidebar />
        <ContentWrapper>
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xl">Loading AI-powered quiz for "{topic}"...</p>
              <p className="text-gray-400 mt-2">Difficulty: {getDifficultyText()}</p>
            </div>
          </div>
        </ContentWrapper>
      </SidebarProvider>
    );
  }

  if (error) {
    return (
      <SidebarProvider defaultOpen={true}>
        <Header />
        <AppSidebar />
        <ContentWrapper>
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center max-w-md backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-4">Error Loading Quiz</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={fetchQuestions}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  Try Again
                </Button>
                <Link href="/quiz">
                  <Button 
                    className="bg-white/10 hover:bg-white/20"
                  >
                    Back to Quiz Selection
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ContentWrapper>
      </SidebarProvider>
    );
  }

  if (questions.length === 0) {
    return (
      <SidebarProvider defaultOpen={true}>
        <Header />
        <AppSidebar />
        <ContentWrapper>
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl">No questions available. Please try again later.</p>
              <Link href="/quiz" className="mt-4 inline-block">
                <Button>
                  Back to Quiz Selection
                </Button>
              </Link>
            </div>
          </div>
        </ContentWrapper>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Header />
      <AppSidebar />
      <ContentWrapper>
        <div className="min-h-screen bg-black text-white">
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-3xl -top-250 -right-250 animate-pulse" />
            <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl -bottom-250 -left-250 animate-pulse delay-1000" />
          </div>
          
          <main className="pt-32 pb-20 px-4">
            <div className="max-w-3xl mx-auto">
              {!showResult ? (
                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-8">
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h1 className="text-2xl font-bold">{topic} Quiz</h1>
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
                        <p className="font-medium">Great job! You have a solid understanding of {topic}.</p>
                      </div>
                    ) : score >= questions.length * 0.5 ? (
                      <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 mb-8">
                        <p className="font-medium">Good effort! You're on the right track.</p>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 mb-8">
                        <p className="font-medium">Keep practicing! {topic} concepts can be tricky.</p>
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
                    <Link href="/quiz" className="flex-1">
                      <Button 
                        className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-medium"
                      >
                        Back to Quiz Selection
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </ContentWrapper>
    </SidebarProvider>
  );
}
