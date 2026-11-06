# Pathwise AI — Video Demo Storyboard Brief

**Prepared from source code only. All UI text, colors, and data are quoted verbatim from the codebase.**
**Last updated from commit on branch `feature/task-005-healthcare-pathways`.**

---

## 1. Overview

Pathwise AI is a free, anonymous, mobile-and-web app that gives learners a personalized
healthcare career pathway — a numbered, step-by-step roadmap from where they are today to a
verified Louisiana credential — based on three quick questions about their background, goal, and
budget. No account is created, no personal data is stored or transmitted.

**Who it's for:** High school students, college/university students, and adult learners in
Louisiana who want to break into nursing or allied health but don't know where to start.

**Core promise (exact text from the app):**
> "Find affordable learning and career opportunities."

**Post-onboarding confirmation text (exact):**
> "Pathwise AI will now show personalized healthcare career pathways and opportunity
> recommendations based on your selections. You can browse the full catalog at any time."

---

## 2. User Flows

### Scenario 1 — High school student who wants to become a nurse

**Profile:** 11th-grader, wants to explore nursing, free or low-cost options.

| Step | Screen name | Route | Action |
|------|-------------|-------|--------|
| 1 | Welcome | `/` | Sees three learner-type cards. Taps **🏫 High school** card (purple border appears on selection). Taps **"Get started"** button. |
| 2 | Onboarding Step 1 | `/onboarding/high-school` | Heading: **"Tell us about yourself"**. Chooses **"11th grade"** from the grade picker (options: 9th–12th). Taps **"Next"**. |
| 3 | Onboarding Step 2 | `/onboarding/high-school` | Heading: **"What is your primary goal?"**. Chooses **"Explore career pathways"**. Taps **"Next"**. |
| 4 | Onboarding Step 3 | `/onboarding/high-school` | Heading: **"Your preferences"**. Career interest: **"Healthcare & Medicine"**. Budget: **"Free only"**. Taps **"Next"**. |
| 5 | Review | `/onboarding/high-school` | Heading: **"Review your answers"**. Sees four rows with Edit buttons: Grade / Primary goal / Career or field of interest / Budget preference. Taps **"Looks good — finish"**. |
| 6 | Completion (brief) | `/onboarding/high-school` | 🎉 emoji + **"You're all set!"** + "Your High school profile is ready. No account was created…". App auto-redirects to `/healthcare`. |
| 7 | Healthcare Pathways | `/healthcare` | Dark purple header: **"Healthcare Pathways"**. Subtitle: **"Personalized pathways for high school learners. Select a career to see your steps."** Six career cards. Taps **Registered Nurse** card. |
| 8 | RN Pathway Detail | `/healthcare/pathways/rn` | 9-step pathway rendered as a vertical timeline. See §4 for full step text. Three Louisiana program cards (Delgado ADN, BRCC ASN, LSUHSC BSN). Education routes, official LSBN source links. |

**Result:** A concrete 9-step roadmap from "build science foundation" through "apply for Louisiana RN license."

---

### Scenario 2 — College IT student switching careers into healthcare

**Profile:** Computer Science student, discouraged by job rejections, pivoting to healthcare.
Accelerated BSN is the natural recommendation (called out explicitly in Step 3 of the university RN pathway).

| Step | Screen name | Route | Action |
|------|-------------|-------|--------|
| 1 | Welcome | `/` | Taps **🎓 College/University** card. Taps **"Get started"**. |
| 2 | Onboarding Step 1 | `/onboarding/university` | Heading: **"Tell us about yourself"**. Field label: **"Academic program or area of study"**. Chooses **"Computer Science & IT"**. Taps **"Next"**. |
| 3 | Onboarding Step 2 | `/onboarding/university` | Heading: **"What is your primary goal?"**. Chooses **"Explore career pathways"**. Taps **"Next"**. |
| 4 | Onboarding Step 3 | `/onboarding/university` | Heading: **"Your preferences"**. Career interest: **"Healthcare & Medicine"**. Budget: **"Flexible / show all options"**. Institution name: optional, left blank. Taps **"Next"**. |
| 5 | Review | `/onboarding/university` | Five review rows: Area of study / Primary goal / Career or skill interest / Budget preference / Institution name ("—"). Taps **"Looks good — finish"**. |
| 6 | Completion (brief) | `/onboarding/university` | **"You're all set! Your College/University profile is ready."** Auto-redirects to `/healthcare`. |
| 7 | Healthcare Pathways | `/healthcare` | Subtitle: **"Personalized pathways for university/college student learners."** Taps **Registered Nurse** card. |
| 8 | RN Pathway Detail | `/healthcare/pathways/rn` | 9-step university-specific pathway. Step 3 explicitly calls out the **Accelerated BSN** option: *"If you are completing or already hold a bachelor's degree, an Accelerated BSN (ABSN) may be an option."* See §4 for full steps. |

