// Records exactly as api-wishers returns them: _id, never id.

export type User = {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    emailVerified: boolean;
    accountStatus: "active" | "suspended" | "deactivated";
    role: "user";
    inviteCode: string;
    referredBy?: string;
    referralsCount: number;
    createdAt?: string;
};

export type TokenResponse = { accessToken: string; refreshToken: string; emailVerified: boolean };

export type Wallet = {
    _id: string;
    owner: string;
    allTimeBalance: number;
    pendingBalance: number;
    settledBalance: number;
    contributedEarning: number;
    referralEarnings: number;
    createdAt?: string;
};

export type Wishlist = {
    _id: string;
    owner: string;
    title: string;
    description?: string;
    image?: string;
    slug: string;
    link: string;
    active: boolean;
    totalWishItems: number;
    totalGoalAmount: number;
    totalAmountReceived: number;
    totalContributors: number;
    isCompleted: boolean;
    contributorsImages: string[];
    visitCount: number;
    impressionCount: number;
    createdAt: string;
    updatedAt?: string;
};

export type Contributor = {
    _id: string;
    owner: string;
    wishItem: string;
    wishlist: string;
    wishItemSlug?: string;
    name?: string;
    email?: string;
    amount: number;
    message?: string;
    image?: string;
    isAnonymous: boolean;
    transaction?: string;
    reference?: string;
    createdAt: string;
};

export type WishItem = {
    _id: string;
    wishlist: string;
    owner: string;
    title: string;
    description?: string;
    images: string[];
    slug: string;
    goalAmount: number;
    amountReceived: number;
    contributorCount: number;
    isCompleted: boolean;
    active: boolean;
    contributorsImages: string[];
    createdAt: string;
};

// GET /wishlists/:id
export type WishlistDetail = Wishlist & { wishItems: WishItem[] };

export type Bank = { code: string; name: string; slug: string; logoUrl?: string };

export type BankAccount = {
    _id: string;
    bankCode: string;
    bankName: string;
    accountNumber: string;
    maskedAccountNumber: string;
    accountName: string;
    logoUrl?: string;
    currency: string;
    active: boolean;
};

export type TransactionType = "contribution" | "referral_earning";

export type Transaction = {
    _id: string;
    type: TransactionType;
    status: "pending" | "success" | "failed";
    amount: number;
    giftAmount?: number;
    charges: number;
    currency: string;
    reference?: string;
    settlementStatus: "pending" | "settled";
    settledAt?: string;
    paidAt?: string;
    wishItem?: string;
    wishItemSlug?: string;
    wishlist?: string;
    receiver?: { bankName?: string; accountNumber?: string; accountName?: string };
    description?: string;
    createdAt: string;
};

export type AppNotification = {
    _id: string;
    title: string;
    body: string;
    type?: string;
    reference?: string;
    read: boolean;
    readAt?: string;
    createdAt: string;
};

// GET /settings
export type AppSettings = {
    maxWishItemImages: number;
    wishItemCreationLimit: number;
    wishlistCreationLimit: number;
    maxGoalAmountDigits: number;
    maxGoalAmount: number;
    minGoalAmount: number;
    shouldDisplayConfetti: boolean;
    minContributionAmount: number;
    wisherSharePercentage: number;
    referrerSharePercentage: number;
};

// Paginated endpoints: { results, hasMore, ... }
export type Page<T> = { results: T[]; hasMore: boolean; total?: number };
