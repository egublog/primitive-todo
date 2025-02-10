export class TodoViewI18n {
  constructor() {
    this.defaultLang = "ja";
  }

  translateValue(type, value) {
    const lang = document.documentElement.getAttribute("data-lang") || this.defaultLang;
    const { translations } = window;

    if (!translations || !translations[lang]) return value;

    value = value || (type === "priority" ? "medium" : "none");

    if (type === "priority") {
      return translations[lang].priority[value.toLowerCase()] || value;
    } else if (type === "category") {
      return translations[lang].category[value] || value;
    }

    return value;
  }

  getCurrentLang() {
    return document.documentElement.getAttribute("data-lang") || this.defaultLang;
  }

  getTranslation(key, defaultValue = "") {
    const lang = this.getCurrentLang();
    const { translations } = window;

    if (!translations || !translations[lang]) return defaultValue;

    const keys = key.split(".");
    let result = translations[lang];

    for (const k of keys) {
      if (result && typeof result === "object") {
        result = result[k];
      } else {
        return defaultValue;
      }
    }

    return result || defaultValue;
  }

  formatDueDate(dueDate) {
    const date = new Date(dueDate);
    const lang = this.getCurrentLang();

    const options = {
      year: "numeric",
      month: lang === "ja" ? "long" : "short",
      day: "numeric",
    };

    return date.toLocaleDateString(lang === "ja" ? "ja-JP" : "en-US", options);
  }
}
