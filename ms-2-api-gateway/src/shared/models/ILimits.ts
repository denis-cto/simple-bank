interface ILimitsPeriod {
  startDate: string;
  endDate?: string | null;
}

interface ILimitsDaysRange {
  minValue: number | null;
  maxValue: number | null;
}
export interface ILimitListElement {
  limitId: string;
  daysValue: number;
  daysRange: ILimitsDaysRange;
  period: ILimitsPeriod;
}

export interface ILimitListElementResponse {
  id: string;
  days: number;
  interval: string;
  period: ILimitsPeriod;
}

export interface ILimitResponse {
  absenceLimits: ILimitListElementResponse[];
  limitsComment: string;
}

export interface ILimits{
  entityId: string;
  entityType: string;
  period: ILimitsPeriod;
  comments: string;
  absenceLimits: ILimitListElement[];
}
