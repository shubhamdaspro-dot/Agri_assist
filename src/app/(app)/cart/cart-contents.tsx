'use client';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { X, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function CartContents() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { t } = useLanguage();

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-semibold">{t('cart.empty_title')}</h2>
        <p className="mt-2 text-muted-foreground">{t('cart.empty_subtitle')}</p>
        <Button asChild className="mt-6">
          <Link href="/products">{t('cart.start_shopping_button')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>{t('cart.your_cart')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[100px]">{t('cart.table_product')}</TableHead>
                        <TableHead>{t('cart.table_details')}</TableHead>
                        <TableHead className="text-center">{t('cart.table_quantity')}</TableHead>
                        <TableHead className="text-right">{t('cart.table_price')}</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cartItems.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>
                            <Image src={item.image} alt={item.name} width={80} height={60} className="rounded-md object-cover" />
                            </TableCell>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-center">
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e => updateQuantity(item.id, parseInt(e.target.value, 10))}
                                    className="w-20 mx-auto"
                                />
                            </TableCell>
                            <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>{t('cart.summary_title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span>{t('cart.summary_subtotal')}</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>{t('cart.summary_shipping')}</span>
                        <span>{t('cart.summary_shipping_cost')}</span>
                    </div>
                     <div className="flex justify-between font-bold text-lg">
                        <span>{t('cart.summary_total')}</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">{t('cart.checkout_button')}</Button>
                    <Button variant="outline" className="w-full" onClick={clearCart}>{t('cart.clear_cart_button')}</Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
