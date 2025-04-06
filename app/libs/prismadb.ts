// 1. 防止热重载时创建多个数据库连接
// 2. 在开发环境中重用 Prisma 实例
// 3. 确保数据库连接的正确管理
// 这是 Next.js + Prisma 项目中的常见最佳实践
import { PrismaClient } from "@prisma/client";
declare global {
  let prisma: PrismaClient | undefined;
}
// 创建 Prisma 客户端实例。如果全局已存在则复用，否则创建新实例
const client = globalThis.prisma || new PrismaClient();
// 在非生产环境下，将客户端实例保存到全局变量。这样在开发时的热重载不会创建多个连接
if (process.env.ENV != "production") globalThis.prisma = client;

export default client;
