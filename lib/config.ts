/**
 * Application configuration
 * Contains environment variables and configuration settings
 */

// AI Quiz Bot configuration
export const AI_QUIZ_BOT = {
  // The base URL for the AI quiz bot API
  // In production, this should be loaded from environment variables
  BASE_URL: process.env.NEXT_PUBLIC_AI_QUIZ_BOT_URL || 'https://ae6d-35-223-227-18.ngrok-free.app/quiz',
  
  // Flag to control whether to use mock data instead of making API calls
  // Set to false to always try the API first
  USE_MOCK_DATA: false,
};

// Function to get the full URL with query parameters
export function getAIQuizBotUrl(topic: string, currentScore: number): string {
  return `${AI_QUIZ_BOT.BASE_URL}?topic=${encodeURIComponent(topic)}&current_score=${currentScore}`;
}
