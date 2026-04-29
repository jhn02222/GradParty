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

const users = [
  ["Chris J.", "The Grad", 380, 18],
  ["Sarah L.", "Streak Queen", 352, 15],
  ["Mike D.", "Cup Scout", 331, 13],
  ["Emily B.", "Main Character", 310, 12],
  ["Alex S.", "Group Chat Captain", 288, 10],
  ["Jessica R.", "Photo Boss", 245, 9],
  ["Davis E.", "Snack Patrol", 231, 8],
  ["Tyler G.", "Fit Check", 212, 7],
  ["Hannah W.", "Hydrated", 188, 6],
  ["James K.", "Late Arrival", 165, 5],
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

  for (const [name, nickname, points, drinks] of users) {
    const existing = await prisma.user.findFirst({ where: { name } });
    if (!existing) {
      await prisma.user.create({
        data: {
          name,
          nickname,
          points,
          drinks,
          photoUrl: name.split(" ").map((part) => part[0]).join(""),
        },
      });
    }
  }

  const chris = await prisma.user.findFirst({ where: { name: "Chris J." } });
  if (chris) {
    const count = await prisma.feedItem.count();
    if (count === 0) {
      await prisma.feedItem.createMany({
        data: [
          { userId: chris.id, type: "BADGE_EARNED", text: "unlocked Hydration Hero!", points: 5, icon: "H2O" },
          { type: "QUEST_SUBMITTED", text: "Alex S. submitted Group Cheers!", points: 15, icon: "!!!" },
          { type: "BADGE_EARNED", text: "Emily B. earned Main Character!", points: 10, icon: "*" },
          { type: "QUEST_APPROVED", text: "Mike D. completed Mystery Cup Roulette!", points: 10, icon: "CUP" },
          { type: "STREAK", text: "Sarah L. is on a 3 Quest Streak!", points: 15, icon: "3" },
        ],
      });
    }
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
