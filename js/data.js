/**
 * Vectis Assess - Data Layer & Seed Data
 * Contains realistic enterprise dummy dataset for 50+ participants,
 * 10 tasks with all 4 question types, contest settings, submissions, and monitoring logs.
 */

const SEED_DATA = {
  contests: [
    {
      id: "contest-001",
      name: "Business Challenge 2026",
      description: "Comprehensive corporate strategy, market analysis, and operations competition.",
      track: "Strategy & Operations",
      status: "live",
      startDate: "2026-09-25",
      startTime: "10:00",
      endDate: "2026-09-30",
      endTime: "23:59",
      resultReleaseDate: "2026-10-01",
      resultRetentionDays: 15,
      participantIds: ["#027", "#087", "#231", "#112", "#001", "#002"],
      taskIds: ["task-01", "task-02", "task-03", "task-04", "task-05", "task-06", "task-07", "task-08", "task-09", "task-10"],
      settings: {
        contestName: "Business Challenge 2026",
        track: "Strategy & Operations",
        status: "LIVE",
        startDate: "2026-09-25",
        endDate: "2026-09-30",
        taskAccessMode: "all",
        leaderboardMode: "live",
        scoringMode: "mixed",
        timeRemainingSeconds: 16362,
        proctoring: {
          requireCamera: true,
          requireMicrophone: true,
          requireFullscreen: true,
          detectTabSwitch: true,
          detectWindowBlur: true
        }
      }
    }
  ],

  contestSettings: {
    contestName: "Business Challenge 2026",
    track: "Strategy & Operations",
    status: "LIVE",
    startDate: "2026-09-25",
    endDate: "2026-09-30",
    taskAccessMode: "all", // "all" or "sequential"
    leaderboardMode: "live", // "live" or "hidden"
    scoringMode: "mixed", // "mixed", "automatic", "manual"
    timeRemainingSeconds: 16362, // 04h 32m 42s
    proctoring: {
      requireCamera: true,
      requireMicrophone: true,
      requireFullscreen: true,
      detectTabSwitch: true,
      detectWindowBlur: true
    }
  },

  adminUser: {
    id: "admin-01",
    name: "Dr. Alistair Vance",
    email: "admin@demo.com",
    phone: "+8801700000001",
    password: "admin123",
    role: "admin",
    title: "Chief Assessment Director",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
  },

  participants: [
    {
      id: "participant-027",
      participantId: "#027",
      name: "Elena Rostova",
      email: "participant@demo.com",
      altEmail: "participant027@demo.com",
      phone: "+8801700000027",
      password: "123456",
      role: "participant",
      cohort: "Cohort Alpha",
      status: "active",
      school: "St. Jude Grammar School",
      college: "North Western College",
      university: "State University of Technology",
      address: "42 Riverside Ave, District 4",
      score: 640,
      tasksCompleted: 7,
      totalTasks: 10,
      rank: 27,
      trend: 3, // ↑ 3
      lastActive: "Just now",
      completionTimeMinutes: 245,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-087",
      participantId: "#087",
      name: "Marcus Vance",
      email: "participant087@demo.com",
      phone: "+8801700000087",
      password: "123456",
      school: "Beacon Hill Academy",
      college: "Metropolitan College",
      university: "Institute of Technology",
      role: "participant",
      cohort: "Cohort Alpha",
      status: "active",
      score: 980,
      tasksCompleted: 10,
      totalTasks: 10,
      rank: 1,
      trend: 0,
      lastActive: "4 mins ago",
      completionTimeMinutes: 198,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-231",
      participantId: "#231",
      name: "Soraya Chen",
      email: "participant231@demo.com",
      role: "participant",
      cohort: "Cohort Beta",
      status: "active",
      score: 950,
      tasksCompleted: 10,
      totalTasks: 10,
      rank: 2,
      trend: 1, // ↑ 1
      lastActive: "8 mins ago",
      completionTimeMinutes: 215,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-112",
      participantId: "#112",
      name: "Tariq Al-Mansoor",
      email: "participant112@demo.com",
      role: "participant",
      cohort: "Cohort Alpha",
      status: "active",
      score: 920,
      tasksCompleted: 9,
      totalTasks: 10,
      rank: 3,
      trend: -1, // ↓ 1
      lastActive: "12 mins ago",
      completionTimeMinutes: 230,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-044",
      participantId: "#044",
      name: "Liam O'Connor",
      email: "participant044@demo.com",
      role: "participant",
      cohort: "Cohort Gamma",
      status: "active",
      score: 900,
      tasksCompleted: 9,
      totalTasks: 10,
      rank: 4,
      trend: 0,
      lastActive: "15 mins ago",
      completionTimeMinutes: 242,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-301",
      participantId: "#301",
      name: "Chloe Dubois",
      email: "participant301@demo.com",
      role: "participant",
      cohort: "Cohort Beta",
      status: "active",
      score: 880,
      tasksCompleted: 9,
      totalTasks: 10,
      rank: 5,
      trend: 2, // ↑ 2
      lastActive: "22 mins ago",
      completionTimeMinutes: 250,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-194",
      participantId: "#194",
      name: "Hiroshi Tanaka",
      email: "participant194@demo.com",
      role: "participant",
      cohort: "Cohort Alpha",
      status: "active",
      score: 865,
      tasksCompleted: 8,
      totalTasks: 10,
      rank: 6,
      trend: -1,
      lastActive: "35 mins ago",
      completionTimeMinutes: 260,
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-001",
      participantId: "#001",
      name: "James Wilson",
      email: "participant001@demo.com",
      role: "participant",
      cohort: "Cohort Alpha",
      status: "active",
      score: 840,
      tasksCompleted: 8,
      totalTasks: 10,
      rank: 7,
      trend: 1,
      lastActive: "41 mins ago",
      completionTimeMinutes: 275,
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80"
    },
    {
      id: "participant-002",
      participantId: "#002",
      name: "Maya Patel",
      email: "participant002@demo.com",
      role: "participant",
      cohort: "Cohort Beta",
      status: "active",
      score: 810,
      tasksCompleted: 8,
      totalTasks: 10,
      rank: 8,
      trend: 0,
      lastActive: "50 mins ago",
      completionTimeMinutes: 280,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
    }
  ],

  // 10 Comprehensive Initial Tasks
  tasks: [
    {
      id: "task-01",
      taskNumber: "01",
      title: "Business Knowledge Diagnostic",
      description: "Baseline multi-choice diagnostic examining microeconomics, corporate governance, and market structures.",
      points: 100,
      deadline: "2025-10-25 12:00 UTC",
      timeLimitMinutes: 45,
      status: "published",
      track: "Strategy",
      questions: [
        {
          id: "q-01-1",
          type: "mcq",
          questionText: "Which metric best reflects short-term liquidity without inventory dependency?",
          points: 35,
          options: [
            { id: "A", text: "Current Ratio" },
            { id: "B", text: "Quick (Acid-Test) Ratio" },
            { id: "C", text: "Debt-to-Equity Ratio" },
            { id: "D", text: "Operating Margin" }
          ],
          correctAnswer: "B"
        },
        {
          id: "q-01-2",
          type: "mcq",
          questionText: "Under Porter's Five Forces, high switching costs for enterprise customers primarily weaken which force?",
          points: 35,
          options: [
            { id: "A", text: "Bargaining Power of Buyers" },
            { id: "B", text: "Bargaining Power of Suppliers" },
            { id: "C", text: "Threat of Substitutes" },
            { id: "D", text: "Competitive Rivalry" }
          ],
          correctAnswer: "A"
        },
        {
          id: "q-01-3",
          type: "mcq",
          questionText: "What corporate financial restructuring technique involves spin-off of non-core subsidiary assets?",
          points: 30,
          options: [
            { id: "A", text: "Horizontal Integration" },
            { id: "B", text: "Equity Carve-out / Divestiture" },
            { id: "C", text: "Reverse Triangular Merger" },
            { id: "D", text: "Poison Pill Defense" }
          ],
          correctAnswer: "B"
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-02",
      taskNumber: "02",
      title: "Market Expansion Strategy",
      description: "Evaluating target geographical jurisdictions and optimal go-to-market partner alliances.",
      points: 100,
      deadline: "2025-10-25 14:00 UTC",
      timeLimitMinutes: 60,
      status: "published",
      track: "Strategy",
      questions: [
        {
          id: "q-02-1",
          type: "mcq",
          questionText: "In cross-border expansions, which trade barrier involves non-monetary regulatory hurdles?",
          points: 40,
          options: [
            { id: "A", text: "Import Tariffs" },
            { id: "B", text: "Technical Barriers to Trade (TBT)" },
            { id: "C", text: "Ad Valorem Levies" },
            { id: "D", text: "Export Subsidies" }
          ],
          correctAnswer: "B"
        },
        {
          id: "q-02-2",
          type: "written",
          questionText: "Synthesize the trade-offs between localized licensing vs wholly-owned subsidiaries when entering high-growth emerging economies.",
          points: 60,
          characterLimit: 1500,
          rubric: "Address capex exposure, IP protection, and regulatory compliance."
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-03",
      taskNumber: "03",
      title: "Financial Modeling & Forecasts",
      description: "3-statement financial modeling projections, WACC determination, and discounted cash flow valuation.",
      points: 100,
      deadline: "2025-10-25 16:00 UTC",
      timeLimitMinutes: 60,
      status: "published",
      track: "Finance",
      questions: [
        {
          id: "q-03-1",
          type: "mcq",
          questionText: "If a company's Cost of Debt is 6%, Tax Rate is 25%, and Cost of Equity is 12% with equal D/E weighting, what is the WACC?",
          points: 40,
          options: [
            { id: "A", text: "8.25%" },
            { id: "B", text: "9.00%" },
            { id: "C", text: "7.50%" },
            { id: "D", text: "10.15%" }
          ],
          correctAnswer: "A"
        },
        {
          id: "q-03-2",
          type: "written",
          questionText: "Explain how changes in net working capital (NWC) flow through the Cash Flow Statement into Unlevered Free Cash Flow.",
          points: 60,
          characterLimit: 1200,
          rubric: "Clarify whether an increase in receivables represents a source or use of cash."
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-04",
      taskNumber: "04",
      title: "Operations Optimization Case",
      description: "Admin document inspection and bottleneck remediation using industrial telemetry.",
      points: 150,
      deadline: "2025-10-25 18:00 UTC",
      timeLimitMinutes: 75,
      status: "published",
      track: "Operations",
      questions: [
        {
          id: "q-04-1",
          type: "admin_pdf",
          questionText: "Review the attached manufacturing diagnostic audit and propose a 60-day corrective action plan for the assembly bottleneck.",
          points: 150,
          pdfName: "Operations_Audit_Benchmark_Q3.pdf",
          pdfSize: "2.1 MB",
          characterLimit: 2000,
          rubric: "Address equipment utilization, worker ergonomics, and buffer inventory sizing."
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-05",
      taskNumber: "05",
      title: "Integrated Business Challenge",
      description: "Multi-modal strategic assessment synthesizing balance sheet risk analysis, regional expansion scenarios, and executive board memorandums.",
      points: 100,
      deadline: "Today, 18:00 UTC",
      timeLimitMinutes: 90,
      status: "published",
      track: "Executive Strategy",
      questions: [
        {
          id: "q-05-1",
          type: "mcq",
          questionText: "Which of the following market entry strategies offers the highest operational control while balancing capital expenditure risk?",
          points: 10,
          options: [
            { id: "A", text: "Direct foreign subsidiary acquisition" },
            { id: "B", text: "Joint venture with local majority stakeholder" },
            { id: "C", text: "Greenfield strategic business unit with phased capital deployment" },
            { id: "D", text: "Non-exclusive master licensing agreement" }
          ],
          correctAnswer: "C"
        },
        {
          id: "q-05-2",
          type: "mcq",
          questionText: "In competitive positioning, what primary mechanism protects a firm’s economic moat against low-cost disruptive entrants?",
          points: 10,
          options: [
            { id: "A", text: "Aggressive pricing discount campaigns" },
            { id: "B", text: "High customer switching costs integrated into platform software" },
            { id: "C", text: "Increasing promotional advertising spend" },
            { id: "D", text: "Shortening product refresh cycles without feature variance" }
          ],
          correctAnswer: "B"
        },
        {
          id: "q-05-3",
          type: "mcq",
          questionText: "What key metric best indicates whether an enterprise SaaS expansion motion is sustainable over a 3-year horizon?",
          points: 10,
          options: [
            { id: "A", text: "Gross Customer Acquisition Cost without payback period" },
            { id: "B", text: "Net Revenue Retention (NRR) exceeding 115% with stable CAC payback under 14 months" },
            { id: "C", text: "Pure organic inbound impressions" },
            { id: "D", text: "Total headcount expansion rate" }
          ],
          correctAnswer: "B"
        },
        {
          id: "q-05-4",
          type: "written",
          questionText: "Explain how enterprise digital transformation improves cross-departmental supply chain resiliency during macroeconomic volatility.",
          points: 20,
          characterLimit: 2000,
          instructions: "Focus on real-time telemetry, demand forecasting integrations, and vendor risk mitigation frameworks."
        },
        {
          id: "q-05-5",
          type: "admin_pdf",
          questionText: "Based on the attached confidential case study document, identify the primary operational bottleneck in Phase 2 and propose a 90-day remediation schedule.",
          points: 20,
          pdfName: "Global_Supply_Disruption_Case_Study_2025.pdf",
          pdfSize: "2.4 MB",
          characterLimit: 2000,
          instructions: "State the bottleneck clearly and articulate a 30-60-90 day remediation cadence."
        },
        {
          id: "q-05-6",
          type: "upload_pdf",
          questionText: "Upload your comprehensive strategic roadmap solution as a single PDF document.",
          points: 30,
          allowedTypes: ".pdf",
          maxSizeMB: 10,
          instructions: "Ensure your document adheres to the corporate evaluation rubric: Executive Summary, Strategic Milestones, Risk Mitigation Matrix, and Financial ROI Projections."
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-06",
      taskNumber: "06",
      title: "Executive Crisis Management",
      description: "Real-time incident response to major cyber-breach scenario with regulatory compliance reporting obligations.",
      points: 150,
      deadline: "Today, 20:00 UTC",
      timeLimitMinutes: 45,
      status: "published",
      track: "Risk & Governance",
      questions: [
        {
          id: "q-06-1",
          type: "mcq",
          questionText: "Under GDPR Article 33, what is the statutory deadline for notifying supervisory authorities following a data breach?",
          points: 50,
          options: [
            { id: "A", text: "24 Hours" },
            { id: "B", text: "72 Hours" },
            { id: "C", text: "7 Days" },
            { id: "D", text: "30 Days" }
          ],
          correctAnswer: "B"
        },
        {
          id: "q-06-2",
          type: "written",
          questionText: "Draft an immediate public response communication addressing stakeholder concerns while preserving evidentiary chain of custody.",
          points: 100,
          characterLimit: 2500,
          instructions: "Incorporate stakeholder transparency, technical containment confirmation, and customer restitution guidance."
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-07",
      taskNumber: "07",
      title: "ESG & Corporate Governance",
      description: "Decarbonization strategy, Scope 1-3 audit methodologies, and sustainable governance compliance.",
      points: 100,
      deadline: "Tomorrow, 12:00 UTC",
      timeLimitMinutes: 60,
      status: "locked",
      track: "Governance",
      questions: [
        {
          id: "q-07-1",
          type: "mcq",
          questionText: "Which emission scope encompasses indirect emissions from an organization's upstream supply chain?",
          points: 40,
          options: [
            { id: "A", text: "Scope 1" },
            { id: "B", text: "Scope 2" },
            { id: "C", text: "Scope 3" },
            { id: "D", text: "Scope 4 (Avoided Emissions)" }
          ],
          correctAnswer: "C"
        },
        {
          id: "q-07-2",
          type: "written",
          questionText: "Formulate a board-level proposal linking executive compensation to audited ESG milestone achievements.",
          points: 60,
          characterLimit: 1500
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-08",
      taskNumber: "08",
      title: "Cross-Examination & Strategy Defense",
      description: "Interactive peer critique and defense of previous case recommendations under timed constraints.",
      points: 100,
      deadline: "Tomorrow, 15:00 UTC",
      timeLimitMinutes: 60,
      status: "locked",
      track: "Defense",
      questions: [
        {
          id: "q-08-1",
          type: "written",
          questionText: "Defend your Task 05 capital allocation choices against an adverse 300 bps interest rate hike scenario.",
          points: 100,
          characterLimit: 2000
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-09",
      taskNumber: "09",
      title: "Platform Architectural Scalability",
      description: "High-level enterprise architecture diagram and resiliency plan for 10x transaction volume surge.",
      points: 100,
      deadline: "Tomorrow, 18:00 UTC",
      timeLimitMinutes: 90,
      status: "locked",
      track: "Architecture",
      questions: [
        {
          id: "q-09-1",
          type: "upload_pdf",
          questionText: "Upload system architecture schematic showing multi-region active-active database clustering and latency targets.",
          points: 100,
          allowedTypes: ".pdf",
          maxSizeMB: 10
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    },
    {
      id: "task-10",
      taskNumber: "10",
      title: "Boardroom Capstone Deliverable",
      description: "Final comprehensive strategic presentation synthesized for the Board of Directors and institutional shareholders.",
      points: 100,
      deadline: "Tomorrow, 21:00 UTC",
      timeLimitMinutes: 120,
      status: "locked",
      track: "Capstone",
      questions: [
        {
          id: "q-10-1",
          type: "upload_pdf",
          questionText: "Upload the finalized Executive Board slide deck (.PDF) summarizing your 3-year strategic blueprint.",
          points: 100,
          allowedTypes: ".pdf",
          maxSizeMB: 10
        }
      ],
      proctoring: { camera: true, microphone: true, fullscreen: true }
    }
  ],

  // Participant task statuses for Participant #027
  participantTaskStates: {
    "task-01": { status: "completed", score: 100, submittedAt: "2 hours ago" },
    "task-02": { status: "completed", score: 95, submittedAt: "1 hour ago" },
    "task-03": { status: "completed", score: 85, submittedAt: "45 mins ago" },
    "task-04": { status: "under_review", score: null, submittedAt: "12 mins ago" },
    "task-05": { status: "in_progress", score: null, submittedAt: null },
    "task-06": { status: "not_started", score: null, submittedAt: null },
    "task-07": { status: "locked", score: null, submittedAt: null },
    "task-08": { status: "locked", score: null, submittedAt: null },
    "task-09": { status: "locked", score: null, submittedAt: null },
    "task-10": { status: "locked", score: null, submittedAt: null }
  },

  // Seed Submissions for Admin Submissions Review Page
  submissions: [
    {
      id: "sub-101",
      participantId: "#027",
      participantName: "Elena Rostova",
      taskId: "task-04",
      taskTitle: "Operations Optimization Case",
      submittedAt: "2025-10-25 15:48:12",
      status: "pending",
      earnedScore: null,
      maxScore: 150,
      answers: {
        "q-04-1": {
          type: "admin_pdf",
          questionText: "Review the attached manufacturing diagnostic audit and propose a 60-day corrective action plan.",
          pdfName: "Operations_Audit_Benchmark_Q3.pdf",
          answerText: "Phase 1: Deploy automated optical inspection (AOI) stations on Assembly Line 3 within 14 days to reduce defect propagation. Phase 2: Restructure buffer staging inventory to absorb 48-hour upstream delays. Phase 3: Transition to dynamic maintenance intervals based on vibration sensor telemetry, reducing unexpected machine downtime by 24%.",
          evaluatedScore: null,
          maxPoints: 150,
          feedback: ""
        }
      }
    },
    {
      id: "sub-102",
      participantId: "#087",
      participantName: "Marcus Vance",
      taskId: "task-05",
      taskTitle: "Integrated Business Challenge",
      submittedAt: "2025-10-25 14:30:00",
      status: "reviewed",
      earnedScore: 98,
      maxScore: 100,
      answers: {
        "q-05-1": { type: "mcq", selected: "C", isCorrect: true, points: 10 },
        "q-05-2": { type: "mcq", selected: "B", isCorrect: true, points: 10 },
        "q-05-3": { type: "mcq", selected: "B", isCorrect: true, points: 10 },
        "q-05-4": { type: "written", answerText: "Enterprise digital transformation enables real-time ERP integration...", evaluatedScore: 20, maxPoints: 20, feedback: "Exceptional analysis with realistic metrics." },
        "q-05-5": { type: "admin_pdf", answerText: "Identified supplier concentration risk on page 4...", evaluatedScore: 19, maxPoints: 20, feedback: "Sound 90-day remediation schedule." },
        "q-05-6": { type: "upload_pdf", fileName: "Marcus_Vance_Executive_Roadmap.pdf", evaluatedScore: 29, maxPoints: 30, feedback: "Robust financial projections." }
      }
    },
    {
      id: "sub-103",
      participantId: "#231",
      participantName: "Soraya Chen",
      taskId: "task-04",
      taskTitle: "Operations Optimization Case",
      submittedAt: "2025-10-25 15:10:22",
      status: "reviewed",
      earnedScore: 142,
      maxScore: 150,
      answers: {
        "q-04-1": {
          type: "admin_pdf",
          answerText: "Immediate prioritization of bottleneck station 4 through cross-trained rapid response teams...",
          evaluatedScore: 142,
          maxPoints: 150,
          feedback: "Great operational depth."
        }
      }
    },
    {
      id: "sub-104",
      participantId: "#112",
      participantName: "Tariq Al-Mansoor",
      taskId: "task-03",
      taskTitle: "Financial Modeling & Forecasts",
      submittedAt: "2025-10-25 14:02:18",
      status: "reviewed",
      earnedScore: 92,
      maxScore: 100,
      answers: {
        "q-03-1": { type: "mcq", selected: "A", isCorrect: true, points: 40 },
        "q-03-2": { type: "written", answerText: "Increases in receivables absorb cash...", evaluatedScore: 52, maxPoints: 60, feedback: "Clear explanation of working capital adjustments." }
      }
    }
  ],

  // Real-time Monitoring Telemetry Log
  monitoringEvents: [
    {
      id: "evt-01",
      participantId: "#027",
      timestamp: "10:43:02",
      isoTime: new Date().toISOString(),
      type: "camera_disconnect",
      title: "Camera connection interrupted",
      severity: "warning",
      details: "Temporary camera video frame freeze detected"
    },
    {
      id: "evt-02",
      participantId: "#027",
      timestamp: "10:42:11",
      isoTime: new Date().toISOString(),
      type: "tab_switch",
      title: "Tab switch detected",
      severity: "warning",
      details: "Application window lost focus for 3 seconds"
    },
    {
      id: "evt-03",
      participantId: "#027",
      timestamp: "10:30:15",
      isoTime: new Date().toISOString(),
      type: "fullscreen_enter",
      title: "Fullscreen entered",
      severity: "info",
      details: "Proctored full-screen lock engaged successfully"
    },
    {
      id: "evt-04",
      participantId: "#087",
      timestamp: "10:28:44",
      isoTime: new Date().toISOString(),
      type: "camera_connected",
      title: "Camera enabled",
      severity: "info",
      details: "1080p webcam feed synchronized"
    },
    {
      id: "evt-05",
      participantId: "#231",
      timestamp: "10:15:30",
      isoTime: new Date().toISOString(),
      type: "microphone_connected",
      title: "Microphone enabled",
      severity: "info",
      details: "Audio stream validated with acceptable SNR"
    }
  ]
};

// Generate 45+ additional realistic dummy participants to easily exceed the 50-participant threshold
(function generateAdditionalParticipants() {
  const firstNames = ["Alexander", "Beatrice", "Carlos", "Dmitri", "Emily", "Fatima", "Gabriel", "Hanna", "Igor", "Jessica", "Kiran", "Lena", "Mateo", "Nadia", "Oliver", "Priscilla", "Quinn", "Rami", "Svetlana", "Tobias", "Uma", "Victor", "Wendy", "Xavier", "Yuki", "Zain"];
  const lastNames = ["Kovacs", "Nakamura", "Dubois", "Schmidt", "Moreau", "Okafor", "Lindqvist", "Santos", "Popov", "Rossi", "Hassan", "Bakker", "Novak", "Gupta", "Kruger", "Johansson", "Morales", "Takahashi", "Larsson", "Bauer", "Volkov", "Silva"];
  const cohorts = ["Cohort Alpha", "Cohort Beta", "Cohort Gamma", "Cohort Delta"];

  let baseScore = 790;
  for (let i = 10; i <= 55; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const pidNum = String(i + 30).padStart(3, '0');
    const pId = `#${pidNum}`;
    baseScore = Math.max(220, baseScore - Math.floor(Math.random() * 14 + 5));
    const tasksDone = baseScore > 650 ? Math.floor(Math.random() * 2 + 6) : Math.floor(Math.random() * 4 + 2);

    const schools = ["Lincoln High School", "St. Mary Academy", "St. Jude Grammar School", "Beacon Hill Academy", "Oakridge Prep"];
    const colleges = ["North Western College", "Metropolitan College", "Trinity Business College", "Riverdale Institute"];
    const universities = ["State University of Technology", "National Institute of Business", "Apex University"];

    SEED_DATA.participants.push({
      id: `participant-${pidNum}`,
      participantId: pId,
      name: `${fn} ${ln}`,
      email: `participant${pidNum}@demo.com`,
      phone: `+8801700${pidNum}`,
      password: "123456",
      role: "participant",
      cohort: cohorts[i % cohorts.length],
      status: i % 15 === 0 ? "inactive" : "active",
      school: schools[i % schools.length],
      college: colleges[i % colleges.length],
      university: universities[i % universities.length],
      address: `${10 + i} University Avenue`,
      score: baseScore,
      tasksCompleted: tasksDone,
      totalTasks: 10,
      rank: i,
      trend: (i % 3 === 0) ? 1 : (i % 3 === 1 ? -1 : 0),
      lastActive: `${Math.floor(i * 1.5 + 4)} mins ago`,
      completionTimeMinutes: 280 + i * 4,
      avatar: `https://images.unsplash.com/photo-${1500000000000 + i * 12345}?auto=format&fit=crop&w=200&q=80`
    });
  }

  // Tag all tasks with contestId
  if (SEED_DATA.tasks) {
    SEED_DATA.tasks.forEach(t => {
      t.contestId = t.contestId || "contest-001";
    });
  }

  // Tag all submissions with contestId
  if (SEED_DATA.submissions) {
    SEED_DATA.submissions.forEach(s => {
      s.contestId = s.contestId || "contest-001";
    });
  }

  // Tag all monitoring events with contestId
  if (SEED_DATA.monitoringEvents) {
    SEED_DATA.monitoringEvents.forEach(e => {
      e.contestId = e.contestId || "contest-001";
    });
  }

  // Assign all participants to contest-001
  if (SEED_DATA.contests && SEED_DATA.contests[0]) {
    SEED_DATA.contests[0].participantIds = SEED_DATA.participants.map(p => p.participantId);
    SEED_DATA.contests[0].taskIds = SEED_DATA.tasks.map(t => t.id);
  }

  // Combined users roster
  SEED_DATA.users = [SEED_DATA.adminUser, ...SEED_DATA.participants];
})();

/**
 * Universal Contest Lifecycle Status Calculator
 * Evaluates whether contest is draft, upcoming, live, completed, or archived
 */
function getContestStatus(contest) {
  if (!contest) return 'draft';
  if (contest.status === 'draft') return 'draft';

  const now = new Date();
  const startStr = `${contest.startDate || '2026-09-25'}T${contest.startTime || '00:00'}:00`;
  const endStr = `${contest.endDate || '2026-09-30'}T${contest.endTime || '23:59'}:00`;
  
  const startTime = new Date(startStr).getTime();
  const endTime = new Date(endStr).getTime();
  const nowTime = now.getTime();

  if (nowTime < startTime) {
    return 'upcoming';
  }
  if (nowTime >= startTime && nowTime <= endTime) {
    return 'live';
  }

  // Check result retention period (e.g. 15 days)
  const retentionDays = Number(contest.resultRetentionDays) || 15;
  const retentionMs = retentionDays * 24 * 60 * 60 * 1000;
  if (nowTime > (endTime + retentionMs)) {
    return 'archived';
  }

  return 'completed';
}
