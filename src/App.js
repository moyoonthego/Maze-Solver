import React from 'react';
import './App.css';

function App() {
  
/*   let dropArea = document.getElementById('drop-area');
  let filesDone = 0
  let filesToDo = 0
  let total = ['dragenter', 'dragover', 'dragleave', 'drop'];
  let holdingitem = ['dragenter', 'dragover'];
  let droppeditem = ['dragleave', 'drop'];

   // Prevent default drag behaviors
  total.forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)   
    document.body.addEventListener(eventName, preventDefaults, false)
  })

  // Highlight drop area when item is dragged over it
  holdingitem.forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  droppeditem.forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  // Handle dropped files
  dropArea.addEventListener('drop', handleDrop, false)

  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function highlight(e) {
    dropArea.classList.add('highlight')
  }

  function unhighlight(e) {
    dropArea.classList.remove('active')
  }

  function handleDrop(e) {
    var dt = e.dataTransfer
    var files = dt.files

    handleFiles(files)
  }

  let uploadProgress = []
  let progressBar = document.getElementById('progress-bar')

  function initializeProgress(numFiles) {
    progressBar.value = 0
    uploadProgress = []

    for(let i = numFiles; i > 0; i--) {
      uploadProgress.push(0)
    }
  }

  function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent
    let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
    console.debug('update', fileNumber, percent, total)
    progressBar.value = total
  }

  function handleFiles(files) {
    files = [...files]
    initializeProgress(files.length)
    files.forEach(uploadFile)
    files.forEach(previewFile)
  }

  function previewFile(file) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = function() {
      let img = document.createElement('img')
      img.src = reader.result
      document.getElementById('gallery').appendChild(img)
    }
  }

  function uploadFile(file, i) {
    var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function(e) {
      updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', function(e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        updateProgress(i, 100) // <- Add this
      }
      else if (xhr.readyState === 4 && xhr.status !== 200) {
        // Error. Inform the user
      }
    })

    formData.append('upload_preset', 'ujpu6gyk')
    formData.append('file', file)
    xhr.send(formData)
  } */

    return (
      <React.Fragment>
        <div>
          <h1 text-align="center">Maze Path Solver</h1>
          <h3>Upload a maze image below and hit the "start" button to begin processing the image. We will find the shortest path/solution to the maze.</h3>
          <h3>Try downloading and entering a sample file to the left for an example of valid file format.</h3>
        </div>
        <div id="drop-area">
          <form class="my-form">
            <p >Upload a file with the file dialog or by dragging and dropping images onto the dashed region</p>
            <input type="file" id="fileElem" multiple accept="image/*" onchange="handleFiles(this.files)"></input>
            <label class="button" for="fileElem">Select a maze/path-tracing file</label>
          </form>
          <progress id="progress-bar" max='100' value='0'></progress>
          <div id="gallery" />
        </div>
        <div id="sample-file-area">
          <form class="my-form-2">
            <p >Here are some sample maze files to play with...</p>
            <b >Download these to test with them</b>
          </form>
        </div>
      </React.Fragment>
    );

}

export default App;
