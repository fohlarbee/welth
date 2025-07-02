import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "$2B+",
    label: "Transactions Tracked and Risks detected",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into loan and Risk detection with AI-powered analytics",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Invoice Scanner",
    description:
      "Extract data automatically from Invoice and bankstaments using advanced AI technology",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Budget Planning",
    description: "Create and manage budgets with intelligent recommendations",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Account Support",
    description: "Manage multiple accounts and credit cards in one place",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multi-Currency",
    description: "Support for multiple currencies with real-time conversion",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description: "Get automated financial insights and recommendations",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Detect loan and spending risk",
    description:
      "Real-time detection of loan risks based on SME cash flow, credit history, and behavioral patterns.",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your finances",
  },
];

// Testimonials Data
export const testimonialsData = [
 {
  name: "Sarah Johnson",
  role: "Small Business Owner",
  image: "https://randomuser.me/api/portraits/women/75.jpg",
  quote:
    "The platform helped me understand my financial health better. I got loan recommendations tailored to my business cash flow, without guesswork.",
},
{
  name: "Michael Chen",
  role: "Freelancer",
  image: "https://randomuser.me/api/portraits/men/75.jpg",
  quote:
    "No more endless paperwork or waiting. The system analyzed my transaction patterns and suggested the best loan options instantly.",
},
{
  name: "Emily Rodriguez",
  role: "Financial Advisor",
  image: "https://randomuser.me/api/portraits/women/74.jpg",
  quote:
    "I recommend this platform to clients looking for data-driven loan guidance. The risk scoring and repayment analysis tools are incredibly smart and transparent.",
}

];