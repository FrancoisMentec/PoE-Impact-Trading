# PoE-Trade-Extension
A chrome extension to check the impact an item on https://www.pathofexile.com/trade has on your build.

![](img/capture-2.png?raw=true)

## Installation
- Download this repository
- Go to [chrome://extensions/](chrome://extensions/)
- Enable developer mode
- Click on **Load unpacked**
- Select the **PoE-Trade-Extension** folder you just downloaded

## Use
- Import you're build in PoB (not gonna explain how to do that)
- Be sure to select the spell on which you want to see the impact
- Export your build, copy the code
- Import the build on https://pob.party/
- Get a sharable link using the **Share & Config button** (bottom left)
- You should see a new icon in the top right corner of your browser, click on it, paste the link then click on **SET POB** ![](img/popup.png?raw=true)
- Now you can go on https://www.pathofexile.com/trade (doesn't work on poe.trade) and check the impact an item has on your build

## Why it may not works
- Your browser window is too small, so the iframe doesn't show all the required data

## How does it works
It opens pob.party in an iframe then interact with it using user inputs and hooking drawing functions. It's not very clean but it works.
