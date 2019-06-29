import React from 'react';
import './App.css';

function App() {
  
  let dropArea = document.getElementById('drop-area');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })
  
  function highlight(e) {
    dropArea.classList.add('highlight')
  }
  
  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }

  return (
    <div>
      <div>
        <h1 text-align="center">Maze Path Solver</h1>
        <h3>Upload a maze image below and hit the
         "start" button to begin processing the image. We will find the shortest path/solution to the maze.</h3>
         <h3>Try downloading and entering a sample file to the left for an example of valid file format.</h3>
      </div>


      <div id="drop-area">
        <form class="my-form">
        <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
          <input type="file" id="fileElem" accept="image/*" onchange="handleFiles(this.files)"/>
          <label class="button" for="fileElem">Select a maze/path-tracing file.</label>
        </form>
      </div>
    </div>

  );

}

export default App;
