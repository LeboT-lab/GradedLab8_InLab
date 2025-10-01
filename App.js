import React, {useEffect, useState, createContext, useContext, useRef} from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, { id: Date.now().toString(), text: task }]);
  };

  const completeTask = (taskId) => {
    const taskToComplete = tasks.find(task => task.id === taskId);
    if (taskToComplete) {
      setTasks(tasks.filter(task => task.id !== taskId));
      setCompletedTasks([...completedTasks, taskToComplete]);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, completedTasks, addTask, completeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

const TaskListScreen = ({ navigation }) => {
  const { tasks, completeTask,addTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState('');
  const inputRef = useRef(null);

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask('');
      inputRef.current.clear();
    } else {
      Alert.alert('Error', 'Task cannot be empty');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => completeTask(item.id)}>
            <Text style={styles.task}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="New Task"
        onChangeText={setNewTask}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <Button title="View Completed Tasks" onPress={() => navigation.navigate('CompletedTasks')} />
    </View>
  );
};

const CompletedTasksScreen = () => {
  const { completedTasks } = useContext(TaskContext);

  return (
    <View style={styles.container}>
      <FlatList
        data={completedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.completedTask}>{item.text}</Text>
        )}
      />
    </View>
  );
};

const App = () => {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Tasks" component={TaskListScreen} />
          <Stack.Screen name="CompletedTasks" component={CompletedTasksScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  task: {
    fontSize: 18,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  completedTask: {
    fontSize: 18,
    padding: 10,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});

export default App;