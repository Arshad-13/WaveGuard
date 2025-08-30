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
        url: "/map",
        icon: Icons.MapPin,
        items: [],
      },
      {
        title: "AI Analytics",
        icon: Icons.Brain,
        items: [
          {
            title: "Tsunami Detection",
            url: "/analytics/tsunami",
          },
          {
            title: "Cyclone Tracking",
            url: "/analytics/cyclone",
          },
          {
            title: "ML Models",
            url: "/analytics/models",
          },
        ],
      },
    ],
  },
  {
    label: "REPORTING",
    items: [
      {
        title: "Report Incident",
        url: "/report",
        icon: Icons.FileText,
        items: [],
      },
      {
        title: "Community Reports",
        url: "/reports",
        icon: Icons.Users,
        items: [],
      },
      {
        title: "Historical Data",
        icon: Icons.BarChart,
        items: [
          {
            title: "Incident History",
            url: "/history/incidents",
          },
          {
            title: "Weather Patterns",
            url: "/history/weather",
          },
          {
            title: "Seismic Activity",
            url: "/history/seismic",
          },
        ],
      },
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