**Key visual moment:** Step 3 of the university RN pathway calls out ABSN as a shortcut for someone who already has (or is completing) a bachelor's degree — directly relevant to this persona.

---

### Scenario 3 — Single mom seeking a quick healthcare certification

**Profile:** Adult learner, Louisiana, wants the fastest route to employment, budget-conscious.
CNA is the fastest credential in the app: ~8 weeks, ~$1,673.66 at Delgado (the only program with a confirmed cost figure).

| Step | Screen name | Route | Action |
|------|-------------|-------|--------|
| 1 | Welcome | `/` | Taps **💼 Adult learner** card. Taps **"Get started"**. |
| 2 | Onboarding Step 1 | `/onboarding/adult` | Heading: **"Tell us about yourself"**. Field label: **"Career or skill goal"**. Chooses **"Healthcare or medical field"**. Taps **"Next"**. |
| 3 | Onboarding Step 2 | `/onboarding/adult` | Heading: **"What is your primary goal?"**. Chooses **"Prepare for a professional certification"**. (Qualifier shows: *"Courses help you prepare and build skills; they do not guarantee eligibility, passing, or an official credential."*) Taps **"Next"**. |
| 4 | Onboarding Step 3 | `/onboarding/adult` | Heading: **"Your preferences"**. Budget: **"Up to $100"** (or Flexible). State/region section header: **"State or region (optional)"**, hint text: *"Some learning resources and training requirements vary by state. Sharing your general region may help surface more relevant options. This is never stored or transmitted."* Selects **"Louisiana"**. Taps **"Next"**. |
| 5 | Review | `/onboarding/adult` | Four rows: Career or skill goal / Primary goal / Budget preference / State or region (Louisiana). Taps **"Looks good — finish"**. |
| 6 | Completion (brief) | `/onboarding/adult` | **"You're all set! Your Adult learner profile is ready."** Auto-redirects to `/healthcare`. |
| 7 | Healthcare Pathways | `/healthcare` | Subtitle: **"Personalized pathways for adult learners."** Taps **Certified Nursing Assistant** card — credentialLabel: *"State nurse aide registry placement"*, credentialClass chip: *"Registry Certification"*. |
| 8 | CNA Pathway Detail | `/healthcare/pathways/cna` | 6-step pathway. One Louisiana program card: Delgado CNA, estimated cost $1,673.66, 8-week program, in-person New Orleans. See §4 for full steps. |

**Key visual moment:** One Louisiana program card surfaces with a real cost figure ($1,673.66) and 8-week duration — the kind of concrete, actionable detail that differentiates this app from generic career sites.

---

## 3. Screens

### Screen 1 — Welcome
**Route:** `/`
**File:** `apps/mobile/src/app/index.tsx`
**Purpose:** Learner-type selection; entry point for all flows.

**Layout:**
- **Hero band** (deep purple `#1E1458`): 🎓 emoji + **"Pathwise AI"** (white, bold) + mission text: **"Find affordable learning and career opportunities."** (soft purple `#C4B9F9`)
- **Section heading:** "Choose your path"
- **Three radio-style cards** (white, purple border on selection):

| Card | Icon | Label | Description |
|------|------|-------|-------------|
| 1 | 🏫 | **High school** | "Explore free and affordable resources to prepare for college and career." |
| 2 | 🎓 | **College/University** | "Find courses, certifications, and skill-building programs." |
| 3 | 💼 | **Adult learner** | "Discover flexible learning paths to build new skills at your own pace." |

