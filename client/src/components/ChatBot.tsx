import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const GEMINI_API_KEY = "AIzaSyBO7UV-JpHEC-E_x_68cypB0St3noQHLds";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Récupérer le profil utilisateur
    const profile = localStorage.getItem("userProfile");
    const user = localStorage.getItem("user");
    if (profile && user) {
      setUserProfile({
        profile: JSON.parse(profile),
        user: JSON.parse(user),
      });
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const buildContextPrompt = () => {
    if (!userProfile) return "";

    const { profile, user } = userProfile;
    const heightInMeters = user.height ? parseFloat(user.height) / 100 : 0;
    const bmi = user.weight && user.height 
      ? (parseFloat(user.weight) / (heightInMeters * heightInMeters)).toFixed(1)
      : "N/A";

    return `
Tu es un assistant fitness et santé pour l'application GENÈSE.
Voici le profil de l'utilisateur :
- Niveau d'activité IPAQ: ${profile.level}
- Poids: ${user.weight} kg
- Taille: ${user.height} cm
- IMC: ${bmi}
- Conditions médicales: ${user.medicalConditions || "Aucune"}
- Blessures: ${user.injuries || "Aucune"}

Donne des conseils fitness/santé personnalisés basés sur ce profil.
Sois amical, encourageant et pratique.
Réponds en français.
`;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const contextPrompt = buildContextPrompt();
      const fullPrompt = `${contextPrompt}\n\nUtilisateur: ${input}`;

      const result = await model.generateContent(fullPrompt);
      const responseText =
        result.response.text() || "Je n'ai pas pu générer une réponse.";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Erreur Gemini:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 h-96 bg-card border border-border rounded-lg shadow-2xl flex flex-col animate-slide-in-up">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 rounded-t-lg">
            <h3 className="font-semibold">Coach IA GENÈSE</h3>
            <p className="text-xs opacity-90">Conseils fitness & santé personnalisés</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm mt-8">
                <p>Bonjour! 👋</p>
                <p className="mt-2">Posez-moi vos questions sur le fitness et la santé.</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-orange-500 text-white rounded-br-none"
                      : "bg-secondary text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-sm">En train de répondre...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Votre question..."
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg p-2 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
