import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Calendar, 
  Send, 
  Bot, 
  User, 
  Clock,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Mail,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SupportProps {
  accessToken: string;
}

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export function Support({ }: SupportProps) {
  const [activeTab, setActiveTab] = useState('ai-chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your KrishiBandhu AI assistant. I\'m here to help you with farming questions, crop advice, weather concerns, and anything related to your agricultural needs. How can I assist you today?',
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const experts = [
    {
      name: 'Dr. Priya Sharma',
      specialty: 'Crop Disease Expert',
      rating: 4.9,
      experience: '15 years',
      languages: ['English', 'Hindi'],
      availability: 'Available now',
      price: '₹500/session'
    },
    {
      name: 'Dr. Rajesh Patel',
      specialty: 'Soil & Fertilizer Specialist',
      rating: 4.8,
      experience: '12 years',
      languages: ['English', 'Gujarati'],
      availability: 'Available in 30 mins',
      price: '₹450/session'
    },
    {
      name: 'Dr. Aisha Khan',
      specialty: 'Irrigation & Water Management',
      rating: 4.9,
      experience: '10 years',
      languages: ['English', 'Urdu'],
      availability: 'Available tomorrow',
      price: '₹550/session'
    }
  ];

  const faqs = [
    {
      question: 'How do I know when to harvest my crops?',
      answer: 'The best harvest timing depends on your specific crop. Generally, look for visual cues like color changes, firmness, and size. Use our AI assistant for crop-specific guidance, or check the harvest indicators in your crop dashboard.'
    },
    {
      question: 'What should I do if I notice disease symptoms on my plants?',
      answer: 'Take clear photos of the affected plants and use our AI crop disease identifier. For immediate help, book a consultation with our plant disease experts. Early intervention is key to preventing spread.'
    },
    {
      question: 'How can I improve my soil quality?',
      answer: 'Start with a soil test to understand pH and nutrient levels. Based on results, you may need to add organic matter, adjust pH, or supplement specific nutrients. Our soil specialists can provide personalized recommendations.'
    },
    {
      question: 'How do I set up automated irrigation?',
      answer: 'Choose irrigation type based on crop and farm size. Consider drip irrigation for water efficiency. Our irrigation experts can help design and implement systems suited to your specific needs and budget.'
    },
    {
      question: 'Can I get weather alerts for my specific location?',
      answer: 'Yes! Enable location-based weather notifications in your profile settings. You\'ll receive alerts for rain, temperature changes, frost warnings, and other weather events that could affect your crops.'
    }
  ];

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: newMessage,
      isBot: false,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      // AI response simulation - in real app, this would call OpenAI API
      const botResponse = await generateAIResponse(newMessage);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact our support team for assistance.',
        isBot: true,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (message: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple response logic - in real app, this would use OpenAI API
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('weather')) {
      return 'For weather-related concerns, I recommend checking your local weather forecast in the app. If you\'re worried about upcoming weather affecting your crops, consider protective measures like covering sensitive plants or adjusting irrigation schedules. Would you like specific advice for your crop type?';
    } else if (lowercaseMessage.includes('disease') || lowercaseMessage.includes('pest')) {
      return 'Crop diseases and pests can be serious issues. I\'d recommend taking clear photos of the affected areas and uploading them for analysis. For immediate expert help, you can book a consultation with Dr. Priya Sharma, our crop disease specialist. Early detection and treatment are crucial for crop health.';
    } else if (lowercaseMessage.includes('irrigation') || lowercaseMessage.includes('water')) {
      return 'Water management is crucial for healthy crops. The amount and frequency depend on your crop type, soil conditions, and weather. Generally, deep, less frequent watering is better than shallow, frequent watering. Would you like me to connect you with our irrigation specialist for a personalized assessment?';
    } else if (lowercaseMessage.includes('fertilizer') || lowercaseMessage.includes('soil')) {
      return 'Soil health is the foundation of successful farming. I recommend getting a soil test to understand pH levels and nutrient content. Based on those results, you can choose appropriate fertilizers. Our soil specialist Dr. Rajesh Patel can help create a customized fertilization plan for your farm.';
    } else if (lowercaseMessage.includes('harvest')) {
      return 'Harvest timing is critical for crop quality and yield. Look for visual indicators specific to your crop - color changes, firmness, size. Most crops have optimal harvest windows. Check your crop dashboard for estimated harvest dates, or I can provide specific guidance if you tell me what crops you\'re growing.';
    } else {
      return 'Thank you for your question! I\'m here to help with farming-related topics including crop management, pest control, irrigation, soil health, and weather concerns. Could you provide more specific details about what you\'d like assistance with? Or would you prefer to speak with one of our human experts?';
    }
  };

  const handleContactSubmit = () => {
    // In real app, this would submit to backend
    alert('Thank you for contacting us! We\'ll get back to you within 24 hours.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      priority: 'medium'
    });
  };

  const bookExpertCall = (expertName: string) => {
    // In real app, this would open booking system
    alert(`Booking consultation with ${expertName}. You'll be redirected to the scheduling system.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Support Center</h2>
        <p className="text-gray-600">Get instant help with AI assistance or book a consultation with farming experts</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ai-chat" className="flex items-center space-x-2">
            <Bot className="h-4 w-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="expert-calls" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span>Expert Calls</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>FAQ</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <span>Contact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-chat" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">KrishiBandhu AI Assistant</h3>
                <p className="text-sm text-gray-600">Available 24/7 for farming guidance</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="border rounded-lg p-4 h-96 overflow-y-auto space-y-4 mb-4 bg-gray-50">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%]`}>
                    {message.isBot && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-green-100 text-green-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.isBot 
                          ? 'bg-white border' 
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isBot ? 'text-gray-500' : 'text-green-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {!message.isBot && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-blue-100 text-blue-600">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-100 text-green-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border rounded-lg p-3">
                      <p className="text-sm text-gray-500">AI is thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask about crops, weather, irrigation, diseases..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="expert-calls" className="space-y-4">
          <div className="grid gap-4">
            {experts.map((expert, index) => (
              <Card key={index} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                        {expert.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{expert.name}</h3>
                      <p className="text-green-600 font-medium">{expert.specialty}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span>{expert.rating}</span>
                        </div>
                        <span>{expert.experience} experience</span>
                        <span>Speaks: {expert.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={expert.availability === 'Available now' ? 'default' : 'secondary'}>
                          <Clock className="h-3 w-3 mr-1" />
                          {expert.availability}
                        </Badge>
                        <span className="font-semibold text-green-600">{expert.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => bookExpertCall(expert.name)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Voice Call
                    </Button>
                    <Button onClick={() => bookExpertCall(expert.name)}>
                      <Video className="h-4 w-4 mr-2" />
                      Video Call
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <button
                    className="flex items-center justify-between w-full text-left"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <p className="mt-3 text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Our Support Team</h3>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select 
                  value={contactForm.priority}
                  onChange={(e) => setContactForm(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="low">Low - General inquiry</option>
                  <option value="medium">Medium - Need assistance</option>
                  <option value="high">High - Urgent issue</option>
                  <option value="critical">Critical - Emergency</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please describe your issue in detail..."
                  className="min-h-[120px]"
                />
              </div>

              <Button onClick={handleContactSubmit} className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </Card>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              We typically respond within 24 hours. For urgent issues, consider booking an expert call for immediate assistance.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}