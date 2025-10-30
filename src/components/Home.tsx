import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-plants.jpg";

interface HomeProps {
  onGetStarted: () => void;
}

export const Home = ({ onGetStarted }: HomeProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden rounded-lg">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Empowering farmers with AI-driven plant health insights
        </h2>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Detect plant diseases instantly, get expert treatment recommendations, 
          and chat with our AI assistant for all your agricultural needs.
        </p>
        <Button 
          onClick={onGetStarted}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold"
        >
          Get Started
        </Button>
      </div>
    </section>
  );
};