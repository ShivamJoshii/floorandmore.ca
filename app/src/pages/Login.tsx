import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Customer accounts coming soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-stone">
            Sign-in and customer accounts aren't available yet. In the meantime, you can browse our products,
            build a quote, or get in touch.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild className="w-full" size="lg">
              <Link to="/products">Browse Products</Link>
            </Button>
            <Button asChild className="w-full" size="lg" variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
