// Decision tree flow definitions, extracted from Zach's 'Entity Transaction Decision Trees' artifact.
// node: {k:'start|q|ok|tax|warn|calc|note|end', h:'title', b:'html body', legs:[{l:'label',c:'y|n|',f:[nodes],end:true}]}
(function(){
const F = {};

// ===== C CORP: contribution, owner =====
F.c_contrib_owner = [
 {k:'start',h:'You transfer something to the corporation and receive stock'},
 {k:'q',h:'Did you transfer property?',b:'<p>Cash, equipment, land, inventory, receivables, patents all count. Services do not.</p>',legs:[
  {l:'NO (services)',c:'n',end:true,f:[{k:'tax',h:'Ordinary income = FMV of the stock',b:'<p>Stock basis = that FMV. Holding period starts now. You do NOT count toward the 80 percent test.</p>'}]},
  {l:'YES',c:'y',f:[]}
 ]},
 {k:'q',h:'Right after the transfer, do the property transferors as a group own at least 80 percent of voting power AND 80 percent of each class of nonvoting stock?',legs:[
  {l:'NO',c:'n',end:true,f:[{k:'tax',h:'Fully taxable exchange',b:'<p>Recognize gain OR loss = (FMV of stock + boot + liabilities assumed) − basis of the property. Stock basis = FMV of the stock. Holding period starts now.</p>'}]},
  {l:'YES',c:'y',f:[{k:'ok',h:'Section 351 applies',b:'<p>Realized gain is deferred. Realized loss is never recognized. Gain is recognized only to the extent of boot or excess liabilities.</p>'}]}
 ]},
 {k:'calc',h:'Realized gain',b:'<span class="f">(FMV stock + boot received + liabilities assumed by corp) − adjusted basis of property given</span>'},
 {k:'q',h:'Did the corporation take over liabilities on the property?',legs:[
  {l:'YES',c:'y',f:[{k:'calc',h:'Three liability outcomes',b:'<ol><li>Normal case: NOT boot. The liability only reduces your stock basis.</li><li>Total liabilities assumed exceed the total adjusted basis of ALL property you transferred: the excess is recognized gain, even with no other boot.</li><li>Tax avoidance purpose or no business purpose: ALL liabilities assumed become boot.</li></ol>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Nothing to adjust'}]}
 ]},
 {k:'q',h:'Did you receive boot?',b:'<p>Cash, property other than stock, corporate notes or bonds, nonqualified preferred stock.</p>',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Recognized gain = LESSER of realized gain or boot (FMV)',b:'<p>Never a loss. Character follows the property given: ordinary for inventory, capital for capital assets, recapture first on depreciated assets. Several assets: allocate boot by relative FMV and test each asset separately. Basis in boot property received = FMV.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Recognized gain = 0',b:'<p>Unless liability outcome 2 or 3 above created gain.</p>'}]}
 ]},
 {k:'calc',h:'Your stock basis',b:'<span class="f">AB of property transferred + gain recognized − boot received (cash + FMV) − liabilities assumed by corp</span><span class="f">Check: FMV of stock − deferred gain (+ deferred loss)</span>'},
 {k:'end',h:'Holding period and character',b:'<ul><li>Stock holding period tacks (includes your holding period of the property) if the property was a capital asset or Section 1231 asset.</li><li>Starts fresh if the property was ordinary (inventory) or the stock was for services.</li><li>Several assets: allocate the stock FMV among them by relative FMV; gain, loss, and holding period are computed asset by asset.</li></ul>'}
];

// ===== C CORP: contribution, entity =====
F.c_contrib_entity = [
 {k:'start',h:'Corporation issues its own stock for property or services'},
 {k:'ok',h:'No gain or loss on issuing stock. Ever.',b:'<p>Section 1032. True whether or not 351 applies, and true for treasury stock too.</p>'},
 {k:'q',h:'Did Section 351 apply to the shareholder?',legs:[
  {l:'NO',c:'n',end:true,f:[{k:'calc',h:'Basis in property = FMV (cost)',b:'<p>Holding period starts now.</p>'}]},
  {l:'YES',c:'y',f:[]}
 ]},
 {k:'calc',h:'Basis in the property',b:'<span class="f">Transferor\'s adjusted basis + gain the transferor recognized</span><p>Gain recognized means boot gain or excess liability gain. Holding period tacks (always, for the corporation).</p>'},
 {k:'q',h:'Is the total adjusted basis of the property from this transferor higher than its total FMV (net built in loss)?',legs:[
  {l:'YES',c:'y',f:[{k:'warn',h:'Basis limited to FMV',b:'<p>The corporation\'s total basis is capped at total FMV so the built in loss cannot be used twice, unless the shareholder elects to reduce their stock basis by the built in loss instead.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Carryover basis stands'}]}
 ]},
 {k:'q',h:'Did the corporation give boot (cash or other property) along with stock?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Appreciated boot property: gain recognized',b:'<p>As if sold: FMV − adjusted basis. Cash boot: nothing. Depreciated boot property: loss not recognized.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Nothing'}]}
 ]},
 {k:'end',h:'Other corporate side points',b:'<ul><li>Stock issued for services: deduct the FMV as compensation (capitalize if for organizational services).</li><li>Liabilities assumed: no direct effect on the corporation\'s basis; they affect it only through the gain the shareholder recognized.</li><li>Later capital contribution with no stock issued: carryover basis as well. Contributions by non shareholders: zero basis.</li></ul>'}
];

