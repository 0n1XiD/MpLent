<template>
    <div class="input-field">
        <input
            v-if="type === 'tel'"
            v-maska data-maska="+7 (###) ###-##-##"
            v-model="proxyValue"
            :autocomplete="autocomplete"
            class="input"
            :min="min"
            :max="max"
            :class="[{'input_error': error }, setClass]"
            :type="type"
            :placeholder="placeholder"
            @input="$emit('input', $event.target.value)"
            @keyup="$emit('keyup', $event)"
        >
        <input
            v-else
            v-model="proxyValue"
            :autocomplete="autocomplete"
            class="input"
            :min="min"
            :max="max"
            :class="[{'input_error': error }, setClass]"
            :type="type"
            :placeholder="placeholder"
            :ref="refName"
            :id="id"
            @input="$emit('input', $event.target.value)"
            @keyup="$emit('keyup', $event)"
            @blur="$emit('blur', $event)"
        >
    </div>
</template>

<script>
import { vMaska } from "maska"
export default {
  directives: { maska: vMaska },
  name: 'InputField',
  props: {
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: null
    },
    value: {
      type: [
        String,
        Number
      ],
      default: ''
    },
    id: {
      type: String,
      default: null
    },
    refName: {
      type: String,
      default: null
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    error: {
      type: Boolean,
      default: false
    },
    errorText: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    // Input types
    default: {
      type: Boolean,
      default: false
    },
    password: {
      type: Boolean,
      default: false
    },
    search: {
      type: Boolean,
      default: false
    },
    searchBox: {
      type: Boolean,
      default: false
    },
    login: {
      type: Boolean,
      default: false
    },
    copy: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: null
    }
  },
  data: () => ({
    is_password: true,
    uuid: 0,
    password_icon_key: 10213
  }),
  computed: {
    setClass () {
      const typeInput = this.default
        ? 'default'
        : this.password
          ? 'password'
          : this.search
            ? 'search'
            : this.searchBox
              ? 'searchBox'
              : this.login
                ? 'login'
                : ''
      return 'input_' + typeInput
    },
    proxyValue: {
      get () { return this.value },
      set (newValue) {
        this.$emit('input', newValue)
        this.$emit('focus', newValue)
      },
      setBlur (newValue) {
        newValue = false
        this.$emit('blur.native', newValue)
      }
    }
  },
  beforeCreate () {
    this.uuid += 1
  },
}
</script>

<style lang="scss">

.input-field{
    position: relative;
    max-width: 100%;
    width: 100%;
    .name{
        margin-bottom: 4px;
        font-weight: var(--font-weight-semibold);
        font-size: var(--font-size);
        line-height: var(--line-height);
        color: var(--text-thirty-color);
    }
    .input{
        font-family: var(--font-family);
        display: flex;
        align-items: center;
        padding: var(--input-padding);
        width: 100%;
        height: var(--input-height);
        border: var(--input-border);
        border-radius: var(--input-border-radius);
        font-weight: var(--font-weight-regular);
        font-size: var(--font-size);
        line-height: var(--line-height);
        color: var(--text-placeholder-color);
        z-index: 1;
        background: none;
        &::placeholder{
            color: var(--text-placeholder-color);
        }

        &_default{
            background: $white;
        }
        
        &_login{
          color: var(--unnamed, #473366);
          font-weight: 400;
          background: $white;
          padding: 20px;
          width: 360px;
          height: 60px;
          border-radius: 7px;
          border: 1px solid rgba(0, 87, 184, 0.15);
          &:active, &:focus{
            border: 1px solid rgba(0, 87, 184, 0.30);
          }
          &::placeholder{
            color: var(--text-inactive-color)
          }
        }

        &_error{
          padding-left: 52px;
          background-image: url('@/assets/img/svg/error.svg');
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: left 20px center;
          border: 1px solid  #AD649B;
          &::placeholder{
            color: #AD649B
          }
        }

        &_search{
            padding: 0 18px;
            height: 40px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 5px;
            background: rgba(255, 255, 255, 0.15);
            background-image: url('@/assets/img/svg/search.svg');
            background-size: 20px;
            background-repeat: no-repeat;
            background-position: right 14px center;
            transition: all 0.5s ease;
            &:active, &:focus{
                border: var(--input-active-border);
            }
        }
    }
}
</style>