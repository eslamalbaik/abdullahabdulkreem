import { useTheme as useNextTheme } from "next-themes";

export const useTheme = () => {
    const { theme, setTheme, forcedTheme, resolvedTheme, systemTheme } = useNextTheme();

    return {
        theme,
        setTheme,
        forcedTheme,
        resolvedTheme,
        systemTheme,
    };
};
