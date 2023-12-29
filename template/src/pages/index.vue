<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { prepareRender, drawCommands, cameras, controls, entitiesFromSolids } from '@jscad/regl-renderer';
  import { drawing } from './drawing';
  import {
  extrusions,
  transforms,
  } from '@jscad/modeling';
  import axios from 'axios';

  const { rotateX, rotateY, rotateZ } = transforms;
  const { project } = extrusions;

  // the heart of rendering, as themes, controls, etc change
  let updateView = true;

  const uiState = ref<{
    gridOn?: boolean;
    axisOn?: boolean;
    projectEntities?: boolean;
    rotateEntitiesX?: boolean;
    rotateEntitiesY?: boolean;
    rotateEntitiesZ?: boolean;
  }>({});

  uiState.value = localStorage.getItem('uiState') ? JSON.parse(localStorage.getItem('uiState') || '{}') : {};

  const saveUiState = () => {
    localStorage.setItem('uiState', JSON.stringify(uiState.value));
  };

  const toggleGrid = () => {
    uiState.value.gridOn = !uiState.value.gridOn;
    updateView = true;
    saveUiState();
  }

  const toggleAxis = () => {
    uiState.value.axisOn = !uiState.value.axisOn;
    updateView = true;
    saveUiState();
  }

  const toggleProjection = () => {
    uiState.value.projectEntities = !uiState.value.projectEntities;
    entities = entitiesFromSolids({}, ...[postProcess(drawing({ scale: 1 }))].flat());
    updateView = true;
    saveUiState();
  }

  const toggleRotateX = () => {
    uiState.value.rotateEntitiesX = !uiState.value.rotateEntitiesX;
    entities = entitiesFromSolids({}, ...[postProcess(drawing({ scale: 1 }))].flat())
    updateView = true;
    saveUiState();
  }

  const toggleRotateY = () => {
    uiState.value.rotateEntitiesY = !uiState.value.rotateEntitiesY;
    entities = entitiesFromSolids({}, ...[postProcess(drawing({ scale: 1 }))].flat())
    updateView = true;
    saveUiState();
  }

  const toggleRotateZ = () => {
    uiState.value.rotateEntitiesZ = !uiState.value.rotateEntitiesZ;
    entities = entitiesFromSolids({}, ...[postProcess(drawing({ scale: 1 }))].flat())
    updateView = true;
    saveUiState();
  }

  const postProcess = (entities: any) => {
    let finalEntities = entities;

    if (uiState.value.rotateEntitiesX) {
      finalEntities = rotateX(Math.PI / 2, finalEntities);
    }

    if (uiState.value.rotateEntitiesY) {
      finalEntities = rotateY(Math.PI / 2, finalEntities);
    }

    if (uiState.value.rotateEntitiesZ) {
      finalEntities = rotateZ(Math.PI / 2, finalEntities);
    }

    if (uiState.value.projectEntities) {
      finalEntities = project({}, finalEntities);
    }

    return finalEntities;
  }

  let entities = entitiesFromSolids({}, ...[postProcess(drawing({ scale: 1 }))].flat());

  const export3mf = () => {
    axios.post('/api/export/3mf/');
  };

  const exportX3d = () => {
    axios.post('/api/export/x3d/');
  };

  const exportSvg = () => {
    axios.post('/api/export/svg/', uiState.value);
  };

  onMounted(
    () => {
      const perspectiveCamera = cameras.perspective;
      const orbitControls = controls.orbit;

      const containerElement = document.getElementById("drawing") as HTMLDivElement;

      const width = containerElement.clientWidth;
      const height = containerElement.clientHeight;

      const state: {
        camera?: any;
        controls?: any;
      } = localStorage.getItem('savedState') ? JSON.parse(localStorage.getItem('savedState') || '{}') : {};

      const saveState = () => {
        localStorage.setItem('savedState', JSON.stringify(state));
      };

      // prepare the camera
      if (!state.camera) {
        state.camera = Object.assign({}, perspectiveCamera.defaults);
      }
      perspectiveCamera.setProjection(
        state.camera,
        state.camera,
        { width, height },
      );
      perspectiveCamera.update(state.camera, state.camera);

      // prepare the controls
      if (!state.controls) {
        state.controls = orbitControls.defaults;
      }

      // prepare the renderer
      const renderer = prepareRender(
        {
          glOptions: {
            container: containerElement,
          },
        }
      );

      const gridOptions = () => ({
        visuals: {
          drawCmd: 'drawGrid',
          show: uiState.value.gridOn,
        },
        size: [500, 500],
        ticks: [100, 10],
        color: [0, 0, 1, 0.5],
        subColor: [0, 0, 1, 0.25],
      });

      const axisOptions = () => ({
        visuals: {
          drawCmd: 'drawAxis',
          show: uiState.value.axisOn,
        },
        size: 150,
        // alwaysVisible: false,
        // xColor: [0, 0, 1, 1],
        // yColor: [1, 0, 1, 1],
        // zColor: [0, 0, 0, 1],
      });

      // assemble the options for rendering
      const renderOptions = () => ({
        camera: state.camera,
        drawCommands: {
          drawAxis: drawCommands.drawAxis,
          drawGrid: drawCommands.drawGrid,
          drawLines: drawCommands.drawLines,
          drawMesh: drawCommands.drawMesh,
        },
        rendering: {
          background: [0, 0, 0, 1],
          lightDirection: [0.0, 0.0, 1.0],
          lightPosition: [100.0, 100.0, 100.0],
          ambientLightAmount: 0.5,
          diffuseLightAmount: 0.0,
          specularLightAmount: 0.0,
          materialShininess: 1.0,
        },
        // define the visual content
        entities: [
          ...entities,
          axisOptions(),
          gridOptions(),
        ],
      });

      // convert HTML events (mouse movement) to viewer changes
      let lastX = 0;
      let lastY = 0;

      const rotateSpeed = 0.002;
      const panSpeed = 1;
      const zoomSpeed = 0.08;

      let savedPosition: any = {};

      if (localStorage.getItem('savedPosition')) {
        savedPosition = JSON.parse(localStorage.getItem('savedPosition') || '{}');
      }

      let rotateDelta = savedPosition.rotateDelta || [0, 0];
      let panDelta = savedPosition.panDelta || [0, 0];
      let zoomDelta = savedPosition.zoomDelta || 0;
      let pointerDown = false;

      const doRotatePanZoom = () => {
        if (rotateDelta[0] || rotateDelta[1]) {
          const updated = orbitControls.rotate(
            {
              controls: state.controls,
              camera: state.camera,
              speed: rotateSpeed
            },
            rotateDelta,
          );
          state.controls = { ...state.controls, ...updated.controls };
          updateView = true;
          rotateDelta = [0, 0];
        }

        if (panDelta[0] || panDelta[1]) {
          const updated = orbitControls.pan(
            {
              controls: state.controls,
              camera:state.camera,
              speed: panSpeed,
            },
            panDelta,
          );
          state.controls = { ...state.controls, ...updated.controls };
          panDelta = [0, 0];
          state.camera.position = updated.camera.position;
          state.camera.target = updated.camera.target;
          updateView = true;
        }

        if (zoomDelta) {
          const updated = orbitControls.zoom(
            {
              controls: state.controls,
              camera:state.camera,
              speed: zoomSpeed,
            },
            zoomDelta,
          );
          state.controls = { ...state.controls, ...updated.controls };
          zoomDelta = 0;
          updateView = true;
        }
      }

      const updateAndRender = (_: number) => {
        doRotatePanZoom();

        if (updateView) {
          const updates = orbitControls.update(
            {
              controls: state.controls,
              camera: state.camera,
            },
          );
          state.controls = { ...state.controls, ...updates.controls };
          updateView = state.controls.changed; // for elasticity in rotate / zoom

          state.camera.position = updates.camera.position;
          perspectiveCamera.update(state.camera);

          renderer(renderOptions());
          saveState();
        }
        window.requestAnimationFrame(updateAndRender);
      }

      window.requestAnimationFrame(updateAndRender);

      const moveHandler = (ev: PointerEvent) => {
        if (!pointerDown) return;

        const dx = lastX - ev.pageX;
        const dy = ev.pageY - lastY;

        const shiftKey = (ev.shiftKey === true);

        if (shiftKey) {
          panDelta[0] += dx;
          panDelta[1] += dy;
        } else {
          rotateDelta[0] -= dx;
          rotateDelta[1] -= dy;
        }

        lastX = ev.pageX;
        lastY = ev.pageY;

        ev.preventDefault();
      }
      const downHandler = (ev: PointerEvent) => {
        pointerDown = true;
        lastX = ev.pageX;
        lastY = ev.pageY;
        containerElement.setPointerCapture(ev.pointerId);
      }

      const upHandler = (ev: PointerEvent) => {
        pointerDown = false;
        containerElement.releasePointerCapture(ev.pointerId);
      }

      const wheelHandler = (ev: WheelEvent) => {
        zoomDelta += ev.deltaY;
        ev.preventDefault();
      }

      containerElement.onpointermove = moveHandler;
      containerElement.onpointerdown = downHandler;
      containerElement.onpointerup = upHandler;
      containerElement.onwheel = wheelHandler;
    }
  );
