
module.exports = function (RED) {
    const rtspFfmpeg = require('rtsp-ffmpeg')

    function Rtsp2Mjpeg(config) {
        RED.nodes.createNode(this, config)
        const node = this

        var options = {}

        // Trim whitespace from username and password
        const trimmedUsername = config.username ? config.username.trim() : ""
        const trimmedPassword = config.password ? config.password.trim() : ""

        // If both username and password are not empty, modify the URL to "rtsp://username:password@original_path"
        if (trimmedUsername && trimmedPassword) {
            options.input = `${config.url.replace(/^rtsp:\/\//, `rtsp://${trimmedUsername}:${trimmedPassword}@`)}`
        }
        else {
            options.input = config.url
        }

        if (config.rate) {
            options.rate = config.rate
        }

        if (config.quality) {
            options.quality = config.quality
        }

        if (config.resolution) {
            options.resolution = config.resolution
        }

        // Initialize the rtsp-ffmpeg stream
        try {
            node.stream = new rtspFfmpeg.FFMpeg(options)
            node.status({fill:'blue', shape:'ring', text:'connected'})
        }
        catch (error) {
            node.error('Error initializing stream: ' + error.message)
            node.status({fill:'red', shape:'ring', text:'disconnected'})
        }

        node.on('input', function (msg) {
            if (!node.stream) {
               node.warn('The stream has not been setup yet')
               return
            }

            switch (msg.topic) {
                case 'start_conversion':
                    if (node.imageHandler) {
                        node.warn('Conversion is already active')
                        return
                    }
                    const imageHandler = function (image) {
                        node.send({ payload: image })
                    }
                    node.stream.on('data', imageHandler)
                    node.imageHandler = imageHandler
                    node.status({fill:'blue', shape:'dot', text:'started'})
                    break

                case 'stop_conversion':
                    if (!node.imageHandler) {
                        node.warn('Conversion is already stopped')
                        return
                    }
                    node.stream.removeListener('data', node.imageHandler)
                    delete node.imageHandler
                    node.status({fill:'blue', shape:'ring', text:'stopped'})
                    break

                default:
                    node.error('Unsupported topic')
            }
        })

        node.on('close', function() {
            if (node.imageHandler) {
                node.stream.removeListener('data', node.imageHandler)
            }
            node.status({})
        })
    }

    RED.nodes.registerType('rtsp2mjpeg', Rtsp2Mjpeg);
}