// ===== C CORP: nonliquidating, owner =====
F.c_nonliq_owner = [
 {k:'start',h:'You receive a distribution from the corporation'},
 {k:'q',h:'Did you surrender any shares (redemption)?',legs:[
  {l:'YES',c:'y',end:true,f:[
   {k:'q',h:'Does one of the sale tests pass?',b:'<ul><li>Substantially disproportionate: after, under 50 percent of voting power AND under 80 percent of your prior percentage</li><li>Complete termination (family attribution can be waived)</li><li>Not essentially equivalent to a dividend (meaningful reduction)</li><li>Partial liquidation, noncorporate shareholder</li><li>To pay death taxes</li></ul><p>Test ownership using family and entity attribution.</p>',legs:[
    {l:'YES',c:'y',end:true,f:[{k:'tax',h:'Sale treatment',b:'<p>Capital gain or loss = amount received − basis of the shares redeemed. Corporation\'s E&amp;P is reduced by the lesser of the amount paid or the ratable share of E&amp;P.</p>'}]},
    {l:'NO',c:'n',end:true,f:[{k:'tax',h:'Dividend treatment',b:'<p>Dividend to the extent of E&amp;P (same ladder as below). The basis of the redeemed shares moves to the shares you still own.</p>'}]}
   ]}
  ]},
  {l:'NO',c:'n',f:[]}
 ]},
 {k:'calc',h:'Amount distributed',b:'<span class="f">Cash + FMV of property − liabilities you take over (not below zero)</span>'},
 {k:'q',h:'How much E&P is available?',b:'<p>First add the corporation\'s gain on any appreciated property to current E&amp;P. Then apply the combination:</p><table><tr><th>Current</th><th>Accumulated</th><th>Dividend</th></tr><tr><td>+</td><td>+</td><td>Current first (prorated over all of the year\'s distributions), then accumulated in date order</td></tr><tr><td>+</td><td>−</td><td>Up to current E&amp;P only. Do not net.</td></tr><tr><td>−</td><td>+</td><td>Net them as of the distribution date (prorate the current deficit to that date)</td></tr><tr><td>−</td><td>−</td><td>None</td></tr></table>',legs:[
  {l:'E&P COVERS IT',c:'y',f:[{k:'tax',h:'Entire amount is a dividend',b:'<p>Ordinary income. Qualified dividend rate for individuals. Corporate shareholders get the DRD. Stock basis does not change.</p>'}]},
  {l:'E&P RUNS OUT',c:'n',f:[{k:'tax',h:'Three layers, in order',b:'<ol><li>Dividend to the extent of E&amp;P.</li><li>Excess is a return of capital: tax free, reduces stock basis (not below zero).</li><li>Excess over basis is capital gain (long or short term by how long you held the stock).</li></ol><p>Several shareholders paid on the same date: each takes their ownership percent of each layer; only the basis step differs by person.</p>'}]}
 ]},
 {k:'end',h:'Basis and holding period in property received',b:'<ul><li>Basis = full FMV, not reduced by the liability you assumed.</li><li>Holding period starts on the distribution date.</li><li>Constructive dividends (excess salary, personal use of corporate assets, bargain sales, fake loans) run through the same ladder.</li><li>Stock dividends: tax free unless cash was an option; spread old basis over old and new shares.</li></ul>'}
];

