import Sidebar from "../components/Sidebar/Sidebar";
export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    //TypeScript 的类型系统还不能完全处理服务器组件的特殊性质
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
