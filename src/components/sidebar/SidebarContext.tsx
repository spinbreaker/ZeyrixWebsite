import { createContext, useContext } from "react";

type SidebarContextType = {
    expanded: boolean;
    toggle: () => void;
};

export const SidebarContext = createContext<SidebarContextType>({
    expanded: true,
    toggle: () => {},
});

export function useSidebar() {
    return useContext(SidebarContext);
}