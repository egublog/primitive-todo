export class TodoViewI18n {
  constructor() {
    this.defaultLang = "ja";
  }

  translateValue(type, value) {
    const lang =
      document.documentElement.getAttribute("data-lang") || this.defaultLang;
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
    return (
      document.documentElement.getAttribute("data-lang") || this.defaultLang
    );
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

    if (lang === 'ja') {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}年${month}月${day}日`;
    } else {
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
      };
      return date.toLocaleDateString('en-US', options);
    }
  }
}
