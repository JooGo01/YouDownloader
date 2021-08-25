//GETTING VIDEO DATA
// const host = '0.0.0.0:3000';

function getVideoInfo(){

  let videoURL = document.getElementById("videoURL").value.trim();
  if (videoURL.length == 0) {
    alert("Please enter youtube video link");
    return;
  }

  fetch( "videoInfo?videoURL=" + videoURL, {mode: 'no-cors'})
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    let detailsNodes = {
        thumbnail: document.querySelector(".video-data .thumbnail img"),
        title: document.querySelector(".video-data .info h2"),
        description: document.querySelector(".video-data .info p"),
        videoURL: document.querySelector(".video-data .controls #video-URL-OPTIONS"),
        downloadOptions: document.querySelector(".video-data .controls #download-options")
    }

    let html = "";
    let repeat = false;
    for (let i = 0; i < data.formats.length; i++) {

        if (data.formats[i].container != "mp4") {
            continue;
        }

        if (data.formats[i].qualityLabel == null) {
            continue;
        } 
        else(data.formats[i].qualityLabel != null && i > 0) 
        {
            for (let ii = 0; ii < i; ii++) {
                if (data.formats[i].qualityLabel == data.formats[ii].qualityLabel) {
                    repeat = true;
                }
            }
            if (repeat == true) {
                repeat = false;
                continue;
            }
        }
        html += `<option value="${data.formats[i].itag}|${data.formats[i].container}">
      ${data.formats[i].container} - ${data.formats[i].qualityLabel}</option>`;

        detailsNodes.thumbnail.src = data.videoDetails.thumbnails[data.videoDetails.thumbnails.length - 1].url; // get img
        detailsNodes.title.innerText = data.videoDetails.title;
        detailsNodes.description.innerText = data.videoDetails.description;
        detailsNodes.videoURL.value = videoURL;
        detailsNodes.downloadOptions.innerHTML = html;

        document.querySelector(".video-data").style.display = "block";
        document.querySelector(".video-data").scrollIntoView({behavior: "smooth"});
    }
  })
  .catch(function(error){console.log(error);});
};

// ADDING EVENT TO THE BUTTON
const btnGet=document.getElementById("getvideo");

btnGet.addEventListener("click", getVideoInfo);

//DOWNLOADING VIDEO 

function downloadVideo(){
  let videoURL = document.querySelector("#video-URL-OPTIONS").value;
  let details = document.querySelector("#download-options").value.split("|");
  let itag = details[0];
  let format = details[1];
  window.open("download?videoURL="+videoURL+"&itag="+itag+"&format="+format);
};

// ADDING EVENT TO THE BUTTON
const btnDwnl=document.querySelector("#download-btn");

btnDwnl.addEventListener("click", downloadVideo);
