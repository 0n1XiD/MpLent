<template>
  <div class="authPage">
    <div class="authPage__title">
      <svg-icon
        name="logo"
        :width="128"
        :height="35"
      />
    </div>
    <form
      class="authPage__form"
      @submit="submitForm"
      method="post"
    >
      <div class="form">
        <div class="form__nav">
          <div class="nav">
            <div class="nav__item nav__item_active">
              Вход
            </div>
            <router-link class="nav__item" to="register">
              Регистрация
            </router-link>
          </div>
        </div>
        <div class="form__inputs">
          <input-field class="input" type="tel" :error="phoneNumberError" v-model="phoneNumber" login placeholder="Номер телефона"/>
          <input-field class="input" v-model="pass" :error="passError" login placeholder="Пароль"/>
        </div>
        <div class="form__submit">
          <CheckBox checked default>Запомнить меня</CheckBox>
          <ButtonCustom purple type="submit">Войти</ButtonCustom>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import InputField from '@/components/controls/InputField.vue'
import ButtonCustom from '@/components/controls/ButtonCustom.vue'
import CheckBox from '@/components/controls/CheckBox.vue'
import SvgIcon from '@/components/controls/SvgIcon.vue'

export default {
  name: 'LoginView',
  components: { 
    InputField,
    CheckBox,
    ButtonCustom,
    SvgIcon
  },
  data () {
    return {
      errors: [],
      phoneNumber: null,
      phoneNumberError: false,
      pass: null,
      passError: false,
    }
  },
  methods: {
    submitForm: function (e) {
      this.errors = [];
      console.log(this.phoneNumber)
      console.log(this.pass)
      if (!this.phoneNumber) {
        this.errors.push('Укажите телефон.');
        this.phoneNumberError = true;
      } 
      if (!this.pass) {
        this.errors.push('Укажите пароль.');
        this.passError = true;
      } else if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(this.pass)) {
        this.errors.push('Пароль должен быть не меньше 6 символов. В нем обязательно должны быть английские буквы в верхнем и нижнем регистре и цифры.');
        this.passError = true;
      }

      // Отправка серверу телефона-пароля пользователя, и в ответе должен получаться access token
      if (!this.errors.length) {
          const phone = this.phoneNumber.replace('+','')
          const resp = this.$mp.auth('login', {phone: phone, pass: this.pass})
          if (resp.error) this.errors.push('Ошибка сервера: '+resp.error)
          else {
            this.$mp.setAccessToken(resp.response)
            this.$router.push('/')
          }
      }

      e.preventDefault();
    }
  }
}
</script>

<style lang="scss">
.authPage{
  padding-top: 80px;
  display: flex;
  flex-direction: column;
  gap: 105px;
  align-items: center;
  justify-content: center;
  &__form{
    padding: 40px;
    width: 440px;
    max-width: 440px;
    height: 430px;
    border-radius: 7px;
    background: white;
    box-shadow: 0px 18px 90px 0px rgba(0, 39, 83, 0.15), 0px 4px 7px 0px rgba(0, 39, 83, 0.03);
    .form{
      &__nav{
        margin-bottom: 26px;
        .nav{
          display: flex;
          gap: 30px;
          &__item{
            font-size: 30px;
            line-height: 160%;
            color: #AD649B;
            border-bottom: 1px dashed #AD649B;
            &_active{
              color: #473366;
              border-bottom: 0;
            }
          }
        }
      }
      &__inputs{
        margin-bottom: 20px;
        .input{
          &:not(:last-child){
            margin-bottom: 10px;
          }
        }
      }
      &__submit{
        .btn{
          margin-top: 38px;
          background: #70567B;
          width: 128px;
          height: 60px;
          padding: 20px 40px 19px 40px;
        }
      }
    }
  }
}
</style>