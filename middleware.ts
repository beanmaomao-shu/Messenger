//用于路由保护和认证控制，Next.js的中间件文件
import { withAuth } from "next-auth/middleware";
export default withAuth({
  pages: {
    signIn: "/",
  },
});
export const config = {
  matcher: ["/users/:path*"],
};
