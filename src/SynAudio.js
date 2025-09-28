/* Copyright 2022-2023 Ethan Halsall
    
    This file is part of synaudio.
    
    synaudio is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    synaudio is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>
*/

import { decode } from "simple-yenc";
import Worker from "@eshaz/web-worker";

// prettier-ignore
const simd=async()=>WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]))

const wasmModule = new WeakMap();
const wasmHeapBase = new WeakMap();

/* WASM strings are embedded during the build, do not manually edit the below */
// BEGIN generated variables
const simdWasm = String.raw`dynEncode0164283d7f25dÅ×ÑedddereÄnããããããããããdfsegÉÒÚjÑÉÑÓÖÝfdfgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdn&e#inãoâlálàkßf¤¦bcccs¨ddddddT£¨ddddddddof¤f¤f¥f¬qdf¥eÏree¥u³h¤¦tá¦uáy¦Ôçx¦uàzzºzxá¦tá~z¦gç}áxz¥fØy¥fØ¥¤ÕÏdÎue¥fØvr|d¥¤Ïsqg¤soqndf¦dzg¤ffwÎpadddfadddaHeaoddfpaddtfaddtaHeaodtfpaddfaddaHeaodfpaddfaddaHeaodop¥¤Ïonr¥¤Ïnf¥¤Ïfz¦tàz·qdof¤z¾qdf¤~¦k¼qdsuvÐfÎ­ufsÎ¯Õqdxyg¤ppadfdradfdaHeaofdp¥tÎpr¥tÎry¦háy¦d¶qdo}´qexzàzowz¥fØoÎndfg¤foÎppfdfnÎfdöfdf¥hÎfz¦eàz¸qdooqvÎqvwÎw¦eà|¶qdopeoe©qddde¥fØqÎ­hãdef¥fØ¥hÏÐdÎ­i¥doe¥h­Ös¦eá¦eç~d¥Îod¥Înd¥tÎp¦çxr}g¤ây¦dzf¤s©h¤ddadfddy¥fØfÎadfdaHeaofdf¤x¦hµqdppadfdfpÎadfdaHeaofdx¦lµqdnnadfdfnÎadfdaHeaofdx¦pµqdooadfdfoÎadfdaHeaofdoxzµqeo~´hâziz¥fØdÎfffdyzà¥fØdÎfdöfdz¦eèoyzµqdyázwy¥fØvÎudfg¤fvÎrrfdfuÎtfdöfdrrfhtfhöfhf¥lÎfz¦fáz¦d¶qdooqwÎw¦eà}¶qdoof¤i¥f¬qdi¥eÏfhh¥u³h¤¦tá¦uáy¦Ôçx¦uàzzºzxá¦tá~z¦gç}áxz¥fØy¥fØ¥¤ÕÏgÎsh¥fØif|¥dwg¥¤Ïhq¦dg¤hoqngf¦dzg¤ffwÎpadddfadddaHeaoddfpaddtfaddtaHeaodtfpaddfaddaHeaodfpaddfaddaHeaodop¥¤Ïonr¥¤Ïnf¥¤Ïfz¦tàz·qdof¤z¾qdf¤~¦k¼qdhsiÐfÎ­sfhÎ¯Õqdxyg¤ppadfdradfdaHeaofdp¥tÎpr¥tÎry¦háy¦d¶qdo}´qexzàzowz¥fØoÎngfg¤foÎppfdfnÎfdöfdf¥hÎfz¦eàz¸qdooiqÎqiwÎw¦eà|¶qdopeoh©qdggh¥fØpÎ­hãghi¥fØ¥hÏÐgÎ­i¥doh¥h­Ör¦eá¦eç~g¥Îhg¥Îig¥tÎo¦çxf}¥dw¦dg¤ây¦dzf¤r©h¤ggadfdgy¥fØfÎadfdaHeaofdf¤x¦hµqdooadfdfoÎadfdaHeaofdx¦lµqdiiadfdfiÎadfdaHeaofdx¦pµqdhhadfdfhÎadfdaHeaofdoxzµqeo~´hâziz¥fØgÎfffdyzà¥fØgÎfdöfdz¦eèoyzµqdyázwy¥fØqÎsgfg¤fqÎnnfdfsÎvfdöfdnnfhvfhöfhf¥lÎfz¦fáz¦d¶qdoopwÎw¦eà}¶qdoo¥drm¥dfdl¥dfdjxfâj©h¤¦Ô¦dpeo¦df¤j¥e«h¤dfxçzg¤faÁfdaÃaTef¥lÎfz¦fáz¦d¶qdoaqlmnopqrsdefghijkaTeadxµqeoxáz¥fØdÎfg¤ffdf¥hÎfz¦eáz¦d¶qdoo¦df¤j¥e«h¤apddddddddddddddddgfxçzg¤faÁfdaÃaTef¥lÎfz¦fáz¦d¶qdoaqlmnopqrsdefghijkaTeadxµqeoxáz¥fØgÎfg¤ffdf¥hÎfz¦eáz¦d¶qdoox¦táj¦dj¥u­qd~aw¦dzgfg¤fadddaIeaJeaHefaddtaIeaJeaHefaddaIeaJeaHefaddaIeaJeaHef¥¤Ïfz¦tàz·qdo¥erx¦uá¦Ôç¦tàoyadaeöaföagöf¤xy»qdxxyá¦h¾hâapddddddddddddddddady¥fØgÎfaw¦àçzg¤fadfdaIeaJeaHef¥tÎfz¦ház¦d¶qdoaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHeadµqeyàiyoyázy¥fØgÎfg¤ffd÷øöf¥hÎfz¦eáz¦d¶qdoojj§ddä#ö¦dzrh¤awgfg¤ffadddaIeaoddffaddtaIeaodtffaddaIeaodffaddaIeaodf¥¤Ïfz¦tàz·qdooùf¤xz»qdxxzá¦gºhâz¥fØgÎfaw¦àçyg¤ffadfdaIeaofdf¥tÎfy¦háy¦d¶qdoµqezàizozáyz¥fØgÎfg¤fffd÷fdf¥hÎfy¦eáy¦d¶qdooejÏhõej«h¤h|k¥fØo§ddä£ùx¦uá¦Ôç¦tàlfdk{dn¦dg¤fâr©h¤apddddddddddddddddapdddddddddddddddd¦dpeoaw¦dz¥dfapddddddddddddddddapddddddddddddddddg¤fnÎeadddaIefgÎiadddaJeaHeeaddtaIeiaddtaJeaHeeaddaIeiaddaJeaHeeaddaIeiaddaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfz¦tàz·qdooye¥fØdÎifdadaeöaföagöadaeöaföagöf¤xy»qdxxyá~¦h¾hâapddddddddddddddddadapddddddddddddddddady¥fØfaw~¦àç}zg¤fnÎadfdaIefgÎadfdaJeaHef¥tÎfaJeaHez¦ház¦d¶qdoaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHeadaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHead}~µqey}àiyoyázy¥fØfg¤fnÎfd÷fgÎfdøöf¥hÎføöz¦eáz¦d¶qdooj¥fØiÎfdøøÄ©hámefdlfdionoÎn{à|¸qdoof¤k¥e±qdmfdekkÐiÎfhfh­keiÏhf¤j©h¤peo¦dyj¥e«h¤h¥fØdÎfapddddddddddddddddxçyzg¤faÁfdaÃaTef¥lÎfz¦fáz¦d¶qdoaqlmnopqrsdefghijkaTeadxyµqeoe¥fØy¥fØÎi¥fØÏdÎfxyázg¤ffdf¥hÎfz¦eáz¦d¶qdoohk³qdk|he¥fØi¥fØÏdÎo§ddä£ùx¦uá¦Ôç¦tàlfdg¤fâr©h¤apddddddddddddddddapdddddddddddddddd¦dpeoaw¦dzofgpapddddddddddddddddapddddddddddddddddg¤fadddaIepadddaJeaHefaddtaIepaddtaJeaHefaddaIepaddaJeaHefaddaIepaddaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfp¥¤Ïpz¦tàz·qdooye¥fØdÎhfdadaeöaföagöadaeöaföagöf¤xy»qdxxyá~¦h¾hâapddddddddddddddddadapddddddddddddddddady¥fØfaw~¦àç}zg¤foÎadfdaIefgÎadfdaJeaHef¥tÎfaJeaHez¦ház¦d¶qdoaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHeadaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHead}~µqey}àiyoyázy¥fØfg¤foÎfd÷fgÎfdøöf¥hÎføöz¦eáz¦d¶qdooj¥fØhÎfdøøÄ©hámefdlfdioo¥hÎo¦eà|¶qdoooo`;
const scalarWasm = String.raw`dynEncode0112b0cda4ccs/rrr!wwS-uw~swqqzwsqtswå$­R2SZ2S}32TkR2T32¹S32¿32S"|43R232323T3R22<22|4<¤J22<2<¤J22<2<¤J22<2<¤J24S"|324S"|32S"|32T42e22gRR22<2<¤J2S|32S|322T4g22|322|322 T4 d2Ti2¹S32<3!2¿323R22!2<¤4!JR2Tc22<2<¤J2Tc22<2<¤J2Tc22<2<¤J22|32T4Td R24TeT2T32T3R22|4<2¥422|4<¦2¤2<2¥4 2<¦¤2<2¥4!2<¦¤2<2¥4"2<¦¤322¦2¤2 2 ¦¤2!2!¦¤2"2"¦¤32S"|32T42e2TT42k22Tb222¹S4|<2¥422|<¦2¤322¦2¤32T32T2c22322¹S4|322|3R2<2¥42¦2<2¥4 2 ¦2¤¤322<¦2 2<¦2¤¤32S|32S|32T4Td22ÆUÑ¤4§Í22§Í±2Í´µÈµRT!3!VQ3+V3,R22¿2"22¿2"S32SH2SH2¿3 2WRT3T2 T32SaR232 2!43R2&2<Í²2<Í²2<Í²2<Í²3&2S"|32T4Td2b4WR2¹S2|323R2&2<Í²3&2S|32T4TdR2S[RT3232 2!43R2'2<Í²2<Í²2<Í²2<Í²3'2S"|32T4Td2WR2¹S2|3R2'2<Í²3'2S|32T4Td2 T32Å3%T2S[,2'È2%§3"T323R2<2"¥4$2$¦2#¤2<2"¥4#2#¦¤2<2"¥4#2#¦¤2<2"¥4#2#¦¤3#2S"|32T42eS32 TTT32'2Ê4'µÈ3"R22 k2 2T4b22¹S2|323R2<2"¥4$2$¦2#¤3#2S|32T4Td22322 Th2 2322¹4}S2|S2|3R2<2"¥4$2$¦2<2"¥4$2$¦2<2"¥4$2$¦2<2"¥4$2$¦2#¤¤¤¤3#2S"|32T4Td2%UÑ¤3%T32R23R22<2"¥J22<2"¥J22<2"¥J22<2"¥J2S"|32T42e2#2%§3#R22 k232 2T4bWR2232¹S2|3R22<2"¥J2S|32T4Td22 Th2 232¹S2|3R22<2"¥J22<2"¥J22<2"¥J22<2"¥J2S"|32T4Td22}3-2#£3"S322YR2-¿32S32S3.2+2'µ3(2¿3T3S323R2&2<Í³3)22|<Í3*2<3#222&2(´È2"2 "4%2#qW22H22%J2232)2*²3&22.|322|32242fR2S_222~4|42-22-[-322}3R2WR2,3&2 T3R2S[R2,3&T32S2|32,3&2 2!43R2&2<Í²2<Í²2<Í²2<Í²3&2S"|32T4Td2b2S2¹S|2S}2|3R2&2<Í²3&2S|32T4Td22a2S2S}2|32S32¿2¿32+2'µ3'R2&2<Í³3(22|<Í3)2<3#222&2'´È2"2 "4%2#qWR22H22%J2(2)²3&2S|32S|32T4Td`;
const sharedWasm = String.raw`dynEncode01643fb3d24fdÅ×ÑedddereÄnããããããããããdfvegÉÒÚjÑÉÑÓÖÝfgfäähgfedjleãd¥äìhokfmÇÓÖÖÉÐÅØÉddoÃÃÌÉÅÔÃÆÅ×Égdn&e#inãoâlálàkßf¤¦bcccs¨ddddddT£¨ddddddddof¤f¤f¥f¬qdf¥eÏree¥u³h¤¦tá¦uáy¦Ôçx¦uàzzºzxá¦tá~z¦gç}áxz¥fØy¥fØ¥¤ÕÏdÎue¥fØvr|d¥¤Ïsqg¤soqndf¦dzg¤ffwÎpadddfadddaHeaoddfpaddtfaddtaHeaodtfpaddfaddaHeaodfpaddfaddaHeaodop¥¤Ïonr¥¤Ïnf¥¤Ïfz¦tàz·qdof¤z¾qdf¤~¦k¼qdsuvÐfÎ­ufsÎ¯Õqdxyg¤ppadfdradfdaHeaofdp¥tÎpr¥tÎry¦háy¦d¶qdo}´qexzàzowz¥fØoÎndfg¤foÎppfdfnÎfdöfdf¥hÎfz¦eàz¸qdooqvÎqvwÎw¦eà|¶qdopeoe©qddde¥fØqÎ­hãdef¥fØ¥hÏÐdÎ­i¥doe¥h­Ös¦eá¦eç~d¥Îod¥Înd¥tÎp¦çxr}g¤ây¦dzf¤s©h¤ddadfddy¥fØfÎadfdaHeaofdf¤x¦hµqdppadfdfpÎadfdaHeaofdx¦lµqdnnadfdfnÎadfdaHeaofdx¦pµqdooadfdfoÎadfdaHeaofdoxzµqeo~´hâziz¥fØdÎfffdyzà¥fØdÎfdöfdz¦eèoyzµqdyázwy¥fØvÎudfg¤fvÎrrfdfuÎtfdöfdrrfhtfhöfhf¥lÎfz¦fáz¦d¶qdooqwÎw¦eà}¶qdoof¤i¥f¬qdi¥eÏfhh¥u³h¤¦tá¦uáy¦Ôçx¦uàzzºzxá¦tá~z¦gç}áxz¥fØy¥fØ¥¤ÕÏgÎsh¥fØif|¥dwg¥¤Ïhq¦dg¤hoqngf¦dzg¤ffwÎpadddfadddaHeaoddfpaddtfaddtaHeaodtfpaddfaddaHeaodfpaddfaddaHeaodop¥¤Ïonr¥¤Ïnf¥¤Ïfz¦tàz·qdof¤z¾qdf¤~¦k¼qdhsiÐfÎ­sfhÎ¯Õqdxyg¤ppadfdradfdaHeaofdp¥tÎpr¥tÎry¦háy¦d¶qdo}´qexzàzowz¥fØoÎngfg¤foÎppfdfnÎfdöfdf¥hÎfz¦eàz¸qdooiqÎqiwÎw¦eà|¶qdopeoh©qdggh¥fØpÎ­hãghi¥fØ¥hÏÐgÎ­i¥doh¥h­Ör¦eá¦eç~g¥Îhg¥Îig¥tÎo¦çxf}¥dw¦dg¤ây¦dzf¤r©h¤ggadfdgy¥fØfÎadfdaHeaofdf¤x¦hµqdooadfdfoÎadfdaHeaofdx¦lµqdiiadfdfiÎadfdaHeaofdx¦pµqdhhadfdfhÎadfdaHeaofdoxzµqeo~´hâziz¥fØgÎfffdyzà¥fØgÎfdöfdz¦eèoyzµqdyázwy¥fØqÎsgfg¤fqÎnnfdfsÎvfdöfdnnfhvfhöfhf¥lÎfz¦fáz¦d¶qdoopwÎw¦eà}¶qdoo¥drm¥dfdl¥dfdjxfâj©h¤¦Ô¦dpeo¦df¤j¥e«h¤dfxçzg¤faÁfdaÃaTef¥lÎfz¦fáz¦d¶qdoaqlmnopqrsdefghijkaTeadxµqeoxáz¥fØdÎfg¤ffdf¥hÎfz¦eáz¦d¶qdoo¦df¤j¥e«h¤apddddddddddddddddgfxçzg¤faÁfdaÃaTef¥lÎfz¦fáz¦d¶qdoaqlmnopqrsdefghijkaTeadxµqeoxáz¥fØgÎfg¤ffdf¥hÎfz¦eáz¦d¶qdoox¦táj¦dj¥u­qd~aw¦dzgfg¤fadddaIeaJeaHefaddtaIeaJeaHefaddaIeaJeaHefaddaIeaJeaHef¥¤Ïfz¦tàz·qdo¥erx¦uá¦Ôç¦tàoyadaeöaföagöf¤xy»qdxxyá¦h¾hâapddddddddddddddddady¥fØgÎfaw¦àçzg¤fadfdaIeaJeaHef¥tÎfz¦ház¦d¶qdoaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHeadµqeyàiyoyázy¥fØgÎfg¤ffd÷øöf¥hÎfz¦eáz¦d¶qdoojj§ddä#ö¦dzrh¤awgfg¤ffadddaIeaoddffaddtaIeaodtffaddaIeaodffaddaIeaodf¥¤Ïfz¦tàz·qdooùf¤xz»qdxxzá¦gºhâz¥fØgÎfaw¦àçyg¤ffadfdaIeaofdf¥tÎfy¦háy¦d¶qdoµqezàizozáyz¥fØgÎfg¤fffd÷fdf¥hÎfy¦eáy¦d¶qdooejÏhõej«h¤h|k¥fØo§ddä£ùx¦uá¦Ôç¦tàlfdk{dn¦dg¤fâr©h¤apddddddddddddddddapdddddddddddddddd¦dpeoaw¦dz¥dfapddddddddddddddddapddddddddddddddddg¤fnÎeadddaIefgÎiadddaJeaHeeaddtaIeiaddtaJeaHeeaddaIeiaddaJeaHeeaddaIeiaddaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfz¦tàz·qdooye¥fØdÎifdadaeöaföagöadaeöaföagöf¤xy»qdxxyá~¦h¾hâapddddddddddddddddadapddddddddddddddddady¥fØfaw~¦àç}zg¤fnÎadfdaIefgÎadfdaJeaHef¥tÎfaJeaHez¦ház¦d¶qdoaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHeadaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHead}~µqey}àiyoyázy¥fØfg¤fnÎfd÷fgÎfdøöf¥hÎføöz¦eáz¦d¶qdooj¥fØiÎfdøøÄ©hámefdlfdionoÎn{à|¸qdoof¤k¥e±qdmfdekkÐiÎfhfh­keiÏhf¤j©h¤peo¦dyj¥e«h¤h¥fØdÎfapddddddddddddddddxçyzg¤faÁfdaÃaTef¥lÎfz¦fáz¦d¶qdoaqlmnopqrsdefghijkaTeadxyµqeoe¥fØy¥fØÎi¥fØÏdÎfxyázg¤ffdf¥hÎfz¦eáz¦d¶qdoohk³qdk|he¥fØi¥fØÏdÎo§ddä£ùx¦uá¦Ôç¦tàlfdg¤fâr©h¤apddddddddddddddddapdddddddddddddddd¦dpeoaw¦dzofgpapddddddddddddddddapddddddddddddddddg¤fadddaIepadddaJeaHefaddtaIepaddtaJeaHefaddaIepaddaJeaHefaddaIepaddaJeaHeaJeaHeaJeaHeaJeaHeaJeaHef¥¤Ïfp¥¤Ïpz¦tàz·qdooye¥fØdÎhfdadaeöaföagöadaeöaföagöf¤xy»qdxxyá~¦h¾hâapddddddddddddddddadapddddddddddddddddady¥fØfaw~¦àç}zg¤foÎadfdaIefgÎadfdaJeaHef¥tÎfaJeaHez¦ház¦d¶qdoaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHeadaqlmnopqrsdefgdefgaHeaqhijkdefgdefgdefgaHead}~µqey}àiyoyázy¥fØfg¤foÎfd÷fgÎfdøöf¥hÎføöz¦eáz¦d¶qdooj¥fØhÎfdøøÄ©hámefdlfdioo¥hÎo¦eà|¶qdoooo`;
const simdHeapBase = 66560;
const scalarHeapBase = 66560;
const sharedHeapBase = 66560;
// END generated variables

