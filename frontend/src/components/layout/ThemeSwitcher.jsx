import { useIsLight } from "../../hooks/useIsLight";

export function ThemeSwitcher({ value = "dark", onChange }) {
  const isLight = useIsLight();

  const options = [
    { value: "light", icon: "light_mode", label: "Light" },
    { value: "dark", icon: "dark_mode", label: "Dark" },
    { value: "auto", icon: "desktop_windows", label: "Auto" },
  ];

  // Adapt container colors to current resolved theme
  const containerBg = isLight ? "#ede9f5" : "#100d16";
  const containerBorder = isLight ? "rgba(194,186,201,0.4)" : "rgba(74,68,85,0.2)";
  const inactiveColor = isLight ? "#7a7581" : "#7A7581";

  return (
    <div style={{
      backgroundColor: containerBg,
      border: `1px solid ${containerBorder}`,
      borderRadius: "9999px",
      padding: "4px",
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      transition: "background-color 0.3s, border-color 0.3s",
    }}>
      {options.map((opt) => {
        const isActive = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange?.(opt.value)} //'onChange?.()' : call unChange only if parent passed it, else do nothing safely, '?.' : don't crash if onChange is undefined , while 'onChange()'  would lead app crash if it is undefined
            title={opt.label}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              padding: "6px 14px", borderRadius: "9999px",
              border: "none", cursor: "pointer",
              backgroundColor: isActive ? "#7C3AED" : "transparent",
              color: isActive ? "#fff" : inactiveColor,
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px", fontWeight: isActive ? 700 : 500,
              transition: "all 0.2s ease",
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>{opt.icon}</span>
            <span>{opt.label}</span>
          </button>
        );
      })
      }
    </div>
  );
}