- Each card has a circular check indicator (empty ring → filled purple ✓ when selected)
- **CTA button:** "Get started" (solid purple `#6C5CE7`, full-width, rounded)
- Desktop layout (≥768px): cards render in a horizontal row; mobile: vertical stack

---

### Screen 2 — Onboarding Wizard
**Route:** `/onboarding/[type]` (type = `high-school`, `university`, or `adult`)
**File:** `apps/mobile/src/app/onboarding/[type].tsx`
**Purpose:** 3-step wizard captures learner background and preferences. No data stored externally.

All steps share the same layout: step indicator (e.g. "Step 1 of 3"), heading, choice group or text field, Back + Next buttons.

**Step 1 — "Tell us about yourself"**

| Learner type | Field label | Options |
|---|---|---|
| High school | Current grade | 9th grade / 10th grade / 11th grade / 12th grade |
| University | Academic program or area of study | Computer Science & IT / Business & Management / Engineering / Health & Medicine / Arts & Humanities / Social Sciences / Education / Natural Sciences / Law & Political Science / Architecture & Design / Communications & Media / Undecided / Exploring |
| Adult | Career or skill goal | Technology or computing skills / Healthcare or medical field / Business operations or management / Creative work (design, writing, media) / Skilled trades or manufacturing / Education or teaching / Legal, compliance, or policy work / Environmental or scientific research / Leadership or management development / Something else (+ free-text field) |

**Step 2 — "What is your primary goal?"**

| Learner type | Options |
|---|---|
| High school | Prepare for college / Explore courses that may be eligible for college credit *(qualifier shown)* / Build career skills / Explore career pathways |
| University | Explore possible college-credit options *(qualifier)* / Prepare for a professional certification *(qualifier)* / Build job-relevant skills / Prepare for internships / Explore career pathways |
| Adult | Prepare for a professional certification *(qualifier)* / Complete job-related training / Build general skills / Change or advance a career pathway |

Qualifier text (shown inline below the option when selected or in view):
- For "Explore college-credit options": *"Eligibility and transfer of credit depend on the institution and should be confirmed with an advisor."*
- For "Prepare for a professional certification": *"Courses help you prepare and build skills; they do not guarantee eligibility, passing, or an official credential."*

**Step 3 — "Your preferences"**

| Learner type | Fields |
|---|---|
| High school | Career or field of interest (11 options) + Budget preference (4 options) |
| University | Career or skill interest (11 options) + Budget preference + Institution name (optional, free text, hint: *"Optional. Never stored or transmitted."*) |
| Adult | Budget preference + State or region (optional, full US state list incl. DC + "Prefer not to say" + "Outside the United States") |

Career interest options (all learner types):
Technology & Computing / Healthcare & Medicine / Business & Finance / Arts, Design & Media / Engineering & Architecture / Education & Social Services / Legal & Public Policy / Environment & Science / Trades & Manufacturing / Sports & Recreation / Not sure yet

Budget options:
Free only / Up to $25 / Up to $100 / Flexible / show all options

Adult state/region hint: *"Some learning resources and training requirements vary by state. Sharing your general region may help surface more relevant options. This is never stored or transmitted."*

**Review screen — "Review your answers"**
- Subheading: *"Check your selections before you finish. Use Edit to change any answer."*
- One row per field, each with an **Edit** button that steps back into the wizard
- Primary button: **"Looks good — finish"**
- Secondary link: **"← Back"**

**Completion screen (brief — auto-redirects)**
- Large 🎉 emoji in a lavender circle
- Heading: **"You're all set!"**
- Body: "Your [High school / College/University / Adult learner] profile is ready. No account was created and none of your answers have been stored or transmitted."
- Card: **"What comes next"** / "Pathwise AI will now show personalized healthcare career pathways and opportunity recommendations based on your selections. You can browse the full catalog at any time."
- Button: **"Return to pathway selection"** (but auto-redirect to `/healthcare` fires immediately via `router.replace`)

---

