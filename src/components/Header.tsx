import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">
            AgriVision AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Smart Plant Health Assistant for Farmers
          </p>
        </div>
        
        <nav className="flex justify-center">
          <Tabs value={activeTab} onValueChange={onTabChange} className="w-full max-w-2xl">
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger value="home" className="text-sm font-medium">
                Home
              </TabsTrigger>
              <TabsTrigger value="detection" className="text-sm font-medium">
                Disease Detection & Treatment
              </TabsTrigger>
              <TabsTrigger value="chatbot" className="text-sm font-medium">
                Chatbot
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </nav>
      </div>
    </header>
  );
};