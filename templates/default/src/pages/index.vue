<script setup lang="ts">
  import {
    onMounted,
    ref,
  } from 'vue';
  import {
    prepareRender,
    drawCommands,
    cameras,
    controls,
    entitiesFromSolids,
  } from '@jscad/regl-renderer';
  import {
    extrusions,
    transforms,
  } from '@jscad/modeling';
  import axios from 'axios';

  import {
    main,
    getParameterDefinitions,
  } from './design';

  import MainMenu from '../components/MainMenu/index.vue';
  import { UiState } from '../components/MainMenu/ui-state';
  import Parameters from '../components/Parameters/index.vue';

  const { rotateX, rotateY, rotateZ } = transforms;
  const { project } = extrusions;

  const appendExtension = (fileName: string, extension: string) => {
    if (fileName.toLowerCase().endsWith(extension)) {
      return fileName;
    }

    return `${fileName}.${extension}`;
  };

  // the heart of rendering, as themes, controls, etc change
  let updateView = true;

  const uiState = ref<UiState>({
    gridOn: true,
    axisOn: true,
  });

  uiState.value = localStorage.getItem('uiState') ? JSON.parse(localStorage.getItem('uiState') || JSON.stringify(uiState.value)) : uiState.value;

  const exportName = ref('design');
  const exporting = ref(false);
  const exportError = ref('');
  const exportModalVisible = ref(false);

  const showExportModal = () => {
    exportModalVisible.value = true;

    // focuse export modal
    setTimeout(() => {
      const exportNameInput = document.getElementById('exportName') as HTMLInputElement;
      exportNameInput.focus();
    }, 100);
  };

  const hideExportModal = () => {
    exportModalVisible.value = false;
    exportError.value = '';
  };

  const params = ref({});
  params.value = localStorage.getItem('params') ? JSON.parse(localStorage.getItem('params') || JSON.stringify(params.value)) : params.value;

  const saveUiState = () => {
    localStorage.setItem('uiState', JSON.stringify(uiState.value));
    localStorage.setItem('params', JSON.stringify(params.value));
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
    entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat());
    updateView = true;
    saveUiState();
  }

  const toggleRotateX = () => {
    uiState.value.rotateEntitiesX = !uiState.value.rotateEntitiesX;
    entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat())
    updateView = true;
    saveUiState();
  }

  const toggleRotateY = () => {
    uiState.value.rotateEntitiesY = !uiState.value.rotateEntitiesY;
    entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat())
    updateView = true;
    saveUiState();
  }

  const toggleRotateZ = () => {
    uiState.value.rotateEntitiesZ = !uiState.value.rotateEntitiesZ;
    entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat())
    updateView = true;
    saveUiState();
  }

  const resetViewport = () => {
    localStorage.removeItem('params');
    localStorage.removeItem('uiState');
    localStorage.removeItem('savedState');
    localStorage.removeItem('savedPosition');
    window.location.reload();
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

  let entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat());

  const export3mf = () => {
    if (!exporting.value){
      exportError.value = '';
      exporting.value = true;

      const options = {
        ...params.value,
        ...uiState.value,
        exportName: appendExtension(exportName.value, '3mf'),
      };

      axios.post(
        '/api/export/3mf/',
        options,
      ).catch(
        (error) => {
          exportError.value = error.response?.data?.message || error.message || error;
        }
      ).finally(
        () => exporting.value = false,
      );
    }
  };

  const exportX3d = () => {
    if (!exporting.value){
      exportError.value = '';
      exporting.value = true;

      const options = {
        ...params.value,
        ...uiState.value,
        exportName: appendExtension(exportName.value, 'x3d'),
      };

      axios.post(
        '/api/export/x3d/',
        options,
      ).catch(
        (error) => {
          exportError.value = error.response?.data?.message || error.message || error;
        }
      ).finally(
        () => exporting.value = false,
      );
    }
  };

  const exportSvg = () => {
    if (!exporting.value){
      exportError.value = '';
      exporting.value = true;

      const options = {
        ...params.value,
        ...uiState.value,
        exportName: appendExtension(exportName.value, 'svg'),
      };

      axios.post(
        '/api/export/svg/',
        options,
      ).catch(
        (error) => {
          exportError.value = error.response?.data?.message || error.message || error;
        }
      ).finally(
        () => exporting.value = false,
      );
    }
  };

  onMounted(
    () => {
      const perspectiveCamera = cameras.perspective;
      const orbitControls = controls.orbit;

      const containerElement = document.getElementById("design") as HTMLDivElement;

      let width = containerElement.clientWidth;
      let height = containerElement.clientHeight;

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

      window.addEventListener('resize', () => {
        width = containerElement.clientWidth;
        height = containerElement.clientHeight;

        perspectiveCamera.setProjection(
          state.camera,
          state.camera,
          { width, height },
        );
        perspectiveCamera.update(state.camera, state.camera);

        entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat());
        updateView = true;
      });
    }
  );

  const onParamChange = (paramValues: any) => {
    params.value = paramValues;

    entities = entitiesFromSolids({}, ...[postProcess(main(params.value))].flat());
    updateView = true;
    saveUiState();
  };
</script>

<template>
  <div id="design" class="w-full h-full"></div>
  <div class="absolute bottom-2 left-2 dropdown dropdown-top">
    <div tabindex="0" role="button" class="btn btn-sm btn-outline btn-primary bg-base-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" fill="currentColor"></path></svg>
    </div>
    <div tabindex="0" class="overflow-y-auto dropdown-content z-[1] shadow bg-base-100 p-2 w-max border border-primary">
      <Parameters
        :parameterDefinitions="getParameterDefinitions()"
        :params="params"
        v-on:update="onParamChange"
      />
    </div>
  </div>
  <div class="absolute top-2 right-2 dropdown dropdown-end">
    <div tabindex="0" role="button" class="btn btn-sm btn-outline btn-primary bg-base-100">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z" fill="currentColor"></path></svg>
    </div>
    <MainMenu
      :toggleGrid="toggleGrid"
      :toggleAxis="toggleAxis"
      :toggleProjection="toggleProjection"
      :toggleRotateX="toggleRotateX"
      :toggleRotateY="toggleRotateY"
      :toggleRotateZ="toggleRotateZ"
      :showExportModal="showExportModal"
      :resetViewport="resetViewport"
      :uiState="uiState"
    />
  </div>
  <div v-if="exportModalVisible" class="absolute top-0 left-0 right-0 bottom-0 grid items-center justify-center">
    <div class="p-2 shadow bg-base-100 border border-primary">
      <label for="exportName">Export file name:</label>
      <input
        class="w-full p-2 my-2"
        type="text"
        id="exportName"
        name="exportName"
        v-model="exportName"
      />
      <div v-if="exportError" class="text-error">
        Error: {{ exportError }}
      </div>
      <div v-if="!exporting" class="flex gap-4">
        <a v-on:click="export3mf" class="btn btn-primary btn-outline">
          <span class="flex-1">Export 3MF</span>
        </a>
        <a v-on:click="exportX3d" class="btn btn-primary btn-outline">
          <span class="flex-1">Export X3D</span>
        </a>
        <a v-on:click="exportSvg" class="btn btn-primary btn-outline">
          <span class="flex-1">Export SVG</span>
        </a>
        <a v-on:click="hideExportModal" class="btn btn-neutral btn-outline ml-4">
          <span class="flex-1">Close</span>
        </a>
      </div>
      <div v-else class="flex gap-4 items-center justify-center">
        <span class="loading loading-spinner loading-sm"></span>
        <span class="p-4">Exporting...</span>
      </div>
    </div>
  </div>
</template>
