import { Injector } from "naystack/graphql/server";
import type { Metadata } from "next";
import { connection } from "next/server";
import { db } from "../../api/lib/db";
import { UserTable } from "../../api/(graphql)/User/db";
import UsersList from "./users-list";

export const metadata: Metadata = {
  title: "Users | Admin Dashboard",
};

async function fetchUsers() {
  await connection();
  const users = await db
    .select({
      id: UserTable.id,
      name: UserTable.name,
      email: UserTable.email,
    })
    .from(UserTable);
  return users;
}

export default function UsersPage() {
  return <Injector fetch={fetchUsers} Component={UsersList} />;
}
