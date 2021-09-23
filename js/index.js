class Task {
  constructor(title, difficulty = 'medium', due = null, notes = ' ') {
    this.title = title;
    this.difficulty = difficulty;
    this.due = due; //new Date()
    this.notes = notes;
  }
}

class Reward {
  constructor(title, cost = 5 , notes = ' ') {
    this.title = title;
    this.cost = cost;
    this.notes = notes;
  }
}

class TodoState {
  constructor(tasks = [], rewards = [], coins = 0) {
    this.tasks = tasks;
    this.rewards = rewards;
    this.coins = coins;
  }
  addTask(task) {
    return new TodoState(this.tasks.push(task), this.rewards, this.coins)
  }
  removeTask(task) {
    this.tasks = this.tasks.filter(e => {return e.title != task.title})
    return new TodoState(this.tasks, this.rewards, this.coins)
  }

  addReward(reward) {
    return new TodoState(this.tasks,this.rewards.push(reward), this.coins)
  }
  removeReward(reward) {
    this.rewards = this.rewards.filter(e => {return e.title != reward.title})
    return new TodoState(this.tasks, this.rewards, this.coins)
  }
  complete(task) {
     if (task.difficulty == 'trival') this.coins += 1;
     if (task.difficulty == 'easy') this.coins += 2;
     if (task.difficulty == 'medium') this.coins += 5;
     if (task.difficulty == 'hard') this.coins += 10;

     this.tasks = this.tasks.filter(e =>{return  e.title != task.title});
     //return new TodoState(this.tasks, rewards, this.coins);
  }
  claim(reward) {
     if (this.coins >= reward.cost) {
         this.coins -= reward.cost;
       this.rewards = this.rewards.filter(e => {return e.title != reward.title});
       return new TodoState(this.tasks, this.rewards, this.coins);
     }
     else {
       return false
     }
  }
}



function todayTaskList(taskList) {
      let currentDate = new Date();
      return taskList.filter(e => {
        return (e.due.getFullYear() == currentDate.getFullYear() &&
        e.due.getMonth() == currentDate.getMonth() &&
        e.due.getDate() == currentDate.getDate())})
}

function nextSevenDayList(taskList) {
  let sevenDayList = [];
  for(let i = 0; i<7; i++) {
    let currentDate = new Date( )
    currentDate = new Date(currentDate.getFullYear() ,currentDate.getMonth(), currentDate.getDate() + i)
    for(let task of taskList) {
      if (task.due.getFullYear() == currentDate.getFullYear()
        && task.due.getMonth() == currentDate.getMonth()
        && task.due.getDate()  == currentDate.getDate() ) {
           sevenDayList.push(task)
        }
    }
  }
  return sevenDayList;
}






//Testing Code
/*
currentDate = new Date();
tasks = [{due:currentDate, name:'akshat'} , {due: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 5), name: 'bitch'}];
//console.log(tasks);
let t = nextSevenDayList(tasks)

console.log(t)
*/

/*
let tasks = [new Task('Clean Room','medium' ,new Date(2021,8,14), 'ok'),
             new Task('Maths assignment', 'easy' , new Date(), 'ok')];
let rewards = [new Reward('Tv'), new Reward('Beer')]
//Setting the State
let present = new TodoState(tasks, rewards)
let task1 = new Task('Hola','Hard', new Date(), 'ok')
let reward1 = new Reward('pepsi')
present.addTask(task1)
present.addReward(reward1)
console.log(present)
console.log('\n \n')
console.log(`Today's Task is ${todayTaskList(tasks)[0].title}`);
console.log(`In next 7 days i have ${nextSevenDayList(tasks)[1].title}`);
present = present.removeTask(task1)
present = present.removeReward(reward1)
console.log('\n \n')
console.log(present)
console.log('\n \n')
present = present.complete(tasks[0]);
console.log(present)
present = present.claim(rewards[0])
console.log('\n \n')
console.log(present);
*/



/********************************************************************************************
          Web Based Javascript
***********************************************************************************************/

let state = new TodoState()

document.getElementById('taskEnter').style.display = 'none';
document.getElementById('rewardEnter').style.display = 'none';

