import Sidebar from "../components/Sidebar/Sidebar";
import getUsers from "@/app/actions/getUsers";
import UserList from "./components/UserList";
import { User } from "@prisma/client";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = (await getUsers()) as User[];
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
