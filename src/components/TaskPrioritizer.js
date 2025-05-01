import React, { useState } from 'react';

const TaskPrioritizer = () => {
  // States for the app
  const [stage, setStage] = useState('input'); // 'input', 'compare', 'results'
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [comparisons, setComparisons] = useState([]);
  const [currentComparison, setCurrentComparison] = useState(0);
  const [prioritizedTasks, setPrioritizedTasks] = useState([]);
  
  // Add a new task to the list
  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...tasks, { id: Date.now(), text: newTask, priority: 0 }]);
      setNewTask('');
    }
  };

  // Handle pressing Enter in the input field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Generate all necessary comparisons when starting the prioritization process
  const startPrioritization = () => {
    if (tasks.length < 2) {
      alert('Please add at least 2 tasks to prioritize');
      return;
    }
    
    // Generate all possible pairs for comparison
    const pairs = [];
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        pairs.push([tasks[i].id, tasks[j].id]);
      }
    }
    
    setComparisons(pairs);
    setCurrentComparison(0);
    setStage('compare');
  };

  // Choose which task has higher priority in the current comparison
  const chooseTask = (chosenId) => {
    const pair = comparisons[currentComparison];
    const otherTaskId = pair[0] === chosenId ? pair[1] : pair[0];
    
    // Update tasks array with new priority values
    setTasks(tasks.map(task => {
      if (task.id === chosenId) {
        return { ...task, priority: task.priority + 1 };
      }
      return task;
    }));
    
    // Move to next comparison or results
    if (currentComparison < comparisons.length - 1) {
      setCurrentComparison(currentComparison + 1);
    } else {
      finalizePriorities();
    }
  };

  // Skip the current comparison
  const skipComparison = () => {
    if (currentComparison < comparisons.length - 1) {
      setCurrentComparison(currentComparison + 1);
    } else {
      finalizePriorities();
    }
  };

  // Sort tasks by priority and show results
  const finalizePriorities = () => {
    const sorted = [...tasks].sort((a, b) => b.priority - a.priority);
    setPrioritizedTasks(sorted);
    setStage('results');
  };

  // Reset the app to start over
  const resetApp = () => {
    setTasks([]);
    setComparisons([]);
    setCurrentComparison(0);
    setPrioritizedTasks([]);
    setStage('input');
  };

  // Calculate progress percentage
  const progressPercentage = comparisons.length > 0 
    ? Math.round((currentComparison / comparisons.length) * 100) 
    : 0;

  // Get current comparison tasks if in compare stage
  const getCurrentComparisonTasks = () => {
    if (stage !== 'compare' || comparisons.length === 0) return [null, null];
    
    const taskId1 = comparisons[currentComparison][0];
    const taskId2 = comparisons[currentComparison][1];
    
    const task1 = tasks.find(task => task.id === taskId1);
    const task2 = tasks.find(task => task.id === taskId2);
    
    return [task1, task2];
  };

  const [leftTask, rightTask] = getCurrentComparisonTasks();

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Task Prioritizer</h1>
      
      {/* Input Stage */}
      {stage === 'input' && (
        <div className="w-full">
          <div className="flex mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a task..."
              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={addTask}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Your Tasks:</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-500 italic">No tasks added yet</p>
            ) : (
              <ul className="border rounded divide-y">
                {tasks.map(task => (
                  <li key={task.id} className="p-2 flex justify-between items-center">
                    <span>{task.text}</span>
                    <button 
                      onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <button
            onClick={startPrioritization}
            disabled={tasks.length < 2}
            className={`w-full p-3 rounded text-white font-semibold ${
              tasks.length < 2 ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Start Prioritizing ({tasks.length} tasks)
          </button>
        </div>
      )}
      
      {/* Compare Stage */}
      {stage === 'compare' && (
        <div className="w-full">
          <div className="mb-4 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-center mb-4">
            Progress: {currentComparison + 1} of {comparisons.length} comparisons
          </p>
          
          <h2 className="text-lg font-semibold text-center mb-6">
            Which task should be done first?
          </h2>
          
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => chooseTask(leftTask.id)}
              className="flex-1 p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-center"
            >
              {leftTask?.text}
            </button>
            
            <button
              onClick={() => chooseTask(rightTask.id)}
              className="flex-1 p-4 border-2 border-blue-500 rounded-lg hover:bg-blue-50 text-center"
            >
              {rightTask?.text}
            </button>
          </div>
          
          <button
            onClick={skipComparison}
            className="w-full p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Can't decide / Equal importance
          </button>
        </div>
      )}
      
      {/* Results Stage */}
      {stage === 'results' && (
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-4">Your Prioritized Tasks:</h2>
          
          <ol className="border rounded divide-y mb-6">
            {prioritizedTasks.map((task, index) => (
              <li key={task.id} className="p-3 flex items-center">
                <span className="font-bold mr-3">{index + 1}.</span>
                <span>{task.text}</span>
              </li>
            ))}
          </ol>
          
          <button
            onClick={resetApp}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskPrioritizer;
