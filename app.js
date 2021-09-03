/**
 * Dark / Light Mode Functionality
 */

const mode = document.querySelector('.mode');
const modeButtons = document.querySelectorAll('.mode .button')
const body = document.body
const header = document.querySelector('header');

modeButtons.forEach((button)=>{
    button.addEventListener('click', ()=>{
        
        let target = button.classList[1]
        changeMode(target)
        saveModeToLocalStorage(target)
    })
})

function changeMode(target){
    if(target == "dark-button") {
        trans()
        document.documentElement.setAttribute('data-theme', 'light')
        header.style.backgroundImage ="url(./images/bg-desktop-dark.jpg)"
    } else if(target ="light-button") {
        trans()
        document.documentElement.setAttribute('data-theme', 'dark')
        header.style.backgroundImage ="url(./images/bg-desktop-light.jpg)"
    }
    mode.classList.toggle('change-mode');
}
function saveModeToLocalStorage(target){
    localStorage.setItem('mode', JSON.stringify(target))
}
window.addEventListener('DOMContentLoaded',runMode)

function runMode(){
    let target = JSON.parse(localStorage.getItem('mode'))
    if(target == "dark-button"){
        mode.classList.add('change-mode');
    }
    changeMode(target)
}



let trans = () => {
    document.documentElement.classList.add('transition')
    window.setTimeout(() => {
        document.documentElement.classList.remove('transition')
    }, 1000)
}

//input and todo list
const form = document.querySelector('form')
const input = document.querySelector('.input')
const todoContainer = document.querySelector('.todo-container')
let completedCount = 0
let entries =[]
const actionBox= document.querySelector('.action-box')
const todoManager = document.querySelector('.todo-manager')
const taskCount =todoManager.querySelector('.task-count')
const taskLeft = todoManager.querySelector('.task-left')

const clearCompletedButton = document.querySelector('.clear-button')



const initiate = (e)=>{
e.preventDefault()
let value = input.value
let id = new Date().getTime()
let check = false
input.value= ''
create(value,id,check)
saveToLocalStorage(value,id,check)
if(entries.length>0){
    todoManager.classList.add('show')
    console.log(entries.length)
    taskCount.textContent = entries.length
}
}

form.addEventListener('submit',initiate)

const create = (value,id,check)=>{
   
    const liElement = document.createElement('li')
    liElement.classList.add('todo','flex','draggable')
    liElement.draggable = "true";
    
    check =='true'?liElement.classList.add('checked'):liElement.classList.remove('checked');
    const idAttribute = document.createAttribute('data-id')
    idAttribute.value = id
    const checkAttribute = document.createAttribute('data-check')
    checkAttribute.value = check
    liElement.setAttributeNode(idAttribute)
    liElement.setAttributeNode(checkAttribute)
    liElement.innerHTML = `
        <div class="circle check">
          <img src="./images/icon-check.svg"  class="check-icon"alt="">
        </div>
        <p class="todo-title">${value}</p>
        <img src="./images/icon-cross.svg" class="delete-icon" alt="">
    `
    entries.push(liElement)
    todoContainer.appendChild(liElement)
    const deleteButtons = document.querySelectorAll('.delete-icon')
    deleteButtons.forEach((deleteButton)=>{
        deleteButton.addEventListener('click',deleteTodos)
    })
    const checkButtons = document.querySelectorAll('.check')
    checkButtons.forEach((checkButton)=>{
        checkButton.addEventListener('click',checkTodos)
    })
    callingDragFunctionality(entries)
calculateLeftTodos()
}


const saveToLocalStorage=(value,id,check)=>{
    let items = getLocalStorage()
    items.push({
        value,id,check
    })
    localStorage.setItem('item',JSON.stringify(items))
}

const getLocalStorage = ()=>{
    return localStorage.getItem('item')?JSON.parse(localStorage.getItem('item')):[]
}

window.addEventListener('DOMContentLoaded',runLocalStorage)
function runLocalStorage (){
    const items = getLocalStorage()
    items.map((item)=>{
        create(item.value,item.id,item.check)
    })
    if(items.length>0){
        todoManager.classList.add('show')
    }
}

const deleteTodos = (e)=>{
    let target = e.target.parentNode
    let targetId = target.dataset.id
    
    target.remove();
    updateLocalStorage(targetId)
    entries = entries.filter((item)=>{
        return item.dataset.id != targetId
    })
   if(entries.length == 0){
       todoManager.classList.remove('show');
   }
   calculateLeftTodos()
}
const checkTodos= (e)=>{
    let target = e.target.parentNode
    let targetId = target.dataset.id
    
    target.dataset.check == 'false'? target.dataset.check='true':target.dataset.check=false
    target.classList.contains('checked')?target.classList.remove('checked'):target.classList.add('checked')
updateLocalStorageCheck(targetId,target.dataset.check)
calculateLeftTodos()

}