// ===== C CORP: nonliquidating, entity =====
F.c_nonliq_entity = [
 {k:'start',h:'Corporation distributes cash or property and keeps operating'},
 {k:'q',h:'What is distributed?',legs:[
  {l:'CASH',c:'',end:true,f:[{k:'ok',h:'No gain or loss',b:'<p>E&amp;P is reduced by the cash. Interest on a real shareholder loan is deductible; a dividend is not.</p>'}]},
  {l:'PROPERTY',c:'',f:[]}
 ]},
 {k:'q',h:'Is the property subject to a liability larger than its FMV?',legs:[
  {l:'YES',c:'y',f:[{k:'calc',h:'Treat FMV as equal to the liability',b:'<p>Use that larger number for the gain computation.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Use actual FMV'}]}
 ]},
 {k:'q',h:'FMV (as adjusted) greater than adjusted basis?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Gain recognized as if sold',b:'<p>Gain = FMV − adjusted basis, taxed at 21 percent. Character by asset: inventory ordinary, Section 1245 recapture ordinary, Section 291 on real property (20 percent of straight line depreciation ordinary), the rest Section 1231 or capital.</p><p>The gain goes into current E&amp;P BEFORE you compare E&amp;P to the distribution.</p>'}]},
  {l:'NO',c:'n',f:[{k:'warn',h:'No loss recognized',b:'<p>The loss is simply gone. E&amp;P is reduced by the property\'s adjusted basis.</p>'}]}
 ]},
 {k:'calc',h:'E&P effect of an appreciated property distribution',b:'<span class="f">+ gain recognized − tax on the gain − FMV of the property + liability the shareholder takes over</span><p>Net: E&amp;P ends up reduced by the property\'s adjusted basis plus the tax, less the liability shifted.</p>'},
 {k:'end',h:'Redemptions and deductibility',b:'<ul><li>A redemption with property follows the same gain rule for the corporation.</li><li>No deduction for a dividend. Constructive dividends (excess compensation, personal use of assets) lose their deduction too.</li><li>Below market loan to a shareholder: corporation has imputed interest income and a deemed, nondeductible dividend.</li></ul>'}
];

// ===== C CORP: liquidation, owner =====
F.c_liq_owner = [
 {k:'start',h:'You surrender all your stock and receive the corporation\'s assets'},
 {k:'q',h:'Are you a parent corporation owning at least 80 percent of vote and value?',legs:[
  {l:'YES',c:'y',end:true,f:[{k:'ok',h:'Section 332: no gain or loss',b:'<p>Your basis in the subsidiary stock disappears. You take the subsidiary\'s basis in its assets (carryover) and inherit its tax attributes (E&amp;P, NOLs, methods).</p>'}]},
  {l:'NO',c:'n',f:[]}
 ]},
 {k:'calc',h:'Amount realized',b:'<span class="f">Cash + FMV of property received − liabilities you take over</span>'},
 {k:'calc',h:'Gain or loss on the stock',b:'<span class="f">Amount realized − adjusted basis of your stock</span>'},
 {k:'tax',h:'Capital gain or loss',b:'<p>Stock is a capital asset. Long term if held more than one year. This is the second level of tax; the corporation already paid on its asset gains.</p><p>Section 1244: an individual who received qualifying small business stock at original issue can treat up to 50,000 (100,000 joint) of the loss as ordinary.</p>'},
 {k:'end',h:'Basis, holding period, timing',b:'<ul><li>Basis in property received = FMV. Holding period starts now.</li><li>A series of liquidating distributions: recover your full stock basis first, then report gain. A loss waits until the final distribution.</li><li>Nothing here is a dividend, no matter how much E&amp;P the corporation had.</li></ul>'}
];

// ===== C CORP: liquidation, entity =====
F.c_liq_entity = [
 {k:'start',h:'Corporation distributes all assets and dissolves'},
 {k:'q',h:'Is the recipient a parent corporation owning at least 80 percent?',legs:[
  {l:'YES',c:'y',end:true,f:[{k:'ok',h:'Section 332 / 337: no gain or loss to the subsidiary',b:'<p>On assets going to the parent. Assets going to minority shareholders still trigger gain (not loss). Parent takes carryover basis and the attributes.</p>'}]},
  {l:'NO',c:'n',f:[]}
 ]},
 {k:'tax',h:'Every asset treated as sold at FMV: gain AND loss recognized',b:'<p>This is the difference from a nonliquidating distribution, where only gain counts. Liability larger than FMV: FMV is treated as at least the liability. Character by asset: inventory and recapture are ordinary; land and capital assets are Section 1231 or capital. Tax at 21 percent.</p>'},
 {k:'q',h:'Is the distributee a related party (more than 50 percent shareholder, with attribution)?',legs:[
  {l:'YES',c:'y',f:[{k:'warn',h:'Loss disallowed if either',b:'<ul><li>the distribution is not pro rata, or</li><li>the asset is disqualified property: received in a 351 transfer or as a capital contribution within the last 5 years.</li></ul>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Related party rule does not apply'}]}
 ]},
 {k:'q',h:'Was built in loss property contributed within 2 years as part of a plan to create the loss?',legs:[
  {l:'YES',c:'y',f:[{k:'warn',h:'Built in loss disallowed',b:'<p>Only the decline in value after contribution is deductible.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Loss allowed'}]}
 ]},
 {k:'end',h:'After the liquidation',b:'<ul><li>E&amp;P, NOLs, and other attributes disappear with the corporation (they survive only in a Section 332 parent liquidation).</li><li>Paying off creditors before distributing is not income; forgiveness of corporate debt by a shareholder is a capital contribution.</li><li>Converting a corporation into an LLC or partnership is taxed as a liquidation on both sides.</li></ul>'}
];

