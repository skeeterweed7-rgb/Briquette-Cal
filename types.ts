export interface CalculationData {
  acres: number;
  sqFt: number;
  briquettes: number;
}

export interface AIReportState {
  isLoading: boolean;
  content: string | null;
  error: string | null;
}
