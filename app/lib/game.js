import { prisma } from "./prisma";

export function feedShape(item) {
  const name = item.user?.name || item.text.split(" ")[0] || "Guest";
  return {
    id: item.id,
    user: item.user?.name || name,
    action: item.user ? item.text : item.text.replace(`${name} `, ""),
    points: item.points,
    time: timeAgo(item.createdAt),
    icon: item.icon || "!",
    photo: item.user?.photoUrl || name.slice(0, 2).toUpperCase(),
    photoUrl: item.user?.photoUrl || "",
  };
}

export function userShape(user, rank = null) {
  return {
    id: user.id,
    rank: rank || user.rank,
    name: user.name,
    nickname: user.nickname,
    points: user.points,
    drinks: user.drinks,
    badges: user._count?.badges || 0,
    photo: user.photoUrl || user.name.slice(0, 2).toUpperCase(),
    photoUrl: user.photoUrl,
  };
}

export async function rankedUsers(take = 10) {
  const users = await prisma.user.findMany({
    orderBy: [{ points: "desc" }, { drinks: "desc" }, { createdAt: "asc" }],
    take,
    include: { _count: { select: { badges: true } } },
  });
  return users.map((user, index) => userShape(user, index + 1));
}

export async function awardBadges(userId, questTitle) {
  const approvedCount = await prisma.submission.count({ where: { userId, status: "APPROVED" } });
  const rules = [
    approvedCount >= 1 && "Party Starter",
    approvedCount >= 3 && "3 in a Row",
    questTitle === "Hydration Hero" && "Hydration Hero",
    questTitle === "Main Character Energy" && "Major Character",
    questTitle === "Group Cheers" && "Social Butterfly",
  ].filter(Boolean);

  for (const badgeName of rules) {
    const badge = await prisma.badge.findUnique({ where: { name: badgeName } });
    if (!badge) continue;
    const earned = await prisma.userBadge.upsert({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
      update: {},
      create: { userId, badgeId: badge.id },
      include: { badge: true, user: true },
    });
    await prisma.feedItem.create({
      data: {
        userId,
        type: "BADGE_EARNED",
        text: `earned ${earned.badge.name}!`,
        points: 0,
        icon: earned.badge.icon,
      },
    });
  }
}

export function timeAgo(date) {
  const ms = Date.now() - new Date(date).getTime();
  const minutes = Math.max(0, Math.floor(ms / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
