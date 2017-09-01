# Spinner Winner 

Source code of the popular game on GAMEE. 

Spinner game has implements **basic functionality** of the gamee-js framework and **save state feature**. 
Most of the basic functionality is dedicated in [src/gamee/GameeConnector.js](https://github.com/gameeapp/sample-game-spinner-winner/blob/master/src/gamee/GameeConnector.js) (find more about [the basic functionality](https://github.com/gameeapp/gamee-js/wiki/basic-usage) in the gamee-js wiki).
The save state feature is used in [src/Game.js L137](https://github.com/gameeapp/sample-game-spinner-winner/blob/1b98338af5d3230ad419f4297cf42aaec3fb1b78/src/Game.js#L137-L146) (find more about [the save state feature](https://github.com/gameeapp/gamee-js/wiki/advanced-usage#gameegamesave)).

## Open in the Emulator right now

Hosted directly from github:

[http://emulator.gameeapp.com/emulator.html?projectUrl=https://cdn.rawgit.com/gameeapp/sample-game-spinner-winner/master/www/index.html](http://emulator.gameeapp.com/emulator.html?projectUrl=https://cdn.rawgit.com/gameeapp/sample-game-spinner-winner/master/www/index.html) 

## Modify something

Required: NodeJS, NPM

Clone the repository and install the dependencies with NPM.

```bash
git clone git@github.com:gameeapp/sample-game-spinner-winner.git --depth 1
cd sample-game-spinner-winner
npm install
```

Start realtime building with Webpack 2 and webserver with NodeJS & Express. 

```bash
## Windows 
npm start

## Linux & OSX
npm run osx
```

Test if the game is running, use localhost URL in the Emulator. 

[http://emulator.gameeapp.com/emulator.html?projectUrl=http://localhost:3000](http://emulator.gameeapp.com/emulator.html?projectUrl=http://localhost:3000) 

Modify source code in the `src/` folder.

### Project structure

```
.
├── config              # webpack configuration
├── src                 # javascript sources
└── www                 # static assets
    ├── assets          # multimedia assets
    ├── dist            # build from src
    └── libs            # js libraries including gamee-js framework
```
