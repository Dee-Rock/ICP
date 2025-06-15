import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

export async function generateMovieInsight(
  movieTitle: string,
  plot: string,
  genres: string[],
  userQuery?: string
): Promise<string> {
  try {
    const prompt = userQuery 
      ? `Based on the user's interest in "${userQuery}", explain why they might enjoy the movie "${movieTitle}". 
         Plot: ${plot}
         Genres: ${genres.join(', ')}
         
         Provide a personalized, engaging explanation in 2-3 sentences.`
      : `Provide an engaging, insightful summary of the movie "${movieTitle}" in 2-3 sentences.
         Plot: ${plot}
         Genres: ${genres.join(', ')}
         
         Focus on what makes this movie unique and appealing.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a knowledgeable movie critic and recommendation expert. Provide engaging, insightful movie recommendations and explanations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    return response.choices[0].message.content || 'No insight available.';
  } catch (error) {
    console.error('Error generating movie insight:', error);
    return 'Unable to generate insight at this time.';
  }
}

export async function generateMoodBasedQuery(mood: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a movie recommendation expert. Convert user moods into specific movie search queries.'
        },
        {
          role: 'user',
          content: `Convert this mood into a specific movie search query: "${mood}". 
                   Return only the search query, no explanation.`
        }
      ],
      max_tokens: 50,
      temperature: 0.5,
    });

    return response.choices[0].message.content || mood;
  } catch (error) {
    console.error('Error generating mood query:', error);
    return mood;
  }
}

export default openai;