### Screen 3 — Healthcare Pathways (career selection)
**Route:** `/healthcare`
**File:** `apps/mobile/src/app/healthcare/index.tsx`
**Purpose:** Choose which healthcare career to explore. Personalization subtitle reflects learner type.

**Header (deep purple):**
- Large heading: **"Healthcare Pathways"**
- Subtitle: **"Personalized pathways for [high school / university/college student / adult] learners. Select a career to see your steps."**
- Two text links: **"Opportunity recommendations →"** / **"Browse full catalog →"**

**Six career cards** (scrollable list):

| Career | Category chip | Credential chip | Short description | Credential label |
|---|---|---|---|---|
| **Registered Nurse** | Nursing | Professional License | "Provide and coordinate patient care, educate patients and the public about health conditions, and offer emotional support." | "State RN license required" |
| **Licensed Practical Nurse** | Nursing | Professional License | "Provide basic nursing care under the supervision of registered nurses and physicians in a range of healthcare settings." | "State LPN license required" |
| **Certified Nursing Assistant** | Nursing | Registry Certification | "Provide direct patient care under the supervision of nursing staff, assisting with daily living activities in hospitals, nursing homes, and home care settings." | "State nurse aide registry placement" |
| **Medical Assistant** | Allied Health | National Certification | "Perform administrative and clinical tasks in outpatient settings including clinics, physician offices, and urgent care centers." | "National certification available (not universally required)" |
| **Phlebotomy Technician** | Allied Health | National Certification | "Draw blood samples from patients for laboratory testing, transfusions, donations, or research." | "National certification available (employer requirements vary)" |
| **Patient Care Technician** | Allied Health | Employer Preference | "Provide direct patient care in acute care settings, often combining CNA, EKG, and phlebotomy skills." | "National certification available; employer requirements vary" |

Each card: tap anywhere to navigate to pathway detail. Arrow **→** in lower right.

---

### Screen 4 — Pathway Detail
**Route:** `/healthcare/pathways/[careerId]` (careerId = `rn`, `lpn`, `cna`, `medical-assistant`, `phlebotomy`, `patient-care-technician`)
**File:** `apps/mobile/src/app/healthcare/pathways/[careerId].tsx`
**Purpose:** Full step-by-step roadmap, Louisiana programs, education routes, and official sources for the selected career. Content is personalized by learner category.

**Header (deep purple):**
- **← Back** button
- **"Browse catalog →"** link (top right)
- Career title (large, white)
- Category label below title

**Section: "Your Pathway Steps"**
Vertical timeline. Each step has:
- Numbered colored dot (color by milestone kind — see below)
- Vertical connector line between steps (same color, 25% opacity)
- Kind label (colored text, uppercase): **Prepare / Education / Clinical / Exam / License / Registry / Career**
- **"Verify with provider"** orange badge (when `requiresConfirmation: true`)
- Step title (bold)
- Step description paragraph

**Milestone kind colors:**
| Kind | Label | Color |
|---|---|---|
| preparation | Prepare | `#7B8FA6` (blue-grey) |
| education | Education | `#6C5CE7` (purple) |
| clinical | Clinical | `#00897B` (teal) |
| examination | Exam | `#E67E22` (orange) |
| licensure | License | `#27AE60` (green) |
| registry | Registry | `#27AE60` (green) |
| employment | Career | `#8E44AD` (deep purple) |

**Section: "Verify Before You Enroll"** (bulleted list of provider confirmation items, career-specific)

**Section: "Louisiana Programs"** (only for RN, LPN, CNA)
Header note: *"Verified programs in Louisiana. Confirm current requirements directly with each institution."*

Each program card shows:
- Institution name
- Verification status badge: `Verified [date]` or `Needs recheck — last reviewed [date]`
- Program title
- Duration / location note
- Key application requirements (bulleted)
- Warnings (if any)
- **"Official program page →"** (tappable link, opens external URL)

**Section: "Education Routes"**
Cards with label, description, typical duration, prerequisites, and notes.

**Section: "Official Sources"**
Tappable links to regulatory bodies (LSBN, LSBPNE, LDH, NCLEX, etc.) with organization name.

