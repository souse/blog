```html
<html>
<head>
    <title>demo</title>
    <meta charset="utf-8">
    <link href="https://unpkg.com/video.js/dist/video-js.css" rel="stylesheet">
    <script src="https://unpkg.com/video.js/dist/video.js"></script>
    <!-- <script src="https://unpkg.com/videojs-contrib-hls/dist/videojs-contrib-hls.js"></script> -->
    <style>
        #video_id {
            width: 100% !important;
            height: 540px;
        }
    </style>
</head>

<body>
    <video id="video_id" class="video-js vjs-default-skin" controls autoplay muted>
        <source src="https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8" type="application/x-mpegURL" />
      </video>
    <script type="text/javascript">
        var player = videojs('video_id');

        player.src({
            src: 'https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8',
            type: 'application/x-mpegURL'
        });
    </script>
</body>

</html>
```

