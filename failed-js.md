const input = document.querySelector('.input');
const todoContainer = document.querySelector('.todo-container')
// let checked = false;
input.addEventListener('keyup',(e)=>
{
    value= input.value;
    let id = new Date().getTime()
    
    if(e.code=="Enter" && value!==""){
      create(value,id,false);
      saveToLocalStorage(value,id,false);
      input.value ="";
     
    }
    else if(e.code=="Enter" && value==""){(alert('Please Input a Task!'))}
    
});


const updateAllTodoCount = ()=>{
    
   
    const lists = document.querySelectorAll('.todo')
    allTodoCount=lists.length
    if(lists.length>0){
        todoMangeTab.classList.add('show');
        todoMangeTab.querySelector('.task-count').textContent= allTodoCount
    }

}



const create = (value,id,checked)=>{
    let checkClass ="";
    if(checked=="false"){
        checkClass= '';
    }
    else if(checked =="true"){
        checkClass='checked'
    }
    const liElement = `
        <li class="todo flex ${checkClass}" data-id = '${id}' data-check = '${checked}'>
        <div class="circle check">
          <img src="./images/icon-check.svg"  class="check-icon"alt="">
        </div>
        <p class="todo-title">${value}</p>
        <img src="./images/icon-cross.svg" class="delete-icon" alt="">
        </li>
      `
        todoContainer.innerHTML += liElement;
        entries.push(liElement);
        const checkIcons = document.querySelectorAll('.check')
        checkIcons.forEach((checkIcon)=>{
            checkIcon.addEventListener('click',check);
        })
        updateAllTodoCount()
        updateUncompletedTodoCount()
}

const check=(e)=>{
const target=e.currentTarget.parentElement;
// console.log('ischeck'+target.dataset.check);

target.dataset.check=="false"?target.dataset.check="true":target.dataset.check="false";
// console.log('ischeck'+target.dataset.check);
const id = target.dataset.id;
const isCheck=target.dataset.check
// console.log(isCheck)
if(isCheck == "true"){
    target.classList.add('checked');
    // completedTodoCount++
}
else if(isCheck !== "true"){
    target.classList.remove('checked');
    // completedTodoCount--
}


updateLocalStorage(id,isCheck)
updateUncompletedTodoCount()
}

const clearCompleted =()=>{
    const lists = document.querySelectorAll('.todo');
    lists.forEach((list,length)=>{
        if(list.dataset.check=="true"){
            list.remove();
            deleteFromLocalStorage(list.dataset.id)
        };
    })
    
}
clearButton.addEventListener('click',clearCompleted);
const updateUncompletedTodoCount=()=>{
    const uncompltedTask = todoMangeTab.querySelector('.task-left');
    entries.forEach((entry)=>{
        console.log(entry)
    })
    let data =JSON.parse(localStorage.getItem('data'));
    uncompltedTask.textContent= allTodoCount-data
    
    console.log(completedTodoCount)
    console.log(data)
}
 /*
*Event Listener
*/ 
/*
*Local Storage
*/ 
function saveToLocalStorage(value,id,checked){
    const list ={value,id,checked}
    let lists = getLocalStorage();
    lists.push(list);
    localStorage.setItem("itemList",JSON.stringify(lists));
    console.log(lists);
}


function getLocalStorage(){
    return localStorage.getItem("itemList")?JSON.parse(localStorage.getItem("itemList")):[];
}

const updateLocalStorage=(id,isCheck)=>{
    let items = getLocalStorage();
    console.log(id,isCheck,items)
    items.forEach((item)=>{
        if(item.id==id){
            item.checked = isCheck;
        }
    })
    localStorage.setItem("itemList",JSON.stringify(items));
}
const deleteFromLocalStorage =(id)=>{
    console.log(id);
    let items = getLocalStorage();
    console.log(items)
    items = items.filter(function (item) {
        if (item.id !== id) {
          items.slice(item,1)
        }
    })
    console.log(items)

    localStorage.setItem("itemList",JSON.stringify(items));
}
const runLocalStorage=()=>{
    let items = getLocalStorage();
    if(items.length>0){
        items.forEach((item)=>{
            // console.log(item.value,item.id,item.checked)
            create(item.value,item.id,item.checked)
        })
    }
}




window.addEventListener('DOMContentLoaded',runLocalStorage)
window.addEventListener('DOMContentLoaded',updateAllTodoCount)
window.addEventListener('DOMContentLoaded',updateUncompletedTodoCount)