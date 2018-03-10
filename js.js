
function $(s) {
    return document.querySelector(s);
}

var amountOfTask = 2;
var addTask = $(".add");
var showResult = $('.show-result');
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
    //TODO:修改template的内容
    const template = `
    <div class="right-item">
        <div class="time-line">
            <div class="used-time"></div>
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



addTask.addEventListener("click",()=>{
    //add a Task
    amountOfTask ++;
    //添加一个left-item
    leftList.insertBefore(newLeftItem(), addTask);
    //添加一个right-item
    var space = $('#right-space');
    rightList.insertBefore(newRightItem(), space);
    var divider = $('.divider');
    divider.style.height = (divider.offsetHeight + 44) + 'px';
})

showResult.addEventListener('click', ()=>{

})
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