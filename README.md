# PoE-Trade-Extension
A browser extension to check the impact an item on https://www.pathofexile.com/trade has on your build.

![](img/capture-2.png?raw=true)

## Installation
### Chrome
- [Download this repository](https://github.com/FrancoisMentec/PoE-Trade-Extension/archive/master.zip).
- Extract the archive.
- Go to <a href="chrome://extensions/">*chrome://extensions/*</a>.
- Enable developer mode.
- Click on **Load unpacked**.
- Select the **PoE-Trade-Extension** folder you just extracted.

### Firefox
#### From the store
The extension is now available on the [Firefox Add-ons Store](https://addons.mozilla.org/fr/firefox/addon/poe-trade-extension/).

#### Manually
Installing manually will assure you to get the last version, but it won't update automatically and it may contain a lot of bugs.
- [Download this repository](https://github.com/FrancoisMentec/PoE-Trade-Extension/archive/master.zip).
- Extract the archive.
- Go to <a href="about:debugging">*about:debugging*</a>.
- Click on **This firefox**.
- Click on **Load Temporary Add-on...**
- Select the **manifest.json** file in the **PoE-Trade-Extension** folder you just extracted.  

You need to reproduce this process everytime you reboot Firefox.

## Use
- Import your build in PoB (the desktop version).
- Be sure to select the spell on which you want to see the impact.
- Export your build, copy the code.
- Import the build on https://pob.party/. If you can't paste the code, try with a different browser (chrome should work).
- Get a sharable link using the **Share & Config button** (bottom left).
- You should see a icon in the top left corner of https://www.pathofexile.com/trade page, click on it, paste the link in the text field then click on **SET LINK**.
- ![](img/control-panel.png?raw=true).
- Now you can search items and check the impact an item has on your build.

## Why it may not work
- Your browser window is too small, so the iframe doesn't show all the required data.
- It conflict with another script/extension. I can fix this if you fill an issue and provide me with enough informations.

You can submit an issue [here](https://github.com/FrancoisMentec/PoE-Trade-Extension/issues).

## How does it work
It opens pob.party in an iframe then interact with it using user inputs and hooking drawing functions. It's not very clean but it works.
