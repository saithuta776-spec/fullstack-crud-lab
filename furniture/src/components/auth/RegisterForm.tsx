import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";

export function RegisterForm() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="">
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Create a new account</CardDescription>
        </div>
        <div className="">
          <CardAction className="">
            <Link to={`/logIn`} className="">
              <Button variant="link">Already had an account?</Button>
            </Link>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-2">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              ></a>
              <Input id="password" type="password" required />

              <Label htmlFor="confirm-password">Confirm Password</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              ></a>
              <Input id="confirm-password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Sign Up
        </Button>
        <Button variant="outline" className="w-full">
          Sign Up with Google
        </Button>
      </CardFooter>
    </Card>
  );
}
