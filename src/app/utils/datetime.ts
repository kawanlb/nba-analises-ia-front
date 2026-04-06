const BRAZIL_TIME_ZONE = "America/Sao_Paulo";
const EASTERN_TIME_ZONE = "America/New_York";

function parseDateParts(dateInput: string) {
  const isoMatch = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return {
      year: Number(isoMatch[1]),
      month: Number(isoMatch[2]),
      day: Number(isoMatch[3]),
    };
  }

  const usMatch = dateInput.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usMatch) {
    return {
      year: Number(usMatch[3]),
      month: Number(usMatch[1]),
      day: Number(usMatch[2]),
    };
  }

  return null;
}

function buildDateFromParts(dateInput: string): Date | null {
  const parts = parseDateParts(dateInput);
  if (!parts) {
    const parsed = new Date(dateInput);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return new Date(parts.year, parts.month - 1, parts.day);
}

function getTimeZoneOffset(utcDate: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const parts = formatter.formatToParts(utcDate);
  const values: Record<string, string> = {};
  for (const part of parts) {
    if (part.type !== "literal") {
      values[part.type] = part.value;
    }
  }

  const asUtc = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );

  return asUtc - utcDate.getTime();
}

function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
) {
  const guessUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  const guessDate = new Date(guessUtcMs);
  const offsetMs = getTimeZoneOffset(guessDate, timeZone);
  return new Date(guessUtcMs - offsetMs);
}

function parseEtClock(timeInput: string) {
  const etMatch = timeInput
    .trim()
    .match(/(\d{1,2}):(\d{2})\s*([AP]M)\s*ET/i);
  if (!etMatch) return null;

  let hours = Number(etMatch[1]);
  const minutes = Number(etMatch[2]);
  const period = etMatch[3].toUpperCase();

  if (period === "PM" && hours < 12) {
    hours += 12;
  }
  if (period === "AM" && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

export function formatDateBR(dateInput: string) {
  const parsedDate = buildDateFromParts(dateInput);
  if (!parsedDate) {
    return dateInput;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: BRAZIL_TIME_ZONE,
  }).format(parsedDate);
}

export function formatGameTimeBR(timeInput: string, dateInput: string) {
  const etClock = parseEtClock(timeInput);
  const dateParts = parseDateParts(dateInput);

  if (!etClock || !dateParts) {
    return timeInput;
  }

  const utcDate = zonedDateTimeToUtc(
    dateParts.year,
    dateParts.month,
    dateParts.day,
    etClock.hours,
    etClock.minutes,
    EASTERN_TIME_ZONE
  );

  const brTime = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: BRAZIL_TIME_ZONE,
  }).format(utcDate);

  return `${brTime} BRT`;
}
