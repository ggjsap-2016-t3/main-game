Roque - GGJ Sapporo 2016 Team 3
=======
This is a Roguelike game.
Let us try to go to the goal before buttery of the chief robot turn off!!

![clear](https://cloud.githubusercontent.com/assets/2035364/12700671/7344a9f6-c82f-11e5-9290-6dc0de29c43a.gif)

## How to play

- open https://ggjsap2016-t3.herokuapp.com in your web browser(PC only).
- move by arrow keys or hjkl keys.
- game over when buttery turn off.
- Try to go to the goal before buttery turn off.
- When you collect the buttery which dropped under the ground, the buttery goes flat.


## License
[MIT License](https://opensource.org/licenses/MIT)


## How to develop

```
git clone https://github.com/ggjsap-2016-t3/main-game
```

or

```
git clone git@github.com:ggjsap-2016-t3/main-game.git
```

## How to make the game
Please open `public/main.js` or `public/index.html` by the browser and change files.

## Requirements
When you make the server,

- PostgreSQL

## How to open by the server

```
bundle install
cp config/config.yml.example config/config.yml
# change the above file
shotgun
open http://localhost:9393/
```

