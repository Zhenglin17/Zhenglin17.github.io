export type ExperienceItem = {
  slug: string;
  title: string;
  subtitle: string;
  category: "Personal Project" | "Research" | "Course Project";
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
    slug: "asof",
    title: "asof · Point-in-Time Market Research Rig",
    subtitle: "Data Engineering · LLM Evaluation · Backtesting",
    category: "Personal Project",
    tags: ["Python", "DuckDB", "LLM Evaluation", "Backtesting", "Data Pipelines"],
    location: "Independent",
    period: "Sep 2026 – Present",
    summary:
      "Market research system where data and LLM claims can only use what was public at the time, with every claim traced to a citable source.",
    bullets: [
      "Built a store where every read is bound to an as-of instant: daily bars for all listed US symbols since 2020 (delisted ones included), a security master that follows tickers across renames and reuse, and 11,522 SEC filings in 703,614 citable chunks.",
      "Made LLM judgements checkable: the model fills a fixed schema, and code verifies that each claim quotes, word for word, a passage that was public at that instant.",
      "Measured every replay against random entries from the same pool, SPY and QQQ, with all parameter sets registered, 17 leakage guards and 40 data audits.",
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
      "Topic-agnostic pipeline that turns journal feeds into a short LLM-written digest on Telegram, first configured for a biomedical researcher.",
    bullets: [
      "Built a pipeline that fetches recent papers from RSS, PubMed and bioRxiv, then dedupes, filters, ranks, summarizes and pushes a digest to Telegram.",
      "Kept dedupe, filtering and ranking in plain code and limited the LLM to summarizing and translating, so a failed call degrades the digest instead of cancelling it.",
      "Moved all domain knowledge into YAML, so switching fields takes no code changes; every stage writes an inspectable artifact, and the project has 200 tests.",
    ],
    links: [
      { label: "Code", href: "https://github.com/Zhenglin17/Research-Agent" },
    ],
  },
  {
    slug: "normal-flow",
    title: "Normal Flow and Camera Ego-Motion Estimation",
    subtitle: "Computer Vision · Sensor Fusion · 3D Vision · Optical Flow",
    category: "Research",
    tags: ["Computer Vision", "Sensor Fusion", "3D Vision", "Optical Flow", "PyTorch"],
    location: "College Park, MD",
    period: "Dec 2023 – May 2024",
    summary:
      "End-to-end event camera normal flow pipeline with IMU fusion — cut rotation drift 50% and enabled stable downstream perception.",
    bullets: [
      "Built an end-to-end normal flow estimation pipeline for event cameras on EVIMO in PyTorch, with reproducible benchmarks against classical and learning-based baselines for more reliable model comparisons.",
      "Fused IMU measurements with vision-derived flow to estimate camera ego-motion in a consistent world frame, reducing rotation drift by 50% through frame alignment checks and giving downstream perception more stable poses.",
      "Organized training and evaluation into modular, configurable scripts with standardized datasets and metrics, making experiments easier to reproduce and share.",
    ],
    links: [
      { label: "EVIMO Dataset", href: "https://better-flow.github.io/evimo/" },
      { label: "Code (normal_flow)", href: "https://github.com/Zhenglin17/normal_flow" },
      { label: "Code (e_raft_evimo)", href: "https://github.com/Zhenglin17/e_raft_evimo" },
    ],
    images: [
      {
        src: "https://better-flow.github.io/evimo/img/dataset.png",
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
      "Multi-stage fruit counting system combining YOLO, Kalman filtering, and pose priors — reduced multi-counting by 60%.",
    bullets: [
      "Prototyped a multi-stage fruit counting system for long image sequences, combining YOLO detection, association and motion modeling. Kalman filtering and multi-view geometry pose priors reduced double and multi-counting by 60% while staying within deployment runtime limits.",
      "Conducted error analysis, data validation, and runtime profiling on long sequences to identify edge cases and improve the stability of the end-to-end pipeline.",
    ],
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
      "Adapted SOLO with a custom ResNet-50 + GRU backbone for biomedical image segmentation — boosted F1 by 12%.",
    bullets: [
      "Standardized a biomedical hemostatic plug slice dataset with DBSCAN-based preprocessing and robust augmentation, improving label consistency and raising binary instance segmentation F1 by 12% over the benchmark.",
      "Adapted SOLO with a customized ResNet-50 backbone and added GRU modules across FPN levels for domain adaptation, improving instance segmentation accuracy after hyperparameter tuning and ablation analysis.",
    ],
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
      "Robotic arm planning with A* and collision-aware trajectories — 3rd place out of 30 teams in a live 2v2 competition.",
    bullets: [
      "Implemented robotic arm planning with rigid body transforms, A* search and task heuristics for dynamic targets, raising pick success in a 2v2 competition by optimizing approach poses, collision-aware trajectories and execution time.",
      "Engineered grasping and stacking in static and dynamic environments with orientation constraints and recovery logic, finishing 3rd out of 30 teams through better end-effector alignment and consistent execution under strict timing.",
    ],
    links: [],
  },
];