</script>

<template>
  <div id="drawing" class="w-full h-full"></div>
  <div class="absolute top-2 right-2 dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm btn-outline btn-primary bg-base-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" fill="currentColor"></path></svg>
    </div>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 w-52 border border-primary text-primary">
      <li>
        <a v-on:click="toggleGrid" class="flex">
          <span class="flex-1">Grid</span>
          <input type="checkbox" class="toggle toggle-primary" v-model="uiState.gridOn">
        </a>
      </li>
      <li>
        <a v-on:click="toggleAxis" class="flex">
          <span class="flex-1">Axis</span>
          <input type="checkbox" class="toggle toggle-primary" v-model="uiState.axisOn">
        </a>
      </li>
      <li>
        <a v-on:click="toggleProjection" class="flex">
          <span class="flex-1">Projection</span>
          <input type="checkbox" class="toggle toggle-primary" v-model="uiState.projectEntities">
        </a>
      </li>
      <li>
        <a v-on:click="toggleRotateX" class="flex">
          <span class="flex-1">Rotate X</span>
          <input type="checkbox" class="toggle toggle-primary" v-model="uiState.rotateEntitiesX">
        </a>
      </li>
      <li>
        <a v-on:click="toggleRotateY" class="flex">
          <span class="flex-1">Rotate Y</span>
          <input type="checkbox" class="toggle toggle-primary" v-model="uiState.rotateEntitiesY">
        </a>
      </li>
      <li>
        <a v-on:click="toggleRotateZ" class="flex">
          <span class="flex-1">Rotate Z</span>
          <input type="checkbox" class="toggle toggle-primary" v-model="uiState.rotateEntitiesZ">
        </a>
      </li>
      <li>
        <div class="divider"></div>
      </li>
      <li>
        <a v-on:click="export3mf" class="flex">
          <span class="flex-1">Export 3MF</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24"><path d="M22 4C22 3.44772 21.5523 3 21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4ZM4 15H7.41604C8.1876 16.7659 9.94968 18 12 18C14.0503 18 15.8124 16.7659 16.584 15H20V19H4V15ZM4 5H20V13H15C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13H4V5ZM16 11H13V14H11V11H8L12 6.5L16 11Z" fill="currentColor"></path></svg>
        </a>
      </li>
      <li>
        <a v-on:click="exportX3d" class="flex">
          <span class="flex-1">Export X3D</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24"><path d="M22 4C22 3.44772 21.5523 3 21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4ZM4 15H7.41604C8.1876 16.7659 9.94968 18 12 18C14.0503 18 15.8124 16.7659 16.584 15H20V19H4V15ZM4 5H20V13H15C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13H4V5ZM16 11H13V14H11V11H8L12 6.5L16 11Z" fill="currentColor"></path></svg>
        </a>
      </li>
      <li>
        <a v-on:click="exportSvg" class="flex">
          <span class="flex-1">Export SVG</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24"><path d="M22 4C22 3.44772 21.5523 3 21 3H3C2.44772 3 2 3.44772 2 4V20C2 20.5523 2.44772 21 3 21H21C21.5523 21 22 20.5523 22 20V4ZM4 15H7.41604C8.1876 16.7659 9.94968 18 12 18C14.0503 18 15.8124 16.7659 16.584 15H20V19H4V15ZM4 5H20V13H15C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13H4V5ZM16 11H13V14H11V11H8L12 6.5L16 11Z" fill="currentColor"></path></svg>
        </a>
      </li>
    </ul>
  </div>
</template>
