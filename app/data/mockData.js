export const currentUser = {
  name: "Chris J.",
  nickname: "The Grad",
  points: 245,
  drinks: 18,
  rank: "6th",
  badges: 6,
  photo: "CJ",
};

export const users = [
  { rank: 1, name: "Chris J.", points: 380, drinks: 18, photo: "CJ" },
  { rank: 2, name: "Sarah L.", points: 352, drinks: 15, photo: "SL" },
  { rank: 3, name: "Mike D.", points: 331, drinks: 13, photo: "MD" },
  { rank: 4, name: "Emily B.", points: 310, drinks: 12, photo: "EB" },
  { rank: 5, name: "Alex S.", points: 288, drinks: 10, photo: "AS" },
  { rank: 6, name: "Jessica R.", points: 245, drinks: 9, photo: "JR" },
  { rank: 7, name: "Davis E.", points: 231, drinks: 8, photo: "DE" },
  { rank: 8, name: "Tyler G.", points: 212, drinks: 7, photo: "TG" },
  { rank: 9, name: "Hannah W.", points: 188, drinks: 6, photo: "HW" },
  { rank: 10, name: "James K.", points: 165, drinks: 5, photo: "JK" },
];

export const quests = [
  { title: "Mystery Cup Roulette", category: "Drinks", description: "Drink something you did not pick.", points: 10, drinks: 1, icon: "CUP", status: "available" },
  { title: "3-Peat", category: "Drinks", description: "Complete drink, seltzer, beer.", points: 15, drinks: 1, icon: "3", status: "pending" },
  { title: "Hydration Hero", category: "Bonus", description: "Drink water. Be a legend.", points: 5, drinks: 0, icon: "H2O", status: "completed" },
  { title: "Album Cover Drop", category: "Photo", description: "Recreate an album cover.", points: 15, drinks: 0, icon: "CAM", status: "available" },
  { title: "Main Character Energy", category: "Photo", description: "Take your best main character pic.", points: 10, drinks: 0, icon: "*", status: "available" },
  { title: "Group Cheers", category: "Party", description: "Group toast photo.", points: 15, drinks: 0, icon: "!!!", status: "available" },
];

export const drinks = [
  { title: "Beer", points: 5, drinks: 1, tone: "amber" },
  { title: "Seltzer", points: 5, drinks: 1, tone: "silver" },
  { title: "Cocktail", points: 10, drinks: 1, tone: "red" },
  { title: "Mocktail", points: 10, drinks: 0, tone: "gold" },
];

export const badges = [
  { name: "3 in a Row", icon: "3", description: "Complete 3 quests in a row", earned: "10m ago", locked: false },
  { name: "Hydration Hero", icon: "H2O", description: "Drink water, be a legend", earned: "Just now", locked: false },
  { name: "Major Character", icon: "*", description: "Serve a photo moment", earned: "30m ago", locked: false },
  { name: "Social Butterfly", icon: "SB", description: "Submit a group cheers photo", earned: "Locked", locked: true },
  { name: "Party Starter", icon: "GO", description: "First quest of the night", earned: "1h ago", locked: false },
];

export const feed = [
  { user: "Chris J.", action: "unlocked Hydration Hero!", points: 5, time: "Just now", icon: "H2O", photo: "CJ" },
  { user: "Alex S.", action: "submitted Group Cheers!", points: 15, time: "3m ago", icon: "!!!", photo: "AS" },
  { user: "Emily B.", action: "earned Main Character!", points: 10, time: "6m ago", icon: "*", photo: "EB" },
  { user: "Mike D.", action: "completed Mystery Cup Roulette!", points: 10, time: "8m ago", icon: "CUP", photo: "MD" },
  { user: "Sarah L.", action: "is on a 3 Quest Streak!", points: 15, time: "10m ago", icon: "3", photo: "SL" },
];

export const gallery = [
  { user: "Chris J.", quest: "Group Cheers", points: 15, color: "from-red-700 to-zinc-950" },
  { user: "Alex S.", quest: "Mystery Cup", points: 10, color: "from-zinc-200 to-red-800" },
  { user: "Emily B.", quest: "Main Character", points: 10, color: "from-zinc-900 to-red-600" },
  { user: "Sarah L.", quest: "Hydration Hero", points: 5, color: "from-sky-200 to-zinc-900" },
  { user: "Mike D.", quest: "Album Cover", points: 15, color: "from-red-900 to-stone-100" },
  { user: "Jessica R.", quest: "Best Fit Check", points: 10, color: "from-zinc-800 to-red-500" },
];

export const submissions = [
  { user: "Alex S.", quest: "Group Cheers", caption: "The whole table made it in.", points: 15, drinks: 0, photo: "AS" },
  { user: "Mike D.", quest: "Mystery Cup Roulette", caption: "No idea what this was, respectfully.", points: 10, drinks: 1, photo: "MD" },
  { user: "Sarah L.", quest: "Hydration Hero", caption: "Water break supremacy.", points: 5, drinks: 0, photo: "SL" },
];
