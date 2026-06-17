/**
 * 3D Robot Character for Patient Screen — robot_playground.glb
 *
 * Features:
 * - Full skeleton with 112 joints (arms, legs, fingers, antenna, neck)
 * - Built-in "Experiment" animation (265 channels)
 * - Expression bones: eye, eyeClose, eyeSmile, mouth, smile, o, close
 * - Holographic floating decorations
 *
 * States:
 * - idle:      slow animation, gentle sway, normal eyes + smile
 * - listening: attentive lean, antenna wiggle, kawaii eyes
 * - speaking:  head nod, arm gestures, mouth cycle (talking), expressive
 */

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MODEL_URL = "/static/assets/robot_playground.glb";

export class PatientRobot {
  constructor(container) {
    this.container = container;
    this.state = "idle";
    this.clock = new THREE.Clock();
    this.model = null;
    this.mixer = null;
    this.mainAction = null;
    this.ready = false;

    // Named skeleton joints for direct control
    this.bones = {};
    // Named scene nodes (face expressions, body parts)
    this.nodes = {};
    // Holo group
    this.holoGroup = null;
    // Bot geometry group
    this.botGeo = null;

    // State timing
    this._stateTime = 0;
    this._mouthCycleIdx = 0;
    this._mouthTimer = 0;
    this._prevState = "idle";

    // Base bone quaternions (snapshot after bind pose)
    this._baseBones = {};

    this._initScene();
    this._loadModel();
    this._animate = this._animate.bind(this);
    this._animate();
    this._onResize = this._onResize.bind(this);
    window.addEventListener("resize", this._onResize);
  }

  /* ─── Scene Setup ─── */
  _initScene() {
    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 500;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 200);
    this.camera.position.set(0, 1.6, 6.5);
    this.camera.lookAt(0, 0.6, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;
    this.container.appendChild(this.renderer.domElement);

    // Warm ambient
    this.scene.add(new THREE.AmbientLight(0xfff5e6, 0.9));

    // Key light
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 6, 5);
    this.scene.add(key);

    // Fill light
    const fill = new THREE.DirectionalLight(0xc4e0ff, 0.5);
    fill.position.set(-4, 3, -2);
    this.scene.add(fill);

