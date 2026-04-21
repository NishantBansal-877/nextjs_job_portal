"use client";
import { AtSign, Lock, Eye, EyeOff, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { ChangeEvent, useState } from "react";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { loginUserAction } from "@/src/features/auth/server/auth.actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginUserDaata,
  loginUserSchema,
} from "@/src/features/auth/auth.schema";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginUserSchema),
  });

  const onSubmit = async (data: LoginUserDaata) => {
    try {
      const result = await loginUserAction(data);
      if (result.status === "SUCCESS") toast.success(result.message);
      else toast.error(result.message);
    } catch (error) {}
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center">
          <UserCheck
            className="bg-black text-white p-3 rounded-4xl"
            height={50}
            width={50}
          />
          <CardTitle className="text-2xl">Join our job portal</CardTitle>
          <CardDescription>Sign in with your account </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  {...register("email")}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className={`pl-10 pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden ${errors.password ? "border-destructive" : ""}`}
                  {...register("password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Register
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                >
                  {" "}
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
