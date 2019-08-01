import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
let dropArea = document.getElementById('drop-area');
let selectionbox = document.getElementById('fileElem');
let selectionbutton = document.getElementById('selectionbutton');

let files = [];
let deletecode = '';
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
        solveFile(files[0]);
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
        selectionbutton.textContent = "Uploading...."
        files = [...files]
        files.forEach(previewFile)
        files.forEach(uploadFile)
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

function solveFile(file, i) {
    downloadFile(file);
    deleteFile(file);
}

function downloadFile(file, i) {
    var fr = new FileReader();
    fr.readAsDataURL(file);

    var blob = new Blob([file], { type: "image/png" });

    var objectURL = window.URL.createObjectURL(blob);
    console.log(objectURL);

    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        window.navigator.msSaveOrOpenBlob(blob, 'image');
    } else {
        var link = document.createElement('a');
        link.href = objectURL;
        link.download = "image";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}

function uploadFile(file, i) {

  /*
    var url = 'https://api.cloudinary.com/v1_1/maze-path-solver/image/upload'
    var formData = new FormData();
    formData.append('upload_preset', 'myzjrxlg')
    formData.append('file',  file, 'image')
    formData.append('name', 'image')

    fetch(url, {
        method: 'POST',
        body: formData
    }).then(function(res) {
        selectionbutton.textContent = "Selection complete" //Done. Inform the user
        console.log(res) 
        }).catch(() => { selectionbutton.textContent = "An error occurred:" //Error occured, notify user
    })
   */
}

function deleteFile(file, i) {
    var url = 'https://cloudinary.com/console/media_library/folders/all/https://res.cloudinary.com/maze-path-solver/image/upload/v1564440033/image.png'
    var formData = new FormData();
  
    formData.append('upload_preset', 'myzjrxlg')
    formData.append('file',  file, 'image')
    formData.append('name', 'image')
  
    return fetch(url, {
      method: 'DELETE',
      body: formData
    })
    .then(() => { /* Done. Inform the user */ })
    .catch(() => { /* Error. Inform the user */ document.getElementById('solvebutton').textContent = "An error occurred:"})
    
}

// `````````````````````
// `````````````````````
function BFS(starty, startx, endy, endx)
{
  var queuei = [starty];
  var queuej = [startx];
  dic = {}
  dic[starty.toString()+','+startx.toString()] = [{i: starty, j: startx}]
  var imgData = ctx.getImageData(0, 0, img.width, img.height);
  var k = (starty * img.width + startx) * 4;
  imgData.data[k] = 255;
  imgData.data[k+1] = 153;
  imgData.data[k+2] = 255;
  while (queuei.length > 0)
  {
      var ii = queuei.shift();
      var jj = queuej.shift();
      if (ii == endy && jj == endx)
      {
          for(var key in dic[endy.toString()+','+endx.toString()])
          {
             var iii = dic[endy.toString()+','+endx.toString()][key].i;
             var jjj = dic[endy.toString()+','+endx.toString()][key].j;
             var kp = (iii*img.width+jjj)*4;
             imgData.data[kp] = 255;
             imgData.data[kp+1] = 0;
             imgData.data[kp+2] = 0;
          }
          ctx.putImageData(imgData, 0, 0);
          break;
      }
      var k1 = ((ii - 1) * img.width + jj) * 4;
      if (ii-1 >= 0 && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii-1);
          queuej.push(jj);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii-1, j: jj});
          dic[(ii-1).toString()+','+jj.toString()] = t;
      }
      k1 = ((ii + 1) * img.width + jj) * 4;
      if (ii+1 < img.height && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii+1);
          queuej.push(jj);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii+1, j: jj});
          dic[(ii+1).toString()+','+jj.toString()] = t;
      }
      k1 = (ii * img.width + jj - 1) * 4;
      if (jj-1 >= 0 && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii);
          queuej.push(jj-1);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii, j: jj-1});
          dic[(ii).toString()+','+(jj-1).toString()] = t;
      }
      k1 = (ii * img.width + jj + 1) * 4;
      if (jj+1 < img.width && imgData.data[k1] == 255 && imgData.data[k1+1] == 255 && imgData.data[k1+2] == 255)
      {
          imgData.data[k1] = 255;
          imgData.data[k1+1] = 153;
          imgData.data[k1+2] = 255;
          queuei.push(ii);
          queuej.push(jj+1);
          var t = dic[ii.toString()+','+jj.toString()].slice();
          t.push({i:ii, j: jj+1});
          dic[(ii).toString()+','+(jj+1).toString()] = t;
      }
      ctx.putImageData(imgData, 0, 0);
  }
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
