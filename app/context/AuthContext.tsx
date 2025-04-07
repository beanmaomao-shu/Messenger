"use client";
// 提供全局身份验证状态
// 在子组件中可以直接使用 useSession 获取状态
import { SessionProvider } from "next-auth/react";

interface AuthContextProps {
  children: React.ReactNode;
}

export default function AuthContext({ children }: AuthContextProps) {
  return <SessionProvider>{children}</SessionProvider>;
}
