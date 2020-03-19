var imgUrl = null;
var JSONColours = [];
var ditoLogo = new Image();

$("#controls").keyup(function () {
    draw();
});

//creates list with possible gradients
$.getJSON(
    "https://raw.githubusercontent.com/ghosh/uiGradients/master/gradients.json",
    function (data) {
        JSONColours = data;
    }
);

ditoLogo.src =
    "http://www.ditonijmegen.nl/wp-content/uploads/2016/10/Dito-logo_uitgeknipt.png";

//makes sure the draw method is called after update, all the logic can be found there
$("#update").click(function (e) {
    draw();
});

$("#randomColor").click(function (e) {
    pickRandomColors();
    draw();
});
$(".color").colorPicker(); // that's it

document.getElementById("inp").onchange = function (e) {
    imgUrl = URL.createObjectURL(document.getElementById("inp").files[0]);
    draw();
};

//All logic is found in here
function draw() {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "none";

    var img = new Image();
    img.onload = function () {
    };
    img.onerror = failed;
    img.src = imgUrl;
    drawImageProp(ctx, img, 0, 0, canvas.width, canvas.height);

    drawgradient(ctx, canvas);
    writeText(ctx, canvas);

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = "18";
    ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

    //draw background image
    ctx.drawImage(
        ditoLogo,
        canvas.width / 2 - 75,
        canvas.height / 2 + 100,
        150,
        55
    );
    setTimeout(function () {
    }, 500);
    $("#dwn").attr(
        "href",
        document.getElementById("canvas").toDataURL("image/png")
    );
}

function failed() {
    console.error("The provided file couldn't be loaded as an Image media");
}

////GRADIENT//////////////////////////////
function drawgradient(ctx, canvas) {
    var lingrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);

    lingrad.addColorStop(0, $(".color1").val());
    lingrad.addColorStop(1, $(".color2").val());
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw3dText(context, text, x, y, textDepth, size = 70) {
    var n;
    context.font = "900 " + size + "px Montserrat";
    context.textAlign = "center";
    context.fillStyle = $(".accentcolor").val();
    context.strokeStyle = "black";
    context.lineWidth = "8";

    // draw bottom layers
    for (n = 0; n < textDepth; n++) {
        context.fillText(text, x, y + n);
        context.strokeText(text, x, y + n);
    }
    for (n = 0; n < textDepth; n++) {
        context.fillText(text, x, y + n);
    }

    context.fillStyle = "White";
    context.fillText(text, x, y);
}

function writeText(ctx, canvas) {
    var p1 = [
        [canvas.height / 2 - 110, 3, 30],
        [canvas.height / 2 - 20, 10, 60],
        [canvas.height / 2, 10, 60],
        [canvas.height / 2 + 55, 3, 30]
    ];
    var p2 = [
        [canvas.height / 2 - 130, 3, 30],
        [canvas.height / 2 - 60, 10, 60],
        [canvas.height / 2 + 20, 10, 60],
        [canvas.height / 2 + 75, 3, 30]
    ];

    var positions = p2;
    console.log($("input[name=main2]").val());
    if ($("input[name=main2]").val() == "") {
        positions = p1;
    }

    draw3dText(
        ctx,
        $("input[name=above]").val(),
        canvas.width / 2,
        positions[0][0],
        positions[0][1],
        positions[0][2]
    );

    draw3dText(
        ctx,
        $("input[name=main]").val(),
        canvas.width / 2,
        positions[1][0],
        positions[1][1],
        positions[1][2]
    );
    draw3dText(
        ctx,
        $("input[name=main2]").val(),
        canvas.width / 2,
        positions[2][0],
        positions[2][1],
        positions[2][2]
    );

    draw3dText(
        ctx,
        $("input[name=third]").val(),
        canvas.width / 2,
        positions[3][0],
        positions[3][1],
        positions[3][2]
    );
}

function pickRandomColors() {
    colorNumber = Math.floor(Math.random() * JSONColours.length) + 0;
    var c1 = hexToRgbA(JSONColours[colorNumber].colors[0], ".5");
    var c2 = hexToRgbA(JSONColours[colorNumber].colors[1], ".5");

    $(".color1").val(c1);
    $(".color2").val(c2);

    $(".color1").css("background", c1);
    $(".color2").css("background", c2);
}

/**
 * By Ken Fyrstenberg Nilsen
 *
 * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
 *
 * If image and context are only arguments rectangle will equal canvas
 */
function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r, // new prop. width
        nh = ih * r, // new prop. height
        cx,
        cy,
        cw,
        ch,
        ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

function hexToRgbA(hex, opacity) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        console.log(
            "rgba(" +
            [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
            "," +
            opacity +
            ")"
        );
        return (
            "rgba(" +
            [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
            "," +
            opacity +
            ")"
        );
    }
    throw new Error("Bad Hex");
}

$(document).ready(function () {
    pickRandomColors();
    setTimeout(function () {
        draw();
    }, 500);
});