export default class SynAudio {
  constructor(options = {}) {
    this._correlationSampleSize =
      options.correlationSampleSize > 0 ? options.correlationSampleSize : 11025;
    this._initialGranularity =
      options.initialGranularity > 0 ? options.initialGranularity : 16;
    this._correlationThreshold =
      options.correlationThreshold >= 0 ? options.correlationThreshold : 0.5;
    this._useSharedMemory = options.shared === true ? true : false;

    this._module = wasmModule.get(SynAudio);
    this._heapBase = wasmHeapBase.get(SynAudio);
    if (!this._module) {
      if (this._useSharedMemory) {
        this._module = WebAssembly.compile(decode(sharedWasm));
        this._heapBase = Promise.resolve(sharedHeapBase);
      } else {
        this._module = simd().then((simdSupported) =>
          simdSupported
            ? WebAssembly.compile(decode(simdWasm))
            : WebAssembly.compile(decode(scalarWasm)),
        );
        this._heapBase = simd().then((simdSupported) =>
          simdSupported ? simdHeapBase : scalarHeapBase,
        );
      }
      wasmModule.set(this._module);
      wasmHeapBase.set(this._heapBase);
    }

    this.SynAudioWorker = function SynAudioWorker(
      module,
      heapBase,
      useSharedMemory,
      correlationSampleSize,
      initialGranularity,
    ) {
      this._sourceCache = new Map();

      // correlation sample size must not exceed the size of each audio clip
      this._getCorrelationSampleSize = (a, b) =>
        Math.min(
          a.samplesDecoded,
          b.samplesDecoded,
          this._correlationSampleSize,
        );

      // initial granularity must not exceed the size of each audio clip
      this._getInitialGranularity = (a, b) =>
        Math.min(a.samplesDecoded, b.samplesDecoded, this._initialGranularity);

      this._setAudioDataOnHeap = (input, memory, heapPos) => {
        const output = new Float32Array(memory.buffer);
        let floatPos = heapPos / this._floatByteLength;

        // copy each channel
        for (let i = 0; i < input.length; i++) {
          heapPos += input[i].length * this._floatByteLength;
          output.set(input[i], floatPos);
          floatPos += input[i].length;
        }

        return heapPos;
      };

      /*
       * Memory Map (starting at heapBase)
       * float* varyingLength baseData
       *
       * for each comparisonData entry:
       * float* varyingLength comparisonData
       * float* 4 bytes       bestCorrelation
       * long*  4 bytes       bestSampleOffset
       */
      this._initWasmMemory = (a, bArray, heapBase) => {
        const aLen =
          a.samplesDecoded * a.channelData.length * this._floatByteLength;
        const bArrayLen = bArray.reduce(
          (acc, b) =>
            b.data.samplesDecoded *
              b.data.channelData.length *
              this._floatByteLength +
            acc,
          0,
        );
        const bestCorrelationLen = bArray.length * this._floatByteLength;
        const bestSampleOffsetLen = bArray.length * this._unsignedIntByteLength;

        const memoryPages =
          4 +
          (heapBase +
            aLen +
            bArrayLen +
            bestCorrelationLen +
            bestSampleOffsetLen) /
            this._pageSize;

        return new WebAssembly.Memory({
          initial: memoryPages,
          maximum: memoryPages,
          shared: this._useSharedMemory,
        });
      };

      this._setBaseAudioOnHeap = (a, memory, aPtr) => {
        const nextPtr = this._setAudioDataOnHeap(a.channelData, memory, aPtr);
        return [aPtr, nextPtr];
      };

      this._setComparisonAudioOnHeap = (b, memory, bPtr) => {
        const bestCorrelationPtr = this._setAudioDataOnHeap(
          b.channelData,
          memory,
          bPtr,
        );
        const bestSampleOffsetPtr = bestCorrelationPtr + this._floatByteLength;
        const nextPtr = bestSampleOffsetPtr + this._floatByteLength;
        return [bPtr, bestCorrelationPtr, bestSampleOffsetPtr, nextPtr];
      };

      this._executeAsWorker = (functionName, params) => {
        let source = this._sourceCache.get(functionName);

        if (!source) {
          let type = "text/javascript",
            isNode,
            webworkerSourceCode =
              "'use strict';" +
              `(${((
                SynAudioWorker,
                functionName,
                useSharedMemory,
                correlationSampleSize,
                initialGranularity,
              ) => {
                self.onmessage = (msg) => {
                  const worker = new SynAudioWorker(
                    Promise.resolve(msg.data.module),
                    Promise.resolve(msg.data.heapBase),
                    useSharedMemory,
                    correlationSampleSize,
                    initialGranularity,
                  );

                  worker._workerMethods
                    .get(functionName)
                    .apply(null, msg.data.params)
                    .then((results) => {
                      self.postMessage(results);
                    });
                };
              }).toString()})(${SynAudioWorker.toString()}, "${functionName}", ${this._useSharedMemory}, ${
                this._correlationSampleSize
              }, ${this._initialGranularity})`;

          try {
            isNode = typeof process.versions.node !== "undefined";
          } catch {}

          source = isNode
            ? `data:${type};base64,${Buffer.from(webworkerSourceCode).toString(
                "base64",
              )}`
            : URL.createObjectURL(new Blob([webworkerSourceCode], { type }));

          this._sourceCache.set(functionName, source);
        }

        const worker = new (globalThis.Worker || Worker)(source, {
          name: "SynAudio",
        });

        const result = new Promise((resolve) => {
          worker.onmessage = (message) => {
            worker.terminate();
            resolve(message.data);
          };
        });

        Promise.all([this._module, this._heapBase]).then(
          ([module, heapBase]) => {
            worker.postMessage({
              module,
              heapBase,
              params,
            });
          },
        );

        return result;
      };

      this._runCorrelate = (
        memory,
        aPtr,
        aSamplesDecoded,
        aChannelDataLength,
        bPtr,
        bSamplesDecoded,
        bChannelDataLength,
        correlationSampleSize,
        initialGranularity,
        bestCorrelationPtr,
        bestSampleOffsetPtr,
      ) => {
        return this._module
          .then((module) =>
            WebAssembly.instantiate(module, {
              env: { memory },
            }),
          )
          .then(({ exports }) => {
            const instanceExports = new Map(Object.entries(exports));

            const correlate = instanceExports.get("correlate");
            const heapView = new DataView(memory.buffer);

            correlate(
              aPtr,
              aSamplesDecoded,
              aChannelDataLength,
              bPtr,
              bSamplesDecoded,
              bChannelDataLength,
              correlationSampleSize,
              initialGranularity,
              bestCorrelationPtr,
              bestSampleOffsetPtr,
            );

            const bestCorrelation = heapView.getFloat32(
              bestCorrelationPtr,
              true,
            );
            const bestSampleOffset = heapView.getUint32(
              bestSampleOffsetPtr,
              true,
            );

            return {
              correlation: bestCorrelation,
              sampleOffset: bestSampleOffset,
            };
          });
      };

      this._sync = (a, b) => {
        return this._heapBase.then((heapBase) => {
          const memory = this._initWasmMemory(a, [{ data: b }], heapBase);

          let aPtr, bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition;
          [aPtr, heapPosition] = this._setBaseAudioOnHeap(a, memory, heapBase);
          [bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition] =
            this._setComparisonAudioOnHeap(b, memory, heapPosition);

          const correlationSampleSize = this._getCorrelationSampleSize(a, b);
          const initialGranularity = this._getInitialGranularity(a, b);

          return this._runCorrelate(
            memory,
            aPtr,
            a.samplesDecoded,
            a.channelData.length,
            bPtr,
            b.samplesDecoded,
            b.channelData.length,
            correlationSampleSize,
            initialGranularity,
            bestCorrelationPtr,
            bestSampleOffsetPtr,
          );
        });
      };

      this._syncOneToMany = (
        a,
        bArray,
        threads = 1,
        onProgressUpdate = () => {},
      ) => {
        return this._heapBase.then((heapBase) => {
          const memory = this._initWasmMemory(a, bArray, heapBase);

          // build the parameters, copy the data to the heap
          let aPtr, bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition;
          [aPtr, heapPosition] = this._setBaseAudioOnHeap(a, memory, heapBase);

          const syncParameters = bArray.map((b) => {
            [bPtr, bestCorrelationPtr, bestSampleOffsetPtr, heapPosition] =
              this._setComparisonAudioOnHeap(b.data, memory, heapPosition);

            const correlationSampleSize = this._getCorrelationSampleSize(
              a,
              b.data,
            );
            const initialGranularity = this._getInitialGranularity(a, b.data);

            // optionally set boundaries for the base data
            let syncStart = b.syncStart || 0;
            let syncEnd = b.syncEnd || a.samplesDecoded;
            if (syncEnd - syncStart < b.data.samplesDecoded) {
              syncStart = 0;
              syncEnd = a.samplesDecoded;
            }

            const baseOffset = Math.min(
              a.samplesDecoded,
              Math.max(0, syncStart),
            );
            const baseSampleLength = Math.min(
              a.samplesDecoded,
              Math.max(0, syncEnd),
            );

            const params = [
              memory,
              aPtr + baseOffset * a.channelData.length * this._floatByteLength,
              baseSampleLength - baseOffset,
              a.channelData.length,
              bPtr,
              b.data.samplesDecoded,
              b.data.channelData.length,
              correlationSampleSize,
              initialGranularity,
              bestCorrelationPtr,
              bestSampleOffsetPtr,
            ];
            return [params, baseOffset, b.name];
          });

          a = null;
          bArray = null;

          // start tasks concurrently, limiting the number of threads
          let taskIndex = 0;
          let activeCount = 0;
          let doneCount = 0;
          const results = new Array(syncParameters.length);
          const running = [];

          return new Promise((resolve, reject) => {
            onProgressUpdate(0);
            const runNext = () => {
              // All tasks have been started
              if (taskIndex >= syncParameters.length) {
                if (activeCount === 0) resolve(results);
                return;
              }

              // Start a new task
              const currentIndex = taskIndex++;
              activeCount++;

              const promise = this._executeAsWorker(
                "_runCorrelate",
                syncParameters[currentIndex][0],
              )
                .then((result) => {
                  result.sampleOffset += syncParameters[currentIndex][1];
                  result.name = syncParameters[currentIndex][2];
                  results[currentIndex] = result;
                })
                .catch(reject)
                .finally(() => {
                  activeCount--;
                  doneCount++;
                  onProgressUpdate(doneCount / results.length);
                  runNext(); // Start the next task
                });

              running.push(promise);

              // If we haven't reached the limit, start another one
              if (activeCount < threads) runNext();
            };

            runNext();
          });
        });
      };

      this._syncWorkerConcurrent = (a, b, threads) => {
        const promises = [];
        const lengths = [0];

        // |-----------|       |-----------|     "end"
        // "start"   |-|---------|       |-----------|
        //           | |
        //           | |correlationSampleSize

        // split a buffer into equal chunks for threads
        // overlap at the start of the buffer by correlation sample size
        // overlap at the end of the buffer by correlation sample size

        // initial granularity  low -> high, more -> less threads
        // correlation sample   low -> high, less -> more threads
        // file size            low -> high, less -> more threads

        const correlationSampleSize = this._getCorrelationSampleSize(a, b);

        // rough estimate for a good max thread count for performance
        const maxThreads =
          (Math.log(a.samplesDecoded * correlationSampleSize) /
            Math.log(this._initialGranularity + 1)) *
          Math.log(correlationSampleSize / 10000 + 1);

        threads = Math.max(
          Math.round(
            Math.min(
              threads,
              maxThreads,
              a.samplesDecoded / correlationSampleSize / 4,
            ),
          ),
          1,
        );

        const aLength = Math.ceil(a.samplesDecoded / threads);

        let offset = 0;
        for (let t = 0; t < threads; t++) {
          const aSplit = {
            channelData: [],
          };

          for (let i = 0; i < a.channelData.length; i++) {
            const cutChannel = a.channelData[i].subarray(
              offset,
              offset + aLength + correlationSampleSize,
            );
            aSplit.channelData.push(cutChannel);
            aSplit.samplesDecoded = cutChannel.length;
          }

          offset += aLength - correlationSampleSize;
          lengths.push(offset);

          promises.push(this._syncWorker(aSplit, b));
        }

        return Promise.all(promises).then((results) => {
          // find the result with the highest correlation and calculate the offset relative to the input data
          let bestResultIdx = 0;
          let bestCorrelation = -1;
          for (let i = 0; i < results.length; i++)
            if (results[i].correlation > bestCorrelation) {
              bestResultIdx = i;
              bestCorrelation = results[i].correlation;
            }

          return {
            correlation: results[bestResultIdx].correlation,
            sampleOffset:
              results[bestResultIdx].sampleOffset + lengths[bestResultIdx],
          };
        });
      };

      this._syncWorker = (a, b) => {
        return this._executeAsWorker("_sync", [a, b]);
      };

      this._syncWorkerConcurrentMain = (a, b, threads) => {
        // can't serialize the webworker polyfill in nodejs
        return globalThis.Worker
          ? this._executeAsWorker("_syncWorkerConcurrent", [a, b, threads])
          : this._syncWorkerConcurrent(a, b, threads);
      };

      // constructor

      // needed to serialize minified code when methods are referenced as a string
      // prettier-ignore
      this._workerMethods = new Map([
        ["_sync", this._sync],
        ["_runCorrelate", this._runCorrelate],
        ["_syncOneToMany", this._syncOneToMany],
        ["_syncWorker", this._syncWorker],
        ["_syncWorkerConcurrent", this._syncWorkerConcurrent],
      ]);

      this._module = module;
      this._heapBase = heapBase;
      this._useSharedMemory = useSharedMemory;
      this._correlationSampleSize = correlationSampleSize;
      this._initialGranularity = initialGranularity;

      this._pageSize = 64 * 1024;
      this._floatByteLength = Float32Array.BYTES_PER_ELEMENT;
      this._unsignedIntByteLength = Uint32Array.BYTES_PER_ELEMENT;
    };

    this._instance = new this.SynAudioWorker(
      this._module,
      this._heapBase,
      this._useSharedMemory,
      this._correlationSampleSize,
      this._initialGranularity,
    );
  }