**Section: "Important Notes"** (yellow-tinted background)
Career-specific warning bullets.

**Disclaimer (footer):**
*"This pathway is a general guide based on publicly available information as of November 2026. It does not constitute professional career advice. Requirements, prerequisites, admission criteria, and licensing procedures are subject to change. Always verify current requirements directly with [regulator], your target programs, and relevant accrediting bodies before making enrollment or financial decisions."*

---

### Screen 5 — Your Recommendations
**Route:** `/recommendations`
**File:** `apps/mobile/src/app/recommendations/index.tsx`
**Purpose:** Shows personalized opportunity matches from the catalog based on onboarding answers.

**Header (deep purple):**
- **"Your Recommendations"** + result count
- Summary line (italic): e.g. *"Results for adult learner aiming to prepare for a professional certification"*
- **"Browse full catalog →"** link

**Body:** Opportunity cards (same card component as catalog)

**Empty state** (shown for all three demo scenarios, since catalog has no healthcare entries):
- Heading: **"No recommendations yet"**
- Body: *"No verified opportunities matched your selections. Only real, verified opportunities are shown — results are never invented to fill the list."*
- Button: **"Browse all opportunities"**

---

### Screen 6 — Learning Opportunities (catalog)
**Route:** `/opportunities`
**File:** `apps/mobile/src/app/opportunities/index.tsx`
**Purpose:** Full catalog with filter bar. Personalized if session exists.

**Header (deep purple):**
- **"Learning Opportunities"** + result count
- If personalized: `"Matches based on your selections"` (small text)
- If not personalized: **"Personalize results"** button
- If filters active: **"Clear filters"** button

**Filter bar** (scrollable chips): Learner categories / Topics / Categories / Credit classes / Budget / Delivery / Louisiana only

**Opportunity cards** in a scrollable list.

**Empty state:** *"No opportunities match your filters. Try adjusting your selections."*

---

### Screen 7 — Opportunity Detail
**Route:** `/opportunities/[id]`
**Purpose:** Full details for a single catalog item.

Sections: provider + title / category chip / credit recognition badge / description / details card (topic, price, duration, delivery) / eligibility card / classification card / verification card (status, last reviewed, evidence notes, source URLs) / **"Visit official page"** primary button + *"Opens externally — requires internet"*

---

## 4. Sample Outputs

### Scenario 1 output — RN pathway for a high school student
**Route:** `/healthcare/pathways/rn` (learner category: `high-school`)

| # | Kind | Kind label | Title | Verify badge |
|---|---|---|---|---|
| 1 | preparation | Prepare | **"Build your science and math foundation"** | — |
| 2 | preparation | Prepare | **"Earn your high school diploma or GED"** | — |
| 3 | preparation | Prepare | **"Research LSBN-approved nursing programs"** | ✓ Verify with provider |
| 4 | preparation | Prepare | **"Complete prerequisite coursework"** | ✓ Verify with provider |
| 5 | education | Education | **"Apply to an LSBN-approved nursing program"** | ✓ Verify with provider |
| 6 | clinical | Clinical | **"Complete nursing education and supervised clinical hours"** | — |
| 7 | examination | Exam | **"Apply for NCLEX-RN authorization through LSBN"** | ✓ Verify with provider |
| 8 | examination | Exam | **"Pass the NCLEX-RN exam"** | — |
| 9 | licensure | License | **"Apply for your Louisiana RN license"** | ✓ Verify with provider |

**Louisiana programs shown:**

| Program card | Key detail |
|---|---|
| **Delgado Community College** — Associate Degree in Nursing (ADN) | New Orleans, LA (Charity School of Nursing) · In-person · ACEN-accredited · Verified 2026-11-05 |
| **Baton Rouge Community College** — Associate of Science in Nursing (ASN) | 5 semesters; 72 credit hours · Min 2.8 GPA on prereqs · Min 65% TEAS · Verified 2026-11-05 |
| **LSU Health Sciences Center School of Nursing** — BSN | 3-year program · Min 3.0 GPA · Grade B- or better in science prereqs · CCNE-accredited · Verified 2026-11-05 |

