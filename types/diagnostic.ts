export interface IntroData {
  name?: string;
  activity?: string;
  monthlyIncome?: number;
  keywords?: string[];
  expectations?: string;
  problems?: string[];
  currentPoint?: string;
  desiredPoint?: string;
  timeline?: string;
  dreamPoint?: string;
  marketingTools?: string;
  additionalInfo?: string;
}

export interface ProductLineData {
  leadMagnet?: string;
  cheapProduct?: string;
  mainProduct?: string;
  mainProductTariffs?: string;
  premiumProduct?: string;
}

export interface CompetencyData {
  traffic: number;
  expertise: number;
  sales: number;
  content: number;
  product: number;
  satisfaction: number;
}

export interface ToolsData {
  packaging?: string[];
  paidTraffic?: string[];
  content?: string[];
  funnel?: string[];
  technical?: string[];
  sales?: string[];
  product?: string[];
  // key format: `${category}-${tool}` -> 'high' | 'medium' | 'low'
  priorities?: Record<string, 'high' | 'medium' | 'low'>;
}

export interface FinanceData {
  miniProductPrice?: number;
  instagramAds?: number;
  leadPrice?: number;
  miniPurchases?: number;
  miniRevenue?: number;
  zoomPercent?: number;
  zoomCount?: number;
  conversionPercent?: number;
  salesCount?: number;
  averageCheck?: number;
  salesRevenue?: number;
}

export interface ActionItem {
  priority: number;
  task: string;
  competency: string;
  complexity: number;
  july: boolean;
  august: boolean;
  september: boolean;
}

export interface DiagnosticData {
  intro: IntroData;
  products: ProductLineData;
  competency: CompetencyData;
  tools: ToolsData;
  finance: FinanceData;
  plan: ActionItem[];
}