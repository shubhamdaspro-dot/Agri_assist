import type { Product, LoanScheme } from './types';
import { PlaceHolderImages } from './placeholder-images';
import { Droplets, Mountain, Wind } from 'lucide-react';

const getPlaceholderImage = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id)?.imageUrl || 'https://placehold.co/400x300';
}
const getPlaceholderImageHint = (id: string) => {
    return PlaceHolderImages.find(img => img.id === id)?.imageHint || 'product';
}

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Premium Wheat Seeds',
    price: 1999.00,
    description: 'High-yield, disease-resistant wheat seeds for a bountiful harvest.',
    image: getPlaceholderImage('wheat-seeds'),
    imageHint: getPlaceholderImageHint('wheat-seeds'),
    category: 'Seeds',
  },
  {
    id: 'prod_2',
    name: 'All-Purpose Fertilizer',
    price: 1499.00,
    description: 'NPK balanced fertilizer for healthy plant growth.',
    image: getPlaceholderImage('fertilizer-bag'),
    imageHint: getPlaceholderImageHint('fertilizer-bag'),
    category: 'Fertilizers',
  },
  {
    id: 'prod_3',
    name: 'Organic Pest Control',
    price: 999.00,
    description: 'Neem-based organic solution to protect your crops from common pests.',
    image: getPlaceholderImage('organic-pesticide'),
    imageHint: getPlaceholderImageHint('organic-pesticide'),
    category: 'Pesticides',
  },
  {
    id: 'prod_4',
    name: 'Stainless Steel Trowel',
    price: 499.00,
    description: 'Ergonomic and durable trowel for all your planting needs.',
    image: getPlaceholderImage('trowel'),
    imageHint: getPlaceholderImageHint('trowel'),
    category: 'Tools',
  },
  {
    id: 'prod_5',
    name: 'Heavy-Duty Watering Can',
    price: 799.00,
    description: '5-gallon capacity watering can, built to last.',
    image: getPlaceholderImage('watering-can'),
    imageHint: getPlaceholderImageHint('watering-can'),
    category: 'Tools',
  },
    {
    id: 'prod_6',
    name: 'Gardening Gloves',
    price: 299.00,
    description: 'Protective and comfortable gloves for all gardening tasks.',
    image: getPlaceholderImage('gardening-gloves'),
    imageHint: getPlaceholderImageHint('gardening-gloves'),
    category: 'Tools',
  },
];

