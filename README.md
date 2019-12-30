# PoE-Trade-Extension
A chrome extension to check the impact an item on https://www.pathofexile.com/trade has on your build.  

Technically the extension works with firefox, but pob.party doesn't (you can't paste text).

![](img/capture-2.png?raw=true)

## Installation
- Download this repository
- Go to [chrome://extensions/](chrome://extensions/)
- Enable developer mode
- Click on **Load unpacked**
- Select the **PoE-Trade-Extension** folder you just downloaded

## Use
- Import your build in PoB (the desktop version)
- Be sure to select the spell on which you want to see the impact
- Export your build, copy the code
- Import the build on https://pob.party/
- Get a sharable link using the **Share & Config button** (bottom left)
- You should see a icon in the top left corner of https://www.pathofexile.com/trade page, click on it, paste the link in the text field then click on **SET LINK** ![](img/control-panel.png?raw=true)
- Now you can search items and check the impact an item has on your build

## Why it may not work
- Your browser window is too small, so the iframe doesn't show all the required data.
- It conflict with another script/extension. I can fix this if you fill an issue and provide me with enough information.

## How does it work
It opens pob.party in an iframe then interact with it using user inputs and hooking drawing functions. It's not very clean but it works.