// ===== S CORP: contribution, owner =====
F.s_contrib_owner = [
 {k:'start',h:'You transfer property or services for S corporation stock'},
 {k:'q',h:'Property, not services?',legs:[
  {l:'NO (services)',c:'n',end:true,f:[{k:'tax',h:'Ordinary income = FMV of stock',b:'<p>Stock basis = FMV. You do not count toward the 80 percent test.</p>'}]},
  {l:'YES',c:'y',f:[]}
 ]},
 {k:'q',h:'Do the property transferors own at least 80 percent (vote and each nonvoting class) right after?',legs:[
  {l:'NO',c:'n',end:true,f:[{k:'tax',h:'Fully taxable',b:'<p>Gain or loss recognized. Stock basis = FMV. Remember an S corporation cannot have a corporate or partnership shareholder, so the transferor group is individuals, estates, and eligible trusts.</p>'}]},
  {l:'YES',c:'y',f:[{k:'ok',h:'Section 351 applies, same as a C corporation',b:'<p>Deferred gain, no loss, gain only to the extent of boot or excess liabilities.</p>'}]}
 ]},
 {k:'q',h:'Boot received, or liabilities assumed?',legs:[
  {l:'BOOT',c:'',f:[{k:'tax',h:'Gain = lesser of realized gain or boot',b:'<p>No loss. Basis in boot property = FMV.</p>'}]},
  {l:'LIABILITIES',c:'',f:[{k:'calc',h:'Not boot (usual)',b:'<p>Reduce stock basis only. Liabilities over total basis of all property given: excess is gain. Tax avoidance purpose: all boot.</p>'}]},
  {l:'NEITHER',c:'',f:[{k:'ok',h:'No gain recognized'}]}
 ]},
 {k:'calc',h:'Initial stock basis',b:'<span class="f">AB of property + gain recognized − boot received − liabilities assumed by corp</span>'},
 {k:'calc',h:'Then, every year, in this order',b:'<ol><li>+ your share of all income (including tax exempt income) and any new capital contributions</li><li>− distributions (not below zero)</li><li>− nondeductible, non capital expenses</li><li>− losses and deductions (not below zero)</li></ol>'},
 {k:'q',h:'Losses exceed stock basis?',legs:[
  {l:'YES',c:'y',f:[{k:'calc',h:'Use debt basis next',b:'<p>Only your own direct loans to the corporation. Guarantees and corporate borrowing give nothing. Stock to zero, then debt to zero, then suspend. Later income restores debt basis first.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Loss deducted (then at risk, passive, excess business loss hurdles)'}]}
 ]},
 {k:'end',h:'Holding period and AAA',b:'<ul><li>Stock holding period tacks for capital and 1231 property; fresh for ordinary property and services.</li><li>Capital contributions raise stock basis but never raise AAA.</li><li>Suspended losses belong to you; they vanish if you sell the stock.</li></ul>'}
];

// ===== S CORP: contribution, entity =====
F.s_contrib_entity = [
 {k:'start',h:'S corporation issues stock'},
 {k:'ok',h:'No gain or loss on issuing stock (Section 1032)'},
 {k:'q',h:'Did Section 351 apply?',legs:[
  {l:'NO',c:'n',end:true,f:[{k:'calc',h:'Basis in property = FMV'}]},
  {l:'YES',c:'y',f:[]}
 ]},
 {k:'calc',h:'Basis in property',b:'<span class="f">Transferor\'s adjusted basis + gain the transferor recognized</span><p>Holding period tacks. Net built in loss from one transferor: basis capped at FMV unless the shareholder elects to cut stock basis instead.</p>'},
 {k:'q',h:'Did the corporation give boot?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Gain on appreciated boot property',b:'<p>As if sold; that gain flows through to the shareholders. No loss on depreciated boot property.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Nothing'}]}
 ]},
 {k:'q',h:'Was this corporation a C corporation before the S election?',legs:[
  {l:'YES',c:'y',f:[{k:'warn',h:'Track built in gains for 5 years',b:'<p>Built in gains tax at 21 percent on C period appreciation if sold or distributed within 5 years. Old E&amp;P stays on the books and changes the distribution ladder. LIFO recapture in the last C year.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No entity level tax, no E&P, ever'}]}
 ]},
 {k:'end',h:'Corporate side records',b:'<ul><li>AAA starts at zero and is never increased by contributions.</li><li>Services stock: deduct FMV as compensation; that deduction flows through.</li><li>Income and loss are allocated per share, per day, so contributions that change ownership mid year change the allocation from that date.</li></ul>'}
];

