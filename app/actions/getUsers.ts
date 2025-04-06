import prisma from "@/app/libs/prismadb";

import getSession from "./getSession";

const getUsers = async () => {
  const session = await getSession();
  if (!session?.user?.email) {
    return [];
  }
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createAt: "desc",
      },
      where: {
        NOT: {
          email: session.user.email,
        },
      },
    });
    console.log("=================== Users Data ===================");
    console.log("Found users:", JSON.stringify(users, null, 2));
    console.log("================================================");
    return users;
  } catch (error) {
    console.log("Error fetching users:", error);
    return [];
  }
};

export default getUsers;
