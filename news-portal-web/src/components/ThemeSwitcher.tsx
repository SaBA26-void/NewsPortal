import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.tsx";
import { useLanguage } from "../context/LanguageContext.tsx";
import type { ThemeMode } from "../types/theme";

const options: {
  value: ThemeMode;
  icon: typeof Sun;
  labelKey: "light" | "dark" | "system";
}[] = [
  { value: "light", icon: Sun, labelKey: "light" },
  { value: "dark", icon: Moon, labelKey: "dark" },
  { value: "system", icon: Monitor, labelKey: "system" },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
      {options.map(({ value, icon: Icon, labelKey }) => (
        <button
          key={value}
          type="button"
          title={t(labelKey)}
          aria-label={t(labelKey)}
          onClick={() => setTheme(value)}
          className={`rounded-md p-1.5 transition ${
            theme === value
              ? "bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-white"
              : "text-ink-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          }`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
