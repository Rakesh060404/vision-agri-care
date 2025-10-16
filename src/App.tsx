import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Home } from "@/components/Home";
import { DiseaseDetection } from "@/components/DiseaseDetection";
import { Chatbot } from "@/components/Chatbot";
import { Footer } from "@/components/Footer";

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState("home");

  const handleGetStarted = () => {
    setActiveTab("detection");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Home onGetStarted={handleGetStarted} />;
      case "detection":
        return <DiseaseDetection />;
      case "chatbot":
        return <Chatbot />;
      default:
        return <Home onGetStarted={handleGetStarted} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <Header activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="container mx-auto px-4 py-8">
            {renderContent()}
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
