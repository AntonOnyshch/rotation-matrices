window.rotateCoords = {
    cvs: undefined,
    ctx: undefined,
    centerXInput: undefined,
    centerYInput: undefined,
    centerX: 250,
    centerY: 250,
    angleX: 0,
    angleY: 0,
    angleZ: 0,
    angleXText: undefined,
    angleYText: undefined,
    angleZText: undefined,
    radianK: Math.PI / 180,
    cosX: 0,
    sinX: 0,
    cosY: 0,
    sinY: 0,
    cosZ: 0,
    sinZ: 0,
    xRotationM: [
        [1, 0, 0],
        [0, this.cosX, this.sinX],
        [0, -this.sinX, this.cosX]
    ],
    yRotationM: [
        [this.cosY, 0, -this.sinY],
        [0, 1, 0],
        [this.sinY, 0, this.cosY],
    ],
    zRotationM: [
        [this.cosZ, this.sinZ, 0],
        [-this.sinZ, this.cosZ, 0],
        [0, 0, 1]
    ],
    threePlaneVertices: [
        //Coronal
        [-100, -100, 0],
        [100, -100, 0],
        [-100, 100, 0],

        [100, -100, 0],
        [100, 100, 0],
        [-100, 100, 0],

        //Saggital
        [0, -100, -100],
        [0, -100, 100],
        [0, 100, -100],

        [0, -100, 100],
        [0, 100, 100],
        [0, 100, -100],

        //Axial
        [-100, 0, -100],
        [100, 0, -100],
        [-100, 0, 100],

        [100, 0, -100],
        [100, 0, 100],
        [-100, 0, 100],
    ],
    init: function() {
        this.initCenterCoords();
        this.initAngles();
        this.initCanvas();
    },

    initCenterCoords: function() {
        window.document.getElementById("centerXInput").onchange = (e) => {
            this.centerX = parseInt(e.target.value);
            this.draw();
        };
        window.document.getElementById("centerYInput").onchange = (e) => {
            this.centerY = parseInt(e.target.value);
            this.draw();
        };
    },
    initAngles: function() {
        this.angleXText = window.document.getElementById("angleXText");
        this.angleYText = window.document.getElementById("angleYText");
        this.angleZText = window.document.getElementById("angleZText");

        window.document.getElementById("AngleXInput").oninput = (e) => {
            this.angleX = parseInt(e.target.value);
            this.angleXText.textContent = this.angleX;

            const cosX = Math.cos(this.angleX * this.radianK);
            const sinX = Math.sin(this.angleX * this.radianK);
            this.xRotationM = [
                [1, 0, 0],
                [0, cosX, sinX],
                [0, -sinX, cosX]
            ]
            this.draw();
        }
        window.document.getElementById("AngleYInput").oninput = (e) => {
            this.angleY = parseInt(e.target.value);
            this.angleYText.textContent = this.angleY;

            const cosY = Math.cos(this.angleY * this.radianK);
            const sinY = Math.sin(this.angleY * this.radianK);
            this.yRotationM = [
                [cosY, 0, -sinY],
                [0, 1, 0],
                [sinY, 0, cosY],
            ]
            this.draw();
        }
        window.document.getElementById("AngleZInput").oninput = (e) => {
            this.angleZ = parseInt(e.target.value);
            this.angleZText.textContent = this.angleZ;

            const cosZ = Math.cos(this.angleZ * this.radianK);
            const sinZ = Math.sin(this.angleZ * this.radianK);
            this.zRotationM = [
                [cosZ, sinZ, 0],
                [-sinZ, cosZ, 0],
                [0, 0, 1]
            ]
            this.draw();
        }
    },
    initCanvas: function() {
        this.cvs = window.document.getElementById("canvas");
        this.ctx = this.cvs.getContext("2d", {alpha: false});
        this.ctx.fillStyle = "green";
        this.ctx.strokeStyle = "green";
    },
    draw: function() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.drawPlanes();
    },
    drawPlanes: function() {
        const v = this.threePlaneVertices;

        //Coronal plane
        this.ctx.fillStyle = '#008c44ca';
        this.drawTriangle(this.rotate(v[0]), this.rotate(v[1]), this.rotate(v[2]));
        this.drawTriangle(this.rotate(v[3]), this.rotate(v[4]), this.rotate(v[5]));

        //Saggital plane
        this.ctx.fillStyle = '#ac3335ca';
        this.drawTriangle(this.rotate(v[6]), this.rotate(v[7]), this.rotate(v[8]));
        this.drawTriangle(this.rotate(v[9]), this.rotate(v[10]), this.rotate(v[11]));

        //Axial plane
        this.ctx.fillStyle = '#1c254dca';
        this.drawTriangle(this.rotate(v[12]), this.rotate(v[13]), this.rotate(v[14]));
        this.drawTriangle(this.rotate(v[15]), this.rotate(v[16]), this.rotate(v[17]));
    },
    rotate: function(xyz) {
        let newXYZ = new Int32Array(xyz);

        if(this.angleZ !== 0) {
            newXYZ = this.multiplyMatrix(newXYZ, this.zRotationM);
        }
        if(this.angleX !== 0) {
            newXYZ = this.multiplyMatrix(newXYZ, this.xRotationM);
        }
        if(this.angleY !== 0) {
            newXYZ = this.multiplyMatrix(newXYZ, this.yRotationM);
        }
        return newXYZ;
    },
    multiplyMatrix: function(m1, m2) {
        const mRes = new Int32Array(m1.length);

        mRes[0] = m1[0] * m2[0][0] + m1[1] * m2[0][1] + m1[2] * m2[0][2];
        mRes[1] = m1[0] * m2[1][0] + m1[1] * m2[1][1] + m1[2] * m2[1][2];
        mRes[2] = m1[0] * m2[2][0] + m1[1] * m2[2][1] + m1[2] * m2[2][2];

        return mRes;
    },
    drawTriangle: function (a, b, c) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX + a[0], this.centerY + a[1]);
        this.ctx.lineTo(this.centerX + b[0], this.centerY + b[1]);
        this.ctx.lineTo(this.centerX + c[0], this.centerY + c[1]);
        this.ctx.fill();
    }
}

window.rotateCoords.init();
window.rotateCoords.draw();