export const loans_en: LoanScheme[] = [
    {
        id: 'loan_1',
        title: 'Kisan Credit Card (KCC) Scheme',
        description: 'A scheme to provide farmers with timely access to credit for their cultivation and other needs.',
        eligibility: ['All farmers - individuals/joint borrowers who are owner cultivators.', 'Tenant farmers, oral lessees & sharecroppers.', 'Self Help Groups (SHGs) or Joint Liability Groups (JLGs) of farmers including tenant farmers.'],
        documents: ['Duly filled application form.', 'Identity proof (Aadhaar card, PAN card, Voter ID, driving license, etc.).', 'Address proof (Aadhaar card, utility bill, etc.).', 'Land documents.'],
        process: ['Visit the nearest bank branch and ask for the KCC application form.', 'Fill the form and submit it with the required documents.', 'The bank will review the application and sanction the credit card upon successful verification.'],
        link: 'https://pmkisan.gov.in/KCC/KCC_New.aspx'
    },
    {
        id: 'loan_2',
        title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        description: 'An insurance service for farmers for their yields.',
        eligibility: ['All farmers including sharecroppers and tenant farmers growing notified crops in the notified areas are eligible for coverage.'],
        documents: ['Land records (RoR, Land possession Certificate).', 'Bank passbook.', 'Aadhaar card.', 'Sowing declaration.'],
        process: ['Farmers can enroll for the scheme through their nearest bank, Primary Agricultural Credit Society (PACS), or authorized insurance company.', 'The premium is deducted from the loan account for loanee farmers or paid directly by non-loanee farmers.'],
        link: 'https://pmfby.gov.in/'
    },
    {
        id: 'loan_3',
        title: 'Agricultural Term Loan',
        description: 'For purchasing new machinery, equipment, or for other development activities.',
        eligibility: ['Individual farmers or groups of farmers with a clear credit history.', 'Proof of land ownership and farming activity.'],
        documents: ['Project report on the proposed activity.', 'Quotation for machinery/equipment.', 'Land records.', 'Proof of income. '],
        process: ['Prepare a detailed project report (DPR).', 'Approach a commercial or cooperative bank with the DPR and application form.', 'The bank will appraise the project\'s viability and sanction the loan.'],
        link: 'https://www.nabard.org/content.aspx?id=517'
    },
    {
        id: 'loan_4',
        title: 'Agri-Infra Fund Scheme',
        description: 'A financing facility for creating post-harvest management infrastructure and community farming assets.',
        eligibility: ['Primary Agricultural Credit Societies (PACS), FPOs, SHGs, and Joint Liability Groups (JLGs).'],
        documents: ['Detailed Project Report (DPR).', 'Land records and ownership proof.', 'Bank statements for the last 6 months.', 'Identity and address proofs.'],
        process: ['Apply online through the national portal (agriinfra.dac.gov.in).', 'The application is forwarded to selected financial institutions for appraisal and sanction.'],
        link: 'https://agriinfra.dac.gov.in/'
    },
    {
        id: 'loan_5',
        title: 'PM-KUSUM Scheme',
        description: 'A scheme to promote the use of solar pumps for irrigation and solarize agricultural feeders.',
        eligibility: ['Individual farmers, groups of farmers, FPOs, and cooperatives.', 'Applicant must have a valid Aadhaar card and land records.'],
        documents: ['Land ownership documents.', 'Aadhaar card.', 'Bank account details.', 'Declaration of no existing electricity connection for the pump.'],
        process: ['Apply through the state nodal agencies or the national portal.', 'The application is verified, and upon approval, the subsidy is disbursed to the vendor.'],
        link: 'https://pmkusum.mnre.gov.in/'
    }
];

