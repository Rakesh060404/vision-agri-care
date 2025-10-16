import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Leaf, Pill, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DetectionResult {
  disease: string;
  confidence: number;
  isHealthy: boolean;
}

interface TreatmentData {
  treatments: string[];
  remedies: string[];
  prevention: string[];
  severity: 'low' | 'medium' | 'high';
}

export const DiseaseDetection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [treatment, setTreatment] = useState<TreatmentData | null>(null);
  const [isLoadingTreatment, setIsLoadingTreatment] = useState(false);
  const { toast } = useToast();

  const mockTreatmentData: Record<string, TreatmentData> = {
    "Late Blight": {
      treatments: [
        "Apply copper-based fungicide every 7-10 days",
        "Remove affected leaves and destroy them",
        "Improve air circulation around plants",
        "Use resistant varieties for future planting"
      ],
      remedies: [
        "Baking soda spray (1 tsp per quart of water)",
        "Neem oil application every 2 weeks",
        "Bordeaux mixture for severe cases",
        "Proper plant spacing for air flow"
      ],
      prevention: [
        "Plant in well-draining soil",
        "Avoid overhead watering",
        "Rotate crops annually",
        "Apply preventive fungicide in humid conditions"
      ],
      severity: 'high'
    },
    "Early Blight": {
      treatments: [
        "Apply chlorothalonil or copper fungicide",
        "Remove lower leaves that touch the soil",
        "Mulch around plants to reduce soil splash",
        "Prune for better air circulation"
      ],
      remedies: [
        "Compost tea application weekly",
        "Milk spray (1:10 ratio with water)",
        "Garlic and pepper spray",
        "Proper plant support and spacing"
      ],
      prevention: [
        "Use certified disease-free seeds",
        "Maintain proper plant nutrition",
        "Avoid working with wet plants",
        "Clean garden tools regularly"
      ],
      severity: 'medium'
    },
    "Leaf Spot": {
      treatments: [
        "Apply mancozeb or copper fungicide",
        "Remove spotted leaves promptly",
        "Water at soil level to avoid leaf wetness",
        "Ensure adequate plant nutrition"
      ],
      remedies: [
        "Chamomile tea spray for mild cases",
        "Hydrogen peroxide solution (3% diluted)",
        "Improved drainage and soil health",
        "Organic matter addition to soil"
      ],
      prevention: [
        "Plant resistant cultivars",
        "Avoid overcrowding plants",
        "Morning watering for quick drying",
        "Regular garden sanitation"
      ],
      severity: 'low'
    },
    "Powdery Mildew": {
      treatments: [
        "Apply sulfur-based fungicide",
        "Increase air circulation",
        "Remove affected plant parts",
        "Reduce nitrogen fertilization"
      ],
      remedies: [
        "Milk and water spray (1:3 ratio)",
        "Baking soda solution with dish soap",
        "Potassium bicarbonate spray",
        "Proper plant spacing and pruning"
      ],
      prevention: [
        "Choose resistant plant varieties",
        "Plant in sunny, well-ventilated areas",
        "Avoid overhead irrigation",
        "Monitor humidity levels"
      ],
      severity: 'medium'
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPG, JPEG, PNG)",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setTreatment(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);

    try {
      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });

      // Send to backend API
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setResult({
        disease: data.disease,
        confidence: data.confidence,
        isHealthy: data.isHealthy
      });

      // Set treatment data if available
      if (data.treatment) {
        setTreatment(data.treatment);
      }

      toast({
        title: "Analysis Complete",
        description: `Detection completed with ${data.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGetTreatment = (diseaseName: string) => {
    setIsLoadingTreatment(true);

    // Simulate API call
    setTimeout(() => {
      const treatmentData = mockTreatmentData[diseaseName] || {
        treatments: ["Consult with local agricultural extension office"],
        remedies: ["General plant care and monitoring"],
        prevention: ["Follow good agricultural practices"],
        severity: 'medium' as const
      };

      setTreatment(treatmentData);
      setIsLoadingTreatment(false);
    }, 1000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-success border-success bg-success/10';
      case 'medium': return 'text-accent border-accent bg-accent/10';
      case 'high': return 'text-disease border-disease bg-disease/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
          <Leaf className="h-8 w-8" />
          Plant Disease Detection & Treatment
        </h2>
        <p className="text-muted-foreground text-lg">
          Upload a plant leaf image, detect diseases instantly, and get treatment recommendations
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Plant Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/30 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">JPG, JPEG or PNG files</p>
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileSelect}
              />
            </label>
          </div>

          {preview && (
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={preview}
                  alt="Selected plant"
                  className="max-w-full h-48 object-contain mx-auto rounded-lg border"
                />
              </div>

              <Button
                onClick={analyzeImage}
                disabled={isAnalyzing}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isAnalyzing ? "Analyzing..." : "Predict Disease"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg border-2 ${result.isHealthy
              ? 'bg-success/10 border-success text-success'
              : 'bg-disease/10 border-disease text-disease'
              }`}>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold">{result.disease}</h3>
                <p className="text-lg">
                  Confidence: {result.confidence}%
                </p>
                {!result.isHealthy && !treatment && (
                  <Button
                    onClick={() => handleGetTreatment(result.disease)}
                    disabled={isLoadingTreatment}
                    className="mt-4 bg-accent hover:bg-accent/90"
                  >
                    {isLoadingTreatment ? "Loading Treatment..." : "Get Treatment Recommendation"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {treatment && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
              <Pill className="h-6 w-6" />
              Treatment Recommendations
            </h3>
          </div>

          <Card className={`border-2 ${getSeverityColor(treatment.severity)}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Severity Level: {treatment.severity.charAt(0).toUpperCase() + treatment.severity.slice(1)}
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-disease">
                  <Pill className="h-5 w-5" />
                  Treatments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {treatment.treatments.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-disease mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-leaf">
                  <Leaf className="h-5 w-5" />
                  Natural Remedies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {treatment.remedies.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-leaf mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-success">
                  <Shield className="h-5 w-5" />
                  Prevention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {treatment.prevention.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-success mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};