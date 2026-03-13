const WESTERN_SIGNS: {
  sign: string;
  startMonth: number;
  startDay: number;
}[] = [
  { sign: "Capricorn", startMonth: 1, startDay: 1 },
  { sign: "Aquarius", startMonth: 1, startDay: 20 },
  { sign: "Pisces", startMonth: 2, startDay: 19 },
  { sign: "Aries", startMonth: 3, startDay: 21 },
  { sign: "Taurus", startMonth: 4, startDay: 20 },
  { sign: "Gemini", startMonth: 5, startDay: 21 },
  { sign: "Cancer", startMonth: 6, startDay: 22 },
  { sign: "Leo", startMonth: 7, startDay: 23 },
  { sign: "Virgo", startMonth: 8, startDay: 23 },
  { sign: "Libra", startMonth: 9, startDay: 23 },
  { sign: "Scorpio", startMonth: 10, startDay: 23 },
  { sign: "Sagittarius", startMonth: 11, startDay: 22 },
  { sign: "Capricorn", startMonth: 12, startDay: 22 },
];

export function getWesternZodiacSign(dateOfBirth: string | Date): string {
  const date = new Date(dateOfBirth);
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  for (let i = WESTERN_SIGNS.length - 1; i >= 0; i--) {
    const { sign, startMonth, startDay } = WESTERN_SIGNS[i];
    if (month > startMonth || (month === startMonth && day >= startDay)) {
      return sign;
    }
  }
  return "Capricorn";
}
