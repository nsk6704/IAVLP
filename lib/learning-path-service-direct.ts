/**
 * Learning Path Service - Handles fetching learning paths from the AI bot
 * This version directly fetches from the external API and handles image responses
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
  imageBlob?: Blob;
}

// Mock data for different topics (fallback if API fails)
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
    // The public URI of the AI bot
    const apiUrl = `https://ae6d-35-223-227-18.ngrok-free.app/learning-path`;
    
    console.log(`Directly using the API URL as an image source with topic: ${topic}`);
    
    // Since the API seems to be returning an HTML page or an image directly,
    // we'll just use the URL directly as the image source
    // Since we're using the direct URL approach, we need to construct the URL with the topic as a query parameter
    const imageUrl = `${apiUrl}?topic=${encodeURIComponent(topic)}`;
    
    console.log(`Using direct image URL: ${imageUrl}`);
    
    return {
      isImage: true,
      imageUrl,
      topic,
      // We're not fetching the blob here since we'll use the URL directly
      // This avoids CORS issues and simplifies the implementation
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
