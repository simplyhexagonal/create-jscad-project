<script setup lang="ts">
import {
  defineProps,
  computed,
  reactive,
  ref,
  watch,
  defineEmits,
} from 'vue';
import { Parameter, GroupParameter, ValueParameter } from './parameters';

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  ] : null;
};

// Define props to receive the array of parameters
const props = defineProps({
  parameters: {
    type: Array as () => Parameter[],
    required: true
  }
});

// Computed property to organize parameters into groups
const groupedParameters = computed(() => {
  const groups: { caption: string, parameters: Parameter[] }[] = [];
  let currentGroup: { caption: string, parameters: Parameter[] } = { caption: '', parameters: [] };

  props.parameters.forEach(param => {
    if (param.type === 'group') {
      if (currentGroup.parameters.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = { caption: (param as GroupParameter).caption, parameters: [] };
    } else {
      currentGroup.parameters.push(param);
    }
  });

  if (currentGroup.parameters.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
});

const hidden = ref(
  new Array(
    groupedParameters.value.length
  ).fill(
    groupedParameters.value.length > 1
  )
);

if (groupedParameters.value.length > 1) {
  hidden.value[0] = false;
}

const toggleHidden = (index: number) => {
  hidden.value[index] = !hidden.value[index];
};

const params = reactive(
  props.parameters.filter(
    ({type}) => type !== 'group'
  ).reduce((acc, param) => {
    acc[(param as ValueParameter).name] = (param as ValueParameter).initial || null;
    return acc;
  }, {} as Record<string, unknown>)
);

const fixColorParams = (originalParams: Record<string, unknown>) => {
  const paramsToFix = {...originalParams};

  return props.parameters.filter(
    ({type}) => type !== 'group'
  ).reduce((acc, param) => {
    if (param.type === 'color') {
      //console.log(acc[(param as ValueParameter).name]);
      const rgb = hexToRgb(acc[(param as ValueParameter).name] as string || '#000000');
      acc[(param as ValueParameter).name] = rgb;
    }
    return acc;
  }, paramsToFix);
};

watch(params, (newParams) => {
  emit('update', fixColorParams(newParams));
});

const emit = defineEmits(['update']);

emit('update', fixColorParams(params));
</script>

<template>
  <div
    class="p-2"
    v-for="(group, index) in groupedParameters" :key="index"
  >
    <h3
      class="text-lg/loose font-bold uppercase text-primary cursor-pointer flex items-center"
      v-if="group.caption"
      @click="toggleHidden(index)"
    >
      <span class="block w-8">
        <svg v-if="hidden[index]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z" fill="currentColor"></path></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z" fill="currentColor"></path></svg>
      </span>
      <span class="block flex-1">
        {{ group.caption }}
      </span>
    </h3>
    <div :class="(hidden[index]) ? 'hidden h-0' : ''">
      <div v-for="param in group.parameters" :key="param.name">
        <!-- Text Input -->
        <div class="param" v-if="param.type === 'text'">
          <label :for="param.name">{{ param.caption }}</label>
          <input 
            type="text"
            :id="param.name"
            :name="param.name"
            v-model="params[param.name]"
          />
        </div>

        <!-- Checkbox -->
        <div class="param" v-if="param.type === 'checkbox'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="checkbox"
            :id="param.name"
            :name="param.name"
            :checked="param.checked"
            class="checkbox"
            v-model="params[param.name]"
          />
        </div>

        <!-- Color Picker -->
        <div class="param" v-if="param.type === 'color'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="color"
            :id="param.name"
            :name="param.name"
            v-model="params[param.name]"
          />
        </div>

        <!-- Date Picker -->
        <div class="param" v-if="param.type === 'date'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="date"
            :id="param.name"
            :name="param.name"
            v-model="params[param.name]"
          />
        </div>

        <!-- Email Input -->
        <div class="param" v-if="param.type === 'email'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="email"
            :id="param.name"
            :name="param.name"
            v-model="params[param.name]"
          />
        </div>

        <!-- Number Input for Float -->
        <div class="param" v-if="param.type === 'float' || param.type === 'number'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="number"
            :id="param.name"
            :name="param.name"
            :step="param.step"
            v-model="params[param.name]"
          />
        </div>

        <!-- Number Input for Int -->
        <div class="param" v-if="param.type === 'int'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="number"
            :id="param.name"
            :name="param.name"
            :step="param.step"
            v-model="params[param.name]"
          />
        </div>

        <!-- Password Input -->
        <div class="param" v-if="param.type === 'password'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="password"
            :id="param.name"
            :name="param.name"
            v-model="params[param.name]"
          />
        </div>

        <!-- Slider -->
        <div class="param" v-if="param.type === 'slider'">
          <label :for="param.name">{{ param.caption }}</label>
          <div class="flex items-center">
            <div class="flex-1">
              <input
                type="range"
                :id="param.name"
                :name="param.name"
                :min="param.min"
                :max="param.max"
                :step="param.step"
                class="range"
                v-model="params[param.name]"
              />
            </div>
            <div class="block flex-none mx-2">
              <input
                type="number"
                :step="param.step"
                v-model="params[param.name]"
                class="w-16"
              />
            </div>
          </div>
        </div>

        <!-- URL Input -->
        <div class="param" v-if="param.type === 'url'">
          <label :for="param.name">{{ param.caption }}</label>
          <input
            type="url"
            :id="param.name"
            :name="param.name"
            v-model="params[param.name]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.param {
  @apply mb-2;
}

label {
  @apply block font-bold mb-1;
}

input:not([type='range']) {
  @apply block rounded-full border border-gray-300 px-2;
}

input[type='range'] {
  @apply block rounded-full border border-transparent;
}
</style>
