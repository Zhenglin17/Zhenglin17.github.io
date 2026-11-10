export type ExperienceItem = {
  slug: string;
  title: string;
  subtitle: string;
  category: "Work" | "Personal Project" | "Research" | "Course Project";
  hasDetails?: boolean;
  tags: string[];
  location: string;
  period: string;
  summary: string;
  bullets: string[];
  links: { label: string; href: string }[];
  images?: { src: string; alt: string; caption?: string }[];
};

export const items: ExperienceItem[] = [
  {
    slug: "plantops",
    title: "PlantOps · Inventory and Fulfillment System",
    subtitle: "Data Analyst at Wuhoo Tropicals · Full-Stack · Workflow Automation",
    category: "Work",
    hasDetails: true,
    tags: ["Django", "PostgreSQL", "Workflow Automation", "OCR", "LLM Structured Output", "Docker"],
    location: "Remote",
    period: "Jan 2026 – Present",
    summary:
      "Internal web app, developed with the assistance of coding agents, that runs a rare-plant e-commerce company's daily work, from plant records and care logs to live-sale prep, orders, shipping and returns. It significantly cut the time spent on care logging and record keeping, prevented missed details, simplified inventory management, and shortened live-sale prep. In daily use by the team.",
    bullets: [
      "Designed and shipped a Django and PostgreSQL system covering the whole workflow: plant records, care history and shelf moves, live-sale showcase cards, manual order entry, reservations, packing checks, shipping and returns.",
      "Turned live-sale prep into a one-click sheet export built on the plant database, cutting the work before each live sale from about two hours to about 15 minutes.",
      "Kept every care action, move and correction as history, so new staff can look up a plant's past instead of asking around, and details no longer get lost between people.",
      "Kept stock counts correct under concurrency. Reservations, shipping and returns run in short transactions that take row locks in a fixed order, and a database constraint lets one plant back at most one active order. Retried requests are idempotent, and a stale page cannot ship a cancelled order.",
      "Made label reading work with real phone photos. Tesseract OCR has an optional vision-model fallback, plus close-up retakes and manual entry, and every match is shown as candidates for staff to pick. A natural-language box drafts care logs through structured LLM output, which the app validates before anything is written.",
      "Shipped with automated tests (two-connection concurrency tests, Playwright browser flows), Docker Compose deployment, role-based access to private photos, and a backup-and-restore path tested on a clean environment.",
    ],
    links: [],
  },
  {
    slug: "asof",
    title: "asof · Point-in-Time Market Agent",
    subtitle: "Data Engineering · LLM Evaluation · Backtesting · Statistical Testing",
    category: "Personal Project",
    hasDetails: true,
    tags: ["Python", "DuckDB", "LLM Evaluation", "Backtesting", "Statistical Testing", "Data Pipelines"],
    location: "Independent",
    period: "Sep 2026 – Present",
    summary:
      "Point-in-time market research system that scans every evening, gathers filings as evidence, judges, executes in simulation and attributes each result, where every read of data sees only what was public at that instant. An LLM judge must quote a filing passage that was public then, checked word for word by code. Every strategy is measured by a pre-registered statistical gate before any claim of an edge.",
    bullets: [
      "Tested for an edge statistically. A permutation null replaces each trade's security with a random one from the same candidate pool on the same dates, 1,000 times, and p-values are corrected with a max statistic across every variant tried. Walk-forward windows, a thin-edge check (dropping the best trades, adding extra cost) and the minimum detectable edge sit beside SPY, QQQ and a top-10 basket.",
      "Pre-registered the evaluation protocol: development, holdout and clean dates and every gate setting are committed before a strategy is developed, and later edits may only append. Each strategy may open the sealed holdout year once, and results are split at the LLM's training cutoff.",
      "Wrote 17 leakage guards, each held by tests, plus a truncation test that rebuilds the security master from only what was knowable at an instant. On the real store, an audit runs 40 data checks.",
    ],
    links: [
      { label: "Live Demo", href: "https://zhenglin17.github.io/asof/" },
      { label: "Code", href: "https://github.com/Zhenglin17/asof" },
    ],
  },
  {
    slug: "research-agent",
    title: "Research Digest Bot",
    subtitle: "LLM Pipelines · Automation",
    category: "Personal Project",
    tags: ["Python", "LLM Pipelines", "Automation", "SQLite", "Telegram"],
    location: "Independent",
    period: "Apr 2026",
    summary:
      "Topic-agnostic digest bot that pulls new content from configured sources (RSS, PubMed and bioRxiv so far), dedupes, filters and ranks it in plain code, then has an LLM summarize and translate the top picks into a Telegram message. Topics live in YAML and sources plug in behind one interface, so it can follow any field or platform without code changes. Ran stably three evenings a week for over two months.",
    bullets: [],
    links: [
      { label: "Code", href: "https://github.com/Zhenglin17/Research-Agent" },
    ],
  },
  {
    slug: "normal-flow",
    title: "Normal Flow and Camera Ego-Motion Estimation",
    subtitle: "Event Cameras · Sensor Fusion · 3D Vision · Optical Flow",
    category: "Research",
    hasDetails: true,
    tags: ["Event Cameras", "Sensor Fusion", "3D Vision", "Optical Flow", "PyTorch"],
    location: "College Park, MD",
    period: "Sep 2023 – Jan 2024",
    summary:
      "PhD research at UMD on normal flow for event cameras. Set up normal flow baselines on the EVIMO dataset, where only optical flow baselines existed before, and used the IMU's rotation to separate camera ego-motion from the flow.",
    bullets: [
      "Helped define normal flow baselines on EVIMO. Earlier event camera work only reported optical flow baselines, so normal flow methods had nothing fair to be compared against.",
      "Surveyed dozens of event-based flow papers and found almost none whose released code ran as published. Spent a significant amount of time studying, understanding, modifying and porting existing code, and brought E-RAFT, a learning-based optical flow model, to EVIMO as the learning-based baseline.",
      "Mapped the IMU's axes to the camera frame and checked the result against motion-capture ground truth. Then used the IMU rotation to warp events and remove the rotational part of the normal flow, leaving translation and depth to be recovered from the rest.",
      "Computed classical normal flow from events by fitting local planes to them, alongside ground-truth normal flow derived from EVIMO's optical flow.",
    ],
    links: [
      { label: "EVIMO Dataset", href: "https://better-flow.github.io/evimo/" },
      { label: "Code (E-RAFT ported to EVIMO)", href: "https://github.com/Zhenglin17/e_raft_evimo" },
    ],
    images: [
      {
        src: "/media/normal-flow/evimo-dataset.png",
        alt: "EVIMO dataset preview",
        caption:
          "EVIMO — indoor event camera dataset with 200 Hz pose tracking, pixelwise object masks at 40 Hz, and depth maps.",
      },
    ],
  },
  {
    slug: "feature-matching",
    title: "Feature Matching for Event Camera",
    subtitle: "3D Vision · Deep Learning",
    category: "Research",
    hasDetails: true,
    tags: ["3D Vision", "Deep Learning", "COLMAP", "Event Camera"],
    location: "Philadelphia, PA",
    period: "May 2022 – Feb 2023",
    summary:
      "Trained keypoint matching network on event camera data using COLMAP-based ground truth — improved accuracy under motion blur and low-light.",
    bullets: [
      "Aligned DSEC event streams with conventional frames and triangulated 3D points with COLMAP, creating reliable ground-truth correspondences and greatly increasing the usable training pairs for event-based feature matching.",
      "Trained a keypoint matching network with a cross-entropy interest point loss and a hinge descriptor loss, improving accuracy under motion blur and low light through patch-based versus global ablations and more effective hard negative mining.",
    ],
    links: [
      { label: "DSEC Dataset", href: "https://dsec.ifi.uzh.ch/" },
      { label: "Code", href: "https://github.com/Zhenglin17/Feature-point-matching" },
    ],
    images: [
      {
        src: "https://dsec.ifi.uzh.ch/wp-content/uploads/2021/05/thumbnail.png",
        alt: "DSEC dataset overview",
        caption: "DSEC — large-scale stereo event camera dataset for driving scenarios.",
      },
      {
        src: "https://dsec.ifi.uzh.ch/wp-content/uploads/2021/10/flow-thumbnail.png",
        alt: "DSEC optical flow ground truth",
        caption: "DSEC optical flow ground truth used for training and evaluation.",
      },
    ],
  },
  {
    slug: "fruit-counting",
    title: "Robust Fruit Counting",
    subtitle: "Robotics Perception · System Engineering",
    category: "Research",
    tags: ["YOLO", "Kalman Filter", "Robotics Perception", "Multi-view Geometry"],
    location: "Philadelphia, PA",
    period: "Nov 2021 – Mar 2022",
    summary:
      "Multi-stage fruit counting system for long image sequences, combining YOLO detection, association and motion modeling. Kalman filtering and multi-view geometry pose priors reduced double and multi-counting by 60% while staying within deployment runtime limits.",
    bullets: [],
    links: [
      { label: "Code", href: "https://github.com/Zhenglin17/Counting-and-Tracking" },
    ],
  },
  {
    slug: "solo",
    title: "SOLO on Biomedical Hemostatic Plug Image",
    subtitle: "Instance Segmentation · Deep Learning · Model Architecture",
    category: "Course Project",
    tags: ["Instance Segmentation", "Deep Learning", "ResNet-50", "GRU", "DBSCAN"],
    location: "Philadelphia, PA",
    period: "Sep 2021 – Dec 2021",
    summary:
      "Adapted SOLO with a custom ResNet-50 backbone and GRU modules across FPN levels for biomedical hemostatic plug images. DBSCAN-based preprocessing and robust augmentation improved label consistency and raised binary instance segmentation F1 by 12% over the benchmark.",
    bullets: [],
    links: [
      { label: "Code", href: "https://github.com/Zhenglin17/Solo-and-RNN-Solo" },
    ],
  },
  {
    slug: "block-grabbing",
    title: "Block Grabbing · Robotic Arm Motion",
    subtitle: "Motion Planning · Control",
    category: "Course Project",
    tags: ["Motion Planning", "A* Search", "Rigid Body Transforms", "Control"],
    location: "Philadelphia, PA",
    period: "Dec 2020",
    summary:
      "Robotic arm planning with rigid body transforms, A* search and task heuristics for dynamic targets. Grasping and stacking used orientation constraints and recovery logic, finishing 3rd out of 30 teams in a live 2v2 competition.",
    bullets: [],
    links: [],
  },
  {
    slug: "llm-fine-tuning",
    title: "Fine-Tuning a Large Language Model",
    subtitle: "Large Language Models",
    category: "Personal Project",
    tags: ["LLM", "Fine-Tuning"],
    location: "",
    period: "Planned",
    summary: "A planned project on fine-tuning a large language model. Not started yet.",
    bullets: [],
    links: [],
  },
];
