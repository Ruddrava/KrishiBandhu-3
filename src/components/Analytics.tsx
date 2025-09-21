import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from './ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Droplets, 
  Download,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

// Sample data for demonstration
const yieldData = [
  { month: 'Jan', wheat: 2.1, rice: 1.8, corn: 2.5 },
  { month: 'Feb', wheat: 2.3, rice: 2.0, corn: 2.7 },
  { month: 'Mar', wheat: 2.8, rice: 2.4, corn: 3.1 },
  { month: 'Apr', wheat: 3.2, rice: 2.8, corn: 3.5 },
  { month: 'May', wheat: 3.8, rice: 3.2, corn: 4.0 },
  { month: 'Jun', wheat: 4.2, rice: 3.8, corn: 4.5 },
];

const revenueData = [
  { quarter: 'Q1 2024', revenue: 45000, costs: 28000, profit: 17000 },
  { quarter: 'Q2 2024', revenue: 52000, costs: 32000, profit: 20000 },
  { quarter: 'Q3 2024', revenue: 48000, costs: 30000, profit: 18000 },
  { quarter: 'Q4 2024', revenue: 58000, costs: 35000, profit: 23000 },
];

const cropDistribution = [
  { name: 'Wheat', value: 40, acres: 2.1 },
  { name: 'Rice', value: 35, acres: 1.8 },
  { name: 'Corn', value: 25, acres: 1.3 },
];

const weatherImpactData = [
  { month: 'Jan', rainfall: 45, temperature: 18, yield: 2.1 },
  { month: 'Feb', rainfall: 52, temperature: 22, yield: 2.3 },
  { month: 'Mar', rainfall: 38, temperature: 26, yield: 2.8 },
  { month: 'Apr', rainfall: 28, temperature: 30, yield: 3.2 },
  { month: 'May', rainfall: 15, temperature: 34, yield: 3.8 },
  { month: 'Jun', rainfall: 8, temperature: 36, yield: 4.2 },
];

const chartConfig = {
  wheat: {
    label: "Wheat",
    color: "#22c55e",
  },
  rice: {
    label: "Rice", 
    color: "#3b82f6",
  },
  corn: {
    label: "Corn",
    color: "#f59e0b",
  },
  revenue: {
    label: "Revenue",
    color: "#10b981",
  },
  costs: {
    label: "Costs",
    color: "#ef4444",
  },
  profit: {
    label: "Profit",
    color: "#8b5cf6",
  },
  rainfall: {
    label: "Rainfall (mm)",
    color: "#3b82f6",
  },
  temperature: {
    label: "Temperature (°C)",
    color: "#f59e0b",
  },
  yield: {
    label: "Yield (tons/acre)",
    color: "#22c55e",
  }
};

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

interface AnalyticsProps {
  accessToken: string;
}

export function Analytics({ }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState('6months');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Farm Analytics</h2>
          <p className="text-gray-600">Insights into your crop performance and farm efficiency</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
              <SelectItem value="2years">2 Years</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-green-600">₹2,03,000</p>
            </div>
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5% from last period</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Yield</p>
              <p className="text-2xl font-semibold text-blue-600">3.2 tons/acre</p>
            </div>
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+8.3% improvement</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Water Usage</p>
              <p className="text-2xl font-semibold text-purple-600">1,245 L/acre</p>
            </div>
            <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Droplets className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">-5.2% efficiency gain</span>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-semibold text-orange-600">38.2%</p>
            </div>
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <PieChartIcon className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+3.1% increase</span>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="yield" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="yield">Crop Yield</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="distribution">Crop Mix</TabsTrigger>
          <TabsTrigger value="weather">Weather Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="yield" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crop Yield Trends</h3>
              <div className="text-sm text-gray-500">Tons per acre</div>
            </div>
            <ChartContainer config={chartConfig} className="h-80">
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line 
                  type="monotone" 
                  dataKey="wheat" 
                  stroke="var(--color-wheat)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rice" 
                  stroke="var(--color-rice)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="corn" 
                  stroke="var(--color-corn)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Financial Performance</h3>
              <div className="text-sm text-gray-500">Amount in ₹</div>
            </div>
            <ChartContainer config={chartConfig} className="h-80">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" />
                <Bar dataKey="costs" fill="var(--color-costs)" />
                <Bar dataKey="profit" fill="var(--color-profit)" />
              </BarChart>
            </ChartContainer>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Crop Distribution by Area</h3>
              <ChartContainer config={chartConfig} className="h-64">
                <PieChart>
                  <Pie
                    data={cropDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {cropDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Crop Details</h3>
              <div className="space-y-3">
                {cropDistribution.map((crop, index) => (
                  <div key={crop.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="font-medium">{crop.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{crop.acres} acres</div>
                      <div className="text-sm text-gray-500">{crop.value}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weather" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Weather Impact on Yield</h3>
              <div className="text-sm text-gray-500">Correlation analysis</div>
            </div>
            <ChartContainer config={chartConfig} className="h-80">
              <AreaChart data={weatherImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="rainfall"
                  stroke="var(--color-rainfall)"
                  fill="var(--color-rainfall)"
                  fillOpacity={0.3}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="yield"
                  stroke="var(--color-yield)"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </AreaChart>
            </ChartContainer>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Yield Improvement</span>
            </div>
            <p className="text-sm text-green-700">
              Wheat yield has increased by 23% compared to last season due to optimized irrigation.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Water Efficiency</span>
            </div>
            <p className="text-sm text-blue-700">
              Implementing drip irrigation reduced water usage by 15% while maintaining crop quality.
            </p>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-800">Profit Growth</span>
            </div>
            <p className="text-sm text-orange-700">
              Focus on high-value crops like corn has improved overall profit margins by 12%.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}