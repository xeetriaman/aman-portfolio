export const profile = {
  name: "Aman Chhetri",
  role: "Data analyst and developer",
  headline: "Data Analyst | Python, SQL, R | Master of Data Science",
  lede:
    "Master of Data Science student at Macquarie University. I clean, analyse and explain data with Python, SQL and R, and I build the web apps that put it in front of people.",
  about:
    "I came to data science from software development. During my Bachelor of Computer Science and Information Technology in Nepal I built full-stack web applications, then moved into data work as a Python and Data Science intern, automating data preparation and checking data quality with Pandas, NumPy and SQL. Now in my Master of Data Science at Macquarie University, I'm building on that with statistics, databases and machine learning, and I'm looking for internships and entry-level roles in data analysis or development.",
  email: "amanchhetri.aus@gmail.com",
  linkedin: "https://www.linkedin.com/in/amanchhetri7",
  github: "https://github.com/xeetriaman",
  resume: "/Aman_Chhetri_Resume.pdf",
  location: "Hurstville, Sydney",
};

// Career milestones, in time order. `t` is the date as a decimal year.
export type Milestone = { t: number; when: string; label: string; where: string; planned?: boolean };

export const path: Milestone[] = [
  { t: 2024.3, when: "2024", label: "BSc Computer Science & IT", where: "Tribhuvan University" },
  { t: 2024.92, when: "Dec 2024", label: "Frontend developer intern", where: "Laxmi Soft" },
  { t: 2025.25, when: "Apr 2025", label: "React developer intern", where: "Ripplebytes" },
  { t: 2025.5, when: "Jul 2025", label: "Python & data science intern", where: "Panacea Solutions" },
  { t: 2026.15, when: "2026", label: "Master of Data Science", where: "Macquarie University" },
  { t: 2028.45, when: "Jun 2028", label: "Graduate, data analyst", where: "Sydney", planned: true },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Data analysis", items: ["Python", "Pandas", "NumPy", "R", "R Markdown", "Data cleaning", "EDA", "Statistics", "Excel"] },
  { group: "Databases", items: ["SQL", "MySQL", "PostgreSQL", "MongoDB", "Relational design"] },
  { group: "Web development", items: ["React", "Next.js", "TypeScript", "Node.js", "Express", "REST APIs", "HTML/SCSS", "Tailwind"] },
  { group: "Tools", items: ["Git", "GitHub", "Jupyter", "VS Code", "Figma", "C"] },
];

export type Job = { when: string; title: string; org: string; points: string[] };

export const experience: Job[] = [
  {
    when: "Jul – Sep 2025",
    title: "Python & Data Science Intern",
    org: "Panacea Solutions",
    points: [
      "Built Python scripts that automated repetitive data cleaning and formatting work.",
      "Improved data accuracy by validating, cleaning and transforming datasets with Pandas and NumPy.",
      "Wrote SQL queries to extract, filter and join data from relational databases for analysis.",
    ],
  },
  {
    when: "Apr – Jun 2025",
    title: "React Developer Intern",
    org: "Ripplebytes, Kathmandu",
    points: [
      "Helped deliver an e-commerce website, building product, detail and cart pages in Next.js, React and TypeScript.",
      "Created reusable UI components and connected pages to backend APIs for live product data.",
    ],
  },
  {
    when: "Dec 2024 – Feb 2025",
    title: "Frontend Web Developer Intern",
    org: "Laxmi Soft Pvt. Ltd., Kathmandu",
    points: [
      "Turned Figma designs into responsive HTML and SCSS for hotel, evaluation and municipality management systems.",
      "Built dashboards, forms and navigation components and tested them across devices.",
    ],
  },
];

export type Project = {
  title: string;
  summary: string;
  stack: string[];
  status?: "in-progress";
  links?: { label: string; href: string }[];
};

// New data projects get added to the top of this list as they ship.
export const projects: Project[] = [
  {
    title: "Cricket match outcome prediction",
    summary: "Predicting T20 match results from toss, venue and recent team form, comparing models and evaluating them honestly.",
    stack: ["Python", "Pandas", "scikit-learn"],
    status: "in-progress",
  },
  {
    title: "Doctor Appointment Booking Platform",
    summary: "Full-stack booking app with patient and doctor dashboards, appointments, reviews and secure JWT login.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    links: [
      { label: "Live demo", href: "https://doctor-appointment-xi-kohl.vercel.app" },
      { label: "Frontend code", href: "https://github.com/xeetriaman/Doctor-Appointment-Project-Frontend" },
      { label: "Backend code", href: "https://github.com/xeetriaman/Doctor-Appointment-Project-Backend" },
    ],
  },
  {
    title: "Tour Booking Web App",
    summary: "Tour listings, bookings, reviews and user accounts in a React front end with an Express and MongoDB back end.",
    stack: ["React", "Express", "MongoDB"],
    links: [
      { label: "Live demo", href: "https://merntour.vercel.app" },
      { label: "Frontend code", href: "https://github.com/xeetriaman/Tour-Booking-Project-Frontend" },
      { label: "Backend code", href: "https://github.com/xeetriaman/Tour-Booking-Project-Backend" },
    ],
  },
];

export const education = [
  { degree: "Master of Data Science", school: "Macquarie University, Sydney", when: "2026 – expected Jun 2028" },
  {
    degree: "BSc Computer Science & Information Technology",
    school: "Himalaya College of Engineering (Tribhuvan University), Nepal",
    when: "Completed 2024",
  },
];

export const certifications = [
  "IBM Data Science Professional Certificate (in progress)",
  "Python and Data Science Training",
  "MERN Stack Development Training",
];
