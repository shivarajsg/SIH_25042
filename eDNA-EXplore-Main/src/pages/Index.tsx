import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/eDNA/FileUpload";
import { DataProcessor } from "@/components/eDNA/DataProcessor";
import { BiodiversityDashboard } from "@/components/eDNA/BiodiversityDashboard";
import { ExportResults } from "@/components/eDNA/ExportResults";
import { Dna, BarChart3, FileText, Download } from "lucide-react";

export interface eDNAData {
  sequence_id: string;
  raw_sequence: string;
  read_count: number;
  sample_location: string;
  depth: number;
}

export interface ProcessedData {
  originalData: eDNAData[];
  processedSequences: eDNAData[];
  taxonomyResults: {
    sequence_id: string;
    predicted_taxon: string;
    confidence: number;
    cluster_id?: number;
  }[];
  biodiversityMetrics: {
    shannon_index: number;
    simpson_index: number;
    chao1_estimator: number;
    species_richness: number;
  };
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'process' | 'analyze' | 'export'>('upload');
  const [uploadedData, setUploadedData] = useState<eDNAData[] | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

  const handleDataUpload = (data: eDNAData[]) => {
    setUploadedData(data);
    setCurrentStep('process');
  };

  const handleDataProcessed = (data: ProcessedData) => {
    setProcessedData(data);
    setCurrentStep('analyze');
  };

  const getStepStatus = (step: string) => {
    const steps = ['upload', 'process', 'analyze', 'export'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden bg-gradient-ocean py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <img 
            src="/src/assets/hero-edna-analysis.jpg" 
            alt="Environmental DNA analysis visualization" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="text-center text-primary-foreground">
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-white/20 p-4">
                <Dna className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              eDNA Analysis Pipeline
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              AI-driven taxonomy identification and biodiversity assessment from environmental DNA datasets
            </p>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {[
            { key: 'upload', label: 'Upload Data', icon: FileText },
            { key: 'process', label: 'Process & Analyze', icon: Dna },
            { key: 'analyze', label: 'Biodiversity Assessment', icon: BarChart3 },
            { key: 'export', label: 'Export Results', icon: Download },
          ].map((step, index) => {
            const status = getStepStatus(step.key);
            const Icon = step.icon;
            
            return (
              <div key={step.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    rounded-full p-3 mb-2 transition-all duration-300
                    ${status === 'completed' ? 'bg-secondary text-secondary-foreground' : 
                      status === 'active' ? 'bg-primary text-primary-foreground shadow-data' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`text-sm font-medium ${
                    status === 'active' ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {index < 3 && (
                  <div className={`
                    hidden md:block w-24 h-0.5 mx-4 transition-colors duration-300
                    ${getStepStatus(['process', 'analyze', 'export'][index]) === 'completed' ? 
                      'bg-secondary' : 'bg-border'}
                  `} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={currentStep} className="w-full">
          <TabsContent value="upload" className="mt-0">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Upload eDNA Dataset
                </CardTitle>
                <CardDescription>
                  Upload your CSV file containing environmental DNA sequencing data with the required fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload onDataUpload={handleDataUpload} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="process" className="mt-0">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dna className="h-5 w-5" />
                  Data Processing & AI Analysis
                </CardTitle>
                <CardDescription>
                  Preprocessing sequences and running AI-driven taxonomy identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                {uploadedData && (
                  <DataProcessor 
                    data={uploadedData} 
                    onProcessingComplete={handleDataProcessed}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyze" className="mt-0">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Biodiversity Analysis & Visualization
                </CardTitle>
                <CardDescription>
                  Interactive dashboards showing taxonomic composition and biodiversity metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData && (
                  <BiodiversityDashboard data={processedData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export" className="mt-0">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Results
                </CardTitle>
                <CardDescription>
                  Download your analysis results in multiple formats
                </CardDescription>
              </CardHeader>
              <CardContent>
                {processedData && (
                  <ExportResults data={processedData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        {uploadedData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{uploadedData.length}</div>
                <div className="text-sm text-muted-foreground">Total Sequences</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-secondary">
                  {new Set(uploadedData.map(d => d.sample_location)).size}
                </div>
                <div className="text-sm text-muted-foreground">Sample Locations</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-accent">
                  {uploadedData.reduce((sum, d) => sum + d.read_count, 0).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Reads</div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary-glow">
                  {processedData ? processedData.biodiversityMetrics.species_richness : '—'}
                </div>
                <div className="text-sm text-muted-foreground">Species Richness</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;