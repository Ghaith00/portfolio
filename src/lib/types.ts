"use client";
import React from "react";
import { FaCode, FaDatabase, FaTools, FaUsers } from "react-icons/fa";
import { MdWeb } from "react-icons/md";


//const 
export const ICONS = {
    FaCode,
    FaDatabase,
    FaTools,
    FaUsers,
    MdWeb,
} as const;

// types & interfaces
export type IconName = keyof typeof ICONS;
export type NavItem = { label: string; href: string; isHighlighted?: boolean };
export type Socials = Partial<{ x: string; github: string; linkedin: string }>;

export interface SiteData {
    name: string;
    tagline: string;
    nav: NavItem[];
    socials: Socials;
    footerLinks: NavItem[];
    resume: string;
    email: string;
    address: string;
}

export interface PageContent {
    hero?: { title: string; subtitle?: string; cta?: NavItem };
    features?: { title: string; body?: string }[];
    faq?: { q: string; a: string }[];
}

export type SiteContextValue = {
    site: SiteData;
    setSite: React.Dispatch<React.SetStateAction<SiteData>>;
};

export const SiteContext = React.createContext<SiteContextValue | null>(null);

