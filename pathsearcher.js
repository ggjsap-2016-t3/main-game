/**
 * pathsearcher.js
 *
 * ゲーム用移動経路探索ライブラリ
 *
 * @licence MIT Licence <http://www.opensource.org/licenses/mit-license.php>
 * @author  kjirou <sorenariblog[at]google[dot]com> <http://kjirou.sakura.ne.jp/mt/>
 */
(function(){
var __classScope__ = this;


if ('PathSearcher' in __classScope__) {
    alert('pathsearcher.js: `PathSearcher` is already defined');
    return;
};


/** ショートカット用ローカル変数 */
var $d;


/**
 * PathSearcherクラス
 */
var cls = function(){

    /**
     * マス目を表現する二次元配列
     *
     * this._squares[x][y] = {
     *     cost: 当マスへ入るための移動コスト、0以上の整数 or 少数
     *     paths: 当マスまでの経路・合計移動コスト情報リスト
     *     isFinished: 当マスからの探索が終了しているかのフラグ
     * }
     */
    this._squares = undefined;

    /** ゲーム盤情報を一部を切り取って渡す場合の
        元ゲーム盤座標と当クラスデータ座標との差分 */
    this._deltaXIndex = 0;
    this._deltaYIndex = 0;

    /** 移動力 */
    this._movePower = undefined;

    /** 終点座標, ゲーム盤上の座標
        設定されている場合は、当座標までの最短経路を発見したら走査終了 */
    this._originalEndIndex = null;
};


/**
 * 外部ゲーム盤情報を読み込む
 *
 * @param array    squares    マス目の並びを二次元配列で表現したゲーム盤情報
 * @param function translator 外部マス目情報を当クラス用マス目情報へ変換する関数
 *                            関数仕様)
 *                              引数1  ... squares各マス目情報
 *                              引数2  ... squares座標, [1次元要素番号, 2次元要素番号]
 *                              戻り値 ... マス目に入るための移動コストを表す 0以上の整数・少数
 *                                         通行不可の場合は false
 *                            定義例1)
 *                              function(square, index){
 *                                  // 全マス目の移動コストは1だと解釈される
 *                                  return 1;
 *                              }
 *                            定義例2)
 *                              function(square, index){
 *                                  // あなたのゲームでは、マス目情報にmoveCostというキーで
 *                                  // 移動コストを定義しており、
 *                                  // 移動不可は 99 という値で表現している場合
 *                                  if (square.moveCost !== 99) {
 *                                      return square.moveCost;
 *                                  } else {
 *                                      return false;
 *                                  };
 *                              }
 * @param function options    オプション, 現在は外部ゲーム盤のマス目が多い場合に
 *                            その一部だけを矩形として評価するオプションのみ存在する
 */
cls.prototype.load = function(squares, translator, options){

    var opts = options || {};
    var minXIndex = ('minXIndex' in opts)? opts.minXIndex: 0;
    var maxXIndex = ('maxXIndex' in opts)? opts.maxXIndex: squares.length - 1;
    var minYIndex = ('minYIndex' in opts)? opts.minYIndex: 0;
    var maxYIndex = ('maxYIndex' in opts)? opts.maxYIndex: squares[0].length - 1;

    // ゲーム盤情報の一部だけを探索する場合は、元座標と当クラス座標とずれる
    this._deltaXIndex = minXIndex;
    this._deltaYIndex = minYIndex;

    this._squares = [];
    var newX = 0;
    var newY = 0;
    var x, y;
    for (x = minXIndex; x <= maxXIndex; x++) {
        this._squares[newX] = [];
        newY = 0;
        for (y = minYIndex; y <= maxYIndex; y++) {
            this._squares[newX][newY] = {
                cost: translator(squares[x][y], [x, y]),
                paths: [],
                isFinished: false
            };
            newY += 1;
        };
        newX += 1;
    };
};

/**
 * 探索を行う
 *
 * @param array  startIndex 出発点座標, [1次元要素番号, 2次元要素番号]
 * @param number movePower  移動力, 0以上の整数または小数 || null(default)=無制限
 * @param mixed  endIndex   array=終点座標を指定する場合, null(default)=しない
 *                          指定した場合は、終点までの最短経路が見つかったら走査を止める
 * @return obj              PathSearcher.Resultオブジェクト
 */
cls.prototype.search = function(startIndex, movePower, endIndex){

    if (movePower === undefined || movePower === null) movePower = cls.INFINITY_MOVE_POWER;
    this._originalEndIndex = endIndex || null;

    var innerStartIndex = [
        startIndex[0] - this._deltaXIndex,
        startIndex[1] - this._deltaYIndex
    ];
    this._movePower = movePower;
    var currentTotalCost = 0;

    // 出発点情報を設定
    this._getSquare(innerStartIndex).paths.push({
        totalCost: currentTotalCost,
        steps: [{index:innerStartIndex, cost:currentTotalCost}]
    });

    this._searchAround(innerStartIndex, currentTotalCost);
};

/**
 * 四方を一歩ずつ探索する
 */
cls.prototype._searchAround = function(index, currentTotalCost){

    $d('start [' + (index[0] + this._deltaXIndex) + ', ' + (index[1] + this._deltaYIndex) + '] totalCost = ' + currentTotalCost);
    var baseSquare = this._getSquare(index);

    var around = [
        [1, 0],
        [0, 1],
        [0, -1],
        [-1, 0]
    ];
    var aroundIndex;
    for (aroundIndex = 0; aroundIndex < around.length; aroundIndex++) {
        // 移動方向
        var direction = around[aroundIndex];
        // 移動先の座標
        var x = index[0] + direction[0];
        var y = index[1] + direction[1];
        var orgX = x + this._deltaXIndex;
        var orgY = y + this._deltaYIndex;
        // 存在しない座標の場合
        if (x < 0 || x >= this._squares.length || y < 0 || y >= this._squares[0].length) {
            $d('[' + orgX + ', ' + orgY + '] is not exist');
            continue;
        };
        // 移動先のマス目を抽出
        var nextSquare = this._getSquare([x, y]);
        // 移動不可のマスの場合
        if (nextSquare.cost === false) {
            $d('[' + orgX + ', ' + orgY + '] is keep out');
            continue;
        };
        // 探索済みのマスの場合
        if (nextSquare.isFinished === true) {
            $d('[' + orgX + ', ' + orgY + '] is finished');
            continue;
        };
        // 移動先マスを含めた合計移動コスト
        var nextTotalCost = currentTotalCost + nextSquare.cost;
        // 移動力不足の場合
        if (this._movePower < nextTotalCost) {
            $d('[' + orgX + ', ' + orgY + '] is so hard');
            continue;
        };
        // 移動力を無駄にした経路だった場合
        // |ab| a=2, b=1   例えば左図のような移動コストの場合に
        // |cd| c=1, d=3   cab による経路探索後に cdb を探索するとここに入る
        if (nextSquare.paths.length > 0 && nextSquare.paths[0].totalCost < nextTotalCost) {
            $d('[' + orgX + ', ' + orgY + '] is wastefulness move');
            continue;
        };
        // 経路生成
        var steps = baseSquare.paths[0].steps.slice(0);
        steps.push({
            index: [x, y],
            cost: nextSquare.cost
        });
        // 経路情報追加, squares.paths[0] を最小移動コスト経路にするため unshift を使う
        nextSquare.paths.unshift({
            totalCost: nextTotalCost,
            steps: steps
        });
        // 終点設定がある場合、経路を発見したら走査終了
        if (this._originalEndIndex !== null &&
            orgX === this._originalEndIndex[0] && orgY === this._originalEndIndex[1]) {
            $d('Find end-index [' + orgX + ', ' + orgY + ']');
            return;
        };
    };

    // 当マスを探索済みにする
    baseSquare.isFinished = true;

    // 未探索で合計移動コストが同じマスが有ればそこを探索
    // 無い場合は、最も合計移動コストが低いマスで探索
    // 合計移動コストが低いマスから順に探索することで無駄に移動力を使った道を通らなくなる
    // ただし、移動コストが逆に回復するマス や 侵入方向によって移動コストが変わる 等には対応できない
    var minTotalCost = this._movePower;
    var isCompletedSearch = false; // 次の_searchAroundプロセスへ処理を渡し済みならtrue
    var self = this;
    // 合計移動コストが同じ、つまり全体から見ると最小コストなものを優先的に走査
    this._map(function(sq, idx){
        if (!sq.isFinished && sq.paths.length > 0 && currentTotalCost === sq.paths[0].totalCost) {
            self._searchAround(idx, currentTotalCost);
            isCompletedSearch = true;
            return false;
        };
        if (!sq.isFinished && sq.paths.length > 0 && minTotalCost > sq.paths[0].totalCost) {
            minTotalCost = sq.paths[0].totalCost;
        };
    });
    // 無い場合は次に少ないコストの場所から走査
    if (isCompletedSearch === false) {
        this._map(function(sq, idx){
            if (!sq.isFinished && sq.paths.length > 0 && minTotalCost === sq.paths[0].totalCost) {
                self._searchAround(idx, minTotalCost);
                isCompletedSearch = true; // 後で処理が増えるかもなので一応更新しておく
                return false;
            };
        });
    };
};

/** 探索結果をオブジェクトで返す */
cls.prototype.getResult = function(){
    return new cls.Result(this);
},

/** マス目情報を返す */
cls.prototype._getSquare = function(index){
    return this._squares[index[0]][index[1]];
};

/** 全てのマス目に対して関数を実行する, 関数で return false すると break */
cls.prototype._map = function(func){
    var x, y;
    for (x = 0; x < this._squares.length; x++) {
        for (y = 0; y < this._squares[0].length; y++) {
            var square = this._getSquare([x, y]);
            var idx = [x, y];
            if (func(square, idx) === false) {
                return;
            };
        };
    };
};


/**
 * 経路探索結果クラス
 */
cls.Result = (function(){

    var kls = function(pathSearcher){

        // !! PathSearcherオブジェクトへの参照を残さないように !!

        /** 探索時に設定した移動力 */
        this._movePower = pathSearcher._movePower;

        /** 経路探索結果情報リスト
            各要素 = {steps:経路を示す座標＆移動コストリスト,
                      totalCost:その経路に必要な移動コスト} */
        this._data = [];

        // 結果データを生成する
        var self = this;
        pathSearcher._map(function(sq, idx){
            if (sq.paths.length > 0) {
                var newSteps = [];
                var i;
                for (i = 0; i < sq.paths[0].steps.length; i++) {
                    newSteps[i] = {
                        index: [
                            sq.paths[0].steps[i].index[0] + pathSearcher._deltaXIndex,
                            sq.paths[0].steps[i].index[1] + pathSearcher._deltaYIndex
                        ],
                        cost: sq.paths[0].steps[i].cost
                    };
                };
                self._data.push({
                    steps: newSteps,
                    totalCost: sq.paths[0].totalCost
                });
            };
        });
    };

    /** 探索結果を未加工の配列データで返す */
    kls.prototype.getRawData = function(){
        return this._data;
    };

    /** 到達可能な終点座標のみをリストで返すショートカット関数
        近い順にソートされる, [0]には始点が入る */
    kls.prototype.getAllEndPoints = function(){
        var data = this._data.slice();
        data.sort(function(a, b){return a.totalCost - b.totalCost});
        var points = [];
        var i;
        for (i = 0; i < data.length; i++) {
            var steps = data[i].steps;
            points.push(steps[steps.length - 1].index);
        };
        return points;
    };

    /** 終点を指定して一経路情報を返す, 移動不可なマスの場合は null
        複数経路がある場合、どのルートになるかは保障されない */
    kls.prototype.getPathData = function(idx){
        var i;
        for (i = 0; i < this._data.length; i++) {
            var dat = this._data[i];
            if (idx[0] === dat.steps[dat.steps.length - 1].index[0] &&
                idx[1] === dat.steps[dat.steps.length - 1].index[1]) {
                return dat;
            };
        };
        return null;
    };

    /** 指定点が範囲内であるかを判定するショートカット関数 */
    kls.prototype.hasPath = function(idx){
        return (this.getPathData(idx) !== null)? true: false;
    };

    /** 経路座標リストだけを返すショートカット関数 */
    kls.prototype.getStepIndexes = function(idx){
        var idxs = [];
        var path = this.getPathData(idx);
        if (path === null) return idxs;
        var i;
        for (i = 0; i < path.steps.length; i++) {
            idxs.push(path.steps[i].index);
        };
        return idxs;
    };

    /** 合計移動コストだけを返すショートカット関数 */
    kls.prototype.getTotalCost = function(idx){
        var path = this.getPathData(idx);
        if (path === null) return null;
        return path.totalCost;
    };

    /** 経路探索の始点 [x, y] を返す */
    kls.prototype.getStartPoint = function(){
        return this._data[0].steps[0].index;
    };

    /** 経路探索時に設定した移動力を返す */
    kls.prototype.getMovePower = function(){
        return this._movePower;
    };

    return kls;
})();


// 定数群
cls.VERSION = '0.1.1';
cls.RELEASED_AT = '2012-03-29 00:00:00';
/** 移動力を制限しない状態を示す値, 現在はsearch時に移動力を指定しなかった場合に入る
    int上限値が入っているが値は何でも良く、特に意味はない
    Number.MAX_VALUE は parseInt で 1 になるので使わない */
cls.INFINITY_MOVE_POWER = 2147483647;


// 変数群
/** 開発中フラグ */
cls.debug = false;


// 汎用関数群
cls._consoleLog = function(){
    if ('console' in __classScope__ && 'log' in __classScope__.console) {
        try {
            return __classScope__.console.log.apply(__classScope__.console, arguments);
        } catch (err) {// For IE
            var args = Array.prototype.slice.apply(arguments);
            return __classScope__.console.log(args.join(' '));
        };
    };
};
$d = function(){ if (cls.debug) cls._consoleLog.apply(this, arguments) };


__classScope__['PathSearcher'] = cls;
})();


