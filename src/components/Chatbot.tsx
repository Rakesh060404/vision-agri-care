import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Send } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AgriVision AI assistant. I'm here to help you with questions about crops, plant diseases, fertilizers, pest control, and general farming advice. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const botResponses = {
    fertilizer: "For healthy plant growth, I recommend using balanced NPK fertilizers (10-10-10) for general crops. For leafy vegetables, use higher nitrogen content (20-10-10). Always test your soil first and apply fertilizer based on soil test results.",
    watering: "Water your plants early morning or late evening to reduce evaporation. Most crops need 1-2 inches of water per week. Check soil moisture by inserting your finger 2 inches deep - if it's dry, it's time to water.",
    pest: "Common organic pest control methods include neem oil spray, companion planting with marigolds, and introducing beneficial insects like ladybugs. For severe infestations, consider targeted organic pesticides.",
    soil: "Healthy soil should be well-draining with good organic matter. Add compost regularly, maintain pH between 6.0-7.0 for most crops, and rotate crops to prevent nutrient depletion.",
    default: "That's a great question! For specific agricultural advice, I recommend consulting with your local agricultural extension office. They can provide region-specific guidance based on your climate and soil conditions."
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error getting bot response:', error);
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) return botResponses.fertilizer;
      if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) return botResponses.watering;
      if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('bug')) return botResponses.pest;
      if (lowerMessage.includes('soil') || lowerMessage.includes('compost')) return botResponses.soil;
      if (lowerMessage.includes('disease')) return "For plant disease identification, I recommend using our Disease Detection feature. You can upload a photo of the affected plant, and I'll help identify the disease and provide treatment recommendations.";
      if (lowerMessage.includes('crop rotation')) return "Crop rotation is essential for soil health. Rotate between nitrogen-fixing legumes, heavy feeders like corn, and light feeders like root vegetables. A typical 4-year rotation might be: Year 1 - Legumes, Year 2 - Leafy greens, Year 3 - Root crops, Year 4 - Fallow or cover crops.";
      if (lowerMessage.includes('organic') || lowerMessage.includes('natural')) return "Organic farming focuses on natural methods. Use compost and organic fertilizers, practice companion planting, encourage beneficial insects, and use organic-approved pest control methods like neem oil, diatomaceous earth, and beneficial bacteria.";

      return botResponses.default;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(currentInput);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Bot className="h-8 w-8" />
          AgriVision Chatbot
        </h2>
        <p className="text-muted-foreground text-lg">
          Ask questions about crops, diseases, fertilizers, and farming practices
        </p>
      </div>

      <Card className="max-w-4xl mx-auto h-[600px] flex flex-col overflow-hidden">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Chat with AgriVision AI
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden min-h-0">
          <ScrollArea className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4 max-w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'} items-start`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-lg ${message.isBot
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                      }`}
                    style={{
                      maxWidth: '70%',
                      minWidth: '200px',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      overflow: 'hidden'
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ wordBreak: 'break-word' }}>
                      {message.text}
                    </p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {!message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4 text-accent-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start items-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div
                    className="bg-muted p-4 rounded-lg"
                    style={{
                      maxWidth: '70%',
                      minWidth: '200px',
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                      overflow: 'hidden'
                    }}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ wordBreak: 'break-word' }}>
                      AgriVision is typing...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about crops, diseases, fertilizers..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                size="icon"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};