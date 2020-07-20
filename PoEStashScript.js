// http://www.pathofexile.com/api/public-stash-tabs
const fetch = require('node-fetch')
const fs = require('fs');

const startTime = new Date()

console.info('Processing username')
const [,,username] = process.argv
if (!username) {
    console.error('No username provided!')
    console.error(`
        Example usage:
          node .\\PoEStashScript.js volibowers
    `)
    return
}
console.info('Getting latest id from poe.ninja...')
fetch('https://poe.ninja/api/Data/GetStats')
    .then(res => res.json())
    .then(({ next_change_id }) => {
        if (!next_change_id) {
            console.error('Something went wrong getting the latest ID from \
                poe.ninja -- check to see if the site is down!')
        } else {
            console.info('Success! Starting fetches...')
            fetchAndPass(next_change_id)
        }
    })
    .catch((err) => {
        console.error('Something went wrong trying to get poe.ninja --', e)
    })

/* 
    ! Data processing and fetching logic -- do not touch
*/
function handleData(json) {
    const { next_change_id, stashes } = json
    // console.log(stashes[0].stash)
    const myStashes = stashes.filter(entry => {
        return entry.stash === null ? false : entry.stash.includes('SEEDCRAFT')
    })
    console.log(myStashes, (new Date() - startTime))
    // if (myStashes.length > 0) {
    //     // console.log(myStashes)
    //     console.log('Took', (new Date() - startTime()), 'milliseconds')
    // }
    // console.log(stashes.length, myStashes, username)
    // console.log(stashes.map(stash => stash.accountName))
    // console.log(myStashes.length > 0 ? myStashes : `none found (${(new Date() - startTime)}ms, iter ${reqCount}) - ${stashes.length}`)
    setTimeout(() => fetchAndPass(next_change_id), 1000)
}
function fetchAndPass(id) {
    // console.log('querying change_id', id)
    const url = 'http://www.pathofexile.com/api/public-stash-tabs' + (id ? `?id=${id}` : '')
    fetch(url)
        .then(res => res.json())
        .then(json => handleData(json))
}