class ImagePickerPopup {
  // This is the constructor
  // It accepts 4 args
  // containerID is required and it is the ID of the empty div in your html
  // where you want to place the Image Picker
  // onImageSelected is optional and if set it must be a function to be called
  // once the user clicks on an image of the Image Picker (so it selects the image)
  // onCancelledSelected is also optional and if set it must be a function
  // to be called once the user clicks on the close button (so it doesn't select anything)
  // debug is optional and if it is set to true it will show console messages when running
  // this; in any other case it won't show console messages
  constructor(containerID, onImageSelected, onCancelledSelector, debug) {
    // First we set the initial vars
    this.onImageSelected = onImageSelected;
    this.onCancelledSelector = onCancelledSelector;

    // Just if you want to see console messages
    if(debug===true){
      this.debug=true;
    }else{
      this.debug=false;
    }

    this.generateImagePicker(containerID, false);
  }

  // This method opens the window
  openPopup() {
    // If it is configured, ofc
    if (this.imagePopupWindow !== undefined) {
      // This sets the element visible
      this.imagePopupWindow.style.display = "block";
      // And this is just "a fix", since sometimes
      // Masonry is not correctly displayed and with this we force to refresh
      // the layout and display it well
      this.masonry.layout();
    }
  }

  // This should be used as a private function
  // And it is just to check if a var is set and it is a function
  _isFunction(varToCheck) {
    if (
      varToCheck !== null &&
      varToCheck !== undefined &&
      varToCheck instanceof Function
    ) {
      return true;
    }

    return false;
  }

  // This method closes the window
  // The arg it accepts is optional
  // Usually it is false since closePopup() is called when user clicks on the close button
  // But if you want to close the popup without firing the function you assign
  // when user close the popup (this.onCancelledSelector), just set dontFireCancelFunction as true
  // For example it is useful when you want to close the popup after the user selects an image
  // (I didn't make the popup autoclose when user selects an image to allow more flexibility to
  // the class, so it has to be closed calling this function, and it that case you usually don't
  // want to fire the this.onCancelledSelector function so you will call this function
  // as closePopup(true))
  closePopup(dontFireCancelFunction) {
    // Again, if it is configured
    if (this.imagePopupWindow !== undefined) {
      // Just a display:none css rule
      this.imagePopupWindow.style.display = "none";
      // And if a function is set to this var, we call it
      // (for example, if you want to show a message when the user cancel the image selection)
      // This is just to check if the function is set and it is a function
      // Based on this: https://stackoverflow.com/a/7356528
      if (
        dontFireCancelFunction !== true &&
        this._isFunction(this.onCancelledSelector)
      ) {
        this.onCancelledSelector();
      }
    }
  }

  // This method remove the click listeners on the images
  // (If they have)
  removeClickListenerOnImages() {
    if (
      this.imageClickListeners !== null &&
      this.imageClickListeners !== undefined &&
      this.imageClickListeners.length > 0
    ) {
      // There are listeners!
      // Using for and not foreach just to be able to use this._onImageClicked easily
      for(var i = 0; i<this.imageClickListeners.length;i++){
        this.imageClickListeners[i].removeEventListener("click", this._onImageClicked);
      }
      // And empty the array
      this.imageClickListeners = [];
    }
  }

