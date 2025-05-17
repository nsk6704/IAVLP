/**
 * Learning Path Service - Handles fetching learning paths from the AI bot
 */

// Define the structure of a learning path step
export interface LearningPathStep {
  id: number;
  title: string;
  description: string;
  resources: string[];
  estimatedTimeMinutes: number;
}

// Define the structure of a learning path response
export interface LearningPathResponse {
  success: boolean;
  message?: string;
  steps: LearningPathStep[];
  topic: string;
}

// Define the structure of an image response
export interface LearningPathImageResponse {
  isImage: true;
  imageUrl: string;
  topic: string;
}

// Mock data for different topics
const mockLearningPaths: Record<string, LearningPathStep[]> = {
  'machine-learning': [
    {
      id: 1,
      title: "Introduction to Machine Learning",
      description: "Learn the fundamental concepts of machine learning, including supervised and unsupervised learning.",
      resources: [
        "https://www.coursera.org/learn/machine-learning",
        "https://www.youtube.com/watch?v=mbyG85GZ0PI"
      ],
      estimatedTimeMinutes: 60
    },
    {
      id: 2,
      title: "Data Preprocessing",
      description: "Understand how to clean, normalize, and prepare data for machine learning models.",
      resources: [
        "https://scikit-learn.org/stable/modules/preprocessing.html",
        "https://towardsdatascience.com/data-preprocessing-concepts-fa946d11c825"
      ],
      estimatedTimeMinutes: 90
    },
    {
      id: 3,
      title: "Supervised Learning Algorithms",
      description: "Explore common supervised learning algorithms like linear regression, logistic regression, and decision trees.",
      resources: [
        "https://www.analyticsvidhya.com/blog/2017/09/common-machine-learning-algorithms/",
        "https://machinelearningmastery.com/a-tour-of-machine-learning-algorithms/"
      ],
      estimatedTimeMinutes: 120
    },
    {
      id: 4,
      title: "Model Evaluation",
      description: "Learn techniques to evaluate and improve machine learning models.",
      resources: [
        "https://scikit-learn.org/stable/modules/model_evaluation.html",
        "https://towardsdatascience.com/metrics-to-evaluate-your-machine-learning-algorithm-f10ba6e38234"
      ],
      estimatedTimeMinutes: 90
    },
    {
      id: 5,
      title: "Practical Project",
      description: "Apply your knowledge by building a simple classification model on a real-world dataset.",
      resources: [
        "https://www.kaggle.com/datasets",
        "https://github.com/awesomedata/awesome-public-datasets"
      ],
      estimatedTimeMinutes: 180
    }
  ],
  'deep-learning': [
    {
      id: 1,
      title: "Neural Networks Fundamentals",
      description: "Understand the basic structure and mathematics behind neural networks.",
      resources: [
        "https://www.deeplearningbook.org/",
        "https://www.youtube.com/watch?v=aircAruvnKk"
      ],
      estimatedTimeMinutes: 120
    },
    {
      id: 2,
      title: "Introduction to TensorFlow/PyTorch",
      description: "Get familiar with popular deep learning frameworks.",
      resources: [
        "https://www.tensorflow.org/tutorials",
        "https://pytorch.org/tutorials/"
      ],
      estimatedTimeMinutes: 150
    },
    {
      id: 3,
      title: "Convolutional Neural Networks",
      description: "Learn about CNNs and their applications in image processing.",
      resources: [
        "https://cs231n.github.io/",
        "https://www.youtube.com/watch?v=FmpDIaiMIeA"
      ],
      estimatedTimeMinutes: 180
    },
    {
      id: 4,
      title: "Recurrent Neural Networks",
      description: "Explore RNNs, LSTMs, and their applications in sequence modeling.",
      resources: [
        "https://colah.github.io/posts/2015-08-Understanding-LSTMs/",
        "https://www.youtube.com/watch?v=LHXXI4-IEns"
      ],
      estimatedTimeMinutes: 150
    },
    {
      id: 5,
      title: "Deep Learning Project",
      description: "Build a deep learning model to solve a real-world problem.",
      resources: [
        "https://paperswithcode.com/",
        "https://www.kaggle.com/competitions"
      ],
      estimatedTimeMinutes: 240
    }
  ],
  'default': [
    {
      id: 1,
      title: "Introduction to the Topic",
      description: "Learn the fundamental concepts and terminology.",
      resources: [
        "https://www.wikipedia.org",
        "https://www.youtube.com/results?search_query=introduction+to+"
      ],
      estimatedTimeMinutes: 60
    },
    {
      id: 2,
      title: "Core Principles",
      description: "Understand the key principles and methodologies.",
      resources: [
        "https://www.coursera.org",
        "https://www.edx.org"
      ],
      estimatedTimeMinutes: 90
    },
    {
      id: 3,
      title: "Practical Application",
      description: "Apply your knowledge to solve real-world problems.",
      resources: [
        "https://github.com/topics/",
        "https://www.kaggle.com/datasets"
      ],
      estimatedTimeMinutes: 120
    }
  ]
};

// Helper function to get mock learning path for a topic
function getMockLearningPath(topic: string): LearningPathStep[] {
  // Normalize the topic name for lookup
  const normalizedTopic = topic.toLowerCase().trim();
  
  // Try to find an exact match
  if (mockLearningPaths[normalizedTopic]) {
    return mockLearningPaths[normalizedTopic];
  }
  
  // Try to find a partial match
  for (const key of Object.keys(mockLearningPaths)) {
    if (normalizedTopic.includes(key) || key.includes(normalizedTopic)) {
      return mockLearningPaths[key];
    }
  }
  
  // Return default learning path if no match found
  return mockLearningPaths['default'];
}

/**
 * Fetches a learning path for a specific topic from the AI bot
 * @param topic - The topic to get a learning path for
 * @returns Promise with learning path steps or image response
 */
export async function fetchLearningPath(topic: string): Promise<LearningPathResponse | LearningPathImageResponse> {
  try {
    // Use the exact specified ngrok URL directly
    const apiUrl = `https://7100-34-125-133-151.ngrok-free.app/learning-path`;
    
    // Use the URL with the topic as a query parameter
    console.log(`Using direct ngrok URL with topic: ${topic}`);
    const imageUrl = `${apiUrl}?topic=${encodeURIComponent(topic)}`;
    
    // Return a special response indicating we're using the URL as an image source
    return {
      isImage: true,
      imageUrl,
      topic
    };
  } catch (error) {
    console.error("Error fetching learning path:", error);
    
    // Final fallback to mock data
    const mockData = getMockLearningPath(topic);
    
    return {
      success: true,
      message: "Using mock data due to error: " + (error instanceof Error ? error.message : "Unknown error"),
      topic,
      steps: mockData
    };
  }
}
