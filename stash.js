const fetch = require('node-fetch')
const fs = require('fs')
require('dotenv').config() // load .env files
const generateEndpoint = (accountName, tabIndex = 0) => `https://www.pathofexile.com/character-window/get-stash-items?realm=pc&league=Harvest&tabs=1&accountName=${accountName}&tabIndex=${tabIndex}`

async function main(initialJson, poeSessId, username) {
    const potentialTabs = initialJson.tabs.filter(tab => tab.n.toLowerCase().includes('seedcraft')).map(tab => tab.i)

    console.info(`Found ${potentialTabs.length} seed tab(s)`)
    console.info('Looking for Horticrafting stations...')

    const allStations = await potentialTabs.reduce(async (total, tab) => {
        const tabData = await get(username, poeSessId, tab)
        const tabInfo = tabData.tabs.filter(t => t.i === tab)
        console.info(`  Searching tab "${tabInfo[0].n}"`)
        const stations = tabData.items.filter(item => item.typeLine === 'Horticrafting Station')
        total.push(...stations)
        return total
    }, [])

    console.info('Searching finished. Now processing mods of stations...')

    const seedcrafts = allStations.reduce((total, station) => {
        if (!station.craftedMods) return total
        station.craftedMods.forEach(mod => {
            const [,ilvl] = mod.match(/\((\d\d?)\)/)
            const [,modName] = mod.match(/^(.*)\((\d\d?)\)$/)
            if (ilvl < 76) { return } // sub-76 seeds are not universal
            // separate special crafts for better utilization later
            const mode = (!modName.startsWith('Augment') && !modName.startsWith('Remove')) ? 'special' : 'normal'
            if (!total[mode][modName]) {
                total[mode][modName] = 0
            }
            total[mode][modName] = total[mode][modName] + 1
        })
        return total
    }, { normal: [], special: [] })

    console.info('All stations processed. Now preparing text output...')

    const [outputNormal, outputSpecial] = Object.values(seedcrafts).map(mode => {
        return Object.keys(mode).reduce((total, craft) => {
            return total + `${craft.trim()};${mode[craft]}\n`
        }, '')
    })
    fs.writeFile('outputNormal.txt', outputNormal, (err) => {
        if (err) throw err;
        console.log('Finished writing normal mods to file -- outputNormal.txt')
    })
    fs.writeFile('outputSpecial.txt', outputSpecial, (err) => {
        if (err) throw err;
        console.log('Finished writing special mods to file -- outputSpecial.txt')
    })
}

function get(accountName, poeSessId, tabIndex) {
    return fetch(generateEndpoint(accountName, tabIndex), {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cookie: `POESESSID=${poeSessId}`
        },
    }).then(res => res.json())
}

console.clear()
console.info('Searching for session ID and account name...')
const [,,CLI_ACCOUNT_NAME, CLI_POESESSID] = process.argv
const { POESESSID = CLI_POESESSID, ACCOUNT_NAME = CLI_ACCOUNT_NAME } = process.env
if (!ACCOUNT_NAME || !POESESSID) {
    console.error(`Unable to find required fields! Please make sure you either...

      1. Specify an account name / PoE session ID via command-line (node .\\stash.js accountName PoE_Session_ID), OR
      2. Make an .env file with fields POESESSID and ACCOUNT_NAME filled out (see .env.example)

and try again. If this continues to be a problem, contact enragednuke#0001 over Discord.
`)
    return
}
get(ACCOUNT_NAME, POESESSID).then(json => main(json, POESESSID, ACCOUNT_NAME))