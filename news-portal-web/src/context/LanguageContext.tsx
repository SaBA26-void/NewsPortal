/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "ka" | "en";

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
    welcome: "მოგესალმებით",
    email: "ელფოსტა",
    password: "პაროლი",
    firstName: "სახელი",
    lastName: "გვარი",
    manageArticles: "სტატიების მართვა",
    wait: "გთხოვთ მოითმინოთ...",
    error: "შეცდომა მოხდა",
    articles: "სტატიები",
    allCategories: "ყველა კატეგორია",
    readMore: "წაიკითხე",
    prev: "წინა",
    next: "შემდეგი",
    noArticles: "სტატიები ვერ მოიძებნა",
    addFavorite: "ფავორიტებში",
    removeFavorite: "წაშლა ფავორიტებიდან",
    needLogin: "ფავორიტებისთვის საჭიროა შესვლა",
    myFavorites: "ჩემი ფავორიტები",
    noFavorites: "ფავორიტები ცარიელია",
    newArticle: "ახალი სტატია",
    edit: "რედაქტირება",
    delete: "წაშლა",
    title: "სათაური",
    content: "ტექსტი",
    imageUrl: "სურათის URL",
    category: "კატეგორია",
    save: "შენახვა",
    cancel: "გაუქმება",
    selectCategory: "აირჩიე კატეგორია",
    light: "ნათელი",
    dark: "მუქი",
    system: "სისტემა",
  },
  en: {
    appName: "News Portal",
    home: "Home",
    favorites: "Favorites",
    login: "Login",
    register: "Register",
    logout: "Logout",
    welcome: "Welcome",
    email: "Email",
    password: "Password",
    firstName: "First name",
    lastName: "Last name",
    manageArticles: "Manage articles",
    wait: "Please wait...",
    error: "Something went wrong",
    articles: "Articles",
    allCategories: "All categories",
    readMore: "Read more",
    prev: "Prev",
    next: "Next",
    noArticles: "No articles found",
    addFavorite: "Add to favorites",
    removeFavorite: "Remove favorite",
    needLogin: "Please login to use favorites",
    myFavorites: "My favorites",
    noFavorites: "No favorites yet",
    newArticle: "New article",
    edit: "Edit",
    delete: "Delete",
    title: "Title",
    content: "Content",
    imageUrl: "Image URL",
    category: "Category",
    save: "Save",
    cancel: "Cancel",
    selectCategory: "Select category",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
} as const;

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEY) as Language) || "ka";
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem(STORAGE_KEY, lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
  };

  const t = (key: keyof typeof messages.ka) => messages[language][key];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
