(function () {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 320;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream
  var slide_x = 50;

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var __stream = null;
  var play = null;
  var stop = null;

  var save = null;

  var input_c = null;
  var output_c = null;


  var dest_CTX = null;
  var __prom = null;
  var first_pic = true;


  var startbutton = null;

  function startup() {
    // Получаем элементы
    video = document.getElementById('video');
    input_c = document.getElementById('input_c');
    output_c = document.getElementById('output_c');
    startbutton = document.getElementById('startbutton');
    play = document.getElementById('play');
    stop = document.getElementById('stop');
    save = document.getElementById('save');

    // Назначаем поддерживаемую платформу
    navigator.getUserMedia = (
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    );

    // Определяем стрим
    navigator.getUserMedia(
      // Constraints 
      {
        video: {
          // width: { ideal: 1280 },
          // height: { ideal: 1024 },
          facingMode: "environment"
        },
        audio: false
      },
      // Успешный CALLBACK
      function (stream) {
        // Назначаем сурс для видеозахвата
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }

        // Видеодорожка
        __stream = stream.getVideoTracks()[0];
        video.play();

      },
      // Неуспешный CALLBACK
      function (err) {
        console.log("An error occured! " + err);
      }
    );


    video.addEventListener('canplay', function (ev) {
      if (!streaming) {
        // Firefox не может получить высоту из видео, считаем её сами
        height = video.videoHeight / (video.videoWidth / width);
        if (isNaN(height)) {
          height = width / (4 / 3);
        }

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        input_c.setAttribute('width', width);
        input_c.setAttribute('height', height);
        streaming = true;
      }

      initOutput();

    }, false);

    startbutton.addEventListener('click', function (e) {
      e.preventDefault();
      takepicture();
    }, false);

    play.addEventListener('click', function (e) {
      e.preventDefault();
      s_play();
    })

    stop.addEventListener('click', function (e) {
      e.preventDefault();
      s_stop();
    })

    save.addEventListener('click', function (e) {
      e.preventDefault();
      s_save();
    })

    // clearphoto();
    // navigator.mediaDevices;
    console.log(navigator.mediaDevices);
  }


  function takepicture() {
    var src_CTX = input_c.getContext('2d');
    if (width && height) {
      input_c.width = width;
      input_c.height = height;
      src_CTX.drawImage(video, 0, 0, width, height);


      var add_x;
      if (first_pic) {
        add_x = 0;
      }
      else {
        add_x = width;
      }

      new_width = output_c.width + add_x;

      if (!first_pic) {

        let destIMG;
        destIMG = null;
        destIMG = new Image;
        destIMG.onload = function () {
          dest_CTX.drawImage(destIMG, slide_x, 0, new_width - width, height);
        };
        destIMG.src = output_c.toDataURL();

        output_c.width = new_width;
      }

      setTimeout(() => {
        dest_CTX.drawImage(input_c, new_width - width, 0, width, height);
      }, 1);

      first_pic = false;

      remember();

    } else {
      // clearphoto();
    }
  }

  function remember() {
  }

  function onresize(w) {
  }

  function initOutput() {
    dest_CTX = output_c.getContext('2d');
    output_c.width = width;
    output_c.height = height;
  }

  function s_play() {
    video.play();
  }

  function s_stop() {
    video.pause();
    video.src = '';
    __stream.stop();
  }

  function s_save() {
    var imgData = output_c.toDataURL('image/jpeg', 1);
    var link = document.getElementById('saveImg');
    link.href = imgData;
    link.download = 'myPhoto.jpg';
    link.click();
  }


  // Fill the photo with an indication that none has been
  // captured.
  function clearphoto() {
    // var context = canvas.getContext('2d');
    // context.fillStyle = "#AAA";
    // context.fillRect(0, 0, canvas.width, canvas.height);

    // var data = canvas.toDataURL('image/png');
    // photo.setAttribute('src', data);
  }

  // onInit
  window.addEventListener('load', startup, false);
})();