# Lumi2d Atlas

Lumi2d Atlas is a command line image atlas packing tool. It combines multiple images into one and exports it together with a JSON file that has information on the size and position of each of the images inside the atlas.

## Installation
To install the tool, run `npm install 'https://gitpkg.now.sh/codescapade/lumi2d/packages/atlas?main'`.
This is until the package is published on npm when the engine is ready.

## How to use Lumi2d Atlas
After installation you can run `npx lumi-atlas init` to generate an `atlas.toml` configuration file.

To generate the atlas run `npx lumi-atlas`.

You can provide a different folder for the `.toml` file using `npx lumi-atlas -p <path to your .toml>`.

## The toml schema
The atlas config file can contain multiple configurations so you can generate multiple atlases at the same time.

Configs are in an `[[atlas]]` table array that holds the separate configs.  
The following config options are available:

- `name`: `String`. The name of the output files.
- `saveFolder`: `String`. The folder where the output will be saved.
- `folders`: `Array<String>`. folder paths containing images. This is not recursive so sub-folders will not be added. This is optional if you use the files field below.
- `files`: `Array<String>`. file paths of images. This is optional if you use the folders field above.
- `trimmed`: `Boolean`. Trim the transparent space around the image. Optional. The default is true.
- `extrude`: `Integer`. The amount of pixels around the image to extrude. This can help with artifacts on the edges of sprites. Optional. The default is 1 pixel.
- `packMethod`: `String`.
  - `basic`: Sort the images alphabetically and add them to the atlas without optimization.
  - `optimal`: Pack the images in the smallest possible image.  
  Optional. The default is `optimal`. 
- `folderInName`: `Boolean`. Should the folder name be added to the image name in the data file separated by an underscore(_). This can help if you have images with the same name in different folders in the same atlas. Optional. The default is false.
- `maxWidth`: `Integer`. The maximum width of the output image in pixels. Optional. The default is 4096.
- `maxHeight`: `Integer`. The maximum height of the output image in pixels. Optional. The default is 4096.
- `noData`: `Boolean`. If true only export the image without the JSON data file. Optional. The default is false.

The `saveFolder`, `files` and `folders` paths should be relative to the config file.   
This is an example of a config file:
``` toml
[[atlas]]
name = "basic"
saveFolder = "output/01_basic"
folders = [
  "images",
  "otherImages/pictures"
]
files = [
  "myFile.png",
  "myImageFolder/myImage.png"
]
trimmed = false
extrude = 1
packMethod = "basic"
folderInName = true
maxWidth = 1024
maxHeight = 1024
noData = false
```

## The output data JSON file
The data file for the atlas has the same format as the basic JSON export in TexturePacker so it is easy to integrate with other software that reads image atlases.  
This is an example of the output file:

``` json
{
  "frames": [
    {
      "rotated": false,
      "sourceSize": {
        "h": 46,
        "w": 48
      },
      "filename": "blue_box",
      "spriteSourceSize": {
        "h": 46,
        "w": 48,
        "x": 0,
        "y": 0
      },
      "frame": {
        "h": 46,
        "w": 48,
        "x": 0,
        "y": 0
      },
      "trimmed": false
    }
  ]
}
```
