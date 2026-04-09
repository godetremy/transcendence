const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = `copilot-${Date.now()}@example.com`;

  const created = await prisma.user.create({
    data: {
      email,
      name: "Copilot Test User",
    },
  });

  const found = await prisma.user.findUnique({ where: { email } });

  const updated = await prisma.user.update({
    where: { id: created.id },
    data: { name: "Updated Copilot User" },
  });

  await prisma.user.delete({ where: { id: created.id } });

  console.log("CRUD_SUCCESS", {
    createdId: created.id,
    foundId: found?.id,
    updatedName: updated.name,
  });
}

main()
  .catch((error) => {
    console.error("CRUD_FAILED", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });