on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.toLowerCase().indexOf('!attack') !== -1) {
        var slice = msg.content.split(" "); 
        
        // definining the enemy stats based on the first person named after the !attack
        var enemynumber = slice[1];

        // definining the enemy stats based on the first person named after the !attack
        var enemyname = slice[2];
        var targetenemytoken = findObjs({_type: "graphic", name: enemyname});
        if(targetenemytoken.length === 0) {
            sendChat(msg.who, "target " + enemyname + " not found.");
        }
        
        // definining the player stats based on the second person named after the !attack
        var playername = slice[3];
        var targetplayercharacter = findObjs({_type: "character", name: playername});
        if(targetplayercharacter.length === 0) {
            sendChat(msg.who, "target " + enemyname + " not found.");
        }

        var ac = getAttrByName(targetplayercharacter[0].id, 'AC');
        log(JSON.stringify(ac));
        ac=18;

        var attackmod = parseInt(slice[4]);
        var damageroll = slice[5];
        var attacktype = slice[6];

        // Start Attack
        if(enemynumber === '1')
            sendChat(enemyname, "/em attacks " + playername);
        else
            sendChat(enemynumber + " " + enemyname + "s", "/em attack " + playername);

        var output = "&{template:5eDefault} {{weapon=1}} {{title=@{" + enemyname + "|npc_action_name1}}}";

        for (i = 0; i < enemynumber; i++) {
            var attackroll = randomInteger(20);
            var attack = attackroll + attackmod;

            if(attacktype == "Standard") {
                if(attack >= ac)
                    output += " {{" + enemyname + " " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]]<p/>Hit for [[" + damageroll + "]] damage}}";
                else
                    output += " {{" + enemyname + " " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]]  Miss!}}";
            } else {
                var attackroll2 = randomInteger(20);
                var attack2 = attackroll2 + attackmod;

                if(attacktype == "Advantage" && (attack >= ac || attack2 >= ac))
                    output += " {{" + enemyname + " " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]] | [[" + attackroll2 + "+" + attackmod + "]]<p/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hit for [[" + damageroll + "]] damage}}";
                else if(attacktype == "Disdvantage" && attack >= ac && attack2 >= ac)
                    output += " {{" + enemyname + " " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]] | [[" + attackroll2 + "+" + attackmod + "]]<p/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hit for [[" + damageroll + "]] damage}}";
                else
                    output += " {{" + enemyname + " " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]] | [[" + attackroll2 + "+" + attackmod + "]] Miss!}}";
            }
        }
            
        sendChat(enemyname, output + " @{" + enemyname + "|classactioncustom1skill}");
    };
});
