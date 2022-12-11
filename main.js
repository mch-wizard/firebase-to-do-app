import './style.css'
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, query, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADjfrh1i0bSxpTUWGEBi4ounaxgbMVxKA",
  authDomain: "mch-to-do.firebaseapp.com",
  projectId: "mch-to-do",
  storageBucket: "mch-to-do.appspot.com",
  messagingSenderId: "988617675027",
  appId: "1:988617675027:web:ff4465af14a08f6ba60ae6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const template = `
<div>
  <h1>Hello Firebase!</h1>
  <form id="form" class="form">
    <input type="text" id="title" />
    <button type="submit">Submit</button>
  </form>
  <ul class="todos"></ul>
</div>
`;

document.querySelector('#app').innerHTML = template;
const todosContainer = document.querySelector('.todos');
const form = document.querySelector('.form');

form.addEventListener('submit', async (e) => {
  // we add 'preventDefault()' to keep the browser from reloading
  e.preventDefault();

  const inputValue = document.querySelector('#title').value;
  if (inputValue) {
    await addDoc(collection(db, 'todos'), {
      title: inputValue,
      done: false,
    });
  }
});

// Create and add task iteam to the list
const createTask = (id, task) => {
  const li = document.createElement('li');
  li.classList.add('todo-task');
  li.innerHTML = `<p id="${id}">${task.done ? '✅' : '⭐'} ${task.title}</p>`

  return li;
};

// Fetch tasks from firestore database
const tasksQuery = await query(collection(db, 'todos'));
const unsub = onSnapshot(tasksQuery, tasksSnapshot => {
  todosContainer.innerHTML = '';

  tasksSnapshot.forEach((task) => {
    todosContainer.appendChild(createTask(task.id, task.data()));
  });
})

// Mark task as done on click
todosContainer.addEventListener('click', async (e) => {
  if (!e.target.id) return;
  const taskRef = doc(db, 'todos', e.target.id);
  await updateDoc(taskRef, {
    done: true,
  })
})
