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

export type Frontmatter = {
    title: string;
    date: string;
    tags?: string[];
    excerpt?: string;
};

export type IconName = keyof typeof ICONS;

export type ExperienceContent = {
    company: string;
    logo: string;
    role: string;
    range: string;
    details: string[];
    stack: string[];
}

export type SkillContent = {
    title: string;
    color: string;
    icon: IconName;
    items: string[];
}

export type EducationContent = {
    school: string;
    degree: string;
    range: string;
    location: string;
    logo: string;
    details: string;
}

export type ProfileContent = {
    hero: {
        title: string;
        position: string;
        description: string;
        buttons: {
            label: string;
            href: string;
        }[];
        image: {
            alt: string;
            src: string;
        };
    };
    experience: ExperienceContent[];
    skills: SkillContent[];
    education: EducationContent[];
};

export type SiteContextValue = {
  site: SiteData;
  setSite: React.Dispatch<React.SetStateAction<SiteData>>;
};

export const SiteContext = React.createContext<SiteContextValue | null>(null);