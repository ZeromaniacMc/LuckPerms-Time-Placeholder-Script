/*------------------------------ LP - TIME Ver. 2.0 ------------------------------
If you are using luckperms and the placeholder for expiration time of either of the two options given by LuckPerms, you might also find it annoying that you cannot
shorten the time nor translate hours, minutes etc into your language. This javascript does exactly that!
Since version 2.0, this script can also recalculate the time into a different unit as well as automatically detect singular and plural for the words used.
----------------------------------CREDITS----------------------------------
Made by: MidnightCore#6666 & Zeromaniac#0001
---------------------------------- SUPPORT ----------------------------------
If you follow the instructions given here, you are unlikely to need support. However, if you find any bugs, we would still appreciate if you could let
us know about them. You're encouraged to try to debug it yourself first. Note that if you changed the code below the settings, you will be denied support from us.
For support please either ask HelpChat Support (https://discord.gg/FtArYRQ) who are generally very knowledgable and helpful with issues regarding their plugin
PlaceholderAPI or visit my support discord at https://discord.gg/NU6PFtsGRr.
------------------------------THINGS YOU NEED:------------------------------
1.) PlaceholderAPI (2.11.1) plugin
2.) PAPI javascript [2.1.0] expansion (/papi ecloud download javascript & /papi reload)
  Do NOT use /reload or plugman to enable Placeholder API!
------------------------------INSTALLATION:------------------------------
1.) Drag and drop this whole document as is into the following folder of your server: plugins -> PlaceholderAPI -> javascripts
This file's name has to match with what you do in the next step, so make sure this file is called 'lptime.js'.
2.) Now you need to register this javascript in plugins -> PlaceholderAPI -> javascript_placeholders.yml
Into that file, add the following two lines AS IS:
time:
  file: lptime.js
3.)Ingame, do /papi reload.
4.) Now you can use the placeholder as follows:
  To convert %luckperms_expiry_time_<permission>% USE %javascript_time_expiry_time,<permission>%
  To convert %luckperms_inherited_expiry_time% USE %javascript_time_inherited_expiry_time,<permission>%
  Examples:
  ➢ %javascript_time_expiry_time,essentials.fly%
  ➢ %javascript_time_expiry_time,group.vip%
  ➢ %javascript_time_inherited_expiry_time,essentials.gamemode.*%
EXTRA HINT: Groups in LuckPerms are also simply just permissions like group.vip for example! You can abuse this placeholder for these as well!
!!! ATTENTION: Do not replace the comma in front of the <permission> with an underscore! We really want you to use the comma, don't try to be a hero
and use an underscore!!!
*/


// This part below is the translations. The letters in the first column you should not touch whatsoever. These refer to the originals from LuckPerms.
// Change the words inside the double quotes. The first word is used when a time is 1, meaning singular, like 1 hour instead of 1 hours.
// The second word is used when time is above 1, so say 2 hours rather than 2 hour. Please also note that we added spaces here. In version 1 of this
// script, we added a space in between the times automatically and we heard your cries about wanting to customize that so we decided to let you do the
// spacing yourself.
var translations = {
  y:  [" Jahr "," Jahre "],
  mo: [" Monat "," Monate "],
  w:  [" Woche "," Wochen "],
  d:  [" Tag "," Tage "],
  h:  [" Stunde "," Stunden "],
  m:  [" Minute "," Minuten "],
  s:  [" Sekunde "," Sekunden "]
};


// This part defines exactly to which format to convert down to. All times above the unit you choose here are going to be mathematically converted and added up.
// Only change the letter in the double quotes. Possible options:
// "y" will effectively not do any math whatsoever.
// "mo" will convert years into months.
// "w" will convert years and months into weeks.
// "d" will convert years, months and weeks into days.
// "h" will convert years, months, weeks and days into hours.
// "m" will convert years, months, weeks, days and hours into minutes.
// "s" will convert years, months, weeks, days, hours and minutes into seconds.
var defaultConverterSettings = "d";

// If the permission you are checking against is an infinite permission, the following symbol will be shown.
var infinite = "∞";

// If the user does not have the permission you are checking against, this option will be shown.
var noPerm = "✘";


// This setting lets you completely cut off parts of the placeholder. Many people want to simply not show the seconds to make the output smaller and
// more readable. This is done here. What you want cut off, just turn into false as shown in the last two lines as examples. Remember that it is possible
// to convert your times above into minutes and then turn off minutes here by accident. The result will be a line of pure nothingness.
// Note: If you cut off parts, the time on the cut part will not be added to the unit in front of it (for example 1m 30s will not become 1.5m).
// The actual time on the permission node will not be touched in any way. We only slice the display apart here.
var displaySettings = {
  y:  true,
  mo: true,
  w:  true,
  d:  true,
  h:  true,
  m:  false,
  s:  false
};

/*----------------------------------------------- DO NOT TOUCH ANYTHING BELOW THIS LINE ------------------------------------------*/
// If you touch anything below this line despite the warning, you recognize that the placeholder may break and agree to not seeking
// support for it.

var time;
var timeFormat = {
  y:  0,
  mo: 0,
  w:  0,
  d:  0,
  h:  0,
  m:  0,
  s:  0
};
var keys = Object.keys(timeFormat);
function luckperms_time(){
    if(args.length === 0 || args.length === 1) {
      return "&cUsage: '"+"%"+"javascript_time_inherited_expiry_time,<permission>"+"%"+"' or '"+"%"+"javascript_time_expiry_time,<permission>"+"%"+"'"; }
    time = PlaceholderAPI.static.setPlaceholders(BukkitPlayer, "%" + 'luckperms_' + args[0] + '_' + args[1] + "%");

    if(BukkitPlayer.hasPermission(args[1])) {
      if(time.length == 0) {
        return infinite;
      }
    } else {
      return noPerm;
    }

    splitter();
    if(defaultConverterSettings && arrayIncludes(keys, defaultConverterSettings)){
        converter(defaultConverterSettings);}
    return displayFormat();}
function splitter()
{
	var splitTime = time.split(" ");
	for (var i = 0; i < splitTime.length; i++){
    for (var j = 0; j < keys.length; j++)
    {
      if(splitTime[i].indexOf(keys[j]) > -1)
     	{
       	timeFormat[keys[j]] = Number (splitTime[i].split(keys[j])[0]);
        break;
     	}
    }
  }
}

function converter(convertTo)
{
	var convertHelp = [12,4.345,7,24,60,60];
  var values = objectValues(timeFormat);
  var index = keys.indexOf(convertTo);
  var result = 0;
  for(var i = 0;i < index; i++) {
  	 result = (result + values[i]) * convertHelp[i];
  	 timeFormat[keys[i]] = 0;}
  timeFormat[convertTo] += Math.round(result);}
function translate(keySearch, index) {
	var transArr = translations[keySearch];
  if(index > transArr.length) {
  	index = transArr.length;
  }
  return transArr[index-1];}
function displayFormat() {
  var displayString = "";
  for (var i = 0; i<keys.length; i++){
    if(displaySettings[keys[i]] && timeFormat[keys[i]] != 0){
      displayString += timeFormat[keys[i]] + translate(keys[i], timeFormat[keys[i]]);}}
  return displayString;}
function arrayIncludes(arr, val){
  if(arr.indexOf(val) !== -1) {
    return true;}
  return false;}
function objectValues(obj) {
    var vals = [];
    for (var prop in obj) {
        vals.push(obj[prop]);}
    return vals;}

luckperms_time();
