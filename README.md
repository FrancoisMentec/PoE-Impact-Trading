# PoE-Trade-Extension
A browser extension to check the impact an item on https://www.pathofexile.com/trade has on your build.

![](img/capture-2.png?raw=true)

## Installation
Manual installation assure you the latest features at the cost of more bugs and no automatic update. I develop the extension on chrome because that's my default browser, but I advise using Firefox, it has far better performance (it's very laggy on chrome).

### Chrome
#### From the store
The extension isn't available on chrome webstore for now. The extension is actually classified as a spam and can't get through the validation process, I sent a message to the support team and I'm now waiting. Hopefully, it will be available soon.

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
- ~~Your browser window is too small, so the iframe doesn't show all the required data.~~ Should be fixed.
- It conflict with another script/extension. I can fix this if you fill an issue and provide me with enough information.
- Check you get the latest version, the issue may already be fixed.
- Try to refresh the page, reboot your browser or even your computer (you could be surprised by the amount of issues it fixes).

You can submit an issue [here](https://github.com/FrancoisMentec/PoE-Trade-Extension/issues). Don't forget to post the content of the console (accessible with *Ctrl+Shift+i*), indicate the browser your using and the way to reproduce the error.

## How does it work
It opens pob.party in an iframe then interact with it using user inputs and hooking drawing functions. It's not very clean but it works.