  async syncWorkerConcurrent(a, b, threads) {
    return this._instance._syncWorkerConcurrentMain(
      a,
      b,
      threads >= 1 ? threads : 1,
    );
  }

  async syncWorker(a, b) {
    return this._instance._syncWorker(a, b);
  }

  async sync(a, b) {
    return this._instance._sync(a, b);
  }

  async syncOneToMany(a, bArray, threads, onProgressUpdate) {
    const result = this._instance._syncOneToMany(
      a,
      bArray,
      threads,
      onProgressUpdate,
    );
    a = null;
    bArray = null;
    return result;
  }

  async syncMultiple(clips, threads) {
    threads = threads >= 1 ? threads : 8;

    const workers = [];
    const graph = [];

    let notify = () => {},
      wait = Promise.resolve(),
      runningThreads = 0;

    const resetNotify = () => {
      wait = new Promise((resolve) => {
        notify = resolve;
      });
    };

    for (let i = 0; i < clips.length; i++) graph.push({ vertex: {} });

    for (let v = 0; v < clips.length; v++) {
      const vertexClip = clips[v];
      const vertex = graph[v].vertex;

      vertex.name = vertexClip.name;
      vertex.samplesDecoded = vertexClip.data.samplesDecoded;
      vertex.edges = new Set();

      for (let e = 0; e < clips.length; e++) {
        if (v === e) continue;

        const edgeClip = clips[e];
        const edge = graph[e];

        runningThreads++;
        workers.push(
          this.syncWorker(vertexClip.data, edgeClip.data).then(
            (correlationResult) => {
              if (correlationResult.correlation > this._correlationThreshold) {
                vertex.edges.add({
                  parent: vertex,
                  vertex: edge.vertex,
                  samplesDecoded: edgeClip.data.samplesDecoded,
                  ...correlationResult,
                });
              }
              runningThreads--;
              notify();
            },
          ),
        );

        if (runningThreads >= threads) {
          resetNotify();
          await wait;
        }
      }
    }

    await Promise.all(workers);

    // prettier-ignore
    const weighResults = (a, b) => {
      if (a.parent && b.parent && a.parent.samplesDecoded !== b.parent.samplesDecoded) return a.parent.samplesDecoded > b.parent.samplesDecoded;
      if (a.correlation !== b.correlation) return a.correlation > b.correlation;
      if (a.sampleOffset !== b.sampleOffset) return a.sampleOffset > b.sampleOffset;
      return a.vertex && b.vertex && a.vertex.name.localeCompare(b.vertex.name) < 0;
    };

    // detect cycles and weigh for which edge to remove
    const path = new Map();
    const cycles = new Set();

    const detectCycle = (vertex) => {
      for (const edge of vertex.edges.values()) {
        if (path.has(vertex)) return path.get(vertex);

        path.set(vertex, edge);

        const cycleStartEdge = detectCycle(edge.vertex);
        const cycleEndEdge = edge;

        if (cycleStartEdge) {
          let keep, remove;
          if (weighResults(cycleStartEdge, cycleEndEdge)) {
            keep = cycleStartEdge;
            remove = cycleEndEdge;
          } else {
            keep = cycleEndEdge;
            remove = cycleStartEdge;
          }

          if (!remove.cycleWith) {
            remove.cycleWith = new Set();
            cycles.add(remove);
          }

          remove.cycleWith.add(keep);

          if (keep.cycleWith) {
            keep.cycleWith.delete(remove);
          }
        }

        path.delete(vertex);
      }
    };

    for (const { vertex } of graph) detectCycle(vertex);

    // delete any cycles
    for (const edge of cycles)
      if (edge.cycleWith.size) edge.parent.edges.delete(edge);

    // find the root elements
    const roots = new Set();
    for (const v of graph) roots.add(v.vertex);
    for (const v of graph)
      for (const edge of v.vertex.edges) roots.delete(edge.vertex);

    // build a unique sequence of matches for each root
    const traverseRoot = (path, root, edges, sampleOffsetFromRoot = 0) => {
      for (const edge of edges) {
        if (
          !(path.has(edge.vertex) && weighResults(path.get(edge.vertex), edge))
        )
          path.set(edge.vertex, {
            name: edge.vertex.name,
            correlation: edge.correlation,
            sampleOffset: sampleOffsetFromRoot + edge.sampleOffset,
          });

        traverseRoot(
          path,
          root,
          edge.vertex.edges,
          sampleOffsetFromRoot + edge.sampleOffset,
        );
      }
    };

    const results = [];

    for (const root of roots) {
      const path = new Map();
      path.set(root, {
        name: root.name,
        sampleOffset: 0,
      });
      traverseRoot(path, root, root.edges);

      results.push(
        [...path.values()].sort(
          (a, b) =>
            a.sampleOffset - b.sampleOffset ||
            (a.correlation || 0) - (b.correlation || 0) ||
            b.name.localeCompare(a.name),
        ),
      );
    }

    return results;
  }
}
