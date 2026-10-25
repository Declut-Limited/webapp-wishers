import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import type { IconType } from "react-icons";
import {
    PiArrowRightBold,
    PiCaretRightBold,
    PiCopyBold,
    PiFileTextBold,
    PiGiftBold,
    PiLifebuoyBold,
    PiPaletteBold,
    PiShieldCheckBold,
    PiSignOutBold,
    PiUserBold,
} from "react-icons/pi";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";
import { ChangePasswordDialog, ChangePasswordForm } from "./components/ChangePasswordDialog";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { ProfileForm } from "./components/ProfileForm";

type RowProps = { icon: IconType; title: string; text: string; tint: string; to?: string; href?: string; onClick?: () => void; danger?: boolean };

// One option row, like the mobile profile list.
function Row({ icon: Icon, title, text, tint, to, href, onClick, danger }: RowProps) {
    const inner = (
        <>
            <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tint)}>
                <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
                <span className={cn("block font-semibold", danger && "text-destructive")}>{title}</span>
                <span className="block truncate text-sm text-muted-foreground">{text}</span>
            </span>
            {!danger && <PiCaretRightBold className="shrink-0 text-muted-foreground" aria-hidden />}
        </>
    );
    const cls = "flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-secondary focus-visible:bg-secondary focus-visible:outline-none";
    if (to) return <Link to={to} className={cls}>{inner}</Link>;
    if (href) return <a href={href} target="_blank" rel="noreferrer" className={cls}>{inner}</a>;
    return <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

// Desktop settings card (ClipBay's pattern): title and note on top, content under.
function SettingsCard({ title, description, action, children }: { title: string; description?: string; action?: ReactNode; children: ReactNode }) {
    return (
        <section className="rounded-2xl border bg-card">
            <div className="flex items-start justify-between gap-4 px-6 pt-6">
                <div>
                    <h2 className="text-lg font-bold">{title}</h2>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {action}
            </div>
            <div className="p-6">{children}</div>
        </section>
    );
}

