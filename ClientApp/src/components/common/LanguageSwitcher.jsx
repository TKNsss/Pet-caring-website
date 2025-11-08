import { useTranslation } from "react-i18next";

const languages = [
  { code: "vi", labelKey: "common.vietnamese" },
  { code: "en", labelKey: "common.english" },
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const currentLanguage = (i18n.language || "vi").split("-")[0];
  const selectValue = languages.some((lang) => lang.code === currentLanguage)
    ? currentLanguage
    : "vi";

  const handleChange = (event) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("app_language", newLang);
  };

  return (
    <label className="text-sm text-gray-600">
      <span className="mr-2 font-medium">{t("common.language")}:</span>
      <select
        value={selectValue}
        onChange={handleChange}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm focus:border-third focus:outline-none"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {t(lang.labelKey)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
