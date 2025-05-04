import React, { useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { Button } from './ui/button';
import useLocalStorage from '../hooks/useLocalStorage';

// Define the structure for a task
interface Task {
  id: number;
  text: string;
  priority: number;
}

// Define the structure for a comparison pair
type Comparison = [number, number]; // Pair of task IDs

type Stage = 'input' | 'compare' | 'results';

/**
 * Main component for prioritizing tasks through pairwise comparisons.
 * Allows users to add, import, prioritize, and manage tasks.
 */
const TaskPrioritizer: React.FC = () => {
  // States for the app with localStorage persistence using custom hook
  const [stage, setStage] = useLocalStorage<Stage>(
    'taskPrioritizer.stage',
    'input'
  );
  const [tasks, setTasksRaw] = useLocalStorage<Task[]>(
    'taskPrioritizer.tasks',
    []
  );
  const tasksSafe = Array.isArray(tasks) ? tasks : [];
  const setTasks: typeof setTasksRaw = (value) => {
    // Always ensure tasks is an array
    if (typeof value === 'function') {
      setTasksRaw((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return value(safePrev);
      });
    } else {
      setTasksRaw(Array.isArray(value) ? value : []);
    }
  };

  const [completedTasks, setCompletedTasksRaw] = useLocalStorage<Task[]>(
    'taskPrioritizer.completedTasks',
    []
  );
  const completedTasksSafe = Array.isArray(completedTasks)
    ? completedTasks
    : [];
  const setCompletedTasks: typeof setCompletedTasksRaw = (value) => {
    // Always ensure completedTasks is an array
    if (typeof value === 'function') {
      setCompletedTasksRaw((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return value(safePrev);
      });
    } else {
      setCompletedTasksRaw(Array.isArray(value) ? value : []);
    }
  };

  const [comparisons, setComparisonsRaw] = useLocalStorage<Comparison[]>(
    'taskPrioritizer.comparisons',
    []
  );
  const comparisonsSafe = Array.isArray(comparisons) ? comparisons : [];
  const setComparisons: typeof setComparisonsRaw = (value) => {
    // Always ensure comparisons is an array
    if (typeof value === 'function') {
      setComparisonsRaw((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return value(safePrev);
      });
    } else {
      setComparisonsRaw(Array.isArray(value) ? value : []);
    }
  };

  const [prioritizedTasks, setPrioritizedTasksRaw] = useLocalStorage<Task[]>(
    'taskPrioritizer.prioritizedTasks',
    []
  );
  const prioritizedTasksSafe = Array.isArray(prioritizedTasks)
    ? prioritizedTasks
    : [];
  const setPrioritizedTasks: typeof setPrioritizedTasksRaw = (value) => {
    // Always ensure prioritizedTasks is an array
    if (typeof value === 'function') {
      setPrioritizedTasksRaw((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return value(safePrev);
      });
    } else {
      setPrioritizedTasksRaw(Array.isArray(value) ? value : []);
    }
  };

  const [currentComparison, setCurrentComparison] = useLocalStorage<number>(
    'taskPrioritizer.currentComparison',
    0
  );

  // Local state (not persisted)
  const [newTask, setNewTask] = useState<string>('');
  const [bulkInput, setBulkInput] = useState<string>('');
  const [showBulkInput, setShowBulkInput] = useState<boolean>(false);

  // Refs for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Add a new task to the list
  const addTask = (): void => {
    if (newTask.trim() !== '') {
      // Ensure unique ID even if added rapidly
      const uniqueId = Date.now() + Math.random();
      setTasks([
        ...tasksSafe,
        { id: uniqueId, text: newTask.trim(), priority: 0 },
      ]);
      setNewTask('');
    }
  };

  // Handle pressing Enter in the input field
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Import tasks from bulk text input
  const importTasks = (): void => {
    if (bulkInput.trim() === '') return;

    const lines = bulkInput.split('\n').filter((line) => line.trim() !== '');
    const newTasks: Task[] = lines.map((line, index) => ({
      id: Date.now() + Math.random() + index, // Ensure unique IDs
      text: line.trim(),
      priority: 0,
    }));

    setTasks([...tasksSafe, ...newTasks]);
    setBulkInput('');
    setShowBulkInput(false);
  };

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setBulkInput(result);
        setShowBulkInput(true);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      alert('Error reading file.');
    };
    reader.readAsText(file);
    // Reset file input value to allow re-uploading the same file
    if (e.target) {
      e.target.value = '';
    }
  };

  // Generate all necessary comparisons when starting the prioritization process
  const startPrioritization = (): void => {
    if (tasksSafe.length < 2) {
      alert('Please add at least 2 tasks to prioritize');
      return;
    }

    // Generate all possible pairs for comparison
    const pairs: Comparison[] = [];
    for (let i = 0; i < tasksSafe.length; i++) {
      for (let j = i + 1; j < tasksSafe.length; j++) {
        pairs.push([tasksSafe[i].id, tasksSafe[j].id]);
      }
    }

    setComparisons(pairs);
    setCurrentComparison(0);
    setStage('compare');
  };

  // Choose which task has higher priority in the current comparison
  const chooseTask = (chosenId: number): void => {
    if (currentComparison >= comparisonsSafe.length) return; // Avoid errors if state is inconsistent

    const pair = comparisonsSafe[currentComparison];
    // Ensure pair exists and is valid
    if (!pair || pair.length !== 2) {
      console.error('Invalid comparison pair:', pair);
      skipComparison(); // Skip if pair is invalid
      return;
    }

    // Update tasks array with new priority values
    setTasks((currentTasks) =>
      currentTasks.map((task) => {
        if (task.id === chosenId) {
          return { ...task, priority: task.priority + 1 };
        }
        return task;
      })
    );

    // Move to next comparison or results
    if (currentComparison < comparisonsSafe.length - 1) {
      setCurrentComparison(currentComparison + 1);
    } else {
      finalizePriorities();
    }
  };

  // Skip the current comparison
  const skipComparison = (): void => {
    if (currentComparison < comparisonsSafe.length - 1) {
      setCurrentComparison(currentComparison + 1);
    } else {
      finalizePriorities();
    }
  };

  // Sort tasks by priority and show results
  const finalizePriorities = (): void => {
    // Use the latest tasks state for sorting via the setTasks callback
    setTasks((currentTasks) => {
      const sorted = [...currentTasks].sort((a, b) => b.priority - a.priority);
      setPrioritizedTasks(sorted);
      setStage('results');
      // Return currentTasks to potentially avoid unnecessary re-render if tasks didn't change,
      // although the primary purpose here is accessing the latest state.
      return currentTasks;
    });
  };

  // Mark a task as completed
  const completeTask = (taskId: number): void => {
    // Find the task to be completed
    const taskToComplete = prioritizedTasksSafe.find(
      (task) => task.id === taskId
    );

    if (taskToComplete) {
      // Add to completed tasks
      setCompletedTasks((prevCompleted) => [...prevCompleted, taskToComplete]);

      // Remove from prioritized tasks
      setPrioritizedTasks((prevPrioritized) =>
        prevPrioritized.filter((task) => task.id !== taskId)
      );
    }
  };

  // Restore a task from completed to active
  const restoreTask = (taskId: number): void => {
    // Find the task to be restored
    const taskToRestore = completedTasksSafe.find((task) => task.id === taskId);

    if (taskToRestore) {
      // Add back to prioritized tasks and maintain order
      setPrioritizedTasks((prevPrioritized) =>
        [...prevPrioritized, taskToRestore].sort(
          (a, b) => b.priority - a.priority
        )
      );

      // Remove from completed tasks
      setCompletedTasks((prevCompleted) =>
        prevCompleted.filter((task) => task.id !== taskId)
      );
    }
  };

  // Reset the app to start over
  const resetApp = (): void => {
    setTasks([]);
    setCompletedTasks([]);
    setComparisons([]);
    setCurrentComparison(0);
    setPrioritizedTasks([]);
    setStage('input');
    setBulkInput('');
    setShowBulkInput(false);

    // Clear localStorage for app data
    localStorage.removeItem('taskPrioritizer.tasks');
    localStorage.removeItem('taskPrioritizer.completedTasks');
    localStorage.removeItem('taskPrioritizer.comparisons');
    localStorage.removeItem('taskPrioritizer.currentComparison');
    localStorage.removeItem('taskPrioritizer.prioritizedTasks');
    localStorage.removeItem('taskPrioritizer.stage');
  };

  // Export prioritized tasks as text
  const exportTasks = (): void => {
    let text = '';

    // Add active tasks
    if (prioritizedTasksSafe.length > 0) {
      text += 'ACTIVE TASKS:\n';
      text += prioritizedTasksSafe
        .map((task, index) => `${index + 1}. ${task.text}`)
        .join('\n');
    }

    // Add completed tasks if there are any
    if (completedTasksSafe.length > 0) {
      text += '\n\nCOMPLETED TASKS:\n';
      text += completedTasksSafe
        .map((task, index) => `${index + 1}. ${task.text}`)
        .join('\n');
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'prioritized-tasks.txt';
    a.click();

    URL.revokeObjectURL(url);
  };

  // Export task data as JSON
  const exportTasksAsJson = (): void => {
    const data = {
      prioritizedTasks: prioritizedTasksSafe,
      completedTasks: completedTasksSafe,
      version: '1.0',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'task-prioritizer-data.json';
    a.click();

    URL.revokeObjectURL(url);
  };

  // Import task data from JSON file
  const importTasksFromJson = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') {
          throw new Error('Failed to read file content as string.');
        }
        const data = JSON.parse(result);

        // Basic validation for the imported data structure
        if (
          data &&
          typeof data === 'object' &&
          Array.isArray(data.prioritizedTasks) &&
          Array.isArray(data.completedTasks)
        ) {
          // More thorough validation could be added here to check task structure
          const isValidPrioritized = data.prioritizedTasks.every(
            (task: any) =>
              typeof task === 'object' &&
              task !== null &&
              'id' in task &&
              'text' in task &&
              'priority' in task
          );
          const isValidCompleted = data.completedTasks.every(
            (task: any) =>
              typeof task === 'object' &&
              task !== null &&
              'id' in task &&
              'text' in task &&
              'priority' in task
          );

          if (isValidPrioritized && isValidCompleted) {
            setPrioritizedTasks(data.prioritizedTasks as Task[]);
            setCompletedTasks(data.completedTasks as Task[]);

            // If we're not already in results stage, move to it
            if (stage !== 'results') {
              setStage('results');
            }

            alert('Tasks imported successfully!');
          } else {
            alert('Invalid task data format within arrays.');
          }
        } else {
          alert(
            'Invalid task data format. Expected { prioritizedTasks: [], completedTasks: [] }.'
          );
        }
      } catch (error) {
        console.error('Error importing tasks:', error);
        alert(
          `Error importing tasks: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading JSON file:', error);
      alert('Error reading JSON file.');
    };
    reader.readAsText(file);
    // Reset file input value
    if (event.target) {
      event.target.value = '';
    }
  };

  // Calculate progress percentage
  const progressPercentage: number =
    comparisonsSafe.length > 0
      ? Math.round((currentComparison / comparisonsSafe.length) * 100)
      : 0;

  // Get current comparison tasks if in compare stage
  const getCurrentComparisonTasks = (): [
    Task | undefined,
    Task | undefined,
  ] => {
    if (
      stage !== 'compare' ||
      comparisonsSafe.length === 0 ||
      currentComparison >= comparisonsSafe.length
    ) {
      return [undefined, undefined];
    }

    const comparisonPair = comparisonsSafe[currentComparison];
    if (!comparisonPair || comparisonPair.length !== 2) {
      console.error(
        'Invalid comparison pair at index:',
        currentComparison,
        comparisonPair
      );
      return [undefined, undefined]; // Return undefined if pair is invalid
    }
    const [taskId1, taskId2] = comparisonPair;

    // Use the tasks state directly, as it's guaranteed to be up-to-date here
    const task1 = tasksSafe.find((task) => task.id === taskId1);
    const task2 = tasksSafe.find((task) => task.id === taskId2);

    return [task1, task2];
  };

  const [leftTask, rightTask] = getCurrentComparisonTasks();

  return (
    <div className="flex flex-col items-center p-4 max-w-md mx-auto">
      {/* Input Stage */}
      {stage === 'input' && (
        <div className="w-full">
          {/* Task input form with accessibility improvements */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addTask();
            }}
            className="mb-4"
            aria-label="Add task form"
          >
            <div className="flex">
              <label htmlFor="taskInput" className="sr-only">
                Enter a task
              </label>
              <input
                id="taskInput"
                type="text"
                value={newTask}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNewTask(e.target.value)
                }
                onKeyPress={handleKeyPress}
                placeholder="Enter a task..."
                className="flex-grow p-2 border border-input rounded-l focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
                aria-required="true"
                maxLength={200}
              />
              <Button
                type="submit"
                className="rounded-l-none"
                aria-label="Add task"
              >
                Add
              </Button>
            </div>
          </form>

          <div className="flex justify-between mb-4">
            <Button
              variant="ghost"
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {showBulkInput ? 'Hide Bulk Import' : 'Bulk Import Tasks'}
            </Button>

            <input
              ref={fileInputRef} // Attach ref
              type="file"
              id="fileInput"
              className="hidden"
              accept=".txt,.csv"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="fileInput"
              className="text-primary hover:text-primary/80 font-medium cursor-pointer"
            >
              Upload File (.txt, .csv)
            </label>
          </div>

          {showBulkInput && (
            <div className="mb-4">
              <textarea
                value={bulkInput}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setBulkInput(e.target.value)
                }
                placeholder="Enter tasks, one per line..."
                className="w-full p-2 border border-input rounded min-h-32 focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground"
              />
              <Button
                onClick={importTasks}
                className="w-full mt-2"
                variant="secondary"
              >
                Import Tasks
              </Button>
            </div>
          )}

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Your Tasks:</h2>
              <span className="text-sm text-muted-foreground">
                {tasksSafe.length} tasks
              </span>
            </div>

            {tasksSafe.length === 0 ? (
              <p className="text-muted-foreground italic">No tasks added yet</p>
            ) : (
              <ul className="border border-border rounded-lg divide-y max-h-64 overflow-y-auto bg-card">
                {tasksSafe.map((task) => (
                  <li
                    key={task.id}
                    className="p-2 flex justify-between items-center"
                  >
                    <span className="text-foreground break-all">
                      {task.text}
                    </span>
                    <Button
                      onClick={() =>
                        setTasks((currentTasks) =>
                          currentTasks.filter((t) => t.id !== task.id)
                        )
                      }
                      variant="ghost"
                      className="h-8 text-destructive hover:text-destructive/80 ml-2 flex-shrink-0"
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setTasks([])}
              disabled={tasksSafe.length === 0}
              variant="destructive"
              className="flex-1"
            >
              Clear All
            </Button>

            <Button
              onClick={startPrioritization}
              disabled={tasksSafe.length < 2}
              className={`flex-1 ${
                tasksSafe.length < 2 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Start Prioritizing
            </Button>
          </div>
        </div>
      )}

      {/* Compare Stage */}
      {stage === 'compare' && leftTask && rightTask && (
        <div className="w-full">
          <div className="mb-4 w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-center mb-4 text-muted-foreground">
            Progress: {currentComparison + 1} of {comparisonsSafe.length}{' '}
            comparisons
          </p>

          <h2 className="text-lg font-semibold text-center mb-6">
            Which task should be done first?
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button
              onClick={() => chooseTask(leftTask.id)}
              variant="outline"
              className="flex-1 p-4 h-auto border-2 border-primary text-foreground hover:bg-accent hover:text-accent-foreground text-left break-words whitespace-normal min-h-[60px]"
            >
              {leftTask.text}
            </Button>

            <Button
              onClick={() => chooseTask(rightTask.id)}
              variant="outline"
              className="flex-1 p-4 h-auto border-2 border-primary text-foreground hover:bg-accent hover:text-accent-foreground text-left break-words whitespace-normal min-h-[60px]"
            >
              {rightTask.text}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={skipComparison}
              variant="secondary"
              className="flex-1"
            >
              Can't decide / Equal
            </Button>

            <Button onClick={resetApp} variant="destructive" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Results Stage */}
      {stage === 'results' && (
        <div className="w-full">
          {/* Active tasks */}
          <h2 className="text-lg font-semibold mb-2">
            Your Prioritized Tasks:
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tap a task to mark it complete
          </p>

          {prioritizedTasksSafe.length > 0 ? (
            <ol className="border rounded-lg divide-y mb-6 max-h-64 overflow-y-auto bg-card">
              {prioritizedTasksSafe.map((task, index) => (
                <li
                  key={task.id}
                  className="p-3 flex items-center hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => completeTask(task.id)}
                >
                  <span className="font-bold mr-3 w-6 text-right flex-shrink-0">
                    {index + 1}.
                  </span>
                  <span className="flex-grow break-words mr-2">
                    {task.text}
                  </span>
                  <span className="text-xs text-muted-foreground border border-muted px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                    Click to complete
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-muted-foreground italic mb-6">No active tasks</p>
          )}

          {/* Completed tasks */}
          {completedTasksSafe.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-2">Completed Tasks:</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Tap a task to restore it
              </p>
              <ol className="border rounded-lg divide-y mb-6 max-h-64 overflow-y-auto bg-muted">
                {completedTasksSafe.map((task, index) => (
                  <li
                    key={task.id}
                    className="p-3 flex items-center hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => restoreTask(task.id)}
                  >
                    <span className="font-bold mr-3 w-6 text-right flex-shrink-0 text-muted-foreground">
                      {index + 1}.
                    </span>
                    <span className="flex-grow line-through text-muted-foreground break-words mr-2">
                      {task.text}
                    </span>
                    <span className="text-xs text-muted-foreground border border-muted px-2 py-1 rounded whitespace-nowrap flex-shrink-0">
                      Click to restore
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                onClick={exportTasks}
                variant="secondary"
                className="flex-1"
              >
                Export as Text
              </Button>

              <Button
                onClick={exportTasksAsJson}
                variant="secondary"
                className="flex-1"
              >
                Save as JSON
              </Button>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  ref={jsonFileInputRef} // Attach ref
                  type="file"
                  id="jsonFileInput"
                  className="hidden"
                  accept=".json"
                  onChange={importTasksFromJson}
                />
                <label
                  htmlFor="jsonFileInput"
                  className="flex items-center justify-center w-full h-10 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer text-center text-sm font-medium"
                >
                  Load from JSON
                </label>
              </div>

              <Button onClick={resetApp} className="flex-1">
                Start Over
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPrioritizer;
