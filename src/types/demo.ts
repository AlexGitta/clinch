export type AppView = "landing" | "demo-select" | "demo-owner" | "demo-pt" | "demo-member";

export type WeeklyClass = {
  id: string;
  day: number;
  start: string;
  end: string;
  title: string;
  coach: string;
  booked: number;
  capacity: number;
  room: string;
};

export type PtProfile = {
  id: string;
  name: string;
  coach: string;
  style: string;
  location: string;
  bio: string;
  upcoming: string[];
  focus: string[];
  stats: Array<{ label: string; value: string }>;
};

export type PtId = PtProfile["id"];

export type OwnerTab = "schedule" | "members" | "pts" | "billing";
export type MemberTab = "schedule" | "membership" | "trainers";

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  tier: string;
  monthlyFee: number;
  nextBilling: string;
  classesThisMonth: number;
  classesAllowed: number | "Unlimited";
  checkins7d: number;
};

export type PtSession = {
  id: string;
  ptId: PtId;
  day: number;
  date: string;
  start: string;
  end: string;
  type: "1-on-1" | "Small Group";
  spotsLeft: number;
  price: number;
};

export type OwnerMemberRow = {
  id: string;
  name: string;
  email: string;
  tier: string;
  monthlyFee: number;
  joined: string;
  status: "active" | "overdue" | "cancelled";
  lastCheckin: string;
};

export type InvoiceRow = {
  id: string;
  memberName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "failed";
  date: string;
  tier: string;
};

export type WeekDay = { short: string; long: string; date: string };
export type OwnerMetric = { label: string; value: string; note: string };
export type MembershipSlice = { name: string; count: number; percent: number };
export type TierDefinition = { name: string; price: number; description: string };
export type PtClient = { name: string; nextSession: string; package: string };

