import genAI from './geminiClient';

/**
 * Handles common Gemini API errors with user-friendly messages.
 * @param {Error} error - The error object from the API.
 * @returns {string} User-friendly error message.
 */
export function handleGeminiError(error) {
  console.error('Gemini API Error:', error);

  if (error?.message?.includes('429')) {
    return 'Rate limit exceeded. Please wait a moment before trying again.';
  }
  
  if (error?.message?.includes('SAFETY')) {
    return 'Content was blocked by safety filters. Please modify your request.';
  }
  
  if (error?.message?.includes('cancelled')) {
    return 'Request was cancelled by user.';
  }
  
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (error?.message?.includes('API key')) {
    return 'API key is invalid or missing. Please check your configuration.';
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Comprehensive safety settings for content filtering.
 * @returns {Array} Safety settings configuration.
 */
export function getSafetySettings() {
  return [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_LOW_AND_ABOVE"
    }
  ];
}

/**
 * Generates a text response based on user input.
 * @param {string} prompt - The user's input prompt.
 * @returns {Promise<string>} The generated text.
 */
export async function generateText(prompt) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 32,
      maxOutputTokens: 2048,
    };

    const result = await model?.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings: getSafetySettings(),
    });
    
    const response = await result?.response;
    return response?.text();
  } catch (error) {
    console.error('Error in text generation:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Streams a text response chunk by chunk.
 * @param {string} prompt - The user's input prompt.
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 */
export async function streamText(prompt, onChunk) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 32,
      maxOutputTokens: 2048,
    };

    const result = await model?.generateContentStream({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig,
      safetySettings: getSafetySettings(),
    });

    for await (const chunk of result?.stream) {
      const text = chunk?.text();
      if (text) {
        onChunk(text);
      }
    }
  } catch (error) {
    console.error('Error in streaming text generation:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Manages a chat session with history.
 * @param {string} prompt - The user's input prompt.
 * @param {Array} history - The chat history.
 * @returns {Promise<{response: string, updatedHistory: Array}>} The response and updated history.
 */
export async function chatWithHistory(prompt, history = []) {
  try {
    const model = genAI?.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 32,
      maxOutputTokens: 2048,
    };

    const chat = model?.startChat({ 
      history,
      generationConfig,
      safetySettings: getSafetySettings(),
    });

    const result = await chat?.sendMessage(prompt);
    const response = await result?.response;
    const text = response?.text();

    const updatedHistory = [
      ...history,
      { role: 'user', parts: [{ text: prompt }] },
      { role: 'model', parts: [{ text }] },
    ];

    return { response: text, updatedHistory };
  } catch (error) {
    console.error('Error in chat session:', error);
    throw new Error(handleGeminiError(error));
  }
}

/**
 * Analyzes review data and generates insights using Gemini AI.
 * @param {string} query - The analysis query from the user.
 * @param {Object} context - Additional context about the data.
 * @returns {Promise<string>} AI-generated analysis response.
 */
export async function analyzeReviewData(query, context = {}) {
  try {
    const systemPrompt = `You are ReviewChat Analytics AI Assistant, specialized in analyzing Amazon product reviews.
Your role is to provide detailed, data-driven insights about:
- NPS (Net Promoter Score) trends and analysis
- Customer satisfaction metrics
- Sentiment analysis (happy/unhappy customers)
- Product rating comparisons
- Review patterns and trends

Provide specific, actionable insights based on the query. Use numbers and percentages when relevant.
Keep responses professional, clear, and focused on the data.`;

    const fullPrompt = `${systemPrompt}\n\nContext: ${JSON.stringify(context)}\n\nUser Query: ${query}\n\nProvide a comprehensive analysis:`;

    return await generateText(fullPrompt);
  } catch (error) {
    console.error('Error in review data analysis:', error);
    throw error;
  }
}

/**
 * Streams review analysis response with real-time updates.
 * @param {string} query - The analysis query from the user.
 * @param {Object} context - Additional context about the data.
 * @param {Function} onChunk - Callback for each text chunk.
 */
export async function streamReviewAnalysis(query, context = {}, onChunk) {
  try {
    const systemPrompt = `You are ReviewChat Analytics AI Assistant, specialized in analyzing Amazon product reviews.
Your role is to provide detailed, data-driven insights about:
- NPS (Net Promoter Score) trends and analysis
- Customer satisfaction metrics
- Sentiment analysis (happy/unhappy customers)
- Product rating comparisons
- Review patterns and trends

Provide specific, actionable insights based on the query. Use numbers and percentages when relevant.
Keep responses professional, clear, and focused on the data.`;

    const fullPrompt = `${systemPrompt}\n\nContext: ${JSON.stringify(context)}\n\nUser Query: ${query}\n\nProvide a comprehensive analysis:`;

    await streamText(fullPrompt, onChunk);
  } catch (error) {
    console.error('Error in streaming review analysis:', error);
    throw error;
  }
}

export default {
  generateText,
  streamText,
  chatWithHistory,
  analyzeReviewData,
  streamReviewAnalysis,
  handleGeminiError,
  getSafetySettings,
};