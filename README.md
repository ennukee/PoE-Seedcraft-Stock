# PoE Seedcraft Stock

This a basic node script which uses the `/get-stash-items` API to find Horticrafting stations and indexs them into a usable CSV(-esque) format. Though because mod names can have commas, we use semicolons as the separator instead of commas in the outputs.

## Requirements

 * git -- [download](https://git-scm.com/downloads)
 * Node.js -- [download](https://nodejs.org/en/download/)
 * npm (should be installed with Node.js above)

## Before you use

All Horticrafting stations that you want to scan for should be in tabs with the word "seedcraft" in it. Any tabs without "seedcraft" in the tab name will NOT be checked.

## How to use

First, clone this repository.

```git
git clone https://github.com/ennukee/PoE-Seedcraft-Stock.git
```

Next, in a terminal / command prompt you'll need to install dependencies.

```
npm install
```

Now we need to setup your PoE Session ID and account name. You can do this one of two ways (Not sure what a PoE Session ID is or how to get it? Scroll down a bit past this step!)

 1. Use an `.env` file.
 2. Supply it via command-line

### .env file

Head into the repository folder you cloned at the start. You should see a `.env.example` file. Make a copy of this file and rename it to `.env`. Next, open this file with Notepad and type in your account name and PoE session ID in this file.

You can now run the script from a terminal / command prompt like this: `node .\stash.js`

### via command-line

This one is more simple but also more annoying if you plan to use this script more than once. You just have to provide the account name and PoE session ID right after `stash.js` when running the script.

For example, if I were to run it...

```
node .\stash.js volibowers MY_POE_SESSION_ID_HERE
```

### What is a PoE Session ID and how do I get it?

**Preface**: This information is very sensitive and can be used to compromise your account in the hands of a malicious user. Please take care with this ID and do NOT share it anywhere unless you trust where you're putting it.

A **PoE Session ID** is an authorization key used to access the more restrictive APIs that GGG provides. These are generally undocumented and are found most easily via the Network tab of a browser's developer tools and monitoring JSON requests while performing various actions on the PoE site.

To get your PoE Session ID depends on your browser.

 * **Firefox**: Go to pathofexile.com, log in if not already, hit F12 then look for the "Storage" tab. Under "Cookies" (on the left) > `https://www.pathofexile.com` look for the "POESESSID". It should be a long strong of random letters and numbers
 * **Chrome**: Head to `chrome://settings/cookies/detail?site=pathofexile.com` and look for "POESESSID" on this page. If you can't find it, try to click the back arrow and search of "pathofexile" and see if you have another instance of the site that does have it.

## Output

If you did it properly (either method), the script should automatically run and spit out data in two files: `outputNormal.txt` and `outputSpecial.txt` -- these represent two categories:

 * **Normal**: Any augment, remove, remove-add, or remove-non-add craft.
 * **Special**: Anything else. Mostly for T2-T4 crafts which are plentiful and often clutter.