// ===== S CORP: nonliquidating, owner =====
F.s_nonliq_owner = [
 {k:'start',h:'You receive cash or property and keep your shares'},
 {k:'calc',h:'Step 1: bring stock basis up to date first',b:'<p>+ your share of the year\'s income, including the corporation\'s gain on any appreciated property it distributed, + contributions. Distributions are tested BEFORE this year\'s losses.</p>'},
 {k:'calc',h:'Step 2: amount distributed',b:'<span class="f">Cash + FMV of property − liabilities you take over</span>'},
 {k:'q',h:'Does the corporation have accumulated E&P from C corporation years?',legs:[
  {l:'NO',c:'',f:[{k:'tax',h:'Two layer ladder',b:'<ol><li>Tax free up to stock basis. Reduces stock basis. Debt basis is never touched by a distribution.</li><li>Excess over stock basis = capital gain.</li></ol>'}]},
  {l:'YES',c:'',f:[{k:'tax',h:'Four layer ladder',b:'<ol><li>AAA: tax free, reduces stock basis.</li><li>E&amp;P: taxable dividend, no basis change.</li><li>Remaining stock basis: tax free, reduces basis.</li><li>Excess: capital gain.</li></ol><p>Bypass election (all shareholders consent): take E&amp;P first to clear old C earnings and stop the passive income problem.</p>'}]}
 ]},
 {k:'end',h:'Finish the year',b:'<ul><li>Basis in property received = FMV. Holding period starts now.</li><li>After distributions: − nondeductible expenses, − losses (stock basis to zero, then debt basis, then suspend).</li><li>Share of ordinary business income is not self employment income; a more than 2 percent shareholder is taxed on fringe benefits.</li></ul>'}
];

// ===== S CORP: nonliquidating, entity =====
F.s_nonliq_entity = [
 {k:'start',h:'S corporation distributes cash or property'},
 {k:'q',h:'Cash or property?',legs:[
  {l:'CASH',c:'',end:true,f:[{k:'ok',h:'No gain or loss',b:'<p>AAA reduced by the cash (distributions cannot make AAA negative). No E&amp;P effect unless the distribution reaches the E&amp;P layer.</p>'}]},
  {l:'PROPERTY',c:'',f:[]}
 ]},
 {k:'q',h:'FMV greater than adjusted basis?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Gain recognized as if sold at FMV',b:'<p>The gain is NOT taxed to the corporation. It passes through to every shareholder pro rata (per share, per day), keeps its character (ordinary, 1245 recapture, 1231, capital), and increases their stock basis before the distribution is tested.</p>'}]},
  {l:'NO',c:'n',f:[{k:'warn',h:'Loss not recognized',b:'<p>Nothing passes through. The shareholder still takes FMV as basis, so the loss is lost.</p>'}]}
 ]},
 {k:'q',h:'Former C corporation within the 5 year recognition period, with gain that existed at conversion?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Built in gains tax',b:'<p>21 percent at the corporate level on the lesser of the built in gain or taxable income. The tax is treated as a loss that reduces the gain passed through.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No entity level tax'}]}
 ]},
 {k:'calc',h:'AAA effect',b:'<span class="f">+ gain passed through − FMV of property distributed (and cash)</span><p>AAA is reduced by FMV, the same amount the shareholder treats as distributed.</p>'},
 {k:'end',h:'Remember',b:'<ul><li>S years never create E&amp;P. Only C years do.</li><li>Distributions are not deductible and are not dividends unless they reach the C period E&amp;P layer.</li><li>Shareholder employees must be paid reasonable wages before distributions.</li></ul>'}
];

// ===== S CORP: liquidation, owner =====
F.s_liq_owner = [
 {k:'start',h:'You surrender all your stock as the S corporation liquidates'},
 {k:'calc',h:'Step 1: adjust stock basis for the flow through',b:'<p>+ your share of the corporation\'s gains on the liquidation (− your share of its losses), plus the year\'s other income and loss items.</p>'},
 {k:'calc',h:'Step 2: amount realized',b:'<span class="f">Cash + FMV of property received − liabilities you take over</span>'},
 {k:'calc',h:'Step 3: gain or loss on the stock',b:'<span class="f">Amount realized − adjusted stock basis (after step 1)</span>'},
 {k:'tax',h:'Capital gain or loss',b:'<p>Long term if held more than one year. Because the pass through gain already raised your basis, the same appreciation is taxed only once. Section 1244 ordinary loss can apply to qualifying stock.</p>'},
 {k:'end',h:'Basis and suspended losses',b:'<ul><li>Basis in property received = FMV. Holding period starts now.</li><li>Suspended losses: use them in the final year to the extent basis allows (the flow through gain often frees them). Whatever is still suspended is lost.</li><li>Debt basis: if a shareholder loan is repaid at less than face after basis reductions, gain results.</li></ul>'}
];

