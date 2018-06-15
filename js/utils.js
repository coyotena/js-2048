let utils = (() => {

    let hasClass = (ele, strClass) => {
        return ele.className.trim().split(/ +/).indexOf(strClass) > -1;
    };

    let addClass = (ele, strClass) => {
        if (hasClass(ele, strClass)) {
            return;
        }
        ele.className += ` ${strClass}`;
    };

    let removeClass = (ele, strClass) => {
        if (!hasClass(ele, strClass)) {
            return;
        }
        let ary = ele.className.trim().split(/ +/);
        ary = ary.filter((item, index) => item !== strClass);
        ele.className = ary.join(" ");
    };

    return {
        hasClass,
        addClass,
        removeClass,
    }
})();

//动态创建表格
let createCell = (num = 4, containerEle = start) => {
    let str = ``;
    let width = +(1 / num).toFixed(2) * 100 + '%';
    containerEle.style.display = 'none';
    gameRender.init(num);
    let height = parseFloat(getComputedStyle(gamecont)['width']) * (+(1 / num).toFixed(2)) + 'px';
    for (let i = 0; i < Math.pow(num, 2); i++) {
        str += `<div class="cell" style="width:${width};height:${height}" data-x="${parseInt(i / num)}"  data-y="${i % num}" data-has="false"><span class="block number"></span></div>`
    }
    gamecont.innerHTML = str;
    handleSum();
};

//产生随机数
let randomNum = (max) => {
    return parseInt(Math.random() * max);
};

let randAry = [2, 2, 4, 2, 2];
let addSpanNum = () => {
    let num = +(gamecont.getAttribute("num"));
    let cellAry = [...gamecont.getElementsByClassName("cell")];
    let randnum = randAry[randomNum(randAry.length)],//产生随机数
        x = randomNum(num),
        y = randomNum(num);
    if (cellAry.some(item => item.getAttribute('data-has') === 'false')) {//如果还有空闲位置
        //在空闲随机位置随机产生随机数
        let cellEle = cellAry.find(item => +item.getAttribute('data-x') === x && +item.getAttribute("data-y") === y && item.getAttribute('data-has') === 'false');
        while (!cellEle) {
            x = randomNum(num);
            y = randomNum(num);
            cellEle = cellAry.find(item => +item.getAttribute('data-x') === x && +item.getAttribute("data-y") === y && item.getAttribute('data-has') === 'false');
        }
        cellEle.setAttribute('data-has', true);
        cellEle.setAttribute('data-num', randnum);
        let cellSpan = cellEle.childNodes[0];
        utils.addClass(cellSpan, 'numcolor');
        cellSpan.innerHTML = randnum;
    } else {
        localStorage.setItem('coyotescore',history.innerHTML);
        // alert("game over")
        wrapmark.style.display = 'block';
        overScore.innerHTML = total.innerHTML;
    }
    //计算当前分数
    computeScore();

};

//判断move方向，合并数据，移动单元格并求和
let handleSum = () => {
    let cellAry = [...gamecont.getElementsByClassName("cell")];
    let num = gamecont.getAttribute('num');
    //第一次进来
    if (cellAry.every(item => item.getAttribute("data-has") === 'false')) {
        addSpanNum();
        return;
    }
    if (Math.abs(gamecont.changeL) - Math.abs(gamecont.changeT) >= 0) {
        //左右
        if (gamecont.changeL >= 0) {
            //向右
            for (let i = 0; i < num; i++) {
                filterDirectCell('right', i);
            }
            // console.log('向右');
        } else {
            //向左
            for (let i = 0; i < num; i++) {
                filterDirectCell('left', i);
            }
            // console.log('向左');
        }
    } else {
        //上下
        if (gamecont.changeT >= 0) {
            //向下
            for (let i = 0; i < num; i++) {
                filterDirectCell('bottom', i);
            }
            // console.log('向下');
        } else {
            //向上
            for (let i = 0; i < num; i++) {
                filterDirectCell('top', i);
            }
            // console.log('向上');
        }
    }
    addSpanNum();

};

