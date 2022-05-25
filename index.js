// PikCells Code Test Submission
//
// Kieran Armbrecht
// kieran.armbrecht@gmail.com
// 25/5/2022

// Code-Start -------------------------------------------------------------

// Set server data variables
const serverDataUrl = 'https://lab.pikcells.com/code-exercise/data.json'
const serverImageUrl = 'https://lab.pikcells.com/code-exercise/images/'

// Fetch the JSON data and populate the menu
async function fetchMenu() {
  // fetch the data
  const fetchURL = `${serverDataUrl}`
  const request = new Request(fetchURL)
  const response = await fetch(request)
  // parse the data
  const pikData = await response.json()
  // populate the menu
  populateMenu(pikData)
  // default config
  defaultConfig(pikData)
  // add event listeners
  loadListeners()
}
fetchMenu()

// Populate menu with JSON data
function populateMenu(pikData) {
  // Create the menu elements
  const menu = document.querySelector('.menu-container')
  const menuTitle = document.createElement('h1')
  const menuList = document.createElement('div')
  // Set the menu title and add classname
  menuTitle.textContent = 'Menu'
  menuList.classList.add('menu-list')
  // add elements to DOM
  menu.appendChild(menuTitle)
  menu.appendChild(menuList)
  // Loop through the layers adding data from server
  pikData.layers.forEach((layer) => {
    // sort data by order
    layer.items.sort((a, b) => a.order - b.order)
    // Create menu items for each item in the layer
    const layerList = document.createElement('div')
    const layerListItems = document.createElement('ul')
    // add classnames to elements
    layerList.classList.add('layer-list')
    layerList.classList.add(`layer-${layer.order}`)
    layerList.textContent = `Layer ${layer.order}`
    layerListItems.classList.add('layer-list-items')
    // add elements to DOM
    menuList.appendChild(layerList)
    layerList.appendChild(layerListItems)

    // Loop through the items in the layer and add data from server
    layer.items.forEach((item) => {
      // Create menu item for each item in the layer
      const itemList = document.createElement('li')
      // add classnames to elements
      itemList.classList.add('item-list')
      itemList.classList.add(`item-${item.order}`)
      // add data attributes from server data
      itemList.dataset.url = `${serverImageUrl}${item.imgSrc}`
      itemList.textContent = item.name
      // add elements to DOM
      layerListItems.appendChild(itemList)
    })
  })
}

// Default config from JSON data
function defaultConfig(pikData) {
  // select the DOM elements based on default config from server
  const layer0 = document.querySelector(
    `.layer-0 .layer-list-items .item-${pikData.default_configuration[0]}`
  )
  const layer1 = document.querySelector(
    `.layer-1 .layer-list-items .item-${pikData.default_configuration[1]}`
  )
  const layer2 = document.querySelector(
    `.layer-2 .layer-list-items .item-${pikData.default_configuration[2]}`
  )

  // add classnames to elements
  layer0.classList.add('active')
  layer1.classList.add('active')
  layer2.classList.add('active')

  // add selected images to array
  let imagesArray = [
    `${serverImageUrl}${pikData.layers[0].items[pikData.default_configuration[0]].imgSrc}`,
    `${serverImageUrl}${pikData.layers[1].items[pikData.default_configuration[1]].imgSrc}`,
    `${serverImageUrl}${pikData.layers[2].items[pikData.default_configuration[2]].imgSrc}`,
  ]
  // draw the canvas
  drawCanvas(imagesArray)
}

// Draw canvas with images from array
function drawCanvas(imagesArray) {
  // delete old download link
  const deleteOldLink = document.querySelector('.download-link')
  if (deleteOldLink) {
    deleteOldLink.remove()
  }

  // select the DOM elements
  const canvas = document.getElementById('imageCanvas')
  const context = canvas.getContext('2d')
  // set empty array
  let images = []
  // loop through the images array and add images to the array
  let loadCount = 0
  for (let i = 0; i < imagesArray.length; i++) {
    let img = new Image()
    img.crossOrigin = 'anonymous' // Set anon, else images become 'tainted'
    img.src = imagesArray[i]
    images.push(img)

    // add event listener to image
    img.onload = function () {
      if (++loadCount == imagesArray.length) {
        for (let i = 0; i < imagesArray.length; i++) {
          // set the canvas size to the image size and draw canvas
          context.drawImage(images[i], 0, 0, canvas.width, canvas.height)
        }
      }
    }
  }
  // Call download link as separate function to allow for async.
  // This make's sure image is ready before adding download link, else possible blank image.
  downloadPicture()
}

// Set global timeout variable so that it can be cancelled,
// else it is possible for many buttons to be appended.
let timeOut

// Add download image button
function downloadPicture() {
  // clear timeout
  window.clearTimeout(timeOut)
  // set timeout
  timeOut = setTimeout(function () {
    // select the DOM elements
    const canvas = document.getElementById('imageCanvas')
    const imageContainer = document.querySelector('.image-container')
    const download = document.createElement('a')
    // add classnames and props to elements
    download.classList.add('download-link')
    download.href = canvas.toDataURL('image/png')
    download.download = 'download.png'
    download.textContent = 'Save Image'
    // add elements to DOM
    imageContainer.appendChild(download)
  }, 1000)
}

// Menu event listeners
function loadListeners() {
  // select all the menu elements
  menuList = document.querySelectorAll('.item-list')
  // loop through the menu elements and add event listeners
  menuList.forEach((item) => {
    item.addEventListener('click', (e) => {
      const layer = item.parentElement.parentElement.classList[1]
      const layerList = document.querySelector(`.${layer}`)
      const layerListItems = layerList.querySelectorAll('.item-list')
      // remove active class from all items
      layerListItems.forEach((item) => {
        item.classList.remove('active')
      })
      // add active class to clicked item
      item.classList.add('active')

      // store the image urls from data attribute
      let layer0 = document.querySelector(`.layer-0 .item-list.active`)
      url1 = layer0.dataset.url
      let layer1 = document.querySelector(`.layer-1 .item-list.active`)
      url2 = layer1.dataset.url
      let layer2 = document.querySelector(`.layer-2 .item-list.active`)
      url3 = layer2.dataset.url

      // set the images array to the selected menu items
      imagesArray = [url1, url2, url3]
      // draw the canvas with new images
      drawCanvas(imagesArray)
    })
  })
}
