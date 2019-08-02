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
    if ((files.length === 1) && (document.getElementById('solvebutton').textContent !== 'Solved!')) {
        document.getElementById('solvebutton').textContent = 'Solving... this may take a minute.'
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
    }
}

function previewFile(file) {
  let reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = function() {
    let img = document.createElement('img')
    img.src = reader.result
    document.getElementById('gallery').appendChild(img)
    selectionbutton.textContent = "Selection complete" //Done. Inform the user
  }
}

function solveFile(file, i) {
    var img = new Image();
    var canvas = document.getElementById('finalpath')
    var ctx = canvas.getContext("2d");

    var url = window.URL;
    var src = url.createObjectURL(files[0]);
    img.src = src;
    img.addEventListener("load", function () {
        img.width = this.width
        img.height = this.height
        canvas.width = img.width
        canvas.height = img.height
        ctx.strokeStyle = "red";

        ctx.drawImage(img,0,0);
        findPath(img, ctx);
        downloadFile(ctx, canvas);
    });

}

function downloadFile(ctx, canvas, i) {
    //var fr = new FileReader();
    //fr.readAsDataURL(file);

    //var objectURL = window.URL.createObjectURL(file); //should be (blob)
    //console.log(objectURL);
    var img = new Image();
    img.src = canvas.toDataURL();

    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        window.navigator.msSaveOrOpenBlob(img, 'image');
    } else {
        var link = document.createElement('a');
        link.href = img.src;
        link.download = "image";
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
}

// `````````````````````
// `````````````````````
function findPath(img, ctx)
{
    var imgPath = [];
    // *********
    // Set up required data structures
    var pred = {}
    pred[[0,0]] = null
    var done = {}
    var pr = {}
    pr[[0,0]] = 0
    var pq = []
    var target = [img.width - 1, img.height - 1]

    // Add initial spot to queue
    push(pq, [0, 0, 0]);
    //console.log("CURRENT PQ:"+pq);
    // Standard Dijkstra loop
    while (pq.length !== 0) {
        var jxy = pop(pq);
        //console.log("CURRENT PIXELS:"+jxy[1] +','+jxy[2])
        // If we're done with this, skip (this lets us not
        //   have to implement decrease_priority)
        if ([jxy[1], jxy[2]] in done) {
            continue
        }
        done[[jxy[1], jxy[2]]] = 0

        // If we reached goal, done
        if ([jxy[1], jxy[2]] === target) {
            break
        }
        var nextcheck =  [[jxy[1], jxy[2]-1], [jxy[1]+1, jxy[2]], [jxy[1], jxy[2]+1], [jxy[1]-1, jxy[2]]] 

        // For all possible neighbours...
        nextcheck.forEach(function (newxy, index) {

            var nbx = parseInt(newxy[0])
            var nby = parseInt(newxy[1])
            //console.log("CUR NEXT PIXEL:"+nbx + "," + nby);
            //console.log('IMAGE WIDTH:'+ img.width + "," + img.height);
            // If valid and not already expanded
            if ((0 <= nbx) && (nbx <= (img.width - 1)) && (0 <= nby) && (nby <= (img.height - 1)) && !([nbx, nby] in done)) {
                //console.log("VALID CUR PIXEL:"+nbx + "," + nby);
                var colors = ctx.getImageData(nbx, nby, 1,1).data;
                //console.log("VALID CUR PIXEL:"+nbx + "," + nby+"    COLORS:"+colors[0]+ "," +colors[1]+ "," +colors[2]);
                // Get and update the costs as necessary
                var d = how_white(colors) + pr[[jxy[1], jxy[2]]]
                //console.log("COST:"+d)
                if (!([nbx, nby] in pr) || (pr[[nbx, nby]] > d)) {
                    pred[[nbx, nby]] = [jxy[1], jxy[2]]
                    pr[[nbx, nby]] = d
                    push(pq, [d, nbx, nby]);
                }
            }
        });

    }

    // Backtrack and construct the path
    while (Array.isArray(target)) {
        imgPath.unshift(target);
        target = pred[target]
    }
    // *********
    //console.log("PATH IS:"+imgPath);
    ctx.beginPath();
    ctx.moveTo(0,0);
    imgPath.forEach(function (item, index) { // finally, visiting every pixel in path
        ctx.lineTo(item[0], item[1]);
      });
    ctx.stroke(); // print path
    document.getElementById('solvebutton').textContent = 'Solved!'
    
}

function pop(pq){
    if (pq.length == 1) {
        return pq.pop()
    }
    // Replace min with last element
    var ret = pq[0]
    pq[0] = pq.pop()

    // Keep swapping with smallest child if any of them is smaller
    var low = 0
    var cur = 0
    var l = pq.length
    while(true) {

        cur = low

        var RCHILD = (cur+1) * 2
        var LCHILD = RCHILD - 1

        if (LCHILD < l && pq[LCHILD][0] < pq[low][0]) {
            low = LCHILD
        }
        if (RCHILD < l && pq[RCHILD][0] < pq[low][0]) {
            low = RCHILD
        }
        if (cur === low) {
            // Standard Dijkstra loop
            break
        }

        var temp = pq[low]
        pq[low] = pq[cur]
        pq[cur] = temp
    }

    return ret
}
function push(pq, a) {
    // Add to the end
    pq.push(a)
    var cur = (pq).length - 1

    // Swap with parent while smaller
    var PARENT = (Math.floor((cur + 1) / 2)) - 1
    while (PARENT > 0 && pq[cur][0] < pq[PARENT][0]) 
    {
        var temp = pq[PARENT]
        pq[PARENT] = pq[cur]
        pq[cur] = temp
        cur = PARENT
        PARENT = Math.floor((cur + 1) / 2) - 1
    }
}

function how_white(pb) {
    var dst = (255-pb[0])**2 + (255-pb[1])**2 + (255-pb[2])**2
    return (((dst/100.0) ** 0.5) + 0.01)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
