import { loans } from '@/lib/data';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

export default function LoansPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Agricultural Loan Schemes</h1>
        <p className="text-muted-foreground">
          Information on government-supported loan schemes for farmers.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Available Schemes</CardTitle>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {loans.map(loan => (
                <AccordionItem value={loan.id} key={loan.id}>
                    <AccordionTrigger className="text-lg font-semibold">{loan.title}</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                    <p className="text-muted-foreground">{loan.description}</p>
                    
                    <div>
                        <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
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
                        <h4 className="font-semibold mb-2">Required Documents</h4>
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
                        <h4 className="font-semibold mb-2">Application Process</h4>
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
