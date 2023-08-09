const listTodo = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const addInput = document.querySelector("#todo-form input");
const clearBtn = document.getElementById("clear-btn");
const TODOKEY = "todos"; //localstorage 키
let todoList = [];

// 저장하는 함수로 localstorage에 값을 저장한다
function todoSave() {
  localStorage.setItem(TODOKEY, JSON.stringify(todoList));
}

// 해당 부모 요소를 찾아 삭제한 후, todoList에 해당 리스트를 제외하고 저장한다
function todoDelete(event) {
  const li = event.target.parentNode.parentNode; // 아이콘을 클릭하기 때문에 부모의 부모로 해야한다
  li.remove();
  todoList = todoList.filter(toDo => toDo.id !== parseInt(li.id));
  todoSave();
}

// 수정하고 싶은 투두를 더블클릭 하면 호출되는 함수로 주변에 있던 버튼과 체크박스, span태그가 사라지고 input이 나오게 해준다
// input에 값을 수정하고 엔터를 누르면 input을 삭제하고 update 함수를 호출한다
function handleEdit(event, todoId) {
  const li = event.target.parentElement;
  const checkBox = li.firstChild;
  const span = event.target;
  const spanText = event.target.innerText;
  const button = event.target.nextElementSibling;
  const input = document.createElement("input");
  input.className = "edit-input";
  checkBox.remove();
  span.remove();
  button.remove();
  li.appendChild(input);
  input.value = spanText;
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      todoUpdate(li, e.target.value, todoId);
      input.remove();
    }
  });
}

// update 함수는 map() 메서드를 이용하여 수정한 값으로 교체하고 저장함수를 호출하여 저장한 후
// updateview에 해당 리스트와 값을 인자값으로 해서 호출한다
function todoUpdate(todoLi, text, todoId) {
  const newTodo = todoList.map((toDo) => toDo.id === todoId ? ({...toDo, todoValue: text}) : toDo);

  todoList = newTodo;
  
  todoSave();
  todosUpdateView(todoLi, text);
}

// updateview는 원래 view처럼 화면에 수정한 값으로 투두가 나오게 한다
function todosUpdateView(todoLi, text) {
  const li = todoLi;

  const checkBtn = document.createElement("button");
  checkBtn.className = "checkbox-btn";
  const checkIcon = document.createElement("i");
  checkIcon.className = "fa-sharp fa-regular fa-square";
  checkIcon.addEventListener("click", handleCheck);

  const span = document.createElement("span");
  span.innerText = text;
  span.addEventListener("dblclick", (event) => handleEdit(event, todoLi.id));

  const button = document.createElement("button");
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-x";
  icon.addEventListener("click", todoDelete);

  li.appendChild(checkBtn);
  checkBtn.appendChild(checkIcon);
  li.appendChild(span);
  li.appendChild(button);
  button.appendChild(icon);
}

// check가 되었는지 아닌지 확인하고 체크가 되어 있으면 span에 중앙선 그려주고 check를 true로 바꾼다 체크가 안 되어 있으면 check를 false로 바꾸고 span에중앙 선을 지운다 문제는 하나의 변수로 같이 쓰다보니 다른 체크박스에서 바뀐 것이 그대로 되어서 한번에 안될 때가 있다 
// 수정해서 각각의 투두마다 check를 할 수 있도록 오브젝트에 추가했다 오브젝트의 check가 false면 true 반환해서 오브젝트 check에 넣어줘서 바꾸고 true면 false를 넣어주서 바꾸고 저장한 후에 painCheck함수 호출
function handleCheck(event) {
  const icon = event.target;
  const span = event.target.parentNode.nextElementSibling;
  const liCheck = event.target.parentNode.parentNode.id;
  const changeList = todoList.filter(toDo => toDo.id == parseInt(liCheck));

  let checked = changeList[0].check == false ? true : false;

  const newTodo = todoList.map((toDo) => toDo.id === parseInt(liCheck) ? ({...toDo, check: checked}) : toDo);

  todoList = newTodo;
  todoSave();
  paintCheck(icon, span, checked);

  console.log(newTodo);
}

// check가 true면 아이콘 클래스를 체크 박스인 것으로 바꾸고 span에 중앙선 그려준다 check가 false면 아이콘 클래스를 빈 박스인 것으로 바꾸고 span에 중앙 선을 지운다
function paintCheck(icon, span, checked) {
  if (checked == false) {
    icon.className = "fa-sharp fa-regular fa-square";
    span.style.textDecoration = "none"
  } else {
    icon.className = "fa-sharp fa-regular fa-square-check";
    span.style.textDecoration = "line-through"
  }
}

// handleAdd에서 받은 인자값인 newTodo로 html 태그를 만들어 화면에 보이게 추가한다
// li가 만들어질 때마다 delete라는 이름의 클래스를 추가한다(전체 삭제 기능)
function todosView(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;
  li.className = "delete";

  const checkBtn = document.createElement("button");
  checkBtn.className = "checkbox-btn";
  const checkIcon = document.createElement("i");
  checkIcon.className = "fa-sharp fa-regular fa-square";
  checkIcon.addEventListener("click", handleCheck);

  const span = document.createElement("span");
  span.innerText = newTodo.todoValue;
  span.addEventListener("dblclick", (event) => handleEdit(event, newTodo.id));

  const button = document.createElement("button");
  const icon = document.createElement("i");
  icon.className = "fa-solid fa-x";
  icon.addEventListener("click", todoDelete);

  listTodo.prepend(li);
  li.appendChild(checkBtn);
  checkBtn.appendChild(checkIcon);
  li.appendChild(span);
  li.appendChild(button);
  button.appendChild(icon);
}

// input에 값을 넣고 엔터를 누르면 해당 투두가 랜덤 id, check와 함께 todoList에 추가되고 
// newTodoObj을 인자값으로 넘겨주며 todosView함수를 호출한 후에 todoSave(저장)함수를 호출한다
function handleAdd(event) {
  event.preventDefault();
  const newTodo = addInput.value;
  addInput.value = "";
  const newTodoObj = {
    id: Date.now(),
    todoValue: newTodo,
    check: false,
  };
  todoList.push(newTodoObj);
  todosView(newTodoObj);
  todoSave();
}

// delete라는 이름의 클래스 가진 투두들을 모두 삭제하고 todoList를 초기화한 후 저장한다 (참고로 모든 투두는 delete라는 이름의 클래스를 가지고 있다 즉, 전체 삭제)
function deleteAll() {
  const allTodos = document.querySelectorAll(".delete");

  allTodos.forEach(allTodos => {
    allTodos.remove();
  });

  todoList = [];
  todoSave();
}

// form 안에 있는 input에 값을 넣고 제출하면 handleAdd함수가 실행된다(이벤트)
todoForm.addEventListener("submit", handleAdd);
clearBtn.addEventListener("click", deleteAll);