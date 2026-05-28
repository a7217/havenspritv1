export type Applicant = {
  id: number;
  name: string;
  appliedJob: string;
  tender: "PWD" | "NHAI" | "Metro";
  qualification: string;
  experience: number;
  submissionDate: string;
  resumeStatus: "uploaded" | "missing";
  applicationStatus: "PENDING" | "SELECTED" | "SHORTLISTED" | "REJECTED";
};

export type VacancyPerformance = {
  job: string;
  filled: number;
  total: number;
  lastDate: string;
  status: "PENDING" | "SHORTLISTED" | "SELECTED" | "CLOSED";
};

export const allApplicants: Applicant[] = [
  { id: 1,  name: "Rajesh Kumar",    appliedJob: "Senior Engineer - PWD Pruinv Phase...", tender: "PWD",   qualification: "M.Tech", experience: 8, submissionDate: "29 Apr 2023", resumeStatus: "missing",  applicationStatus: "PENDING" },
  { id: 2,  name: "Anita Sharma",    appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "M.Tech", experience: 8, submissionDate: "29 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SELECTED" },
  { id: 3,  name: "Nagendra Singh",  appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "M.Tech", experience: 7, submissionDate: "29 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SHORTLISTED" },
  { id: 4,  name: "Priya Mehta",     appliedJob: "METRO HQ, Phase-4",                     tender: "Metro", qualification: "M.Tech", experience: 6, submissionDate: "29 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SHORTLISTED" },
  { id: 5,  name: "Suresh Patel",    appliedJob: "Senior Civil Engineer",                 tender: "PWD",   qualification: "M.Tech", experience: 6, submissionDate: "29 Apr 2023", resumeStatus: "missing",  applicationStatus: "REJECTED" },
  { id: 6,  name: "Deepak Verma",    appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "M.Tech", experience: 5, submissionDate: "29 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SELECTED" },
  { id: 7,  name: "Kavita Rao",      appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "M.Tech", experience: 4, submissionDate: "29 Apr 2023", resumeStatus: "missing",  applicationStatus: "SELECTED" },
  { id: 8,  name: "Arun Mishra",     appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "M.Tech", experience: 2, submissionDate: "29 Apr 2023", resumeStatus: "missing",  applicationStatus: "PENDING" },
  { id: 9,  name: "Pooja Singh",     appliedJob: "Site Engineer - PWD",                   tender: "PWD",   qualification: "B.Tech", experience: 3, submissionDate: "28 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SHORTLISTED" },
  { id: 10, name: "Vikram Nair",     appliedJob: "Project Manager - Metro",               tender: "Metro", qualification: "M.Tech", experience: 10, submissionDate: "28 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SELECTED" },
  { id: 11, name: "Sunita Gupta",    appliedJob: "Accountant - NHAI",                     tender: "NHAI",  qualification: "B.Com",  experience: 5, submissionDate: "27 Apr 2023", resumeStatus: "uploaded", applicationStatus: "PENDING" },
  { id: 12, name: "Harish Pandey",   appliedJob: "Senior Civil Engineer",                 tender: "PWD",   qualification: "M.Tech", experience: 9, submissionDate: "27 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SELECTED" },
  { id: 13, name: "Meena Tiwari",    appliedJob: "Safety Officer - Metro",                tender: "Metro", qualification: "B.Tech", experience: 4, submissionDate: "26 Apr 2023", resumeStatus: "missing",  applicationStatus: "REJECTED" },
  { id: 14, name: "Ravi Shankar",    appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "M.Tech", experience: 6, submissionDate: "26 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SHORTLISTED" },
  { id: 15, name: "Divya Pillai",    appliedJob: "METRO HQ, Phase-4",                     tender: "Metro", qualification: "MBA",    experience: 7, submissionDate: "25 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SELECTED" },
  { id: 16, name: "Sanjeev Kumar",   appliedJob: "Site Engineer - PWD",                   tender: "PWD",   qualification: "B.Tech", experience: 2, submissionDate: "25 Apr 2023", resumeStatus: "missing",  applicationStatus: "PENDING" },
  { id: 17, name: "Lalita Devi",     appliedJob: "Accountant - NHAI",                     tender: "NHAI",  qualification: "B.Com",  experience: 3, submissionDate: "24 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SHORTLISTED" },
  { id: 18, name: "Mohan Das",       appliedJob: "Senior Civil Engineer",                 tender: "PWD",   qualification: "M.Tech", experience: 11, submissionDate: "24 Apr 2023", resumeStatus: "uploaded", applicationStatus: "SELECTED" },
  { id: 19, name: "Kiran Bose",      appliedJob: "Project Manager - Metro",               tender: "Metro", qualification: "M.Tech", experience: 8, submissionDate: "23 Apr 2023", resumeStatus: "uploaded", applicationStatus: "PENDING" },
  { id: 20, name: "Ashok Tewari",    appliedJob: "NHAI Highway Pha...",                   tender: "NHAI",  qualification: "B.Tech", experience: 5, submissionDate: "23 Apr 2023", resumeStatus: "missing",  applicationStatus: "REJECTED" },
];

export const latestApplicants = allApplicants.slice(0, 7);

export const vacancyPerformance: VacancyPerformance[] = [
  { job: "Senior Civil Engineer - (NHAI Highway Phase-4)", filled: 4,  total: 10, lastDate: "29 Apr 2023", status: "PENDING" },
  { job: "Senior Civil Engineer - Highway",                filled: 7,  total: 6,  lastDate: "29 Apr 2023", status: "SHORTLISTED" },
  { job: "Senior Civil Engineer - Highway",                filled: 10, total: 10, lastDate: "29 Apr 2023", status: "SHORTLISTED" },
  { job: "Senior Civil Engineer - (NHAI Highway Phase-4)", filled: 2,  total: 8,  lastDate: "30 Apr 2023", status: "PENDING" },
  { job: "Project Manager - Metro Line-3",                 filled: 3,  total: 5,  lastDate: "28 Apr 2023", status: "SELECTED" },
  { job: "Accountant - NHAI HQ",                           filled: 17, total: 17, lastDate: "21 Apr 2023", status: "SELECTED" },
];

export const tenderDistribution = [
  { name: "PWD",   count: 87 },
  { name: "NHAI",  count: 54 },
  { name: "METRO", count: 20 },
];

export const dashboardStats = {
  totalApplications: 168393,
  activeTenders: 14,
  selectedCandidates: 10,
  pendingReviews: 1,
};
