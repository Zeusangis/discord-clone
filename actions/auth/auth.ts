"use server";

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { encrypt } from "./jwt";
import { LoginFormData } from "@/schema/types";

export async function login(data: LoginFormData) {
  const { email, password } = data;
  if (!email || !password) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      success: false,
      message: "Invalid password",
    };
  }
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);
  const session = await encrypt({ id: user.id });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    expires,
    httpOnly: true,
    sameSite: true,
  });
  return {
    success: true,
    message: "Logged in successfully",
  };
}

export async function logout() {
  const cookieStore = await cookies();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  cookieStore.set("session", "", { expires: yesterday });
}

export async function register(data: any) {
  const { name, email, password } = data;
  if (!name || !email || !password) {
    return {
      success: false,
      message: "Please fill in all fields",
    };
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (existingUser) {
    return {
      success: false,
      message: "User already exists",
    };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await bcrypt.hash(password, 10),
    },
  });
  return {
    success: true,
    message: "User created successfully",
  };
}
