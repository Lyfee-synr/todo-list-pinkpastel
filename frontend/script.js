const API_URL = 'https://todo-list-pinkpastel.onrender.com/api/tasks';

function loadTasks() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      data.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task' + (task.status === 'completed' ? ' completed' : '');
        li.innerHTML = `
          <input class="checkbox" type="checkbox" ${task.status === 'completed' ? 'checked' : ''}>
          <span>${task.description}</span>
          <button class="delete-btn" title="Delete">&times;</button>
        `;
        // Complete handler
        li.querySelector('.checkbox').addEventListener('change', (e) => {
          fetch(`${API_URL}/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: e.target.checked ? 'completed' : 'pending' })
          }).then(loadTasks);
        });
        // Delete handler
        li.querySelector('.delete-btn').onclick = () => {
          fetch(`${API_URL}/${task._id}`, { method: 'DELETE' })
            .then(loadTasks);
        };
        list.appendChild(li);
      });
    });
}

document.getElementById('addTaskForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const val = document.getElementById('taskInput').value.trim();
  if (!val) return;
  fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description: val })
  }).then(() => {
    document.getElementById('taskInput').value = '';
    loadTasks();
  });
});

loadTasks();
