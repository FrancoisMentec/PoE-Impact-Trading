# PoE-Impact-Trading
A browser extension to check the impact an item on https://www.pathofexile.com/trade has on your build.

![](img/capture-2.png?raw=true)

## Installation
Manual installation assure you the latest features at the cost of more bugs and no automatic update. I develop the extension on chrome because that's my default browser (I know, I'm a monster), but I advise using Firefox, it has far better performance (it's very laggy on chrome, no idea why I keep using it).

### Chrome
#### From the store
It's finally published, you can find it on the [chrome webstore](https://chrome.google.com/webstore/detail/poe-trade-extension/ckfnddafphjahhiadjogilncdegmbpkm).

#### Manually
- [Download this repository](https://github.com/FrancoisMentec/PoE-Trade-Extension/archive/master.zip).
- Extract the archive.
- Go to <a href="chrome://extensions/">*chrome://extensions/*</a>.
- Enable developer mode.
- Click on **Load unpacked**.
- Select the **PoE-Trade-Extension** folder you just extracted.

### Firefox
I develop the extension using chrome, so it may encounter more errors with firefox. if you get one don't panic, you can submit an issue and specify you're using Firefox.

#### From the store
The extension is now available on the [Firefox Add-ons Store](https://addons.mozilla.org/fr/firefox/addon/poe-trade-extension/).

#### Manually
- [Download this repository](https://github.com/FrancoisMentec/PoE-Trade-Extension/archive/master.zip).
- Extract the archive.
- Go to <a href="about:debugging">*about:debugging*</a>.
- Click on **This firefox**.
- Click on **Load Temporary Add-on...**
- Select the **manifest.json** file in the **PoE-Trade-Extension** folder you just extracted.  

You need to reproduce this process everytime you reboot Firefox.

## Import your build
- Import your build in PoB (the desktop version).
- Be sure to select the spell on which you want to see the impact.
- Export your build, copy the code.
- Import the build on https://pob.party/. If you can't paste the code, try with a different browser (chrome should work).
- Get a sharable link using the **Share & Config button** (bottom left).
- You should see a icon in the top left corner of https://www.pathofexile.com/trade page, click on it, paste the link in the text field then click on **SET LINK**.
- ![](img/control-panel.png?raw=true).
- Now you can search items and check the impact an item has on your build.

**Why can't I put pob code directly into the extension?**  
The extension interacts with pob.party through user events (e.g. mouse clicks), but for an unknown reason I can't paste or type anything in the import field when it is opened in an iframe. View [Issue#10](https://github.com/FrancoisMentec/PoE-Impact-Trading/issues/10).

## Functionalities
- Enable/Disable the automatic computation of item impact. The state will be saved and shared with newly opened tabs.
- Compute the impact of a specific item through a button located below the item. This is only available if the automatic computation is disabled.
- Show pob.party. You can look at your build on pob.party directly from the trade website. But if the extension is currently using it to compute item impact you'll see frantic items creation and shouldn't interact with it. It can be used for debug purpose.
- Open pob.party in a new tab. Useful if you want to look at your build without interfering with the item impact computations.
- Set build link. Allow you to import your build into the app using a pob.party sharing link.
- Color scheme. Change the colors used by the extension. Implemented at the request of colorblind users, don't hesitate to ask if you need a new scheme.
- Show impact on player/minions. Allow you to select if you want to see the impact only on player, only on minions, or on both.
- Item Filter. Filter which item you want to replace when computing the impact, useful for jewels and rings. The filtering is done on the first two lines, example: "Equipping this item in Ring 1 will give you: (replacing Circle of Guilt, Iron Ring)". It allows regular expressions, example: "#([3-57]|12)" will show impact if replacing jewels 3, 4, 5, 7 and 12.

Hopefully more coming soon.

## Why it may not work
- ~~Your browser window is too small, so the iframe doesn't show all the required data.~~ Should be fixed.
- It conflict with another script/extension. I can fix this if you fill an issue and provide me with enough information.
- Check you get the latest version, the issue may already be fixed.
- Try to refresh the page, reboot your browser or even your computer (you could be surprised by the amount of issues it fixes).

You can submit an issue [here](https://github.com/FrancoisMentec/PoE-Trade-Extension/issues). Don't forget to post the content of the console (accessible with *Ctrl+Shift+i*), indicate the browser your using and the way to reproduce the error.

## How does it work
It opens pob.party in an iframe then interact with it using user inputs and hooking drawing functions. It's not very clean but it works.
