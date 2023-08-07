const listTodo = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const addInput = document.querySelector("#todo-form input");
const TODOKEY = "todos"; //localstorage 키
let todoList = [];

// 저장하는 함수로 localstorage에 값을 저장한다
function todoSave() {
  localStorage.setItem(TODOKEY, JSON.stringify(todoList));
}

// 해당 부모 요소를 찾아 삭제한 후, todoList에 해당 리스트를 제외하고 저장한다
function todoDelete(event) {
  const li = event.target.parentElement;
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

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");

  const span = document.createElement("span");
  span.innerText = text;
  span.addEventListener("dblclick", (event) => handleEdit(event, todoLi.id));

  const button = document.createElement("button");
  button.innerText = "X";
  button.addEventListener("click", todoDelete);

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(button);
}

// handleAdd에서 받은 인자값인 newTodo로 html 태그를 만들어 화면에 보이게 추가한다
function todosView(newTodo) {
  const li = document.createElement("li");
  li.id = newTodo.id;

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");

  const span = document.createElement("span");
  span.innerText = newTodo.todoValue;
  span.addEventListener("dblclick", (event) => handleEdit(event, newTodo.id));

  const button = document.createElement("button");
  button.innerText = "X";
  button.addEventListener("click", todoDelete);

  listTodo.prepend(li);
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(button);
}

// input에 값을 넣고 엔터를 누르면 해당 투두가 랜덤 id와 함께 todoList에 추가되고 
// newTodoObj을 인자값으로 넘겨주며 todosView함수를 호출한 후에 todoSave(저장)함수를 호출한다
function handleAdd(event) {
  event.preventDefault();
  const newTodo = addInput.value;
  addInput.value = "";
  const newTodoObj = {
    id: Date.now(),
    todoValue: newTodo,
  };
  todoList.push(newTodoObj);
  todosView(newTodoObj);
  todoSave();
}

// form 안에 있는 input에 값을 넣고 제출하면 handleAdd함수가 실행된다(이벤트)
todoForm.addEventListener("submit", handleAdd);