    // Rim / back light
    const rim = new THREE.DirectionalLight(0xffd4a0, 0.35);
    rim.position.set(0, 4, -5);
    this.scene.add(rim);
  }

  /* ─── Model Load ─── */
  _loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        this.model = gltf.scene;

        // Scale & center
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.2 / maxDim;
        this.model.scale.setScalar(scale);
        this.model.position.set(
          -center.x * scale,
          -center.y * scale - 0.3,
          -center.z * scale
        );

        // Traverse and collect nodes + bones
        this.model.traverse((child) => {
          if (child.name) {
            this.nodes[child.name] = child;
          }
          if (child.isBone) {
            this.bones[child.name] = child;
          }
        });

        // Setup animation mixer
        this.mixer = new THREE.AnimationMixer(this.model);
        if (gltf.animations.length > 0) {
          this.mainAction = this.mixer.clipAction(gltf.animations[0]);
          this.mainAction.play();
          this.mainAction.timeScale = 0.4; // idle = slow
        }

        // Store base bone rotations (after first frame)
        this.mixer.update(0);
        for (const [name, bone] of Object.entries(this.bones)) {
          this._baseBones[name] = bone.quaternion.clone();
        }

        // Setup initial expression
        this._setExpression("normal");

        this.scene.add(this.model);
        this.ready = true;
        console.log("[PatientRobot] Model loaded.",
          "Bones:", Object.keys(this.bones).length,
          "Nodes:", Object.keys(this.nodes).length
        );
      },
      (progress) => {
        if (progress.total) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          console.log(`[PatientRobot] Loading: ${pct}%`);
        }
      },
      (error) => {
        console.error("[PatientRobot] Load error:", error);
      }
    );
  }

  /* ─── Expression System ─── */
  // Expression nodes under "face" (node 141):
  //   Right eye: eye (normal), eyeClose, eyeSmile, eyeCloseKawaii
  //   Mouth: smile (normal), happy, o, close
  //   Left eye (group34): eye1, eyeClose1, eyeSmile1, eyeCloseKawaii1
  //
  // Expression bones under Head_M_033:
  //   eye_050, eyeClos_051, eyeClosKawai_052, eyeClosHappy_053
  //   mouth_054, mouthClos_055, mouthClosKawai_056, mouthClosHappy_057
  //   eyeL_058, eyeLClos_059, eyeLClosKawai_060, eyeLClosHappy_061

  _setExpression(expr) {
    // Expression bone sets: move the active one to visible position (scale=1)
    // and hide others (scale=0)
    const eyeR = ["eye_050", "eyeClos_051", "eyeClosKawai_052", "eyeClosHappy_053"];
    const eyeL = ["eyeL_058", "eyeLClos_059", "eyeLClosKawai_060", "eyeLClosHappy_061"];
    const mouth = ["mouth_054", "mouthClos_055", "mouthClosKawai_056", "mouthClosHappy_057"];

    // Also show/hide the face geometry nodes
    const faceEyeR = ["eye", "eyeClose", "eyeSmile", "eyeCloseKawaii"];
    const faceEyeL = ["eye1", "eyeClose1", "eyeSmile1", "eyeCloseKawaii1"];
    const faceMouth = ["smile", "close", "happy", "o"];

    let activeEyeR, activeEyeL, activeMouth;
    let faceActiveEyeR, faceActiveEyeL, faceActiveMouth;

    switch (expr) {
      case "normal":
        activeEyeR = "eye_050";
        activeEyeL = "eyeL_058";
        activeMouth = "mouth_054";
        faceActiveEyeR = "eye";
        faceActiveEyeL = "eye1";
        faceActiveMouth = "smile";
        break;
      case "kawaii":
        activeEyeR = "eyeClosKawai_052";
        activeEyeL = "eyeLClosKawai_060";
        activeMouth = "mouthClosKawai_056";
        faceActiveEyeR = "eyeCloseKawaii";
        faceActiveEyeL = "eyeCloseKawaii1";
        faceActiveMouth = "happy";
        break;
      case "happy":
        activeEyeR = "eyeClosHappy_053";
        activeEyeL = "eyeLClosHappy_061";
        activeMouth = "mouthClosHappy_057";
        faceActiveEyeR = "eyeSmile";
        faceActiveEyeL = "eyeSmile1";
        faceActiveMouth = "happy";
        break;
      case "talking_open":
        activeEyeR = "eye_050";
        activeEyeL = "eyeL_058";
        activeMouth = "mouth_054";
        faceActiveEyeR = "eye";
        faceActiveEyeL = "eye1";
        faceActiveMouth = "o";
        break;
      case "talking_close":
        activeEyeR = "eye_050";
        activeEyeL = "eyeL_058";
        activeMouth = "mouthClos_055";
        faceActiveEyeR = "eye";
        faceActiveEyeL = "eye1";
        faceActiveMouth = "close";
        break;
      case "blink":
        activeEyeR = "eyeClos_051";
        activeEyeL = "eyeLClos_059";
        activeMouth = "mouth_054";
        faceActiveEyeR = "eyeClose";
        faceActiveEyeL = "eyeClose1";
        faceActiveMouth = "smile";
        break;
      default:
        return;
    }

    // Toggle bone scales
    const toggleBones = (list, active) => {
      for (const name of list) {
        const bone = this.bones[name];
        if (bone) {
          if (name === active) {
            bone.scale.set(1, 1, 1);
          } else {
            bone.scale.set(0, 0, 0);
          }
        }
      }
    };

    // Toggle face node visibility
    const toggleNodes = (list, active) => {
      for (const name of list) {
        const node = this.nodes[name];
        if (node) {
          node.visible = (name === active);
        }
      }
    };

    toggleBones(eyeR, activeEyeR);
    toggleBones(eyeL, activeEyeL);
    toggleBones(mouth, activeMouth);
    toggleNodes(faceEyeR, faceActiveEyeR);
    toggleNodes(faceEyeL, faceActiveEyeL);
    toggleNodes(faceMouth, faceActiveMouth);
  }

  /* ─── State Management ─── */
  setState(newState) {
    if (this.state === newState) return;
    this._prevState = this.state;
    this.state = newState;
    this._stateTime = 0;
    this._mouthCycleIdx = 0;
    this._mouthTimer = 0;

    // Adjust animation speed per state
    if (this.mainAction) {
      switch (newState) {
        case "idle":
          this.mainAction.timeScale = 0.4;
          this._setExpression("normal");
          break;
        case "listening":
          this.mainAction.timeScale = 0.25;
          this._setExpression("kawaii");
          break;
        case "speaking":
          this.mainAction.timeScale = 0.7;
          this._setExpression("normal");
          break;
      }
    }
    console.log(`[PatientRobot] State → ${newState}`);
  }

  /* ─── Animation Loop ─── */
  _animate() {
    requestAnimationFrame(this._animate);
    const dt = this.clock.getDelta();
    const t = this.clock.getElapsedTime();

    if (!this.ready || !this.model) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    this._stateTime += dt;

    // Update the built-in animation
    if (this.mixer) {
      this.mixer.update(dt);
    }

    // Layer extra movements on top
    switch (this.state) {
      case "idle":
        this._overlayIdle(t, dt);
        break;
      case "listening":
        this._overlayListening(t, dt);
        break;
      case "speaking":
        this._overlaySpeaking(t, dt);
        break;
    }

    // Natural blink cycle (every ~4-6 seconds)
    this._handleBlink(t);

    this.renderer.render(this.scene, this.camera);
  }

  /* ─── Blink ─── */
  _blinkUntil = 0;
  _nextBlinkAt = 3;

  _handleBlink(t) {
    if (this.state === "speaking") return; // speaking has its own mouth cycle

    if (t > this._nextBlinkAt && t > this._blinkUntil) {
      this._blinkUntil = t + 0.15; // blink duration
      this._nextBlinkAt = t + 3 + Math.random() * 4; // next blink
      this._setExpression("blink");
    }
    if (t > this._blinkUntil && this._blinkUntil > 0) {
      // Restore expression after blink
      if (this.state === "listening") {
        this._setExpression("kawaii");
      } else {
        this._setExpression("normal");
      }
      this._blinkUntil = 0;
    }
  }

  /* ─── Idle overlay ─── */
  _overlayIdle(t, dt) {
    // Gentle floating
    if (this.model) {
      this.model.position.y += Math.sin(t * 0.6) * 0.0005;
    }
    // Gentle head sway
    const head = this.bones["Head_M_033"];
    if (head) {
      const q = new THREE.Quaternion();
      q.setFromEuler(new THREE.Euler(
        Math.sin(t * 0.3) * 0.03,
        Math.sin(t * 0.2) * 0.04,
        Math.sin(t * 0.25) * 0.02
      ));
      head.quaternion.multiply(q);
    }
  }

  /* ─── Listening overlay ─── */
  _overlayListening(t, dt) {
    const st = this._stateTime;

    // Slight lean forward (attentive)
    const spine = this.bones["Spine1_M_01"];
    if (spine) {
      const q = new THREE.Quaternion();
      q.setFromEuler(new THREE.Euler(0.06, 0, 0));
      spine.quaternion.multiply(q);
    }

    // Head tilt (curious)
    const head = this.bones["Head_M_033"];
    if (head) {
      const q = new THREE.Quaternion();
      q.setFromEuler(new THREE.Euler(
        0.04 + Math.sin(st * 1.0) * 0.03,
        Math.sin(st * 0.6) * 0.05,
        Math.sin(st * 0.8) * 0.04
      ));
      head.quaternion.multiply(q);
    }

    // Antenna extra wiggle (like receiving signal)
    const antNames = [
      "antenne_01_Bnd_3_jnt_037",
      "antenne_02_Bnd_3_jnt_042",
      "antenne_03_Bnd_3_jnt_047"
    ];
    antNames.forEach((name, i) => {
      const bone = this.bones[name];
      if (bone) {
        const q = new THREE.Quaternion();
        const phase = i * 2.1;
        q.setFromEuler(new THREE.Euler(
          Math.sin(st * 3.0 + phase) * 0.12,
          0,
          Math.sin(st * 2.5 + phase) * 0.1
        ));
        bone.quaternion.multiply(q);
      }
    });

    // Gentle floating
    if (this.model) {
      this.model.position.y += Math.sin(t * 0.7) * 0.0004;
    }
  }

  /* ─── Speaking overlay ─── */
  _overlaySpeaking(t, dt) {
    const st = this._stateTime;

    // Head nodding
    const head = this.bones["Head_M_033"];
    if (head) {
      const q = new THREE.Quaternion();
      q.setFromEuler(new THREE.Euler(
        Math.sin(st * 2.5) * 0.08 + Math.sin(st * 1.3) * 0.04,
        Math.sin(st * 1.8) * 0.06,
        Math.sin(st * 1.0) * 0.03
      ));
      head.quaternion.multiply(q);
    }

    // Mouth cycle: open → close → open → ... (talking)
    this._mouthTimer += dt;
    const mouthSpeed = 0.15 + Math.random() * 0.05; // vary speed
    if (this._mouthTimer > mouthSpeed) {
      this._mouthTimer = 0;
      this._mouthCycleIdx = (this._mouthCycleIdx + 1) % 3;
      const mouthExprs = ["talking_open", "talking_close", "normal"];
      this._setExpression(mouthExprs[this._mouthCycleIdx]);
    }

    // Right arm gesture
    const shoulderR = this.bones["Shoulder_R_04"];
    if (shoulderR) {
      const q = new THREE.Quaternion();
      q.setFromEuler(new THREE.Euler(
        Math.sin(st * 1.5) * 0.15,
        0,
        Math.sin(st * 2.0) * 0.1 - 0.1
      ));
      shoulderR.quaternion.multiply(q);
    }

    // Left arm slight movement
    const shoulderL = this.bones["Shoulder_L_063"];
    if (shoulderL) {
      const q = new THREE.Quaternion();
      q.setFromEuler(new THREE.Euler(
        Math.sin(st * 1.2 + 1.0) * 0.08,
        0,
        Math.sin(st * 1.6) * 0.06 + 0.05
      ));
      shoulderL.quaternion.multiply(q);
    }

    // Body slight bounce
    if (this.model) {
      this.model.position.y += Math.abs(Math.sin(st * 2.8)) * 0.001;
    }

    // Antenna energetic
    const antTips = [
      "antenne_01_Bnd_4_jnt_038",
      "antenne_02_Bnd_4_jnt_043",
      "antenne_03_Bnd_4_jnt_048"
    ];
    antTips.forEach((name, i) => {
      const bone = this.bones[name];
      if (bone) {
        const q = new THREE.Quaternion();
        const phase = i * 1.8;
        q.setFromEuler(new THREE.Euler(
          Math.sin(st * 4.0 + phase) * 0.15,
          0,
          Math.sin(st * 3.5 + phase) * 0.12
        ));
        bone.quaternion.multiply(q);
      }
    });
  }

  /* ─── Resize ─── */
  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  /* ─── Cleanup ─── */
  dispose() {
    window.removeEventListener("resize", this._onResize);
    if (this.mixer) this.mixer.stopAllAction();
    if (this.renderer) this.renderer.dispose();
    if (this.model) {
      this.model.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
    }
  }
}

// Expose globally
window.PatientRobot = PatientRobot;
