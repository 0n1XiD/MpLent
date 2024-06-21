<template>
    <button
        class="btn"
        :class="setClass"
        :type="type"
        :disabled="disabled"
        @click="callback($event)"
    >
        <slot v-if="image">
            <img
                class="btn__image"
                :src="image"
                :alt="image.replace(/^.*[\/\\]| \(\d+\)\.\w+$/g, '')"
            >
        </slot>
        <slot>
            {{ name }}
        </slot>
    </button>
</template>

<script>

export default {
  name: 'ButtonCustom',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    image: {
      type: String,
      default: null
    },
    // Button types
    purple: {
      type: Boolean,
      default: false
    },
    pink: {
      type: Boolean,
      default: false
    },
    purpleLight: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    setClass () {
      const typeBtn = this.purple
        ? 'purple'
        : this.pink
          ? 'pink'
          : this.purpleLight
            ? 'purpleLight'
            : ''
      return 'btn_' + typeBtn
    }
  },
  methods: {
    callback: function (e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
    font-family: var(--font-family);
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    border: none;
    padding: 0 12px;
    width: fit-content;
    height: 40px;
    border-radius: 5px;
    font-weight: var(--font-weight-extrabold);
    font-size: 15px;
    line-height: normal;
    transition: all 0.5 ease-in;
    background: var(--bg-third);
    color: var(--text-active-color);
    min-width: fit-content;
    &:hover {
      opacity: 0.8;
      cursor: pointer;
      transition: all 0.5 ease-in;
    }
  
    &:focus {
      outline: none;
    }
  
    &:active {
      opacity: 1;
    }

    &__image{
      width: 24px;
      height: 24px;
      margin-right: 12px;
    }

    &_purple{
        background: var(--bg-third);
    }

    &_pink{
        background: var(--bg-secondary);
    }
}
</style>