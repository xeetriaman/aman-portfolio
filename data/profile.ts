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

export const skills: { group: string; items: string[] }[] = [
  { group: "Data analysis", items: ["Python", "Pandas", "NumPy", "scikit-learn", "Matplotlib", "R", "R Markdown", "Data cleaning", "EDA", "Statistics", "Excel"] },
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
  /** Headline number for data projects, copied from the project's outputs. */
  result?: { value: string; label: string };
  links?: { label: string; href: string }[];
};

// New data projects get added to the top of this list as they ship.
export const projects: Project[] = [
  {
    title: "Women's Promotion Gap in Australian Workplaces, 2024–25",
    result: { value: "0.975", label: "women promoted per man at the same employer (pooled: 0.91)" },
    summary:
      "WGEA data for 8,115 employers and 5.24 million staff, analysed in SQL and Python. Pooled, women were promoted into management at 0.91 times the rate of men, but against men at the same employer the ratio is 0.975, so most of the gap comes from where women work; finance still shows a clear same-employer gap (0.79).",
    stack: ["Python", "SQL", "pandas", "Statistics", "Workforce analytics"],
    links: [
      { label: "Open dashboard", href: "/projects/women-promotion-gap" },
      { label: "Code and SQL", href: "https://github.com/xeetriaman/data-projects/tree/main/women-promotion-gap" },
    ],
  },
  {
    title: "NSW Retail Sales Forecast, 2010–2025",
    result: { value: "3.73%", label: "average forecast error a year ahead, against 6.41% for the baseline" },
    summary:
      "Fifteen years of ABS monthly retail turnover for NSW by store type, analysed in SQL and forecast a year ahead with Holt-Winters. Backtested over three years, it averaged 3.73% error against 6.41% for a same-month-last-year baseline, and 1.41% for total retail.",
    stack: ["Python", "SQL", "pandas", "statsmodels", "Forecasting"],
    links: [
      { label: "Open dashboard", href: "/projects/nsw-retail-forecast" },
      { label: "Code and SQL", href: "https://github.com/xeetriaman/data-projects/tree/main/nsw-retail-forecast" },
    ],
  },
  {
    title: "Sydney House Price Model, 2018",
    result: { value: "13.1%", label: "typical price error on later sales, against 14.7% for the baseline" },
    summary:
      "Cleaned 210,551 NSW Valuer General sale records to 37,910 Sydney house sales, tracked a 12% price fall through 2018 in SQL, and tested price models on later sales: gradient boosting beat the suburb-median baseline (13.1% vs 14.7% typical error).",
    stack: ["Python", "SQL", "pandas", "scikit-learn", "Machine learning"],
    links: [
      { label: "Open dashboard", href: "/projects/sydney-house-prices" },
      { label: "Code and SQL", href: "https://github.com/xeetriaman/data-projects/tree/main/sydney-house-prices" },
    ],
  },
  {
    title: "IPL Match Analytics, 2008–2026",
    result: { value: "80%", label: "of chases called correctly after 10 overs" },
    summary:
      "What decides a T20 match? Analysed all 1,243 IPL matches ball by ball with Python and SQL, found the toss barely matters, and built a live win-probability model that calls 80% of chases correctly after 10 overs.",
    stack: ["Python", "SQL", "pandas", "scikit-learn", "Data visualisation"],
    links: [
      { label: "Open dashboard", href: "/projects/ipl" },
      { label: "Code and SQL", href: "https://github.com/xeetriaman/data-projects/tree/main/ipl-match-analytics" },
    ],
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
