export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What is the 'naive' assumption in Naive Bayes?",
    options: ["The data follows a normal distribution", "Features are conditionally independent given the class", "The prior probabilities are equal", "The algorithm is simple to implement"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is NOT a common variant of Naive Bayes?",
    options: ["Gaussian Naive Bayes", "Multinomial Naive Bayes", "Bernoulli Naive Bayes", "Logarithmic Naive Bayes"],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "What theorem forms the foundation of Naive Bayes classifiers?",
    options: ["Bayes' Theorem", "Central Limit Theorem", "Law of Large Numbers", "Maximum Likelihood Theorem"],
    correctAnswer: 0
  },
  {
    id: 4,
    question: "Which of the following applications is Naive Bayes commonly used for?",
    options: ["Image recognition", "Spam filtering", "Regression problems", "Reinforcement learning"],
    correctAnswer: 1
  },
  {
    id: 5,
    question: "What happens when a feature value in the test data was never observed in the training data?",
    options: ["The algorithm crashes", "The probability becomes zero (zero probability problem)", "The feature is ignored", "The mean value is used"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "What technique is commonly used to solve the zero probability problem in Naive Bayes?",
    options: ["Feature scaling", "Laplace smoothing", "Gradient boosting", "Cross-validation"],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Which of the following is an advantage of Naive Bayes?",
    options: ["It works well with small training datasets", "It handles complex non-linear relationships", "It's not affected by irrelevant features", "It doesn't require hyperparameter tuning"],
    correctAnswer: 0
  },
  {
    id: 8,
    question: "In Gaussian Naive Bayes, what is assumed about the distribution of features?",
    options: ["Features follow a uniform distribution", "Features follow a normal distribution", "Features follow a Bernoulli distribution", "Features follow a multinomial distribution"],
    correctAnswer: 1
  },
  {
    id: 9,
    question: "What is the time complexity of training a Naive Bayes classifier?",
    options: ["O(n²)", "O(n log n)", "O(n)", "O(2ⁿ)"],
    correctAnswer: 2
  },
  {
    id: 10,
    question: "Which of the following statements about Naive Bayes is FALSE?",
    options: ["It can handle high-dimensional data efficiently", "It's resistant to overfitting", "It always outperforms more complex models", "It's particularly effective for text classification"],
    correctAnswer: 2
  }
];
