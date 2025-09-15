export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides' | 'Tools';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  fullStory: string;
  date: string;
  source: string;
}

export interface LoanScheme {
  id: string;
  title: string;
  description: string;
  eligibility: string[];
  documents: string[];
  process: string[];
}
