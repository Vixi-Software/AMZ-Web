export function parseTableInfoToString(tableInfo) {
    if (!Array.isArray(tableInfo)) return "";
  
    return tableInfo
      .map(item => {
        const key = item.key?.trim();
        const value = item.value?.trim();
        if (!key || !value) return null;
        return `${key}::${value}`;
      })
      .filter(Boolean) // remove nulls or empty entries
      .join(";;");
  }

export function parseStringToTableInfo(tableString) {
    if (typeof tableString !== "string" || !tableString.includes("::")) return [];
  
    return tableString.split(";;").map(pair => {
      const [key, value] = pair.split("::");
      return {
        key: key?.trim() || "",
        value: value?.trim() || ""
      };
    }).filter(item => item.key && item.value);
  }
  