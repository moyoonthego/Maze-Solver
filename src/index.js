import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import $ from 'jquery';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
let dropArea = document.getElementById('drop-area');
let selectionbox = document.getElementById('fileElem');
let selectionbutton = document.getElementById('selectionbutton');
let files = [];
let total = ['dragenter', 'dragover', 'dragleave', 'drop'];
let holdingitem = ['dragenter', 'dragover'];
let droppeditem = ['dragleave', 'drop'];

selectionbox.onchange = e => { 
    var file = e.target.files[0];
    if (files.length !== 1) {
        files= [file]
        handleFiles(files)
    }
}
document.getElementById('solvebutton').onclick = function() {
    if (files.length === 1) {
        document.getElementById('solvebutton').textContent = 'Solving...'
        uploadFile(files[0]);
    }
}

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
  dropArea.classList.remove('highlight')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var cfiles = dt.files
  if (files.length !== 1) {
    if (cfiles.length === 1) {
        files.push(cfiles[0])
        handleFiles(files)
    }
  }

}

function handleFiles(files) {
    if (files.length === 1) {
        selectionbutton.textContent = "Selection complete"
        files = [...files]
        files.forEach(previewFile)
    }
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
  var formData = new FormData()

  formData.append('upload_preset', 'ujpu6gyk')
  formData.append('file', file)

  fetch(url, {
    method: 'POST',
    body: formData
  })
  .then(() => { /* Done. Inform the user */ })
  .catch(() => { /* Error. Inform the user */ selectionbutton.textContent = "An error occurred"})
  
}

function deleteFile(file, i) {
    var url = 'https://api.cloudinary.com/v1_1/joezimim007/image/upload'
    var formData = new FormData()
  
    formData.append('upload_preset', 'ujpu6gyk')
    formData.append('file', file)
  
    fetch(url, {
      method: 'DELETE',
      body: formData
    })
    .then(() => { /* Done. Inform the user */ })
    .catch(() => { /* Error. Inform the user */ selectionbutton.textContent = "An error occurred"})
    
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
