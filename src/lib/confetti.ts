import confetti from "canvas-confetti";

// Brand greens and a warm gold, as on mobile.
const COLORS = ["#ccf88e", "#308041", "#ffd23f", "#f4845f", "#6366f1", "#ffffff"];

// Celebration for a new wishlist or wish: two cannons from the bottom corners (mobile's ConfettiEL).
// Only when the admin has confetti turned on (settings.shouldDisplayConfetti); skipped for reduced motion.
export function celebrate() {
    const shared = { particleCount: 80, spread: 70, startVelocity: 55, ticks: 220, colors: COLORS, zIndex: 9999, disableForReducedMotion: true };
    confetti({ ...shared, angle: 60, origin: { x: 0, y: 0.9 } });
    confetti({ ...shared, angle: 120, origin: { x: 1, y: 0.9 } });
}
