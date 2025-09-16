import type { Product, NewsArticle, LoanScheme } from './types';

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Premium Wheat Seeds',
    price: 1999.00,
    description: 'High-yield, disease-resistant wheat seeds for a bountiful harvest.',
    image: 'https://picsum.photos/seed/seeds/400/300',
    category: 'Seeds',
  },
  {
    id: 'prod_2',
    name: 'All-Purpose Fertilizer',
    price: 1499.00,
    description: 'NPK balanced fertilizer for healthy plant growth.',
    image: 'https://picsum.photos/seed/fertilizer/400/300',
    category: 'Fertilizers',
  },
  {
    id: 'prod_3',
    name: 'Organic Pest Control',
    price: 999.00,
    description: 'Neem-based organic solution to protect your crops from common pests.',
    image: 'https://picsum.photos/seed/pesticide/400/300',
    category: 'Pesticides',
  },
  {
    id: 'prod_4',
    name: 'Stainless Steel Trowel',
    price: 499.00,
    description: 'Ergonomic and durable trowel for all your planting needs.',
    image: 'https://picsum.photos/seed/trowel/400/300',
    category: 'Tools',
  },
  {
    id: 'prod_5',
    name: 'Heavy-Duty Watering Can',
    price: 799.00,
    description: '5-gallon capacity watering can, built to last.',
    image: 'https://picsum.photos/seed/wateringcan/400/300',
    category: 'Tools',
  },
    {
    id: 'prod_6',
    name: 'Gardening Gloves',
    price: 299.00,
    description: 'Protective and comfortable gloves for all gardening tasks.',
    image: 'https://picsum.photos/seed/gloves/400/300',
    category: 'Tools',
  },
];

export const news: NewsArticle[] = [
    {
        id: 'news_1',
        headline: 'Government Announces New Subsidy for Drip Irrigation Systems',
        summary: 'In a major boost to water conservation efforts, the Ministry of Agriculture has announced a 50% subsidy on drip irrigation systems for small and marginal farmers.',
        fullStory: 'The Ministry of Agriculture unveiled a new scheme today aimed at promoting water-efficient farming practices. Under this scheme, small and marginal farmers will be eligible for a 50% subsidy on the purchase and installation of drip irrigation systems. Officials state this move is expected to reduce water consumption in agriculture by up to 60% and improve crop yields. Applications will be accepted online starting next month.',
        date: '2024-07-28',
        source: 'Ministry of Agriculture Press Release'
    },
    {
        id: 'news_2',
        headline: 'Weather Advisory: Heatwave Expected to Impact Northern Regions',
        summary: 'The National Weather Service has issued a heatwave alert for the upcoming week, advising farmers to take precautionary measures to protect their crops and livestock.',
        fullStory: 'Farmers in the northern states are advised to prepare for a severe heatwave projected to last from August 5th to August 12th. Temperatures are expected to soar 5-7 degrees above normal. The advisory recommends ensuring adequate irrigation, using shade nets for sensitive crops, and providing sufficient water and shelter for livestock. Farmers are encouraged to monitor weather updates closely.',
        date: '2024-07-27',
        source: 'National Weather Service'
    },
    {
        id: 'news_3',
        headline: 'Market Watch: Tomato Prices Surge Amidst Supply Chain Disruptions',
        summary: 'Retail prices of tomatoes have seen a sharp increase of over 40% in the last two weeks due to transportation issues and crop damage from unseasonal rains.',
        fullStory: 'A combination of factors, including recent unseasonal rains in key growing areas and logistical bottlenecks, has led to a significant surge in tomato prices across the country. Experts predict that prices will remain high for the next few weeks until the supply chain stabilizes. The government is reportedly considering importing tomatoes to curb the price rise.',
        date: '2024-07-26',
        source: 'Agri-Market Today'
    }
];

export const loans: LoanScheme[] = [
    {
        id: 'loan_1',
        title: 'Kisan Credit Card (KCC) Scheme',
        description: 'A scheme to provide farmers with timely access to credit for their cultivation and other needs.',
        eligibility: ['All farmers - individuals/joint borrowers who are owner cultivators.', 'Tenant farmers, oral lessees & sharecroppers.', 'Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers including tenant farmers.'],
        documents: ['Duly filled application form.', 'Identity proof (Aadhaar card, PAN card, Voter ID, driving license, etc.).', 'Address proof (Aadhaar card, utility bill, etc.).', 'Land documents.'],
        process: ['Visit the nearest bank branch and ask for the KCC application form.', 'Fill the form and submit it with the required documents.', 'The bank will review the application and sanction the credit card upon successful verification.']
    },
    {
        id: 'loan_2',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'An insurance service for farmers for their yields.',
        eligibility: ['All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.'],
        documents: ['Land records (RoR, Land possession Certificate).', 'Bank passbook.', 'Aadhaar card.', 'Sowing declaration.'],
        process: ['Farmers can enroll for the scheme through their nearest bank, Primary Agricultural Credit Society (PACS), or authorized insurance company.', 'The premium is deducted from the loan account for loanee farmers or paid directly by non-loanee farmers.']
    },
    {
        id: 'loan_3',
        title: 'Agricultural Term Loan',
        description: 'For purchasing new machinery, equipment, or for other development activities.',
        eligibility: ['Individual farmers or groups of farmers with a clear credit history.', 'Proof of land ownership and farming activity.'],
        documents: ['Project report on the proposed activity.', 'Quotation for machinery/equipment.', 'Land records.', 'Proof of income. '],
        process: ['Prepare a detailed project report (DPR).', 'Approach a commercial or cooperative bank with the DPR and application form.', 'The bank will appraise the project\'s viability and sanction the loan.']
    }
];
