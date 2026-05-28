export type VacancyJob = {
  id: number;
  jobTitle: string;
  associatedProject: string;
  tenderRef: string;
  location: string;
  department: "BEPC" | "TCIL" | "RailTel";
  totalVacancies: number;
  filled: number;
  salaryRange: string;
  lastDateToApply: string;
  status: "OPEN" | "CLOSED" | "URGENT";
};

export type Project = {
  id: string;
  projectName: string;
  clientDept: "BEPC" | "TCIL" | "RailTel";
  tenderRef: string;
  totalJobs: number;
  jobsFilled: number;
  activeVacancies: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "CLOSED" | "ARCHIVED";
  tendersManaged: number;
};

export const allVacancies: VacancyJob[] = [
  { id: 1,  jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Kishanganj", department: "BEPC",   totalVacancies: 20, filled: 12, salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "30 Jun 2026", status: "OPEN" },
  { id: 2,  jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Patna",      department: "BEPC",   totalVacancies: 15, filled: 8,  salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "30 Jun 2026", status: "OPEN" },
  { id: 3,  jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Muzaffarpur",department: "BEPC",   totalVacancies: 10, filled: 10, salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "15 Jun 2026", status: "CLOSED" },
  { id: 4,  jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-2",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Gaya",       department: "BEPC",   totalVacancies: 12, filled: 5,  salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "15 Jul 2026", status: "URGENT" },
  { id: 5,  jobTitle: "Lab Support Technician",    associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Bhagalpur",  department: "TCIL",   totalVacancies: 8,  filled: 3,  salaryRange: "₹12,000 - ₹14,000", lastDateToApply: "30 Jun 2026", status: "OPEN" },
  { id: 6,  jobTitle: "Lab Support Technician",    associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Darbhanga",  department: "TCIL",   totalVacancies: 6,  filled: 2,  salaryRange: "₹12,000 - ₹14,000", lastDateToApply: "30 Jun 2026", status: "OPEN" },
  { id: 7,  jobTitle: "District Coordinator",      associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Patna",      department: "BEPC",   totalVacancies: 3,  filled: 1,  salaryRange: "₹18,000 - ₹22,000", lastDateToApply: "20 Jun 2026", status: "OPEN" },
  { id: 8,  jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-2",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Nalanda",    department: "BEPC",   totalVacancies: 8,  filled: 0,  salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "31 Jul 2026", status: "URGENT" },
  { id: 9,  jobTitle: "Data Entry Operator",       associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Patna",      department: "RailTel",totalVacancies: 5,  filled: 4,  salaryRange: "₹10,000 - ₹12,000", lastDateToApply: "25 Jun 2026", status: "OPEN" },
  { id: 10, jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Sitamarhi",  department: "BEPC",   totalVacancies: 7,  filled: 7,  salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "10 Jun 2026", status: "CLOSED" },
  { id: 11, jobTitle: "Lab Support Technician",    associatedProject: "BEPC ICT Lab Phase-2",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Vaishali",   department: "TCIL",   totalVacancies: 6,  filled: 2,  salaryRange: "₹12,000 - ₹14,000", lastDateToApply: "31 Jul 2026", status: "OPEN" },
  { id: 12, jobTitle: "District Coordinator",      associatedProject: "BEPC ICT Lab Phase-2",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Patna",      department: "BEPC",   totalVacancies: 2,  filled: 2,  salaryRange: "₹18,000 - ₹22,000", lastDateToApply: "01 Jun 2026", status: "CLOSED" },
  { id: 13, jobTitle: "ICT Lab Instructor",        associatedProject: "BEPC ICT Lab Phase-2",  tenderRef: "BEPC/ICT/2025-26/4000", location: "Araria",     department: "BEPC",   totalVacancies: 9,  filled: 0,  salaryRange: "₹14,066 - ₹15,437", lastDateToApply: "31 Jul 2026", status: "URGENT" },
  { id: 14, jobTitle: "Data Entry Operator",       associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Samastipur", department: "RailTel",totalVacancies: 4,  filled: 2,  salaryRange: "₹10,000 - ₹12,000", lastDateToApply: "30 Jun 2026", status: "OPEN" },
  { id: 15, jobTitle: "Lab Support Technician",    associatedProject: "BEPC ICT Lab Phase-1",  tenderRef: "BEPC/ICT/2025-26/2984", location: "Saran",      department: "TCIL",   totalVacancies: 5,  filled: 3,  salaryRange: "₹12,000 - ₹14,000", lastDateToApply: "30 Jun 2026", status: "OPEN" },
];

export const allProjects: Project[] = [
  { id: "BEPC/2984/01", projectName: "BEPC ICT Lab Phase-1 – Kishanganj",  clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/2984", totalJobs: 8,  jobsFilled: 5, activeVacancies: 3, startDate: "04 Jul 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 2 },
  { id: "BEPC/2984/02", projectName: "BEPC ICT Lab Phase-1 – Patna",       clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/2984", totalJobs: 10, jobsFilled: 7, activeVacancies: 3, startDate: "04 Jul 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 3 },
  { id: "BEPC/4000/01", projectName: "BEPC ICT Lab Phase-2 – Gaya",        clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/4000", totalJobs: 6,  jobsFilled: 2, activeVacancies: 4, startDate: "27 Aug 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 2 },
  { id: "BEPC/4000/02", projectName: "BEPC ICT Lab Phase-2 – Nalanda",     clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/4000", totalJobs: 5,  jobsFilled: 0, activeVacancies: 5, startDate: "27 Aug 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 2 },
  { id: "TCIL/2984/01", projectName: "TCIL Lab Support – Bhagalpur",       clientDept: "TCIL",    tenderRef: "BEPC/ICT/2025-26/2984", totalJobs: 4,  jobsFilled: 2, activeVacancies: 2, startDate: "04 Jul 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 1 },
  { id: "TCIL/4000/01", projectName: "TCIL Lab Support – Darbhanga",       clientDept: "TCIL",    tenderRef: "BEPC/ICT/2025-26/4000", totalJobs: 3,  jobsFilled: 1, activeVacancies: 2, startDate: "27 Aug 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 1 },
  { id: "RAIL/2984/01", projectName: "RailTel DEO – Patna",                clientDept: "RailTel", tenderRef: "BEPC/ICT/2025-26/2984", totalJobs: 3,  jobsFilled: 3, activeVacancies: 0, startDate: "04 Jul 2025", endDate: "31 Dec 2025", status: "CLOSED",   tendersManaged: 1 },
  { id: "RAIL/4000/01", projectName: "RailTel DEO – Samastipur",           clientDept: "RailTel", tenderRef: "BEPC/ICT/2025-26/4000", totalJobs: 2,  jobsFilled: 1, activeVacancies: 1, startDate: "27 Aug 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 1 },
  { id: "BEPC/2984/03", projectName: "BEPC ICT Lab Phase-1 – Muzaffarpur", clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/2984", totalJobs: 7,  jobsFilled: 7, activeVacancies: 0, startDate: "04 Jul 2025", endDate: "31 Mar 2026", status: "CLOSED",   tendersManaged: 2 },
  { id: "BEPC/4000/03", projectName: "BEPC ICT Lab Phase-2 – Araria",      clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/4000", totalJobs: 9,  jobsFilled: 0, activeVacancies: 9, startDate: "27 Aug 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 2 },
  { id: "BEPC/2984/04", projectName: "BEPC ICT Lab Phase-1 – Sitamarhi",   clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/2984", totalJobs: 5,  jobsFilled: 5, activeVacancies: 0, startDate: "04 Jul 2025", endDate: "31 Mar 2026", status: "ARCHIVED", tendersManaged: 1 },
  { id: "BEPC/4000/04", projectName: "BEPC ICT Lab Phase-2 – Vaishali",    clientDept: "BEPC",    tenderRef: "BEPC/ICT/2025-26/4000", totalJobs: 4,  jobsFilled: 1, activeVacancies: 3, startDate: "27 Aug 2025", endDate: "31 Mar 2026", status: "ACTIVE",   tendersManaged: 1 },
];
