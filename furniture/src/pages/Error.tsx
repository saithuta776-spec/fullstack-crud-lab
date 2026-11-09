import Header from "@/components/layouts/Header";
import Footer from "@/components/newsletter";
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
import { Link } from "react-router";
import { Icons } from "@/components/ui/icons";
import { Icon } from "lucide-react";

export default function Error() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {/* <div className="">Error</div> */}
      <main className="flex items-center flex-1 mx-auto my-32">
        <Card className="w-[350px] md:w-[500px] lg:w-[500px] ">
          <CardHeader className="flex gap-2 flex-col items-center">
            <div className="border border-dashed border-muted-foreground/70 rounded-full size-24 grid place-items-center mt-2 mb-4">
              <Icons.exclamation
                className="size-10 text-muted-foreground/70"
                aria-hidden="true"
              />
            </div>

            <CardTitle>Oops!</CardTitle>
            <CardDescription>An error occurs immediately.</CardDescription>
          </CardHeader>
          <CardFooter className="flex-col gap-2 justify-center">
            <Button type="submit" className="w-full">
              <Link to="/">Go To Home Page</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
