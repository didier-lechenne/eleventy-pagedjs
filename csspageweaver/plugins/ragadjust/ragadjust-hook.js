/**
 * @name Ragadjust
 * @author Nicolas Taffin
 * @author Yann Trividic
 * Based on Nathan Ford's Ragadjust
 * @see { @link https://github.com/yanntrividic/ragadjustfr }
 * @see { @link https://gitlab.com/csspageweaver/plugins/ragadjust }
 */

import { Handler } from "../../../lib/paged.esm.js";
import ragadjust from './ragadjust.js';

export default class ragadjustHook extends Handler {

  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.parameters = {}
    this.parameters.selectors = cssPageWeaver.features.ragadjust.parameters?.selectors || "h1,h2,h3,h4,h5,h6,p"
    this.parameters.exeptions = cssPageWeaver.features.ragadjust.parameters?.exeptions || ["determiners", "articles", "short_prepositions", "pronouns"]
  }

  beforeParsed(content) {
        console.log('Sections trouvées:', content.querySelectorAll('section[data-template] p').length);

    ragadjust(this.parameters.selectors, this.parameters.exeptions, [], content);
  }

}