// 用户注册的 API 路由处理程序
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 解析请求体
    const body = await request.json();
    const { email, name, password } = body;
    if (!email || !name || !password) {
      return new NextResponse("Missing info", { status: 400 });
    }

    // bcrypt.hash(原密码, 加密轮数) 12 是加密强度，数字越大越安全，但耗时越长
    const hashedPassword = await bcrypt.hash(password, 12);

    // prisma.user.create() 在数据库中创建新用户记录
    // data 对象包含要存储的用户信息
    // 这里使用了 ES6 的对象属性简写语法
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // NextResponse.json() 是 Next.js 提供的响应助手方法，将用户对象转换为 JSON 格式返回，
    return NextResponse.json(user);
  } catch (error) {
    console.log(error, "REGISTER_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}
