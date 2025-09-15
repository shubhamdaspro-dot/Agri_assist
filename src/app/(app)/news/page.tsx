import { news } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Agricultural News & Updates</h1>
        <p className="text-muted-foreground">
          Stay informed with the latest news, policies, and market trends.
        </p>
      </div>
      <div className="space-y-6">
        {news.map(article => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle className="text-xl">{article.headline}</CardTitle>
              <CardDescription>{article.date} - {article.source}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{article.summary}</p>
              <p className="text-sm whitespace-pre-line">{article.fullStory}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
