
function $(s) {
    return document.querySelector(s);
}

var amountOfTask = 2;
var addTask = $(".add");
var showResultBt = $('.show-result');
var showEarlyBt = $('.show-early');
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
    <div class="right-item ${amountOfTask%2==0 ? 'light-blue' : ''}">
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

function Task(id, rt, ddl) {
    this.id = id;
    this.rt = rt;
    this.ddl = ddl;

    this.isBiggerThan = function(task) {
        if(this.rt > task.rt) return true;
        if(this.rt == task.rt && this.ddl > task.ddl) return true;
        return false;
    }
}

function sortTasks(list) {
    for(var i=0; i<list.length; i++) {
        for(var j=i+1; j<list.length; j++) {
            if(list[i].isBiggerThan(list[j])) {
                var temp = list[i];
                list[i] = list[j];
                list[j] = temp; 
            }
        }
    }
    return list;
}

function getSortedInput() {
    var input = [];
    var leftItemList = document.getElementsByClassName('left-item');
    for(var i=0; i<leftItemList.length; i++) {
        var rts = leftItemList[i].getElementsByClassName('input-rt')[0].value;
        var ddls = leftItemList[i].getElementsByClassName('input-ddl')[0].value;
        input[i] = new Task(i+1, parseInt(rts), parseInt(ddls));
        sortTasks(input);
    }
    return input;
}

function copyArray(a) {
    var b = new Array(a.length);
    for(var i=0; i<a.length; i++) {
        b[i] = a[i];
    }
    return b;
}

function processNext(index, occupied, tempResult, input, result) {
    for(var i=input[index].rt; i<input[index].ddl; i++) {
        if(occupied.indexOf(i) == -1) {
            tempResult[i] = input[index].id;
            occupied.push(i);
            if(index == input.length-1) {
                result.push(copyArray(tempResult));
            } else {
                processNext(index+1,  occupied, tempResult, input, result);                              
            }
            tempResult[i] = undefined;
            occupied.pop();
        } else {
            continue;
            
        }
    }
}

function getAllResult() {
    //TODO:修改获取结果的算法，当前仅为测试数据
    //此方法返回一个二维数组，第一维代表有几个结果，第二维大小是是maxDeadline
    //result[i][j] = k 表示第i个调度方案的j时间安排编号为k的任务
    var input = getSortedInput();
    var result = [];
    var occupied = [];
    for(var i=input[0].rt; i<input[0].ddl; i++) {
        var index = 0;
        var tempResult = [];
        tempResult[i] = input[0].id;
        occupied.push(i);
        processNext(index+1, occupied, tempResult, input, result);
        tempResult[i] = undefined;
        occupied.pop();
    }
    return adjustResult(result);
}

//好无奈啊。。。
function adjustResult(result) {
    var a = new Array(result.length);
    for(var i=0; i<result.length; i++) {
        a[i] = new Array(parseInt(maxDeadline)-1);
        for(var j=1; j<result[i].length; j++){
            a[i][j-1] = result[i][j];
        }
    }
    return a;
}

function showResult(result) {
    var resultContainer = $('.result');
    resultContainer.className = resultContainer.className.replace(' hidden', '');
    var ruler = $('.result .ruler');
    var divider = $('.result .divider');
    var max = result[0].length;
    var amountOfResult = result.length;
    //调整ruler和divider
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

    //移除原来的result-item
    var oldResult = resultContainer.getElementsByClassName('result-item');
    var len = oldResult.length;
    for(var x=0; x<len; x++) {
        resultContainer.removeChild(oldResult[0]);
    }
    //添加新的result-item
    for(var i=0; i<amountOfResult; i++) {
        var resultItem = newResultItem();
        var arrangement = resultItem.getElementsByClassName('arrangement')[0];
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
        if(i%2==1) resultItem.className = resultItem.className + ' light-blue';
        resultContainer.appendChild(resultItem);
    }
}

function getLastNoEmptyIndex(array) {
    for(var i=array.length-1; i>=0; i--) {
        if(array[i] !== undefined) return i;
    }
    return -1;
}

function getEarlyResult() {
    console.log('getEarlyResult');
    var result = getAllResult();
    var last = result[0].length-1;
    for(var i=0; i<result.length; i++) {
        var index = getLastNoEmptyIndex(result[i]);
        if(index < last) last = index;
    }
    for(var i=0; i<result.length; i++) {
        var index = getLastNoEmptyIndex(result[i]);
        if(index > last) {
            result.splice(i, 1);
            i--;
        }
    }
    console.log('early', result);
    return result;
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

showResultBt.onclick = function() {
    showResult(getAllResult());
};
showEarlyBt.onclick = function() {
    showResult(getEarlyResult());
};

window.onresize = function() {
    if(maxDeadline != 0){
        drawRuler();
        reDrawAllTimeLine();
    }
    var ruler = $('.result .ruler');
    var divider = $('.result .divider');
    divider.style.width = ruler.offsetWidth + 'px';
}

$('.welcome-img').onclick = function() {
    var img = $('.welcome-img');
    img.parentNode.className = img.parentNode.className + ' hidden';
}