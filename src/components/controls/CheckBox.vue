<template>
    <div
        class="checkbox"
        :class="setClass"
    >
        <input
            :id="id || name"
            :name="name"
            :checked="internalValue"
            type="checkbox"
            class="custom-checkbox"
            @click="handleClick"
        >
        <label
            :for="id || name"
            class="checkbox__label"
        >
            <slot>
                {{ text }}
            </slot>
        </label>
    </div>
</template>

<script>

export default {
  name: 'CheckBox',
  props: {
    id: { type: String, default: null },
    name: { type: String, default: 'checkbox' },
    value: { type: Boolean, default: false },
    checked: { type: Boolean, default: false },
    text: { type: String, default: '' },

    // Checkbox types
    default: { type: Boolean, default: false },
  },
  data: () => ({
    internalValue: false
  }),
  computed: {
    setClass () {
      const typeCheckbox = this.default
        ? 'default'
          : ''
      return 'checkbox_' + typeCheckbox
    }
  },
  watch: {
    value (val) {
      this.internalValue = val
    },
    checked (val) {
      this.internalValue = val
    },
    internalValue (val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', val)
      }
    }
  },
  created () {
    this.internalValue = this.value
    if (this.$options.propsData && 'checked' in this.$options.propsData) {
      this.internalValue = this.$options.propsData.checked;
    }
  },
  methods: {
    handleClick (e) {
      this.$emit('click', e)
      if (!e.isPropagationStopped) {
        this.internalValue = e.target.checked
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--font-family);
    display: flex;
    align-items: center;
    appearance: none;
    transition: 0.3ms;

    .custom-checkbox{
        cursor: pointer;
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        &:checked + label::before {
            background: #f7eef9;
            background-repeat: no-repeat;
            background-position: center;
            background-size: 11px;
        }
        &:not(:checked) + label::before {
           
        }
    }

    label{
        cursor: pointer;
        color: rgba(112, 86, 123, 0.7);
        /* Body 13 regular */
        font-family: 'Graphik LCG';
        font-size: 13px;
        font-style: normal;
        font-weight: 400;
        line-height: 120%;
        font-weight: 400;
        line-height: 15.6px;
        display: flex;
        align-items: center;
        &::before{
            content: '';
            display: inline-block;
            margin-right: 8px;
            width: 18px;
            height: 18px;
            border-radius: 4px;
            background: #f7eef9;
        }
    }

    &_default{
        .custom-checkbox{
            &:checked + label::before {
                background-image: url('@/assets/img/svg/checkmark.svg');
            }
        }
    }

}
</style>