// based on Nathan Ford's Ragadjust 
// https://github.com/nathanford/ragadjust
// Forked by Yann Trividic and Nicolas Taffin
// https://github.com/yanntrividic/ragadjustfr

const arts = ["un", "une", "le", "la", "les", "du", "de", "des", "au", "aux"];
const dets = ["ce", "ces", "cet", "cette", "mes", "tes", "ses", "mon", "ton", "ma", "ta", "son", "sa", "notre", "votre", "leur", "nos", "vos", "leurs"];
const prons = ["je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles"];
const conjs = ["mais", "où", "et", "donc", "or", "ni", "car", "ou", "que"];
const short = ["à", "y", "en", "de", "sur", "par", "a", "Il", "se", "il"];
const preps = ["après", "avant", "avec", "chez", "concernant", "contre", "dans", "depuis", "derrière", "dès", "durant", "entre", "hormis", "jusqu'à", "jusque", "loin", "malgré", "moyennant", "outre", "parmi", "pour", "près", "sans", "selon", "sous", "suivant", "touchant", "très", "vers"];

const case_sensitivity = true;

function make_case_sensitive(l) {
	let title_case = [];
	l.forEach(function (item, i) {
		var word = l[i];
		word = word[0].toUpperCase() + word.slice(1);
		title_case.push(word);
	});
	return l.concat(title_case);
}

function get_regex_from_array_of_words(l, exceptions) {
	exceptions.forEach(function (item, i) {
		if (l.indexOf(item) != -1) {
			l.splice(l.indexOf(item), 1);
		}
	});
	let reg = case_sensitivity ? make_case_sensitive(l).join("|") : l.join("|");
	return reg;
}

function build_regex_from_words(l, exceptions) {
	// Accepte les espaces normaux ET les espaces insécables dans le pattern
	// Mais exclut les spans i_space existants
	return new RegExp("(\\s|^|>)(?!<span class=\"i_space)(((" + get_regex_from_array_of_words(l, exceptions) + ")(\\s))+)", 'gi');
}

function processSelectors(string) {
	let selectors = string.split(",");
	for(let i = 0 ; i < selectors.length ; i++) {
		selectors[i] = selectors[i].replace(/^\s*(.*)\s*$/, "$1") + ":not([text-align=\"justify\"])";
	}
	string = selectors.join(",")
	return string;
}

export default function ragadjust(s, method, exceptions = [], content = null) {

	let doc;
	if(content) {
		doc = content;
	} else {
		doc = document;
	}
	
	if (doc.querySelectorAll) {
		s = processSelectors(s);
		var eles = doc.querySelectorAll(s),
			elescount = eles.length,

			dictionary = {
				"articles": build_regex_from_words(arts, exceptions),
				"determiners": build_regex_from_words(dets, exceptions),
				"pronouns": build_regex_from_words(prons, exceptions),
				"conjunctions": build_regex_from_words(conjs, exceptions),
				"short_prepositions": build_regex_from_words(short, exceptions),
				"prepositions": build_regex_from_words(preps, exceptions),
			},

			// Mise à jour pour accepter les espaces insécables existants
			smallwords = /(\s|&#160;|&nbsp;)(([a-zA-ZÀ-ž-_(]{1,2}('|')*[a-zA-ZÀ-ž-_,;]{0,1}?(\s|&#160;|&nbsp;))+)/gi,

			dashes = /([-–—])(\s|&#160;|&nbsp;)/gi,

			emphasis = /(<(strong|em|b|i)>)(([^\s]+(\s|&#160;|&nbsp;)*){2,3})?(<\/(strong|em|b|i)>)/gi;

		while (elescount-- > 0) {

			var ele = eles[elescount],
				elehtml = ele.innerHTML;
			
			// Nettoyer d'abord les espaces insécables existants
			elehtml = elehtml.replace(/&#160;/g, ' ');
			elehtml = elehtml.replace(/&nbsp;/g, ' ');
			
			for (const [key, value] of Object.entries(dictionary)) {
				
				if (method.indexOf(key) != -1 || method.indexOf('all') != -1) 
					elehtml = elehtml.replace(value, function(contents, p1, p2) {
						// Remplace UNIQUEMENT les espaces normaux par des insécables
						return p1 + p2.replace(/\s(?!&#160;|&nbsp;)/gi, '&#160;');
					});
			}		

			if (method.indexOf('small-words') != -1 || method.indexOf('all') != -1) 
				elehtml = elehtml.replace(smallwords, function(contents) {
					// Remplace UNIQUEMENT les espaces normaux
					return contents.replace(/\s(?!&#160;|&nbsp;)/gi, '&#160;');
				});

			if (method.indexOf('dashes') != -1 || method.indexOf('all') != -1) 
				elehtml = elehtml.replace(dashes, function(contents) {
					return contents.replace(/\s(?!&#160;|&nbsp;)/gi, '&#160;');
				}); 

			if (method.indexOf('emphasis') != -1 || method.indexOf('all') != -1) 
				elehtml = elehtml.replace(emphasis, function(contents, p1, p2, p3, p4, p5) {
					return p1 + p3.replace(/\s(?!&#160;|&nbsp;)/gi, '&#160;') + p5;
				});

			// Nettoyage final : supprimer les espaces normaux après les insécables
			elehtml = elehtml.replace(/&#160;(\s|&#160;|&nbsp;)+/g, '&#160;');
			elehtml = elehtml.replace(/&nbsp;(\s|&#160;|&nbsp;)+/g, '&nbsp;');
			
			// Remplacer les &#160; par des spans avec classe
			elehtml = elehtml.replace(/&#160;/g, '<span class="i_space no-break-space ragadjust">&nbsp;</span>');

			ele.innerHTML = elehtml;
		}
	}
};