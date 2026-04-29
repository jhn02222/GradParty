import { prisma } from "./prisma";

const seedQuests = [
  { title: "Mystery Cup Roulette", category: "DRINKS", description: "Drink something you did not pick.", points: 10, drinks: 1, icon: "CUP" },
  { title: "3-Peat", category: "DRINKS", description: "Complete drink, seltzer, beer.", points: 15, drinks: 1, icon: "3" },
  { title: "Hydration Hero", category: "BONUS", description: "Drink water. Be a legend.", points: 5, drinks: 0, icon: "H2O" },
  { title: "Album Cover Drop", category: "PHOTO", description: "Recreate an album cover.", points: 15, drinks: 0, icon: "CAM" },
  { title: "Main Character Energy", category: "PHOTO", description: "Take your best main character pic.", points: 10, drinks: 0, icon: "*" },
  { title: "Group Cheers", category: "PARTY", description: "Group toast photo.", points: 15, drinks: 0, icon: "!!!" },
];

const seedBadges = [
  { name: "3 in a Row", icon: "3", description: "Complete 3 approved quests in a row" },
  { name: "Hydration Hero", icon: "H2O", description: "Drink water, be a legend" },
  { name: "Major Character", icon: "*", description: "Serve a photo moment" },
  { name: "Social Butterfly", icon: "SB", description: "Submit a group cheers photo" },
  { name: "Party Starter", icon: "GO", description: "First approved quest of the night" },
];

let seeded = false;

export async function ensureSeedData() {
  if (seeded) return;
  const questCount = await prisma.quest.count();
  if (questCount === 0) {
    await prisma.$transaction([
      ...seedQuests.map((quest) =>
        prisma.quest.upsert({ where: { title: quest.title }, update: quest, create: quest })
      ),
      ...seedBadges.map((badge) =>
        prisma.badge.upsert({ where: { name: badge.name }, update: badge, create: badge })
      ),
    ]);
  }

  seeded = true;
}

export function initials(name = "GP") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}
