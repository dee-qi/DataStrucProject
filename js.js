
function $(s) {
    return document.querySelector(s);
}

var amountOfTask = 2;
var addTask = $(".add");
var showResultBt = $('.show-result');
var leftList = $('.list-left');
var rightList = $('.list-right');

function getElementViaTemplate(str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    return div.children[0];
}

function newLeftItem() {
    const template = `
    <span class="left-item">
        <p class="meachin-name">任务${amountOfTask}</p>
        <p>Release Time:</p>
        <input class="input-rt" onchange="toDoOnChange(this)">
        <p>Deadline:</p>
        <input class="input-ddl" onchange="toDoOnChange(this)">
    </span>
    `;
    return getElementViaTemplate(template);
}

function newRightItem() {
    const template = `
    <div class="right-item">
        <div class="time-line">
            <div class="used-time"></div>
        </div>
    </div>
    `
    return getElementViaTemplate(template);
}

function newResultItem() {
    const template = `
    <div class="result-item">
            <div class="time-line">
                <div class="arrangement">
                </div>
            </div>
        </div>
    `
    return getElementViaTemplate(template);
}

function getReleaseTime(/*第i个任务*/i) {
    return leftList.children[i].children[2].value;
}

function getDeadline(/*第i个任务*/i) {
    return leftList.children[i].children[4].value;
}

function getMaxDeadline(){
    var len = leftList.children.length-2;
    var max = 0;
    for(var i=1; i<=len; i++){
        var ddl = getDeadline(i);
        if(Number(ddl) > Number(max)){
            max = ddl;
        }
    }
    return max;
}

var reg = /^\d+$/;
function check(e){
    if(reg.test(e.value) == false){
        alert('必须输入大于0的整数！');
        e.value = '';
        return false;
    } else if(e.value < 1) {
        alert('输入数字必须大于0');
        e.value = '';
        return false;
    }
    return true;
}

var maxDeadline = 0;

function drawTimeLine(e) {
    var nthTask = e.parentNode.children[0].innerHTML.substring(2);
    var release = getReleaseTime(nthTask);
    var ddl = getDeadline(nthTask);
    if(release != '' && ddl != '') {
        console.log('drawTimeLine', nthTask);
        var timeLine = rightList.getElementsByClassName('time-line')[nthTask-1];
        var usedLine = timeLine.children[0];
        usedLine.style.width = timeLine.offsetWidth/maxDeadline * (ddl -release) + 'px';
        usedLine.style.marginLeft = timeLine.offsetWidth/maxDeadline * (release - 1) + 'px';
    }
}

function reDrawAllTimeLine(){
    var eList = document.getElementsByTagName('input');
    for(var i=0; i<eList.length; i=i+2){
        drawTimeLine(eList[i]);
    }
}

function drawRuler() {
    var ruler = $('.ruler');
    var divider = $('.divider');
    ruler.innerHTML = '';
    divider.innerHTML = '';
    var s1 = document.createElement('span');
    divider.appendChild(s1);
    for(var i=1; i<=maxDeadline; i++){
        var p = document.createElement('p');
        p.innerHTML = i;
        ruler.appendChild(p);
        var s = document.createElement('span');
        divider.appendChild(s);
    }
    divider.style.width = ruler.offsetWidth + 'px';
    divider.style.margin = '0 10px';
    reDrawAllTimeLine();
}

function toDoOnChange(e){
    if(check(e)) {
        var max = getMaxDeadline();
        if(max != maxDeadline) {
            maxDeadline = max;
            drawRuler();
        }
        drawTimeLine(e);
    }
}

function getResult() {
    //TODO:修改获取结果的算法，当前仅为测试数据
    //此方法返回一个二维数组，第一维代表有几个结果，第二维是maxDeadline
    var result = new Array(4);
    for(var i=0; i<result.length; i++){
        result[i] = new Array(10);
    }
    result[0][3] = 1;
    result[0][9] = 2;
    result[1][2] = 1;
    result[1][5] = 2;
    result[2][4] = 1;
    result[2][7] = 2;
    result[3][1] = 1;
    result[3][5] = 2;
    return result;
}

function showResult() {
    var resultContainer = $('.result');
    resultContainer.className = resultContainer.className.replace(' hidden', '');
    var result = getResult();
    console.log('show result')
    var ruler = $('.result .ruler');
    var divider = $('.result .divider');
    var max = result[0].length;
    var amountOfResult = result.length;
    // var max = 36;
    ruler.innerHTML = '';
    divider.innerHTML = '';
    for(var i=1; i<=max; i++) {
        var p = document.createElement('p');
        p.innerHTML = i;
        ruler.appendChild(p);
        var xiaosaisai = document.createElement('span');
        divider.appendChild(xiaosaisai);
    }
    var xiaosaisai = document.createElement('span');
    divider.appendChild(xiaosaisai);
    divider.style.width = ruler.offsetWidth + 'px';
    divider.style.margin = '0 10px';
    divider.style.height = (50 + 44*result.length) + 'px';


    var oldResult = resultContainer.getElementsByClassName('result-item');
    console.log(oldResult.length);
    var len = oldResult.length;
    for(var x=0; x<len; x++) {
        resultContainer.removeChild(oldResult[0]);
        console.log('remove', x);
        console.log('len', oldResult.length);
    }
    for(var i=0; i<amountOfResult; i++) {
        var resultItem = newResultItem();
        var arrangement = resultItem.getElementsByClassName('arrangement')[0];
        console.log(arrangement);
        for(var k=0; k<max; k++) {
            var p = document.createElement('p');
            arrangement.appendChild(p);
            if(result[i][k] == undefined) {
                p.style.visibility = 'hidden';
                
            } else {
                p.style.visibility = 'visiable';
                p.innerHTML = result[i][k];
            }
        }
        resultContainer.appendChild(resultItem);
    }
}

//-----------------------
//为各个地方添加监听事件
//-----------------------
addTask.addEventListener("click",()=>{
    amountOfTask ++;
    leftList.insertBefore(newLeftItem(), addTask);
    var space = $('#right-space');
    rightList.insertBefore(newRightItem(), space);
    var divider = $('.divider');
    divider.style.height = (divider.offsetHeight + 44) + 'px';
})

showResultBt.onclick = showResult;

//TODO:这是个测试方法，删除这一部分
$('#right-space').addEventListener('click', ()=>{
    alert(getReleaseTime(1)+", "+getDeadline(1));
})

window.onresize = function() {
    if(maxDeadline != 0){
        drawRuler();
        reDrawAllTimeLine();
    }
}