**Education routes listed:** ADN (18–30 mo) / BSN (36–48 mo) / Accelerated BSN (12–20 mo, requires bachelor's) / LPN-to-RN Bridge (requires active LA LPN license)

**Official sources linked:** Louisiana State Board of Nursing (lsbn.state.la.us) / LSBN Approved Schools of Nursing / NCLEX Exam Information (nclex.com)

---

### Scenario 2 output — RN pathway for a university student
**Route:** `/healthcare/pathways/rn` (learner category: `university`)

| # | Kind | Title | Key detail |
|---|---|---|---|
| 1 | Prepare | **"Review existing coursework for prerequisite equivalency"** | Verify badge |
| 2 | Prepare | **"Identify remaining prerequisite courses"** | Verify badge |
| 3 | Prepare | **"Compare ADN, BSN, and accelerated BSN routes"** | Description: *"If you are completing or already hold a bachelor's degree, an Accelerated BSN (ABSN) may be an option."* Verify badge |
| 4 | Prepare | **"Confirm transfer-credit and admission policies"** | Verify badge |
| 5 | Education | **"Apply to an LSBN-approved nursing program"** | Verify badge |
| 6 | Clinical | **"Complete nursing education and supervised clinical hours"** | — |
| 7 | Exam | **"Apply for NCLEX-RN authorization through LSBN"** | Verify badge |
| 8 | Exam | **"Pass the NCLEX-RN exam"** | — |
| 9 | License | **"Apply for your Louisiana RN license"** | Verify badge |

Same Louisiana programs and sources as Scenario 1.

---

### Scenario 3 output — CNA pathway for an adult learner
**Route:** `/healthcare/pathways/cna` (learner category: `adult`)

| # | Kind | Title | Verify badge |
|---|---|---|---|
| 1 | Prepare | **"Find an LDH-approved CNA training program"** | ✓ |
| 2 | Prepare | **"Confirm cost, schedule, and minimum requirements"** | ✓ |
| 3 | Education | **"Complete required CNA training (minimum 80-hour core)"** | ✓ |
| 4 | Exam | **"Pass the nurse aide competency evaluation"** | ✓ |
| 5 | Registry | **"Confirm Louisiana nurse aide registry placement"** | ✓ |
| 6 | Career | **"Seek CNA employment"** | — |

**Louisiana program card:**

| Field | Value |
|---|---|
| Institution | **Delgado Community College** |
| Program | Certified Nursing Assistant (CNA) Program |
| Location | New Orleans, LA (Charity School of Nursing) |
| Duration | At least 80 hours total; **8-week program** including at least 40 hours in a long-term care facility |
| Cost | Estimated **$1,673.66** for tuition and fees (from official Delgado CNA page, 2026-11-06; verify current cost) |
| Delivery | In-person |
| Verification | Verified 2026-11-06 |

**Education route listed:** State-Approved Nurse Aide Training (1–2 months, 80-hour minimum)

**Official sources:** Louisiana Department of Health — CNA Registry (ldh.la.gov) / Louisiana CNA/DSW Registry Search (tlc.dhh.la.gov)

**Step 6 description (employment):**
*"Hospitals, nursing homes, and home care agencies employ CNAs. Registry placement is distinct from RN or LPN professional licensure."*

---

### Catalog entries (complete — 5 items as of this branch)
The catalog is used by the Recommendations and Opportunities screens, not the Pathway screens.

| ID | Title | Provider | Price | Duration | Topics |
|---|---|---|---|---|---|
| `cisco-intro-cybersecurity` | Introduction to Cybersecurity | Cisco Networking Academy (Skills for All) | Free | 6 hours | cybersecurity |
| `cisco-networking-basics` | Networking Basics | Cisco Networking Academy (Skills for All) | Free | 22 hours | networking, information-technology |
| `modern-states-clep-prep` | Modern States — Free CLEP Exam Preparation | Modern States Education Alliance | Free | Self-paced | alternative-credit |
| `clep-exam-program` | CLEP — College-Level Examination Program | College Board | $97 | Varies by exam | alternative-credit |
| `louisiana-atc-responsible-vendor` | Louisiana Responsible Vendor Training | ATC-Approved Providers | Unknown (varies by provider) | Unknown (varies) | responsible-vendor |

**Important for video:** All three demo scenarios involve healthcare interest, and the catalog has no healthcare entries. The Recommendations screen will always show the **empty state** for these users. If you want to demonstrate a *non-empty* recommendations screen, use a user who selected **"Technology & Computing"** career interest (matches Cisco courses) or **"Explore college-credit options"** goal (matches CLEP/Modern States).

---

## 5. Branding

**App name:** Pathwise AI (displayed as-is in the hero; slug: `pathwise-ai`)

**Logo:** No custom SVG/PNG logo file. The brand mark is a 🎓 emoji inside a 44×44 semi-transparent white circle, next to the text "Pathwise AI" in bold white. Android adaptive icon background color is `#1E1458`.

**Icon files:**
- `apps/mobile/assets/images/icon.png` — main app icon
- `apps/mobile/assets/images/favicon.png` — web favicon
- `apps/mobile/assets/images/splash-icon.png` — splash screen
- `apps/mobile/assets/images/android-icon-foreground.png` / `android-icon-background.png` (bg: `#1E1458`)

**Color palette (all from `apps/mobile/src/constants/theme.ts`):**

| Token | Hex | Usage |
|---|---|---|
| `heroBg` | `#1E1458` | Deep navy purple — header bands, screen heroes |
| `primary` | `#6C5CE7` | Main purple — CTA buttons, selected borders, milestone dots |
| `primaryDark` | `#5A4CD6` | Pressed/focused button state |
| `primaryDisabled` | `#B5AEE2` | Disabled button |
| `surface` | `#F5F3FF` | Very light lavender — page background |
| `cardBg` | `#FFFFFF` | Card background |
| `cardBorderDefault` | `#E2DCFF` | Card default border |
| `cardBorderSelected` | `#6C5CE7` | Card selected/active border |
| `textOnPurple` | `#FFFFFF` | White text on hero backgrounds |
| `textSubtleOnPurple` | `#C4B9F9` | Soft purple-white text on hero |
| `textPrimary` | `#1A0F3C` | Near-black — primary body text |
| `textSecondary` | `#6E6193` | Medium purple-grey — secondary text, descriptions |
| `iconBg` | `#EDE9FF` | Light lavender — icon circles, chips |
| `checkBg` | `#6C5CE7` | Checkbox fill |

**Milestone-specific accent colors (not in theme.ts, defined inline):**

| Kind | Color |
|---|---|
| Prepare | `#7B8FA6` (blue-grey) |
| Education | `#6C5CE7` (purple, same as primary) |
| Clinical | `#00897B` (teal) |
| Exam | `#E67E22` (orange) |
| License / Registry | `#27AE60` (green) |
| Career | `#8E44AD` (deep purple) |

**Typography:** System font stack (`system-ui` on iOS, `var(--font-display)` on web). No custom font loaded. All headings are `fontWeight: '700'` or `'800'`. Body text is `fontWeight: '500'`.

**Light/dark mode:** `userInterfaceStyle: "automatic"` in `app.json`, but the main Pathwise screens use the brand purple palette exclusively and do not switch to a dark-mode variant. The app will follow system appearance only on generic Expo layout screens (which are not part of the demo flows).

**Overall visual tone:** Clean, calm, trust-building. Deep purple headers anchor each screen. White cards on a light lavender surface. No gradients, no animations. Milestone timeline uses color-coded dots to create visual hierarchy. The "Verify with provider" badge in orange adds urgency without alarm.

---

## 6. Standout Features

**1. Personalized pathway per learner category**
The same career (e.g. RN) renders completely different milestone steps for high school, university, and adult learners. The university RN pathway explicitly names the Accelerated BSN option for people who already hold a bachelor's degree — a rare, specific call-out that speaks directly to career-changers.

**2. Verified Louisiana program cards**
Unlike generic career sites, the app surfaces specific, named programs (Delgado, BRCC, LSUHSC) with real application requirements, real GPA thresholds (e.g. "Minimum 2.8 GPA on 16 prerequisite credit hours"), real exam requirements (TEAS 65%), and a confirmed cost figure for the CNA program ($1,673.66). Every field that could not be verified is explicitly set to null — the app never invents details.

**3. "Verify with provider" badges**
Orange inline badges on steps that require direct confirmation. This is unusual for a career-guidance app — most tools present requirements as fact. Pathwise AI flags uncertainty at the step level, which builds credibility.

**4. Zero-data privacy model**
The app works with no account, no login, and no server call. The completion screen explicitly says *"none of your answers have been stored or transmitted."* This is worth showing directly — the confirmation screen text is a differentiator.

**5. Provisional approval status surfaced on program cards**
The LPN program cards for Delgado and BRCC show LSBPNE PROVISIONAL status warnings prominently. This is a rare example of a consumer-facing app surfacing regulatory nuance instead of hiding it.

**6. Responsive desktop layout**
At ≥768px, the welcome screen's three learner-type cards render side-by-side in a row. This makes the web version look polished and intentional for desktop demos.

---

## 7. Tech Notes

**Framework:** Expo SDK 58 + React Native 0.88.1 + React 19.3.0 + TypeScript + Expo Router (file-based routing). Web output: static export.

**Mobile responsive:** Yes. Breakpoint at 768px. Below: single-column layouts. Above: multi-column cards, wider content areas (max 800px or 960px depending on section). Fully functional on iOS, Android, and web browser.

**How to run locally:**
```bash
cd apps/mobile
npx expo start --web   # opens in browser at localhost:8081
```
Or to build a static export:
```bash
npx expo export --platform web   # outputs to dist/
npx serve dist                   # serve with any static server
```

**Deployed URL:** None configured. No deployment target in `app.json` or the codebase.

**No AI, no API calls:** All pathway content is hardcoded, deterministic TypeScript. The app makes no network requests and requires no API keys. The name "AI" in the brand is aspirational — the current build is fully rules-based.

---

## 8. Gaps (do NOT show these in the video)

| Gap | Detail |
|---|---|
| **Recommendations screen is empty for all three scenarios** | The catalog has no healthcare entries. Healthcare learners always see the "No recommendations yet" empty state. Do not show the recommendations screen for any of the three demo personas. |
| **LPN programs have PROVISIONAL regulatory status** | The Delgado PN (City Park campus) and BRCC PN (Acadian campus) programs are listed as PROVISIONAL on the LSBPNE approved program list for 2025–26. The program cards surface this warning. Avoid showing the LPN pathway in the demo unless you want to explain provisional status. |
| **No salary or earnings data anywhere in the app** | The app never mentions salaries, hourly wages, or earning potential. Do not add these claims in voiceover. |
| **No timeline summary or total duration estimate** | The pathway shows individual step descriptions but no "this pathway takes X months" summary. Do not claim durations in voiceover beyond what individual step descriptions say. |
| **CNA program needs-recheck note** | The `delgado-cna` program card includes a warning: *"Verify current LDH approval status directly with LDH or the institution before enrolling."* This is accurate but visually prominent. Plan for it or show the program card quickly. |
| **Completion screen is a flash, not a landing** | The "You're all set!" screen auto-redirects to `/healthcare` immediately via `router.replace`. It's visible for under a second in normal use. Do not storyboard it as a lingering hero moment unless you slow down playback or add a manual "continue" step. |
| **No MA, Phlebotomy, or PCT Louisiana programs** | The Medical Assistant, Phlebotomy, and Patient Care Technician pathways have no Louisiana program cards (no verified catalog entries exist). If you show these careers, the "Louisiana Programs" section will not appear. Only RN, LPN, and CNA have program cards. |
| **No AI chat, no animated roadmap** | The app has no conversational interface, no animated transitions, and no progress tracking. The milestone timeline is a static scrollable list. |
| **Back navigation on deep link** | If a user refreshes the browser on `/healthcare/pathways/rn`, the Back button calls `router.back()` but there may be no prior app history — it won't return to `/healthcare`. This is a known limitation, not relevant to a guided demo walkthrough. |
