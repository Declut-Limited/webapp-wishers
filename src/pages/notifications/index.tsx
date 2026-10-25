import { NotificationList } from "@/components/notifications/NotificationList";

// Phones; on desktop the bell opens the same list in a dropdown.
export default function Notifications() {
    return <NotificationList className="overflow-hidden rounded-2xl border bg-card" />;
}
