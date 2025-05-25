document.addEventListener('DOMContentLoaded', function() {
    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
  
    // Form submission handler
    document.getElementById('workoutForm').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const exercise = document.getElementById('exercise').value;
      const workoutDate = document.getElementById('workoutDate').value;
  
      // Collect sets, reps, and weights
      const setsInputs = document.querySelectorAll('.sets');
      const repsInputs = document.querySelectorAll('.reps');
      const weightInputs = document.querySelectorAll('.weight');
  
      const sets = [];
      for (let i = 0; i < setsInputs.length; i++) {
        sets.push({
          set: setsInputs[i].value,
          reps: repsInputs[i].value,
          weight: weightInputs[i].value
        });
      }
  
      // Create a new workout entry
      const newWorkout = {
        exercise,
        sets,
        date: workoutDate
      };
  
      // Add the new workout to the workouts array
      workouts.push(newWorkout);
  
      // Save workouts to localStorage
      localStorage.setItem('workouts', JSON.stringify(workouts));
  
      // Clear the form
      document.getElementById('workoutForm').reset();
  
      // Update the workout list and progress chart
      displayWorkouts();
      updateProgressChart();
    });
  
    // Function to add more sets dynamically
    window.addSet = function() {
      const setsRepsDiv = document.getElementById('setsReps');
      const newSet = document.createElement('div');
      newSet.innerHTML = `
        <input type="number" class="sets" placeholder="Sets" required>
        <input type="number" class="reps" placeholder="Reps" required>
        <input type="number" class="weight" placeholder="Weight (kg)" required>
      `;
      setsRepsDiv.appendChild(newSet);
    };
  
    // Function to display all workouts
    function displayWorkouts() {
      const workoutList = document.getElementById('workoutList');
      workoutList.innerHTML = '';
  
      workouts.forEach(workout => {
        const li = document.createElement('li');
        li.textContent = `${workout.exercise} - Date: ${workout.date}`;
        workoutList.appendChild(li);
      });
    }
  
    // Function to calculate weekly and monthly progress
    function calculateProgress() {
      const currentDate = new Date();
      const weekAgo = new Date(currentDate.setDate(currentDate.getDate() - 7));
      const monthAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
  
      const weeklyData = workouts.filter(workout => new Date(workout.date) >= weekAgo);
      const monthlyData = workouts.filter(workout => new Date(workout.date) >= monthAgo);
  
      return { weeklyData, monthlyData };
    }
  
    // Function to update the progress chart
    function updateProgressChart() {
      const { weeklyData, monthlyData } = calculateProgress();
  
      const weeklyProgress = weeklyData.flatMap(workout => workout.sets.map(set => set.weight));
      const monthlyProgress = monthlyData.flatMap(workout => workout.sets.map(set => set.weight));
  
      const ctx = document.getElementById('progressChart').getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Week', 'Month'],
          datasets: [{
            label: 'Progress (Weight Lifted)',
            data: [getAverage(weeklyProgress), getAverage(monthlyProgress)],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Helper function to calculate the average of an array
    function getAverage(data) {
      if (data.length === 0) return 0;
      const sum = data.reduce((a, b) => a + b, 0);
      return sum / data.length;
    }
  
    // Function to search workouts based on a specific exercise
    window.searchByExercise = function() {
      const searchExercise = document.getElementById('searchExercise').value.trim().toLowerCase();
      const exerciseSearchResults = document.getElementById('exerciseSearchResults');
      exerciseSearchResults.innerHTML = '';
  
      // Filter workouts based on the exercise name
      const results = workouts.filter(workout => workout.exercise.toLowerCase().includes(searchExercise));
  
      // Display the search results with all details
      if (results.length === 0) {
        exerciseSearchResults.innerHTML = '<li>No workouts found for this exercise.</li>';
      } else {
        results.forEach(result => {
          const li = document.createElement('li');
          let resultText = `${result.exercise} - Date: ${result.date}<br>`;
          
          result.sets.forEach((set, index) => {
            resultText += `Set ${index + 1}: ${set.reps} reps at ${set.weight} kg<br>`;
          });
  
          li.innerHTML = resultText;
          exerciseSearchResults.appendChild(li);
        });
      }
    };
  
    // Initial render
    displayWorkouts();
    updateProgressChart();
  });
  let workouts = [];

  function toggleDropSetOption() {
    const isDropSet = document.getElementById("dropSet").checked;
    document.getElementById("dropSetDetails").style.display = isDropSet ? "block" : "none";
  }
  
  function addSet() {
    const exercise = document.getElementById("exercise").value;
    const workoutDate = document.getElementById("workoutDate").value;
    const weight = parseInt(document.getElementById("setWeight").value);
    const reps = parseInt(document.getElementById("setReps").value);
    const isDropSet = document.getElementById("dropSet").checked;
    const weightDrop = isDropSet ? parseInt(document.getElementById("weightDrop").value) : 0;
  
    if (!exercise || !workoutDate || !weight || !reps) {
      alert("Please fill out all fields.");
      return;
    }
  
    const setDetails = {
      exercise,
      workoutDate,
      sets: [{ weight, reps }],
      isDropSet,
      weightDrop,
    };
  
    if (isDropSet) {
      // Add drop sets with reduced weight
      let remainingWeight = weight;
      let dropSetCount = 3; // Number of drop sets, you can modify this as needed
  
      for (let i = 1; i < dropSetCount; i++) {
        remainingWeight -= remainingWeight * (weightDrop / 100);
        setDetails.sets.push({ weight: Math.round(remainingWeight), reps });
      }
    }
  
    workouts.push(setDetails);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    alert("Workout Saved!");
    displayWorkouts();
  }
  
  function displayWorkouts() {
    const workoutList = document.getElementById("workoutList");
    workoutList.innerHTML = '';
  
    workouts.forEach(workout => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `${workout.exercise} on ${workout.workoutDate} <br> Sets: ${workout.sets.map(set => `Weight: ${set.weight}kg, Reps: ${set.reps}`).join(' | ')}`;
      workoutList.appendChild(listItem);
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    const savedWorkouts = localStorage.getItem('workouts');
    if (savedWorkouts) {
      workouts = JSON.parse(savedWorkouts);
      displayWorkouts();
    }
  });
    