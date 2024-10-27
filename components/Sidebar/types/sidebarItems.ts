import { IconType } from 'react-icons';

export interface SidebarItem {
    href: string;
    icon: IconType;
    label: string;
}

export type SidebarItemGroup = SidebarItem[];