// Example (Please delete comment out for your test)
/*
(function(){

    // Your game map
    // y
    //  +-----+
    // 3|13111|
    // 2|112x1|
    // 1|1xxx1|
    // 0|11113|
    //  +-----+
    //   01234 x
    var yourSquares = [];
    for (var x = 0; x < 5; x++) {
        yourSquares[x] = [];
        for (var y = 0; y < 4; y++) {
            yourSquares[x][y] = {
                moveCost: 1,
                keepOut: false
            };
        };
    };
    yourSquares[1][1].keepOut = true;
    yourSquares[2][1].keepOut = true;
    yourSquares[3][1].keepOut = true;
    yourSquares[3][2].keepOut = true;
    yourSquares[1][3].moveCost = 3;
    yourSquares[2][2].moveCost = 2;
    yourSquares[4][0].moveCost = 3;

    // Print debug message by console.log()
    PathSearcher.debug = true;


    // = Example.1 =
    // Unit move from [0, 0] by Move-Power=7
    var ps = new PathSearcher();
    ps.load(yourSquares, function(sq, idx){
        if (sq.keepOut === true) {
            return false;
        };
        return sq.moveCost;
    });
    ps.search([0, 0], 7);
    var result = ps.getResult();
    console.log(result.getAllEndPoints()); // -> [[0, 0], [0, 1], ... , [4, 1]]
    console.log(result.getPathData([3, 3])); // -> {steps: [{index:[0, 0], cost:0}, ...], totalCost: 7}
    console.log(result.getStepIndexes([3, 3])); // -> [[0, 0], [0, 1], ... , [3, 3]]
    console.log(result.getTotalCost([3, 3])); // -> 7
    console.log(result.getPathData([4, 3])); // -> null (impossible path)
    console.log(result.hasPath([4, 1])); // -> true
    console.log(result.hasPath([4, 2])); // -> false
    console.log(result.getStartPoint()); // -> [0, 0]
    console.log(result.getMovePower());  // -> 7

    // = Example.2 =
    // Unit move from [4, 3] by Move-Power=2
    // If you can forecast the unit max movable steps, this example is best method for processing speed
    // y
    //  +-----+
    // 3|**111|
    // 2|**2x1|
    // 1|**xx1|
    // 0|*****|
    //  +-----+
    //   01234 x
    var ps = new PathSearcher();
    ps.load(yourSquares, function(sq, idx){
        if (sq.keepOut === true) {
            return false;
        };
        return sq.moveCost;
    }, {
        minXIndex: 2,
        minYIndex: 1
    });
    ps.search([4, 3], 2);
    var result = ps.getResult();
    console.log(result.getPathData([2, 3]));

    // = Example.3 =
    // You want to check just an only one path from [0, 0] to [1, 2]
    // y
    //  +-----+
    // 3|13111|
    // 2|112x1|
    // 1|1xxx1|
    // 0|11113|
    //  +-----+
    //   01234 x

    // 1) All check
    var ps = new PathSearcher();
    ps.load(yourSquares, function(sq, idx){
        if (sq.keepOut === true) {
            return false;
        };
        return sq.moveCost;
    });
    ps.search([0, 0], PathSearcher.INFINITY_MOVE_POWER);
    var result = ps.getResult();
    console.log(result.getRawData().length); // `16` pathes
    // 2) Only one check
    var endIndex = [1, 2];
    var ps = new PathSearcher();
    ps.load(yourSquares, function(sq, idx){
        if (sq.keepOut === true) {
            return false;
        };
        return sq.moveCost;
    });
    ps.search([0, 0], PathSearcher.INFINITY_MOVE_POWER, endIndex);
    var result = ps.getResult();
    console.log(result.getPathData(endIndex));
    console.log(result.getRawData().length); // Only `7` paths, of course faster than previous method
})();
*/
