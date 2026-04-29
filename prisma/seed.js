const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const quests = [
  { title: "Mystery Cup Roulette", category: "DRINKS", description: "Drink something you did not pick.", points: 10, drinks: 1, icon: "CUP" },
  { title: "3-Peat", category: "DRINKS", description: "Complete drink, seltzer, beer.", points: 15, drinks: 1, icon: "3" },
  { title: "Hydration Hero", category: "BONUS", description: "Drink water. Be a legend.", points: 5, drinks: 0, icon: "H2O" },
  { title: "Album Cover Drop", category: "PHOTO", description: "Recreate an album cover.", points: 15, drinks: 0, icon: "CAM" },
  { title: "Main Character Energy", category: "PHOTO", description: "Take your best main character pic.", points: 10, drinks: 0, icon: "*" },
  { title: "Group Cheers", category: "PARTY", description: "Group toast photo.", points: 15, drinks: 0, icon: "!!!" },
];

const badges = [
  { name: "3 in a Row", icon: "3", description: "Complete 3 approved quests in a row" },
  { name: "Hydration Hero", icon: "H2O", description: "Drink water, be a legend" },
  { name: "Major Character", icon: "*", description: "Serve a photo moment" },
  { name: "Social Butterfly", icon: "SB", description: "Submit a group cheers photo" },
  { name: "Party Starter", icon: "GO", description: "First approved quest of the night" },
];

async function main() {
  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { title: quest.title },
      update: quest,
      create: quest,
    });
  }

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: badge,
      create: badge,
    });
  }

  console.log("Seeded quests and badges. Users will be created from the join screen.");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
