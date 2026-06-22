import { PrivateAlbum } from "@/types/album";
import { Prisma } from "../prisma/generated/client";

export function formatPrivateAlbum(row: Prisma.photos_albumGetPayload<{ include: {} }>): PrivateAlbum {
	return {
		...row,
	};
}