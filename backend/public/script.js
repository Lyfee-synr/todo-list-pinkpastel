const API_URL = 'http://localhost:3000/api/tasks';

const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.textContent = task.description;
    if (task.completed) li.classList.add('completed');

    li.addEventListener('click', async () => {
      await fetch(`${API_URL}/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });
      loadTasks();
    });

    li.addEventListener('contextmenu', async (e) => {
      e.preventDefault();
      await fetch(`${API_URL}/${task._id}`, { method: 'DELETE' });
      loadTasks();
    });

    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const desc = document.getElementById('description').value;
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: desc })
  });
  taskForm.reset();
  loadTasks();
});

loadTasks();
