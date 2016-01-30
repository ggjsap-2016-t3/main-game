# Roque - Global Game Jam Sapporo 2016 Team3
v2.0.0

## 概要
ローグライク風のゲーム。
主人公のロボットのバッテリーが切れる前にゴールを目指そう！

## 遊び方

- 矢印キーで移動。

- バッテリーが0になるとゲームオーバー。

- バッテリーが0になる前にゴールを目指すこと。

- 地面に落ちているバッテリーを拾うと、バッテリーが回復する。

## 開発の始め方

```
git clone https://github.com/ggjsap-2016-t3/main-game
```

または

```
git clone git@github.com:ggjsap-2016-t3/main-game.git
```

## ゲーム作る人
public/以下にゲームに必要なファイル（main.jsやindex.htmlなど）が入っているので、それをブラウザで開いて開発を進めてください。

## サーバー作る人

```
bundle install
cp config/config.yml.example config/config.yml
shotgun
open http://localhost:9393/
```

