'use client';
import { useLanguage } from '@/hooks/use-language';
import { loans_en, loans_hi } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function LoansPage() {
  const { t, language } = useLanguage();
  const loans = language === 'hi' ? loans_hi : loans_en;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('loans.page_title')}</h1>
        <p className="text-muted-foreground">
          {t('loans.page_subtitle')}
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>{t('loans.available_schemes')}</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {loans.map(loan => (
                <AccordionItem value={loan.id} key={loan.id}>
                    <AccordionTrigger className="text-lg font-semibold">{loan.title}</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                    <p className="text-muted-foreground">{loan.description}</p>
                    
                    <div>
                        <h4 className="font-semibold mb-2">{t('loans.eligibility_criteria')}</h4>
                        <ul className="space-y-1 list-inside">
                        {loan.eligibility.map((item, index) => (
                            <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                            </li>
                        ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">{t('loans.required_documents')}</h4>
                         <ul className="space-y-1 list-inside">
                        {loan.documents.map((item, index) => (
                            <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                            </li>
                        ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">{t('loans.application_process')}</h4>
                         <ul className="space-y-1 list-inside">
                        {loan.process.map((item, index) => (
                            <li key={index} className="flex items-start">
                            <Check className="h-4 w-4 mr-2 mt-1 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
