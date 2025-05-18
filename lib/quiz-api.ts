/**
 * API service for interacting with the AI quiz bot
 */

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
// Mock data for different topics
const mockQuestions: Record<string, any[]> = {
  'machine-learning': [
    {
      question: "What is the term used to describe a dataset that contains attribute values as well as class labels for each instance?",
      options: ["Training set", "Testing set", "Validation set", "Instance set"],
      correctAnswerIndex: 0
    },
    {
      question: "What is a Support Vector Machine (SVM)?",
      options: [
        "A type of deep learning model that uses neural networks",
        "A supervised machine learning algorithm that finds a hyperplane with the maximum margin",
        "An unsupervised machine learning algorithm that groups similar data points",
        "A type of reinforcement learning model that makes decisions based on rewards and penalties"
      ],
      correctAnswerIndex: 1
    },
    {
      question: "What is the systematic approach for learning a classification model given a training set known as?",
      options: ["Classification algorithm", "Learning algorithm", "Feature representation", "Induction process"],
      correctAnswerIndex: 1
    },
    {
      question: "What is a training set in the context of machine learning?",
      options: [
        "A set of pre-trained models used for predicting outcomes",
        "A dataset containing attribute values and class labels for each instance",
        "A type of machine learning algorithm used for classification tasks",
        "A method for evaluating the performance of a machine learning model"
      ],
      correctAnswerIndex: 1
    },
    {
      question: "What is the process of using a learning algorithm to build a classification model from the training data also known as?",
      options: ["Feature extraction", "Induction", "Hypothesis testing", "Model optimization"],
      correctAnswerIndex: 1
    }
  ],
  'sorting': [
    {
      question: "What is the time complexity of QuickSort in the average case?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
      correctAnswerIndex: 1
    },
    {
      question: "Which sorting algorithm is known for its stability?",
      options: ["QuickSort", "Bubble Sort", "Merge Sort", "Heap Sort"],
      correctAnswerIndex: 2
    },
    {
      question: "What is the space complexity of Merge Sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswerIndex: 2
    }
  ],
  'knn': [
    {
      question: "What does KNN stand for?",
      options: ["K-Nearest Networks", "K-Nearest Neighbors", "K-Nearest Nodes", "K-Neural Networks"],
      correctAnswerIndex: 1
    },
    {
      question: "What is the primary parameter in KNN that affects the algorithm's performance?",
      options: ["The value of K", "The distance metric", "The dataset size", "The number of features"],
      correctAnswerIndex: 0
    },
    {
      question: "Which distance metric is commonly used in KNN?",
      options: ["Manhattan distance", "Euclidean distance", "Hamming distance", "All of the above"],
      correctAnswerIndex: 3
    }
  ],
  'default': [
    {
      question: "What is an algorithm?",
      options: [
        "A programming language", 
        "A step-by-step procedure for solving a problem", 
        "A type of computer hardware", 
        "A database management system"
      ],
      correctAnswerIndex: 1
    },
    {
      question: "What does CPU stand for?",
      options: [
        "Central Processing Unit", 
        "Computer Personal Unit", 
        "Central Program Utility", 
        "Central Processor Underneath"
      ],
      correctAnswerIndex: 0
    },
    {
      question: "Which data structure follows the Last In First Out (LIFO) principle?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswerIndex: 1
    }
  ]
};

// Helper function to get mock questions for a topic
function getMockQuestions(topic: string): any[] {
  // Normalize the topic name for lookup
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Try to find an exact match
  if (mockQuestions[normalizedTopic]) {
    return mockQuestions[normalizedTopic];
  }
  
  // Try to find a partial match
  for (const key of Object.keys(mockQuestions)) {
    if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
      return mockQuestions[key];
    }
  }
  
  // Return default questions if no match found
  return mockQuestions['default'];
}

export async function fetchAIQuizQuestions(
  topic: string,
  currentScore: number
): Promise<QuizResponse> {
  try {
    // Ensure currentScore is between 0 and 1
    const normalizedScore = Math.max(0, Math.min(1, currentScore));
    
    // The public URI of the AI bot
    const apiUrl = `https://ae6d-35-223-227-18.ngrok-free.app/quiz`;
    
    // First try with POST and JSON body
    try {
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
      
      if (response.ok) {
        const data = await response.json();
        
        // Format the response to match our QuizQuestion interface
        return {
          success: true,
          questions: data.questions.map((q: any, index: number) => ({
            id: index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswerIndex
          }))
        };
      }
    } catch (postError) {
      console.warn("POST request failed, trying GET as fallback", postError);
    }
    
    // If POST fails, try with GET and query parameters
    try {
      const getUrl = `${apiUrl}?topic=${encodeURIComponent(topic)}&current_score=${normalizedScore}`;
      const response = await fetch(getUrl);
      
      if (response.ok) {
        const data = await response.json();
        
        // Format the response to match our QuizQuestion interface
        return {
          success: true,
          questions: data.questions.map((q: any, index: number) => ({
            id: index + 1,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswerIndex
          }))
        };
      }
    } catch (getError) {
      console.warn("GET request also failed", getError);
    }
    
    // If both API calls fail, use mock data
    console.log("Using mock data for topic:", topic);
    const mockData = getMockQuestions(topic);
    
    return {
      success: true,
      message: "Using mock data due to API unavailability",
      questions: mockData.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswerIndex
      }))
    };
    
  } catch (error) {
    console.error("Error fetching AI quiz questions:", error);
    
    // Final fallback to mock data
    const mockData = getMockQuestions(topic);
    
    return {
      success: true,
      message: "Using mock data due to error: " + (error instanceof Error ? error.message : "Unknown error"),
      questions: mockData.map((q, index) => ({
        id: index + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswerIndex
      }))
    };
  }
}
