export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What does KNN stand for?",
    options: ["K-Nearest Nodes", "K-Nearest Neighbors", "K-Neural Networks", "Knowledge Neural Networks"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "Which of the following is commonly used to calculate distance in KNN?",
    options: ["Manhattan distance", "Euclidean distance", "Hamming distance", "All of the above"],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "What happens when K is set to 1 in KNN?",
    options: ["The algorithm becomes more robust to noise", "The decision boundary becomes smoother", "The algorithm classifies based on the single nearest neighbor", "The algorithm becomes more biased"],
    correctAnswer: 2
  },
  {
    id: 4,
    question: "What is a disadvantage of KNN?",
    options: ["It's computationally expensive for large datasets", "It requires labeled data", "It can't handle categorical features", "It always overfits"],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "How does KNN handle imbalanced datasets?",
    options: ["Very well, it's immune to class imbalance", "Poorly, as majority classes dominate the neighborhood", "It automatically adjusts weights for minority classes", "It creates synthetic samples for minority classes"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "Which of the following is NOT a characteristic of KNN?",
    options: ["Instance-based learning", "Lazy learning algorithm", "Requires a training phase", "Non-parametric"],
    correctAnswer: 2
  },
  {
    id: 7,
    question: "What happens as K increases in KNN?",
    options: ["Decision boundary becomes more complex", "Decision boundary becomes smoother", "Training time increases significantly", "The algorithm becomes more accurate"],
    correctAnswer: 1
  },
  {
    id: 8,
    question: "Which preprocessing step is particularly important for KNN?",
    options: ["Feature selection", "Feature extraction", "Feature scaling", "All of the above"],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "In KNN, how are ties broken when there's an equal number of neighbors from different classes?",
    options: ["Random selection", "Choose the class with the nearest neighbor", "Choose the majority class in the dataset", "It depends on the implementation"],
    correctAnswer: 3
  },
  {
    id: 10,
    question: "Which of the following is true about KNN?",
    options: ["It works well with high-dimensional data", "It's robust to outliers", "It performs well with small training sets", "It requires minimal memory during prediction"],
    correctAnswer: 2
  }
];
