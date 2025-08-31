import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MONITORING",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Icons.HomeIcon,
        items: [],
      },
      {
        title: "Real-time Alerts",
        url: "/alerts",
        icon: Icons.Alert,
        items: [],
      },
      {
        title: "Threat Map",
        url: "/location",
        icon: Icons.MapPin,
        items: [],
      },
      {
        title: "AI Analytics",
        icon: Icons.Brain,
        items: [
          {
            title: "Tsunami Detection",
            url: "/location",
          },
          {
            title: "Cyclone Tracking",
            url: "/cyclone",
          },
          {
            title: "ML Models",
            url: "/analytics/models",
          },
        ],
      },
      {
        title: "Community Reports",
        url: "/reports",
        icon: Icons.Users,
        items: [],
      }
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "AI Assistant",
        url: "/chatbot",
        icon: Icons.Bot,
        items: [],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Icons.Settings,
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
    ],
  },
];