export const loans_hi: LoanScheme[] = [
    {
        id: 'loan_1',
        title: 'किसान क्रेडिट कार्ड (KCC) योजना',
        description: 'किसानों को उनकी खेती और अन्य जरूरतों के लिए समय पर ऋण उपलब्ध कराने की एक योजना।',
        eligibility: ['सभी किसान - व्यक्तिगत/संयुक्त उधारकर्ता जो मालिक कृषक हैं।', 'किराएदार किसान, मौखिक पट्टेदार और बटाईदार।', 'किसानों के स्वयं सहायता समूह (SHG) या संयुक्त देयता समूह (JLG) जिसमें किराएदार किसान भी शामिल हैं।'],
        documents: ['विधिवत भरा हुआ आवेदन पत्र।', 'पहचान प्रमाण (आधार कार्ड, पैन कार्ड, वोटर आईडी, ड्राइविंग लाइसेंस, आदि)।', 'पता प्रमाण (आधार कार्ड, उपयोगिता बिल, आदि)।', 'भूमि दस्तावेज।'],
        process: ['निकटतम बैंक शाखा में जाएं और केसीसी आवेदन पत्र मांगें।', 'फॉर्म भरें और आवश्यक दस्तावेजों के साथ जमा करें।', 'बैंक आवेदन की समीक्षा करेगा और सफल सत्यापन पर क्रेडिट कार्ड स्वीकृत करेगा।'],
        link: 'https://pmkisan.gov.in/KCC/KCC_New.aspx'
    },
    {
        id: 'loan_2',
        title: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
        description: 'किसानों की पैदावार के लिए एक बीमा सेवा।',
        eligibility: ['अधिसूचित क्षेत्रों में अधिसूचित फसलें उगाने वाले बटाईदारों और किराएदार किसानों सहित सभी किसान कवरेज के लिए पात्र हैं।'],
        documents: ['भूमि रिकॉर्ड (RoR, भूमि कब्जा प्रमाण पत्र)।', 'बैंक पासबुक।', 'आधार कार्ड।', 'बुवाई घोषणा।'],
        process: ['किसान अपने निकटतम बैंक, प्राथमिक कृषि ऋण समिति (PACS), या अधिकृत बीमा कंपनी के माध्यम से योजना के लिए नामांकन कर सकते हैं।', 'ऋणी किसानों के लिए प्रीमियम ऋण खाते से काटा जाता है या गैर-ऋणी किसानों द्वारा सीधे भुगतान किया जाता है।'],
        link: 'https://pmfby.gov.in/'
    },
    {
        id: 'loan_3',
        title: 'कृषि सावधि ऋण',
        description: 'नई मशीनरी, उपकरण खरीदने या अन्य विकास गतिविधियों के लिए।',
        eligibility: ['स्पष्ट क्रेडिट इतिहास वाले व्यक्तिगत किसान या किसानों के समूह।', 'भूमि के स्वामित्व और खेती की गतिविधि का प्रमाण।'],
        documents: ['प्रस्तावित गतिविधि पर परियोजना रिपोर्ट।', 'मशीनरी/उपकरण के लिए कोटेशन।', 'भूमि रिकॉर्ड।', 'आय का प्रमाण।'],
        process: ['एक विस्तृत परियोजना रिपोर्ट (DPR) तैयार करें।', 'डीपीआर और आवेदन पत्र के साथ एक वाणिज्यिक या सहकारी बैंक से संपर्क करें।', 'बैंक परियोजना की व्यवहार्यता का मूल्यांकन करेगा और ऋण स्वीकृत करेगा।'],
        link: 'https://www.nabard.org/content.aspx?id=517'
    },
    {
        id: 'loan_4',
        title: 'एग्री-इन्फ्रा फंड योजना',
        description: 'फसल कटाई के बाद के प्रबंधन के बुनियादी ढांचे और सामुदायिक कृषि संपत्तियों के निर्माण के लिए एक वित्तपोषण सुविधा।',
        eligibility: ['प्राथमिक कृषि ऋण समितियाँ (PACS), FPOs, SHGs, और संयुक्त देयता समूह (JLGs)।'],
        documents: ['विस्तृत परियोजना रिपोर्ट (DPR)।', 'भूमि रिकॉर्ड और स्वामित्व का प्रमाण।', 'पिछले 6 महीनों के बैंक विवरण।', 'पहचान और पते का प्रमाण।'],
        process: ['राष्ट्रीय पोर्टल (agriinfra.dac.gov.in) के माध्यम से ऑनलाइन आवेदन करें।', 'आवेदन मूल्यांकन और मंजूरी के लिए चयनित वित्तीय संस्थानों को भेजा जाता है।'],
        link: 'https://agriinfra.dac.gov.in/'
    },
    {
        id: 'loan_5',
        title: 'पीएम-कुसुम योजना',
        description: 'सिंचाई के लिए सौर पंपों के उपयोग को बढ़ावा देने और कृषि फीडरों को सौर ऊर्जा से लैस करने की एक योजना।',
        eligibility: ['व्यक्तिगत किसान, किसानों के समूह, FPOs, और सहकारी समितियाँ।', 'आवेदक के पास वैध आधार कार्ड और भूमि रिकॉर्ड होना चाहिए।'],
        documents: ['भूमि स्वामित्व के दस्तावेज।', 'आधार कार्ड।', 'बैंक खाते का विवरण।', 'पंप के लिए कोई मौजूदा बिजली कनेक्शन न होने की घोषणा।'],
        process: ['राज्य नोडल एजेंसियों या राष्ट्रीय पोर्टल के माध्यम से आवेदन करें।', 'आवेदन सत्यापित किया जाता है, और अनुमोदन पर, सब्सिडी विक्रेता को वितरित की जाती है।'],
        link: 'https://pmkusum.mnre.gov.in/'
    }
];

export const waterSources = [
    { id: 'Rain Only', labelKey: 'recommendations.water_rain', icon: Droplets },
    { id: 'Canal / River', labelKey: 'recommendations.water_canal', icon: Mountain },
    { id: 'Borewell / Tubewell', labelKey: 'recommendations.water_borewell', icon: Wind },
];
