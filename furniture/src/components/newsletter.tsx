import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/ui/icons";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// 1. Define the validation schema using Zod
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." }),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function Footer() {
  // 2. Setup react-hook-form with the Zod resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),

    defaultValues: {
      email: "",
    },
  });

  // 3. Handle form submission
  const onSubmit = (data: NewsletterFormValues) => {
    console.log("Newsletter Email Submitted:", data);
    alert(`Thank you for subscribing, ${data.email}!`);
    reset(); // Clear the input field
  };

  return (
    <footer className="w-full border-t px-4 lg:px-0">
      <div className="container mx-auto py-10">
        <section className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-16">
          <Link to="/" className="flex space-x-2">
            <Icons.logo className="size-6" aria-hidden="true" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <section className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {siteConfig.footerNav.map((foot) => (
              <div key={foot.title} className="space-y-3">
                <h4 className="text-sm font-bold">{foot.title}</h4>
                <ul className="space-y-2">
                  {foot.items.map((data) => (
                    <li key={data.title}>
                      <Link
                        to={data.href}
                        target={data.external ? "_blank" : undefined}
                        rel={data.external ? "noreferrer" : undefined}
                        className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                      >
                        {data.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          {/* Brand & Newsletter Column */}
          <div className="space-y-4 lg:max-w-xs">
            <p className="text-muted-foreground text-sm">
              Subscribe to our newsletter for the latest furniture updates and
              promotions.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative w-full">
                  <Icons.paper className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    className={
                      errors.email
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    }
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="shrink-0"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>

              {/* Validation Error Message */}
              {errors.email && (
                <p className="text-destructive text-xs font-medium">
                  {errors.email.message}
                </p>
              )}
            </form>
          </div>

          {/* Footer Navigation Grid */}
        </section>
      </div>
    </footer>
  );
}
