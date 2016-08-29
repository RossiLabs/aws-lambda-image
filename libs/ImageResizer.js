"use strict";

const ImageData   = require("./ImageData");
// const ImageMagick = require("imagemagick");
const gm = require("gm").subClass({ imageMagick: true });

class ImageResizer {

    /**
     * Image Resizer
     * resize image with ImageMagick
     *
     * @constructor
     * @param Number width
     */
    constructor(options) {
        this.options = options;
    }

    /**
     * Execute resize
     *
     * @public
     * @param ImageData image
     * @return Promise
     */
    exec(image) {
        const params = {
            srcData:   image.data.toString("binary"),
            srcFormat: image.type,
            format:    image.type
        };

        const acl = this.options.acl;

        if ( "size" in this.options ) {
            params.width = this.options.size;
        } else {
            if ( "width" in this.options ) {
                params.width = this.options.width;
            }
            if ( "height" in this.options ) {
                params.height = this.options.height;
            }
        }

        return new Promise((resolve, reject) => {
            gm(image.data, image.fileName)
            .resize(params.width, params.height)
            .toBuffer(image.type, function (err, buffer) {
                if (err) {
                    reject ("gm err:", err);
                }
                else {
                    let dir = this.options.directory || image.dirName;

                    if ( dir ) {
                        dir = dir.replace(/\/$/, "") + "/";
                    }

                    resolve(new ImageData(
                        dir + image.baseName,
                        image.bucketName,
                        buffer,
                        image.headers,
                        acl
                    ));
                }
            });
        });
    }
}

module.exports = ImageResizer;
