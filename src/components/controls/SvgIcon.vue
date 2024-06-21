<template>
    <inline-svg
        :src="require(`@/assets/img/svg/${name}.svg`)"
        :fill="fill"
        :stroke="stroke"
        :rect="rect"
        class="svg svg-content"
        :style="{
            '--svg-fill-color': fill,
            '--svg-stroke-color': stroke,
            '--svg-rect-color': rect
        }"
        @click="callback($event)"
    />
</template>

<script>
import InlineSvg from 'vue-inline-svg';

export default {
  components: {
    InlineSvg
  },
  props: {
    name: {
      type: String,
      default: 'image'
    },
    fill: {
      type: String,
      default: 'none'
    },
    stroke: {
      type: String,
      default: 'none'
    },
    rect: {
      type: String,
      default: 'none'
    }
  },
  methods: {
    callback: function (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss">
.svg-content[fill]:not([fill="none"]) path{
  fill: var(--svg-fill-color);
}

.svg-content[stroke]:not([stroke="none"]) path{
  stroke: var(--svg-stroke-color);
}

.svg-content[rect]:not([rect="none"]) rect{
  stroke: var(--svg-rect-color);
}
</style>