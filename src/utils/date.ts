export const monthName = (iso: string, locale: string): string => {
  const s = new Intl.DateTimeFormat(locale, {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
  return s.charAt(0).toUpperCase() + s.slice(1);
};

// «сегодня» как YYYY-MM-DD в нужном часовом поясе
export const getToday = (timeZone: string): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

// прибавляет n дней к YYYY-MM-DD в UTC: без влияния пояса и перехода на летнее время
export const addDaysIso = (iso: string, n: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
};
