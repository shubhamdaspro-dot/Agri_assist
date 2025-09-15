import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, Newspaper, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { news } from "@/lib/data";
import Image from "next/image";

export default function DashboardPage() {
  const latestNews = news.slice(0, 3);
  return (
    <div className="flex flex-col gap-8">
      <Card className="w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold font-headline mb-4">Welcome to AgriAssist!</h1>
            <p className="text-muted-foreground mb-6 text-lg">
              Your AI-powered partner for modern farming. Get crop recommendations, buy products, and stay updated with the latest agricultural news.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/recommendations">
                  <Leaf className="mr-2 h-5 w-5" />
                  Get Recommendation
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-full min-h-[250px]">
            <Image
              src="https://picsum.photos/seed/hero/1200/600"
              alt="Lush green farm field"
              fill
              className="object-cover"
              data-ai-hint="farm field"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Smart Farming</div>
            <p className="text-xs text-muted-foreground">
              Get data-driven crop and product suggestions.
            </p>
            <Button asChild variant="link" className="px-0">
                <Link href="/recommendations">
                    Start Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Shop Essentials</div>
            <p className="text-xs text-muted-foreground">
              Buy seeds, fertilizers, and tools directly.
            </p>
            <Button asChild variant="link" className="px-0">
                <Link href="/products">
                    Browse Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">News & Updates</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Stay Informed</div>
            <p className="text-xs text-muted-foreground">
              Latest agricultural news and policies.
            </p>
            <Button asChild variant="link" className="px-0">
                <Link href="/news">
                    Read News <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Latest News</h2>
        <div className="grid gap-4 md:grid-cols-3">
            {latestNews.map(article => (
                <Card key={article.id}>
                    <CardHeader>
                        <CardTitle className="text-lg">{article.headline}</CardTitle>
                        <CardDescription>{article.date} - {article.source}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">{article.summary}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