document.getElementById("plusTask").addEventListener("click",function (){displayForm('addT','block','plusTask', null)});
document.getElementById("plusReward").addEventListener("click",function (){displayForm('addR', 'block', 'plusReward', null)});

document.getElementById("closeTask").addEventListener("click",function (){displayForm('addT','none',null,'plusTask')});
document.getElementById("closeReward").addEventListener("click",function (){displayForm('addR', 'none', null,'plusReward')});


document.getElementById("addButton").addEventListener("click",function (){todoList('addT')});
document.getElementById("rewardButton").addEventListener("click",function (){todoList('addR')});

function todoList(type) {
   let title = document.getElementById('title').value;
   let difficulty =  document.getElementById("difficulty").value;
   let due = document.getElementById("due").value;
   let notes = document.getElementById('notes').value;
   let cost = Number(document.getElementById('cost').value);

   // figure out wrong inputs
   if (type == 'addT') {
   if (title != '') {
      if (due == '') {
        due = null
      }
      else {
        due = new Date(due)
      }
    let task = new Task(title, difficulty, due, notes)
    state.addTask(task)
    display(task, 'task')
    displayForm('addT', 'none', null, 'plusTask')

   }
 }

 else if (type == 'addR' ) {
   if (title != '' && !isNaN(cost)) {
      let reward = new Reward(title, cost, notes)
      state.addReward(reward)
      display(reward, 'reward')
      displayForm('addR', 'none', null, 'plusReward')
      }
    }
  }




function taskComplete(task) {
  elementTask = document.getElementById(task.title);
  state.complete(task);
  updateCoins();
  elementTask.remove();
}

function taskClaim(reward) {
  elementReward = document.getElementById(reward.title);
  let boolean = state.claim(reward);
  if (typeof boolean == 'object') {
    updateCoins();
  elementReward.remove();
}
}

function elementCreate(tag,id, name, parent, object ) {
  var tag = document.createElement(tag);
  tag.id = id
  if (name == 'done') {
  tag.onclick =function(){taskComplete(object)};
  }
  if (name == 'claim') {
    tag.onclick = function() {taskClaim(object)};
  }
  var text = document.createTextNode(name);
  tag.appendChild(text)
  parent.appendChild(tag)
}
function display(object, type) {
     if (type == 'task' ) {
     let task = object;
     let parent = document.getElementById('tasks');
     let li = document.createElement('li')
     li.id = task.title;
     elementCreate('h5', 'titleTask', task.title, li,task);
     elementCreate('p', 'difficultyTask', task.difficulty, li,task);
     elementCreate('p', 'dueTask', task.due, li,task);
     elementCreate('p', 'Notes', task.notes, li,task);
     elementCreate('button', 'completeButton', 'done',li,task);
     //elementCreate('button', 'deleteButton', 'delete', li, task);
     parent.appendChild(li)
     displayForm('addT','none')
   }
   if (type == 'reward') {
       let reward = object;
       let parent = document.getElementById('rewards')
       let li = document.createElement('li')
       li.id = reward.title;
       elementCreate('h5', 'titleReward', reward.title, li,reward);
       elementCreate('p', 'notesReward', reward.notes, li,reward);
       elementCreate('p', 'costReward', reward.cost, li, reward);
       elementCreate('button', 'claimButton', 'claim', li, reward);
       parent.appendChild(li)
       displayForm('addR', 'none');
   }
}

function displayForm(type , process, buttonToHide,buttonToDisplay) {
  console.log(type, process, buttonToHide, buttonToDisplay)
  if (buttonToHide != null) {
    document.getElementById(buttonToHide).style.display = 'none'
  }
  if (buttonToDisplay != null) {
    document.getElementById(buttonToDisplay).style.display = 'block'
  }

  if (type == 'addT') {
      document.getElementById('taskEnter').style.display = process;
  }
  if (type == 'addR') {
    document.getElementById('rewardEnter').style.display = process;
  }
}

function updateCoins() {
   let coinsId = document.getElementById('coins')
   coinsId.innerText = state.coins
}
