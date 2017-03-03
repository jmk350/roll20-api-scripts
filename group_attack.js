on("chat:message", function(msg) {
    if(msg.type == "api" && msg.content.toLowerCase().indexOf('!attack') !== -1) {
        var slice = msg.content.split(":"); 
        
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

        var targetplayertoken = findObjs({_type: "graphic", name: playername});
        var ac = targetplayertoken[0].get("bar2_value");

        var attacktype = slice[4];

        var attackslot = slice[5];
        var attackslotnum = slice[5].substr(slice[5].length - 1);
        var attackmod = parseInt(slice[6]);

        // Start Attack
        if(enemynumber === '1')
            sendChat(enemyname, "/em attacks " + playername);
        else
            sendChat(enemynumber + " " + enemyname + "s", "/em attack " + playername);

        var output = "&{template:5eDefault} {{weapon=1}} ";
        var weaponname, damageroll;
        
        if (attackslot.indexOf('melee') !== -1) {
            damageroll = "[[@{" + enemyname + "|meleedmg" + attackslotnum + "}+@{" + enemyname + "|meleedmgbonus" + attackslotnum + "}+@{" + enemyname + "|global_melee_damage_bonus}]] @{" + enemyname + "|meleedmgtype" + attackslotnum + "}";
            output += "{{title=@{" + enemyname + "|meleeweaponname" + attackslotnum + "}}} {{subheader=" + enemyname + "}} {{subheaderright=Melee attack}}";
        } else {
            damageroll = "[[@{" + enemyname + "|rangeddmg" + attackslotnum + "}+@{" + enemyname + "|rangeddmgbonus" + attackslotnum + "}+@{" + enemyname + "|global_ranged_damage_bonus}]] @{" + enemyname + "|rangeddmgtype" + attackslotnum + "}";
            output += "{{title=@{" + enemyname + "|rangedweaponname" + attackslotnum + "}}} {{subheader=" + enemyname + "}} {{subheaderright=Range attack}}";
        }

        for (i = 0; i < enemynumber; i++) {
            var attackroll = randomInteger(20);
            var attack = attackroll + attackmod;

            if(attacktype == "Standard") {
                if(attack >= ac)
                    output += " {{Attack " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]]<p/>Hit for " + damageroll + "}}";
                else
                    output += " {{Attack " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]]  Miss!}}";
            } else {
                var attackroll2 = randomInteger(20);
                var attack2 = attackroll2 + attackmod;

                if(attacktype == "Advantage" && (attack >= ac || attack2 >= ac))
                    output += " {{Attack " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]] | [[" + attackroll2 + "+" + attackmod + "]]<p/>Hit for " + damageroll + "<p/>}}";
                else if(attacktype == "Disdvantage" && attack >= ac && attack2 >= ac)
                    output += " {{Attack " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]] | [[" + attackroll2 + "+" + attackmod + "]]<p/>Hit for " + damageroll + "<p/>}}";
                else
                    output += " {{Attack " + (i+1) + "=[[" + attackroll + "+" + attackmod + "]] | [[" + attackroll2 + "+" + attackmod + "]] Miss!}}";
            }
        }
            
        sendChat(enemyname, output + " @{" + enemyname + "|classactioncustom1skill}");
    };
});
