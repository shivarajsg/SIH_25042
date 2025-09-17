import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ProcessedData } from "@/pages/Index";
import { BarChart3, PieChart as PieChartIcon, TrendingUp, Download, Filter } from "lucide-react";

interface BiodiversityDashboardProps {
  data: ProcessedData;
}

export const BiodiversityDashboard = ({ data }: BiodiversityDashboardProps) => {
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedDepthRange, setSelectedDepthRange] = useState<string>("all");

  // Data processing and filtering
  const locations = useMemo(() => {
    const uniqueLocations = Array.from(new Set(data.originalData.map(d => d.sample_location)));
    return ["all", ...uniqueLocations];
  }, [data.originalData]);

  const depthRanges = useMemo(() => {
    const depths = data.originalData.map(d => d.depth);
    const minDepth = Math.min(...depths);
    const maxDepth = Math.max(...depths);
    const ranges = ["all"];
    
    // Create depth ranges
    for (let i = 0; i < maxDepth; i += 10) {
      ranges.push(`${i}-${Math.min(i + 10, maxDepth)}m`);
    }
    
    return ranges;
  }, [data.originalData]);

  const filteredData = useMemo(() => {
    let filtered = data.processedSequences;
    
    if (selectedLocation !== "all") {
      filtered = filtered.filter(d => d.sample_location === selectedLocation);
    }
    
    if (selectedDepthRange !== "all") {
      const [min, max] = selectedDepthRange.replace('m', '').split('-').map(Number);
      filtered = filtered.filter(d => d.depth >= min && d.depth < max);
    }
    
    return filtered;
  }, [data.processedSequences, selectedLocation, selectedDepthRange]);

  // Taxonomic composition data
  const taxonomicData = useMemo(() => {
    const abundanceMap: { [taxon: string]: number } = {};
    
    filteredData.forEach(seq => {
      const taxonomy = data.taxonomyResults.find(t => t.sequence_id === seq.sequence_id);
      if (taxonomy) {
        const phylum = taxonomy.predicted_taxon.split(';')[1] || 'Unknown';
        abundanceMap[phylum] = (abundanceMap[phylum] || 0) + seq.read_count;
      }
    });
    
    return Object.entries(abundanceMap)
      .map(([taxon, reads]) => ({ taxon, reads, percentage: (reads / filteredData.reduce((sum, s) => sum + s.read_count, 0)) * 100 }))
      .sort((a, b) => b.reads - a.reads)
      .slice(0, 10); // Top 10
  }, [filteredData, data.taxonomyResults]);

  // Diversity by location data
  const diversityByLocation = useMemo(() => {
    const locationData = locations.slice(1).map(location => {
      const locationSequences = data.processedSequences.filter(s => s.sample_location === location);
      const locationTaxonomy = data.taxonomyResults.filter(t => 
        locationSequences.some(s => s.sequence_id === t.sequence_id)
      );
      
      const uniqueTaxa = new Set(locationTaxonomy.map(t => t.predicted_taxon));
      const totalReads = locationSequences.reduce((sum, s) => sum + s.read_count, 0);
      
      // Calculate Shannon index for this location
      const abundanceMap: { [taxon: string]: number } = {};
      locationTaxonomy.forEach(t => {
        const seq = locationSequences.find(s => s.sequence_id === t.sequence_id);
        if (seq) {
          abundanceMap[t.predicted_taxon] = (abundanceMap[t.predicted_taxon] || 0) + seq.read_count;
        }
      });
      
      const proportions = Object.values(abundanceMap).map(count => count / totalReads);
      const shannon = -proportions.reduce((sum, p) => sum + (p * Math.log(p)), 0);
      
      return {
        location,
        species_richness: uniqueTaxa.size,
        shannon_index: parseFloat(shannon.toFixed(3)),
        total_reads: totalReads
      };
    });
    
    return locationData;
  }, [data, locations]);

  // Novel taxa clusters
  const clusterData = useMemo(() => {
    const clusters: { [clusterId: number]: any[] } = {};
    
    data.taxonomyResults
      .filter(t => t.cluster_id)
      .forEach(t => {
        if (!clusters[t.cluster_id!]) {
          clusters[t.cluster_id!] = [];
        }
        const seq = data.processedSequences.find(s => s.sequence_id === t.sequence_id);
        if (seq) {
          clusters[t.cluster_id!].push({ ...t, ...seq });
        }
      });
    
    return Object.entries(clusters).map(([clusterId, sequences]) => ({
      cluster_id: `Cluster ${clusterId}`,
      sequence_count: sequences.length,
      total_reads: sequences.reduce((sum: number, s: any) => sum + s.read_count, 0),
      avg_confidence: (sequences.reduce((sum: number, s: any) => sum + s.confidence, 0) / sequences.length).toFixed(3),
      locations: Array.from(new Set(sequences.map((s: any) => s.sample_location))).join(', ')
    }));
  }, [data]);

  // Color schemes
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'];

  const exportChart = (chartType: string) => {
    // This would implement chart export functionality
    console.log(`Exporting ${chartType} chart...`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Data Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sample Location</label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>
                      {location === "all" ? "All Locations" : location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Depth Range</label>
              <Select value={selectedDepthRange} onValueChange={setSelectedDepthRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {depthRanges.map(range => (
                    <SelectItem key={range} value={range}>
                      {range === "all" ? "All Depths" : range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">
              {filteredData.length} sequences
            </Badge>
            <Badge variant="outline">
              {Array.from(new Set(data.taxonomyResults
                .filter(t => filteredData.some(f => f.sequence_id === t.sequence_id))
                .map(t => t.predicted_taxon)
              )).length} taxa
            </Badge>
            <Badge variant="outline">
              {filteredData.reduce((sum, s) => sum + s.read_count, 0).toLocaleString()} total reads
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Biodiversity Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {data.biodiversityMetrics.species_richness}
              </div>
              <div className="text-sm text-muted-foreground">Species Richness</div>
              <div className="text-xs text-muted-foreground mt-1">Total unique taxa</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {data.biodiversityMetrics.shannon_index}
              </div>
              <div className="text-sm text-muted-foreground">Shannon Index</div>
              <div className="text-xs text-muted-foreground mt-1">Diversity measure</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {data.biodiversityMetrics.simpson_index.toFixed(3)}
              </div>
              <div className="text-sm text-muted-foreground">Simpson Index</div>
              <div className="text-xs text-muted-foreground mt-1">Dominance measure</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow mb-2">
                {Math.round(data.biodiversityMetrics.chao1_estimator)}
              </div>
              <div className="text-sm text-muted-foreground">Chao1 Estimator</div>
              <div className="text-xs text-muted-foreground mt-1">Estimated richness</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Tabs */}
      <Tabs defaultValue="taxonomy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="taxonomy" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Taxonomy
          </TabsTrigger>
          <TabsTrigger value="diversity" className="gap-2">
            <PieChartIcon className="h-4 w-4" />
            Diversity
          </TabsTrigger>
          <TabsTrigger value="clusters" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Novel Taxa
          </TabsTrigger>
          <TabsTrigger value="spatial" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Spatial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="taxonomy" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Taxonomic Composition</CardTitle>
              <Button onClick={() => exportChart('taxonomy')} variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={taxonomicData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="taxon" 
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'reads' ? `${value.toLocaleString()} reads` : `${value.toFixed(1)}%`,
                        name === 'reads' ? 'Read Count' : 'Percentage'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="reads" fill="hsl(var(--primary))" name="Read Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="diversity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Phylum Distribution</CardTitle>
                <Button onClick={() => exportChart('pie')} variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taxonomicData.slice(0, 8)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ taxon, percentage }) => `${taxon} (${percentage.toFixed(1)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="reads"
                      >
                        {taxonomicData.slice(0, 8).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value.toLocaleString()} reads`, 'Read Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Diversity by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={diversityByLocation}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="location" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={11}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="species_richness" fill="hsl(var(--secondary))" name="Species Richness" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clusters" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Novel Taxa Clusters</CardTitle>
              <Badge variant="secondary">{clusterData.length} clusters identified</Badge>
            </CardHeader>
            <CardContent>
              {clusterData.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clusterData.map((cluster, index) => (
                      <Card key={cluster.cluster_id} className="border-dashed">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold">{cluster.cluster_id}</h4>
                              <Badge variant="outline">{cluster.sequence_count} sequences</Badge>
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Total reads: {cluster.total_reads.toLocaleString()}</div>
                              <div>Avg confidence: {cluster.avg_confidence}</div>
                              <div>Locations: {cluster.locations}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No novel taxa clusters identified in this dataset.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spatial" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Spatial Diversity Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diversityByLocation}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="location" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={11}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="species_richness" fill="hsl(var(--secondary))" name="Species Richness" />
                    <Bar yAxisId="right" dataKey="shannon_index" fill="hsl(var(--accent))" name="Shannon Index" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};