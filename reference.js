// Reference cards and the side-by-side table, extracted from the Entity Transaction Decision Trees artifact.
window.TCP_REFERENCE = {
 "entities": {
  "ccorp": {
   "label": "C Corporation",
   "lede": "Two levels of tax. The corporation pays 21 percent on its own gains; shareholders are taxed again on dividends and on their stock. The formation rules below are the same ones an S corporation uses.",
   "gloss": [
    {
     "cls": "",
     "title": "Boot received (shareholder)",
     "html": "<p>Cash plus the FMV of anything other than stock: other property, corporate notes or bonds, nonqualified preferred stock.</p><ul><li>Not boot: common stock, ordinary preferred stock, liabilities the corporation assumes (see liabilities).</li><li>Recognized gain = lesser of realized gain or boot. Loss is never recognized under 351.</li></ul>"
    },
    {
     "cls": "",
     "title": "Boot paid (corporation)",
     "html": "<p>Cash or other property the corporation hands over along with its stock.</p><ul><li>Cash boot: no effect on the corporation.</li><li>Appreciated property used as boot: corporation recognizes gain as if sold (FMV minus basis). Loss on depreciated boot property is not recognized.</li></ul>"
    },
    {
     "cls": "",
     "title": "Liabilities assumed by the corporation",
     "html": "<ul><li>Normal case: NOT boot. They only reduce the shareholder's stock basis.</li><li>Liabilities assumed exceed the total adjusted basis of ALL property that shareholder transferred: the excess is recognized gain.</li><li>Tax avoidance purpose or no business purpose: ALL liabilities assumed are boot.</li></ul>"
    },
    {
     "cls": "blue",
     "title": "Realized vs recognized (formation)",
     "html": "<span class=\"f\">Amount realized = FMV stock + boot received + liabilities assumed by corp</span><span class=\"f\">Realized gain (loss) = amount realized − adjusted basis of property given</span><span class=\"f\">Recognized gain = lesser of realized gain or boot (0 if 351 met and no boot)</span>"
    },
    {
     "cls": "blue",
     "title": "Basis formulas (formation)",
     "html": "<span class=\"f\">Shareholder stock basis = AB of property + gain recognized − boot received − liabilities assumed by corp</span><span class=\"f\">Check: stock basis = FMV of stock − deferred gain (+ deferred loss)</span><span class=\"f\">Corporation basis in property = transferor's AB + gain transferor recognized</span><span class=\"f\">Basis in boot property received = FMV</span>"
    },
    {
     "cls": "green",
     "title": "Distribution vocabulary",
     "html": "<ul><li>Amount distributed = cash + FMV of property − liabilities the shareholder takes over (not below zero).</li><li>E&amp;P: current E&amp;P is the full year's figure, including the corporation's gain on distributed property. Accumulated E&amp;P is the balance at the start of the year.</li><li>Shareholder's basis in property received = FMV, not reduced by any liability.</li><li>Nonliquidating: corporation recognizes gain only. Liquidating: corporation recognizes gain AND loss.</li></ul>"
    }
   ],
   "sections": [
    {
     "id": "ccorp-contrib",
     "title": "1. Property contribution (Section 351 formation)",
     "sub": "Applies at formation and to later transfers as long as the 80 percent test is met right after the transfer.",
     "owner": "c_contrib_owner",
     "ownerLabel": "Owner / shareholder side",
     "entity": "c_contrib_entity",
     "entityLabel": "Corporation side"
    },
    {
     "id": "ccorp-nonliq",
     "title": "2. Nonliquidating distribution (dividend, property distribution, redemption)",
     "sub": "The corporation keeps operating. Shareholders keep their shares (or surrender some in a redemption).",
     "owner": "c_nonliq_owner",
     "ownerLabel": "Owner / shareholder side",
     "entity": "c_nonliq_entity",
     "entityLabel": "Corporation side"
    },
    {
     "id": "ccorp-liq",
     "title": "3. Liquidating distribution (Sections 331, 336, 332)",
     "sub": "All assets go out, all stock is surrendered, the corporation ends. Both levels of tax hit at once unless the 80 percent parent rule applies.",
     "owner": "c_liq_owner",
     "ownerLabel": "Owner / shareholder side",
     "entity": "c_liq_entity",
     "entityLabel": "Corporation side"
    }
   ]
  },
  "scorp": {
   "label": "S Corporation",
   "lede": "One level of tax. Formation is identical to a C corporation (Section 351 and the 80 percent test). The difference is everything that happens after: income, gains, and losses flow through and move stock basis, and distributions are tested against basis, AAA, and old C corporation E&amp;P instead of being dividends.",
   "gloss": [
    {
     "cls": "",
     "title": "Boot, liabilities, 80 percent test",
     "html": "<p>Exactly the C corporation rules. Boot received = cash + FMV of non stock property. Liabilities assumed are not boot unless they exceed total basis (excess is gain) or there is a tax avoidance purpose (all boot). Services for stock = ordinary income at FMV and no count toward 80 percent.</p>"
    },
    {
     "cls": "blue",
     "title": "Stock basis, annual order",
     "html": "<ol style=\"margin:0;padding-left:16px;font-size:13px\"><li>Beginning stock basis</li><li>+ all income items, including tax exempt income, + capital contributions</li><li>− distributions (not below zero)</li><li>− nondeductible, non capital expenses</li><li>− losses and deductions (not below zero)</li></ol><p style=\"margin-top:4px\">Distributions come out BEFORE losses. That is the most tested ordering point.</p>"
    },
    {
     "cls": "blue",
     "title": "Debt basis",
     "html": "<ul><li>Only from loans the shareholder personally made to the corporation. A guarantee gives nothing. Corporate borrowing gives nothing.</li><li>Losses: stock basis to zero first, then debt basis.</li><li>Later income restores debt basis first, then stock basis.</li><li>Distributions never reduce debt basis.</li><li>Repaying a loan whose basis was reduced creates gain.</li></ul>"
    },
    {
     "cls": "green",
     "title": "AAA (accumulated adjustments account)",
     "html": "<ul><li>Corporate level account of undistributed S corporation income already taxed to shareholders.</li><li>+ income (NOT tax exempt income), − losses, − nondeductible expenses, − distributions (cash and FMV of property).</li><li>Losses can push AAA negative; distributions cannot.</li><li>Capital contributions do not increase AAA.</li><li>Only matters when the corporation has E&amp;P left from C years.</li></ul>"
    },
    {
     "cls": "green",
     "title": "Distribution amount and property basis",
     "html": "<ul><li>Amount distributed = cash + FMV of property (less any liability the shareholder takes over).</li><li>Shareholder's basis in property received = FMV.</li><li>Appreciated property: the corporation's gain flows through to every shareholder pro rata and raises their stock basis before the distribution is tested.</li></ul>"
    },
    {
     "cls": "",
     "title": "Entity level taxes (former C corps only)",
     "html": "<ul><li>Built in gains tax: 21 percent on gain that existed when the S election took effect, if the asset is sold or distributed within 5 years.</li><li>Excess net passive income tax: 21 percent when C period E&amp;P exists and passive investment income exceeds 25 percent of gross receipts. Three years in a row ends the election.</li><li>LIFO recapture: income in the last C year.</li></ul>"
    }
   ],
   "sections": [
    {
     "id": "scorp-contrib",
     "title": "1. Property contribution (Section 351, same as C corporation)",
     "sub": "The only S specific pieces are what happens to the basis after formation: annual ordering, debt basis, and AAA.",
     "owner": "s_contrib_owner",
     "ownerLabel": "Owner / shareholder side",
     "entity": "s_contrib_entity",
     "entityLabel": "Corporation side"
    },
    {
     "id": "scorp-nonliq",
     "title": "2. Nonliquidating (operating) distribution",
     "sub": "Test the distribution against basis. Whether old C corporation E&amp;P exists decides which ladder you use.",
     "owner": "s_nonliq_owner",
     "ownerLabel": "Owner / shareholder side",
     "entity": "s_nonliq_entity",
     "entityLabel": "Corporation side"
    },
    {
     "id": "scorp-liq",
     "title": "3. Liquidating distribution",
     "sub": "The corporation's gains and losses flow through first and change stock basis; then the shareholder computes gain or loss on the stock. Net result is one level of tax.",
     "owner": "s_liq_owner",
     "ownerLabel": "Owner / shareholder side",
     "entity": "s_liq_entity",
     "entityLabel": "Corporation side"
    }
   ]
  },
  "partnership": {
   "label": "Partnership / LLC",
   "lede": "No entity level tax, no control test, no boot. The whole system runs on outside basis (the partner's basis in the interest) and inside basis (the partnership's basis in its assets), with liabilities counted as cash moving in and out.",
   "gloss": [
    {
     "cls": "",
     "title": "What counts as cash",
     "html": "<ul><li>Money.</li><li>Marketable securities at FMV (treated as money when distributed).</li><li>Any DECREASE in the partner's share of partnership liabilities is a deemed cash distribution.</li><li>Any INCREASE in the partner's share of partnership liabilities is a deemed cash contribution (adds to basis).</li></ul><p>There is no \"boot\" in partnership tax. Cash in excess of outside basis is what creates gain.</p>"
    },
    {
     "cls": "",
     "title": "Liabilities: who gets basis",
     "html": "<table style=\"width:100%;border-collapse:collapse;font-size:12.5px;margin-top:4px\"><tr><th style=\"text-align:left;padding:2px 4px\">Debt</th><th style=\"text-align:left;padding:2px 4px\">Allocated to</th><th style=\"text-align:left;padding:2px 4px\">At risk?</th></tr><tr><td style=\"padding:2px 4px\">Recourse</td><td style=\"padding:2px 4px\">Partners who bear the economic risk of loss (general partners)</td><td style=\"padding:2px 4px\">Yes</td></tr><tr><td style=\"padding:2px 4px\">Nonrecourse</td><td style=\"padding:2px 4px\">All partners by profit share</td><td style=\"padding:2px 4px\">No</td></tr><tr><td style=\"padding:2px 4px\">Qualified nonrecourse (real estate)</td><td style=\"padding:2px 4px\">All partners by profit share</td><td style=\"padding:2px 4px\">Yes</td></tr></table>"
    },
    {
     "cls": "blue",
     "title": "Outside basis",
     "html": "<span class=\"f\">Initial = cash + AB of property contributed + income recognized for services + share of partnership liabilities − partner's liabilities taken over by the partnership</span><span class=\"f\">Annual, in order: + income (incl. tax exempt), contributions, liability share increases; − distributions (cash, then basis of property), liability share decreases; − losses and nondeductible items</span><p>Never below zero. Losses beyond basis are suspended. Then at risk, then passive, then excess business loss.</p>"
    },
    {
     "cls": "blue",
     "title": "Inside basis and 704(c)",
     "html": "<ul><li>Inside basis = contributing partner's adjusted basis (carryover). Holding period tacks.</li><li>Capital account (book) = FMV contributed. Tax basis = carryover. The gap is built in gain or loss.</li><li>704(c): built in gain or loss goes back to the contributing partner when the asset is sold or depreciated.</li><li>Distributed to a different partner within 7 years: contributor recognizes the built in gain.</li></ul>"
    },
    {
     "cls": "green",
     "title": "Hot assets (Section 751)",
     "html": "<ul><li>Unrealized receivables (cash basis receivables, depreciation recapture) and inventory.</li><li>On distribution they take the partnership's basis and are NEVER stepped up.</li><li>Sale of a partnership interest: the part of the gain tied to hot assets is ordinary; the rest is capital.</li><li>Contributed inventory sold within 5 years stays ordinary; contributed receivables are always ordinary.</li></ul>"
    },
    {
     "cls": "green",
     "title": "Current vs liquidating, the one line difference",
     "html": "<ul><li>Current distribution: basis in property received = LESSER of the partnership's basis or remaining outside basis. No loss ever.</li><li>Liquidating distribution: other property absorbs ALL remaining outside basis (can be higher or lower than carryover). Loss only when nothing but cash and hot assets come out.</li><li>Partnership itself: no gain or loss either way, except 751(b) disproportionate hot asset distributions.</li></ul>"
    }
   ],
   "sections": [
    {
     "id": "pt-contrib",
     "title": "1. Property contribution (Section 721)",
     "sub": "Tax free at any time and at any ownership percentage. Watch services, net liability relief, and disguised sales.",
     "owner": "p_contrib_owner",
     "ownerLabel": "Owner / partner side",
     "entity": "p_contrib_entity",
     "entityLabel": "Partnership side"
    },
    {
     "id": "pt-nonliq",
     "title": "2. Nonliquidating (current) distribution",
     "sub": "The partner stays in. Gain only when cash exceeds outside basis; property basis is capped at remaining outside basis; loss never.",
     "owner": "p_nonliq_owner",
     "ownerLabel": "Owner / partner side",
     "entity": "p_nonliq_entity",
     "entityLabel": "Partnership side"
    },
    {
     "id": "pt-liq",
     "title": "3. Liquidating distribution (retirement, death, full liquidation)",
     "sub": "The partner's entire interest ends. Remaining outside basis has to land somewhere: in a loss (cash and hot assets only) or in the other property received.",
     "owner": "p_liq_owner",
     "ownerLabel": "Owner / partner side",
     "entity": "p_liq_entity",
     "entityLabel": "Partnership side"
    }
   ]
  }
 },
 "compare": {
  "lede": "The T3 M4 comparison, limited to the three transactions on this page. Read a row across to see what changes between entities.",
  "headers": [
   "Item",
   "C corporation",
   "S corporation",
   "Partnership / LLC"
  ],
  "rows": [
   [
    "Tax free contribution requires",
    "80 percent control by property transferors right after (Section 351)",
    "Same 80 percent test (Section 351)",
    "Nothing. Any percentage, any time (Section 721)"
   ],
   [
    "Owner gain on contribution",
    "Lesser of realized gain or boot; liabilities over basis; services at FMV",
    "Same as C corporation",
    "Only services at FMV, net liability relief over basis, or a disguised sale"
   ],
   [
    "Owner's initial basis",
    "AB of property + gain recognized − boot − liabilities assumed by corp",
    "Same formula, then adjusted every year for pass through items",
    "AB of property + share of partnership liabilities − liabilities relieved + services income"
   ],
   [
    "Entity's basis in property",
    "Carryover + gain the transferor recognized (limited to FMV if net built in loss)",
    "Same as C corporation",
    "Carryover; built in gain or loss tracked under 704(c)"
   ],
   [
    "Entity debt in owner's basis",
    "No",
    "No. Only the shareholder's own direct loans (debt basis)",
    "Yes. Recourse by risk of loss, nonrecourse by profit share"
   ],
   [
    "Appreciated property distributed (nonliquidating), entity",
    "Gain recognized, taxed at 21 percent, increases E&amp;P",
    "Gain recognized and passed through to shareholders (BIG tax possible)",
    "No gain (except 751(b), 704(c)(1)(B), 737)"
   ],
   [
    "Depreciated property distributed (nonliquidating), entity",
    "No loss",
    "No loss, nothing passes through",
    "No loss"
   ],
   [
    "Owner on nonliquidating distribution",
    "Dividend to E&amp;P, then return of capital, then capital gain",
    "Tax free to stock basis then capital gain; with C E&amp;P: AAA, E&amp;P dividend, basis, gain",
    "Gain only if cash exceeds outside basis; never loss"
   ],
   [
    "Owner's basis in property received (nonliquidating)",
    "FMV",
    "FMV",
    "Lesser of partnership basis or remaining outside basis"
   ],
   [
    "Entity on liquidation",
    "Gain AND loss as if sold at FMV; tax at 21 percent",
    "Gain AND loss as if sold, passed through; no entity tax unless BIG",
    "No gain or loss"
   ],
   [
    "Owner on liquidation",
    "Capital gain or loss: FMV received − liabilities − stock basis (second tax)",
    "Capital gain or loss after pass through adjusts basis (one tax)",
    "Gain only if cash exceeds basis; loss only with cash and hot assets only"
   ],
   [
    "Owner's basis in property received (liquidation)",
    "FMV",
    "FMV",
    "Remaining outside basis (hot assets at carryover, never up)"
   ],
   [
    "80 percent parent shareholder",
    "Section 332: no gain to parent or sub; carryover basis",
    "Not applicable (a corporation cannot own S stock)",
    "Not applicable"
   ],
   [
    "Liquidation loss limits",
    "Related party not pro rata or disqualified property (5 years); built in loss with avoidance plan (2 years)",
    "Same 336 limits apply to the entity",
    "Partner loss only when no \"other property\" is received"
   ]
  ]
 },
 "legend": [
  "? Decision",
  "No gain or tax free",
  "Gain, income, or loss recognized",
  "Formula",
  "Result / basis and holding period"
 ]
};
