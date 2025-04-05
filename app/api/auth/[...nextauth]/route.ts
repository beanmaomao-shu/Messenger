import bcrypt from "bcrypt";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";
// NextAuth.js 的配置文件，实现了完整的用户认证系统。
// 通过 PrismaAdapter 将用户认证数据存储到数据库

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  //认证提供商配置
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        // 1. 验证输入
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }
        // 2. 查找用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        // 3. 验证用户存在和密码
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid Credentials");
        }
        // 4. 比对密码
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        return user;
      },
    }),
  ],
  //NextAuth.js 的调试配置： 在开发环境下启用调试模式，会在控制台输出详细的认证过程日志
  debug: process.env.NODE_ENV === "development",
  //会话配置
  session: {
    strategy: "jwt", // 使用 JWT 令牌策略
  },
  secret: process.env.NEXTAUTH_SECRET, // 加密密钥
};
//Next.js 13+ 的 App Router 路由处理
const handler = NextAuth(authOptions);
// 创建一个处理认证请求的处理器,导出同一个处理器来处理不同的 HTTP 方法
export { handler as GET, handler as POST };
