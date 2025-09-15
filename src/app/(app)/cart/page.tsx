import CartContents from "./cart-contents";

export default function CartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Shopping Cart</h1>
        <p className="text-muted-foreground">Review and manage the items in your cart.</p>
      </div>
      <CartContents />
    </div>
  );
}
