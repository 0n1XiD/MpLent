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
              Регистрация
            </div>
            <router-link class="nav__item" to="login">
              Вход
            </router-link>
          </div>
        </div>
        <div class="form__inputs">
          <input-field class="input" v-model="name" :error="nameError" login placeholder="Ваше имя"/>
          <input-field class="input" type="tel" v-model="phoneNumber" :error="phoneNumberError" login placeholder="Номер телефона"/>
          <input-field class="input"  v-model="email" :error="emailError" login placeholder="E-mail"/>
          <input-field class="input"  v-model="pass1" :error="pass1Error" login placeholder="Придумайте Пароль"/>
          <input-field class="input" v-model="pass2" :error="pass2Error" login placeholder="Пароль еще раз"/>
        </div>
        <div class="form__submit">
          <CheckBox checked default><span>Соглашаюсь с <a class="link" href="#">условиями</a> обработки данных</span></CheckBox>
          <ButtonCustom purple type="submit">Зарегистрироваться</ButtonCustom>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import 'maz-ui/css/main.css'
import InputField from '@/components/controls/InputField.vue'
import ButtonCustom from '@/components/controls/ButtonCustom.vue'
import CheckBox from '@/components/controls/CheckBox.vue'
import SvgIcon from '@/components/controls/SvgIcon.vue'

export default {
  name: 'RegisterView',
  layout: 'auth-layout',
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
      pass1: null,
      pass1Error: false,
      pass2: null,
      pass2Error: false,
      email: null,
      emailError: false,
      name: null,
      nameError: false,
    }
  },
  methods: {
    submitForm: function (e) {
      this.errors = [];

      for (let k in this.$data) if (k!=='errors'&&!this[k]) {
        this.errors.push('Заполните все поля формы.');
        break;
      }

      if (!/^(?=.*\d)(?=.*[a-zA-Z])[a-zA-Z0-9]{7,}$/.test(this.pass1)) {
        this.errors.push('Пароль должен быть не меньше 6 символов. В нем обязательно должны быть английские буквы в верхнем и нижнем регистре и цифры.');
        this.pass1Error = true
      }
      
      if (!this.phoneNumber) {
        this.errors.push('Укажите телефон.');
        this.phoneNumberError = true;
      } 

      if (!this.name) {
        this.errors.push('Укажите имя.');
        this.nameError = true;
      } 

      if (this.pass1 !== this.pass2) {
        this.errors.push('Пароли должны быть одинаковыми.');
        this.pass2Error = true
      }

      if (!this.pass2) {
        this.errors.push('Введите повторно пароль.');
        this.pass2Error = true
      }

      if (!/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.email)) {
        this.errors.push('Email имеет не правильный формат');
        this.emailError = true
      }

      // Отправка серверу данных введенных пользователем, и в ответе должен получаться "ок", и переход на страницу подтверждения смс
      if (!this.errors.length) {
        const phone=this.phoneNumber.replace('+','')
        const resp = this.$mp.auth('register', {phone: phone, 'pass': this.pass1, name: this.name, email: this.email})
        if (resp.error) this.errors.push('Ошибка сервера: '+resp.error)
        else {
          localStorage.setItem('registerPhoneNumber', phone)
          this.$router.push('register-sms')
        }
      }

      e.preventDefault();
    }
  }
}
</script>

<style lang="scss" scoped>
.authPage{
  padding-top: 80px;
  &__form{
    padding: 40px;
    width: 440px;
    max-width: 440px;
    height: 630px;
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
        .link{
          color: #AD649B;
          text-decoration: underline;
        }
      }
    }
  }
}

</style>