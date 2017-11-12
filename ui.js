
const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40

// Disable Three.js logs
console.log = function(){}; // noop

class CodeArtScene {
    constructor () {
        this.camera = null
        this.scene = null
        this.renderer = null
        this.controls = null
        this.box = null
        this.title = null
        this.subtitle = null
        this.email = null

        this.xMovement = -0.2
    }

    init () {
        // var geometry = new THREE.Geometry();
        // var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        // geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
        // geometry.vertices.push(new THREE.Vector3(0, 10, 0));
        // geometry.vertices.push(new THREE.Vector3(10, 0, 0));
        // scene.add( new THREE.Mesh( geometry, material ) )
        this._buildScene()
        this._buildCamera()
        this._buildRenderer()
        window.addEventListener( 'resize', this.onWindowResize.bind(this), false )
        this._configureControls()
    }

    _buildScene () {
        this.scene = new THREE.Scene()
        // this._buildBox()
        this._buildTitle()
        this._buildSubtitle()
        this._buildEmail()
        // this._buildAxes()
        this._buildLights()
    }

    _buildCamera () {
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000)
        this.camera.position.set(0, -20, 120)
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    }

    _buildLights () {
        //ambient light which is for the whole scene
        let ambientLight = new THREE.AmbientLight(0x00fff0, 0.5)
        ambientLight.castShadow = false
        this.scene.add(ambientLight)

        //spot light which is illuminating the chart directly
        let spotLight = new THREE.SpotLight(0x0000ff, 0.9)
        spotLight.castShadow = false
        spotLight.position.set(0,-40,100)
        this.scene.add(spotLight)
    }

    _buildRenderer () {
        this.renderer = new THREE.WebGLRenderer( { antialias: true } )
        this.renderer.setSize( window.innerWidth, window.innerHeight )
    }

    onKeyDown ( event ) {
        switch( event.keyCode ) {
            case KEY_LEFT: this.camera.position.x -= 2; break;
            case KEY_RIGHT: this.camera.position.x += 2; break;
            case KEY_DOWN: this.camera.position.y -= 2; break;
            case KEY_UP: this.camera.position.y += 2; break;
        }
    }

    _configureControls () {
        this.controls = new THREE.OrbitControls(this.camera)
        this.controls.target.set( 0, 0, 0 )

        this.controls.keys = [ KEY_LEFT, KEY_UP, KEY_RIGHT, KEY_DOWN ]
        document.addEventListener( 'keydown', this.onKeyDown.bind(this), false )
    }

    _buildBox () {
        var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 )
        var material = new THREE.MeshNormalMaterial({ lights: true })
        this.box = new THREE.Mesh( geometry, material )
        this.scene.add(this.box)
    }

    _buildTitle () {
        var loader = new THREE.FontLoader()
        loader.load( 'Virgo 01_Regular.json', ( font ) => {
            var material = new THREE.MeshPhongMaterial()
            material.lights = true
            // material.flashShading = true
            material.wireframe = true
            var geometry = new THREE.TextGeometry( 'CodeArt', {
                font: font,
                size: 20,
                height: 10,
                curveSegments: 10,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 5,
                bevelSegments: 5
            } )
            this.title = new THREE.Mesh( geometry, material )
            this.title.position.set(-50, 0, 0)
            this.scene.add(this.title)
        } )
    }

    _buildSubtitle () {
        var loader = new THREE.FontLoader()
        loader.load( 'Virgo 01_Regular.json', ( font ) => {
            var material = new THREE.MeshPhongMaterial()
            material.lights = true
            // material.flashShading = true
            // material.wireframe = true
            var geometry = new THREE.TextGeometry( 'IT Services', {
                font: font,
                size: 8,
                height: 5,
                curveSegments: 10,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 5,
                bevelSegments: 5
            } )
            this.subtitle = new THREE.Mesh( geometry, material )
            this.subtitle.position.set(-50, -20, 0)
            this.scene.add(this.subtitle)
        } )
    }

    _buildEmail () {
        var loader = new THREE.FontLoader()
        loader.load( 'Virgo 01_Regular.json', ( font ) => {
            var material = new THREE.MeshPhongMaterial()
            material.lights = true
            // material.flashShading = true
            // material.wireframe = true
            var geometry = new THREE.TextGeometry( 'contact(at)codeart.io', {
                font: font,
                size: 6,
                height: 5,
                curveSegments: 10,
                bevelEnabled: false,
                bevelThickness: 10,
                bevelSize: 5,
                bevelSegments: 5
            } )
            this.email = new THREE.Mesh( geometry, material )
            this.email.position.set(-50, -35, 0)
            this.scene.add(this.email)
        } )
    }

    _buildAxis( src, dst, colorHex, dashed ) {
        var geom = new THREE.Geometry(), mat;

        if(dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push( src.clone() )
        geom.vertices.push( dst.clone() )
        geom.computeLineDistances() // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        var axis = new THREE.Line( geom, mat, THREE.LineSegments )
        return axis
    }

    _buildAxes () {
        var length = 100
        var axes = new THREE.Object3D()
        axes.add(this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ) // +X
        axes.add(this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ) // -X
        axes.add(this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ) // +Y
        axes.add(this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ) // -Y
        // axes.add(this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ) // +Z
        // axes.add(this._buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ) // -Z
        this.scene.add(axes)
    }

    animate () {
        this.controls.update()
        requestAnimationFrame(this.animate.bind(this))
        if (this.box) {
            this.box.rotation.x += 0.01
            this.box.rotation.y += 0.02
        }

        if (this.title && this.title.position.x < -100) {
            this.xMovement = 0.2
        } else if (this.title && this.title.position.x > 10) {
            this.xMovement = -0.2
        }
        if (this.title) this.title.position.x += this.xMovement
        if (this.subtitle) this.subtitle.position.x += this.xMovement
        if (this.email) this.email.position.x += this.xMovement

        this.camera.position.z += 0.02
        this.renderer.render(this.scene, this.camera)
    }

    onWindowResize () {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize( window.innerWidth, window.innerHeight )
    }
}

var scene = new CodeArtScene()
scene.init()
if (Detector.webgl) {
    document.body.appendChild(scene.renderer.domElement)
    scene.animate()
} else {
    var warning = Detector.getWebGLErrorMessage()
    document.getElementById('container').appendChild(warning)
}