function ThemePicker() {
    const { theme, setTheme } = useTheme();
    return (
        <Tabs value={theme ?? "system"} onValueChange={setTheme}>
            <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="light" className="sm:px-6">Light</TabsTrigger>
                <TabsTrigger value="dark" className="sm:px-6">Dark</TabsTrigger>
                <TabsTrigger value="system" className="sm:px-6">System</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}

const LEGAL = [
    { icon: PiShieldCheckBold, title: "Privacy policy", text: "How we handle your data", href: "https://wishers.app/privacy-policy" },
    { icon: PiFileTextBold, title: "Terms of use", text: "The rules for using Wishers", href: "https://wishers.app/terms-of-use" },
];

export default function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const settings = useSettings();
    const [open, setOpen] = useState<"edit" | "appearance" | "password" | "legal" | "logout" | null>(null);
    const close = (o: boolean) => !o && setOpen(null);

    if (!user) return null;

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const copyCode = async () => {
        await navigator.clipboard.writeText(user.inviteCode);
        toast.success("Referral code copied");
    };

    return (
        <>
            {/* Phones and tablets: the mobile profile tab. */}
            <div className="mx-auto max-w-2xl lg:hidden">
                <PageHeader title="Profile" />
                <section className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-5">
                    <UserAvatar name={user.name} image={user.image} className="size-16" />
                    <div className="min-w-0">
                        <p className="truncate text-lg font-bold">{user.name}</p>
                        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </section>
                <nav aria-label="Profile options" className="divide-y overflow-hidden rounded-2xl border bg-card">
                    <Row icon={PiUserBold} tint="bg-brand-mint text-brand-dark dark:bg-brand-dark dark:text-brand-mint" title="Edit Profile" text="Update your profile information" onClick={() => setOpen("edit")} />
                    <Row icon={PiPaletteBold} tint="bg-brand-violet text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300" title="Appearance & Security" text="Theme and password" onClick={() => setOpen("appearance")} />
                    <Row icon={PiGiftBold} tint="bg-brand-purple/10 text-brand-purple dark:bg-brand-purple/30 dark:text-white" title="Refer & Earn" text="Invite friends and earn 1% of their earnings" to="/profile/referrals" />
                    <Row icon={PiShieldCheckBold} tint="bg-brand-peach text-brand-brown dark:bg-orange-950 dark:text-orange-300" title="Legals & Policies" text="See our policies and terms of use" onClick={() => setOpen("legal")} />
                    <Row icon={PiLifebuoyBold} tint="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" title="Help Center" text="Get all the help and support you need" to="/profile/help" />
                    <Row icon={PiSignOutBold} tint="bg-destructive/10 text-destructive" title="Logout" text="Logout of your account" onClick={() => setOpen("logout")} danger />
                </nav>
            </div>

            {/* Desktop: settings cards with the forms inline, plus a side column. */}
            <div className="hidden lg:block">
                <PageHeader title="Profile" description="Your account, appearance and security." />
                <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex min-w-0 flex-col gap-6">
                        <SettingsCard title="Personal information" description="Your photo and name, as givers see them.">
                            <ProfileForm inline />
                        </SettingsCard>
                        <SettingsCard title="Appearance" description="Choose how Wishers looks on this device.">
                            <ThemePicker />
                        </SettingsCard>
                        <SettingsCard title="Change password" description="Use at least 8 characters with a letter and a number.">
                            <ChangePasswordForm inline />
                        </SettingsCard>
                    </div>

                    <aside className="flex flex-col gap-6 xl:sticky xl:top-24">
                        <section className="relative overflow-hidden rounded-2xl bg-brand-purple p-6 text-white">
                            <div aria-hidden className="absolute -top-12 -right-12 size-36 rounded-full bg-white/10" />
                            <h2 className="relative text-lg font-bold">Refer & Earn</h2>
                            <p className="relative mt-1 text-sm text-white/75">Invite friends and earn {settings?.referrerSharePercentage ?? 1}% of their earnings.</p>
                            <div className="relative mt-4 flex items-center gap-2">
                                <span className="flex-1 truncate rounded-lg bg-white/15 px-3 py-2 font-mono font-bold tracking-widest">{user.inviteCode}</span>
                                <Button size="icon" variant="secondary" onClick={copyCode} aria-label="Copy referral code"><PiCopyBold /></Button>
                            </div>
                            <Link to="/profile/referrals" className="relative mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                                Invite friends <PiArrowRightBold aria-hidden />
                            </Link>
                        </section>

                        <section className="divide-y overflow-hidden rounded-2xl border bg-card">
                            <Row icon={PiLifebuoyBold} tint="bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300" title="Help Center" text="FAQs and support" to="/profile/help" />
                            {LEGAL.map((l) => <Row key={l.title} {...l} tint="bg-brand-peach text-brand-brown dark:bg-orange-950 dark:text-orange-300" />)}
                        </section>

                        <Button variant="outline" onClick={() => setOpen("logout")} className="h-11 font-bold text-destructive hover:text-destructive">
                            <PiSignOutBold /> Log out
                        </Button>
                    </aside>
                </div>
            </div>

            <EditProfileDialog key={`edit-${open === "edit"}`} open={open === "edit"} onOpenChange={close} />

            <Dialog open={open === "appearance"} onOpenChange={close}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">Appearance & Security</DialogTitle>
                        <DialogDescription>Choose a theme or change your password.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-5">
                        <ThemePicker />
                        <Button variant="outline" onClick={() => setOpen("password")} className="font-bold">Change password</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <ChangePasswordDialog key={`pw-${open === "password"}`} open={open === "password"} onOpenChange={close} />

            <Dialog open={open === "legal"} onOpenChange={close}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-extrabold">Legals & Policies</DialogTitle>
                        <DialogDescription>Our policies and terms of use.</DialogDescription>
                    </DialogHeader>
                    <div className="divide-y overflow-hidden rounded-xl border">
                        {LEGAL.map((l) => <Row key={l.title} {...l} tint="bg-secondary" />)}
                    </div>
                </DialogContent>
            </Dialog>

            <ConfirmDialog open={open === "logout"} onOpenChange={close} title="Log out?" description="You'll need your email and password to sign back in." confirmLabel="Log out" onConfirm={handleLogout} />
        </>
    );
}
