"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaDiscord, FaGoogle, FaGithub } from "react-icons/fa";
import { register as registerUser } from "@/actions/auth/auth";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData) {
    try {
      const response = await registerUser(data);
      console.log(response);
      // Handle successful registration (e.g., redirect to login page or show success message)
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle registration error (e.g., show error message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#36393f] p-4">
      <Card className="w-full max-w-md bg-[#2f3136] border-none shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <FaDiscord className="text-[#5865F2] text-5xl" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-white">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-[#b9bbbe]">
            Step In. Speak Up. Stay Connected.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-[#b9bbbe] uppercase text-xs font-bold"
              >
                Full Name
              </Label>
              <Input
                id="name"
                placeholder="Enter your name"
                {...register("name")}
                className={`bg-[#202225] border-none text-white placeholder-[#72767d] ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[#b9bbbe] uppercase text-xs font-bold"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={`bg-[#202225] border-none text-white placeholder-[#72767d] ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-[#b9bbbe] uppercase text-xs font-bold"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password")}
                className={`bg-[#202225] border-none text-white placeholder-[#72767d] ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#4f545c]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#2f3136] px-2 text-[#b9bbbe]">Or</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full bg-[#202225] text-white border-none hover:bg-[#36393f]"
            >
              <FaGoogle className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[#202225] text-white border-none hover:bg-[#36393f]"
            >
              <FaGithub className="mr-2 h-4 w-4" /> GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-[#b9bbbe] mt-2 w-full">
            Already have an account?{" "}
            <a className="text-[#00b0f4] hover:underline" href="/login">
              Login
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
