export function startCooldown({
  key,
  duration,
  setState,
}) {
  const endTime = Date.now() + duration * 1000;

  localStorage.setItem(key, endTime);
  setState(duration);

  return endTime;
}

export function getRemainingCooldown(key) {
  const saved = localStorage.getItem(key);
  if (!saved) return 0;

  const remaining = Math.floor((saved - Date.now()) / 1000);

  return remaining > 0 ? remaining : 0;
}