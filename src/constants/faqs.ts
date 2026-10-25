// Help Center FAQs. Keep answers in line with how the app and API actually behave.
export type FaqItem = { id: string; title: string; content: string };
export type FaqSection = { title: string; items: FaqItem[] };

export const FAQ_SECTIONS: FaqSection[] = [
    {
        title: "Getting started",
        items: [
            {
                id: "what-is-wishers",
                title: "What is Wishers?",
                content: "Wishers lets you put together wishlists of the things you'd love, from gadgets to rent support, and share one link with friends and family. They give money towards each wish and it lands in your Wishers wallet.",
            },
            {
                id: "create-wishlist",
                title: "How do I create a wishlist?",
                content: "Click \"New wishlist\" on Home or Wishlists. Add a cover photo and a name, then open the wishlist and click \"Add wish\" to add each item with photos and a goal amount.",
            },
            {
                id: "add-wishes",
                title: "How many wishes and photos can I add?",
                content: "Each wishlist can hold several wishes, and each wish can have a few photos. The first photo is used as the cover. If you reach a limit, the app will tell you.",
            },
        ],
    },
    {
        title: "Sharing and giving",
        items: [
            {
                id: "share",
                title: "How do I share my wishlist?",
                content: "Open the wishlist and use the share link box to copy or share the link on WhatsApp, Instagram or anywhere else.",
            },
            {
                id: "givers-need-app",
                title: "Do my friends need the app to give?",
                content: "No. Your link opens in any browser. They pick a wish, choose an amount and pay. They can add a message too.",
            },
            {
                id: "anonymous",
                title: "Can people give anonymously?",
                content: "Yes. Givers can choose to stay anonymous, and they'll show up as \"Anonymous\" in your givers list.",
            },
            {
                id: "track",
                title: "How do I know when someone gives?",
                content: "You'll get a notification, and the gift shows up under Recent Givers on your Home screen and on the wish itself, along with how close you are to your goal.",
            },
        ],
    },
    {
        title: "Wallet and withdrawals",
        items: [
            {
                id: "where-money",
                title: "Where does the money go?",
                content: "Every gift goes straight into your Wishers wallet. You can see your available balance and full transaction history on the Wallet tab.",
            },
            {
                id: "withdraw",
                title: "How do I withdraw?",
                content: "Go to the Wallet tab, add your bank account once, then enter the amount you want and confirm with your password or Face ID / fingerprint. The money is sent to the bank account you added.",
            },
            {
                id: "fees",
                title: "Are there any fees?",
                content: "A small service fee applies when you withdraw. You'll always see the fee and the exact amount you'll receive before you confirm.",
            },
            {
                id: "bank-change",
                title: "Can I change my bank account?",
                content: "Yes. On the Wallet tab, delete the saved bank account (you'll be asked to confirm with your password) and add the new one.",
            },
        ],
    },
    {
        title: "Managing wishlists",
        items: [
            {
                id: "edit",
                title: "Can I edit a wish after sharing it?",
                content: "You can change the name, photos and description at any time. The goal amount locks once someone has contributed, and completed wishlists can't be edited or deleted.",
            },
            {
                id: "referrals",
                title: "How do referrals work?",
                content: "Share your invite code from the Refer & Earn page (Profile, or Invite friends on Home). When friends join with your code, you earn 1% of what they earn.",
            },
        ],
    },
    {
        title: "Account and security",
        items: [
            {
                id: "password",
                title: "How do I change my password?",
                content: "Go to Profile and click Change password. You'll need your current password.",
            },
            {
                id: "biometrics",
                title: "Can I log in with Face ID or fingerprint?",
                content: "Yes. Turn it on in Profile, then Appearance & Security. You'll still be asked for your password before sensitive actions if biometrics isn't available.",
            },
            {
                id: "delete-account",
                title: "How do I delete my account?",
                content: "Reach out to us from the Contact Us tab and we'll help you close your account.",
            },
        ],
    },
];
