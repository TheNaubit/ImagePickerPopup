# Image Picker Popup
 
## Content
- [What is this repo?](#what-is-this-repo)
- [Dependencies?](#dependencies)
- [Installation](#installation)
- [How to show the image picker?](#how-to-show-the-image-picker)
- [How to add images to the Image Picker?](#how-to-add-images-to-the-image-picker)
  - [Using data- attributes](#using-data--attributes)
    - [data-path](#data-path)
    - [data-alt](#data-alt)
  - [Using addImage function](#using-addimage-function)
- [What if I want to close the Image Picker Window?](#what-if-i-want-to-close-the-image-picker-window)
- [So, what are the arguments you can set when creating a new ImagePickerPopup object?](#so-what-are-the-arguments-you-can-set-when-creating-a-new-imagepickerpopup-object)
- [How to reset the Image Picker?](#how-to-reset-the-image-picker)
- [How to use Font Awesome instead Friconix?](#how-to-use-font-awesome-instead-friconix)
 
## What is this repo?
I was working in the project of one client and I need a basic Image Picker popup window. I tried to find a library on the Internet since I couldn't spend a lot of time on that since it was just a minor update.

But I didn't find anything. Well, a few, but they didn't fit what I wanted. So I created this one.

## Dependencies?
I coded it using **Vanilla JS** (it means, the classic Javascript, no jQuery) and I tried to make it able to run in almost every modern browser.

If you find any problem, just report the issue and I will try to find the error. For older browsers (mostly IE7 and things like that), it maybe works but I have to do several more tests.

This library uses two other libraries: [Masonry Layout](https://github.com/desandro/masonry) and [ImagesLoaded](https://github.com/desandro/imagesloaded), both by the same author, Desandro, so **a big thanks to him**! (And don't forget to check his projects).

Apart those libraries, it needs to show a close icon so you should add Friconix dependecy (or Font Awesome, as you prefer). More about it in the Installation section.

## Installation
You can download ImagePickerPopup.js and ImagePickerPopup.css and serve them locally. Or you can just use the CDN.

In both cases, add in the head section of your html file this code:
```HTML
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/NauCode/ImagePickerPopup@1.0.0/src/ImagePickerPopup.min.css" />
```

If you prefer to use the latest version:
```HTML
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/gh/NauCode/ImagePickerPopup@latest/src/ImagePickerPopup.min.css" />
```

After that, at the end of the body section add this code (if you use Friconix):
```HTML
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>
<script defer src="https://friconix.com/cdn/friconix.js"></script>
 <script src="https://cdn.jsdelivr.net/gh/NauCode/ImagePickerPopup@1.0.0/src/ImagePickerPopup.min.js"></script>
```

Again, you can replace the 1.0.0 for the version you want to use or 'latest':
```HTML
<script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
<script src="https://unpkg.com/imagesloaded@4/imagesloaded.pkgd.min.js"></script>
<script defer src="https://friconix.com/cdn/friconix.js"></script>
<script src="https://cdn.jsdelivr.net/gh/NauCode/ImagePickerPopup@latest/src/ImagePickerPopup.min.js"></script>
```

Now just go to the first line after the body tag in your HTML file and add a div with an ID (for example 'imagePickupContainer'). Like this:
```HTML
<body>
  <div id="imagePickupContainer"></div>
  ..... the rest of your HTML
</body>
```

**Everything is done!** Now you just need to initialize the class creating a new ImagePickerPopup object. For example you can add a new script at the end of the body, like this:
```HTML
<body>
  ..... the rest of your HTML
  <script>
    var imagePicker = new ImagePickerPopup("imagePickupContainer",function(src,alt){
        alert('You selected an image with URL '+src+' and alt text '+alt);
        imagePicker.closePopup(true);
      }, function(){
        alert('Oh, you closed the popup without picking any image :(');
      });   
  </script>
</body>
```

## How to show the image picker?
Well, if you have installed it and you have already created a new ImagePickerPopup object (like I did in the example with the imagePicker var), you can call this javascript method from anywhere:
```JS
imagePicker.openPopup();
```

## How to add images to the Image Picker?
You have two ways:
### Using data- attributes
Do you remember when you have created that empty div with an ID (in the example it was 'imagePickupContainer')? Well, you could add to the div two data- attributes:
- data-path
- data-alt

#### data-path
That attribute is an array with the links to the images. For example:
```HTML
<body>
  <div id="imagePickupContainer" data-path='["https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/orange-tree.jpg","https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/submerged.jpg","https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/look-out.jpg","https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/one-world-trade.jpg"]'></div>
  ..... the rest of your HTML
</body>
```

#### data-alt
That attribute is an array with the alt text for the images. It is optional and you **don't** need to add an alt text for every image you add to the picker. For example:
```HTML
<body>
  <div id="imagePickupContainer" data-path='["https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/orange-tree.jpg","https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/submerged.jpg","https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/look-out.jpg","https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/one-world-trade.jpg"]' data-alt='["First image alt text","","Third image alt text"]'></div>
  ..... the rest of your HTML
</body>
```
As you can see the second and fourth images don't have alt text. The second element is empty since third element of the data-alt array applies to third element of the data-path array. And the fourth element is not set since we don't want to add an alt text for that image and there is no following images where we want to add alt text.

### Using addImage function
You can also add new images dynamically. Just call the method from the ImagePickerPopup object (like I did in the example with the imagePicker var):
```JS
imagePicker.addImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/orange-tree.jpg','Some alt text');
imagePicker.addImage('https://s3-us-west-2.amazonaws.com/s.cdpn.io/82/look-out.jpg','');
imagePicker.registerClickListenerOnImages();
```
As you can see in the example you can add the image with alt text or without, it doesn't matter. **But you always have to add a src!!** (the first argument).
After you add all the images you need, you have to call the registerClickListenerOnImages() function so the user will be able to select the new images. Don't worry about having repeated listeners on previous images, the function will protect you from that!

## What if I want to close the Image Picker Window?
Easy. You can click the close button.

Ok, ok, maybe you want to do it by code. Just call the closePopup() method:
```JS
imagePicker.closePopup();
```
Calling the method like that is the same as if you click the close button, **it also fires the function you define to be called when the user cancel the image selection!*.

So, what if you want to close the popup without firing the "cancelled selection" function? For example, how can you close the popup after the user selects an image?
Easy:
```JS
imagePicker.closePopup(true);
```
Yes! Just that, add a true var in the arguments and done, it won't fire the "cancelled selection" function.

## So, what are the arguments you can set when creating a new ImagePickerPopup object?
You only need one, the ID of the empty div you created.
```JS
var imagePicker = new ImagePickerPopup("imagePickupContainer"); 
```
**Yes, that's all!**
But in reality there are 5 arguments you can set:
```JS
var imagePicker = new ImagePickerPopup(
  containerID,
  onImageSelected,
  onCancelledSelector,
  debug,
  useFAS
); 
```
Let's go one by one:
- **containerID**: The first argument is the one we have already talked about. It is the ID of the empty div you created. If not set, the class will throw an error.
- **onImageSelected**: The second argument must be a function with two arguments. That function will be called when the user select an image. The first argument will be the URL of the selected image and the second one will be the alt text (if any, if not it will be null). If not set, it is null.
- **onCancelledSelector**: The third argument must be a function with no arguments. That function will be called when the user close the popup or when the closePopup() method is called (if it is not called as closePopup(true) as explained before). If not set, it is null.
- **debug**: This argument must be a bool var. If set to true, you will see debug information when using this class. If not set or if set false, it won't show any message. By default it is false.
- **useFAS**: This argument must be a bool var. If set to true, the class will use Font Awesome CSS to display the close button. If not set or set to false, it will use Friconix css. By default it is false. In a moment I will explain more about this.

So, this is an example of the constructor being called with several arguments:
```JS
var imagePicker = new ImagePickerPopup("imagePickupContainer",function(src,alt){
        alert('You selected an image with URL '+src+' and alt text '+alt);
        imagePicker.closePopup(true);
      }, function(){
        alert('Oh, you closed the popup without picking any image :(');
      });  
``` 

## How to reset the Image Picker?
Maybe you want to remove all the images or your data-path attribute has changed and want to update the Image Picker. Well, there is a function to do that:
```JS
imagePicker.generateImagePicker(containerID, true);
``` 
So in our example div, it would be:
```JS
imagePicker.generateImagePicker("imagePickupContainer", true);
``` 
Keep in mind the second argument is the key to reset it! **Don't set it to false** since then it will use the previous images it has stored!

## How to use Font Awesome instead Friconix?
If you want to use Font Awesome instead Friconix (since maybe you prefer to use it in your project for other things), just replace this line with the code provided by Font Awesome:
```HTML
<script defer src="https://friconix.com/cdn/friconix.js"></script>
```

Now when you create the ImagePickerPopup object, just call it like this:
```JS
var imagePicker = new ImagePickerPopup(
  containerID,
  onImageSelected,
  onCancelledSelector,
  debug,
  true
); 
```
**Notice the last argument is set to true!** It will tell to ImagePickerPopup class to use Font Awesome. 
