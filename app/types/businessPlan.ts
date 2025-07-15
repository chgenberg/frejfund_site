// Base question type
export type BaseQuestion = {
  id: string;
  label: string;
  required: boolean;
  help: string;
  exampleAnswers?: string[];
};

// Specific question types
export type TextQuestion = BaseQuestion & {
  type: 'textarea' | 'text' | 'file';
};

export type NumberQuestion = BaseQuestion & {
  type: 'number';
  min?: number;
  max?: number;
};

export type MilestoneQuestion = BaseQuestion & {
  type: 'milestone_list';
};

export type FounderMarketFitQuestion = BaseQuestion & {
  type: 'founder_market_fit';
};

export type SelectQuestion = BaseQuestion & {
  type: 'select';
  options: string[];
};

export type RadioQuestion = BaseQuestion & {
  type: 'radio';
  options: string[];
};

export type CapitalMatrixQuestion = BaseQuestion & {
  type: 'capital_matrix';
};

export type EsgCheckboxQuestion = BaseQuestion & {
  type: 'esg_checkbox';
};

export type MarketSizeQuestion = BaseQuestion & {
  type: 'market_size';
};

// Combined question type
export type Question = {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'number' | 'select' | 'radio' | 'file' | 
        'milestone_list' | 'capital_matrix' | 'founder_market_fit' | 
        'esg_questions' | 'market_size' | 'multi_input' | 'scale' | 'percentage';
  required: boolean;
  help?: string;
  options?: string[];
  placeholder?: string;
  min?: number;
  max?: number;
  multiInputs?: {
    id: string;
    label: string;
    type: 'text' | 'number' | 'percentage';
    placeholder?: string;
  }[];
};

export type QuestionSection = {
  id: string;
  title: string;
  icon: string;
  questions: Question[];
};

// Type guards
export function isSelectQuestion(question: Question): question is SelectQuestion {
  return question.type === 'select' || question.type === 'radio';
}

export function isTextQuestion(question: Question): question is TextQuestion {
  return question.type === 'textarea' || question.type === 'text' || question.type === 'file';
}

export function isMilestoneQuestion(question: Question): question is MilestoneQuestion {
  return question.type === 'milestone_list';
}

export function isCapitalQuestion(question: Question): question is CapitalMatrixQuestion {
  return question.type === 'capital_matrix';
}

export function isESGQuestion(question: Question): question is Question {
  return question.type === 'esg_questions';
}

export function isFounderMarketFitQuestion(question: Question): question is FounderMarketFitQuestion {
  return question.type === 'founder_market_fit';
}

export function isNumberQuestion(question: Question): question is NumberQuestion {
  return question.type === 'number';
}

export function isMarketSizeQuestion(question: Question): question is MarketSizeQuestion {
  return question.type === 'market_size';
}

// Business plan interfaces
export interface BusinessIdea {
  what_you_do: string;
  for_whom: string;
  why_unique: string;
}

export interface CustomerSegments {
  customer_group: string;
  customer_needs: string;
  customer_location: string;
}

export interface ProblemSolution {
  problem: string;
  solution: string;
  unique_value: string;
}

export interface MarketAnalysis {
  market_size: string;
  competitors: string;
  market_trends: string;
  market_source?: string;
}

export interface BusinessModel {
  revenue_model: string;
  pricing_strategy: string;
  sales_channels: string;
}

export interface Team {
  key_people: string;
  roles: string;
  expertise: string;
  [key: string]: string;
}

export interface FundingDetails {
  funding_needed: string;
  use_of_funds: string;
  exit_strategy: string;
}

export type BusinessPlanValue = string | string[] | Record<string, string>;

export interface BusinessPlanSection {
  [key: string]: string;
}

export interface BusinessPlanAnswers {
  company_name: string;
  business_idea: BusinessPlanSection;
  customer_segments: BusinessPlanSection;
  problem_solution: BusinessPlanSection;
  market_analysis: BusinessPlanSection;
  business_model: BusinessPlanSection;
  team: BusinessPlanSection;
  funding_details: BusinessPlanSection;
  market_potential?: BusinessPlanSection;
  competition?: BusinessPlanSection;
  [key: string]: string | BusinessPlanSection | undefined;
}

// Component prop types
export interface MilestoneListProps {
  value: { 
    milestones: { 
      text: string; 
      date: string 
    }[] 
  };
  onChange: (val: any) => void;
}

export interface CapitalMatrixInputProps {
  value: { 
    matrix: string[][]; 
    text: string 
  };
  onChange: (val: any) => void;
}

export interface BusinessPlanWizardProps {
  open: boolean;
  onClose: () => void;
} 