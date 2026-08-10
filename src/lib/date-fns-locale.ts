// lib/date-fns-locale.ts
import { enUS, kk, ru } from "date-fns/locale";
import type { Locale } from "date-fns";

const localeMap: Record<string, Locale> = {
  en: enUS,
  "en-US": enUS,
  kk: kk,
  "kk-KZ": kk,
  ru: ru,
};

export function getDateFnsLocale(locale: string): Locale {
  return localeMap[locale] ?? localeMap[locale.split("-")[0]] ?? enUS;
}