//计算当前分数，处理历史最高分
let computeScore = () => {
    let cellAry = [...gamecont.getElementsByClassName("cell")];
    let totalScore = cellAry.reduce((prev, next) => {
        if (next.getAttribute('data-has') === 'true') {
            return prev + (+next.getAttribute('data-num'));
        }
        return prev + 0;
    }, 0);
    total.innerHTML = totalScore;
    if (totalScore > +history.innerHTML) {
        history.innerHTML = totalScore;
        freHistory.style.display = 'block';
    }
};
//筛选同一方向的cell数组
let filterDirectCell = (direct, ind) => {
    let cellAry = [...gamecont.getElementsByClassName("cell")];
    let fitCell = [];
    switch (direct) {
        case 'right':
            fitCell = cellAry.filter(item => +item.getAttribute('data-x') === ind && item.getAttribute('data-has') === 'true').reverse();
            break;
        case 'left':
            fitCell = cellAry.filter(item => +item.getAttribute('data-x') === ind && item.getAttribute('data-has') === 'true');
            break;
        case 'top':
            fitCell = cellAry.filter(item => +item.getAttribute('data-y') === ind && item.getAttribute('data-has') === 'true');
            break;
        case 'bottom':
            fitCell = cellAry.filter(item => +item.getAttribute('data-y') === ind && item.getAttribute('data-has') === 'true').reverse();
            break;
    }
    if(fitCell.length){
        handleFitCellNum(fitCell, direct);
    }
};
//处理滑动求和合并
let handleFitCellNum = (ary, direct) => {
    let num = +gamecont.getAttribute('num');
    // handleFitAry(ary, direct);
    for (let i = 0; i < ary.length; i++) {
        ary = handleFitAry(ary, direct, num);
        let item = ary[i];
        let next = 0,
            cur = +item.getAttribute('data-num');
        if (ary[i + 1]) {
            let cellSpan = item.childNodes[0];
            let cellNextSpan = ary[i + 1].childNodes[0];
            next = +ary[i + 1].getAttribute('data-num');
            //如果相邻的两个数相等，合并求和，并从头开始检测值
            if(next === cur){
                item.setAttribute('data-num', next + cur);
                cellSpan.innerHTML = next + cur;
                utils.removeClass(cellNextSpan, 'numcolor');
                ary[i + 1].setAttribute('data-has', false);
                ary[i + 1].removeAttribute('data-num');
                cellNextSpan.innerHTML = '';
                ary.splice(i+1,1);
                i=-1;
            }
        }

    }
};

//处理有数字数组块位置
let handleFitAry = (ary, direct, num) => {
    let cellAry = [...gamecont.getElementsByClassName("cell")];
    switch (direct) {
        case 'right':
            ary = handleCellNum({handleAry:ary, fullAry:cellAry, maxNum: num, handle: -1, dataDire:'data-y', otherDire:"data-x"});
            break;
        case 'left':
            ary = handleCellNum({handleAry:ary, fullAry:cellAry, maxNum: -1, handle: 1, dataDire:'data-y', otherDire:"data-x"});
            break;
        case 'bottom':
            ary = handleCellNum({handleAry:ary, fullAry:cellAry, maxNum: num, handle: -1, dataDire:'data-x', otherDire:"data-y"});
            break;
        case 'top':
            ary = handleCellNum({handleAry:ary, fullAry:cellAry, maxNum: -1, handle: 1, dataDire:'data-x', otherDire:"data-y"});
            break;
    }
    return ary;
};

let handleCellNum = ({handleAry, fullAry, maxNum, handle, dataDire,otherDire}) => {

    handleAry = handleAry.map((item, index) => {
        let other = +item.getAttribute(otherDire),
            fit = +item.getAttribute(dataDire),
            dataNum = +item.getAttribute("data-num");
        maxNum = maxNum + handle;
        if(maxNum === fit){
            return item;
        }
        let itemSpan = item.childNodes[0];
        let tarCell = fullAry.find(item => +item.getAttribute(otherDire) === other && +item.getAttribute(dataDire) === maxNum);
        let tarSpan = tarCell.childNodes[0];
        utils.addClass(tarSpan, 'numcolor');
        tarCell.setAttribute('data-has', true);
        tarCell.setAttribute('data-num',dataNum);
        tarSpan.innerHTML = dataNum;
        utils.removeClass(itemSpan, 'numcolor');
        item.setAttribute('data-has', false);
        item.removeAttribute('data-num');
        itemSpan.innerHTML = '';
        return tarCell;
    });
    return handleAry;
};

let moveFn = function (e) {
    let evObj = e.changedTouches[0];
    this.changeL = evObj.clientX - this.starL;
    this.changeT = evObj.clientY - this.starT;
    if (Math.abs(this.changeL) > 10 || Math.abs(this.changeT) > 10) {
        this.isMove = true;
    }
};
let moveEndFn = function (callback, e) {
    this.endTime = +(new Date());
    if (this.endTime - this.starTime < 750) {//排除长按
        this.ontouchmove = null;
        this.ontouchend = null;
        if (!this.isMove) {
            if (this.id !== 'gamecont') {
                callback && callback();
                return;
            }
        } else {
            if (this.id === 'gamecont') {
                callback && callback();
                return;
            }
        }
    }

};

let touchstar = function (callback, e) {
    let evObj = e.changedTouches[0];
    this.starL = evObj.clientX;
    this.starT = evObj.clientY;
    this.changeL = evObj.clientX - this.starL;
    this.changeT = evObj.clientY - this.starT;
    this.starTime = +(new Date());
    this.endTime = +(new Date());
    this.isMove = false;
    this.moveFn = moveFn.bind(this);
    this.endFn = moveEndFn.bind(this, callback);
    this.ontouchmove = this.moveFn;
    this.ontouchend = this.endFn;
};

//重新开始游戏
let resetPlay = () => {
    createCell(gamecont.getAttribute('num'));
};
//返回主界面
let goMain = () => {
    startRender.init();
};