/* eslint-disable react-refresh/only-export-components -- Provider + hook in one file is OK for Context */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Language } from "../types/language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof messages.ka) => string;
};

const STORAGE_KEY = "news-portal-lang";

const messages = {
  ka: {
    appName: "სიახლეების პორტალი",
    home: "მთავარი",
    favorites: "ფავორიტები",
    login: "შესვლა",
    register: "რეგისტრაცია",
    logout: "გასვლა",
    theme: "თემა",
    light: "ნათელი",
    dark: "მუქი",
    system: "სისტემური",
    language: "ენა",
    welcome: "მოგესალმებით",
    email: "ელფოსტა",
    password: "პაროლი",
    firstName: "სახელი",
    lastName: "გვარი",
    submitLogin: "შესვლა",
    submitRegister: "რეგისტრაცია",
    noAccount: "არ გაქვს ანგარიში?",
    haveAccount: "უკვე გაქვს ანგარიში?",
    manageArticles: "სტატიების მართვა",
    loggingIn: "მიმდინარეობს...",
    errorGeneric: "რაღაც შეცდომა მოხდა",
    validationAuth: "ელფოსტა და პაროლი (მინ. 6 სიმბოლო) სავალდებულოა",
    articles: "სტატიები",
    allCategories: "ყველა კატეგორია",
    readMore: "წაიკითხე",
    prevPage: "წინა",
    nextPage: "შემდეგი",
    noArticles: "სტატიები ვერ მოიძებნა",
    noArticlesHint: "სცადე სხვა კატეგორია ან მოგვიანებით დაბრუნდი",
    loadError: "სიახლეების ჩატვირთვა ვერ მოხერხდა",
  },
  en: {
    appName: "News Portal",
    home: "Home",
    favorites: "Favorites",
    login: "Login",
    register: "Register",
    logout: "Logout",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    welcome: "Welcome",
    email: "Email",
    password: "Password",
    firstName: "First name",
    lastName: "Last name",
    submitLogin: "Sign in",
    submitRegister: "Create account",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    manageArticles: "Manage articles",
    loggingIn: "Please wait...",
    errorGeneric: "Something went wrong",
    validationAuth: "Email and password (min 6 characters) are required",
    articles: "Articles",
    allCategories: "All categories",
    readMore: "Read more",
    prevPage: "Previous",
    nextPage: "Next",
    noArticles: "No articles found",
    noArticlesHint: "Try another category or come back later",
    loadError: "Failed to load articles",
  },
} as const;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    return saved ?? "ka";
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: keyof typeof messages.ka) => messages[language][key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
