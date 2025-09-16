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
