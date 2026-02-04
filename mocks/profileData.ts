export interface MenuItem {
  id: string;
  icon: string;
  label: string;
  type?: "navigation" | "toggle";
}

export interface UserProfile {
  name: string;
  role: string;
  avatar: string;
}

export const profileData = {
  user: {
    name: "Karthik Kumar",
    role: "Vendor",
    avatar: "https://i.pravatar.cc/200?img=12",
  } as UserProfile,
  generalSettings: [
    { id: "personal", icon: "person-outline", label: "Personal Information" },
    { id: "language", icon: "globe-outline", label: "Language" },
    { id: "shop", icon: "storefront-outline", label: "Shop Details" },
    { id: "payment", icon: "card-outline", label: "Payment" },
  ] as MenuItem[],
  supportSettings: [
    { id: "legal", icon: "document-text-outline", label: "Legal Policies" },
    { id: "appInfo", icon: "help-circle-outline", label: "App Information" },
  ] as MenuItem[],
  accountSettings: [
    {
      id: "darkTheme",
      icon: "moon-outline",
      label: "Dark Theme",
      type: "toggle",
    },
    { id: "logout", icon: "log-out-outline", label: "Logout" },
  ] as MenuItem[],
};
