/**
 * Normalize strings for odd charachters or spelling mistakes, perform some basic stemming and text normalization
 * @param   {Array} arr [Array of strings to correct]
 * @returns {Array} cleanStrArr [new array of normalized strings]
 */
var clean = function(arr){
	//new array
	var cleanStrArr = [];
	
	for(var i = 0;i<arr.length;i++){
		var a = arr[i].split(/\s+/);
		for(var j = 0;j<a.length;j++){
			//Remove all the ' and "
			var s = a[j].replace(/["'](?![\s])/g,'');
	
			//Remove all non letters from the string
			 s = (a[j].replace(/[^A-Za-z\.]/g,''));
			//convert abbreviatons to standard
			s = _handleAbbreivations(s);
			
			//AFTER the abbreviations (they are case sensetive) we will convert the strings to lowercase
			s = s.toLowerCase()
			
			s = s.replace('.','');
			// only use the word if it contains a vowel
			if(s.match(/[aeiou]/)) cleanStrArr.push(s); 
		}
	}
	
	/**
	 * Converts common abbreviations into their strings
	 * @param   {String} str [String to check for possible abbrv.]
	 * @returns {String} s [New string that has been converted to full length from abbrevitaon, returns original is no abbreviation found]
	 */
	function _handleAbbreivations(str){
		var s = '';
		var abbreviations = [
			['A.B.','Artium Baccalaureus [Bachelor of Arts]'],['abbr.','abbreviation(s), abbreviated'],['Acad.','Academy'],['A.D.','anno Domini [in the year of the Lord]'],['alt.','altitude'],['A.M.','ante meridiem [before noon]; Artium Magister [Master of Arts]'],['AM','amplitude modulation'],['Aug.','August'],['Ave.','Avenue'],['AWOL','absent without leave'],['b.','born, born in'],['B.A.','Bachelor of Arts'],['B.C.','Before Christ'],['b.p.','boiling point'],['B.S.','Bachelor of Science'],['Btu','British thermal unit(s)'],['C','Celsius(centigrade)'],['c.','circa [about]'],['cal','calorie(s)'],['Capt.','Captain'],['cent.','century, centuries'],['cm','centimeter(s)'],['co.','county'],['Col.','Colonel; Colossians'],['Comdr.','Commander'],['Corp.','Corporation'],['Cpl.','Corporal'],['cu','cubic'],['d.','died, died in'],['D.C.','District of Columbia'],['Dec.','December'],['dept.','department'],['dist.','district'],['div.','division'],['Dr.','doctor'],['E','east, eastern'],['ed.','edited, edition, editor(s)'],['est.','established; estimated'],['et al.','et alii [and others]'],['F','Fahrenheit'],['Feb.','February'],['fl.','floruit [flourished]'],['fl','oz	fluid ounce(s)'],['FM','frequency modulation'],['ft','foot, feet'],['gal.','gallon(s)'],['Gen.','General, Genesis'],['GMT','Greenwich mean time'],['GNP','gross national product'],['GOP','Grand Old Party(Republican Party)'],['Gov.','governor'],['grad.','graduated, graduated at'],['H','hour(s)'],['Hon.','the Honorable'],['hr','hour(s)'],['in.','inch(es)'],['inc.','incorporated'],['Inst.','Institute, Institution'],['IRA','Irish Republican Army'],['IRS','Internal Revenue Service'],['Jan.','January'],['Jr.','Junior'],['K','Kelvin'],['kg','kilogram(s)'],['km','kilometer(s)'],['£','libra [pound], librae [pounds]'],['lat.','latitude'],['lb','libra [pound], librae [pounds]'],['Lib.','Library'],['long.','longitude'],['Lt.','Lieutenant'],['Ltd.','Limited'],['m','meter(s)'],['M','minute(s)'],['M.D.','Medicinae Doctor [Doctor of Medicine]'],['mg','milligram(s)'],['mi','mile(s)'],['min','minute(s)'],['mm','millimeter(s)'],['mph','miles per hour'],['Mr.','Mister(always abbreviated)'],['Mrs.','Mistress(always abbreviated)'],['Msgr','Monsignor'],['mt.','Mount, Mountain'],['mts.','mountains'],['Mus.','Museum'],['N','north; Newton(s)'],['NAACP','National Association for the Advancement of Colored People'],['NASA','National Aeronautics and Space Administration'],['NATO','North Atlantic Treaty Organization'],['NE','northeast'],['no.','number'],['Nov.','November'],['OAS','Organization of American States'],['Oct.','October'],['Op.','Opus [work]'],['oz','ounce(s)'],['pl.','plural'],['pop.','population'],['pseud.','pseudonym'],['pt.','part(s)'],['pt','pint(s)'],['pub.','published; publisher'],['qt','quart(s)'],['Rev.','Revelation; the Reverend'],['rev.','revised'],['R.N.','registered nurse'],['rpm','revolution(s) per minute'],['RR','railroad'],['S','south'],['S','second(s)'],['SEATO','Southeast Asia Treaty Organization'],['SEC','Securities and Exchange Commission'],['sec','second(s); secant'],['Sept.','September'],['Ser.','Series'],['Sgt.','Sergeant'],['sq','square'],['Sr.','Senior'],['SSR','Soviet Socialist Republic'],['St.','Saint; Street'],['UNICEF','United Nations Childrens Fund'],['uninc.','unincorporated'],['Univ.','University'],['U.S.','United States'],['USA','United States Army'],['USAF','United States Air Force'],['USCG','United States Coast Guard'],['USMC','United States Marine Corps'],['USN','United States Navy'],['USSR','Union of Soviet Socialist Republics'],['VFW','Veterans of Foreign Wars'],['VISTA','Volunteers in Service to America'],['vol.','volume(s)'],['vs.','versus'],['W','west; watt(s)'],['WHO','World Health Organization'],['wt.','weight'],['yd','yard(s)'],['YMCA','Young Mens Christian Association'],['YWCA','Young Womens Christian Association']
		]
		for(var i = 0;i<abbreviations.length;i++){
			if(abbreviations[i][0]==str){
				s = abbreviations[i][1];
			}
		};
		return s||str
	};
	return cleanStrArr;
}
//export public methods
module.exports = {
	clean:clean
}