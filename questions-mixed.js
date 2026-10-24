// TCP Decision Tree Trainer: entity comparison (T3 M4) and high-yield traps from T1, T2 and T4.
// Original practice questions written for 2026 law. Not Becker content.
window.TCP_QUESTIONS = (window.TCP_QUESTIONS || []).concat([

  // ===================== PART A: ENTITY COMPARISON (T3 M4) =====================

  {
    id: "MX-01",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Tax-free contribution requirement by entity type",
    tags: ["comparison", "formation", "control test"],
    type: "mcq",
    difficulty: 1,
    stem: "Priya owns land with an adjusted basis of 40,000 and a fair market value of 100,000. She plans to contribute the land to a business already owned equally by two unrelated people and will receive a one-third ownership interest. No cash or other property changes hands and the land is debt free.\nUnder which form of business can Priya avoid recognizing her 60,000 realized gain on the contribution?",
    choices: [
      "C corporation only, because the corporate nonrecognition rule has no ownership test",
      "S corporation only, because pass-through entities never tax contributions",
      "Partnership or LLC taxed as a partnership, because Section 721 has no control requirement",
      "Any of the three, because contributions of appreciated property are always tax free"
    ],
    answer: 2,
    explanation: "C. Partnership or LLC taxed as a partnership, with no gain recognized.\nThe rule: a corporate contribution is tax free under Section 351 only if the property transferors own at least 80 percent of the voting power and 80 percent of each class of nonvoting stock right after the exchange. Priya alone transfers property and ends up with one third, so a C or S corporation would make the exchange fully taxable: gain of 60,000 (100,000 FMV minus 40,000 basis). Section 721 has no control test, so the partnership contribution is tax free at any percentage, and the 60,000 built-in gain stays with Priya under Section 704(c).\nA is wrong because Section 351 does have the 80 percent test and the C corporation fails it here.\nB is wrong because an S corporation uses the same Section 351 test as a C corporation; pass-through status changes nothing at formation.\nD is wrong because the corporate forms fail the control test, so only the partnership avoids the gain.",
    rule: "Section 721 has no control test; Section 351 requires 80 percent control by property transferors right after the exchange, for both C and S corporations.",
    trap: "Assuming an S corporation follows partnership rules at formation; it follows Section 351."
  },

  {
    id: "MX-02",
    module: "T3 M4",
    entity: "Comparison",
    tree: "p_contrib_owner",
    topic: "Owner's initial basis with entity debt by entity type",
    tags: ["comparison", "formation", "liabilities", "outside basis"],
    type: "numeric",
    difficulty: 3,
    stem: "Marcus contributes a warehouse with an adjusted basis of 120,000 and a fair market value of 200,000 to a newly formed general partnership in exchange for a 40 percent interest. The warehouse is subject to a 50,000 recourse mortgage that the partnership assumes and shares 40/60 by the partners' loss sharing ratio. The other partner contributes 225,000 of cash and the partnership has no other debt.\nWhat is Marcus's initial outside basis in his partnership interest?",
    answer: 90000,
    unit: "$",
    tolerance: 0,
    explanation: "90,000.\nStart with the basis of the property contributed: 120,000.\nThe rule for liabilities in a partnership: a liability the partnership takes over is treated as cash distributed to Marcus, and his share of all partnership liabilities is treated as cash contributed. Subtract the full mortgage assumed, 50,000 (120,000 minus 50,000 = 70,000). Add back his 40 percent share of that same liability, 20,000 (50,000 x 40%), for an outside basis of 90,000 (70,000 plus 20,000).\nComparison. C corporation: stock basis = 120,000 basis plus 0 gain recognized minus 0 boot minus 50,000 liabilities assumed = 70,000; corporate debt never enters stock basis. S corporation: the same 70,000 stock basis, and no debt basis because the mortgage is owed to the bank, not to Marcus. Partnership: 90,000, because partners get basis for their share of entity debt.\nNo gain: the net liability relief of 30,000 (50,000 minus 20,000) is well under the 120,000 basis.\nCheck: 120,000 minus 30,000 net relief = 90,000.",
    rule: "Partnership outside basis = property basis minus the full liability assumed plus the partner's share of partnership liabilities; corporate stock basis only subtracts the liability.",
    trap: "Subtracting the whole mortgage without adding back the 40 percent share gives 70,000, which is the corporate answer."
  },

  {
    id: "MX-03",
    module: "T3 M4",
    entity: "Comparison",
    tree: "c_contrib_entity",
    topic: "Entity's basis in contributed property when the owner recognizes gain",
    tags: ["comparison", "formation", "boot", "inside basis"],
    type: "numeric",
    difficulty: 2,
    stem: "Lena transfers equipment with an adjusted basis of 60,000 and a fair market value of 100,000 to Harbor Corp. In return she receives Harbor stock worth 85,000 and 15,000 of cash. Together with the other property transferors she owns 90 percent of Harbor immediately after the exchange.\nWhat is Harbor's basis in the equipment?",
    answer: 75000,
    unit: "$",
    tolerance: 0,
    explanation: "75,000.\nSection 351 applies because the property transferors own 90 percent (at least 80 percent) right after the exchange.\nLena's realized gain is 40,000 (85,000 stock plus 15,000 cash = 100,000 amount realized, minus 60,000 basis). Boot received is the 15,000 cash. The rule: recognized gain is the lesser of realized gain or boot, so Lena recognizes 15,000.\nThe corporation's rule: basis in the property = transferor's adjusted basis plus gain the transferor recognized = 75,000 (60,000 plus 15,000). The holding period tacks.\nComparison. A partnership takes a plain carryover basis of 60,000 because there is no boot concept under Section 721; a cash payment alongside the interest would instead be tested as a distribution or a disguised sale. An S corporation gets the same 75,000 as the C corporation.\nCheck: Lena's stock basis is 60,000 (60,000 plus 15,000 gain minus 15,000 cash), which equals 85,000 FMV minus 25,000 deferred gain, and the corporation's 75,000 basis defers the same 25,000 (100,000 FMV minus 75,000).",
    rule: "Corporation's basis in contributed property = transferor's adjusted basis plus any gain the transferor recognized, never FMV when Section 351 applies.",
    trap: "Using the 100,000 FMV, or forgetting to add the 15,000 boot gain to the 60,000 carryover."
  },

  {
    id: "MX-04",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Entity debt in the owner's basis",
    tags: ["comparison", "liabilities", "debt basis", "at-risk"],
    type: "mcq",
    difficulty: 2,
    stem: "Three businesses each borrow 300,000 from a bank on a nonrecourse basis secured by business equipment. In each case Dana owns 25 percent.\nRidge LLC, taxed as a partnership, allocates the debt by profit share.\nSummit Inc. is an S corporation, and Dana personally guarantees the loan.\nCrest Inc. is a C corporation, and Dana also guarantees the loan.\nBy how much does each borrowing increase Dana's basis in her ownership interest?",
    choices: [
      "Ridge 75,000; Summit 75,000; Crest 0",
      "Ridge 75,000; Summit 0; Crest 0",
      "Ridge 300,000; Summit 300,000; Crest 0",
      "Ridge 0; Summit 0; Crest 0"
    ],
    answer: 1,
    explanation: "B. Ridge 75,000; Summit 0; Crest 0.\nPartnership: a partner's outside basis includes the partner's share of all partnership liabilities, and nonrecourse debt is allocated by profit share, so Dana adds 75,000 (300,000 x 25%). The same nonrecourse debt is not at-risk, so it helps her basis hurdle but not her at-risk hurdle.\nS corporation: a shareholder gets debt basis only for money the shareholder personally lends to the corporation. A guarantee is not a loan, and the corporation's own borrowing from the bank gives nothing, so the increase is 0.\nC corporation: shareholders never include corporate debt in stock basis, so the increase is 0.\nA is wrong because a guarantee creates no S corporation debt basis until Dana actually pays the bank.\nC is wrong because a partner gets only her share of the debt, not the full amount.\nD is wrong because nonrecourse debt does count toward a partner's outside basis; it is only the at-risk amount that excludes it.\nCheck: 300,000 x 25% = 75,000 for the partnership, zero for both corporations.",
    rule: "Entity debt enters only a partner's basis; an S shareholder gets basis only for direct loans, and a guarantee gives nothing.",
    trap: "Giving the S corporation shareholder basis for a guaranteed bank loan."
  },

  {
    id: "MX-05",
    module: "T3 M4",
    entity: "Comparison",
    tree: "s_nonliq_entity",
    topic: "Appreciated property distribution by entity type",
    tags: ["comparison", "distribution", "gain", "pass-through"],
    type: "numeric",
    difficulty: 3,
    stem: "Orchard holds land with an adjusted basis of 40,000 and a fair market value of 100,000. It distributes the land to Nadia, a 50 percent owner, in a nonliquidating distribution and continues operating. Nadia's basis in her ownership interest is 150,000 before the distribution.\nIf Orchard is an S corporation with no accumulated earnings and profits, how much gain is allocated to Nadia from the distribution?",
    answer: 30000,
    unit: "$",
    tolerance: 0,
    explanation: "30,000.\nThe entity-level rule for an S corporation: appreciated property distributed is treated as sold at FMV, so Orchard recognizes 60,000 (100,000 FMV minus 40,000 basis). The corporation pays no tax; the gain passes through per share, so Nadia is allocated 30,000 (60,000 x 50%) and the other owner is allocated the other 30,000.\nNadia's stock basis rises to 180,000 (150,000 plus 30,000) before the distribution is tested. The distribution of 100,000 (FMV of the land) is tax free against that basis, leaving 80,000 (180,000 minus 100,000). Her basis in the land is 100,000 (FMV).\nComparison. C corporation: the corporation recognizes the same 60,000 gain and pays 12,600 of tax (60,000 x 21%); the gain increases current E&P, and Nadia has a 100,000 dividend to the extent of E&P. S corporation: 60,000 recognized, no entity tax, 30,000 passed to each owner. Partnership: no gain to the partnership or to Nadia; she takes the lesser of the 40,000 inside basis or her remaining outside basis, so 40,000 here.\nCheck: 30,000 plus 30,000 = the 60,000 entity gain.",
    rule: "An S corporation recognizes gain on appreciated property distributed and passes it to all shareholders pro rata before the distribution is tested against basis; a partnership recognizes nothing.",
    trap: "Allocating the whole 60,000 to the shareholder who received the land, or taxing the corporation at 21 percent as if it were a C corporation."
  },

  {
    id: "MX-06",
    module: "T3 M4",
    entity: "Comparison",
    tree: "c_nonliq_owner",
    topic: "Owner treatment of a nonliquidating cash distribution by entity type",
    tags: ["comparison", "distribution", "E&P", "basis"],
    type: "mcq",
    difficulty: 3,
    stem: "Theo owns 100 percent of a business that distributes 90,000 of cash to him during the year and keeps operating. His basis in his ownership interest, after all income allocations for the year but before the distribution, is 60,000. The business has 50,000 of current and accumulated earnings and profits if it is a C corporation; it has never been a C corporation if it is an S corporation.\nWhich statement correctly describes Theo's tax result?",
    choices: [
      "C corporation: 50,000 dividend, 40,000 tax free return of capital, no gain; basis after is 20,000",
      "S corporation: 50,000 dividend, 40,000 tax free; basis after is 20,000",
      "Partnership: 90,000 of ordinary income, because distributions of partnership cash are taxable",
      "C corporation: 60,000 tax free return of capital and 30,000 capital gain, because basis is recovered first"
    ],
    answer: 0,
    explanation: "A. C corporation: 50,000 dividend, 40,000 return of capital, 0 gain, ending basis 20,000.\nC corporation: the rule is dividend to the extent of E&P, then return of capital against basis, then capital gain. Dividend 50,000 (all of the E&P). Remaining 40,000 (90,000 minus 50,000) is a tax free return of capital because it is under his 60,000 basis. Gain 0. Basis after: 20,000 (60,000 minus 40,000).\nS corporation with no C period E&P: the rule is tax free to the extent of stock basis, then capital gain. Tax free 60,000; capital gain 30,000 (90,000 minus 60,000); basis after: 0. There is no dividend because S years never create E&P.\nPartnership: gain only to the extent cash exceeds outside basis. Tax free 60,000; capital gain 30,000; basis after: 0. Nothing is ordinary income.\nB is wrong because an S corporation that was never a C corporation has no E&P and no dividend layer.\nC is wrong because a partnership cash distribution is taxable only to the extent it exceeds outside basis, and then as capital gain.\nD is wrong because a C corporation distribution comes out of E&P first; basis is recovered only after E&P is exhausted.\nCheck: C corporation layers 50,000 plus 40,000 plus 0 = 90,000.",
    rule: "C corporation: E&P dividend, then basis, then gain. S corporation with no E&P and partnership: basis first, then capital gain.",
    trap: "Recovering basis before E&P for a C corporation, or inventing a dividend layer for an S corporation that never had C years."
  },

  {
    id: "MX-07",
    module: "T3 M4",
    entity: "Comparison",
    tree: "p_liq_owner",
    topic: "Owner's basis in property received, liquidating vs nonliquidating, by entity type",
    tags: ["comparison", "liquidation", "distribution", "basis"],
    type: "numeric",
    difficulty: 2,
    stem: "Rosa's outside basis in her partnership interest is 80,000. In complete liquidation of her interest she receives 20,000 of cash and a parcel of land that the partnership carried at a 35,000 adjusted basis and that is worth 70,000. The partnership has no receivables or inventory.\nWhat is Rosa's basis in the land?",
    answer: 60000,
    unit: "$",
    tolerance: 0,
    explanation: "60,000.\nStart with Rosa's outside basis of 80,000. The rule: cash comes out first and reduces outside basis, leaving 60,000 (80,000 minus 20,000). In a liquidating distribution the remaining outside basis must land somewhere, and because other property was received, no loss is allowed; the land absorbs all 60,000 even though the partnership's basis was only 35,000.\nContrast with a nonliquidating distribution of the same assets: the land would take the lesser of the partnership's 35,000 basis or her 60,000 remaining basis, so 35,000, and Rosa would keep 25,000 (60,000 minus 35,000) of outside basis in her continuing interest.\nComparison. C or S corporation shareholder: basis in property received in any distribution, liquidating or not, is its 70,000 FMV, because the corporation (or the shareholders of an S corporation) already recognized the appreciation.\nCheck: 20,000 cash plus 60,000 land = 80,000, so outside basis is zero and Rosa is out.",
    rule: "Liquidating partnership distribution: other property absorbs all remaining outside basis; current distribution: property basis is capped at the partnership's basis; corporate shareholders take FMV.",
    trap: "Using the 35,000 carryover basis (the current distribution rule) or the 70,000 FMV (the corporate rule)."
  },

  {
    id: "MX-08",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Entity-level gain or loss on a liquidating distribution by entity type",
    tags: ["comparison", "liquidation", "entity gain"],
    type: "text",
    difficulty: 1,
    stem: "A business dissolves and distributes all of its assets to its owners. One asset has appreciated and another has declined in value below its adjusted basis.\nFor which type of entity does the entity itself recognize neither the gain nor the loss on the liquidating distribution?",
    answer: "partnership",
    accept: ["partnership or llc", "llc taxed as a partnership", "llc", "a partnership", "partnership / llc"],
    explanation: "Partnership (or an LLC taxed as a partnership).\nThe rule for corporations: in a complete liquidation a C corporation and an S corporation both treat every asset as sold at FMV and recognize gain and loss. The C corporation pays 21 percent on the net result; the S corporation passes both the gain and the loss through to shareholders, who adjust stock basis. A liquidation is the one time a corporation recognizes a loss on distributed property; in a nonliquidating distribution only gain is recognized.\nThe rule for partnerships: a partnership recognizes no gain or loss on distributing property, liquidating or not. The tax consequences happen at the partner level through the partner's basis in the property received, and a partner recognizes a loss only when nothing but cash, receivables and inventory is received.",
    rule: "Corporations recognize gain and loss on liquidating distributions; a partnership recognizes neither.",
    trap: "Applying the nonliquidating no-loss rule to a corporate liquidation, or expecting a partnership to recognize gain on appreciated property."
  },

  {
    id: "MX-09",
    module: "T3 M4",
    entity: "Comparison",
    tree: "s_liq_owner",
    topic: "Owner gain on liquidation after pass-through by entity type",
    tags: ["comparison", "liquidation", "stock basis", "pass-through"],
    type: "numeric",
    difficulty: 3,
    stem: "Kai is the sole shareholder of Birch, an S corporation that has never been a C corporation. His stock basis at the start of the year is 50,000 and Birch has no other income or loss for the year. Birch liquidates by distributing its only asset, land with an adjusted basis of 60,000 and a fair market value of 150,000, to Kai.\nWhat gain does Kai recognize on his stock?",
    answer: 10000,
    unit: "$",
    tolerance: 0,
    explanation: "10,000.\nStep 1, the entity: in a liquidation Birch treats the land as sold at FMV and recognizes 90,000 (150,000 minus 60,000). The S corporation pays no tax; the 90,000 passes through to Kai and raises his stock basis to 140,000 (50,000 plus 90,000).\nStep 2, the shareholder: amount realized is 150,000 (FMV of the land, no liabilities). The rule: capital gain on the stock = amount realized minus adjusted stock basis after the pass-through = 10,000 (150,000 minus 140,000). Kai's basis in the land is 150,000.\nComparison. C corporation: the corporation recognizes the same 90,000 gain and pays 18,900 of tax (90,000 x 21%), and Kai then recognizes 100,000 (150,000 minus 50,000) on his stock with nothing raising his basis: two levels of tax. Partnership: no gain to the entity; Kai would recognize no gain and take the land at his remaining outside basis.\nCheck: Kai's total income is 90,000 pass-through plus 10,000 stock gain = 100,000, the same total appreciation a C shareholder reports, but taxed once instead of twice.",
    rule: "S corporation liquidation: the entity's gain passes through and raises stock basis first; then stock gain = amount realized minus the adjusted basis.",
    trap: "Computing 100,000 (150,000 minus 50,000) by skipping the basis increase, which is the C corporation answer."
  },

  {
    id: "MX-10",
    module: "T3 M4",
    entity: "Comparison",
    tree: "c_liq_owner",
    topic: "Section 332 parent liquidation",
    tags: ["comparison", "liquidation", "section 332", "carryover basis"],
    type: "mcq",
    difficulty: 1,
    stem: "Pine Corp owns 85 percent of the voting power and value of Sapling Corp; unrelated individuals own the other 15 percent. Sapling adopts a plan of complete liquidation and distributes all of its assets.\nWhich statement is correct?",
    choices: [
      "Sapling recognizes gain and loss on all assets, and Pine recognizes gain on the difference between the FMV received and its stock basis",
      "Pine recognizes no gain or loss but takes a FMV basis in the assets, and Sapling's net operating losses disappear",
      "The liquidation is tax free to everyone, including the 15 percent minority shareholders, because Pine meets the 80 percent test",
      "Neither Sapling nor Pine recognizes gain or loss on the assets going to Pine, Pine takes a carryover basis in those assets, and Sapling's tax attributes carry over to Pine"
    ],
    answer: 3,
    explanation: "D. No gain or loss to parent or subsidiary on assets going to Pine, carryover basis, attributes carry over.\nThe rule: when a parent corporation owning at least 80 percent of vote and value liquidates a subsidiary, Section 332 applies to the parent and Section 337 to the subsidiary. The parent recognizes nothing, its basis in the subsidiary stock disappears, it takes the subsidiary's basis in each asset, and it inherits the subsidiary's E&P, net operating losses and accounting methods. The subsidiary recognizes no gain or loss on assets distributed to the parent; on assets distributed to the 15 percent minority shareholders it recognizes gain but not loss, and those shareholders have a normal taxable liquidation.\nA is wrong because the 80 percent parent rule turns off recognition for both corporations.\nB is wrong because the parent takes a carryover basis, not FMV, and the attributes survive.\nC is wrong because the minority shareholders get no protection; they recognize gain or loss on their stock under the normal rules.\nThis rule has no counterpart for an S corporation (a corporation cannot own S stock) or for a partnership (there is no entity-level gain to turn off).",
    rule: "Section 332: an 80 percent corporate parent liquidates a subsidiary tax free with carryover basis and inherited attributes; minority shareholders are taxed normally.",
    trap: "Extending Section 332 protection to minority shareholders or giving the parent a FMV basis."
  },

  {
    id: "MX-11",
    module: "T3 M4",
    entity: "Comparison",
    tree: "c_liq_entity",
    topic: "Liquidation loss limits for related parties and disqualified property",
    tags: ["comparison", "liquidation", "loss limits", "related party"],
    type: "mcq",
    difficulty: 2,
    stem: "Granite Corp liquidates. It distributes land with an adjusted basis of 200,000 and a fair market value of 140,000 to Wes, who owns 60 percent of the stock, and distributes cash to the other shareholders. Wes contributed the land to Granite in a Section 351 exchange three years ago, when it was worth 190,000.\nWhat loss may Granite recognize on the land?",
    choices: [
      "60,000, because a liquidating corporation recognizes gains and losses as if the assets were sold",
      "Zero, because the land is disqualified property distributed to a related party in a distribution that is not pro rata",
      "50,000, the decline in value since the contribution",
      "Zero, because corporations never recognize losses on distributed property"
    ],
    answer: 1,
    explanation: "B. Zero.\nThe general rule in a liquidation is that the corporation recognizes gain and loss as if it sold each asset at FMV, which would be a 60,000 loss (140,000 FMV minus 200,000 basis). But Section 336(d) disallows a loss on property distributed to a related party (a more than 50 percent shareholder, with attribution) if either the distribution is not pro rata or the property is disqualified property, meaning property received in a Section 351 exchange or as a capital contribution within the last five years. Wes owns 60 percent, he alone receives the land, and Granite acquired it in a Section 351 exchange three years ago, so both limits apply and the entire 60,000 loss is disallowed.\nA separate rule disallows the built-in loss on property contributed within two years as part of a plan to create the loss; it is not needed here because the related party rule already disallows everything.\nA is wrong because the as-if-sold rule is overridden by the related party limit.\nC is wrong because the two year built-in loss rule, which would allow only the post-contribution decline, is not the operative rule here, and it would not apply after two years anyway.\nD is wrong as a reason: corporations do recognize losses in liquidations; it is the nonliquidating rule that never allows a loss.\nAn S corporation is subject to the same Section 336 limits at the entity level; a partnership recognizes no loss on any distribution in the first place.",
    rule: "Liquidation loss disallowed on distributions to a more than 50 percent shareholder that are not pro rata or involve property contributed within 5 years.",
    trap: "Allowing the full liquidation loss because liquidations normally recognize losses."
  },

  {
    id: "MX-12",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Self-employment tax by entity and owner type",
    tags: ["comparison", "self-employment tax", "guaranteed payments"],
    type: "mcq",
    difficulty: 2,
    stem: "Four owners each receive 80,000 of business income for the year.\nJun is a general partner who works full time in the partnership; 20,000 of her 80,000 is a guaranteed payment for services and 60,000 is her distributive share of ordinary income.\nKiera is a limited partner who performs no services; all 80,000 is her distributive share.\nLuis owns 100 percent of an S corporation that paid him 50,000 of reasonable wages and passed through 30,000 of ordinary income.\nMei owns all of a C corporation that paid her 80,000 of wages.\nWhich owner has the largest amount of income subject to self-employment tax?",
    choices: [
      "Jun, 80,000",
      "Kiera, 80,000",
      "Luis, 30,000",
      "Mei, 80,000"
    ],
    answer: 0,
    explanation: "A. Jun, 80,000.\nThe rule: a general partner pays self-employment tax on her distributive share of ordinary business income plus guaranteed payments for services, so Jun's self-employment income is 80,000 (60,000 plus 20,000). A limited partner pays self-employment tax only on guaranteed payments for services, so Kiera has 0. An S corporation shareholder never pays self-employment tax on the pass-through share; Luis's 50,000 of wages bear FICA through payroll and his 30,000 pass-through bears neither, so his self-employment income is 0. Mei's 80,000 of C corporation wages are subject to FICA withholding, not self-employment tax.\nB is wrong because a limited partner's distributive share is not self-employment income.\nC is wrong because S corporation ordinary income is not self-employment income regardless of how active the shareholder is.\nD is wrong because wages are subject to FICA, not self-employment tax, even for a 100 percent owner.\nCheck: Jun 80,000; Kiera 0; Luis 0; Mei 0.",
    rule: "Self-employment tax hits a general partner's share plus guaranteed payments, a limited partner's guaranteed payments for services only, and never an S corporation pass-through.",
    trap: "Treating S corporation pass-through income or a limited partner's distributive share as self-employment income."
  },

  {
    id: "MX-13",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Net investment income tax by entity and participation",
    tags: ["comparison", "NIIT", "passive", "dividends"],
    type: "numeric",
    difficulty: 2,
    stem: "Ellis, single, has 2026 adjusted gross income of 260,000, made up of 70,000 of wages, 30,000 of dividends from a C corporation he owns stock in, 20,000 of ordinary income passed through from an S corporation in which he does not materially participate, and 140,000 of ordinary income passed through from a partnership in which he materially participates.\nWhat is Ellis's net investment income tax?",
    answer: 1900,
    unit: "$",
    tolerance: 0,
    explanation: "1,900.\nThe rule: the 3.8 percent tax applies to the lesser of net investment income or the excess of modified AGI over the threshold, 200,000 for a single filer (250,000 joint).\nNet investment income is 50,000: the 30,000 of C corporation dividends (always investment income) plus the 20,000 of S corporation income from an activity in which Ellis does not materially participate (passive business income is investment income). The 140,000 from the partnership he materially participates in is active business income and is excluded, and wages are never investment income.\nExcess AGI is 60,000 (260,000 minus 200,000). The lesser of 50,000 and 60,000 is 50,000.\nTax: 1,900 (50,000 x 3.8%).\nCheck: 30,000 plus 20,000 = 50,000, under the 60,000 excess, so the full 50,000 is taxed.",
    rule: "NIIT = 3.8 percent of the lesser of net investment income or AGI over 200,000 single or 250,000 joint; dividends and passive pass-through income count, active pass-through income and wages do not.",
    trap: "Taxing the active partnership income, or using the 60,000 excess AGI instead of the lower 50,000 of net investment income."
  },

  {
    id: "MX-14",
    module: "T3 M4",
    entity: "Comparison",
    tree: "c_liq_entity",
    topic: "Conversions between entity types",
    tags: ["comparison", "conversion", "liquidation"],
    type: "text",
    difficulty: 2,
    stem: "Lumen Corp, a C corporation with appreciated assets, wants to become an LLC taxed as a partnership so that future income is taxed only once.\nFor federal tax purposes, how is the conversion of the C corporation into the LLC treated?",
    answer: "liquidation",
    accept: ["complete liquidation", "taxable liquidation", "corporate liquidation", "a liquidation of the corporation", "liquidation followed by a contribution"],
    explanation: "A complete liquidation of the corporation, followed by a tax free contribution of the assets to the new partnership.\nThe rule: a corporation cannot move its assets into a partnership-taxed entity without a taxable event. The conversion is treated as if Lumen distributed all of its assets to the shareholders in liquidation and the shareholders then contributed them to the LLC. The liquidation step is taxed at both levels: Lumen recognizes gain and loss as if it sold the assets at FMV and pays 21 percent, and each shareholder recognizes capital gain or loss equal to FMV received minus stock basis. The contribution step is tax free under Section 721 and the LLC takes a FMV basis in the assets (the shareholders' basis after the liquidation).\nThe reverse directions are cheaper: a partnership or sole proprietorship converting to a corporation uses Section 351 and is usually tax free, a C corporation becoming an S corporation is just an election (with built-in gains tax exposure for five years), and a partnership changing legal form into an LLC that stays a partnership for tax is not a taxable event.",
    rule: "Corporation to partnership or LLC = taxable liquidation at both levels; partnership to corporation = Section 351; C to S = election with built-in gains tax.",
    trap: "Treating the conversion as a tax free reorganization or a mere change in legal form."
  },

  {
    id: "MX-15",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Check-the-box default classification",
    tags: ["comparison", "check-the-box", "LLC"],
    type: "text",
    difficulty: 1,
    stem: "Two unrelated individuals form a domestic LLC and make no entity classification election.\nFor federal income tax purposes, how is the LLC classified by default?",
    answer: "partnership",
    accept: ["a partnership", "partnership taxation", "taxed as a partnership", "pass-through partnership"],
    explanation: "Partnership.\nThe rule under the check-the-box regulations: a domestic eligible entity with two or more owners is a partnership by default, and a domestic eligible entity with one owner is disregarded (a sole proprietorship or a branch of its owner). Either can elect to be taxed as a corporation, and a corporation that meets the eligibility rules (100 or fewer shareholders who are individuals, estates or eligible trusts, all U.S. citizens or residents, one class of stock) can then elect S status. A nonresident alien owner would block the S election but not the partnership or C corporation options. Entities incorporated under state law are always corporations and cannot use the default rules.",
    rule: "Multi-member domestic LLC defaults to partnership; single-member defaults to disregarded; either can elect corporate status.",
    trap: "Assuming an LLC is automatically a corporation or automatically an S corporation."
  },

  {
    id: "MX-16",
    module: "T3 M4",
    entity: "Comparison",
    tree: null,
    topic: "Choosing an entity for start-up losses, debt, allocations and fringe benefits",
    tags: ["comparison", "entity choice", "losses", "fringe benefits", "special allocations"],
    type: "mcq",
    difficulty: 3,
    stem: "Ava and Ben are starting a business together. Each will invest 100,000 of cash, the business will borrow 600,000 from a bank on a loan that is recourse to the owners personally, and the business expects to lose 350,000 in each of its first two years before becoming profitable. Both will work full time in the business and both have large amounts of other business income.\nThey want to deduct the start-up losses currently, want Ava, who is contributing more time, to be allocated 70 percent of the losses while profits are split 50/50, and want to receive tax free health insurance from the business.\nWhich entity best fits these goals, and which goal must give way?",
    choices: [
      "C corporation; the current loss deduction gives way, because losses stay inside the corporation as a net operating loss",
      "S corporation; nothing gives way, because losses pass through and the shareholders can allocate them by agreement",
      "Partnership or LLC taxed as a partnership; the tax free health insurance gives way, because partners are not employees",
      "Partnership or LLC taxed as a partnership; the 70/30 loss allocation gives way, because losses must follow ownership"
    ],
    answer: 2,
    explanation: "C. Partnership or LLC taxed as a partnership; the tax free health insurance gives way.\nLosses: a C corporation keeps its losses as its own net operating loss carryforward (limited to 80 percent of future taxable income), so the owners deduct nothing now. S corporation and partnership losses pass through, but only up to the owner's basis. Each S shareholder's basis is 100,000 (cash) plus nothing for the bank debt, so a share of a 350,000 loss would be limited to 100,000 in year one with the rest suspended. Each partner's basis is 100,000 plus a 300,000 share of the 600,000 recourse debt (shared equally) = 400,000, enough to absorb both years of losses, and the recourse debt is also at-risk. Because they materially participate, the passive loss rule does not apply, and their other business income keeps the excess business loss limit (256,000 single, 512,000 joint for 2026) from biting.\nAllocations: a partnership may specially allocate losses 70/30 with profits 50/50 if the allocation has substantial economic effect; an S corporation must allocate strictly per share, per day.\nFringe benefits: partners are not employees, so health insurance paid for a partner is a guaranteed payment and is taxable to the partner (deductible by the partner above the line as self-employed health insurance, but not excludable). A more than 2 percent S shareholder is treated the same way. Only a C corporation shareholder-employee can exclude employer paid health insurance. So the partnership delivers the losses and the allocation but not the tax free benefit.\nA is wrong because a C corporation traps the losses, which defeats the most valuable goal.\nB is wrong because an S corporation cannot specially allocate and gives no basis for the bank debt.\nD is wrong because partnership allocations need not follow ownership if they have substantial economic effect.\nAlso compare: the 20 percent QBI deduction is available to S corporation and partnership owners but not to C corporation shareholders, while the Section 1202 gain exclusion is available only for C corporation stock.",
    rule: "Partnerships give basis for entity debt and allow special allocations; only a C corporation gives owner-employees tax free fringe benefits.",
    trap: "Letting an S corporation shareholder deduct losses against bank debt basis or allocate losses away from share ownership."
  },

  // ===================== PART B: HIGH-YIELD TRAPS =====================

  // ---- T1 M2 Loss limitations ----
  {
    id: "MX-17",
    module: "T1 M2",
    entity: "Individual",
    tree: null,
    topic: "Order of the loss limits: basis, at-risk, passive",
    tags: ["loss limits", "at-risk", "passive", "basis"],
    type: "numeric",
    difficulty: 3,
    stem: "Omar is a limited partner who does not materially participate in Delta LP. His share of Delta's 2026 ordinary loss is 90,000. At year end, before the loss, his tax basis in the interest is 70,000, of which 20,000 comes from his share of nonrecourse debt that is not qualified nonrecourse financing. He also has 30,000 of passive income from an unrelated rental activity and 200,000 of wages.\nWhat amount of the Delta loss is suspended under the at-risk rules?",
    answer: 20000,
    unit: "$",
    tolerance: 0,
    explanation: "20,000.\nThe rule: a pass-through loss must clear the limits in order: tax basis, then at-risk, then passive activity, then excess business loss. A loss stopped at one hurdle never reaches the next.\nTax basis hurdle: loss 90,000 against basis 70,000; 70,000 passes and 20,000 (90,000 minus 70,000) is suspended for lack of basis.\nAt-risk hurdle: the at-risk amount is 50,000 (70,000 basis minus the 20,000 of plain nonrecourse debt, which Omar is not personally liable for). Of the 70,000 that passed basis, 50,000 passes and 20,000 (70,000 minus 50,000) is suspended under the at-risk rules.\nPassive hurdle: Omar is a limited partner who does not materially participate, so the 50,000 is a passive loss usable only against passive income. 30,000 is deducted against the rental income and 20,000 (50,000 minus 30,000) is a suspended passive loss. Wages are active income and cannot absorb it.\nExcess business loss: the 30,000 deducted is far below the 256,000 single threshold, so nothing more is limited.\nCheck: 30,000 deducted plus 20,000 basis plus 20,000 at-risk plus 20,000 passive = 90,000.",
    rule: "Apply tax basis, then at-risk (exclude plain nonrecourse debt), then passive, then excess business loss; track each suspended amount separately.",
    trap: "Running the passive test first (30,000 allowed, 60,000 suspended) or treating the nonrecourse debt as at-risk."
  },

  {
    id: "MX-18",
    module: "T1 M2",
    entity: "Individual",
    tree: null,
    topic: "At-risk amount vs tax basis with nonrecourse debt",
    tags: ["at-risk", "basis", "nonrecourse debt"],
    type: "mcq",
    difficulty: 2,
    stem: "Priya contributes 40,000 of cash for a general partnership interest. Her share of the partnership's recourse bank loan is 15,000 and her share of its nonrecourse equipment loan (not qualified nonrecourse financing) is 25,000. Her share of the first year loss is 65,000.\nIgnoring the passive loss rules, what is the most Priya may deduct in year one?",
    choices: [
      "40,000",
      "65,000",
      "80,000",
      "55,000"
    ],
    answer: 3,
    explanation: "D. 55,000.\nTax basis is 80,000 (40,000 cash plus 15,000 recourse share plus 25,000 nonrecourse share), so the full 65,000 loss clears the basis hurdle.\nThe at-risk rule: the at-risk amount includes cash, the basis of property contributed, recourse debt the partner is liable for, and qualified nonrecourse real estate financing, but not ordinary nonrecourse debt. Priya's at-risk amount is 55,000 (40,000 plus 15,000; the 25,000 nonrecourse share is excluded). Of the 65,000 loss, 55,000 is deductible and 10,000 (65,000 minus 55,000) is suspended under the at-risk rules until she has more at risk.\nA is wrong because recourse debt she bears the risk of loss on does count as at-risk.\nB is wrong because the at-risk hurdle, not basis, is the binding limit here.\nC is wrong because 80,000 is tax basis, which includes nonrecourse debt the at-risk rule excludes.\nCheck: 55,000 deducted plus 10,000 at-risk suspended = 65,000.",
    rule: "At-risk = cash plus property basis plus recourse debt plus qualified nonrecourse real estate debt; plain nonrecourse debt is in basis but not at-risk.",
    trap: "Counting nonrecourse debt as at-risk, or forgetting that recourse debt counts."
  },

  {
    id: "MX-19",
    module: "T1 M2",
    entity: "Individual",
    tree: null,
    topic: "Allocating a net suspended passive loss among loss activities",
    tags: ["passive", "suspended loss", "allocation"],
    type: "mcq",
    difficulty: 2,
    stem: "Hana owns three passive activities. For 2026, Activity X produced a 36,000 loss, Activity Y produced a 24,000 loss, and Activity Z produced 15,000 of income. She has no other passive income and does not qualify for the rental real estate allowance.\nHow much suspended passive loss is carried forward for Activity X?",
    choices: [
      "27,000",
      "36,000",
      "21,000",
      "22,500"
    ],
    answer: 0,
    explanation: "A. 27,000.\nThe rule: passive losses are first netted against passive income from all passive activities. Total losses are 60,000 (36,000 plus 24,000); income is 15,000; the net passive loss of 45,000 (60,000 minus 15,000) is suspended because there is no other passive income.\nThe suspended loss is allocated only among the loss activities in proportion to their losses: X gets 60 percent (36,000 divided by 60,000) and Y gets 40 percent (24,000 divided by 60,000). X's suspended loss is 27,000 (45,000 x 60%) and Y's is 18,000 (45,000 x 40%). Z receives none because its income was used in the netting.\nB is wrong because 15,000 of income absorbed part of the losses.\nC is wrong because the income is spread pro rata, not assigned entirely to one activity.\nD is wrong because the allocation follows relative losses, not an equal split.\nCheck: 27,000 plus 18,000 = 45,000.",
    rule: "Net all passive income and loss, then allocate the suspended net loss to the loss activities pro rata by their losses.",
    trap: "Carrying each activity's full loss forward, or splitting the suspended amount equally."
  },

  {
    id: "MX-20",
    module: "T1 M2",
    entity: "Individual",
    tree: null,
    topic: "Complete disposition of a passive activity releases suspended losses",
    tags: ["passive", "disposition", "suspended loss"],
    type: "mcq",
    difficulty: 2,
    stem: "Felix sells his entire interest in a passive limited partnership to an unrelated buyer in a fully taxable sale, recognizing a 12,000 gain. The partnership allocated him a 5,000 loss for the current year, and he has 40,000 of suspended passive losses from prior years for that activity. His only other income is 150,000 of wages.\nWhat is the tax effect of the current and suspended losses in the year of sale?",
    choices: [
      "The 45,000 of losses offset the 12,000 gain, and the remaining 33,000 is deductible against his wages",
      "The losses offset the 12,000 gain and the remaining 33,000 carries forward until Felix has passive income",
      "Only 3,000 of the losses may be deducted against wages, with the rest carried forward",
      "The 40,000 of suspended losses are added to his basis in the interest and reduce the gain, but the 5,000 current loss carries forward"
    ],
    answer: 0,
    explanation: "A. All 45,000 is deductible: 12,000 against the gain and 33,000 against wages.\nThe rule: when a taxpayer disposes of the entire interest in a passive activity in a fully taxable transaction with an unrelated party, the current year passive loss and all suspended passive losses from that activity are released and may offset income of any kind, active and portfolio included.\nLosses released: 45,000 (5,000 current plus 40,000 suspended). They first offset the 12,000 gain on the sale; the remaining 33,000 (45,000 minus 12,000) offsets the 150,000 of wages.\nB is wrong because the release rule frees the losses from the passive income requirement.\nC is wrong because the 3,000 limit is a capital loss rule; these are ordinary passive losses, not capital losses.\nD is wrong because adding suspended losses to basis is the treatment for a gift of the activity, not a taxable sale.\nCheck: 12,000 gain minus 45,000 losses = a 33,000 net reduction in Felix's other income.",
    rule: "A fully taxable disposition of the entire interest to an unrelated party releases current and suspended passive losses against any income.",
    trap: "Keeping the released losses passive, or applying the 3,000 capital loss limit."
  },

  {
    id: "MX-21",
    module: "T1 M2",
    entity: "Individual",
    tree: null,
    topic: "Rental real estate 25,000 allowance phase-out",
    tags: ["passive", "rental", "phase-out", "active participation"],
    type: "numeric",
    difficulty: 2,
    stem: "Grace actively participates in a rental duplex she owns outright and is not a real estate professional. In 2026 the duplex produced a 30,000 loss. Her modified AGI before the rental loss is 128,000, consisting of wages and interest. She has no other passive activities.\nHow much of the rental loss may Grace deduct against her other income in 2026?",
    answer: 11000,
    unit: "$",
    tolerance: 0,
    explanation: "11,000.\nThe rule: an individual who actively participates in rental real estate and owns at least 10 percent may deduct up to 25,000 of rental losses against nonpassive income, but the allowance is reduced by 50 percent of modified AGI over 100,000 and is gone at 150,000.\nExcess AGI is 28,000 (128,000 minus 100,000). The reduction is 14,000 (28,000 x 50%). The allowance left is 11,000 (25,000 minus 14,000).\nGrace deducts 11,000 of the 30,000 loss against her wages and interest. The remaining 19,000 (30,000 minus 11,000) is a suspended passive loss carried forward to future passive income, a future year with a lower AGI, or a complete disposition of the duplex.\nCheck: 11,000 deducted plus 19,000 suspended = 30,000.",
    rule: "Rental allowance = 25,000 minus 50 percent of modified AGI over 100,000; zero at 150,000; requires active participation and 10 percent ownership.",
    trap: "Deducting the full 25,000 without the phase-out, or treating the 28,000 excess as the reduction instead of half of it."
  },

  // ---- T4 M1 Nontaxable dispositions ----
  {
    id: "MX-22",
    module: "T4 M1",
    entity: "Property",
    tree: null,
    topic: "Like-kind exchange with net debt relief as boot",
    tags: ["like-kind", "boot", "liabilities", "basis"],
    type: "numeric",
    difficulty: 3,
    stem: "Nora exchanges an office building used in her business for an apartment building she will hold for investment. Her office building cost 220,000, has 70,000 of accumulated depreciation, is worth 300,000, and is subject to a 120,000 mortgage that the other party assumes. The apartment building is worth 230,000 and Nora takes it subject to its 50,000 mortgage. No cash changes hands.\nWhat gain does Nora recognize?",
    answer: 70000,
    unit: "$",
    tolerance: 0,
    explanation: "70,000.\nAdjusted basis of the building given up is 150,000 (220,000 cost minus 70,000 depreciation).\nAmount realized is 350,000 (230,000 FMV of the apartment building plus 120,000 of debt relief). Realized gain is 150,000 (350,000 minus 150,000 basis minus 50,000 of debt assumed, which Nora effectively pays). Check from the other side: 300,000 FMV given up minus 150,000 basis = 150,000.\nThe boot rule: debt relief is boot received and debt assumed is boot paid, and the two are netted. Net boot received is 70,000 (120,000 relieved minus 50,000 assumed). Recognized gain is the lesser of the 150,000 realized gain or the 70,000 boot, so 70,000. Deferred gain is 80,000 (150,000 minus 70,000).\nBasis in the apartment building, method one: 150,000 (230,000 FMV minus 80,000 deferred gain). Method two: 150,000 (150,000 old basis plus 70,000 gain recognized plus 50,000 debt assumed minus 120,000 debt relieved).\nCheck: both basis methods give 150,000, so the 80,000 deferral is preserved.",
    rule: "Net debt relief is boot; recognized gain = lesser of realized gain or net boot; new basis = FMV received minus deferred gain.",
    trap: "Treating the full 120,000 of debt relief as boot without netting the 50,000 assumed, or recognizing the whole 150,000."
  },

  {
    id: "MX-23",
    module: "T4 M1",
    entity: "Property",
    tree: null,
    topic: "Like-kind exchange with a realized loss and boot",
    tags: ["like-kind", "loss", "boot", "basis"],
    type: "mcq",
    difficulty: 2,
    stem: "Derek exchanges investment land with an adjusted basis of 90,000 and a fair market value of 75,000 for other investment land worth 60,000 plus 15,000 of cash.\nWhat are Derek's recognized loss and his basis in the new land?",
    choices: [
      "15,000 recognized loss; basis 60,000",
      "No recognized loss; basis 60,000",
      "No recognized loss; basis 75,000",
      "No recognized loss; basis 90,000"
    ],
    answer: 2,
    explanation: "C. No loss recognized; basis in the new land 75,000.\nRealized loss is 15,000 (75,000 amount realized, being 60,000 land plus 15,000 cash, minus 90,000 basis).\nThe rule: in a qualifying like-kind exchange, boot received can trigger recognized gain but never a loss. The realized loss is deferred into the new land.\nBasis in the new land, method one: 75,000 (60,000 FMV plus 15,000 deferred loss). Method two: 75,000 (90,000 old basis minus 15,000 cash received plus 0 gain recognized).\nA is wrong because losses are never recognized in a like-kind exchange, even when boot is received.\nB is wrong because a FMV basis would erase the deferred loss.\nD is wrong because the cash received must reduce the carryover basis.\nCheck: if Derek sells the new land tomorrow for 60,000, he recognizes the 15,000 loss (60,000 minus 75,000) that was deferred.",
    rule: "Like-kind: boot triggers gain, never loss; new basis = FMV received plus deferred loss (or old basis minus cash received).",
    trap: "Recognizing a loss because cash was received."
  },

  {
    id: "MX-24",
    module: "T4 M1",
    entity: "Property",
    tree: null,
    topic: "Involuntary conversion gain and replacement basis",
    tags: ["involuntary conversion", "deferral", "replacement period"],
    type: "mcq",
    difficulty: 3,
    stem: "A fire destroyed Walden Inc.'s warehouse in Year 1. The warehouse cost 350,000 and had 150,000 of accumulated depreciation. Walden received 500,000 of insurance proceeds in Year 1 and in Year 2 bought a replacement warehouse for 460,000. Walden elects to defer as much gain as possible.\nWhat gain does Walden recognize, and what is its basis in the new warehouse?",
    choices: [
      "Gain 300,000; basis 460,000",
      "Gain 40,000; basis 420,000",
      "Gain 0; basis 160,000",
      "Gain 40,000; basis 200,000"
    ],
    answer: 3,
    explanation: "D. Recognized gain 40,000; basis 200,000.\nAdjusted basis of the old warehouse is 200,000 (350,000 minus 150,000). Realized gain is 300,000 (500,000 proceeds minus 200,000).\nThe rule: gain is recognized only to the extent the proceeds are not reinvested in qualifying replacement property within the replacement period. Proceeds not reinvested are 40,000 (500,000 minus 460,000). Recognized gain is the lesser of the 300,000 realized gain or the 40,000 unreinvested, so 40,000. Deferred gain is 260,000 (300,000 minus 40,000).\nBasis in the new warehouse: 200,000 (460,000 cost minus 260,000 deferred gain).\nTiming: the replacement period for a destroyed or stolen asset runs two years after the close of the year the gain is realized, so through December 31 of Year 3; condemned business or investment real estate gets three years. Year 2 qualifies.\nA is wrong because the election defers the reinvested portion.\nB is wrong because the basis is reduced by the deferred gain, not the recognized gain.\nC is wrong because 40,000 of proceeds was not reinvested.\nCheck: new basis 200,000 plus deferred gain 260,000 = 460,000 cost.",
    rule: "Involuntary conversion: recognized gain = lesser of realized gain or proceeds not reinvested; replacement basis = cost minus deferred gain; 2 years, or 3 for condemned business real estate.",
    trap: "Subtracting the recognized gain from the replacement cost, or forgetting the unreinvested 40,000."
  },

  {
    id: "MX-25",
    module: "T4 M1",
    entity: "Property",
    tree: null,
    topic: "Related-party installment sale and resale",
    tags: ["installment sale", "related party", "resale"],
    type: "mcq",
    difficulty: 2,
    stem: "In Year 1 Carla sold land with a 50,000 basis to her daughter Zoe for 200,000 under an installment contract: 20,000 down in Year 1 and 180,000 due in Year 4, with adequate stated interest. In Year 2, before paying anything more to Carla, Zoe sold the land to an unrelated buyer for 210,000 cash.\nWhat is the effect on Carla?",
    choices: [
      "Carla is treated as receiving 180,000 in Year 2 and recognizes the remaining 135,000 of installment gain in Year 2",
      "No effect in Year 2; Carla reports the remaining 135,000 of gain when Zoe pays the 180,000 in Year 4",
      "Carla recognizes Zoe's 10,000 gain on the resale in Year 2",
      "The installment method is retroactively denied and Carla amends Year 1 to report the full 150,000 gain"
    ],
    answer: 0,
    explanation: "A. Carla is treated as receiving 180,000 in Year 2 and recognizes 135,000 of gain that year.\nGross profit is 150,000 (200,000 price minus 50,000 basis); the gross profit percentage is 75 percent (150,000 divided by 200,000). Year 1 gain is 15,000 (20,000 down payment x 75%).\nThe related party rule: if the related buyer resells the property within two years, before the seller has been paid in full, the original seller is treated as receiving the resale proceeds at that time, limited to the original contract price and reduced by payments already received. Deemed payment in Year 2 is 180,000 (the lesser of 210,000 resale proceeds or 200,000 contract price, minus 20,000 already received). Year 2 gain is 135,000 (180,000 x 75%). When Zoe actually pays the 180,000 in Year 4, Carla reports no further gain.\nZoe's own gain is 10,000 (210,000 minus her 200,000 cost) and belongs to her.\nB is wrong because the resale accelerates Carla's deferral.\nC is wrong because Zoe's gain is Zoe's, not Carla's.\nD is wrong because the installment method is not denied for land; the acceleration rule applies instead. Installment reporting is denied for depreciable property sold to a related party, not for land.\nCheck: 15,000 plus 135,000 = 150,000 total gain.",
    rule: "Related buyer resells within 2 years before paying in full: the seller is treated as receiving the resale proceeds then, capped at the contract price less payments received.",
    trap: "Letting the seller keep deferring until the related buyer actually pays."
  },

  {
    id: "MX-26",
    module: "T4 M1",
    entity: "Property",
    tree: null,
    topic: "Partial Section 121 exclusion",
    tags: ["principal residence", "section 121", "partial exclusion"],
    type: "numeric",
    difficulty: 2,
    stem: "Dev, who is single, bought a home and lived in it as his principal residence for 15 months before his employer transferred him to an office 400 miles away. He sold the home at a 190,000 gain. He has never used the home sale exclusion before.\nWhat gain does Dev recognize?",
    answer: 33750,
    unit: "$",
    tolerance: 0,
    explanation: "33,750.\nThe rule: the full 250,000 single exclusion (500,000 joint) requires two years of ownership and use in the five years before the sale. When the sale is caused by a change in place of employment, health, or unforeseen circumstances, a partial exclusion is allowed equal to the full exclusion multiplied by the qualifying months divided by 24.\nPartial exclusion: 156,250 (250,000 x 15 divided by 24).\nRecognized gain: 33,750 (190,000 realized gain minus 156,250 excluded).\nThe fraction is applied to the 250,000 exclusion, not to the gain.\nCheck: 156,250 excluded plus 33,750 recognized = 190,000.",
    rule: "Partial Section 121 exclusion = 250,000 (or 500,000) x months of ownership and use divided by 24, for job, health or unforeseen circumstance sales.",
    trap: "Applying the 15/24 fraction to the gain (118,750 excluded) instead of to the exclusion amount, or allowing no exclusion at all."
  },

  {
    id: "MX-27",
    module: "T4 M1",
    entity: "Property",
    tree: null,
    topic: "Installment sale with depreciation recapture",
    tags: ["installment sale", "recapture", "section 1245"],
    type: "numeric",
    difficulty: 3,
    stem: "Pilar sold business equipment on an installment basis in 2026. The equipment cost 100,000 and had 40,000 of accumulated depreciation. The selling price was 150,000: 30,000 of cash at closing and a 120,000 note payable in three annual installments of 40,000 beginning in 2027, plus adequate stated interest.\nHow much gain does Pilar recognize in 2026?",
    answer: 50000,
    unit: "$",
    tolerance: 0,
    explanation: "50,000.\nAdjusted basis is 60,000 (100,000 minus 40,000). Total gain is 90,000 (150,000 minus 60,000).\nThe recapture rule: Section 1245 depreciation recapture, 40,000 (the lesser of the 90,000 gain or the 40,000 depreciation), is ordinary income recognized in full in the year of sale no matter how little cash is collected. It cannot be deferred under the installment method.\nThe installment rule applies to the rest: eligible gain is 50,000 (90,000 minus 40,000 recapture), and the gross profit percentage is one third (50,000 divided by 150,000). 2026 installment gain is 10,000 (30,000 cash x one third), Section 1231 gain. Interest is reported separately as received.\n2026 recognized gain: 50,000 (40,000 ordinary recapture plus 10,000 Section 1231).\nEach 40,000 payment in 2027 through 2029 will produce 13,333 of Section 1231 gain (40,000 x one third), rounded.\nCheck: 10,000 plus 3 x 13,333 = 50,000 of installment gain, plus 40,000 recapture = 90,000 total.",
    rule: "Recapture is recognized in full in the year of sale; only the remaining gain is reported by the gross profit percentage as payments arrive.",
    trap: "Spreading the recapture over the installments (30,000 x 60% = 18,000) or ignoring recapture altogether."
  },

  // ---- T4 M2 Business-use property ----
  {
    id: "MX-28",
    module: "T4 M2",
    entity: "Property",
    tree: null,
    topic: "Section 1245 recapture with the excess as Section 1231 gain",
    tags: ["section 1245", "recapture", "section 1231"],
    type: "mcq",
    difficulty: 2,
    stem: "Ruiz Co. sold a machine used in its business for 95,000. The machine cost 80,000 three years ago and 50,000 of depreciation had been taken.\nHow is Ruiz's gain characterized?",
    choices: [
      "65,000 Section 1231 gain",
      "65,000 ordinary income",
      "15,000 ordinary income and 50,000 Section 1231 gain",
      "50,000 ordinary income and 15,000 Section 1231 gain"
    ],
    answer: 3,
    explanation: "D. 50,000 ordinary income and 15,000 Section 1231 gain.\nAdjusted basis is 30,000 (80,000 minus 50,000). Gain is 65,000 (95,000 minus 30,000).\nThe Section 1245 rule: gain on depreciable personal property is ordinary income to the extent of the lesser of the gain or the depreciation taken. The lesser of 65,000 and 50,000 is 50,000 of ordinary income. The excess of 15,000 (65,000 minus 50,000) is the amount by which the sale price exceeds original cost (95,000 minus 80,000) and is Section 1231 gain, long-term capital gain if the year's 1231 netting and five year lookback leave it that way.\nA is wrong because depreciation taken is recaptured first.\nB is wrong because recapture is capped at the depreciation taken; the gain above original cost is not recaptured.\nC is wrong because it reverses the two amounts.\nCheck: 50,000 plus 15,000 = 65,000.",
    rule: "Section 1245: ordinary income = lesser of gain or depreciation taken; the excess is Section 1231 gain.",
    trap: "Recapturing more than the depreciation taken, or none of it."
  },

  {
    id: "MX-29",
    module: "T4 M2",
    entity: "Property",
    tree: null,
    topic: "Unrecaptured Section 1250 gain for an individual",
    tags: ["section 1250", "25 percent", "real property"],
    type: "numeric",
    difficulty: 2,
    stem: "Sofia, an individual, sold an office building she had rented out for several years. The building cost 600,000, straight-line depreciation of 180,000 had been taken, and it sold for 700,000. She has no other Section 1231 transactions this year or in the prior five years and is in the 35 percent ordinary bracket.\nHow much of Sofia's gain is unrecaptured Section 1250 gain taxed at a maximum rate of 25 percent?",
    answer: 180000,
    unit: "$",
    tolerance: 0,
    explanation: "180,000.\nAdjusted basis is 420,000 (600,000 minus 180,000). Gain is 280,000 (700,000 minus 420,000).\nThe Section 1250 rule for individuals: because the depreciation was straight-line, there is no Section 1250 ordinary recapture (that applies only to depreciation above straight-line). Instead the gain attributable to depreciation, the lesser of the 280,000 gain or the 180,000 of depreciation, is unrecaptured Section 1250 gain taxed at a maximum 25 percent rate: 180,000.\nThe remaining 100,000 (280,000 minus 180,000) is Section 1231 gain that, with no lookback losses, is long-term capital gain at the 0, 15 or 20 percent rate.\nContrast: a C corporation would instead report 36,000 (180,000 x 20%) as ordinary income under Section 291 and 244,000 as Section 1231 gain, all taxed at 21 percent.\nCheck: 180,000 plus 100,000 = 280,000.",
    rule: "Individual sells depreciable real property: gain up to straight-line depreciation is unrecaptured Section 1250 gain at a maximum 25 percent; the rest is Section 1231.",
    trap: "Treating the 180,000 as ordinary income at 35 percent, or applying the corporate 20 percent Section 291 rule to an individual."
  },

  {
    id: "MX-30",
    module: "T4 M2",
    entity: "Property",
    tree: null,
    topic: "Section 291 recapture for a C corporation",
    tags: ["section 291", "C corporation", "real property"],
    type: "mcq",
    difficulty: 2,
    stem: "Quill Corp, a C corporation, sold an office building used in its business. The building cost 600,000, straight-line depreciation of 180,000 had been taken, and it sold for 700,000. Quill has no other Section 1231 transactions this year or in the prior five years.\nHow is Quill's 280,000 gain characterized?",
    choices: [
      "180,000 unrecaptured Section 1250 gain taxed at 25 percent and 100,000 Section 1231 gain",
      "180,000 ordinary income and 100,000 Section 1231 gain",
      "36,000 ordinary income and 244,000 Section 1231 gain",
      "280,000 Section 1231 gain, because straight-line depreciation is never recaptured"
    ],
    answer: 2,
    explanation: "C. 36,000 ordinary income and 244,000 Section 1231 gain.\nAdjusted basis is 420,000 (600,000 minus 180,000) and gain is 280,000 (700,000 minus 420,000).\nThe Section 291 rule: when a C corporation sells Section 1250 property, 20 percent of the lesser of the gain or the straight-line depreciation is recharacterized as ordinary income. The lesser of 280,000 and 180,000 is 180,000; ordinary income is 36,000 (180,000 x 20%). The remaining 244,000 (280,000 minus 36,000) is Section 1231 gain, which with no lookback losses is a capital gain taxed at the corporation's flat 21 percent rate. The 25 percent cap is an individual rule and is irrelevant to a corporation.\nA is wrong because the 25 percent unrecaptured Section 1250 rate applies to individuals, not corporations.\nB is wrong because full recapture of depreciation is the Section 1245 rule for personal property, not real property.\nD is wrong because Section 291 recaptures 20 percent of straight-line depreciation for corporations.\nCheck: 36,000 plus 244,000 = 280,000.",
    rule: "Section 291: a C corporation treats 20 percent of the lesser of gain or straight-line depreciation on real property as ordinary income.",
    trap: "Applying the individual 25 percent rule, or full Section 1245 recapture, to a corporation's building."
  },

  {
    id: "MX-31",
    module: "T4 M2",
    entity: "Property",
    tree: null,
    topic: "Section 1231 netting with a net loss",
    tags: ["section 1231", "netting", "ordinary loss"],
    type: "mcq",
    difficulty: 2,
    stem: "During 2026 Ines, a sole proprietor, sold two business assets, each held more than one year: equipment with an adjusted basis of 50,000 sold for 30,000, and land used in the business with a basis of 48,000 sold for 60,000. She has no other property transactions and no Section 1231 losses in the prior five years.\nWhat is the result of these sales?",
    choices: [
      "8,000 net long-term capital loss",
      "12,000 long-term capital gain and 20,000 ordinary loss",
      "20,000 ordinary loss from Section 1245 recapture and 12,000 Section 1231 gain",
      "8,000 ordinary loss"
    ],
    answer: 3,
    explanation: "D. 8,000 ordinary loss.\nEquipment: loss of 20,000 (30,000 minus 50,000). Depreciation recapture applies only to gains, so the loss goes straight to the Section 1231 netting as a 1231 loss.\nLand: gain of 12,000 (60,000 minus 48,000), a Section 1231 gain because the land was used in the business and held more than one year.\nThe netting rule: all Section 1231 gains and losses for the year are netted; a net gain is long-term capital gain (subject to the five year lookback), and a net loss is an ordinary loss deductible in full. Net result is an 8,000 loss (12,000 minus 20,000), so Ines deducts 8,000 as an ordinary loss. This 8,000 net 1231 loss will be recaptured as ordinary income against net 1231 gains in the next five years.\nA is wrong because a net Section 1231 loss is ordinary, not capital.\nB is wrong because the gain and loss must be netted before characterizing either.\nC is wrong because Section 1245 never applies to a loss.\nCheck: 12,000 minus 20,000 = negative 8,000.",
    rule: "Net all Section 1231 gains and losses first: a net gain is long-term capital gain (after lookback), a net loss is a fully deductible ordinary loss.",
    trap: "Applying recapture to a loss, or treating the net 1231 loss as a capital loss subject to the 3,000 limit."
  },

  {
    id: "MX-32",
    module: "T4 M2",
    entity: "Property",
    tree: null,
    topic: "Section 1231 five-year lookback",
    tags: ["section 1231", "lookback", "recapture"],
    type: "mcq",
    difficulty: 3,
    stem: "Tamsin had the following net Section 1231 results: Year 1, net gain 10,000; Year 3, net loss 30,000 (deducted as an ordinary loss); Year 6, net gain 50,000. There were no Section 1231 transactions in Years 2, 4 or 5.\nHow is the Year 6 net Section 1231 gain characterized?",
    choices: [
      "50,000 long-term capital gain",
      "30,000 ordinary income and 20,000 long-term capital gain",
      "20,000 ordinary income and 30,000 long-term capital gain",
      "50,000 ordinary income"
    ],
    answer: 1,
    explanation: "B. 30,000 ordinary income and 20,000 long-term capital gain.\nThe lookback rule: a net Section 1231 gain is treated as ordinary income to the extent of net Section 1231 losses deducted in the five preceding years that have not already been recaptured. The lookback window for Year 6 is Years 1 through 5. The only net loss in that window is the 30,000 in Year 3; the Year 1 gain is not a loss and does not reduce it, because the lookback counts only unrecaptured losses and earlier gains do not offset later losses.\nYear 6: 30,000 of the 50,000 gain is ordinary income, and the remaining 20,000 (50,000 minus 30,000) is long-term capital gain. The Year 3 loss is now fully recaptured, so a Year 7 net gain would be entirely capital.\nA is wrong because the Year 3 loss is within the five year window.\nC is wrong because the Year 1 gain does not shrink the Year 3 loss.\nD is wrong because only 30,000 of unrecaptured loss exists.\nCheck: 30,000 plus 20,000 = 50,000.",
    rule: "Net 1231 gain is ordinary to the extent of unrecaptured net 1231 losses from the prior five years; earlier gains do not offset those losses.",
    trap: "Ignoring the lookback, or netting an earlier year's gain against the loss."
  },

  {
    id: "MX-33",
    module: "T4 M2",
    entity: "Property",
    tree: null,
    topic: "Capital asset vs Section 1231 vs ordinary classification",
    tags: ["classification", "capital asset", "section 1231"],
    type: "text",
    difficulty: 1,
    stem: "Vaughn operates a bakery as a sole proprietor. He sells a delivery van he has used in the business for 26 months.\nFor purposes of characterizing his gain or loss, how is the van classified?",
    answer: "section 1231",
    accept: ["1231", "section 1231 property", "1231 property", "sec 1231", "section 1231 asset"],
    explanation: "Section 1231 property.\nThe classification rule: a capital asset is everything except inventory, receivables from sales or services, depreciable property and real estate used in a trade or business, and creative works held by their creator. The van is depreciable business property, so it is not a capital asset. Business property held more than 12 months is Section 1231 property: a net gain is long-term capital gain and a net loss is ordinary. Held 26 months, the van qualifies.\nIf Vaughn had held the van 12 months or less, any gain or loss would be ordinary. Any gain on the van is first ordinary income under Section 1245 to the extent of depreciation taken; only the excess is Section 1231 gain. Inventory and receivables are always ordinary; Vaughn's personal car would be a capital asset.",
    rule: "Depreciable business property and business real estate held more than 12 months are Section 1231; held 12 months or less they are ordinary; personal-use and investment assets are capital.",
    trap: "Calling business-use property a capital asset, or forgetting the more-than-12-month requirement."
  },

  // ---- T4 M3 Related party transactions ----
  {
    id: "MX-34",
    module: "T4 M3",
    entity: "Individual",
    tree: null,
    topic: "Constructive ownership under Section 267",
    tags: ["related party", "constructive ownership", "attribution"],
    type: "numeric",
    difficulty: 3,
    stem: "Zeta Corp has 1,000 shares outstanding. Ana owns 200 shares directly. She owns 50 percent of Pine Corp, which owns 300 Zeta shares. She is a 40 percent partner in Oak Partnership, which owns 250 Zeta shares. Her brother owns 100 Zeta shares, her brother's wife owns 100 shares, and an unrelated investor owns the remaining 50 shares.\nFor purposes of the related party loss rules, what percentage of Zeta does Ana own directly and constructively?",
    answer: 55,
    unit: "%",
    tolerance: 0,
    explanation: "55 percent.\nDirect: 20 percent (200 of 1,000 shares).\nEntity attribution rule: stock owned by a corporation or partnership is treated as owned proportionately by its shareholders or partners. Through Pine: 15 percent (50% x 300 shares = 150 shares). Through Oak: 10 percent (40% x 250 shares = 100 shares).\nFamily attribution rule: an individual is treated as owning stock owned by a spouse, siblings, ancestors and lineal descendants. Brother: 10 percent (100 shares). The brother's wife is an in-law, not family under Section 267, so her 100 shares are not attributed to Ana directly. Her shares are attributed to the brother as his spouse, but stock attributed to a family member by family attribution cannot be re-attributed to another family member, so it stops there. The unrelated investor's 50 shares are never attributed.\nTotal: 55 percent (20 plus 15 plus 10 plus 10). Ana owns more than 50 percent, so Zeta and Ana are related parties and a loss on a sale between them is disallowed.\nCheck: 200 plus 150 plus 100 plus 100 = 550 shares of 1,000.",
    rule: "Add direct ownership, proportionate ownership through entities, and family stock (spouse, siblings, ancestors, descendants); no in-laws and no double family attribution.",
    trap: "Attributing the sister-in-law's shares, or counting the full 300 Pine shares instead of Ana's 50 percent of them."
  },

  {
    id: "MX-35",
    module: "T4 M3",
    entity: "Individual",
    tree: null,
    topic: "Related party loss disallowance and the buyer's later sale",
    tags: ["related party", "disallowed loss", "holding period"],
    type: "mcq",
    difficulty: 3,
    stem: "Hugo bought stock six years ago for 60,000 and sold it to his son Mateo for 45,000, its fair market value at the time. Eight months later Mateo sold the stock to an unrelated buyer for 70,000.\nWhat does Mateo recognize on his sale?",
    choices: [
      "25,000 long-term capital gain",
      "10,000 long-term capital gain",
      "10,000 short-term capital gain",
      "25,000 short-term capital gain"
    ],
    answer: 2,
    explanation: "C. 10,000 short-term capital gain.\nHugo's sale: realized loss of 15,000 (45,000 minus 60,000). The related party rule: a loss on a sale to a related party, and a parent and child are related, is disallowed to the seller. Hugo deducts nothing, now or later.\nMateo's basis is his cost, 45,000. On his resale: realized gain of 25,000 (70,000 minus 45,000). The buyer's relief rule: Mateo may reduce his gain by Hugo's disallowed loss, but not below zero. Recognized gain is 10,000 (25,000 minus 15,000). This equals 70,000 minus Hugo's original 60,000 basis, which is the shortcut when the resale price exceeds the original seller's basis.\nHolding period: because Mateo's basis is his own cost and not a carryover basis, his holding period starts on his purchase date. Eight months is one year or less, so the 10,000 gain is short-term.\nIf Mateo had sold for 52,000 (between his 45,000 cost and Hugo's 60,000 basis), he would recognize no gain or loss: the 7,000 gain is wiped out by the disallowed loss and nothing below zero is created. If he had sold for 40,000, he would recognize a 5,000 loss (40,000 minus his 45,000 cost) and Hugo's 15,000 loss would be lost forever.\nA and D are wrong because they ignore the 15,000 disallowed loss that offsets Mateo's gain.\nB is wrong because Hugo's six year holding period does not tack; Mateo's own eight months controls.\nCheck: 70,000 minus 60,000 = 10,000.",
    rule: "Buyer's gain = resale price minus the original seller's basis (never below zero); buyer's loss = resale price minus the buyer's own cost; the buyer's holding period starts at purchase.",
    trap: "Tacking the seller's holding period, or forgetting to offset the gain by the disallowed loss."
  },

  {
    id: "MX-36",
    module: "T4 M3",
    entity: "Individual",
    tree: null,
    topic: "Section 1239 ordinary income on depreciable property sold to a controlled entity",
    tags: ["related party", "section 1239", "ordinary income"],
    type: "text",
    difficulty: 2,
    stem: "Lara owns 70 percent of Fenwick Corp. She sells a piece of machinery she had used in her sole proprietorship to Fenwick for 90,000. Her adjusted basis is 50,000, and she had taken 10,000 of depreciation. Fenwick will depreciate the machinery.\nWhat is the character of Lara's entire 40,000 gain?",
    answer: "ordinary income",
    accept: ["ordinary", "ordinary gain", "all ordinary income", "ordinary income under section 1239", "section 1239 ordinary income"],
    explanation: "Ordinary income, all 40,000.\nGain is 40,000 (90,000 minus 50,000). Normally only 10,000 (the depreciation taken) would be ordinary under Section 1245, with 30,000 as Section 1231 gain.\nThe Section 1239 rule: when depreciable property is sold between related parties, which includes an individual and a corporation or partnership the individual controls by more than 50 percent, the entire gain is ordinary income because the buyer will depreciate the stepped-up basis against ordinary income. Lara owns 70 percent, so all 40,000 is ordinary.\nThis is a gain rule for depreciable property; gain on nondepreciable property such as land sold to a related party keeps its capital character, and a loss on a sale to a related party is disallowed under Section 267 rather than recharacterized.",
    rule: "Section 1239: gain on depreciable property sold to a more than 50 percent controlled entity is entirely ordinary income.",
    trap: "Splitting the gain into 1245 recapture and 1231 gain as if the buyer were unrelated."
  },

  {
    id: "MX-37",
    module: "T4 M3",
    entity: "Individual",
    tree: null,
    topic: "Related party matching of accrued expenses",
    tags: ["related party", "accrual", "matching rule"],
    type: "text",
    difficulty: 2,
    stem: "Brook Inc., an accrual basis C corporation, accrues a 30,000 year-end bonus on December 31 of Year 1 payable to its 60 percent shareholder, who is a cash basis individual. The bonus is paid on March 10 of Year 2.\nIn which year may Brook deduct the bonus?",
    answer: "year 2",
    accept: ["2", "year two", "the year paid", "when paid", "year 2 when paid"],
    explanation: "Year 2, when the bonus is paid.\nThe matching rule: an accrual basis taxpayer may not deduct an expense owed to a related cash basis party until the related party includes the amount in income. A corporation and a more than 50 percent shareholder are related, so Brook's Year 1 accrual is not deductible until the shareholder reports the 30,000 as income, which as a cash basis taxpayer happens in Year 2 when the bonus is received.\nIf the bonus had been owed to an unrelated employee, the normal rule would apply: an accrual basis employer deducts an accrued bonus in Year 1 if it is paid within two and a half months after year end. The related party rule overrides that convenience.\nCheck: the Year 2 deduction matches the shareholder's Year 2 inclusion.",
    rule: "Accrual payer, cash basis related payee: deduct only when the payee includes the amount in income.",
    trap: "Using the two and a half month rule for an accrued bonus to a controlling shareholder."
  },

  {
    id: "MX-38",
    module: "T4 M3",
    entity: "Individual",
    tree: null,
    topic: "Below-market gift loan imputed interest",
    tags: ["below-market loan", "imputed interest", "gift loan"],
    type: "numeric",
    difficulty: 2,
    stem: "On January 1, 2026, Imani lends her son 80,000 interest free so he can buy a car. The loan is outstanding all year, the applicable federal rate is 4 percent, and her son has 2,500 of net investment income for the year.\nHow much imputed interest income must Imani report for 2026?",
    answer: 2500,
    unit: "$",
    tolerance: 0,
    explanation: "2,500.\nThe forgone interest is 3,200 (80,000 x 4% AFR minus 0 stated interest).\nThe gift loan rules: loans of 10,000 or less are ignored entirely, which does not apply here. For a gift loan of 100,000 or less between individuals, the imputed interest is limited to the borrower's net investment income, and if that income is 1,000 or less it is treated as zero. The son's net investment income is 2,500, which exceeds 1,000, so Imani's imputed interest income is the lesser of 3,200 forgone interest or 2,500, which is 2,500.\nImani is treated as receiving 2,500 of interest income and making a 2,500 gift to her son (well within the 19,000 annual exclusion); the son is treated as paying 2,500 of nondeductible personal interest.\nIf the loan were over 100,000, the full 3,200 would be imputed regardless of the son's investment income.\nCheck: lesser of 3,200 and 2,500 = 2,500.",
    rule: "Gift loan of 100,000 or less: imputed interest = lesser of forgone interest at the AFR or the borrower's net investment income; zero if that income is 1,000 or less; loans of 10,000 or less are ignored.",
    trap: "Reporting the full 3,200, or using the lender's investment income instead of the borrower's."
  },

  // ---- T1 M1 Compliance and planning ----
  {
    id: "MX-39",
    module: "T1 M1",
    entity: "Individual",
    tree: null,
    topic: "Kiddie tax and the dependent standard deduction",
    tags: ["kiddie tax", "standard deduction", "dependent"],
    type: "numeric",
    difficulty: 2,
    stem: "Rowan, age 15, is claimed as a dependent by his parents. In 2026 he earned 2,000 mowing lawns and received 6,000 of taxable interest from an account his grandparents funded.\nWhat amount of Rowan's income is taxed at his parents' marginal rate?",
    answer: 3300,
    unit: "$",
    tolerance: 0,
    explanation: "3,300.\nThe kiddie tax rule for 2026: a dependent child under 18 pays tax on unearned income in three layers: the first 1,350 is sheltered by the dependent standard deduction, the next 1,350 is taxed at the child's own rate, and unearned income above 2,700 (1,350 plus 1,350) is taxed at the parents' marginal rate.\nAmount at the parents' rate: 3,300 (6,000 interest minus 2,700).\nRowan's earned income does not change this computation; it is taxed at his own rate. His total standard deduction is 2,450 (the greater of 1,350 or earned income of 2,000 plus 450, capped at the 16,100 single amount), which shelters his earned income as well as the first layer of interest.\nCheck: 1,350 sheltered plus 1,350 at Rowan's rate plus 3,300 at the parents' rate = 6,000.",
    rule: "Kiddie tax 2026: unearned income over 2,700 is taxed at the parents' rate; dependent standard deduction = greater of 1,350 or earned income plus 450.",
    trap: "Subtracting only 1,350 (giving 4,650), or including the earned income in the amount taxed at the parents' rate."
  },

  {
    id: "MX-40",
    module: "T1 M1",
    entity: "Individual",
    tree: null,
    topic: "Individual estimated tax safe harbor",
    tags: ["estimated tax", "safe harbor", "110 percent"],
    type: "mcq",
    difficulty: 2,
    stem: "Yusuf's 2025 adjusted gross income was 180,000 and his 2025 tax was 38,000. He expects his 2026 tax to be 52,000, and his employer will withhold 30,000 during 2026.\nWhat is the minimum total of estimated tax payments Yusuf must make during 2026 to avoid an underpayment penalty?",
    choices: [
      "11,800",
      "8,000",
      "16,800",
      "22,000"
    ],
    answer: 0,
    explanation: "A. 11,800.\nThe safe harbor rule: an individual avoids the penalty by paying, through withholding and timely estimates, the lesser of 90 percent of the current year tax or 100 percent of the prior year tax, and the prior year percentage becomes 110 percent when prior year AGI exceeded 150,000.\nCurrent year test: 46,800 (52,000 x 90%). Prior year test: 41,800 (38,000 x 110%, because 180,000 of AGI exceeds 150,000). The required annual payment is the lesser, 41,800.\nWithholding counts as paid evenly through the year, so estimates needed are 11,800 (41,800 minus 30,000), normally paid in four installments of 2,950.\nB is wrong because it uses 100 percent of prior year tax; Yusuf's AGI puts him at 110 percent.\nC is wrong because the lower safe harbor, not the 90 percent figure, sets the requirement.\nD is wrong because the safe harbor does not require paying the full expected tax.\nCheck: 30,000 withholding plus 11,800 estimates = 41,800.",
    rule: "Required payments = lesser of 90 percent of current tax or 100 percent (110 percent if prior AGI over 150,000) of prior tax, less withholding.",
    trap: "Forgetting the 110 percent step-up, or using the higher safe harbor."
  },

  {
    id: "MX-41",
    module: "T1 M1",
    entity: "Individual",
    tree: null,
    topic: "ISO vs nonqualified stock option timing",
    tags: ["stock options", "ISO", "AMT"],
    type: "mcq",
    difficulty: 1,
    stem: "In 2026 Chloe exercises an incentive stock option to buy 1,000 shares of her employer's stock for 20 per share when the stock is worth 50 per share, and she holds the shares at year end. Separately, in 2026 her coworker Dax exercises a nonqualified stock option (which had no readily ascertainable value at grant) to buy 1,000 shares for 20 when the stock is worth 50, and he also holds the shares.\nWhat do they report for 2026?",
    choices: [
      "Chloe: 30,000 ordinary income. Dax: 30,000 ordinary income.",
      "Chloe: no regular taxable income and a 30,000 AMT adjustment. Dax: 30,000 ordinary wage income.",
      "Chloe: no income of any kind. Dax: no income until he sells the shares.",
      "Chloe: 30,000 long-term capital gain. Dax: 30,000 ordinary wage income."
    ],
    answer: 1,
    explanation: "B. Chloe: no regular income, 30,000 AMT adjustment. Dax: 30,000 of ordinary wage income.\nThe bargain element for each is 30,000 ((50 minus 20) x 1,000 shares).\nISO rule: no regular taxable income at grant or exercise. The 30,000 bargain element is a positive AMT adjustment in the year of exercise, and Chloe's AMT basis in the shares is 50,000 while her regular basis is 20,000. If she holds the shares more than two years from grant and one year from exercise, the whole gain on sale is long-term capital gain; a disqualifying disposition makes the bargain element ordinary income at that time.\nNonqualified option rule: with no readily ascertainable value at grant, nothing is taxed at grant and the 30,000 bargain element is ordinary wage income at exercise, reported on Dax's W-2 and deductible by his employer. Dax's basis in the shares is 50,000 and his holding period starts at exercise.\nA is wrong because an ISO exercise produces no regular income.\nC is wrong because Dax is taxed at exercise and Chloe has an AMT adjustment.\nD is wrong because an ISO produces no capital gain until the shares are sold.\nCheck: Chloe regular 0, AMT 30,000; Dax ordinary 30,000.",
    rule: "ISO exercise: no regular income, bargain element is an AMT adjustment. Nonqualified option exercise: bargain element is ordinary wage income.",
    trap: "Forgetting the ISO AMT adjustment, or taxing the nonqualified option only at sale."
  },

  // ---- T1 M3 Gift tax ----
  {
    id: "MX-42",
    module: "T1 M3",
    entity: "Individual",
    tree: null,
    topic: "Taxable gifts with gift splitting, direct payments and a future interest",
    tags: ["gift tax", "annual exclusion", "gift splitting", "future interest"],
    type: "numeric",
    difficulty: 3,
    stem: "In 2026 Elena, who is married, made the following transfers, and her husband consented to split all gifts for the year:\n50,000 of cash to their daughter.\n30,000 paid directly to their son's university for tuition.\n12,000 paid directly to a hospital for their son's surgery.\nA remainder interest in a parcel of land, worth 25,000, deeded to their daughter while Elena keeps the right to use the land for the rest of her life.\nWhat are Elena's taxable gifts for 2026 after the split?",
    answer: 18500,
    unit: "$",
    tolerance: 0,
    explanation: "18,500.\nGift splitting rule: with the spouse's consent, each gift is treated as made half by each spouse, so Elena reports half of each transfer and applies her own 19,000 annual exclusion per donee to present interests.\nCash to the daughter: Elena's half is 25,000 (50,000 x 50%); annual exclusion 19,000; taxable 6,000 (25,000 minus 19,000). Across both spouses the couple shelters 38,000 (19,000 x 2) of the 50,000.\nTuition paid directly to the university: 0. Payments made directly to an educational institution for tuition are excluded without limit and do not use the annual exclusion.\nMedical bills paid directly to the provider: 0, under the unlimited medical exclusion.\nRemainder interest for the daughter: Elena's half is 12,500 (25,000 x 50%). A remainder interest is a future interest, and the annual exclusion applies only to present interests, so the whole 12,500 is taxable. The daughter's 19,000 exclusion was already used against the cash and could not apply here in any event.\nElena's taxable gifts: 18,500 (6,000 plus 12,500). Her husband reports the same 18,500. Both must file Form 709 because gifts were split and a future interest was given.\nCheck: 6,000 plus 0 plus 0 plus 12,500 = 18,500.",
    rule: "Annual exclusion 19,000 per donee (38,000 split) for present interests only; direct tuition and medical payments are unlimited exclusions; future interests get no exclusion.",
    trap: "Applying the annual exclusion to the remainder interest, or treating the direct tuition payment as a taxable gift."
  },

  {
    id: "MX-43",
    module: "T1 M3",
    entity: "Individual",
    tree: null,
    topic: "Basis of gifted vs inherited property",
    tags: ["gift basis", "inherited basis", "dual basis"],
    type: "mcq",
    difficulty: 2,
    stem: "Walter owns stock with a basis of 30,000 that is now worth 22,000. He is deciding whether to give it to his niece now or leave it to her at his death, when it is expected to still be worth about 22,000.\nIf his niece sells the stock for 25,000 shortly after receiving it, what does she recognize under each alternative?",
    choices: [
      "Gift: 5,000 loss. Inheritance: 3,000 gain",
      "Gift: no gain or loss. Inheritance: 3,000 long-term capital gain",
      "Gift: 3,000 gain. Inheritance: 3,000 gain",
      "Gift: no gain or loss. Inheritance: 5,000 loss"
    ],
    answer: 1,
    explanation: "B. Gift: no gain or loss. Inheritance: 3,000 long-term capital gain.\nGift rule: when the FMV at the gift date (22,000) is below the donor's basis (30,000), the donee has a dual basis: 30,000 for computing gain and 22,000 for computing loss. A sale price between the two produces neither. Selling at 25,000: the gain test, 25,000 minus 30,000, is negative, so no gain; the loss test, 25,000 minus 22,000, is positive, so no loss. Result: nothing recognized.\nInheritance rule: inherited property takes a basis equal to FMV at death, 22,000, and is always long-term. Gain is 3,000 (25,000 minus 22,000), long-term capital gain.\nPlanning point: Walter should not give loss property; the 8,000 built-in loss disappears under either route. He would do better to sell the stock himself, deduct the 8,000 loss, and give the cash.\nA is wrong because the donee uses the lower FMV basis for a loss, not the donor's 30,000.\nC is wrong because the gift basis for gain is the donor's 30,000, not FMV.\nD is wrong because inherited property takes a FMV basis, not the decedent's basis.\nCheck: gift no gain or loss; inheritance 25,000 minus 22,000 = 3,000.",
    rule: "Gift with a built-in loss: donor's basis for gain, FMV for loss, nothing in between; inheritance: FMV at death, always long-term.",
    trap: "Using the donor's basis to compute the donee's loss, or carrying the decedent's basis over at death."
  },

  // ---- T2 M1 NOLs ----
  {
    id: "MX-44",
    module: "T2 M1",
    entity: "C Corp",
    tree: null,
    topic: "Pre-2018 and post-2017 NOL carryforwards",
    tags: ["NOL", "80 percent limit", "carryforward"],
    type: "mcq",
    difficulty: 3,
    stem: "Harlow Corp has 2026 taxable income of 400,000 before any net operating loss deduction. It carries forward a 150,000 NOL from 2017 and a 300,000 NOL from 2022.\nWhat is Harlow's 2026 NOL deduction, and what is the resulting tax savings at 21 percent?",
    choices: [
      "320,000 deduction; 67,200 savings",
      "400,000 deduction; 84,000 savings",
      "390,000 deduction; 81,900 savings",
      "350,000 deduction; 73,500 savings"
    ],
    answer: 3,
    explanation: "D. 350,000 deduction; 73,500 of tax savings.\nThe ordering rule: use the oldest loss first. A pre-2018 NOL offsets 100 percent of taxable income, so the 2017 loss of 150,000 is deducted in full, leaving 250,000 (400,000 minus 150,000) of taxable income.\nThe post-2017 limit: an NOL arising after 2017 may offset only 80 percent of the taxable income remaining after the pre-2018 losses. The cap is 200,000 (250,000 x 80%), so only 200,000 of the 2022 loss is used; 100,000 (300,000 minus 200,000) carries forward indefinitely.\nTotal NOL deduction: 350,000 (150,000 plus 200,000). Taxable income after the deduction: 50,000 (400,000 minus 350,000). Tax savings: 73,500 (350,000 x 21%).\nA is wrong because the 80 percent cap applies only to post-2017 losses, and the pre-2018 loss comes out first.\nB is wrong because the 2022 loss cannot wipe out the remaining 250,000.\nC is wrong because 80 percent applies to the remaining taxable income, not to the amount of the NOL.\nCheck: 150,000 plus 200,000 = 350,000; 50,000 of income remains and 100,000 of the 2022 loss remains.",
    rule: "Apply pre-2018 NOLs first at 100 percent; post-2017 NOLs are limited to 80 percent of the taxable income that remains.",
    trap: "Applying 80 percent to all taxable income or to the NOL balance itself."
  }

]);
