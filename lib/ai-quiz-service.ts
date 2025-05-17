/**
 * AI Quiz Service - Handles fetching questions from the AI bot
 */
import { getAIQuizBotUrl, AI_QUIZ_BOT } from '@/lib/config';

// Mock data to use as fallback when API is unavailable
const MOCK_QUESTIONS = {
  'sorting': [
    {
      question: "What is the time complexity of Bubble Sort in the worst case?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correctAnswerIndex: 1
    },
    {
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
      correctAnswerIndex: 2
    },
    {
      question: "What is the space complexity of Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswerIndex: 2
    },
    {
      question: "Which sorting algorithm is stable by nature?",
      options: ["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"],
      correctAnswerIndex: 2
    },
    {
      question: "What is the worst-case time complexity of Quick Sort?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correctAnswerIndex: 1
    }
  ],
  'knn': [
    {
      question: "What does KNN stand for?",
      options: ["K-Nearest Neighbors", "Kernel Neural Network", "K-Nearest Nodes", "Knowledge Neural Network"],
      correctAnswerIndex: 0
    },
    {
      question: "Which of the following is NOT a common distance metric used in KNN?",
      options: ["Euclidean distance", "Manhattan distance", "Logarithmic distance", "Minkowski distance"],
      correctAnswerIndex: 2
    },
    {
      question: "What happens when K=1 in KNN classification?",
      options: ["The algorithm becomes equivalent to linear regression", "The algorithm assigns the class of the nearest neighbor", "The algorithm always predicts the majority class", "The algorithm cannot make predictions"],
      correctAnswerIndex: 1
    },
    {
      question: "KNN is an example of what type of learning?",
      options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Semi-supervised learning"],
      correctAnswerIndex: 0
    },
    {
      question: "What is a disadvantage of KNN?",
      options: ["It's too complex to implement", "It requires labeled data", "It's computationally expensive for large datasets", "It cannot handle classification tasks"],
      correctAnswerIndex: 2
    }
  ],
  'naive-bayes': [
    {
      question: "What assumption does Naive Bayes make about features?",
      options: ["Features are dependent on each other", "Features are independent of each other", "Features must be normally distributed", "Features must be categorical"],
      correctAnswerIndex: 1
    },
    {
      question: "Naive Bayes is based on which theorem?",
      options: ["Pythagorean Theorem", "Central Limit Theorem", "Bayes' Theorem", "Binomial Theorem"],
      correctAnswerIndex: 2
    },
    {
      question: "Which of the following is NOT a type of Naive Bayes classifier?",
      options: ["Gaussian Naive Bayes", "Multinomial Naive Bayes", "Bernoulli Naive Bayes", "Logarithmic Naive Bayes"],
      correctAnswerIndex: 3
    },
    {
      question: "Naive Bayes is commonly used for which application?",
      options: ["Image recognition", "Text classification", "Reinforcement learning", "Neural networks"],
      correctAnswerIndex: 1
    },
    {
      question: "What happens when a probability of zero is encountered in Naive Bayes?",
      options: ["The algorithm crashes", "The entire prediction becomes zero", "Laplace smoothing is applied", "The feature is ignored"],
      correctAnswerIndex: 2
    }
  ],
  'default': [
    {
      question: "What is an algorithm?",
      options: ["A programming language", "A step-by-step procedure for solving a problem", "A type of computer hardware", "A mathematical equation"],
      correctAnswerIndex: 1
    },
    {
      question: "Which data structure uses LIFO (Last In, First Out)?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswerIndex: 1
    },
    {
      question: "What is the time complexity of binary search?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
      correctAnswerIndex: 2
    },
    {
      question: "Which of these is NOT a sorting algorithm?",
      options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Binary Sort"],
      correctAnswerIndex: 3
    },
    {
      question: "What does AI stand for?",
      options: ["Automated Intelligence", "Artificial Intelligence", "Advanced Integration", "Algorithmic Interface"],
      correctAnswerIndex: 1
    }
  ]
};

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer in options array
}

export interface QuizResponse {
  questions: QuizQuestion[];
  success: boolean;
  message?: string;
}

