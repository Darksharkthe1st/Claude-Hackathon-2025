export const calculateToolMatch = (volunteerTools = [], requiredTools = []) => {
  if (!requiredTools.length) {
    return 100;
  }

  const ownedCount = requiredTools.filter((tool) =>
    volunteerTools.map((t) => t.toLowerCase()).includes(tool.toLowerCase())
  ).length;

  return Math.round((ownedCount / requiredTools.length) * 100);
};

