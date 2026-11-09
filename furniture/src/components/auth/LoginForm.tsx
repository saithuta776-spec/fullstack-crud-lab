import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router";

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
import { PasswordInput } from "./Password-input";

// 1. Define Zod schema
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required.")
    .regex(/^\d{5,12}$/, "Phone number must contain 5–12 digits."),

  password: z
    .string()
    .min(1, "Password is required.")
    .regex(/^\d{8}$/, "Password must contain exactly 8 digits."),
});

// 2. Infer TypeScript type from schema
type LoginFormData = z.infer<typeof loginSchema>;

export function LogInForm() {
  // 3. Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  // 4. Handle valid form submission
  const onSubmit = (data: LoginFormData) => {
    console.log("Validated form data:", data);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>

        <CardDescription>
          Enter your phone number and password to login.
        </CardDescription>

        <CardAction>
          <Link to="/register">
            <Button variant="link">Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* Phone Number */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>

              <Input
                id="phone"
                type="tel"
                placeholder="09xxxxxxxxx"
                inputMode="numeric"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />

              {errors.phone && (
                <p className="text-destructive text-sm">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>

              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />

              {errors.password && (
                <p className="text-destructive text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Login
          </Button>

          <Button type="button" variant="outline" className="w-full" disabled>
            Login with Google
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
