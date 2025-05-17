export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "What type of problems is logistic regression primarily used for?",
    options: ["Regression problems", "Classification problems", "Clustering problems", "Dimensionality reduction"],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "What function is used to transform the linear combination of features in logistic regression?",
    options: ["ReLU function", "Tanh function", "Sigmoid function", "Identity function"],
    correctAnswer: 2
  },
  {
    id: 3,
    question: "What is the output range of the sigmoid function used in logistic regression?",
    options: ["[-1, 1]", "[0, 1]", "[-∞, +∞]", "[0, +∞]"],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "Which of the following is NOT an assumption of logistic regression?",
    options: ["Independence of observations", "Linear relationship between features and log-odds", "No multicollinearity", "Normal distribution of errors"],
    correctAnswer: 3
  },
  {
    id: 5,
    question: "What loss function is commonly used in logistic regression?",
    options: ["Mean squared error", "Cross-entropy loss", "Hinge loss", "Huber loss"],
    correctAnswer: 1
  },
  {
    id: 6,
    question: "What does the decision boundary represent in logistic regression?",
    options: ["The boundary where the model is uncertain", "The line where the probability equals 0.5", "The region where the model performs best", "The area with the highest data density"],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "Which optimization algorithm is commonly used to train logistic regression models?",
    options: ["K-means", "Principal Component Analysis", "Gradient Descent", "Random Forest"],
    correctAnswer: 2
  },
  {
    id: 8,
    question: "What happens if you apply logistic regression to a multi-class classification problem without any modifications?",
    options: ["It works perfectly fine", "It only predicts the majority class", "It can only distinguish between two classes", "It automatically implements one-vs-rest strategy"],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "What is regularization in the context of logistic regression?",
    options: ["A technique to make the model more complex", "A method to reduce overfitting", "A way to speed up training", "A process to normalize input features"],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "Which of the following statements about logistic regression is true?",
    options: ["It can model non-linear decision boundaries directly", "It assumes features are normally distributed", "It outputs probabilities rather than direct classifications", "It requires a large number of parameters"],
    correctAnswer: 2
  }
];