// ===== S CORP: liquidation, entity =====
F.s_liq_entity = [
 {k:'start',h:'S corporation distributes all assets and dissolves'},
 {k:'tax',h:'Every asset treated as sold at FMV: gain AND loss recognized',b:'<p>Both pass through to shareholders pro rata and keep their character (ordinary, 1245, 1231, capital). The corporation itself pays nothing unless an entity level tax applies.</p>'},
 {k:'q',h:'Built in gain from C years within the 5 year window?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Built in gains tax at 21 percent',b:'<p>Corporate level, reduces the gain passed through.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No entity level tax'}]}
 ]},
 {k:'q',h:'Loss asset going to a related (more than 50 percent) shareholder, not pro rata or disqualified property?',legs:[
  {l:'YES',c:'y',f:[{k:'warn',h:'Loss disallowed (Section 336 limits apply)',b:'<p>Same related party and 2 year built in loss rules as a C corporation.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Loss passes through'}]}
 ]},
 {k:'end',h:'What does not happen',b:'<ul><li>Old C period E&amp;P is not taxed as a dividend on liquidation; the shareholder is taxed on the stock, not the earnings.</li><li>AAA, E&amp;P, and suspended attributes end with the corporation.</li><li>Converting to an LLC or partnership is a liquidation: gains pass through, then capital gain or loss on the stock.</li></ul>'}
];

// ===== PARTNERSHIP: contribution, owner =====
F.p_contrib_owner = [
 {k:'start',h:'You contribute to a partnership or LLC in exchange for an interest'},
 {k:'q',h:'Property or services?',legs:[
  {l:'SERVICES',c:'n',f:[{k:'tax',h:'Capital interest for services: ordinary income',b:'<p>Income = FMV of the capital interest; that amount becomes your outside basis. A profits only interest: generally no income, zero basis.</p>'}]},
  {l:'PROPERTY',c:'y',f:[{k:'ok',h:'Section 721: no gain or loss',b:'<p>No control test, no percentage test, works at formation or any time later. The built in gain stays attached to you inside the partnership (704(c)).</p>'}]}
 ]},
 {k:'q',h:'Did the partnership take over a liability that was on the property (or on you)?',legs:[
  {l:'YES',c:'y',f:[{k:'calc',h:'Net the liability, do not just subtract it',b:'<span class="f">+ your share of ALL partnership liabilities (including the one you brought) − 100 percent of the liability you were relieved of</span><p>A net decrease is a deemed cash distribution. A net increase is a deemed cash contribution.</p>'}]},
  {l:'NO',c:'n',f:[{k:'calc',h:'Add your share of partnership liabilities',b:'<p>Recourse by economic risk of loss; nonrecourse by profit share.</p>'}]}
 ]},
 {k:'calc',h:'Outside basis',b:'<span class="f">Cash + AB of property + services income recognized + share of partnership liabilities − liabilities assumed by the partnership</span>'},
 {k:'q',h:'Does the net liability relief exceed your basis (result would be negative)?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Excess is capital gain',b:'<p>A deemed cash distribution larger than basis. Outside basis = 0.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No gain. Basis as computed, never below zero.'}]}
 ]},
 {k:'q',h:'Any of these exceptions?',b:'<ul><li>Disguised sale: contribution followed by a related distribution (presumed within 2 years)</li><li>Investment company partnership: diversifying marketable securities</li></ul>',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Gain recognized on the sale portion',b:'<p>Treated as a sale to the partnership to that extent.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Fully tax free'}]}
 ]},
 {k:'calc',h:'Keep outside basis current every year, in this order',b:'<ol><li>+ share of income (including tax exempt), contributions, increases in your liability share</li><li>− distributions (cash first, then the basis of property) and decreases in your liability share</li><li>− share of losses and nondeductible items (not below zero)</li></ol><p>Loss hurdles after basis: at risk (plain nonrecourse debt excluded), passive, excess business loss.</p>'},
 {k:'end',h:'Holding period, capital account, character',b:'<ul><li>Interest holding period tacks for capital and 1231 property; fresh for ordinary assets and services.</li><li>Capital account (book) = FMV contributed. Tax basis = carryover. The gap is your 704(c) built in gain or loss and comes back to you when the asset is sold or depreciated.</li><li>Your contributed inventory sold within 5 years is ordinary; contributed receivables are always ordinary.</li></ul>'}
];

