import { Member, User } from "@prisma/client";

export type ServerWithMemberWithUser = {
  name: string;
  members: (Member & { user: User })[];
};
