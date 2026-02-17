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

