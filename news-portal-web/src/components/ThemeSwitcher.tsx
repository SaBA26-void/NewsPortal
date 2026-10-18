import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type ThemeMode } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const options: { value: ThemeMode; Icon: typeof Sun; label: "light" | "dark" | "system" }[] = [
  { value: "light", Icon: Sun, label: "light" },
  { value: "dark", Icon: Moon, label: "dark" },
  { value: "system", Icon: Monitor, label: "system" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      {options.map(({ value, Icon, label }) => (
        <button
          key={value}
          type="button"
          title={t(label)}
          onClick={() => setTheme(value)}
          className={`rounded-md p-1.5 ${
            theme === value
              ? "bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-white"
              : "text-ink-500"
          }`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
