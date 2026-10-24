// Study plan for the final week before the TCP exam (Thursday, October 29, 2026).
// Built on 2026-10-23 from the Becker performance pull (becker.js), the Newt topic files, and the decision trees.
window.TCP_PLAN = {
 title: "Oct 23 to Oct 29, 2026",
 headline: "Six days: entity transactions first, then the two weak property and NOL modules",
 intro: "Ranked from your actual Becker results: 123 unique missed MCQ IDs across Simulated Exam 1, both mini exams and 12 practice tests, 27 of them missed twice. Sets of 25 or fewer, one miss log line per miss, and the decision trees in recall mode before each entity drill.",
 note: "Both mini exams scored lower on the second attempt (89% to 74% and 89% to 72%) in less than half the time. Speed is costing accuracy. On every set this week, read the last sentence of the stem twice before touching an answer.",
 ranking: [
  {module:"T2 M2", topic:"Entity and owner transactions (C corporation trees)", why:"Most misses of any module: 25 unique IDs, 6 repeats, practice-test accuracy 76%, and TBS-002254 (E&P characterization) scored 17% then 50%. Redemptions, complete liquidations and the E&P combinations are the repeat offenders.", start:"ccorp"},
  {module:"T2 M1", topic:"NOLs and capital loss limitations", why:"Weakest practice-test rate (63%, 12 of 19), three IDs missed twice (MCQ-17079, 25117, 25152), TBS-002738 at 67%. Small module, fast to fix: 80% limit, pre-2018 first, capital losses back 3 forward 5.", topic_drill:"NOL ordering: pre-2018 at 100 percent, then post-2017 at 80 percent"},
  {module:"T4 M1", topic:"Nontaxable dispositions: like-kind, involuntary conversions, installment", why:"65% (20 of 31) with 13 unique misses: four like-kind IDs (06408, 06414, 06418, 16214), two involuntary conversion IDs, installment sales, and 02178 and 02185 missed twice.", start:"property"},
  {module:"T3 M4", topic:"Entity formation and liquidation comparison", why:"67% (8 of 12), TBS-002199 at 50% on both Simulated Exam 1 attempts, MCQ-10896 missed twice. The side-by-side table is the whole module.", start:"comparison"},
  {module:"T3 M1", topic:"S corporation basis and distribution simulations", why:"MCQs are fine (83%) but the sims are not: TBS-002367 fell from 78% to 12%, TBS-002410 40% then 60%, TBS-002207 40% then 90%. Basis ordering and the AAA ladder on paper, every day.", start:"scorp"},
  {module:"T3 M3", topic:"Partnership liquidation, sale of interest, 754", why:"75% (9 of 12) and 6 exam misses, 01803 and 10013 both missed twice; basis in property received, hot assets and 743(b).", start:"partnership"},
  {module:"T1 M4", topic:"Retirement plan limits and planning items", why:"Practice tests say 93% but four IDs (16035, 16039, 16043, 17297) were missed on both Simulated Exam 1 attempts, plus three retirement-plan homework items. Pure recall: numbers sheet, 20 minutes.", topic_drill:null},
  {module:"T3 M2", topic:"Partner basis simulation", why:"MCQs 91%, but TBS-002306 fell from 67% to 34% on the retake. Outside basis roll-forward with liabilities, in order, on paper.", start:"partnership"},
  {module:"T1 M2", topic:"Passive loss release and the loss-limit order", why:"MCQ-23854 missed twice (disposition of a passive activity), plus 23841, 25067, 23856; TBS-002742 at 67% then 58%.", topic_drill:"Order of the loss limits: basis, at-risk, passive"},
  {module:"T2 M5", topic:"Corporate estimated tax and NOL planning", why:"MCQ-16373 (annualized method) and 16374 each missed twice; 16331 and 25158 on loss carryovers.", topic_drill:null}
 ],
 traps: [
  "Current E&P positive and accumulated E&P negative: do not net. Current deficit and accumulated positive: net to the distribution date.",
  "Add the corporation's gain on distributed property to current E&P before comparing E&P to the distribution.",
  "A redemption is a sale only if a test passes: under 50 percent and under 80 percent of the prior percentage, or complete termination. Otherwise it is a dividend and the basis moves to the remaining shares.",
  "Liquidation: the corporation recognizes gain and loss; the shareholder's amount realized is FMV minus liabilities assumed. Nothing in a liquidation is a dividend.",
  "S corporation basis: distributions come out before losses; stock to zero, then debt; income restores debt basis first. Tax-exempt income raises basis but never AAA.",
  "Partnership contribution with debt: subtract the whole liability relieved, then add back your share of all partnership debt. Net relief over basis is gain.",
  "Current partnership distribution: property basis is the lesser of carryover or remaining outside basis, and there is never a loss. Liquidating: other property absorbs all remaining basis; hot assets are never stepped up.",
  "Sale of a partnership interest: amount realized includes relief of your debt share; all inventory and unrealized receivables are ordinary.",
  "Like-kind: net the mortgages. Recognized gain is the lesser of realized gain or net boot received. A loss is never recognized.",
  "Involuntary conversion: recognize the lesser of the realized gain or the proceeds not reinvested; replacement basis is cost minus deferred gain; 3 years only for condemned business real estate.",
  "Post-2017 NOLs cover 80 percent of taxable income after pre-2018 NOLs are used in full. Corporate capital losses only offset capital gains: back 3, forward 5, short term.",
  "Loss limits in order: basis, at-risk (no plain nonrecourse debt), passive, excess business loss. A complete taxable disposition releases suspended passive losses against any income."
 ],
 days: [
  {date:"2026-10-23", label:"Friday", minutes:90, blocks:[
    {t:"Read the focus ranking and the 27 repeat-miss IDs; pull each repeat ID up in Becker with Find Question and write the miss log line", sub:"Repeat misses are the cheapest points on the exam", link:"#plan"},
    {t:"C corporation trees in recall mode: contribution, nonliquidating, liquidation, owner and entity side", sub:"Say each result node before revealing it", link:"#trees/ccorp"},
    {t:"25-question C corporation set", sub:"T2 M2 is the number one gap", link:"#start/ccorp"},
    {t:"Decide the Simulated Exam 2 slot: tomorrow morning, rested, 4 hours timed, no notes", sub:"Becker lists it as today's task; a late-night start repeats the second-attempt slide"}
  ]},
  {date:"2026-10-24", label:"Saturday", minutes:360, blocks:[
    {t:"Simulated Exam 2, timed, 4 hours, morning", sub:"Flag and move on past 2 minutes; the TBS testlets decide the score"},
    {t:"Review every Simulated Exam 2 miss by module and write the miss log lines", sub:"Group them by module before writing anything", link:"#misslog"},
    {t:"Redo your trainer misses", link:"#start/missed"},
    {t:"Add the day's Becker misses to the miss log and ask the tutor for the rule line on any you cannot state", link:"#misslog"}
  ]},
  {date:"2026-10-25", label:"Sunday", minutes:240, blocks:[
    {t:"T2 M2 day. Rework TBS-002254, TBS-077211 and TBS-002094 on paper first, then check", sub:"E&P characterization and distribution classification"},
    {t:"C corporation 25-question set, then redo the misses", link:"#start/ccorp"},
    {t:"Redemption and liquidation homework repeats: MCQ-08974 and MCQ-17552 plus the bank repeats 02907, 02908, 02957, 06003", sub:"Write the rule line for each"},
    {t:"S corporation trees in recall mode, then a 25-question S corporation set", link:"#start/scorp"}
  ]},
  {date:"2026-10-26", label:"Monday", minutes:210, blocks:[
    {t:"T4 M1: like-kind with net debt, involuntary conversion basis and periods, installment with recapture", sub:"Homework repeats 06408, 06414, 06418, 16214, 14926, 27379, 14659", link:"#start/property"},
    {t:"T2 M1: NOL ordering and corporate capital losses; rework TBS-002738", sub:"Repeat IDs 17079, 25117, 25152", link:"#start/writein"},
    {t:"Write-in drill, 15 questions", sub:"Numbers only, no answer choices to lean on", link:"#start/writein"},
    {t:"Mixed 25 timed", link:"#start/mixed"}
  ]},
  {date:"2026-10-27", label:"Tuesday", minutes:240, blocks:[
    {t:"T3 M3 and T3 M2: partnership trees in recall mode, then rework TBS-002306 (partner basis) on paper", link:"#trees/partnership"},
    {t:"Partnership 25-question set", sub:"Liquidating basis, sale of interest, 743(b)", link:"#start/partnership"},
    {t:"S corporation sims: rework TBS-002367, TBS-002410, TBS-002207 on paper", sub:"Basis order and the four-layer ladder"},
    {t:"T3 M4: side-by-side table out loud, rework TBS-002199, then the comparison set", link:"#start/comparison"}
  ]},
  {date:"2026-10-28", label:"Wednesday", minutes:180, blocks:[
    {t:"Recall only: T1 M4 retirement limits (24,500; 8,000 and 11,250 catch-ups; 72,000; IRA 7,500; SEP 72,000) and the four repeat IDs 16035, 16039, 16043, 17297", sub:"Key numbers sheet, 20 minutes", link:"#cheatsheet"},
    {t:"T1 M2 passive release and loss-limit order, T1 M3 gift vs bequest basis, T3 M5 simple vs complex and DNI, T2 M5 annualized estimated tax", sub:"One question each from the weak-topic set", link:"#start/weak"},
    {t:"Redo every trainer miss until the open-miss count is zero", link:"#start/missed"},
    {t:"Read the trap list twice, then stop by early evening. No new material tonight."}
  ]},
  {date:"2026-10-29", label:"Thursday, exam day", minutes:20, blocks:[
    {t:"Say the 12 traps out loud, once", link:"#plan"},
    {t:"Four-layer S ladder and the E&P table from memory on a blank sheet, two minutes"},
    {t:"Nothing else. Read every stem to the last sentence before answering."}
  ]}
 ]
};