// ===== PARTNERSHIP: contribution, entity =====
F.p_contrib_entity = [
 {k:'start',h:'Partnership receives property or services for an interest'},
 {k:'ok',h:'No gain or loss to the partnership',b:'<p>On receiving property or on issuing the interest. There is never an entity level tax.</p>'},
 {k:'q',h:'Property or services?',legs:[
  {l:'SERVICES',c:'n',f:[{k:'calc',h:'Deduct (or capitalize) the FMV of the capital interest',b:'<p>Ordinary compensation deduction, or a capital expenditure if the services were for organization or an asset.</p>'}]},
  {l:'PROPERTY',c:'y',f:[{k:'calc',h:'Inside basis = contributing partner\'s adjusted basis',b:'<p>Carryover basis plus any gain the partner recognized (disguised sale). Holding period tacks.</p>'}]}
 ]},
 {k:'q',h:'FMV different from basis at contribution (built in gain or loss)?',legs:[
  {l:'YES',c:'y',f:[{k:'warn',h:'Section 704(c) tracking',b:'<ul><li>Built in gain or loss is allocated to the contributing partner when the asset is sold or depreciated.</li><li>Built in loss can benefit only the contributor.</li><li>If the asset is distributed to a different partner within 7 years, the contributor recognizes the remaining built in gain.</li></ul>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Plain carryover basis, nothing to track'}]}
 ]},
 {k:'calc',h:'Character carries over',b:'<ul><li>Contributed unrealized receivables: always ordinary when collected or sold.</li><li>Contributed inventory: ordinary if sold within 5 years.</li><li>Contributed capital asset with a built in loss: capital loss to the extent of the built in loss for 5 years.</li></ul>'},
 {k:'end',h:'Liabilities and records',b:'<ul><li>Liabilities on contributed property become partnership liabilities and are allocated to partners (recourse by economic risk of loss, nonrecourse by profit share).</li><li>Book capital account credited at FMV; tax basis records carryover.</li><li>Partnership makes the elections: accounting method, depreciation, Section 179, Section 754.</li></ul>'}
];

// ===== PARTNERSHIP: nonliquidating, owner =====
F.p_nonliq_owner = [
 {k:'start',h:'You receive a distribution and remain a partner'},
 {k:'calc',h:'Step 1: outside basis just before the distribution',b:'<p>Beginning basis + share of income (including tax exempt) + contributions + increases in your share of liabilities. This year\'s losses are subtracted AFTER the distribution.</p>'},
 {k:'calc',h:'Step 2: cash distributed',b:'<span class="f">Money + FMV of marketable securities + any DECREASE in your share of partnership liabilities</span>'},
 {k:'q',h:'Cash greater than outside basis?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Excess = capital gain',b:'<p>Outside basis goes to zero. Any property received in the same distribution takes a zero basis.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No gain',b:'<p>Reduce outside basis by the cash.</p>'}]}
 ]},
 {k:'q',h:'Was property distributed too?',legs:[
  {l:'NO',c:'n',end:true,f:[{k:'end',h:'Done',b:'<p>Outside basis = before − cash (not below zero).</p>'}]},
  {l:'YES',c:'y',f:[{k:'ok',h:'No gain, no loss on property',b:'<p>Never, in a current distribution.</p>'}]}
 ]},
 {k:'calc',h:'Your basis in the property',b:'<span class="f">LESSER of (a) the partnership\'s basis in it, or (b) your remaining outside basis after cash</span>'},
 {k:'q',h:'Remaining outside basis covers the partnership\'s basis in everything received?',legs:[
  {l:'YES',c:'y',f:[{k:'ok',h:'Carryover basis in each asset',b:'<p>Outside basis reduced by the same amount.</p>'}]},
  {l:'NO',c:'n',f:[{k:'calc',h:'Allocate the limited basis',b:'<ol><li>Hot assets (receivables, inventory) first, up to the partnership\'s basis.</li><li>Whatever is left goes to other property.</li></ol><p>Shortfall within a class: assign first to assets with unrealized depreciation (up to that depreciation), then by relative adjusted basis. Outside basis ends at zero.</p>'}]}
 ]},
 {k:'end',h:'After the distribution',b:'<ul><li>Holding period of property tacks.</li><li>Inventory you received: ordinary if sold within 5 years. Receivables: always ordinary.</li><li>A guaranteed payment is NOT a distribution: ordinary income to you (self employment income if for services), deductible to the partnership.</li><li>Now subtract this year\'s losses, limited to the remaining basis.</li></ul>'}
];

// ===== PARTNERSHIP: nonliquidating, entity =====
F.p_nonliq_entity = [
 {k:'start',h:'Partnership distributes cash or property to a continuing partner'},
 {k:'ok',h:'General rule: no gain or loss to the partnership',b:'<p>Cash, appreciated property, depreciated property: nothing is recognized at the entity.</p>'},
 {k:'q',h:'Disproportionate distribution of hot assets (partner gets more or less than their share of receivables or inventory)?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Section 751(b): treated as a sale or exchange',b:'<p>Between the partner and the partnership for the shifted hot assets. Ordinary income results for whoever gave up hot assets.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'Pro rata, no recharacterization'}]}
 ]},
 {k:'q',h:'Is the property one that a different partner contributed within the last 7 years?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'704(c)(1)(B): contributor recognizes remaining built in gain',b:'<p>Also Section 737: a partner who contributed appreciated property within 7 years and now receives other property may recognize gain.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No precontribution gain triggered'}]}
 ]},
 {k:'q',h:'Section 754 election in effect (or a substantial basis reduction over 250,000)?',legs:[
  {l:'YES',c:'y',f:[{k:'calc',h:'734(b) inside basis adjustment',b:'<p>Adjust the basis of remaining partnership assets when the partner recognized gain or took a basis in the property different from the partnership\'s basis.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No inside basis adjustment'}]}
 ]},
 {k:'end',h:'Books after the distribution',b:'<ul><li>Capital account reduced by FMV distributed (book); the asset\'s tax basis simply leaves with the asset.</li><li>Guaranteed payments are deductible by the partnership and are not distributions.</li><li>Sale of property to a partner who owns more than 50 percent: loss disallowed.</li></ul>'}
];

