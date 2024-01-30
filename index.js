import {
  statuesCoords,
  entranceCenterCoords,
  spawnPointCoords,
  budhaCoords,
  jocondeCoords,
  criCoords,
} from "./coords.js";
import { association } from "./descriptions.js";

let camera = null;
setTimeout(() => {
  camera = document.getElementById("defaultView");
  camera.addEventListener("viewpointChanged", updatePosition, false);
}, 1000);
const description = document.getElementById("description");
const posIndicator = document.getElementById("minimap-indicator");

window.getMousePosOfElement = (evt) => {
  const rect = evt.target.getBoundingClientRect();
  const clickedCoords = {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
  // check if the click is inside any of the elements
  checkAndUpdateCamera(clickedCoords, entranceCenterCoords, "viewEntrance");
  checkAndUpdateCamera(clickedCoords, statuesCoords, "viewStatues");
  checkAndUpdateCamera(clickedCoords, budhaCoords, "viewBudha");
  checkAndUpdateCamera(clickedCoords, jocondeCoords, "viewJoconde");
  checkAndUpdateCamera(clickedCoords, criCoords, "viewCri");
  checkAndUpdateCamera(clickedCoords, spawnPointCoords, "defaultView");
};

window.showDescription = (name) => {
  const artDescription = association(name);
  if (!artDescription) return console.error("No description found");
  description.style.display = "flex";
  description.innerHTML = `
    <div class="description-container">
      <img class="preview-art" src="${artDescription.image}" alt="${artDescription.title}" onclick="window.open('${artDescription.image}', '_blank')"/>
      <p class="subtitle">${artDescription.artist}</p>
      <p class="subtitle subtitle-it">${artDescription.title}</p>
      <p class="subtitle">${artDescription.date}</p>
      <p class="subtitle">${artDescription.dimensions}</p>
      <p class="description-text">${artDescription.description}</p>
      <a href="${artDescription.url}" target="_blank">Plus d'informations</a>
      <button onclick="hideDescription()" class="button">
        <span class="X"></span>
        <span class="Y"></span>
        <div class="close">Fermer</div>
      </button>
    </div>
  `;
};

window.hideDescription = () => {
  description.style.display = "none";
};

function checkAndUpdateCamera(coords, elementCoords, cameraId) {
  if (
    coords.x >= elementCoords.x - elementCoords.size &&
    coords.x <= elementCoords.x + elementCoords.size &&
    coords.y >= elementCoords.y - elementCoords.size &&
    coords.y <= elementCoords.y + elementCoords.size
  ) {
    camera.removeEventListener("viewpointChanged", updatePosition, false);
    camera = document.getElementById(cameraId);
    camera.setAttribute("set_bind", "true");
    camera.addEventListener("viewpointChanged", updatePosition, false);
  }
}

let lastFunctionCall = Date.now();
function updatePosition(e) {
  if (!camera) return;
  if (Date.now() - lastFunctionCall < 200) return;
  lastFunctionCall = Date.now();
  const pos = e.position;
  const _2dPos = {
    x: pos.x * 2,
    y: pos.z * 2,
  };
  const finalX = _2dPos.x + spawnPointCoords.x;
  const finalY = _2dPos.y + spawnPointCoords.y;
  posIndicator.style = `
      position: absolute;
      top: ${finalY}px;
      left: ${finalX}px;
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
      z-index: 100;
  `;
}
