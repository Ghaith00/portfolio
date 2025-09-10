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

// Reusable pieces
export interface GithubUserOwner {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: "User";
    user_view_type: "public" | "private" | string;
    site_admin: boolean;
}

export interface GithubLicense {
    key: string;
    name: string;
    spdx_id: string;
    url: string | null;
    node_id: string;
}

export type Visibility = "public" | "private";
export type DefaultBranch = string;

// Main repo type (one item in the array)
export interface GithubRepo {
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;

    owner: GithubUserOwner;

    html_url: string;
    description: string | null;
    fork: boolean;

    // API urls
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;

    // Timestamps (ISO strings)
    created_at: string; // e.g. "2025-09-10T12:03:18Z"
    updated_at: string;
    pushed_at: string;

    // Git urls
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;

    homepage: string | null;

    size: number;
    stargazers_count: number;
    watchers_count: number;
    language: string | null;

    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    has_discussions: boolean;

    forks_count: number;
    mirror_url: string | null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;

    license: GithubLicense | null;

    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;

    topics: string[];

    visibility: Visibility;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: DefaultBranch;
}

// The API response you pasted:
export type GithubRepoList = GithubRepo[];
