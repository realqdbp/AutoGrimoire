Game.registerMod("autogrimoire", {

    init: function () {
        Game.mods["autogrimoire"].spellID = 1
        Game.Notify(`Auto Grimoire loaded!`, 'Change the effect in the settings.', [17, 0]);

        Game.registerHook("draw", () => {
            this.modMenu()
        })

        Game.registerHook("logic", () => {
            this.autoGrimoire()
        })
    },

    save: function () {
        return `${Game.mods["autogrimoire"].spellID}`
    },

    load: function (str) {
        try {
            Game.mods["autogrimoire"].spellID = parseInt(str);
        } catch (ignored) {
            Game.mods["autogrimoire"].spellID = 0
        }
    },

    modMenu: () => {
        const menuID = "autoGrimoireMenu"

        if (Game.onMenu !== "prefs") return
        if (l("menu").querySelector("#" + menuID) != null) return

        const blocks = l("menu").querySelectorAll(".block")
        const lastBlock = blocks[blocks.length - 1]

        const block = document.createElement("div")
        block.className = "block"
        block.id = menuID
        block.style.padding = "0px"
        block.style.margin = "8px 4px"

        const subsection = document.createElement("div")
        subsection.className = "subsection"
        subsection.style.padding = "0px"
        block.appendChild(subsection)

        const title = document.createElement("div")
        title.className = "title"
        title.textContent = "Auto Grimoire"
        subsection.appendChild(title)

        const listing = document.createElement("div")
        listing.className = "listing"
        subsection.appendChild(listing)

        const select = document.createElement("select")
        select.onchange = () => Game.mods["autogrimoire"].spellID = isNaN(parseInt(select.value)) ? 1 : parseInt(select.value)
        select.value = Game.mods["autogrimoire"].spellID
        listing.appendChild(select)

        const minigame = Game.ObjectsById[7]?.minigame
        for (const spellID in minigame?.spellsById) {
            const option = document.createElement("option")
            option.textContent = minigame?.spellsById[spellID].name
            option.value = spellID
            select.appendChild(option)
        }
        select.value = Game.mods["autogrimoire"].spellID

        const inputLabel = document.createElement("label")
        inputLabel.textContent = "Sets the spell effect to be cast."
        listing.appendChild(inputLabel)

        l("menu").insertBefore(block, lastBlock.nextSibling)
    },

    autoGrimoire: () => {
        const minigame = Game.ObjectsById[7]?.minigame

        if (minigame?.magicM !== minigame?.magic) return

        const spell = minigame?.spellsById[Game.mods["autogrimoire"].spellID]
        const cost = spell?.costMin + spell?.costPercent * minigame?.magicM

        if (minigame?.magic < cost) return

        minigame?.castSpell(spell)
    }
});
