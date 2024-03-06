# @bartbutenaers/node-red-rtsp-to-ffmpeg
A Node-RED node to convert an RTSP stream to an MJPEG stream

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install @bartbutenaers/node-red-contrib-rtsp-to-mjpeg
```

## Support my Node-RED developments
Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Node usage
Some modern IP cameras don't offer MJPEG streams anymore, but instead only support RTSP streams.  While RTSP is a modern protocol (that carries audio with modern encoding), it is convenient in some use cases to have an MJPEG stream.  For example to easy visualize the containing JPEG images, or to execute image processing (like motion or object detection).

In those cases this node can be used to connect to the IP camera via RTSP, and then convert the RTSP stream to an MJPEG stream (using Ffmpeg):

![image](https://github.com/bartbutenaers/node-red-rtsp-to-mjpeg/assets/14224149/3c3f07b0-8e8e-443a-a129-07bb2573e9a5)

The following ***example flow*** demonstrates how the conversion can be started by injecting a message with `msg.topic = 'start_conversion'`, and stopped by `msg.topic = 'stop_conversion'`:

![image](https://github.com/bartbutenaers/node-red-rtsp-to-mjpeg/assets/14224149/16236fd2-f71c-4828-ab43-51d1dc9948fa)
```
[{"id":"b96896ea3aeb4aa3","type":"rtsp2mjpeg","z":"d559c7069178d672","url":"rtsp://192.168.1.21:554/h264Preview_01_sub","username":"your_username","password":"your_password","rate":"","quality":"","resolution":"","x":550,"y":560,"wires":[["08b85c516eae4ea0"]]},{"id":"2daebe66eab7d6bc","type":"inject","z":"d559c7069178d672","name":"Start conversion","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"start_conversion","x":340,"y":560,"wires":[["b96896ea3aeb4aa3"]]},{"id":"e2cfd9118ee0fa29","type":"inject","z":"d559c7069178d672","name":"Stop conversion","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"stop_conversion","x":340,"y":620,"wires":[["b96896ea3aeb4aa3"]]},{"id":"08b85c516eae4ea0","type":"debug","z":"d559c7069178d672","name":"debug 388","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":750,"y":560,"wires":[]}]
```


## Limitations
This node causes high CPU consumption on my Raspberry Pi 4, which is kind of normal because decoding a H264 stream and encode it again to jpeg images.

Reducing the frame rate in the config screen reduces the number of frames send by this node every second, but the CPU usage will keep high.  As a result, you can also reduce the number of images per second using a standard Delay node:

![image](https://github.com/bartbutenaers/node-red-rtsp-to-mjpeg/assets/14224149/d08eeec5-0958-4b67-9a1a-600de0ef5757)
```
[{"id":"36569f3e1dc4bcba","type":"rtsp2mjpeg","z":"d559c7069178d672","url":"rtsp://192.168.1.21:554/h264Preview_01_sub","username":"your_username","password":"your_password","rate":"","quality":"","resolution":"","x":350,"y":280,"wires":[["3896a5dda2731fe8"]]},{"id":"b581861983e59964","type":"inject","z":"d559c7069178d672","name":"Start conversion","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"start_conversion","x":140,"y":280,"wires":[["36569f3e1dc4bcba"]]},{"id":"a37012de657e6d44","type":"inject","z":"d559c7069178d672","name":"Stop conversion","props":[{"p":"topic","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"stop_conversion","x":140,"y":340,"wires":[["36569f3e1dc4bcba"]]},{"id":"3896a5dda2731fe8","type":"msg-speed","z":"d559c7069178d672","name":"","frequency":"sec","interval":1,"estimation":false,"ignore":false,"pauseAtStartup":false,"topicDependent":false,"x":550,"y":280,"wires":[[],["a6964968f634e832"]]},{"id":"c323f201f1275a9e","type":"image","z":"d559c7069178d672","name":"","width":"400","data":"payload","dataType":"msg","thumbnail":false,"active":true,"pass":false,"outputs":0,"x":940,"y":280,"wires":[]},{"id":"a6964968f634e832","type":"delay","z":"d559c7069178d672","name":"","pauseType":"rate","timeout":"5","timeoutUnits":"seconds","rate":"2","nbRateUnits":"1","rateUnits":"second","randomFirst":"1","randomLast":"5","randomUnits":"seconds","drop":true,"allowrate":false,"outputs":1,"x":750,"y":280,"wires":[["c323f201f1275a9e"]]}]
```

Remark: this example flow also uses a [node-red-contrib-msg-speed](https://github.com/bartbutenaers/node-red-contrib-msg-speed/blob/master/README.md) speed node, and a [node-red-contrib-image-output](https://github.com/rikukissa/node-red-contrib-image-output/blob/master/README.md) node.

## Node properties

### URL
Enter the RTSP URL that starts with `rtsp://` to connect to the IP camera.

### Username
Enter the (optional) username to authenticate in the camera.

### Password
Enter the (optional) password to authenticate in the camera.

### Frame rate
The frame rate i.e. number of images per second.

### Quality
The quality setting of the output images.

### Resolution
The resolution (i.e. width x height in pixels) of the output images.
