//var debug = false;
//var every_svg = [];

export function camData(numberValue , color) {
  let out = `<svg id="viewboxid${numberValue}" class="viewbox" viewBox="0 0 400 400" width="400" height="400"><radialGradient id="grad${numberValue}" cx="50%" cy="50%"><stop offset="0%" stop-color="${color}" stop-opacity="1" /><stop offset="100%" stop-color="gold" stop-opacity="0" /></radialGradient><defs><mask id="Mask${numberValue}"><path id="sector${numberValue}" fill-rule="evenodd" fill="white" /></mask></defs><rect x="0" y="0" width="400" height="400" fill="url(#grad${numberValue})" mask="url(#Mask${numberValue})" /></svg><svg class="point" viewBox="0 0 400 400" width="400" height="400"><circle cx="200" cy="200" r="25" fill="${color}" /></svg><svg class="dragicon" viewBox="0 0 400 400" width="400" height="400"><g transform="translate(184,186)" fill="white"><circle cx="16" cy="20" r="2" /><g><path d="M30.7,10c0.6-1.8,0.4-3.9-0.8-5.6C29.7,4.2,29.4,4,29.1,4H2.9C2.6,4,2.3,4.2,2.1,4.4C1,6.1,0.7,8.2,1.3,10H30.7z" /><path d="M3,16c0,7.2,5.8,13,13,13s13-5.8,13-13v-4H3V16z M24,14h2c0.6,0,1,0.4,1,1s-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1S23.4,14,24,14z M16,14c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S12.7,14,16,14z"/></g></g></svg>`;
  return out;
}

//export function debug_toggle() {
//  debug = document.getElementById("debug").checked;
//  every_svg = document.getElementsByTagName("svg");
//  if (debug == true) {
//    for (var i = 0; i < every_svg.length; i++) {
//      every_svg[i].style.border = "1px black solid";
//    }
//  } else {
//    for (var i = 0; i < every_svg.length; i++) {
//      every_svg[i].style.border = "none";
//    }
//  }
//}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

var cam_fov_default = 90;

function get_cam_fov() {
  var cam_fov_current = document.getElementById("fovSlider").value;
  if (cam_fov_current !== undefined && cam_fov_current >= 1 && cam_fov_current < 360) {
    var cam_fov = cam_fov_current;
  } else {
    var cam_fov = cam_fov_default;
  }
  return cam_fov;
}

//var sector = document.getElementById("sector");

export function draw(numberId, defVaule) {
  var opts = undefined;
  if (defVaule === true) {
    opts = {
      cx: 200,
      cy: 200,
      radius: 200,
      start_angle: -45,
      end_angle: 45,
    };
  } else {
    opts = {
      cx: 200,
      cy: 200,
      radius: 200,
      start_angle: -(get_cam_fov() / 2),
      end_angle: (get_cam_fov() / 2),
    };
  }

  var start = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.end_angle)
  var end = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.start_angle)
  var largeArcFlag = opts.end_angle - opts.start_angle <= 180 ? "0" : "1";

  var d = [
    "M", start.x, start.y,
    "A", opts.radius, opts.radius, 0, largeArcFlag, 0, end.x, end.y,
    "L", opts.cx, opts.cy,
    "Z"
  ].join(" ");

  let sector = document.getElementById(`sector${numberId}`);
  sector.setAttribute("d", d);
};

export function redraw(cam_id) {
  let sector = document.getElementById(`sector${cam_id}`);
  sector.removeAttribute("d");
  draw(cam_id);
}

//var viewbox = document.getElementsByClassName("viewbox")[0];
//var cam_rot_deg_cur = 0;

export function rotate_cam(deg, source, id) {
  var viewbox = document.getElementById(`viewboxid${id}`)
  var cam_rot_deg_new = source + deg;
  viewbox.style.transform = 'rotate(' + cam_rot_deg_new + 'deg)';
}

//window.onload = function () {
//  draw("cam01");
//};
