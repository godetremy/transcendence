import { deleteCookie } from "@/lib/cookie";
import { prisma } from "../prisma/prisma";

export async function deleteUser(id : string) {
    await deleteCookie('session');  
    const value = await prisma.users.delete({
        where: {
            id: id,
        },
        include: {
            memberships: true,
            oauth_fortytwo: true,
        }
    });
    return value;
}