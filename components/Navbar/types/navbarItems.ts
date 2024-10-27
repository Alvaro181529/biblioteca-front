// types/navbarItems.ts
import { IconType } from 'react-icons';

export interface NavbarItem {
    href: string;
    label: string;
    icon?: IconType;
}