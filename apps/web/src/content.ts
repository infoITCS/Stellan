export const serviceSlugs = [
  'cybersecurity',
  'it-consulting',
  'cloud-services',
  'managed-it',
  'network-infrastructure',
  'enterprise-automation',
  'ai-engineering',
  'web-development'
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export type ServiceIcon =
  | 'support'
  | 'cloud'
  | 'shield'
  | 'network'
  | 'compass'
  | 'workflow'
  | 'spark'
  | 'code';

export interface Capability {
  title: string;
  description: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const servicesPageFaqs: FaqItem[] = [
  { question: 'Can Stellan work with our existing technology team?', answer: 'Yes. We can lead a defined workstream, complement an existing provider, or help an internal team make a decision and build the operating pattern around it. The engagement starts with responsibilities and desired outcomes.' },
  { question: 'Can Stellan work with distributed teams?', answer: 'Yes. We work remotely with teams across locations and time zones. We make the delivery model, coordination rhythm, regulatory context, and applicable requirements explicit before scope is set.' },
  { question: 'How do engagements begin?', answer: 'We start with a short conversation about the decision or constraint in front of you. From there, we suggest a focused discovery, assessment, or delivery slice with clear boundaries and a way to evaluate the result.' },
  { question: 'Can you help choose a platform or provider?', answer: 'We can define requirements, compare options against real scenarios, and document the decision. We do not claim a partner tier or accept a recommendation fee that would compromise the advice.' }
];

export const contactPageFaqs: FaqItem[] = [
  { question: 'What should I include in the first message?', answer: 'A short description of the decision, constraint, or system you are working through is enough to begin. Details about timing, stakeholders, and current tools can help, but a polished brief is not required.' },
  { question: 'Will you work with an existing technology provider?', answer: 'Often, yes. We can complement an existing provider, lead a defined workstream, or provide an independent technical view. The right arrangement depends on ownership and the gap you need to close.' },
  { question: 'What happens after I submit the form?', answer: 'Your request is stored as soon as you submit it and lands in our inbox, so nothing is lost between your browser and this page. We read it, check which service area it belongs to, and reply with a question or a proposed next step.' },
  { question: 'Can we discuss a remote engagement?', answer: 'Yes. Tell us where your team is located, the time zones involved, and how work is coordinated today. We will make delivery assumptions explicit before suggesting a scope.' }
];

export interface Service {
  slug: ServiceSlug;
  number: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  description: string;
  h1: string;
  overview: string[];
  capabilities: Capability[];
  outcomes: string[];
  process: ProcessStep[];
  faqs: FaqItem[];
  related: ServiceSlug[];
  tags: string[];
  icon: ServiceIcon;
  frameworks?: string[];
  engagements?: EngagementOffer[];
  catalog?: Capability[];
}

export interface EngagementOffer {
  title: string;
  duration: string;
  description: string;
  includes: string[];
}

export interface FounderProfile {
  name: string;
  initials: string;
  role: string;
  location: string;
  summary: string;
  bio: string[];
  certifications: string[];
  linkedin: string;
}

export interface CaseStudy {
  sector: string;
  challenge: string;
  work: string;
  result: string;
  metric: string;
  metricLabel: string;
  duration: string;
  tags: string[];
}

export interface Partner {
  name: string;
  category: string;
  logo: string;
}

export interface Testimonial {
  quote: string;
  role: string;
  sector: string;
  initials: string;
}

const supportFaqs: FaqItem[] = [
  {
    question: 'Can you work with our existing IT providers?',
    answer: 'Yes. The engagement can complement an existing provider, fill a defined service gap, or help establish a clearer operating model. We start with responsibilities, escalation paths, and the tools already in use so ownership is explicit from the beginning.'
  },
  {
    question: 'What does managed IT include?',
    answer: 'The scope is shaped around your needs and may include service desk support, endpoint care, identity administration, monitoring, patch coordination, documentation, and vendor follow-through. A written coverage map keeps routine work and planned work distinguishable.'
  },
  {
    question: 'How do you handle urgent incidents?',
    answer: 'We define severity, contact, and escalation rules before support begins. Urgent issues are triaged by impact, communicated with a clear next update, and documented so the underlying pattern can be addressed rather than repeated.'
  },
  {
    question: 'Can you support a remote-first team?',
    answer: 'Yes. Remote delivery is designed into the workflow with asynchronous handoffs, documented procedures, and time-zone-aware coverage. The goal is a support experience that works for distributed teams without adding unnecessary process.'
  }
];

const cloudFaqs: FaqItem[] = [
  {
    question: 'Do you work with multi-cloud environments?',
    answer: 'We can help teams reason across public cloud, private infrastructure, and hybrid patterns. The recommendation is based on workload requirements, operating capacity, data movement, and the skills your team can sustain—not on a platform preference.'
  },
  {
    question: 'Can you help reduce an existing cloud bill?',
    answer: 'Yes, after establishing a reliable baseline. We review utilization, commitments, architecture, and ownership, then separate immediate cleanup from structural changes. Every recommendation should have an expected mechanism, an owner, and a way to verify the result.'
  },
  {
    question: 'How do you approach a migration?',
    answer: 'We begin with discovery and dependency mapping, define a small migration slice, and rehearse the cutover with rollback criteria. Work advances in observable increments so technical progress and business readiness remain connected.'
  },
  {
    question: 'Will our internal team be able to maintain the result?',
    answer: 'That is part of the design brief. We document the operating model, automate repeatable controls where appropriate, and pair with the people who will own the platform so knowledge stays close to the team using it.'
  }
];

const securityFaqs: FaqItem[] = [
  {
    question: 'Which security frameworks do you work with?',
    answer: 'Our work commonly maps to NIST CSF, ISO 27001, SOC 2, CIS Controls, HIPAA, and CMMC. We select the framework that matches your obligations and customers, then build one control set that can be evidenced against each requirement.'
  },
  {
    question: 'What is included in a vulnerability assessment?',
    answer: 'The assessment covers asset discovery, configuration review, vulnerability scanning, validation, prioritization, and a practical remediation plan. Findings are ranked by exposure and business context rather than scanner severity alone.'
  },
  {
    question: 'Can you help us prepare for a customer security review or audit?',
    answer: 'Yes. We organize evidence, clarify control ownership, identify gaps, and build a prioritized remediation path mapped to the relevant framework. We prepare you to demonstrate the controls you actually operate; the certification or audit decision remains with the independent assessor.'
  },
  {
    question: 'Do you provide ongoing security monitoring or a vCISO?',
    answer: 'Yes. Monitoring can be included as a defined service layer, and our vCISO retainer provides senior security leadership, governance, risk reporting, and an accountable owner for the program. We design alert routes, playbooks, and review cadences so signals lead to action instead of noise.'
  },
  {
    question: 'How do you balance security with delivery speed?',
    answer: 'We look for controls that are proportionate, testable, and visible in the workflow. Threat modeling and early review usually make later changes less expensive than discovering a risk during launch.'
  }
];

const networkFaqs: FaqItem[] = [
  {
    question: 'Can you support a network refresh without disrupting operations?',
    answer: 'Yes. We document the current state, sequence the work into testable phases, and agree on rollback and communication points before changing production. A refresh is treated as an operating change, not just new hardware.'
  },
  {
    question: 'Do you design wireless for distributed offices?',
    answer: 'We can assess coverage, capacity, roaming, identity, and cabling requirements for offices, warehouses, and hybrid spaces. The design reflects how people and devices actually move through the site.'
  },
  {
    question: 'How do you document network changes?',
    answer: 'We produce practical diagrams, address and interface records, configuration notes, and a change log. The goal is a network another capable team can understand and safely maintain.'
  },
  {
    question: 'Can you work with an existing network vendor?',
    answer: 'Yes. We can lead design, coordinate the vendor, review changes, or provide an independent technical view. The right role depends on where your internal team has capacity and where independent accountability is useful.'
  }
];

const consultingFaqs: FaqItem[] = [
  {
    question: 'What does an IT strategy engagement produce?',
    answer: 'A useful strategy creates shared decisions: priority capabilities, target architecture, investment sequence, ownership, and measures for learning. It is a working plan for choices, not a document that sits unused after a presentation.'
  },
  {
    question: 'Do you work with leadership and technical teams?',
    answer: 'Yes. Effective technology decisions need business context, risk boundaries, and technical detail. We facilitate conversations across those groups and make trade-offs visible without hiding behind jargon.'
  },
  {
    question: 'Can you help with vendor selection?',
    answer: 'We can define requirements, evaluation criteria, reference scenarios, and decision records. We do not represent a partner tier or accept a commission for a recommendation; the process stays focused on fit and evidence.'
  },
  {
    question: 'How long does a consulting engagement take?',
    answer: 'The duration follows the decision and the evidence needed. A focused discovery may be short, while an operating-model or architecture effort usually benefits from several working sessions and a clearly bounded follow-up period.'
  }
];

const automationFaqs: FaqItem[] = [
  {
    question: 'Which Microsoft platforms do you work with?',
    answer: 'The work may involve Microsoft 365, Power Automate, Power Apps, Power BI, Dataverse, and connected line-of-business systems. The right platform depends on the process, data sensitivity, and the people who will maintain it.'
  },
  {
    question: 'How do you keep automation maintainable?',
    answer: 'We document ownership, use clear naming and environments, test critical paths, and make failures visible to the right people. Automation is designed as a small service with a lifecycle, not a collection of hidden scripts.'
  },
  {
    question: 'Can you improve an existing workflow?',
    answer: 'Yes. We start by mapping the current process, identifying manual handoffs and risky data movement, and choosing the smallest useful improvement. That often creates a better foundation for later automation.'
  },
  {
    question: 'What happens when a workflow touches sensitive data?',
    answer: 'We define data boundaries, access roles, retention needs, and review points before implementation. Sensitive workflows need an intentional control model and an accountable business owner.'
  }
];

const aiFaqs: FaqItem[] = [
  {
    question: 'How do you decide whether a use case is ready for AI?',
    answer: 'We look for a bounded task, credible data, a clear user, a meaningful evaluation method, and a safe way to handle uncertainty. A promising idea becomes a pilot only when those conditions are visible.'
  },
  {
    question: 'Do you build with hosted model providers?',
    answer: 'We can work with an approved provider or an internally hosted model. Selection depends on data boundaries, latency, cost, operational ownership, and the controls your organization can sustain.'
  },
  {
    question: 'How do you handle inaccurate outputs?',
    answer: 'The workflow includes source grounding, evaluation cases, confidence-aware review, and an escalation path. Human judgment remains explicit when a wrong answer could create material harm.'
  },
  {
    question: 'What is governed enterprise AI?',
    answer: 'It is the practice of connecting an AI use case to clear decision rights, data handling, evaluation, monitoring, and change control. Governance is part of the product design rather than a final approval step.'
  }
];

const webFaqs: FaqItem[] = [
  {
    question: 'What technologies can you use for a web product?',
    answer: 'We build with the stack that fits the product and the team. That can include a TypeScript React interface, a Node.js API, and a MongoDB data layer, with deployment choices explained before implementation.'
  },
  {
    question: 'Do you build accessible interfaces?',
    answer: 'Yes. Semantic structure, keyboard behavior, visible focus, sensible contrast, and responsive layouts are part of the definition of done. We also check the flows that matter most to users.'
  },
  {
    question: 'Can you work with an existing product team?',
    answer: 'Yes. We can join a product squad, lead a greenfield slice, or fill a specific platform gap. The working agreement should make decision rights, review expectations, and release ownership clear.'
  },
  {
    question: 'How do you handle launch readiness?',
    answer: 'We review configuration, observability, content, accessibility, security boundaries, and rollback steps. A launch plan should make the first day after release as prepared as the release itself.'
  }
];

export const entryOffers: EngagementOffer[] = [
  {
    title: 'Security Posture Assessment',
    duration: '2–3 weeks · fixed scope',
    description: 'A clear, leadership-ready view of where the organization stands and what to fix first.',
    includes: ['Asset and control review', 'Risk-ranked findings', '90-day remediation roadmap']
  },
  {
    title: 'Fractional CISO (vCISO)',
    duration: 'Monthly retainer',
    description: 'Senior security leadership for teams that need direction, governance, and an accountable owner.',
    includes: ['Security strategy and reporting', 'Risk register and control ownership', 'Vendor and audit support']
  },
  {
    title: 'Customer Security Questionnaire Support',
    duration: '5–10 business days',
    description: 'Evidence-backed answers for enterprise buyers, without overstating your controls.',
    includes: ['Questionnaire review', 'Evidence mapping', 'Gap list and response guidance']
  }
];

const serviceDefinitions: Service[] = [
  {
    slug: 'managed-it',
    number: '01',
    title: 'Managed IT',
    shortTitle: 'Managed IT',
    eyebrow: 'Keep the everyday dependable',
    description: 'A practical support layer for teams that need reliable technology without carrying every operational detail in-house.',
    h1: 'Managed IT that keeps the work moving.',
    overview: [
      'Technology should be a calm part of the workday, not a recurring interruption. Stellan Solutions helps teams build a dependable support rhythm across devices, identities, service requests, and the vendors who touch the environment.',
      'We work remotely with distributed teams and shape coverage around the way the business actually operates. The result is a documented support model, clearer ownership, and fewer surprises when something needs attention.'
    ],
    capabilities: [
      { title: 'Service desk design', description: 'Create intake, triage, escalation, and resolution paths that feel consistent to every requester.' },
      { title: 'Endpoint operations', description: 'Coordinate provisioning, configuration, updates, and recovery for the devices people rely on.' },
      { title: 'Identity and access', description: 'Make joiner, mover, and leaver workflows consistent, reviewable, and easy to audit.' },
      { title: 'Patch coordination', description: 'Schedule maintenance with risk-based priorities and a clear record of what changed.' },
      { title: 'Monitoring and alerts', description: 'Turn operational signals into useful notifications with ownership and next actions attached.' },
      { title: 'Knowledge systems', description: 'Capture repeatable answers and runbooks so support improves with each resolved request.' },
      { title: 'Vendor coordination', description: 'Keep third-party handoffs visible so ownership does not disappear between systems.' }
    ],
    outcomes: [
      'A support experience people know how to use and trust.',
      'A clear view of recurring issues, ownership, and next actions.',
      'More consistent onboarding and offboarding for the people who use technology.',
      'A support model that can evolve as the organization changes.'
    ],
    process: [
      { title: 'Map the current state', description: 'Inventory requests, systems, identities, and the moments where work slows down.' },
      { title: 'Set service boundaries', description: 'Agree on coverage, priorities, response expectations, and escalation responsibilities.' },
      { title: 'Stabilize the basics', description: 'Resolve urgent friction and create the operating habits that make support repeatable.' },
      { title: 'Improve continuously', description: 'Use resolved requests, incidents, and feedback to refine the service over time.' }
    ],
    faqs: supportFaqs,
    related: ['it-consulting', 'network-infrastructure', 'cybersecurity'],
    tags: ['Service desk', 'Endpoint care', 'Identity operations', 'Documentation'],
    icon: 'support'
  },
  {
    slug: 'cloud-services',
    number: '02',
    title: 'Cloud services',
    shortTitle: 'Cloud services',
    eyebrow: 'Make the platform earn its keep',
    description: 'Architecture, migration, and optimization work for teams that need a cloud foundation they can change with confidence.',
    h1: 'Cloud foundations that stay clear as you grow.',
    overview: [
      'Cloud decisions become expensive when architecture, cost, and operations live in different conversations. We bring those views together before a migration accelerates or a new platform is chosen.',
      'Our work covers the practical middle: understanding workloads, creating a secure landing pattern, sequencing movement, and building the review habits that keep a cloud environment understandable.'
    ],
    capabilities: [
      { title: 'Cloud architecture', description: 'Shape a target design around workload needs, data boundaries, reliability, and team capacity.' },
      { title: 'Migration planning', description: 'Map dependencies, choose migration waves, and define cutover and rollback criteria.' },
      { title: 'Landing zone design', description: 'Create identity, network, logging, and guardrail patterns that support change.' },
      { title: 'Cost optimization', description: 'Find waste, rightsizing opportunities, and architectural choices with a clear economic mechanism.' },
      { title: 'Resilience planning', description: 'Model failure paths and make recovery responsibilities concrete for critical workloads.' },
      { title: 'Platform operations', description: 'Document the routines that keep environments observable, secure, and easier to change.' },
      { title: 'Developer enablement', description: 'Give teams paved paths and practical guidance for building on the selected platform.' }
    ],
    outcomes: [
      'A cloud plan tied to real workloads and operating constraints.',
      'Migration decisions that can be explained, rehearsed, and revised.',
      'Better visibility into spend drivers and optimization opportunities.',
      'A platform foundation that supports responsible self-service.'
    ],
    process: [
      { title: 'Discover the landscape', description: 'Inventory workloads, dependencies, data, spend patterns, and the people who operate them.' },
      { title: 'Draw the target state', description: 'Define the smallest architecture that meets the current and near-term needs.' },
      { title: 'Prove the path', description: 'Migrate a representative slice, measure the result, and refine the runbook.' },
      { title: 'Scale the practice', description: 'Expand in waves while keeping governance, ownership, and review routines intact.' }
    ],
    faqs: cloudFaqs,
    related: ['it-consulting', 'cybersecurity', 'enterprise-automation'],
    tags: ['Architecture', 'Migration', 'FinOps', 'Platform operations'],
    icon: 'cloud'
  },
  {
    slug: 'cybersecurity',
    number: '01',
    title: 'Cybersecurity',
    shortTitle: 'Cybersecurity',
    eyebrow: 'Proactive defense, measurable risk reduction',
    description: 'Cybersecurity and risk advisory for mid-sized organizations: assessments, prioritized roadmaps, compliance readiness, and fractional CISO support.',
    h1: 'Cybersecurity and risk advisory that makes the next decision clearer.',
    overview: [
      'We help organizations strengthen their security posture with practical controls, continuous visibility, and response-ready operating habits. From identity protection to threat detection and compliance, the work is designed to reduce risk, improve resilience, and protect critical business operations.',
      'Every engagement starts with the decisions leadership needs to make. We assess what is exposed, validate what matters, and turn broad risk language into a sequenced plan with owners, evidence, and a review date.'
    ],
    capabilities: [
      { title: 'Vulnerability assessment and penetration testing', description: 'Identify exploitable weaknesses through controlled testing and strengthen defenses before attackers can cause damage. Findings are validated and prioritized with actionable remediation guidance.' },
      { title: 'Security architecture and zero trust', description: 'Adopt a never-trust, always-verify model across users, devices, applications, and network access. Strengthen protection with granular identity-based controls and clear trust boundaries.' },
      { title: 'Identity and access security', description: 'Control user identities, privileged access, and authentication policies across systems and applications. Reduce unauthorized access risk while supporting secure productivity.' },
      { title: 'Compliance and audit readiness', description: 'Assess controls against ISO 27001, NIST CSF, SOC 2, CIS Controls, HIPAA, and CMMC. Improve governance, documentation, and regulatory readiness with evidence that can survive scrutiny.' },
      { title: 'Detection, monitoring, and response', description: 'Centralize log collection, correlation, and alerting for better threat visibility. Design alert routes, response playbooks, and review cadences so signals lead to useful action.' },
      { title: 'Incident response and recovery', description: 'Respond to cyber incidents with containment, investigation, recovery, and evidence-based analysis. Minimize downtime and restore operations with a structured, rehearsed plan.' },
      { title: 'Cloud and application security', description: 'Assess cloud environments for misconfigurations, policy drift, and compliance issues. Protect web applications and APIs from common threats and malicious traffic.' },
      { title: 'Security program leadership (vCISO)', description: 'Provide senior security direction, governance, risk reporting, and accountable ownership for teams that need leadership before a full-time CISO hire.' }
    ],
    outcomes: [
      'A prioritized view of security work and the reasoning behind it.',
      'Fewer unknowns around assets, access, and response ownership.',
      'A roadmap that connects technical remediation to business and compliance context.',
      'Security practices that can be explained to technical and non-technical teams.'
    ],
    process: [
      { title: 'Frame the exposure', description: 'Clarify assets, trust boundaries, obligations, and the questions leaders need answered.' },
      { title: 'Assess and validate', description: 'Combine tool evidence with human review to understand what is present and what matters.' },
      { title: 'Prioritize the path', description: 'Sequence remediation by risk, effort, dependency, and the controls that reduce many issues at once.' },
      { title: 'Build the habit', description: 'Add review points, exercises, ownership, and evidence collection to the operating rhythm.' }
    ],
    faqs: securityFaqs,
    related: ['it-consulting', 'cloud-services', 'managed-it'],
    tags: ['Assessment', 'Zero trust', 'Compliance', 'Incident response'],
    icon: 'shield',
    frameworks: ['NIST CSF', 'ISO 27001', 'SOC 2', 'CIS Controls', 'HIPAA', 'CMMC'],
    engagements: entryOffers,
    catalog: [
      { title: 'Vulnerability Assessment and Penetration Testing (VAPT)', description: 'Identify exploitable vulnerabilities through controlled testing and strengthen defenses before attackers can cause damage. Improve security posture with actionable findings and prioritized remediation guidance.' },
      { title: 'Network Security Design and Hardening', description: 'Build resilient network environments with secure configurations, segmentation, and hardened access controls. Reduce attack surfaces while improving reliability and policy enforcement.' },
      { title: 'Endpoint Detection and Response (EDR)', description: 'Detect suspicious activity on endpoints in real time and respond quickly to contain threats. Protect devices, users, and business data across modern work environments.' },
      { title: 'Security Information and Event Management (SIEM)', description: 'Centralize log collection, correlation, and alerting for better threat visibility across your infrastructure. Accelerate detection and response with security monitoring that scales.' },
      { title: 'Managed Security Services (MSS / SOC-as-a-Service)', description: 'Outsource continuous monitoring and incident handling to experienced security professionals and SOC workflows. Maintain stronger protection without expanding internal overhead.' },
      { title: 'Identity and Access Management (IAM / PAM)', description: 'Control user identities, privileged access, and authentication policies across systems and applications. Reduce unauthorized access risks while supporting secure productivity.' },
      { title: 'Zero Trust Security Architecture', description: 'Adopt a never-trust, always-verify model to secure users, devices, applications, and network access. Strengthen protection with granular identity-based controls.' },
      { title: 'Security Audits and Regulatory Compliance', description: 'Assess your controls against ISO 27001, NIST, and related frameworks, then prepare for audits with confidence. Improve governance, documentation, and regulatory readiness.' },
      { title: 'Incident Response, Forensics and Recovery', description: 'Respond rapidly to cyber incidents with containment, investigation, recovery, and evidence-based analysis. Minimize downtime and restore operations with a structured plan.' },
      { title: 'Web Application Firewall (WAF) and App Security', description: 'Protect web applications from common threats such as SQL injection, bots, and malicious traffic. Improve application resilience and secure digital customer experiences.' },
      { title: 'Email Security and Anti-Phishing', description: 'Defend inboxes against phishing, spoofing, malware, and business email compromise. Enhance communication security with layered protection controls.' },
      { title: 'Cloud Security Posture Management (CSPM)', description: 'Continuously assess cloud environments for misconfigurations, policy drift, and compliance issues. Secure multi-cloud workloads with better visibility and governance.' },
      { title: 'Data Loss Prevention (DLP)', description: 'Prevent sensitive data from leaving approved channels through monitoring, classification, and policy enforcement. Protect intellectual property and regulated information at scale.' },
      { title: 'Threat Intelligence and Dark Web Monitoring', description: 'Track emerging threats, leaked credentials, and dark web indicators relevant to your business. Enable proactive defense with contextual threat intelligence.' },
      { title: 'Red Team / Blue Team Exercises', description: 'Test defensive readiness through realistic attack simulations and coordinated response exercises. Improve detection capabilities, teamwork, and resilience under pressure.' },
      { title: 'Security Awareness and Phishing Simulations', description: 'Train employees to recognize cyber risks and reduce human-error-driven incidents. Build a stronger security culture with practical simulations and awareness programs.' },
      { title: 'Ransomware Protection and Backup Strategy', description: 'Reduce ransomware impact with layered defenses, secure backups, and recovery-focused planning. Protect business continuity with stronger resilience strategies.' },
      { title: 'Firewall Management and Policy Review', description: 'Optimize firewall rules, access policies, and change controls for stronger network defense. Maintain secure traffic flow without unnecessary complexity.' },
      { title: 'Multi-Factor Authentication (MFA) Implementation', description: 'Implement strong multi-factor authentication to secure user access across critical systems and applications. Lower account compromise risk with modern identity protection.' },
      { title: 'Compliance Reporting and Risk Management', description: 'Translate security data into clear compliance reports and risk insights for leadership and auditors. Support informed decisions with measurable governance reporting.' }
    ]
  },
  {
    slug: 'network-infrastructure',
    number: '04',
    title: 'Network infrastructure',
    shortTitle: 'Network infrastructure',
    eyebrow: 'Build a dependable path',
    description: 'Network planning, refresh, and documentation for distributed teams that need connectivity to remain understandable and resilient.',
    h1: 'Network infrastructure designed for the way work moves.',
    overview: [
      'A network should make the right path easy and the wrong path visible. We help teams document what exists, design the next state, and sequence changes so users experience a transition rather than a series of surprises.',
      'From office wireless to distributed connectivity, our approach combines technical design with the operational documentation needed to keep the environment healthy after handoff.'
    ],
    capabilities: [
      { title: 'Network discovery', description: 'Document topology, addressing, circuits, dependencies, and the constraints around change.' },
      { title: 'Wireless design', description: 'Plan coverage, capacity, roaming, identity, and device behavior for real spaces.' },
      { title: 'LAN and WAN refresh', description: 'Sequence hardware, software, and configuration changes around a tested rollback path.' },
      { title: 'Remote and hybrid access', description: 'Connect distributed locations and teams without losing visibility into the path.' },
      { title: 'Performance observability', description: 'Measure latency, loss, utilization, and user-impacting patterns where decisions happen.' },
      { title: 'Resilience planning', description: 'Identify single points of failure and agree on recovery priorities and responsibilities.' },
      { title: 'Network documentation', description: 'Leave behind diagrams, records, and change notes that support the next team.' }
    ],
    outcomes: [
      'A network plan that reflects current use and expected growth.',
      'More predictable change windows and recovery paths.',
      'Clear records for troubleshooting and future expansion.',
      'Connectivity experiences that are easier for teams to support.'
    ],
    process: [
      { title: 'See the whole path', description: 'Map the environment, users, dependencies, and performance signals before selecting a change.' },
      { title: 'Design for the edge cases', description: 'Test the plan against failure, growth, remote work, and the realities of everyday operations.' },
      { title: 'Change in slices', description: 'Pilot with a representative site or user group and measure the result before scaling.' },
      { title: 'Hand over the system', description: 'Document the design, decisions, monitoring, and the first support questions to answer.' }
    ],
    faqs: networkFaqs,
    related: ['managed-it', 'cloud-services', 'cybersecurity'],
    tags: ['Network design', 'Wireless', 'Hybrid access', 'Observability'],
    icon: 'network'
  },
  {
    slug: 'it-consulting',
    number: '05',
    title: 'IT consulting',
    shortTitle: 'IT consulting',
    eyebrow: 'Choose with context',
    description: 'Strategy and architecture guidance for leaders who need a useful sequence of technology decisions, not a shelf of predictions.',
    h1: 'Technology strategy that turns uncertainty into a sequence.',
    overview: [
      'The right technology choice depends on the work, the risk, the people available, and the cost of being wrong. We help leadership and technical teams make those connections explicit before a decision becomes expensive.',
      'Our consulting engagements are built around decisions: what should change first, what should stay flexible, and what evidence will tell us when the next decision is due.'
    ],
    capabilities: [
      { title: 'Technology discovery', description: 'Build a factual view of systems, workflows, constraints, and the decisions still open.' },
      { title: 'Roadmap design', description: 'Sequence capabilities and investments around value, risk, dependencies, and readiness.' },
      { title: 'Target architecture', description: 'Define a future direction that is specific enough to guide work and flexible enough to evolve.' },
      { title: 'Operating model', description: 'Clarify ownership, decision rights, service boundaries, and the skills needed to sustain change.' },
      { title: 'Vendor evaluation', description: 'Turn requirements and scenarios into fair, evidence-based comparisons.' },
      { title: 'Change planning', description: 'Create the communication, training, and migration steps that help adoption become real.' },
      { title: 'Decision reviews', description: 'Revisit assumptions and investment choices as evidence changes.' }
    ],
    outcomes: [
      'A shared view of the decisions that matter now and later.',
      'A sequenced roadmap with explicit assumptions and dependencies.',
      'Clearer ownership across technology, security, and business teams.',
      'A decision record that remains useful after the engagement ends.'
    ],
    process: [
      { title: 'Listen for the real question', description: 'Separate the stated request from the operating or business constraint underneath it.' },
      { title: 'Make the system visible', description: 'Map dependencies, risk, cost, and the capabilities that create or limit progress.' },
      { title: 'Test the options', description: 'Compare approaches against scenarios, constraints, and the team that will own them.' },
      { title: 'Commit to a sequence', description: 'Turn the decision into a funded roadmap with owners, evidence, and review dates.' }
    ],
    faqs: consultingFaqs,
    related: ['cloud-services', 'enterprise-automation', 'ai-engineering'],
    tags: ['Roadmaps', 'Architecture', 'Operating model', 'Decision support'],
    icon: 'compass'
  },
  {
    slug: 'enterprise-automation',
    number: '06',
    title: 'Enterprise automation',
    shortTitle: 'Enterprise automation',
    eyebrow: 'Remove the busywork',
    description: 'Microsoft 365 and Power Platform work that makes recurring processes easier to run, review, and change.',
    h1: 'Automation that gives people time back.',
    overview: [
      'Manual work often survives because a process is more complicated than the tool used to describe it. We work with the people closest to the workflow to find the handoffs, decisions, and data movements that should be redesigned.',
      'Our Microsoft 365 and Power Platform work balances quick wins with the guardrails, ownership, and change management needed for a process people can trust over time.'
    ],
    capabilities: [
      { title: 'Process discovery', description: 'Map the current path, identify repetitive work, and clarify where judgment must remain human.' },
      { title: 'Microsoft 365 design', description: 'Shape permissions, information architecture, collaboration, and service patterns around the work.' },
      { title: 'Power Platform delivery', description: 'Build flows, apps, and connectors that solve a defined process problem.' },
      { title: 'Integration design', description: 'Connect approved systems while keeping data movement and failure handling visible.' },
      { title: 'Governance and security', description: 'Set environments, roles, review boundaries, and change controls before scale increases.' },
      { title: 'Adoption enablement', description: 'Create role-based guidance, feedback loops, and practical support for everyday users.' },
      { title: 'Process improvement', description: 'Measure friction after launch and refine the workflow rather than automating a bad process.' }
    ],
    outcomes: [
      'Fewer repetitive handoffs and less re-keying between systems.',
      'More consistent permissions and process ownership.',
      'Automation that can be explained, tested, and maintained by the team.',
      'A clearer path from individual workarounds to supported services.'
    ],
    process: [
      { title: 'Follow the work', description: 'Observe the process as it happens, including exceptions and the workarounds people rely on.' },
      { title: 'Choose the right boundary', description: 'Decide what should be automated, what should be integrated, and what needs a person.' },
      { title: 'Build a safe slice', description: 'Deliver a narrow workflow with visible controls, test cases, and a clear owner.' },
      { title: 'Measure and expand', description: 'Use real feedback to improve the pilot before adding the next process or platform.' }
    ],
    faqs: automationFaqs,
    related: ['it-consulting', 'ai-engineering', 'web-development'],
    tags: ['Microsoft 365', 'Power Platform', 'Workflow design', 'Governance'],
    icon: 'workflow'
  },
  {
    slug: 'ai-engineering',
    number: '07',
    title: 'AI engineering',
    shortTitle: 'AI engineering',
    eyebrow: 'Move from demo to dependable use',
    description: 'Governed enterprise AI systems with clear data boundaries, evaluation, human review, and an operating plan after launch.',
    h1: 'Enterprise AI with a path beyond the prototype.',
    overview: [
      'A useful AI system is more than a clever interface. It needs a bounded job, dependable context, a way to evaluate quality, and a clear response when the answer is uncertain.',
      'We help teams move from an opportunity to a governed pilot and then to a repeatable service. The work keeps human decision-making visible and treats data, evaluation, and change control as product requirements.'
    ],
    capabilities: [
      { title: 'Use-case framing', description: 'Define the user, task, decision, risk boundaries, and evidence needed before selecting a model.' },
      { title: 'Data readiness', description: 'Assess source quality, permissions, freshness, and the retrieval path a use case needs.' },
      { title: 'Retrieval and grounding', description: 'Build source-aware responses with citations, limits, and a clear way to handle missing context.' },
      { title: 'Evaluation design', description: 'Create representative test cases, review rubrics, and regression checks before users depend on the system.' },
      { title: 'Guardrails and review', description: 'Place appropriate controls around sensitive actions, high-impact decisions, and uncertain output.' },
      { title: 'Model and platform choice', description: 'Compare hosted, private, and hybrid approaches against data, cost, latency, and ownership needs.' },
      { title: 'Operations and change', description: 'Plan monitoring, feedback, incident response, and model or prompt changes after launch.' }
    ],
    outcomes: [
      'A bounded pilot tied to a real user and decision.',
      'Evidence about quality, failure modes, and operating cost.',
      'Clear human review and escalation paths.',
      'A governance model that can evolve with the use case.'
    ],
    process: [
      { title: 'Frame the decision', description: 'Name the user, task, acceptable uncertainty, and the consequences of a wrong answer.' },
      { title: 'Prepare the context', description: 'Check data access, quality, retrieval, and the boundaries around sensitive information.' },
      { title: 'Pilot with evidence', description: 'Build the smallest useful workflow and test it against realistic cases and failure conditions.' },
      { title: 'Operate and improve', description: 'Set ownership, review cadence, change control, and a path to expand only when the evidence supports it.' }
    ],
    faqs: aiFaqs,
    related: ['it-consulting', 'enterprise-automation', 'web-development'],
    tags: ['AI strategy', 'Retrieval', 'Evaluation', 'Governance'],
    icon: 'spark'
  },
  {
    slug: 'web-development',
    number: '08',
    title: 'Web development',
    shortTitle: 'Web development',
    eyebrow: 'Build the thing people need',
    description: 'Secure, accessible web products and integrations built around a clear user need, a maintainable stack, and a responsible launch.',
    h1: 'Web products built for the next version of the work.',
    overview: [
      'A web product has to work for the person using it, the team changing it, and the systems around it. We start with the job to be done, then shape the interface, data model, APIs, and delivery plan around that job.',
      'Our secure MERN and modern web development work favors understandable foundations, accessible interaction, and testable release steps over novelty for its own sake.'
    ],
    capabilities: [
      { title: 'Product discovery', description: 'Clarify users, jobs, constraints, data needs, and the smallest valuable release.' },
      { title: 'Interface engineering', description: 'Build responsive React interfaces with semantic structure, keyboard support, and resilient states.' },
      { title: 'API and data design', description: 'Design clear contracts, validation, persistence, and boundaries for a maintainable MERN application.' },
      { title: 'Secure implementation', description: 'Apply authentication, authorization, input validation, dependency, and secret-handling practices from the start.' },
      { title: 'Quality systems', description: 'Use focused automated checks and manual review to protect important user journeys.' },
      { title: 'Launch readiness', description: 'Coordinate configuration, observability, content, accessibility, and rollback steps.' },
      { title: 'Iteration support', description: 'Improve the product through feedback, measured changes, and a clear definition of done.' }
    ],
    outcomes: [
      'A product slice that solves a defined user need.',
      'An interface and API that are easier to understand and change.',
      'Security and accessibility practices built into the delivery path.',
      'A launch plan that makes ownership clear after release.'
    ],
    process: [
      { title: 'Define the smallest useful release', description: 'Align the user problem, scope, data, constraints, and success signals before implementation.' },
      { title: 'Shape the experience', description: 'Prototype the important flows, validate accessibility, and make the technical boundaries explicit.' },
      { title: 'Build and test the slice', description: 'Implement the core path with review, error handling, and security checks in the loop.' },
      { title: 'Launch and learn', description: 'Ship with observability and rollback, then use real feedback to guide the next slice.' }
    ],
    faqs: webFaqs,
    related: ['ai-engineering', 'cloud-services', 'enterprise-automation'],
    tags: ['React', 'TypeScript', 'MERN', 'Accessibility'],
    icon: 'code'
  }
];

export const services: Service[] = serviceSlugs.map((slug, index) => {
  const service = serviceDefinitions.find((item) => item.slug === slug);
  if (!service) {
    throw new Error(`Missing service definition for ${slug}`);
  }
  return { ...service, number: String(index + 1).padStart(2, '0') };
});

export const getService = (slug: string): Service | undefined => services.find((service) => service.slug === slug);

export const coreServiceSlugs: readonly ServiceSlug[] = ['cybersecurity', 'it-consulting', 'cloud-services'];

export const supportingServiceSlugs: readonly ServiceSlug[] = [
  'managed-it',
  'network-infrastructure',
  'enterprise-automation',
  'ai-engineering',
  'web-development'
];

export const founder: FounderProfile = {
  name: 'Umair Mazhar',
  initials: 'UM',
  role: 'Founder & Principal Consultant',
  location: 'Ashburn, Virginia',
  summary: 'Cybersecurity and risk leader with more than twenty years of experience helping organizations turn security obligations into prioritized, workable programs.',
  bio: [
    'Umair leads Stellan Solutions with a simple premise: security advice should help a leadership team make a decision, not bury it in another framework. His work spans security assessments, risk reporting, cloud security architecture, and the operating routines that keep a program honest after the assessment ends.',
    'He has spent more than two decades in security and technology roles across regulated and distributed environments. That experience is backed by CISM, CRISC, CCSK, ISO 27001 Lead Implementer, and AWS Solutions Architect certifications, so the guidance connects board-level risk with the technical detail underneath it.',
    'Stellan is based in Ashburn, Virginia and works with mid-sized organizations that need senior security judgment without building a full internal security department on day one.'
  ],
  certifications: [
    'CISM',
    'CRISC',
    'CCSK',
    'ISO 27001 Lead Implementer',
    'AWS Solutions Architect'
  ],
  linkedin: 'https://www.linkedin.com/'
};

export const frameworks = [
  { name: 'NIST CSF', detail: 'Program structure and maturity' },
  { name: 'ISO 27001', detail: 'ISMS implementation and readiness' },
  { name: 'SOC 2', detail: 'Trust Services Criteria evidence' },
  { name: 'CIS Controls', detail: 'Prioritized technical safeguards' },
  { name: 'HIPAA', detail: 'Healthcare security and privacy controls' },
  { name: 'CMMC', detail: 'Defense supplier readiness' }
] as const;

export const partners: Partner[] = [
  { name: 'Microsoft', category: 'Cloud & Productivity', logo: '/partners/microsoft.svg' },
  { name: 'Amazon Web Services', category: 'Cloud Infrastructure', logo: '/partners/aws.svg' },
  { name: 'Cisco', category: 'Networking', logo: '/partners/cisco.svg' },
  { name: 'Splunk', category: 'Security Operations', logo: '/partners/splunk.svg' },
  { name: 'CrowdStrike', category: 'Endpoint Security', logo: '/partners/crowdstrike.svg' },
  { name: 'Qualys', category: 'Vulnerability Management', logo: '/partners/qualys.svg' },
  { name: 'Fortinet', category: 'Network Security', logo: '/partners/fortinet.svg' },
  { name: 'Palo Alto Networks', category: 'Security Platform', logo: '/partners/paloaltonetworks.svg' }
];

export const testimonials: Testimonial[] = [
  {
    quote: 'Stellan helped us turn a massive vulnerability backlog into a concrete, executable plan. For the first time, our leadership team knew exactly what to fix first and why.',
    role: 'IT Director',
    sector: 'Regional Utility',
    initials: 'JD'
  },
  {
    quote: 'Their approach to compliance readiness was practical and business-focused. We went from dreading security questionnaires to confidently responding with evidence in days, not weeks.',
    role: 'VP of Operations',
    sector: 'Healthcare Services',
    initials: 'SM'
  },
  {
    quote: 'Working with Umair gave us clarity on our CMMC obligations. The roadmap was realistic, prioritized correctly, and saved us from over-engineering our approach.',
    role: 'Chief Information Officer',
    sector: 'Defense Supplier',
    initials: 'RK'
  }
];

export const caseStudies: CaseStudy[] = [
  {
    sector: 'Regional Utility',
    challenge: 'A long vulnerability backlog with no shared view of which findings created real operational exposure across critical infrastructure.',
    work: 'Combined scanner evidence with business context, asset criticality, and compensating controls. Conducted stakeholder interviews to validate exploitability.',
    result: 'Prioritized 400 findings into a 90-day remediation roadmap with named owners, review dates, and measurable acceptance criteria.',
    metric: '400',
    metricLabel: 'Findings Prioritized',
    duration: '6 weeks',
    tags: ['Vulnerability Management', 'Risk Prioritization', 'Critical Infrastructure']
  },
  {
    sector: 'Healthcare Services Group',
    challenge: 'Customer security reviews were slowing down sales cycles and producing inconsistent evidence across HIPAA and SOC 2 requirements.',
    work: 'Mapped regulatory expectations to existing controls, identified evidence gaps, and built a reusable control matrix with automated tracking.',
    result: 'Reduced questionnaire turnaround time by 75% and established a scalable evidence library used across all enterprise deals.',
    metric: '75%',
    metricLabel: 'Faster Turnaround',
    duration: '4 weeks',
    tags: ['HIPAA', 'SOC 2', 'Compliance Readiness']
  },
  {
    sector: 'Defense Supplier',
    challenge: 'CMMC 2.0 obligations were approaching, but the organization lacked clarity on scope, gaps, and realistic timeline for compliance.',
    work: 'Performed detailed gap assessment against applicable CMMC practices, evaluated system boundaries, and created a risk-based remediation strategy.',
    result: 'Delivered a phased 12-month readiness plan with prioritized controls, estimated costs, and clear milestones for certification success.',
    metric: '100%',
    metricLabel: 'Clear Roadmap',
    duration: '5 weeks',
    tags: ['CMMC 2.0', 'Defense Industrial Base', 'Readiness Assessment']
  }
];

