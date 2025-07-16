const AI_RESPONSES = [
  "That's an interesting question! Let me think about that for a moment.",
  "I understand what you're asking. Here's my perspective on that topic.",
  "Great question! I'd be happy to help you with that.",
  "That's a thoughtful inquiry. Let me provide you with some insights.",
  "I appreciate you asking about this. Here's what I can tell you.",
  "That's something I can definitely help you with. Let me explain.",
  "Interesting point! I have some thoughts on that subject.",
  "I'm glad you brought that up. Here's my take on it.",
  "That's a complex topic, but I'll do my best to explain it clearly.",
  "Good question! I think you'll find this information helpful.",
]

export function generateAIResponse(userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    // Simulate AI thinking time (1-3 seconds)
    const thinkingTime = Math.random() * 2000 + 1000

    setTimeout(() => {
      const randomResponse = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)]

      // Add some context based on user message
      let contextualResponse = randomResponse

      if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        contextualResponse = "Hello! It's great to meet you. How can I assist you today?"
      } else if (userMessage.toLowerCase().includes("help")) {
        contextualResponse = "I'm here to help! What specific topic would you like assistance with?"
      } else if (userMessage.toLowerCase().includes("thank")) {
        contextualResponse = "You're very welcome! I'm always happy to help. Is there anything else you'd like to know?"
      }

      resolve(contextualResponse)
    }, thinkingTime)
  })
}