  // This method register the click listeners on the images
  registerClickListenerOnImages() {

    // We try to empty the listeners (just if they are already registered)
    this.removeClickListenerOnImages();

    var items = this.masonry.getItemElements();
    // I use the for and not foreach to be able to call 'this' methods
    // from the class
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (
        this.imageClickListeners === undefined ||
        this.imageClickListeners === null
      ) {
        this.imageClickListeners = [];
      }
      if (this.imageClickListeners.length >= items.length) {
        if(this.debug){
          console.warn(
            "Maybe you are trying to register image click listeners more than once!"
          );
        }
      } else {
        item.parentClass = this;
        item.addEventListener("click", this._onImageClicked);
        this.imageClickListeners.push(item);
        if(this.debug){
          console.log("Registered an image click listener!");
        }
      }
    }
  }

  // This is a private function to handle clicks on the images
  _onImageClicked() {
    var targetElement = event.target || event.srcElement;

    // Check if the onImageSelected var is a valid function
    if (this.parentClass._isFunction(this.parentClass.onImageSelected)) {
      // And if it is, call it
      // But we have to be sure we got an image element

      if (targetElement === null || targetElement === undefined) {
        if(this.debug){
          console.warn("We couldn't find img element in the div you clicked!");
        }
        return;
      } else {
        // If we got it, just get some of their attributes
        var tmpSrc = targetElement.getAttribute("src");
        var tmpAlt = targetElement.getAttribute("alt");
        // And call the function
        this.parentClass.onImageSelected(tmpSrc, tmpAlt);
      }
    }
  }

  // This method add an image to the grid
  // You have to enter the path to the image
  // And you can also enter the alt text, but it is optional
  // If you call it from outside the constructor
  // You have to also call the registerClickListenerOnImages()
  // function or you won't be able to select the added image
  // If you add several images, I recommend to just call the
  // registerClickListenerOnImages() once you have added all
  // of them
  addImage(src, alt) {
    var tmpGridItem = document.createElement("div");
    tmpGridItem.className += "grid-item";
    var tmpImgItem = document.createElement("img");
    tmpImgItem.setAttribute("src", src);

    // If the alt is a valid one...
    if (alt !== null && alt !== undefined && alt !== "") {
      tmpImgItem.setAttribute("alt", alt);
    }
    tmpGridItem.appendChild(tmpImgItem);

    this.grid.appendChild(tmpGridItem);
  }

  // This method generate completly the Image Picker
  // You have to set the containerID arg with the div id where you want
  // the Image Picker placed.
  // It also deletes the DOM created if reset arg is set true (it is optional)
  // It is useful if you change the data-path and data-alt attributes
  // And want to regenerate the Image Picker
  generateImagePicker(containerID, reset) {
    this.imagePopupWindowID = containerID;
    this.imagePopupWindow = document.getElementById(this.imagePopupWindowID);

    // First lets check if we can find the container
    if (this.imagePopupWindow === undefined) {
      if(this.debug){
        console.error("Div with ID " + containerID + " not found!");
      }
      return;
    }

    // If we wanted to reset it, we do it!
    if (reset === true) {
      // The close button doesn't need to be deleted since it never changes
      // The same happens with div.grid and div.grid-sizer
      // We only need to delete the div.grid-item elements
      if (this.grid !== undefined && this.grid !== null) {
        // If grid exists
        var tmpGridItems = this.grid.querySelectorAll("div.grid-item");
        if (
          tmpGridItems !== null &&
          tmpGridItems !== undefined &&
          tmpGridItems.length > 0
        ) {
          [].forEach.call(tmpGridItems, function(el) {
            el.remove();
          });
        }
      }
      if(this.debug){
        console.log("Reset done!");
      }
    }

    // If we could, we want to check if it has the class 'imagePopupWindow'
    // and if not, we want to add it
    if (
      this.imagePopupWindow.classList.contains("imagePopupWindow") === false
    ) {
      this.imagePopupWindow.className += "imagePopupWindow";
    }
    // Now we have to generate the close button (if it doesn't exist)
    this.closeButton = this.imagePopupWindow.querySelector("span.closeButton");
    if (this.closeButton === null) {
      this.closeButton = document.createElement("span");
      this.closeButton.className += "closeButton";
      var closeButtonIcon = document.createElement("i");
      // Uncomment this if you prefer the close button to use Font Awesome
      /*closeButtonIcon.className += "fas";
      closeButtonIcon.className += " fa-times";*/
      // And comment this line
      closeButtonIcon.className += "fi-xwluxl-times-wide";
      this.closeButton.appendChild(closeButtonIcon);
      this.imagePopupWindow.appendChild(this.closeButton);
    }
    // And the same with a div with the grid
    this.grid = this.imagePopupWindow.querySelector("div.grid");
    if (this.grid === null) {
      this.grid = document.createElement("div");
      this.grid.className += "grid";
      this.imagePopupWindow.appendChild(this.grid);
    }
    // Finally we have to create the 'grid-sizer' inside the last div we made
    // We don't check if div.grid query is null because we made it in the last line!
    this.gridSizer = this.grid.querySelector("div.grid-sizer");
    if (this.gridSizer === null) {
      this.gridSizer = document.createElement("div");
      this.gridSizer.className += "grid-sizer";
      this.grid.appendChild(this.gridSizer);
    }

    // We want to get the initial images we want in our picker
    // They are stored in the main div (this.imagePopupWindow)
    // In a data-path array
    this.images = JSON.parse(this.imagePopupWindow.getAttribute("data-path"));
    if (this.images === undefined || this.images.length <= 0) {
      if(this.debug){
        console.log("No initial images loaded!");
      }
      // And just to be sure we have no errors in the future...
      this.images = [];
    }

    // We have the option to set alt text for the images in our Image Picker
    // So we have to get them (they are stored in the main div in a data-alt array)
    // It is optional, so maybe it doesn't exist
    this.altImages = JSON.parse(this.imagePopupWindow.getAttribute("data-alt"));
    if (this.altImages === undefined || this.altImages.length <= 0) {
      if(this.debug){
        console.log("No initial alt images loaded!");
      }
      // And again, initialize the array just in case...
      this.altImages = [];
    }

    // Register the close button listener
    this.closeButton.parentClass = this; // A little trick to be able
    // to access this class functions from inside the event listener
    // function without having to use an instance var or singleton
    this.closeButton.addEventListener("click", function() {
      this.parentClass.closePopup();
    });

    // We have to be sure the image picker window is not visible when page is loaded
    // (It is already set in the CSS file so it wouldn't be necessary to code it here!)
    // this.imagePopupWindow.style.display = "none";

    // For every image in our images array, we have to add it to the grid as a HTML
    // img element
    for (var i = 0; i < this.images.length; i++) {
      // We just need to send the image path to this function and done!
      if (this.altImages.length > i) {
        // We have alt text for this image!
        this.addImage(this.images[i], this.altImages[i]);
      } else {
        // We don't have alt text for this image...
        this.addImage(this.images[i], ""); // I could set the second param as undefined or null too
      }
    }

    // Now we have to instantiate the Masonry class and configure it
    // I have done this configuration but there is a lot of options
    // You can check them in the website of the Masonry class creator;
    // https://masonry.desandro.com/
    this.masonry = new Masonry(this.grid, {
      itemSelector: ".grid-item",
      columnWidth: ".grid-sizer",
      percentPosition: true
    });

    // Once instantiated the Masonry class we have to use an instance
    // of the ImageLoaded class to correctly load the images
    // when using Masonry
    // (As explained by the ImageLoaded author here
    // https://imagesloaded.desandro.com/)
    this.imagesLoaded = imagesLoaded(this.grid);
    this.imagesLoaded.parentClass = this; // A little trick to be able
    // to access this class functions from inside the event listener
    // function without having to use an instance var or singleton
    this.imagesLoaded.on("progress", function() {
      // layout Masonry after each image loads
      this.parentClass.masonry.layout();
    });

    // Now we register the listeners in the images!
    this.registerClickListenerOnImages();
  }
}
