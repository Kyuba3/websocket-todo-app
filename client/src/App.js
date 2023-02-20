import io from 'socket.io-client';
import { useState, useEffect} from 'react';
import shortid from 'shortid';

const App = () => {

  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  
  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);

    socket.on('updateData', (tasks) => {
      updateTasks(tasks)
    });

    socket.on('removeTask', (id) => {
      removeTask(id)
    });

    socket.on('addTask', (task) => {
      addTask(task)
    });

    return () => {
      socket.disconnect();
    }

  }, []);

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
    setTaskName("");
  };

  const updateTasks = (tasks) => {
    setTasks(tasks);
  };

  const removeTask = (id, shouldEmit) => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
    
    if(shouldEmit) {
      socket.emit('removeTask', id);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const task = {name: taskName, id: shortid.generate() };
    addTask(task);
    socket.emit('addTask', task);
  };

  return (
    <div className="App">
  
      <header>
        <h1>ToDoList.app</h1>
      </header>
  
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
  
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              <span>{task.name}</span>
              <button 
                className="btn btn--red" 
                onClick={() => removeTask(task.id, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
  
        <form id="add-task-form" onSubmit={ e => submitForm(e) }>
          <input 
          className="text-input" 
          autoComplete="off" 
          type="text" 
          placeholder="Type your description" 
          id="task-name" 
          value={taskName} 
          onChange={(e) => setTaskName(e.target.value) } 
          />
          <button 
          className="btn" 
          type="submit">
            Add
          </button>
        </form>
  
      </section>
    </div>
  );
}

export default App;