const updateLocalStorage = (targetId)=>{
    let items = JSON.parse(localStorage.getItem('item'))
    items = items.filter((item)=>{
        return item.id !=targetId
    })
    localStorage.setItem('item',JSON.stringify(items))
}

const updateLocalStorageCheck =(targetId,check)=>{
    let items = JSON.parse(localStorage.getItem('item'))
    items.filter((item)=>{
        if(item.id == targetId){
            item.check = check
        }
    })
    localStorage.setItem('item',JSON.stringify(items))
}



window.addEventListener('DOMContentLoaded', function(){
   calculateLeftTodos()
})


function calculateLeftTodos(){

    let completed = 0;
    entries.forEach((entry)=>{
        if (entry.dataset.check !='true'){
            completed++
        }
    })
    taskLeft.textContent =completed
    taskCount.textContent = getLocalStorage().length
}

const clearCompleted = ()=>{
    let completed = 0
    entries = entries.filter((item)=>{
        let removableId
        if (item.dataset.check == "true"){
            completed++
            removableId = item.dataset.id
            item.remove()
            
            taskCount.textContent = entries.length - completed
            updateLocalStorage(item.dataset.id)
            
        }
        return item.dataset.id != removableId
    })
    console.log(entries)
   if(entries.length == 0){
       todoManager.classList.remove('show');
   }
}

clearCompletedButton.addEventListener('click',clearCompleted)
const actionBoxRun = (e)=>{
let target = e.target.classList[1]
const todos = document.querySelectorAll('.todo')
todos.forEach((todo)=>{
    switch(target){
        case "active" :
            if(todo.dataset.check == "true"){
                todo.classList.add('hide');
            }
            else{
                todo.classList.remove('hide')
            }
            break;
        case "completed": 
        if(todo.dataset.check != "true"){
            todo.classList.add('hide');
        }
        else{
            todo.classList.remove('hide')
        }
        case "all":
            todo.classList.remove('hide')  
    
    }
})
}
actionBox.addEventListener('click',actionBoxRun)

//draging





  

const callingDragFunctionality = (draggables)=>{
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            // console.log(draggable)
          draggable.classList.add('dragging')
        

        })
      
        draggable.addEventListener('dragend', () => {
          draggable.classList.remove('dragging')
          saveDraggedToLocalStorage(draggables)
        })
      })

      
      todoContainer.addEventListener('dragover', e => {
        e.preventDefault()
        const afterElement = getDragAfterElement(todoContainer, e.clientY)
        const draggable = document.querySelector('.dragging')
        if (afterElement == null) {
          todoContainer.appendChild(draggable)
        } else {
          todoContainer.insertBefore(draggable, afterElement)
          
        }
      })
  
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
  
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element
  }
}

// const saveDraggedToLocalStorage =(draggables)=>{
//     let sortedArray =localStorage.getItem('sortedList')?JSON.parse (localStorage.getItem('sortedList')):[]
//        draggables.forEach(draggable=>{
//         const rect = draggable.getBoundingClientRect()
//         let top =rect.top
//         let left =rect.left
//         let draggingID = draggable.dataset.id

//         let items =JSON.parse( localStorage.getItem('item'))

        
//         items.forEach(item=>{
//             if(item.id == draggingID){
//                 sortedArray.push(
//                     {
//                         id:item.id,
//                         top,
//                         left
//                     }
//                 )
//             }
//         })
//         localStorage.setItem('sortedLists',JSON.stringify(sortedArray))
        
//        })
// }

// const sortedList=()=>{
//     const lists =JSON.parse (localStorage.getItem('sortedLists'))
//     lists.forEach(list=>{
//         setPosition(list.id,list.top,list.left)
//     })
// }

// const setPosition=(id,top,left)=>{
//     const items = document.querySelectorAll('.todo')
//     items.forEach(item=>{
//         if(item.dataset.id == id){
//             console.log(`prev top = ${item.getBoundingClientRect().top} current top is = ${top}`)
//             todoContainer.style.position ='relative'
//             // item.style.position='absolute'
//             item.style.top = top+ 'px'
//             item.style.width= 100+ '%'
//             console.log('setting')
//         }
//     })
// }

// window.addEventListener('DOMContentLoaded',sortedList);

