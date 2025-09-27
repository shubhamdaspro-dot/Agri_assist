'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, LayoutDashboard, Leaf, TestTube, ShieldAlert, BarChart2, MessageCircle } from 'lucide-react';

export default function HelpPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const helpTopics = useMemo(() => [
    {
      id: 'getting-started',
      icon: LayoutDashboard,
      title: t('help.getting_started_title'),
      content: t('help.getting_started_content'),
    },
    {
      id: 'crop-recommendations',
      icon: Leaf,
      title: t('help.crop_recommendations_title'),
      content: t('help.crop_recommendations_content'),
    },
    {
      id: 'soil-analysis',
      icon: TestTube,
      title: t('help.soil_analysis_title'),
      content: t('help.soil_analysis_content'),
    },
    {
      id: 'disease-prevention',
      icon: ShieldAlert,
      title: t('help.disease_prevention_title'),
      content: t('help.disease_prevention_content'),
    },
    {
        id: 'market-analysis',
        icon: BarChart2,
        title: t('help.market_analysis_title'),
        content: t('help.market_analysis_content'),
    },
    {
      id: 'ai-assistant',
      icon: MessageCircle,
      title: t('help.ai_assistant_title'),
      content: t('help.ai_assistant_content'),
    },
  ], [t]);

  const filteredTopics = useMemo(() => {
    if (!searchTerm) {
      return helpTopics;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return helpTopics.filter(
      (topic) =>
        topic.title.toLowerCase().includes(lowercasedFilter) ||
        topic.content.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, helpTopics]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('help.page_title')}</h1>
        <p className="text-muted-foreground">{t('help.page_subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('help.search_title')}</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('help.search_placeholder')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-3">
                        <topic.icon className="h-5 w-5" />
                        {topic.title}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                    {topic.content}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">{t('help.no_results')}</p>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