// ===== PARTNERSHIP: liquidation, owner =====
F.p_liq_owner = [
 {k:'start',h:'Your entire partnership interest is liquidated'},
 {k:'calc',h:'Step 1: outside basis just before',b:'<p>Updated for the year\'s income through the date, contributions, and liability changes. Relief of your entire liability share counts as cash.</p>'},
 {k:'calc',h:'Step 2: cash received',b:'<span class="f">Money + marketable securities + decrease in your liability share</span>'},
 {k:'q',h:'Cash greater than outside basis?',legs:[
  {l:'YES',c:'y',end:true,f:[{k:'tax',h:'Excess = capital gain',b:'<p>Outside basis is zero. Any property received takes zero basis. Done.</p>'}]},
  {l:'NO',c:'n',f:[{k:'calc',h:'Reduce basis by cash',b:'<p>What is left must go somewhere.</p>'}]}
 ]},
 {k:'q',h:'Did you receive ONLY cash, unrealized receivables, and inventory (no other property)?',legs:[
  {l:'YES',c:'y',f:[
   {k:'q',h:'Remaining basis greater than the partnership\'s basis in the receivables and inventory?',legs:[
    {l:'YES',c:'y',f:[{k:'tax',h:'Capital LOSS = the difference',b:'<p>The only time a partner recognizes a loss on a distribution. Hot assets take the partnership\'s basis.</p>'}]},
    {l:'NO',c:'n',f:[{k:'calc',h:'Hot assets take the remaining basis',b:'<p>Stepped down, never up. No loss.</p>'}]}
   ]}
  ]},
  {l:'NO (other property too)',c:'n',f:[{k:'calc',h:'No loss. Other property absorbs ALL remaining basis',b:'<ol><li>Hot assets take the partnership\'s basis (never stepped up).</li><li>All remaining outside basis goes to the other property (substituted basis). It can be higher or lower than the partnership\'s basis.</li></ol>'}]}
 ]},
 {k:'calc',h:'Several "other" properties',b:'<p>Start each at carryover basis. An INCREASE is allocated first to appreciated assets up to their appreciation, then by relative FMV. A DECREASE is allocated first to depreciated assets up to their depreciation, then by relative adjusted basis.</p>'},
 {k:'end',h:'Result',b:'<ul><li>Outside basis ends at zero. Holding period of property tacks.</li><li>Retirement or death payments for your share of partnership property (736(b)) follow this tree. Other payments (736(a)) are ordinary income to you.</li><li>Contrast: in a current distribution property basis is capped at carryover; here it absorbs whatever is left.</li></ul>'}
];

// ===== PARTNERSHIP: liquidation, entity =====
F.p_liq_entity = [
 {k:'start',h:'Partnership pays out a partner completely (retirement, death, or full liquidation)'},
 {k:'ok',h:'No gain or loss to the partnership on the distribution'},
 {k:'q',h:'Retiring or deceased partner: what is the payment for?',legs:[
  {l:'PARTNERSHIP PROPERTY (736(b))',c:'',f:[{k:'calc',h:'Treated as a distribution',b:'<p>Not deductible by the partnership. The partner applies the liquidating distribution rules.</p>'}]},
  {l:'ANYTHING ELSE (736(a))',c:'',f:[{k:'tax',h:'Guaranteed payment or distributive share',b:'<p>Ordinary income to the partner; deductible by (or reduces income of) the partnership. Includes payments for unrealized receivables and unstated goodwill to a general partner of a service partnership.</p>'}]}
 ]},
 {k:'q',h:'Disproportionate hot assets in the payout?',legs:[
  {l:'YES',c:'y',f:[{k:'tax',h:'Section 751(b) sale or exchange',b:'<p>Ordinary income to whoever gave up the hot assets.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No recharacterization'}]}
 ]},
 {k:'q',h:'Section 754 election in effect (or substantial basis reduction over 250,000)?',legs:[
  {l:'YES',c:'y',f:[{k:'calc',h:'734(b) adjustment to remaining assets',b:'<p>For the partner\'s recognized gain or loss and any basis shift into the distributed property.</p>'}]},
  {l:'NO',c:'n',f:[{k:'ok',h:'No adjustment'}]}
 ]},
 {k:'end',h:'Afterwards',b:'<ul><li>The partnership continues with the remaining partners, or terminates if everyone is paid out.</li><li>The partnership year closes for the departing partner on the liquidation date (and at death).</li><li>Converting a partnership into a corporation uses the Section 351 rules, usually tax free.</li></ul>'}
];
window.TCP_TREES = F;
})();