/**
 * Fetches quiz questions from the AI bot based on topic and difficulty
 * @param topic - The algorithm topic (e.g., "sorting", "knn", "naive-bayes")
 * @param currentScore - Value between 0 and 1 indicating difficulty level
 * @returns Promise with quiz questions
 */
export async function fetchAIQuizQuestions(
  topic: string,
  currentScore: number
): Promise<QuizResponse> {
  // Ensure currentScore is between 0 and 1
  const normalizedScore = Math.max(0, Math.min(1, currentScore));
  
  try {
    // Make a direct POST request to the external API
    const apiUrl = 'https://7100-34-125-133-151.ngrok-free.app/quiz';
    
    console.log(`Making direct POST request to: ${apiUrl}`);
    console.log(`Request payload:`, { topic, current_score: normalizedScore });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        topic,
        current_score: normalizedScore
      })
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Expected JSON response but got ${contentType}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data));
    
    // Handle different possible response formats
    let questions = [];
    
    if (data.questions && Array.isArray(data.questions)) {
      // Standard format with questions array
      questions = data.questions;
    } else if (data.data && Array.isArray(data.data)) {
      // Alternative format with data array
      questions = data.data;
    } else if (Array.isArray(data)) {
      // Direct array format
      questions = data;
    } else {
      console.error('Unexpected API response format:', data);
      throw new Error('Invalid response format from API');
    }
    
    if (questions.length === 0) {
      throw new Error('No questions returned from API');
    }
    
    // Process and format the questions from the API response
    const processedQuestions = questions.map((q: any, index: number) => {
      // Extract the actual question from the formatted text
      let questionText = q.question || q.text || `Question ${index + 1}`;
      let options: string[] = [];
      let correctAnswerIndex = 0;
      
      // The API returns the question in a format like:
      // "Here is a medium-level MCQ about machine learning...\n\nQuestion: What is...?\n\nOptions:\nA) Option 1\nB) Option 2..."
      
      // First, try to extract the actual question part
      let extractedQuestion = "";
      let extractedOptions: string[] = [];
      
      // Check if the full text contains both Question and Options sections
      if (questionText.includes('Question:') && questionText.includes('Options:')) {
        // Split the text into sections
        const sections = questionText.split('Options:');
        const questionSection = sections[0];
        const optionsSection = sections[1];
        
        // Extract the actual question
        const questionMatch = questionSection.match(/Question:\s*(.+?)(?=\n|$)/i);
        if (questionMatch && questionMatch[1]) {
          extractedQuestion = questionMatch[1].trim();
        }
        
        // Extract the options
        const optionsMatch = optionsSection.match(/[A-D]\)\s*([^\n]+)/g);
        if (optionsMatch) {
          extractedOptions = optionsMatch.map((opt: string) => opt.replace(/^[A-D]\)\s*/, '').trim());
        }
      }
      
      // Use the extracted question and options if available
      if (extractedQuestion && extractedOptions.length > 0) {
        questionText = extractedQuestion;
        options = extractedOptions;
      }
      // If options are already provided as an array, use them
      else if (q.options && Array.isArray(q.options) && q.options.length > 0) {
        options = q.options;
      }
      
      // Log for debugging
      console.log('Processed question:', questionText);
      console.log('Processed options:', options);
      
      // Parse the correct answer
      if (q.answer) {
        const answerText = q.answer.toString().trim();
        
        // Handle different answer formats
        if (answerText.match(/^[A-D]\)/i)) {
          // Format: "A)" or "A) ANSWER TEXT"
          const answerLetter = answerText.charAt(0).toUpperCase();
          correctAnswerIndex = answerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        } else if (answerText.match(/^[A-D]$/i)) {
          // Format: "A"
          const answerLetter = answerText.charAt(0).toUpperCase();
          correctAnswerIndex = answerLetter.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
        } else if (typeof q.correctAnswerIndex === 'number') {
          correctAnswerIndex = q.correctAnswerIndex;
        }
      }
      
      return {
        id: index + 1,
        question: questionText,
        options: options,
        correctAnswer: correctAnswerIndex
      };
    });
    
    return {
      success: true,
      questions: processedQuestions
    };
  } catch (error) {
    console.error("Error fetching AI quiz questions:", error);
    // Rethrow the error to be handled by the component
    throw error;
  }
}
