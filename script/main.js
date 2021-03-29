"use strict";

import {draw, redraw, camData, rotate_cam} from './camDraw.js';

document.getElementById("input_confirm").addEventListener('click', () => {

  let drawData = [
    {id: 1, type: "camera", color: "green"},
    {id: 2, type: "camera", color: "crimson"},
  ];

  let file = document.getElementById("input").value.substr(12);
  let olddiv = document.getElementById("load");
  let newdiv = document.createElement("div");

  let image = document.createElement("img");
  image.src = file;
  image.setAttribute("class","imageBack");

  let sideMenudiv = document.createElement("div");
  sideMenudiv.setAttribute("class", "sideMenu");
  sideMenudiv.setAttribute("id", "sideMenudiv");

  let maindiv = document.createElement("div");
  maindiv.setAttribute("class", "main");
  maindiv.setAttribute("id", "maindiv");

  newdiv.appendChild(sideMenudiv);
  newdiv.appendChild(maindiv);
  maindiv.appendChild(image);

  olddiv.remove();
  document.body.appendChild(newdiv);

  let marginpx = 0;
  for (let i = 0; i < drawData.length; i++) {
    sideMenudiv.innerHTML += `<svg id="icon${i+1}" class="svgSideMenu" viewBox="0 0 200 200"><circle id="circle${i+1}" cx="100" cy="100" r="80" fill="${drawData[i]["color"]}"/></svg>`;
    document.getElementById(`icon${i+1}`).style = `margin-top: ${marginpx}`;
    marginpx += 200;
    let sideMenuContecstDiv = document.createElement("div");
    sideMenuContecstDiv.setAttribute("class", "contectsMenuOfBalls");
    sideMenuContecstDiv.setAttribute("id", `menu${i+1}`);
    let closebtn = document.createElement("div");
    closebtn.setAttribute("class", "closebtn");
    closebtn.setAttribute("id", `close${i+1}`);
    sideMenuContecstDiv.appendChild(closebtn);
    newdiv.appendChild(sideMenuContecstDiv);
  }

  let saveButton = document.createElement("button");
  saveButton.setAttribute("class", "saveButtonClass");
  saveButton.setAttribute("id", "saveButton");
  saveButton.innerHTML = "Сохранить";
  maindiv.appendChild(saveButton);

  let counterDivSideMenu = 0;
  let posData = [];

  let backDarkDiv = document.createElement("div");
  backDarkDiv.setAttribute("class", "darkback");
  backDarkDiv.setAttribute("id", "darkbackdiv");
  let infoDiv = document.createElement("div");
  infoDiv.setAttribute("class", "info");
  infoDiv.setAttribute("id", "infoDiv");


  for (let i = 0; i < drawData.length; i++) {
    document.getElementById(`icon${i+1}`).addEventListener("click", () => {
      let getColor = document.getElementById(`circle${i+1}`).getAttribute("fill");
      let draggablediv = undefined;
      counterDivSideMenu++;
      let ballid = counterDivSideMenu;
      let isCam = undefined;
      if (drawData[i]["type"] === "camera") {
        isCam = true;
        draggablediv = document.createElement("div");
        draggablediv.setAttribute("class", `draggable ${getColor}`);
        draggablediv.setAttribute("id", `ballElem${counterDivSideMenu}`);
        draggablediv.style = "left: 600px; top: 400px; width: 400px; height: 400px;";
        draggablediv.innerHTML = camData(counterDivSideMenu, getColor);
        maindiv.appendChild(draggablediv);
        draw(ballid, true);
        draggablediv.addEventListener('contextmenu', ev => {
          ev.preventDefault();
          let divNO = document.createElement("div");
          divNO.setAttribute("id", "divNO");
          let rotateButtonR = document.createElement("button");
          rotateButtonR.innerHTML = "Повернуть ->";
          rotateButtonR.setAttribute("id", "rotateR");
          let rotateButtonL = document.createElement("button");
          rotateButtonL.innerHTML = "<- Повернуть";
          rotateButtonL.setAttribute("id", "rotateL");
          let exitRotateButton = document.createElement("button");
          exitRotateButton.innerHTML = "Выйти";
          exitRotateButton.setAttribute("id", "rotateExit");
          let fovSlider = document.createElement("input");
          fovSlider.setAttribute("type", "range");
          fovSlider.setAttribute("min", "1");
          fovSlider.setAttribute("max", "359");
          fovSlider.setAttribute("value", "90");
          fovSlider.setAttribute("id", "fovSlider");
          let valueOutput = document.createElement("p");
          valueOutput.setAttribute("id", "valueOutput");
          valueOutput.innerHTML = "90";

          fovSlider.oninput = function() {
            valueOutput.innerHTML = this.value;
            redraw(ballid);
          }

          divNO.appendChild(rotateButtonL);
          divNO.appendChild(rotateButtonR);
          divNO.appendChild(exitRotateButton);
          divNO.appendChild(fovSlider);
          divNO.appendChild(valueOutput);
          document.body.appendChild(divNO);

          exitRotateButton.addEventListener("click", () => {
            divNO.remove();
          });

          rotateButtonR.addEventListener("click", () => {
            rotate_cam(5, posData[ballid-1]["rotation"], ballid);
            posData[ballid-1]["rotation"] += 5;
          });
          rotateButtonL.addEventListener("click", () => {
            rotate_cam(-5, posData[ballid-1]["rotation"], ballid);
            posData[ballid-1]["rotation"] -= 5;
          });
        });
      } else {
        draggablediv = document.createElement("div");
        draggablediv.setAttribute("class", `draggable ${getColor}`);
        draggablediv.setAttribute("id", `ballElem${counterDivSideMenu}`);
        draggablediv.style = `border-radius: 50%; left: 200px; background-color: ${getColor}; width: 50px; height: 50px; position: absolute;`;
        maindiv.appendChild(draggablediv);
      }

      let toList = document.createElement("div");
      toList.setAttribute("id", `ball${counterDivSideMenu}`);
      toList.setAttribute("class", "tableManagment");
      let circleIcon = document.createElement("div");
      circleIcon.setAttribute("class", `ballIcon`);
      circleIcon.style = `background-color: ${getColor}`;
      let textCircle = document.createElement("p");
      textCircle.setAttribute("class", "textCirclep");
      toList.appendChild(textCircle);
      toList.appendChild(circleIcon);
      document.getElementById(`menu${i+1}`).appendChild(toList);

      function appData(idNumber, color, isCam) {
        let x = document.getElementById(`ballElem${idNumber}`).style.top;
        let y = document.getElementById(`ballElem${idNumber}`).style.left;
        let type = drawData[i]["type"];
        let appDataMass = {
          id: `ballElem${idNumber}`,
          color: color,
          name: `ball${idNumber}`,
          xy: [x, y],
          rotation: "No rotation",
          fov: "No FOV",
          type: type
        };
        if (isCam === true) {
          appDataMass["rotation"] = 0;
          appDataMass["fov"] = 90;
        }
        return appDataMass;
      }

      posData.push(appData(counterDivSideMenu, getColor, isCam));
      textCircle.innerHTML = posData[ballid-1]["name"];

      toList.onmouseover = () => {
        document.getElementById("ballElem" + toList.getAttribute("id").substr(4)).style.opacity = 0.5;
      }
      toList.onmouseout = () => {
        document.getElementById("ballElem" + toList.getAttribute("id").substr(4)).style.opacity = 1;
      }

      toList.addEventListener("click", () => {
        document.body.appendChild(backDarkDiv);
        let infoExit = document.createElement("div");
        infoExit.setAttribute("class", "infoExit");
        infoExit.setAttribute("id", "infoExitButton");
        infoDiv.appendChild(infoExit);
        document.body.appendChild(infoDiv);
        let ballName = document.createElement("p");
        ballName.setAttribute("class", "ballNamep");
        ballName.innerHTML = `Имя: ${posData[ballid-1]["name"]}`;
        let ballColor = document.createElement("p");
        ballColor.setAttribute("class", "ballColorp");
        ballColor.innerHTML = `Цвет: ${getColor}`;
        let ballPosition = document.createElement("p");
        ballPosition.setAttribute("class", "ballPositionp");
        ballPosition.innerHTML = "Позиция: X(" + posData[ballid-1]["xy"][0] + ") Y(" + posData[ballid-1]["xy"][1] + ")";
        let ballRotation = document.createElement("p");
        ballRotation.setAttribute("class", "ballRotation");
        ballRotation.innerHTML = "Градус вращения: " + posData[ballid-1]["rotation"];
        let ballfov = document.createElement("p");
        ballfov.setAttribute("class", "ballfov");
        ballfov.innerHTML = "FOV: " + posData[ballid-1]["fov"];
        let balltype = document.createElement("p");
        balltype.setAttribute("class", "balltype");
        balltype.innerHTML = "Тип: " + posData[ballid-1]["type"];
        let editName = document.createElement("button");
        editName.setAttribute("id", "editNameButton");
        editName.setAttribute("class", "editName");
        editName.innerHTML = "Изменить";

//        editName.addEventListener("click", () => {
//
//        });

        let deleteBall = document.createElement("button");
        deleteBall.setAttribute("id", "deleteBallButton");
        deleteBall.setAttribute("class", "deleteBall");
        deleteBall.innerHTML = "Удалить";

      /*  deleteBall.addEventListener("click", () => {
          backDarkDiv.remove();
          infoDiv.remove();
          ballName.remove();
          ballColor.remove();
          ballPosition.remove();
          deleteBall.remove();
          editName.remove();
          infoExit.remove();
          document.getElementById(`ball${ballid}`).remove();
          document.getElementById(`ballElem${ballid}`).remove();
          posData.splice(ballid-1, 1);
          console.log(posData);
        });*/

        infoDiv.appendChild(ballName);
        infoDiv.appendChild(ballColor);
        infoDiv.appendChild(ballPosition);
        infoDiv.appendChild(editName);
        infoDiv.appendChild(deleteBall);
        infoDiv.appendChild(balltype);
        infoDiv.appendChild(ballRotation);
        infoDiv.appendChild(ballfov);

        infoExitButton.addEventListener("click", () => {
          backDarkDiv.remove();
          infoDiv.remove();
          ballName.remove();
          ballColor.remove();
          ballPosition.remove();
          deleteBall.remove();
          editName.remove();
          infoExit.remove();
          balltype.remove();
          ballRotation.remove();
          ballfov.remove();
        });
      });

      draggablediv.onmousedown = function(e) {
        draggablediv.style.position = 'absolute';
        moveAt(e);
        document.body.appendChild(draggablediv);
        draggablediv.style.zIndex = 1000;
        function moveAt(e) {
          draggablediv.style.left = e.pageX - draggablediv.offsetWidth / 2 + 'px';
          draggablediv.style.top = e.pageY - draggablediv.offsetHeight / 2 + 'px';
        }
        document.onmousemove = function(e) {
          moveAt(e);
        }
        draggablediv.onmouseup = function() {
          document.onmousemove = null;
          draggablediv.onmouseup = null;
        }
      }
    });
    document.getElementById(`icon${i+1}`).addEventListener('contextmenu', ev => {
      ev.preventDefault();
      document.getElementById(`menu${i+1}`).style.display = "block";
    });
    document.getElementById(`close${i+1}`).addEventListener('click', () => {
      document.getElementById(`menu${i+1}`).style.display = "none";
    });
  }

  function posDataUpdate () {
    for (let i = 0; i < posData.length; i++) {
      let x = document.getElementById(posData[i]["id"]).style.top;
      let y = document.getElementById(posData[i]["id"]).style.left;
      let mass = [x, y];
      posData[i]["xy"] = mass;
    }
    console.log("Update!");
  }

  let updater = setInterval(posDataUpdate, 1000);

  saveButton.addEventListener("click", () => {
    console.log(posData);
  });
});
